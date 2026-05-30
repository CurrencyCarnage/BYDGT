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
  address: "Aghmashenebeli Ave 216, Tbilisi, Georgia" as const,
  lat: 41.7058,
  lng: 44.7855,
} as const;

export const TEST_DRIVE_ROUTE: [number, number][] = [
  // Road-following route generated from OSRM for the Aghmashenebeli Ave 216 showroom area.
  [41.705761, 44.785482],
  [41.705978, 44.784601],
  [41.706104, 44.784088],
  [41.706945, 44.784616],
  [41.707317, 44.784847],
  [41.70708, 44.7855],
  [41.706823, 44.786148],
  [41.706544, 44.786823],
  [41.706415, 44.787085],
  [41.706172, 44.787479],
  [41.705912, 44.787953],
  [41.70568, 44.788335],
  [41.705348, 44.788882],
  [41.704756, 44.789699],
  [41.704137, 44.790237],
  [41.703812, 44.790415],
  [41.704172, 44.791099],
  [41.704618, 44.791761],
  [41.704815, 44.791891],
  [41.705437, 44.791645],
  [41.70604, 44.791411],
  [41.706468, 44.791295],
  [41.706805, 44.791055],
  [41.707064, 44.791049],
  [41.707166, 44.791348],
  [41.707189, 44.791596],
  [41.707343, 44.791844],
  [41.707512, 44.792073],
  [41.708055, 44.793427],
  [41.708164, 44.793806],
  [41.708494, 44.793237],
  [41.70881, 44.792887],
  [41.709364, 44.792303],
  [41.709882, 44.791749],
  [41.710261, 44.791379],
  [41.709679, 44.791973],
  [41.708583, 44.793142],
  [41.708196, 44.793927],
  [41.708453, 44.794525],
  [41.708719, 44.795179],
  [41.709246, 44.796457],
  [41.709563, 44.797272],
  [41.709125, 44.797619],
  [41.70877, 44.797892],
  [41.708368, 44.798194],
  [41.707951, 44.798507],
  [41.708294, 44.799359],
  [41.707751, 44.798532],
  [41.707166, 44.797118],
  [41.706634, 44.795819],
  [41.706131, 44.794663],
  [41.706546, 44.794449],
  [41.707739, 44.793856],
  [41.708061, 44.793716],
  [41.708275, 44.793695],
  [41.708055, 44.793427],
  [41.707512, 44.792073],
  [41.707064, 44.791049],
  [41.706805, 44.791055],
  [41.706468, 44.791295],
  [41.70604, 44.791411],
  [41.705027, 44.79181],
  [41.7048, 44.791755],
  [41.704372, 44.792245],
  [41.704003, 44.792628],
  [41.703543, 44.793431],
  [41.703402, 44.794205],
  [41.703237, 44.794958],
  [41.702829, 44.795508],
  [41.702575, 44.795701],
  [41.702029, 44.794962],
  [41.701732, 44.794553],
  [41.702363, 44.793782],
  [41.702876, 44.793135],
  [41.703528, 44.792357],
  [41.704259, 44.791388],
  [41.704368, 44.791106],
  [41.704371, 44.790853],
  [41.704329, 44.790096],
  [41.704957, 44.78948],
  [41.705451, 44.788712],
  [41.705912, 44.787953],
  [41.706118, 44.787569],
  [41.705355, 44.786778],
  [41.705453, 44.786265],
  [41.705611, 44.785941],
  [41.705761, 44.785482],
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
