"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";

type LocaleCode = "en" | "ka";
type Bilingual = { en: string; ka: string };
type PaintOption = { id: string; label: Bilingual; hex: string };
type WheelOption = { id: string; label: Bilingual; design: 0 | 1 | 2 | 3 };
type InteriorOption = { id: string; label: Bilingual; hex: string };
type AccentOption = { id: string; label: Bilingual; hex: string };

type DesignData = {
  paint: PaintOption[];
  wheels: WheelOption[];
  interior: InteriorOption[];
  accents: AccentOption[];
};

type VersionSpecs = {
  totalRange: string;
  evRange: string;
  power: string;
  torque: string;
  acceleration: string;
  topSpeed: string;
  battery: string;
  drive: string;
  charging: string;
};

type ModelVersion = {
  id: string;
  label: "DM-i" | "EV";
  type: "PHEV" | "EV";
  summary: Bilingual;
  image: string;
  specs: VersionSpecs;
  design: DesignData;
};

type ModelFamily = {
  id: string;
  name: string;
  category: Bilingual;
  versions: ModelVersion[];
};

type SlotVersion = ModelVersion & { familyName: string; category: Bilingual };

const t = <T extends Bilingual>(value: T, locale: string) =>
  locale === "ka" ? value.ka : value.en;

const SEAL_PAINT: PaintOption[] = [
  { id: "midnight-black", label: { en: "Midnight Black", ka: "Midnight Black" }, hex: "#1A1A1A" },
  { id: "arctic-white", label: { en: "Arctic White", ka: "Arctic White" }, hex: "#F1F1F1" },
  { id: "titanium-silver", label: { en: "Titanium Silver", ka: "Titanium Silver" }, hex: "#A7A7B8" },
  { id: "sapphire-blue", label: { en: "Sapphire Blue", ka: "Sapphire Blue" }, hex: "#274C8A" },
  { id: "burgundy-red", label: { en: "Burgundy Red", ka: "Burgundy Red" }, hex: "#7A1F33" },
];

const SEALION_PAINT: PaintOption[] = [
  { id: "midnight-black", label: { en: "Midnight Black", ka: "Midnight Black" }, hex: "#1A1A1A" },
  { id: "arctic-white", label: { en: "Arctic White", ka: "Arctic White" }, hex: "#F1F1F1" },
  { id: "titanium-silver", label: { en: "Titanium Silver", ka: "Titanium Silver" }, hex: "#A7A7B8" },
  { id: "sapphire-blue", label: { en: "Sapphire Blue", ka: "Sapphire Blue" }, hex: "#274C8A" },
  { id: "forest-green", label: { en: "Forest Green", ka: "Forest Green" }, hex: "#365E35" },
  { id: "burgundy-red", label: { en: "Burgundy Red", ka: "Burgundy Red" }, hex: "#7A1F33" },
];

const YUAN_PAINT: PaintOption[] = [
  { id: "midnight-black", label: { en: "Midnight Black", ka: "Midnight Black" }, hex: "#1A1A1A" },
  { id: "arctic-white", label: { en: "Arctic White", ka: "Arctic White" }, hex: "#F1F1F1" },
  { id: "cosmos-grey", label: { en: "Cosmos Grey", ka: "Cosmos Grey" }, hex: "#8A8B98" },
  { id: "aurora-blue", label: { en: "Aurora Blue", ka: "Aurora Blue" }, hex: "#214D90" },
  { id: "crimson-red", label: { en: "Crimson Red", ka: "Crimson Red" }, hex: "#8F2232" },
];

const SEAL_WHEELS: WheelOption[] = [
  { id: "18-comfort", label: { en: '18" Comfort', ka: '18" Comfort' }, design: 0 },
  { id: "19-sport", label: { en: '19" Sport', ka: '19" Sport' }, design: 2 },
];

const SEALION_WHEELS: WheelOption[] = [
  { id: "18-comfort", label: { en: '18" Comfort', ka: '18" Comfort' }, design: 0 },
  { id: "19-sport", label: { en: '19" Sport', ka: '19" Sport' }, design: 2 },
  { id: "20-premium", label: { en: '20" Premium', ka: '20" Premium' }, design: 3 },
];

