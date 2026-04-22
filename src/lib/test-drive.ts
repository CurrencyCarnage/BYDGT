// ── Test Drive booking types & data ──────────────────────────────────

export interface TestDriveModel {
  id: string;
  name: string;
  versions: { id: string; label: string }[];
}

export const testDriveModels: TestDriveModel[] = [
  {
    id: "seal-06",
    name: "BYD Seal 06",
    versions: [
      { id: "seal-06-dmi", label: "DM-i / PHEV" },
      { id: "seal-06-ev", label: "EV" },
    ],
  },
  {
    id: "sealion-06",
    name: "BYD Sealion 06",
    versions: [
      { id: "sealion-06-dmi", label: "DM-i / PHEV" },
      { id: "sealion-06-ev", label: "EV" },
    ],
  },
  {
    id: "yuan-up",
    name: "BYD Yuan Up",
    versions: [{ id: "yuan-up-ev", label: "EV" }],
  },
];

export const SHOWROOM = {
  name: "BYD Tbilisi" as const,
  address: "Kakheti Hwy 45A, Tbilisi, Georgia" as const,
  lat: 41.685144,
  lng: 44.89098,
} as const;

export const TIME_SLOTS = [
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
];

export interface TestDriveBooking {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  modelFamilyId: string;
  modelFamilyName: string;
  versionId: string;
  versionLabel: string;
  preferredDate: string;
  preferredTimeSlot: string;
  message?: string;
  language: "en" | "ka";
  dealershipLocation: typeof SHOWROOM;
  agreement: {
    accepted: boolean;
    acceptedAt: string;
    agreementVersion: "test-drive-v1";
    minAgeConfirmed: boolean;
    driversLicenseConfirmed: boolean;
    contactConsentConfirmed: boolean;
    safetyAcknowledgementConfirmed: boolean;
    ip?: string;
    userAgent?: string;
  };
  emailStatus?: {
    adminSent: boolean;
    customerSent: boolean;
    provider?: "resend" | "smtp";
    providerMessageId?: string;
  };
}
