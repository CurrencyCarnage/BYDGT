"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
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
  length: string;
  width: string;
  height: string;
  wheelbase: string;
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
          totalRange: "Not stated in workbook",
          evRange: "128 km CLTC",
          power: "120 kW",
          torque: "210 Nm",
          acceleration: "7.9 s",
          topSpeed: "Not stated in workbook",
          battery: "15.87 kWh",
          drive: "FWD",
          charging: "AC 3.5 kW / DC 23 kW",
          length: "4,830 mm",
          width: "1,875 mm",
          height: "1,495 mm",
          wheelbase: "2,790 mm",
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
          totalRange: "1,621 km combined",
          evRange: "121 km CLTC / 93 km WLTC",
          power: "160 kW",
          torque: "260 Nm",
          acceleration: "7.5 s",
          topSpeed: "Not stated in workbook",
          battery: "18.3 kWh",
          drive: "FWD",
          charging: "AC 3.3 kW / DC 26 kW",
          length: "4,810 mm",
          width: "1,920 mm",
          height: "1,675 mm",
          wheelbase: "2,820 mm",
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
          totalRange: "605 km CLTC comprehensive range",
          evRange: "605 km CLTC",
          power: "240 kW",
          torque: "305 Nm",
          acceleration: "6.8 s",
          topSpeed: "Not stated in workbook",
          battery: "69.07 kWh",
          drive: "RWD",
          charging: "AC 7 kW; flash charging function",
          length: "4,810 mm",
          width: "1,920 mm",
          height: "1,675 mm",
          wheelbase: "2,820 mm",
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
          totalRange: "401 km CLTC electric range",
          evRange: "401 km CLTC",
          power: "130 kW",
          torque: "290 Nm",
          acceleration: "7.9 s",
          topSpeed: "160 km/h",
          battery: "45.12 kWh (Blade Battery)",
          drive: "FWD",
          charging: "DC 65 kW / AC 7 kW",
          length: "4,310 mm",
          width: "1,830 mm",
          height: "1,675 mm",
          wheelbase: "2,620 mm",
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
          totalRange: "1,100 km NEDC combined",
          evRange: "110 km NEDC",
          power: "145 kW",
          torque: "300 Nm",
          acceleration: "7.5 s",
          topSpeed: "180 km/h",
          battery: "18.03 kWh",
          drive: "FWD",
          charging: "AC 6.6 kW",
          length: "4,310 mm",
          width: "1,830 mm",
          height: "1,675 mm",
          wheelbase: "2,620 mm",
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

const COMPARE_SELECTION_STORAGE_KEY = "byd-compare-selected-models";

const getCachedSlots = (ids: unknown) => {
  if (!Array.isArray(ids)) return [null, null, null] as [
    SlotVersion | null,
    SlotVersion | null,
    SlotVersion | null,
  ];

  const usedIds = new Set<string>();
  return [0, 1, 2].map((index) => {
    const id = ids[index];
    if (typeof id !== "string" || usedIds.has(id)) return null;

    const version = ALL_VERSIONS.find((item) => item.id === id) ?? null;
    if (version) usedIds.add(id);
    return version;
  }) as [SlotVersion | null, SlotVersion | null, SlotVersion | null];
};

function SwapColumnsIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3"
      />
    </svg>
  );
}

/** Extract the first parseable number from a spec value string.
 *  e.g. "up to 1,505 km" → 1505, "8.5 s" → 8.5, "N/A" → null */
function extractNumber(val: string): number | null {
  const cleaned = val.replace(/,/g, "");
  const match = cleaned.match(/[\d]+(?:\.[\d]+)?/);
  return match ? parseFloat(match[0]) : null;
}

/** "higher" = bigger number wins, "lower" = smaller number wins, "neutral" = no ranking */
type BetterIs = "higher" | "lower" | "neutral";