const YUAN_WHEELS: WheelOption[] = [
  { id: "17-standard", label: { en: '17" Standard', ka: '17" Standard' }, design: 0 },
  { id: "18-sport", label: { en: '18" Sport', ka: '18" Sport' }, design: 1 },
];

const SEAL_INTERIOR: InteriorOption[] = [
  { id: "black", label: { en: "Black", ka: "Black" }, hex: "#1D1D1D" },
  { id: "beige", label: { en: "Beige", ka: "Beige" }, hex: "#C9AE88" },
];

const SEALION_INTERIOR: InteriorOption[] = [
  { id: "black", label: { en: "Black", ka: "Black" }, hex: "#1D1D1D" },
  { id: "dark-grey", label: { en: "Dark Grey", ka: "Dark Grey" }, hex: "#434348" },
  { id: "beige", label: { en: "Beige", ka: "Beige" }, hex: "#C9AE88" },
];

const YUAN_INTERIOR: InteriorOption[] = [
  { id: "black", label: { en: "Black", ka: "Black" }, hex: "#1D1D1D" },
];

const SEAL_ACCENTS: AccentOption[] = [
  { id: "dark-chrome", label: { en: "Dark Chrome", ka: "Dark Chrome" }, hex: "#2C2E32" },
];

const SEALION_ACCENTS: AccentOption[] = [
  { id: "dark-chrome", label: { en: "Dark Chrome", ka: "Dark Chrome" }, hex: "#2C2E32" },
  { id: "silver-chrome", label: { en: "Silver Chrome", ka: "Silver Chrome" }, hex: "#8F939B" },
];

const YUAN_ACCENTS: AccentOption[] = [
  { id: "dark-chrome", label: { en: "Dark Chrome", ka: "Dark Chrome" }, hex: "#2C2E32" },
];

