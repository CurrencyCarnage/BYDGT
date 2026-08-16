import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { TestDriveBooking, SHOWROOM, getOfficialTrimLabel, testDriveModels, TIME_SLOTS } from "@/lib/test-drive";
import { buildAdminTestDriveEmail, buildCustomerTestDriveEmail } from "@/lib/email";
import { isSlotTaken, saveBooking } from "@/lib/bookings";
import { getMaxBookingIsoInTbilisi, getTodayIsoInTbilisi, validateIsoDate } from "@/lib/date";
import { normalizeE164Phone } from "@/lib/phone";
import { normalizeName, validateEmail, validateName } from "@/lib/validation";

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
    const messages = body.language === "ka"
      ? {
        missing: "სავალდებულო ველი აკლია",
        phone: "შეიყვანეთ სწორი ტელეფონის ნომერი",
        date: "აირჩიეთ დღევანდელი ან მომავალი სწორი თარიღი",
        agreement: "ყველა თანხმობის დადასტურება სავალდებულოა",
        product: "პროდუქტი არასწორია",
        version: "ვერსია არასწორია",
        trim: "კომპლექტაცია არასწორია",
        name: "შეიყვანეთ სახელი და გვარი (2–100 სიმბოლო, მხოლოდ ასოები)",
        email: "შეიყვანეთ სწორი ელ. ფოსტა",
        timeSlot: "აირჩიეთ სწორი დროის ინტერვალი",
        slotTaken: "ეს დრო უკვე დაკავებულია — აირჩიეთ სხვა",
      }
      : {
        missing: "Missing required field",
        phone: "Enter a valid phone number",
        date: "Choose a valid current or future date",
        agreement: "All agreement confirmations are required",
        product: "Invalid product",
        version: "Invalid version",
        trim: "Invalid trim",
        name: "Enter a full name (2–100 characters, letters only)",
        email: "Enter a valid email address",
        timeSlot: "Choose a valid time slot",
        slotTaken: "That time slot is already booked — please choose another",
      };

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
          { error: `${messages.missing}: ${field}` },
          { status: 400 }
        );
      }
    }

    const fullName = normalizeName(String(body.fullName));
    if (validateName(fullName, { requireFullName: true })) {
      return NextResponse.json({ error: messages.name }, { status: 400 });
    }

    const email = String(body.email).trim();
    if (validateEmail(email)) {
      return NextResponse.json({ error: messages.email }, { status: 400 });
    }

    const normalizedPhone = normalizeE164Phone(body.phone);
    if (!normalizedPhone) {
      return NextResponse.json({ error: messages.phone }, { status: 400 });
    }

    if (!validateIsoDate(body.preferredDate, getTodayIsoInTbilisi(), getMaxBookingIsoInTbilisi())) {
      return NextResponse.json({ error: messages.date }, { status: 400 });
    }

    if (!TIME_SLOTS.includes(body.preferredTimeSlot)) {
      return NextResponse.json({ error: messages.timeSlot }, { status: 400 });
    }

    if (await isSlotTaken(body.preferredDate, body.preferredTimeSlot)) {
      return NextResponse.json({ error: messages.slotTaken }, { status: 409 });
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
        { error: messages.agreement },
        { status: 400 }
      );
    }

    // ── Resolve model / version ─────────────────────────────────
    const family = testDriveModels.find((m) => m.id === body.modelFamilyId);
    if (!family) return NextResponse.json({ error: messages.product }, { status: 400 });

    const version = family.versions.find((v) => v.id === body.versionId);
    if (!version) return NextResponse.json({ error: messages.version }, { status: 400 });
    const trimId = typeof body.trimId === "string" && body.trimId.trim() ? body.trimId.trim() : undefined;
    const trimLabel = trimId ? getOfficialTrimLabel(version.id, trimId) : undefined;
    if (trimId && !trimLabel) {
      return NextResponse.json({ error: messages.trim }, { status: 400 });
    }

    // ── Build booking ───────────────────────────────────────────
    const now = new Date().toISOString();
    const ip  =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined;

    const booking: TestDriveBooking = {
      id: generateId(),
      createdAt: now,
      fullName,
      phone:     normalizedPhone.e164,
      phoneCountry: normalizedPhone.country,
      email,
      modelFamilyId:   family.id,
      modelFamilyName: family.name,
      versionId:    version.id,
      versionLabel: version.label,
      trimId,
      trimLabel,
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
    await saveBooking(booking);

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
