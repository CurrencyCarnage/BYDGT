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

export const TEST_DRIVE_ROUTE: [number, number][] = [
  // Road-following route generated from OSRM for the showroom area.
  [41.684983, 44.891113],
  [41.684846, 44.890815],
  [41.685293, 44.890534],
  [41.686546, 44.892964],
  [41.68703, 44.894253],
  [41.687444, 44.896523],
  [41.687211, 44.896924],
  [41.686909, 44.896802],
  [41.686768, 44.895928],
  [41.686834, 44.895074],
  [41.687539, 44.894561],
  [41.687695, 44.894491],
  [41.687902, 44.894872],
  [41.687974, 44.8958],
  [41.688381, 44.895783],
  [41.688528, 44.896018],
  [41.688132, 44.897395],
  [41.688468, 44.901385],
  [41.688594, 44.901487],
  [41.690144, 44.901272],
  [41.6902, 44.901501],
  [41.688695, 44.90174],
  [41.689409, 44.906983],
  [41.689507, 44.907117],
  [41.690613, 44.906922],
  [41.690819, 44.906802],
  [41.69101, 44.90614],
  [41.692745, 44.905863],
  [41.69293, 44.908643],
  [41.693784, 44.908649],
  [41.693944, 44.908781],
  [41.694073, 44.909247],
  [41.694341, 44.90926],
  [41.695264, 44.909193],
  [41.696416, 44.908707],
];

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