const FAMILIES: ModelFamily[] = [
  {
    id: "seal-06",
    name: "BYD Seal 06",
    category: { en: "Sedan", ka: "სედანი" },
    versions: [
      {
        id: "seal-06-dmi",
        label: "DM-i",
        type: "PHEV",
        summary: {
          en: "Long-range plug-in hybrid sedan with low everyday running cost.",
          ka: "გრძელი სავალის plug-in hybrid სედანი დაბალი ყოველდღიური ხარჯით.",
        },
        image: "/images/models/seal-06-dmi/hero.jpg",
        specs: {
          totalRange: "up to 1,505 km",
          evRange: "up to 140 km",
          power: "156 kW / 210 HP",
          torque: "N/A",
          acceleration: "8.5 s",
          topSpeed: "180 km/h",
          battery: "10 - 19 kWh",
          drive: "FWD",
          charging: "N/A",
        },
        design: {
          paint: SEAL_PAINT,
          wheels: SEAL_WHEELS,
          interior: SEAL_INTERIOR,
          accents: SEAL_ACCENTS,
        },
      },
      {
        id: "seal-06-ev",
        label: "EV",
        type: "EV",
        summary: {
          en: "Clean electric sedan with city-first efficiency and simple ownership.",
          ka: "სუფთა ელექტრო სედანი ქალაქური ეფექტიანობით და მარტივი ფლობით.",
        },
        image: "/images/models/seal-06-dmi/hero.jpg",
        specs: {
          totalRange: "425 km WLTC",
          evRange: "425 km",
          power: "95 kW / 127 HP",
          torque: "220 Nm",
          acceleration: "10.9 s",
          topSpeed: "N/A",
          battery: "56.64 kWh",
          drive: "FWD",
          charging: "DC 65 kW / AC 7 kW",
        },
        design: {
          paint: SEAL_PAINT,
          wheels: SEAL_WHEELS,
          interior: SEAL_INTERIOR,
          accents: SEAL_ACCENTS,
        },
      },
    ],
  },
  {
    id: "sealion-06",
    name: "BYD Sealion 06",
    category: { en: "SUV", ka: "SUV" },
    versions: [
      {
        id: "sealion-06-dmi",
        label: "DM-i",
        type: "PHEV",
        summary: {
          en: "Family SUV with hybrid efficiency and available AWD performance.",
          ka: "ოჯახური SUV ჰიბრიდული ეფექტიანობით და ხელმისაწვდომი AWD ვერსიით.",
        },
        image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
        specs: {
          totalRange: "up to 1,080 km",
          evRange: "92 km (FWD) / 81 km (AWD)",
          power: "160 kW / 214 HP (FWD)",
          torque: "300 Nm (FWD) / 550 Nm (AWD)",
          acceleration: "8.5 s (FWD) / 5.9 s (AWD)",
          topSpeed: "169 - 179 km/h",
          battery: "18.3 - 32 kWh",
          drive: "FWD / AWD",
          charging: "N/A",
        },
        design: {
          paint: SEALION_PAINT,
          wheels: SEALION_WHEELS,
          interior: SEALION_INTERIOR,
          accents: SEALION_ACCENTS,
        },
      },
      {
        id: "sealion-06-ev",
        label: "EV",
        type: "EV",
        summary: {
          en: "Electric SUV with longer-range options and a more premium cabin package.",
          ka: "ელექტრო SUV დიდი სავალის არჩევანით და უფრო პრემიუმ ინტერიერით.",
        },
        image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
        specs: {
          totalRange: "420 - 500 km WLTP",
          evRange: "420 - 500 km",
          power: "160 kW / 214 HP",
          torque: "310 - 330 Nm",
          acceleration: "9.3 - 9.6 s",
          topSpeed: "175 km/h",
          battery: "71.8 - 87 kWh",
          drive: "FWD",
          charging: "DC 150 kW",
        },
        design: {
          paint: SEALION_PAINT,
          wheels: SEALION_WHEELS,
          interior: SEALION_INTERIOR,
          accents: SEALION_ACCENTS,
        },
      },
    ],
  },
  {
    id: "yuan-up",
    name: "BYD Yuan Up",
    category: { en: "Compact SUV / EV", ka: "კომპაქტური SUV / EV" },
    versions: [
      {
        id: "yuan-up-ev",
        label: "EV",
        type: "EV",
        summary: {
          en: "Compact electric SUV built for city use, easy charging, and youthful design.",
          ka: "კომპაქტური ელექტრო SUV ქალაქისთვის, მარტივი დამუხტვით და ახალგაზრდული დიზაინით.",
        },
        image: "/images/models/yuan-up-ev/hero.jpg",
        specs: {
          totalRange: "380 km NEDC",
          evRange: "380 km",
          power: "130 kW / 174 HP",
          torque: "290 Nm",
          acceleration: "7.9 s",
          topSpeed: "N/A",
          battery: "45 kWh (Blade LFP)",
          drive: "FWD",
          charging: "DC 65 kW / AC 5.6 kW",
        },
        design: {
          paint: YUAN_PAINT,
          wheels: YUAN_WHEELS,
          interior: YUAN_INTERIOR,
          accents: YUAN_ACCENTS,
        },
      },
      {
        id: "yuan-up-dmi",
        label: "DM-i",
        type: "PHEV",
        summary: {
          en: "Smart compact hybrid SUV focused on efficiency and everyday practicality.",
          ka: "კომპაქტური ჰიბრიდული SUV ეფექტიანობაზე და ყოველდღიურ პრაქტიკულობაზე ორიენტაციით.",
        },
        image: "/images/models/yuan-up-dmi/hero.jpg",
        specs: {
          totalRange: "1,100 km",
          evRange: "80 km",
          power: "110 kW / 150 HP",
          torque: "N/A",
          acceleration: "8.9 s",
          topSpeed: "170 km/h",
          battery: "12.9 kWh",
          drive: "FWD",
          charging: "N/A",
        },
        design: {
          paint: YUAN_PAINT,
          wheels: YUAN_WHEELS,
          interior: YUAN_INTERIOR,
          accents: YUAN_ACCENTS,
        },
      },
    ],
  },
];

const ALL_VERSIONS: SlotVersion[] = FAMILIES.flatMap((family) =>
  family.versions.map((version) => ({
    ...version,
    familyName: family.name,
    category: family.category,
  }))
);

