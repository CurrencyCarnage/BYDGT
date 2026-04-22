// ── Email template builders for test-drive bookings ─────────────────
// These generate plain-text email bodies. Swap in HTML templates later
// once a mail provider (Resend / Nodemailer) is wired up.

import { TestDriveBooking } from "./test-drive";

const ADMIN_EMAIL = "currencycarnage@gmail.com";

export function getAdminEmail() {
  return ADMIN_EMAIL;
}

export function buildAdminTestDriveEmail(b: TestDriveBooking) {
  const subject = `New Test Drive Request — ${b.modelFamilyName} / ${b.versionLabel}`;
  const body = `
New Test Drive Booking
──────────────────────

Name:            ${b.fullName}
Phone:           ${b.phone}
Email:           ${b.email}
Model:           ${b.modelFamilyName}
Version:         ${b.versionLabel}
Preferred Date:  ${b.preferredDate}
Preferred Time:  ${b.preferredTimeSlot}
Message:         ${b.message || "—"}
Language:        ${b.language.toUpperCase()}

Agreement
─────────
Accepted:                 ${b.agreement.accepted ? "Yes" : "No"}
Min age confirmed:        ${b.agreement.minAgeConfirmed ? "Yes" : "No"}
Driver's license:         ${b.agreement.driversLicenseConfirmed ? "Yes" : "No"}
Contact consent:          ${b.agreement.contactConsentConfirmed ? "Yes" : "No"}
Safety acknowledgement:   ${b.agreement.safetyAcknowledgementConfirmed ? "Yes" : "No"}
Accepted at:              ${b.agreement.acceptedAt}

Location
────────
${b.dealershipLocation.name}
${b.dealershipLocation.address}

Booking ID: ${b.id}
Created:    ${b.createdAt}
`.trim();

  return { subject, body, to: ADMIN_EMAIL };
}

export function buildCustomerTestDriveEmail(
  b: TestDriveBooking,
  locale: "en" | "ka"
) {
  if (locale === "ka") {
    return {
      subject: "თქვენი BYD ტესტდრაივის მოთხოვნა მიღებულია",
      to: b.email,
      body: `
გმადლობთ BYD-ის მიმართ ინტერესისთვის. თქვენი ტესტდრაივის მოთხოვნა მიღებულია და ჩვენი გუნდი დაგიკავშირდებათ ხელმისაწვდომობის დასადასტურებლად.

თქვენი მოთხოვნა
────────────────
მოდელი:          ${b.modelFamilyName}
ვერსია:          ${b.versionLabel}
სასურველი თარიღი: ${b.preferredDate}
სასურველი დრო:   ${b.preferredTimeSlot}

შოურუმი
───────
BYD Tbilisi
Kakheti Hwy 45A, Tbilisi, Georgia

ეს წერილი ადასტურებს თქვენი მოთხოვნის მიღებას. საბოლოო დადასტურებას ჩვენი გუნდი გამოგიგზავნით დამატებით.
`.trim(),
    };
  }

  return {
    subject: "We received your BYD Test Drive request",
    to: b.email,
    body: `
Thank you for your interest in BYD. We have received your test drive request and our team will contact you to confirm availability.

Your request
─────────────
Model:           ${b.modelFamilyName}
Version:         ${b.versionLabel}
Preferred date:  ${b.preferredDate}
Preferred time:  ${b.preferredTimeSlot}

Showroom
────────
BYD Tbilisi
Kakheti Hwy 45A, Tbilisi, Georgia

This email confirms receipt of your request. Final confirmation will be provided by our team.
`.trim(),
  };
}