const SPEC_ROWS: {
  key: string;
  label: Bilingual;
  getValue: (version: SlotVersion, locale: LocaleCode) => string;
  betterIs: BetterIs;
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
    betterIs: "neutral",
  },
  {
    key: "bodyType",
    label: { en: "Body Type", ka: "ძარის ტიპი" },
    getValue: (version, locale) => t(version.category, locale),
    betterIs: "neutral",
  },
  {
    key: "totalRange",
    label: { en: "Total Range", ka: "ჯამური მანძილი" },
    getValue: (version) => version.specs.totalRange,
    betterIs: "higher",
  },
  {
    key: "evRange",
    label: { en: "EV Range", ka: "ელექტრო სავალი" },
    getValue: (version) => version.specs.evRange,
    betterIs: "higher",
  },
  {
    key: "power",
    label: { en: "Power", ka: "სიმძლავრე" },
    getValue: (version) => version.specs.power,
    betterIs: "higher",
  },
  {
    key: "torque",
    label: { en: "Torque", ka: "მომენტი" },
    getValue: (version) => version.specs.torque,
    betterIs: "higher",
  },
  {
    key: "acceleration",
    label: { en: "0-100 km/h", ka: "0-100 კმ/სთ" },
    getValue: (version) => version.specs.acceleration,
    betterIs: "lower",
  },
  {
    key: "topSpeed",
    label: { en: "Top Speed", ka: "მაქს. სიჩქარე" },
    getValue: (version) => version.specs.topSpeed,
    betterIs: "higher",
  },
  {
    key: "battery",
    label: { en: "Battery", ka: "ბატარეა" },
    getValue: (version) => version.specs.battery,
    betterIs: "higher",
  },
  {
    key: "drive",
    label: { en: "Drive", ka: "წამყვანი" },
    getValue: (version) => version.specs.drive,
    betterIs: "neutral",
  },
  {
    key: "charging",
    label: { en: "Charging", ka: "დამუხტვა" },
    getValue: (version) => version.specs.charging,
    betterIs: "higher",
  },
  {
    key: "length",
    label: { en: "Length", ka: "სიგრძე" },
    getValue: (version) => version.specs.length,
    betterIs: "neutral",
  },
  {
    key: "width",
    label: { en: "Width", ka: "სიგანე" },
    getValue: (version) => version.specs.width,
    betterIs: "neutral",
  },
  {
    key: "height",
    label: { en: "Height", ka: "სიმაღლე" },
    getValue: (version) => version.specs.height,
    betterIs: "neutral",
  },
  {
    key: "wheelbase",
    label: { en: "Wheelbase", ka: "თვლების ბაზა" },
    getValue: (version) => version.specs.wheelbase,
    betterIs: "neutral",
  },
];

const SPEC_GROUPS: { key: string; title: Bilingual; rows: string[] }[] = [
  {
    key: "powertrain",
    title: { en: "Powertrain", ka: "ძრავა და ამძრავი" },
    rows: ["powertrain", "drive", "power", "torque"],
  },
  {
    key: "range",
    title: { en: "Range & energy", ka: "მანძილი და ენერგია" },
    rows: ["totalRange", "evRange", "battery", "charging"],
  },
  {
    key: "performance",
    title: { en: "Performance", ka: "წარმადობა" },
    rows: ["acceleration", "topSpeed"],
  },
  {
    key: "dimensions",
    title: { en: "Body & dimensions", ka: "ძარა და ზომები" },
    rows: ["bodyType", "length", "width", "height", "wheelbase"],
  },
];

interface ModelDropdownProps {
  selected: SlotVersion | null;
  onSelect: (version: SlotVersion) => void;
  onClear: () => void;
  locale: LocaleCode;
  blockedIds: string[];
  placeholder: string;
  clearLabel: string;
  compact?: boolean;
  openRequestKey?: number;
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
  openRequestKey,
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