const SPEC_ROWS: {
  key: string;
  label: Bilingual;
  getValue: (version: SlotVersion, locale: LocaleCode) => string;
}[] = [
  {
    key: "powertrain",
    label: { en: "Powertrain", ka: "ძრავის ტიპი" },
    getValue: (version, locale) =>
      version.type === "EV"
        ? locale === "ka"
          ? "ელექტრო"
          : "Electric"
        : "Plug-in Hybrid",
  },
  {
    key: "bodyType",
    label: { en: "Body Type", ka: "ძარის ტიპი" },
    getValue: (version, locale) => t(version.category, locale),
  },
  {
    key: "totalRange",
    label: { en: "Total Range", ka: "ჯამური მანძილი" },
    getValue: (version) => version.specs.totalRange,
  },
  {
    key: "evRange",
    label: { en: "EV Range", ka: "ელექტრო სავალი" },
    getValue: (version) => version.specs.evRange,
  },
  {
    key: "power",
    label: { en: "Power", ka: "სიმძლავრე" },
    getValue: (version) => version.specs.power,
  },
  {
    key: "torque",
    label: { en: "Torque", ka: "მომენტი" },
    getValue: (version) => version.specs.torque,
  },
  {
    key: "acceleration",
    label: { en: "0-100 km/h", ka: "0-100 კმ/სთ" },
    getValue: (version) => version.specs.acceleration,
  },
  {
    key: "topSpeed",
    label: { en: "Top Speed", ka: "მაქს. სიჩქარე" },
    getValue: (version) => version.specs.topSpeed,
  },
  {
    key: "battery",
    label: { en: "Battery", ka: "ბატარეა" },
    getValue: (version) => version.specs.battery,
  },
  {
    key: "drive",
    label: { en: "Drive", ka: "წამყვანი" },
    getValue: (version) => version.specs.drive,
  },
  {
    key: "charging",
    label: { en: "Charging", ka: "დამუხტვა" },
    getValue: (version) => version.specs.charging,
  },
];

function WheelSwatch({ design, title }: { design: 0 | 1 | 2 | 3; title: string }) {
  const spokes =
    design === 0
      ? [0, 72, 144, 216, 288]
      : design === 1
        ? [0, 72, 144, 216, 288]
        : design === 2
          ? [0, 36, 72, 108, 144, 180, 216, 252, 288, 324]
          : [0, 51.4, 102.9, 154.3, 205.7, 257.1, 308.6];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        title={title}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] bg-[radial-gradient(circle_at_30%_30%,#595959,#171717_70%)] shadow-[inset_0_1px_3px_rgba(255,255,255,0.12)]"
      >
        <svg viewBox="0 0 44 44" className="h-9 w-9">
          <circle cx="22" cy="22" r="19" fill="none" stroke="#101010" strokeWidth="3" />
          <circle cx="22" cy="22" r="15.5" fill="none" stroke="#525252" strokeWidth="1" />
          {spokes.map((angle) => (
            <line
              key={angle}
              x1="22"
              y1="22"
              x2="22"
              y2={design === 2 ? "8" : "9.5"}
              stroke="#737373"
              strokeWidth={design === 2 ? 1.3 : 2}
              strokeLinecap="round"
              transform={`rotate(${angle} 22 22)`}
            />
          ))}
          <circle cx="22" cy="22" r="4.5" fill="#262626" stroke="#6A6A6A" strokeWidth="1" />
        </svg>
      </div>
      <span className="text-[10px] uppercase tracking-[0.12em] text-[#686D71]">{title}</span>
    </div>
  );
}

function SwatchDot({ hex, title }: { hex: string; title: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        title={title}
        className="h-11 w-11 rounded-full border border-[#C7CDD0] shadow-[inset_0_1px_4px_rgba(0,0,0,0.08)]"
        style={{ backgroundColor: hex }}
      />
      <span className="text-[10px] uppercase tracking-[0.12em] text-[#686D71]">{title}</span>
    </div>
  );
}

interface ModelDropdownProps {
  selected: SlotVersion | null;
  onSelect: (version: SlotVersion) => void;
  onClear: () => void;
  locale: LocaleCode;
  blockedIds: string[];
  placeholder: string;
  clearLabel: string;
  compact?: boolean;
}

