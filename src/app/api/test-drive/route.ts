import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Resend } from "resend";
import { TestDriveBooking, SHOWROOM, testDriveModels } from "@/lib/test-drive";
import { buildAdminTestDriveEmail, buildCustomerTestDriveEmail } from "@/lib/email";

const BOOKINGS_DIR = path.join(process.cwd(), "content", "bookings");

function generateId() {
  return `td-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function sendEmails(booking: TestDriveBooking) {
  const apiKey = process.env.RESEND_API_KEY;

  const adminPayload  = buildAdminTestDriveEmail(booking);
  const customerPayload = buildCustomerTestDriveEmail(booking, booking.language);

  // ── No key set yet → log only, still succeed ────────────────
  if (!apiKey) {
    console.log("[email] RESEND_API_KEY not set — logging only");
    console.log("[email] ADMIN →", adminPayload.subject);
    console.log("[email] CUSTOMER →", customerPayload.subject);
    return { adminSent: false, customerSent: false };
  }

  const resend = new Resend(apiKey);
  const from   = process.env.RESEND_FROM   ?? "onboarding@resend.dev";
  const adminTo = process.env.RESEND_ADMIN_EMAIL ?? adminPayload.to;

  let adminSent   = false;
  let customerSent = false;

  try {
    await resend.emails.send({
      from,
      to:      adminTo,
      subject: adminPayload.subject,
      text:    adminPayload.body,
    });
    adminSent = true;
  } catch (err) {
    console.error("[email] Admin send failed:", err);
  }

  try {
    await resend.emails.send({
      from,
      to:      customerPayload.to,
      subject: customerPayload.subject,
      text:    customerPayload.body,
    });
    customerSent = true;
  } catch (err) {
    console.error("[email] Customer send failed:", err);
  }

  return { adminSent, customerSent };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Validate required fields ────────────────────────────────
    const required = [
      "fullName",
      "phone",
      "email",
      "modelFamilyId",
      "versionId",
      "preferredDate",
      "preferredTimeSlot",
    ] as const;

    for (const field of required) {
      if (!body[field] || typeof body[field] !== "string" || !body[field].trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // ── Validate agreement ──────────────────────────────────────
    const { agreement } = body;
    if (
      !agreement?.accepted ||
      !agreement.minAgeConfirmed ||
      !agreement.driversLicenseConfirmed ||
      !agreement.contactConsentConfirmed ||
      !agreement.safetyAcknowledgementConfirmed
    ) {
      return NextResponse.json(
        { error: "All agreement confirmations are required" },
        { status: 400 }
      );
    }

    // ── Resolve model / version ─────────────────────────────────
    const family = testDriveModels.find((m) => m.id === body.modelFamilyId);
    if (!family) return NextResponse.json({ error: "Invalid model" }, { status: 400 });

    const version = family.versions.find((v) => v.id === body.versionId);
    if (!version) return NextResponse.json({ error: "Invalid version" }, { status: 400 });

    // ── Build booking ───────────────────────────────────────────
    const now = new Date().toISOString();
    const ip  =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined;

    const booking: TestDriveBooking = {
      id: generateId(),
      createdAt: now,
      fullName:  body.fullName.trim(),
      phone:     body.phone.trim(),
      email:     body.email.trim(),
      modelFamilyId:   family.id,
      modelFamilyName: family.name,
      versionId:    version.id,
      versionLabel: version.label,
      preferredDate:     body.preferredDate,
      preferredTimeSlot: body.preferredTimeSlot,
      message:  body.message?.trim() || undefined,
      language: body.language === "ka" ? "ka" : "en",
      dealershipLocation: SHOWROOM,
      agreement: {
        accepted:    true,
        acceptedAt:  agreement.acceptedAt || now,
        agreementVersion: "test-drive-v1",
        minAgeConfirmed:              true,
        driversLicenseConfirmed:      true,
        contactConsentConfirmed:      true,
        safetyAcknowledgementConfirmed: true,
        ip,
        userAgent: req.headers.get("user-agent") || undefined,
      },
    };

    // ── Persist ─────────────────────────────────────────────────
    await fs.mkdir(BOOKINGS_DIR, { recursive: true });
    await fs.writeFile(
      path.join(BOOKINGS_DIR, `${booking.id}.json`),
      JSON.stringify(booking, null, 2),
      "utf-8"
    );

    // ── Send emails ─────────────────────────────────────────────
    const emailStatus = await sendEmails(booking);

    return NextResponse.json({
      success:   true,
      bookingId: booking.id,
      emailStatus,
    });
  } catch (err) {
    console.error("Test drive submission error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