  useEffect(() => {
    if (!openRequestKey) return;
    setOpen(true);
  }, [openRequestKey]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between text-left transition-all duration-200 ${
          compact
            ? `min-h-[44px] gap-1 rounded-xl border px-1.5 py-1.5 ${
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
                  ? "h-8 w-9 rounded-md"
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
                  ? "h-8 w-9 rounded-md"
                  : "h-10 w-12 rounded-lg"
              }`}
            >
              <svg
                className={`text-[#62676A] ${compact ? "h-3.5 w-3.5" : "h-5 w-5"}`}
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
        <span className={`flex shrink-0 items-center ${compact ? "gap-0.5" : "gap-2"}`}>
          {selected && (
            <span
              role="button"
              tabIndex={0}
              aria-label={clearLabel}
              title={clearLabel}
              onClick={(event) => {
                event.stopPropagation();
                onClear();
                setOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                onClear();
                setOpen(false);
              }}
              className={`inline-flex items-center justify-center rounded-full border border-byd-red/20 bg-byd-red/[0.06] text-byd-red transition-colors duration-200 hover:border-byd-red/40 hover:bg-byd-red/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/50 ${
                compact ? "h-6 w-6" : "h-8 w-8"
              }`}
            >
              <svg
                className={compact ? "h-3 w-3" : "h-4 w-4"}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.9}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          )}
          <svg
            className={`text-[#686D71] transition-transform duration-200 ${
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
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-[#DDE1E3] bg-white shadow-[0_24px_60px_rgba(24,28,32,0.18)]">
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

type SlotTuple = [SlotVersion | null, SlotVersion | null, SlotVersion | null];

const persistSlots = (newSlots: SlotTuple) => {
  try {
    const slotIds = newSlots.map((s) => s?.id ?? null);
    window.localStorage.setItem(
      COMPARE_SELECTION_STORAGE_KEY,
      JSON.stringify(slotIds)
    );
  } catch { /* quota exceeded or SSR — ignore */ }
};

export default function CompareGrid({
  initialModelIds = [],
}: {
  initialModelIds?: string[];
}) {
  const locale = useLocale() as LocaleCode;
  const [slots, setSlots] = useState<SlotTuple>([null, null, null]);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<"all" | "differences">(
    "all"
  );
  const [openRequests, setOpenRequests] = useState<[number, number, number]>([
    0,
    0,
    0,
  ]);
  const [swapAnimation, setSwapAnimation] = useState<{
    left: number;
    right: number;
    nonce: number;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Restore cached slots first
    let cached: SlotTuple = [null, null, null];
    try {
      const raw = window.localStorage.getItem(COMPARE_SELECTION_STORAGE_KEY);
      if (raw) {
        cached = getCachedSlots(JSON.parse(raw));
      }
    } catch {
      window.localStorage.removeItem(COMPARE_SELECTION_STORAGE_KEY);
    }

    // Merge query-param models into cached slots (additive)
    if (initialModelIds.length > 0) {
      const usedIds = new Set(cached.filter(Boolean).map((s) => s!.id));
      for (const id of initialModelIds) {
        if (typeof id !== "string" || usedIds.has(id)) continue;
        const version = ALL_VERSIONS.find((v) => v.id === id) ?? null;
        if (!version) continue;
        const emptyIndex = cached.findIndex((s) => s === null);
        if (emptyIndex === -1) break; // all 3 slots full
        cached[emptyIndex] = version;
        usedIds.add(id);
      }
      persistSlots(cached);
    }

    setSlots(cached);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!swapAnimation) return;
    const timer = window.setTimeout(() => setSwapAnimation(null), 360);
    return () => window.clearTimeout(timer);
  }, [swapAnimation]);

  const labels = {
    differs: locale === "ka" ? "განსხვავდება" : "Differs",
    pricing: locale === "ka" ? "ფასი" : "Price",
    pricingValue:
      locale === "ka" ? "მოგვმართეთ" : "Contact for pricing",
    testDrive: locale === "ka" ? "ტესტ დრაივი" : "BOOK TEST DRIVE",
    viewCatalog: locale === "ka" ? "კატალოგი" : "View Catalog",
    selectModel:
      locale === "ka" ? "აირჩიეთ პროდუქტი" : "Select a product",
    clearModel:
      locale === "ka" ? "პროდუქტის წაშლა" : "Remove product",
    emptySlot:
      locale === "ka"
        ? "პროდუქტი არ არის არჩეული"
        : "No product selected",
    showAll: locale === "ka" ? "ყველა მონაცემი" : "All specs",
    showDifferences:
      locale === "ka" ? "განსხვავებები" : "Differences",
    specModeLabel:
      locale === "ka" ? "სპეციფიკაციების ჩვენება" : "Spec display",
    swapModels: locale === "ka" ? "სვეტების გაცვლა" : "Swap columns",
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

        // Determine which column(s) have the "best" value
        let bestIndices: number[] = [];
        if (hasDifference && row.betterIs !== "neutral") {
          const nums = values.map((v) => (v ? extractNumber(v) : null));
          const validNums = nums.filter((n): n is number => n !== null);
          if (validNums.length >= 2) {
            const bestVal = row.betterIs === "higher"
              ? Math.max(...validNums)
              : Math.min(...validNums);
            bestIndices = nums
              .map((n, i) => (n === bestVal ? i : -1))
              .filter((i) => i !== -1);
          }
        }

        return { ...row, values, hasDifference, bestIndices };
      })
    : [];

  const visibleSpecRows =
    specRows;

  const updateSlot = (index: number, version: SlotVersion | null) => {
    const next = [...slots] as SlotTuple;
    next[index] = version;
    setSlots(next);
    persistSlots(next);
  };

  const requestSlotSelect = (index: number) => {
    setOpenRequests((prev) => {
      const next = [...prev] as [number, number, number];
      next[index] += 1;
      return next;
    });
  };

  const swapSlots = (left: number, right: number) => {
    if (!slots[left] && !slots[right]) return;
    const next = [...slots] as SlotTuple;
    [next[left], next[right]] = [next[right], next[left]];
    setSlots(next);
    persistSlots(next);
    setSwapAnimation({ left, right, nonce: Date.now() });
  };

  const getSwapClass = (index: number) => {
    if (!swapAnimation) return "";
    if (index === swapAnimation.left) return "compare-swap-from-right";
    if (index === swapAnimation.right) return "compare-swap-from-left";
    return "";
  };

  const blockedFor = (index: number) =>
    slots
      .filter((s, i): s is SlotVersion => s !== null && i !== index)
      .map((s) => s.id);

  return (
    <div className="compare-module pb-16 pt-4 md:pt-8">
      {/* ── Mobile: 3 compact thumbnails in one row ── */}
      <div className="compare-sticky-shell sticky top-[5rem] z-30 bg-byd-dark/95 backdrop-blur md:hidden">
        <div className="section-container">
          <div
            className={`compare-selector-surface border border-b-0 border-[#DDE1E3] bg-[#F7F8F8] px-3 py-2 transition-[border-radius] duration-200 ${
              hasScrolled ? "rounded-t-none" : "rounded-t-[1rem]"
            }`}
          >
            <div
              className="grid items-center gap-0.5"
              style={{ gridTemplateColumns: "minmax(0,1fr) 1.375rem minmax(0,1fr) 1.375rem minmax(0,1fr)" }}
            >
            {slots.map((slot, i) => (
              <Fragment key={`m-${i}`}>
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => swapSlots(i - 1, i)}
                    disabled={!slots[i - 1] && !slot}
                    className="compare-swap-button h-[1.375rem] w-[1.375rem]"
                    aria-label={`${labels.swapModels}: ${i} / ${i + 1}`}
                    title={labels.swapModels}
                  >
                    <SwapColumnsIcon className="h-2.5 w-2.5" />
                  </button>
                )}
                <div className={getSwapClass(i)}>
                  <ModelDropdown
                    selected={slot}
                    onSelect={(v) => updateSlot(i, v)}
                    onClear={() => updateSlot(i, null)}
                    locale={locale}
                    blockedIds={blockedFor(i)}
                    placeholder={labels.selectModel}
                    clearLabel={labels.clearModel}
                    compact
                    openRequestKey={openRequests[i]}
                  />
                </div>
              </Fragment>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop: 3 equal selectors ── */}
      <div className="compare-sticky-shell sticky top-[5rem] z-30 hidden bg-byd-dark/95 backdrop-blur md:block">
        <div className="section-container">
          <div
            className={`compare-selector-surface border border-b-0 border-[#DDE1E3] bg-[#F7F8F8] px-4 py-3 transition-[border-radius] duration-200 ${
              hasScrolled ? "rounded-t-none" : "rounded-t-[1.25rem]"
            }`}
          >
            <div
              className="grid items-center gap-3"
              style={{ gridTemplateColumns: "minmax(0,1fr) 2.75rem minmax(0,1fr) 2.75rem minmax(0,1fr)" }}
            >
            {slots.map((slot, i) => (
              <Fragment key={`d-${i}`}>
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => swapSlots(i - 1, i)}
                    disabled={!slots[i - 1] && !slot}
                    className="compare-swap-button h-11 w-11"
                    aria-label={`${labels.swapModels}: ${i} / ${i + 1}`}
                    title={labels.swapModels}
                  >
                    <SwapColumnsIcon className="h-4 w-4" />
                  </button>
                )}
                <div className={getSwapClass(i)}>
                  <ModelDropdown
                    selected={slot}
                    onSelect={(v) => updateSlot(i, v)}
                    onClear={() => updateSlot(i, null)}
                    locale={locale}
                    blockedIds={blockedFor(i)}
                    placeholder={labels.selectModel}
                    clearLabel={labels.clearModel}
                    openRequestKey={openRequests[i]}
                  />
                </div>
              </Fragment>
            ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Comparison matrix ── */}
      <div className="section-container">
        <div className="compare-matrix-surface overflow-hidden rounded-b-[1rem] border-t-0 content-surface md:rounded-b-[1.25rem]">
          {/* Model card headers — pure 3-column */}
          <div className="grid grid-cols-3 border-b border-[#DDE1E3]">
            {slots.map((slot, i) => (
              <div
                key={`card-${i}`}
                className={`flex flex-col p-3 md:p-5 ${getSwapClass(i)} ${
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
                    <div className="mt-auto grid grid-cols-1 gap-1.5 pt-2 md:grid-cols-2 md:gap-2 md:pt-5">
                      <Link
                        href={`/${locale}/booking?version=${encodeURIComponent(slot.id)}`}
                        className="compare-card-action compare-card-action-primary"
                      >
                        {labels.testDrive}
                      </Link>
                      <Link
                        href={`/${locale}/catalog/${slot.id}`}
                        className="compare-card-action compare-card-action-secondary"
                      >
                        {labels.viewCatalog}
                      </Link>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => requestSlotSelect(i)}
                    className="group flex flex-1 flex-col items-center justify-center py-6 text-center transition-colors duration-200 hover:bg-[#F7F8F8] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-byd-red/55 md:py-12"
                    aria-label={labels.selectModel}
                  >
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl border border-dashed border-[#C7CDD0] bg-[#F0F2F3] transition-colors duration-200 group-hover:border-byd-red/45 group-hover:bg-byd-red/[0.04] md:mb-4 md:h-16 md:w-16 md:rounded-2xl">
                      <svg
                        className="h-5 w-5 text-[#62676A] transition-colors duration-200 group-hover:text-byd-red md:h-7 md:w-7"
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
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Spec display controls */}
          {hasComparison && (
            <div className="flex justify-center border-b border-[#DDE1E3] bg-[#FAFBFB] px-3 py-3 md:px-5 md:py-4">
              <div
                className="inline-grid w-full grid-cols-2 rounded-full border border-[#DDE1E3] bg-white p-1 shadow-[0_8px_22px_rgba(24,28,32,0.06)] md:w-auto"
                role="group"
                aria-label={labels.specModeLabel}
              >
                <button
                  type="button"
                  onClick={() => setComparisonMode("all")}
                  className={`min-h-[2.4rem] rounded-full px-4 text-[11px] font-semibold transition-colors duration-200 md:min-w-[8rem] md:text-[12px] ${
                    comparisonMode === "all"
                      ? "bg-[#252728] text-white shadow-[0_8px_18px_rgba(24,28,32,0.18)]"
                      : "text-[#686D71] hover:bg-[#F0F2F3] hover:text-[#252728]"
                  }`}
                  aria-pressed={comparisonMode === "all"}
                >
                  {labels.showAll}
                </button>
                <button
                  type="button"
                  onClick={() => setComparisonMode("differences")}
                  className={`min-h-[2.4rem] rounded-full px-4 text-[11px] font-semibold transition-colors duration-200 md:min-w-[9.5rem] md:text-[12px] ${
                    comparisonMode === "differences"
                      ? "bg-[#252728] text-white shadow-[0_8px_18px_rgba(24,28,32,0.18)]"
                      : "text-[#686D71] hover:bg-[#F0F2F3] hover:text-[#252728]"
                  }`}
                  aria-pressed={comparisonMode === "differences"}
                >
                  {labels.showDifferences}
                </button>
              </div>
            </div>
          )}

          {/* Grouped specification cards */}
          {hasComparison && (
            <div className="space-y-4 bg-[#EEF0F1] p-3 md:space-y-5 md:p-6">
              {SPEC_GROUPS.map((group, groupIndex) => {
                const rows = visibleSpecRows.filter((row) => group.rows.includes(row.key));
                if (rows.length === 0) return null;

                return (
                  <section key={group.key} className="overflow-hidden rounded-xl border border-byd-red/70 bg-white shadow-[0_12px_30px_rgba(24,28,32,0.05)]">
                    <div className="flex items-center gap-3 bg-byd-red px-4 py-3 text-white md:px-6 md:py-4">
                      <span className="flex h-7 w-7 items-center justify-center border border-white/35 text-[10px] font-bold md:h-8 md:w-8 md:text-xs">0{groupIndex + 1}</span>
                      <h3 className="text-sm font-bold uppercase tracking-[0.12em] md:text-base">{t(group.title, locale)}</h3>
                    </div>
                    <div className="divide-y divide-[#E6E9EA]">
                      {rows.map((row) => (
                        <div key={row.key} className="bg-white">
                          <div className="border-b border-[#EEF0F1] bg-[#FAFBFB] px-4 py-2.5 text-center md:px-6">
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-byd-red md:text-xs">{t(row.label, locale)}</span>
                          </div>
                          <div className="grid grid-cols-3">
                            {row.values.map((value, ci) => {
                              const isBest = comparisonMode === "differences" && row.hasDifference && row.bestIndices.includes(ci);
                              return (
                                <div
                                  key={`${row.key}-${ci}`}
                                  title={t(row.label, locale)}
                                  className={`flex min-h-[3.4rem] items-center justify-center px-2 py-3 text-center leading-5 md:min-h-[4.25rem] md:px-5 md:py-4 ${getSwapClass(ci)} ${
                                    ci < 2 ? "border-r border-[#E6E9EA]" : ""
                                  } ${
                                    value === null
                                      ? "text-[11px] text-[#62676A] md:text-sm"
                                      : isBest
                                        ? "text-[13px] font-bold text-byd-red md:text-base"
                                        : "text-[11px] font-semibold text-[#252728] md:text-sm"
                                  }`}
                                >
                                  <span className="w-full break-words">{value ?? "—"}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {/* Price row — centered buttons linking to contact */}
          {hasComparison && (
            <div>
              <div className="flex items-center justify-center border-b border-[#E6E9EA] px-3 py-2.5 text-center bg-[#F7F8F8]">
                <span className="text-[10px] font-semibold uppercase text-[#686D71] md:text-[11px]">
                  {labels.pricing}
                </span>
              </div>
              <div className="grid grid-cols-3">
                {slots.map((slot, ci) => (
                  <div
                    key={`price-${ci}`}
                    className={`flex items-center justify-center px-3 py-3 md:px-5 md:py-4 ${getSwapClass(ci)} ${
                      ci < 2 ? "border-r border-[#E6E9EA]" : ""
                    }`}
                  >
                    {slot ? (
                      <div className="grid w-full gap-2">
                        <Link
                          href={`/${locale}/contact?subject=${encodeURIComponent(slot.familyName + " " + slot.label)}`}
                          className="compare-pricing-cta compare-contact-cta inline-flex min-h-[2.75rem] w-full items-center justify-center gap-1.5 rounded-lg border border-[#C7CDD0] px-2 py-2 text-center text-[10px] font-semibold leading-[1.15] text-[#252728] transition-colors hover:border-byd-red hover:text-byd-red md:px-3 md:text-[12px]"
                        >
                          {labels.pricingValue}
                        </Link>
                        <Link
                          href={`/${locale}/booking?version=${encodeURIComponent(slot.id)}`}
                          className="inline-flex min-h-[2.75rem] w-full items-center justify-center bg-byd-red px-2 py-2 text-center text-[10px] font-semibold leading-[1.15] text-white transition-colors hover:bg-[#A80912] md:px-3 md:text-[12px]"
                        >
                          {locale === "ka" ? "ტესტ დრაივი" : "BOOK TEST DRIVE"}
                        </Link>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#62676A]">—</span>
                    )}
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
                  ? "აირჩიეთ მინიმუმ 2 პროდუქტი შესადარებლად"
                  : "Select at least 2 products to compare"}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