function ModelDropdown({
  selected,
  onSelect,
  onClear,
  locale,
  blockedIds,
  placeholder,
  clearLabel,
  compact,
}: ModelDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between text-left transition-all duration-200 ${
          compact
            ? `min-h-[48px] gap-1.5 rounded-xl border px-2 py-1.5 ${
                open
                  ? "border-byd-red/40 bg-white shadow-[0_10px_24px_rgba(24,28,32,0.10)]"
                  : "border-[#DDE1E3] bg-[#FBFBFA]"
              }`
            : `min-h-[68px] gap-3 rounded-2xl border px-4 py-3 ${
                open
                  ? "border-byd-red/40 bg-white shadow-[0_14px_30px_rgba(24,28,32,0.12)]"
                  : "border-[#DDE1E3] bg-[#FBFBFA] hover:border-[#BFC5C8] hover:bg-white"
              }`
        }`}
      >
        {selected ? (
          <div className={`flex min-w-0 items-center ${compact ? "gap-1.5" : "gap-3"}`}>
            <div
              className={`relative shrink-0 overflow-hidden bg-[#ECEFF1] ${
                compact
                  ? "h-8 w-10 rounded-md"
                  : "h-10 w-12 rounded-lg"
              }`}
            >
              <Image
                src={selected.image}
                alt={selected.familyName}
                fill
                sizes={compact ? "40px" : "48px"}
                className="object-cover"
                quality={70}
              />
            </div>
            <div className="min-w-0">
              <p
                className={`truncate font-semibold text-[#252728] ${
                  compact ? "text-[11px]" : "text-[15px]"
                }`}
              >
                {selected.familyName}
              </p>
              {!compact && (
                <p className="truncate text-xs text-[#686D71]">
                  {selected.label} / {t(selected.category, locale)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className={`flex min-w-0 items-center ${compact ? "gap-1.5" : "gap-3"}`}>
            <div
              className={`flex shrink-0 items-center justify-center border border-dashed border-[#C7CDD0] bg-[#F0F2F3] ${
                compact
                  ? "h-8 w-10 rounded-md"
                  : "h-10 w-12 rounded-lg"
              }`}
            >
              <svg
                className={`text-[#8A9094] ${compact ? "h-3.5 w-3.5" : "h-5 w-5"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            {!compact && (
              <p className="text-[14px] text-[#686D71]">{placeholder}</p>
            )}
          </div>
        )}
        <svg
          className={`shrink-0 text-[#686D71] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${compact ? "h-3 w-3" : "h-4 w-4"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-[#DDE1E3] bg-white shadow-[0_24px_60px_rgba(24,28,32,0.18)]">
          {selected && (
            <button
              type="button"
              onClick={() => {
                onClear();
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 border-b border-[#EEF0F1] px-4 py-3 text-left text-sm font-medium text-byd-red transition-colors hover:bg-byd-red/[0.06]"
            >
              <span className="flex h-9 w-11 shrink-0 items-center justify-center rounded-md border border-byd-red/20 bg-byd-red/[0.06]">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
              <span className="min-w-0 flex-1 truncate">{clearLabel}</span>
            </button>
          )}
          {FAMILIES.map((family) => (
            <div key={family.id} className="border-t border-[#EEF0F1] first:border-t-0">
              <p className="px-4 pb-2 pt-3 text-[10px] uppercase tracking-[0.18em] text-[#7A8080]">
                {family.name}
              </p>
              {family.versions.map((version) => {
                const option = ALL_VERSIONS.find((item) => item.id === version.id)!;
                const isSelected = selected !== null && option.id === selected.id;
                const isBlocked = blockedIds.includes(option.id) && !isSelected;

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={isBlocked}
                    onClick={() => {
                      onSelect(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? "bg-byd-red/[0.08]"
                        : isBlocked
                          ? "cursor-not-allowed opacity-40"
                          : "hover:bg-[#F7F8F8]"
                    }`}
                  >
                    <div className="relative h-9 w-11 shrink-0 overflow-hidden rounded-md bg-[#ECEFF1]">
                      <Image
                        src={option.image}
                        alt={option.familyName}
                        fill
                        sizes="44px"
                        className="object-cover"
                        quality={60}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#252728]">
                        {option.familyName}
                      </p>
                      <p className="truncate text-[11px] text-[#686D71]">
                        {option.label} / {t(option.category, locale)}
                      </p>
                    </div>
                    {isSelected && (
                      <svg
                        className="h-4 w-4 shrink-0 text-byd-red"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.4}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompareGrid() {
  const locale = useLocale() as LocaleCode;
  const [slots, setSlots] = useState<
    [SlotVersion | null, SlotVersion | null, SlotVersion | null]
  >([null, null, null]);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const labels = {
    differs: locale === "ka" ? "განსხვავდება" : "Differs",
    pricing: locale === "ka" ? "ფასი" : "Price",
    pricingValue:
      locale === "ka" ? "ფასისთვის დაგვიკავშირდით" : "Contact for pricing",
    designTitle:
      locale === "ka" ? "დიზაინის ვარიანტები" : "Design Options",
    testDrive: locale === "ka" ? "ტესტ დრაივი" : "Test Drive",
    viewCatalog: locale === "ka" ? "კატალოგი" : "View Catalog",
    selectModel:
      locale === "ka" ? "აირჩიეთ მოდელი" : "Select a model",
    clearModel:
      locale === "ka" ? "მოდელის წაშლა" : "Remove model",
    emptySlot:
      locale === "ka"
        ? "მოდელი არ არის არჩეული"
        : "No model selected",
  };

  const normalizeValue = (value: string) =>
    value.replace(/\s+/g, " ").trim().toLowerCase();

  /* Only compute spec rows when at least 2 models selected */
  const filledSlots = slots.filter(
    (s): s is SlotVersion => s !== null
  );
  const hasComparison = filledSlots.length >= 2;

  const specRows = hasComparison
    ? SPEC_ROWS.map((row) => {
        const values = slots.map((slot) =>
          slot ? row.getValue(slot, locale) : null
        );
        const filled = values.filter((v): v is string => v !== null);
        const hasDifference =
          filled.length >= 2 &&
          new Set(filled.map(normalizeValue)).size > 1;
        return { ...row, values, hasDifference };
      })
    : [];

  const updateSlot = (index: number, version: SlotVersion | null) => {
    setSlots((prev) => {
      const next = [...prev] as [
        SlotVersion | null,
        SlotVersion | null,
        SlotVersion | null,
      ];
      next[index] = version;
      return next;
    });
  };

  const blockedFor = (index: number) =>
    slots
      .filter((s, i): s is SlotVersion => s !== null && i !== index)
      .map((s) => s.id);

  const diffCount = specRows.filter((r) => r.hasDifference).length;

  return (
    <div className="pb-16 pt-4 md:pt-8">
      {/* ── Mobile: 3 compact thumbnails in one row ── */}
      <div className="sticky top-[5rem] z-30 bg-byd-dark/95 backdrop-blur md:hidden">
        <div className="section-container">
          <div
            className={`border border-b-0 border-[#DDE1E3] bg-[#F7F8F8] px-3 py-2 transition-[border-radius] duration-200 ${
              hasScrolled ? "rounded-t-none" : "rounded-t-[1rem]"
            }`}
          >
            <div className="grid grid-cols-3 gap-1.5">
            {slots.map((slot, i) => (
              <ModelDropdown
                key={`m-${i}`}
                selected={slot}
                onSelect={(v) => updateSlot(i, v)}
                onClear={() => updateSlot(i, null)}
                locale={locale}
                blockedIds={blockedFor(i)}
                placeholder={labels.selectModel}
                clearLabel={labels.clearModel}
                compact
              />
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop: 3 equal selectors ── */}
      <div className="sticky top-[5rem] z-30 hidden bg-byd-dark/95 backdrop-blur md:block">
        <div className="section-container">
          <div
            className={`border border-b-0 border-[#DDE1E3] bg-[#F7F8F8] px-4 py-3 transition-[border-radius] duration-200 ${
              hasScrolled ? "rounded-t-none" : "rounded-t-[1.25rem]"
            }`}
          >
            <div className="grid grid-cols-3 gap-3">
            {slots.map((slot, i) => (
              <ModelDropdown
                key={`d-${i}`}
                selected={slot}
                onSelect={(v) => updateSlot(i, v)}
                onClear={() => updateSlot(i, null)}
                locale={locale}
                blockedIds={blockedFor(i)}
                placeholder={labels.selectModel}
                clearLabel={labels.clearModel}
              />
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Comparison matrix ── */}
      <div className="section-container">
        <div className="overflow-hidden rounded-b-[1rem] border-t-0 content-surface md:rounded-b-[1.25rem]">
          {/* Model card headers — pure 3-column */}
          <div className="grid grid-cols-3 border-b border-[#DDE1E3]">
            {slots.map((slot, i) => (
              <div
                key={`card-${i}`}
                className={`flex flex-col p-3 md:p-5 ${
                  i < 2 ? "border-r border-[#DDE1E3]" : ""
                }`}
              >
                {slot ? (
                  <>
                    <div className="relative mb-2 aspect-[16/9] overflow-hidden rounded-md bg-[#ECEFF1] md:mb-4 md:rounded-lg">
                      <Image
                        src={slot.image}
                        alt={slot.familyName}
                        fill
                        sizes="(min-width:1024px) 30vw, 33vw"
                        className="object-cover"
                        quality={82}
                      />
                    </div>
                    <span
                      className={`mb-1 inline-flex self-start rounded px-1.5 py-px text-[8px] font-bold uppercase tracking-[0.14em] md:mb-2 md:px-2 md:py-0.5 md:text-[10px] ${
                        slot.type === "EV"
                          ? "bg-badge-ev-bg text-badge-ev"
                          : "bg-badge-phev-bg text-badge-phev"
                      }`}
                    >
                      {slot.type}
                    </span>
                    <h3 className="text-[0.85rem] font-semibold leading-tight text-[#252728] md:text-[1.25rem] lg:text-[1.4rem]">
                      {slot.familyName}
                    </h3>
                    <p className="mt-0.5 hidden text-[13px] text-[#686D71] md:block">
                      {slot.label} / {t(slot.category, locale)}
                    </p>
                    <p className="mt-1 hidden text-[13.5px] leading-[1.6] text-[#4E5356] md:mt-3 md:block">
                      {t(slot.summary, locale)}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2 md:gap-2 md:pt-5">
                      <Link
                        href={`/${locale}/booking`}
                        className="btn-primary min-h-[30px] px-2.5 text-[9px] md:min-h-[38px] md:px-4 md:text-[11px]"
                      >
                        {labels.testDrive}
                      </Link>
                      <Link
                        href={`/${locale}/catalog/${slot.id}`}
                        className="btn-secondary min-h-[30px] px-2.5 text-[9px] md:min-h-[38px] md:px-4 md:text-[11px]"
                      >
                        {labels.viewCatalog}
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center py-6 text-center md:py-12">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-[#C7CDD0] bg-[#F0F2F3] md:mb-4 md:h-16 md:w-16 md:rounded-2xl">
                      <svg
                        className="h-5 w-5 text-[#8A9094] md:h-7 md:w-7"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <p className="text-[11px] text-[#686D71] md:text-[13px]">
                      {labels.emptySlot}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Differences indicator — mobile only, once above the table */}
          {hasComparison && diffCount > 0 && (
            <div className="flex items-center gap-2 border-b border-[#DDE1E3] px-3 py-2 md:hidden">
              <span className="inline-flex rounded border border-byd-red/30 bg-byd-red/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.1em] text-byd-red">
                {diffCount} {labels.differs}
              </span>
              <span className="text-[11px] text-[#686D71]">
                {locale === "ka"
                  ? "— მწკრივები მონიშნულია"
                  : "— rows highlighted below"}
              </span>
            </div>
          )}

          {/* Spec rows */}
          {specRows.map((row, rowIndex) => (
            <div
              key={row.key}
              className={`border-b border-[#E6E9EA] ${
                row.hasDifference
                  ? "bg-[rgba(215,12,25,0.055)]"
                  : rowIndex % 2 === 0
                    ? "bg-white"
                    : ""
              }`}
            >
              {/* Mobile: spec label row spanning full width */}
              <div
                className={`flex items-center gap-2 px-3 pb-0.5 pt-2 md:hidden ${
                  row.hasDifference
                    ? "border-l-2 border-byd-red/50"
                    : "border-l-2 border-transparent"
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#686D71]">
                  {t(row.label, locale)}
                </span>
              </div>

              {/* Values: 3 columns */}
              <div
                className={`grid grid-cols-3 ${
                  row.hasDifference
                    ? "md:border-l-0 border-l-2 border-byd-red/50 md:border-l-transparent"
                    : ""
                }`}
              >
                {row.values.map((value, ci) => (
                  <div
                    key={`${row.key}-${ci}`}
                    title={t(row.label, locale)}
                    className={`px-3 pb-2.5 pt-0.5 text-[12px] leading-5 md:flex md:items-center md:px-5 md:py-3.5 md:text-[14px] md:leading-6 ${
                      ci < 2 ? "border-r border-[#E6E9EA]" : ""
                    } ${
                      value === null
                        ? "text-[#B6BDC1]"
                        : row.hasDifference
                          ? "font-semibold text-[#252728]"
                          : "text-[#4E5356]"
                    }`}
                  >
                    {value ?? "—"}
                    {/* DIFFERS badge — desktop only */}
                    {row.hasDifference && value !== null && (
                      <span className="ml-2 hidden shrink-0 rounded border border-byd-red/30 bg-byd-red/10 px-1.5 py-px text-[8px] font-bold uppercase tracking-[0.1em] text-byd-red md:inline-flex">
                        {labels.differs}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Price row */}
          {hasComparison && (
            <div>
              <div className="px-3 pb-0.5 pt-2 md:hidden">
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#686D71]">
                  {labels.pricing}
                </span>
              </div>
              <div className="grid grid-cols-3">
                {slots.map((slot, ci) => (
                  <div
                    key={`price-${ci}`}
                    title={labels.pricing}
                    className={`px-3 pb-2.5 pt-0.5 text-[11px] italic text-[#686D71] md:flex md:items-center md:px-5 md:py-3.5 md:text-[13px] ${
                      ci < 2 ? "border-r border-[#E6E9EA]" : ""
                    }`}
                  >
                    {slot ? labels.pricingValue : "—"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!hasComparison && (
            <div className="flex flex-col items-center justify-center py-12 text-center md:py-16">
              <p className="text-[13px] text-[#686D71] md:text-[15px]">
                {locale === "ka"
                  ? "აირჩიეთ მინიმუმ 2 მოდელი შესადარებლად"
                  : "Select at least 2 models to compare"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Design options — only when models selected ── */}
      {filledSlots.length > 0 && (
        <div className="section-container pt-12">
          <div className="mb-6 border-t border-[#DDE1E3] pt-8">
            <h2 className="text-[2rem] font-semibold text-[#252728]">
              {labels.designTitle}
            </h2>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {slots.map((slot) =>
              slot ? (
                <div
                  key={`design-${slot.id}`}
                  className="rounded-[1.25rem] content-surface-soft p-6"
                >
                  <div className="mb-6 border-b border-[#DDE1E3] pb-5">
                    <p
                      className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                        slot.type === "EV"
                          ? "bg-badge-ev-bg text-badge-ev"
                          : "bg-badge-phev-bg text-badge-phev"
                      }`}
                    >
                      {slot.type}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-[#252728]">
                      {slot.familyName}
                    </h3>
                    <p className="mt-1 text-sm text-[#686D71]">
                      {slot.label} / {t(slot.category, locale)}
                    </p>
                  </div>

                  <div className="space-y-7">
                    <div>
                      <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-[#686D71]">
                        {locale === "ka" ? "ფერი" : "Paint"}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {slot.design.paint.map((paint) => (
                          <SwatchDot
                            key={paint.id}
                            hex={paint.hex}
                            title={t(paint.label, locale)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-[#686D71]">
                        {locale === "ka"
                          ? "დისკები და საბურავები"
                          : "Wheels & Tires"}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {slot.design.wheels.map((wheel) => (
                          <WheelSwatch
                            key={wheel.id}
                            design={wheel.design}
                            title={t(wheel.label, locale)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-[#686D71]">
                        {locale === "ka" ? "ინტერიერი" : "Interior"}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {slot.design.interior.map((interior) => (
                          <SwatchDot
                            key={interior.id}
                            hex={interior.hex}
                            title={t(interior.label, locale)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-[#686D71]">
                        {locale === "ka" ? "აქცენტები" : "Accents"}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        {slot.design.accents.map((accent) => (
                          <SwatchDot
                            key={accent.id}
                            hex={accent.hex}
                            title={t(accent.label, locale)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
