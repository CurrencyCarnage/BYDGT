"use client";

import { useRef, useState, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

type Bilingual = { en: string; ka: string };

type PaintOption    = { id: string; label: Bilingual; hex: string };
type WheelOption    = { id: string; label: Bilingual; design: 0 | 1 | 2 | 3 };
type InteriorOption = { id: string; label: Bilingual; hex: string };
type AccentOption   = { id: string; label: Bilingual; hex: string };

type DesignData = {
  paint:    PaintOption[];
  wheels:   WheelOption[];
  interior: InteriorOption[];
  accents:  AccentOption[];
};

type VersionSpecs = {
  totalRange:   string;
  evRange:      string;
  power:        string;
  torque:       string;
  acceleration: string;
  topSpeed:     string;
  battery:      string;
  drive:        string;
  charging:     string;
};

type ModelVersion = {
  id:      string;
  label:   "DM-i" | "EV";
  type:    "PHEV" | "EV";
  tagline: Bilingual;
  image:   string;
  specs:   VersionSpecs;
  design:  DesignData;
};

type ModelFamily = {
  id:       string;
  name:     string;
  category: Bilingual;
  versions: ModelVersion[];
};

type SlotVersion = ModelVersion & { familyName: string; category: Bilingual };

// ── Shared design palettes ────────────────────────────────────────────────

const SEAL_PAINT: PaintOption[] = [
  { id: "midnight-black",  label: { en: "Midnight Black",  ka: "შუაღამის შავი"     }, hex: "#1A1A1A" },
  { id: "arctic-white",    label: { en: "Arctic White",    ka: "არქტიკული თეთრი"  }, hex: "#F0F0F0" },
  { id: "titanium-silver", label: { en: "Titanium Silver", ka: "ტიტანის ვერცხლი"  }, hex: "#8A8A9A" },
  { id: "sapphire-blue",   label: { en: "Sapphire Blue",   ka: "საფირის ლურჯი"    }, hex: "#1B3A6B" },
  { id: "burgundy-red",    label: { en: "Burgundy Red",    ka: "ბურგუნდიის წითელი"}, hex: "#6B1B2A" },
];
const SEAL_WHEELS: WheelOption[] = [
  { id: "18-comfort", label: { en: "18″ Comfort", ka: "18″ კომფორტი" }, design: 0 },
  { id: "19-sport",   label: { en: "19″ Sport",   ka: "19″ სპორტი"   }, design: 2 },
];
const SEAL_INTERIOR: InteriorOption[] = [
  { id: "black", label: { en: "Black", ka: "შავი" }, hex: "#1C1C1C" },
  { id: "beige", label: { en: "Beige", ka: "ბეჟი" }, hex: "#C4AA88" },
];
const SEAL_ACCENTS: AccentOption[] = [
  { id: "dark", label: { en: "Dark Chrome", ka: "მუქი ქრომი" }, hex: "#2A2A2A" },
];

const SEALION_PAINT: PaintOption[] = [
  { id: "midnight-black",  label: { en: "Midnight Black",  ka: "შუაღამის შავი"     }, hex: "#1A1A1A" },
  { id: "arctic-white",    label: { en: "Arctic White",    ka: "არქტიკული თეთრი"  }, hex: "#F0F0F0" },
  { id: "titanium-silver", label: { en: "Titanium Silver", ka: "ტიტანის ვერცხლი"  }, hex: "#8A8A9A" },
  { id: "sapphire-blue",   label: { en: "Sapphire Blue",   ka: "საფირის ლურჯი"    }, hex: "#1B3A6B" },
  { id: "forest-green",    label: { en: "Forest Green",    ka: "ტყის მწვანე"       }, hex: "#2D4A2D" },
  { id: "burgundy-red",    label: { en: "Burgundy Red",    ka: "ბურგუნდიის წითელი"}, hex: "#6B1B2A" },
];
const SEALION_WHEELS: WheelOption[] = [
  { id: "18-comfort", label: { en: "18″ Comfort", ka: "18″ კომფორტი" }, design: 0 },
  { id: "19-sport",   label: { en: "19″ Sport",   ka: "19″ სპორტი"   }, design: 2 },
  { id: "20-premium", label: { en: "20″ Premium", ka: "20″ პრემიუმ"   }, design: 3 },
];
const SEALION_INTERIOR: InteriorOption[] = [
  { id: "black",     label: { en: "Black",     ka: "შავი"             }, hex: "#1C1C1C" },
  { id: "dark-grey", label: { en: "Dark Grey", ka: "მუქი ნაცრისფერი" }, hex: "#3A3A3A" },
  { id: "beige",     label: { en: "Beige",     ka: "ბეჟი"             }, hex: "#C4AA88" },
];
const SEALION_ACCENTS: AccentOption[] = [
  { id: "dark",   label: { en: "Dark Chrome",   ka: "მუქი ქრომი"    }, hex: "#2A2A2A" },
  { id: "silver", label: { en: "Silver Chrome", ka: "ვერცხლის ქრომი" }, hex: "#9A9A9A" },
];

const YUAN_PAINT: PaintOption[] = [
  { id: "midnight-black",  label: { en: "Midnight Black",  ka: "შუაღამის შავი"    }, hex: "#1A1A1A" },
  { id: "arctic-white",    label: { en: "Arctic White",    ka: "არქტიკული თეთრი" }, hex: "#F0F0F0" },
  { id: "titanium-silver", label: { en: "Titanium Silver", ka: "ტიტანის ვერცხლი" }, hex: "#8A8A9A" },
  { id: "sapphire-blue",   label: { en: "Sapphire Blue",   ka: "საფირის ლურჯი"   }, hex: "#1B3A6B" },
];
const YUAN_WHEELS: WheelOption[] = [
  { id: "17-standard", label: { en: "17″ Standard", ka: "17″ სტანდარტი" }, design: 0 },
  { id: "18-sport",    label: { en: "18″ Sport",    ka: "18″ სპორტი"    }, design: 1 },
];
const YUAN_INTERIOR: InteriorOption[] = [
  { id: "black", label: { en: "Black", ka: "შავი" }, hex: "#1C1C1C" },
];
const YUAN_ACCENTS: AccentOption[] = [
  { id: "dark", label: { en: "Dark Chrome", ka: "მუქი ქრომი" }, hex: "#2A2A2A" },
];

// ── Model data ────────────────────────────────────────────────────────────

const FAMILIES: ModelFamily[] = [
  {
    id: "seal-06",
    name: "BYD Seal 06",
    category: { en: "Sedan", ka: "სედანი" },
    versions: [
      {
        id: "seal-06-dmi", label: "DM-i", type: "PHEV",
        tagline: {
          en: "Super hybrid sedan — long-distance range with low daily consumption.",
          ka: "სუპერ ჰიბრიდული სედანი — გრძელი მარშრუტი, დაბალი ყოველდღიური მოხმარება.",
        },
        image: "/images/models/seal-06-dmi/hero.jpg",
        specs: { totalRange: "up to 1,505 km", evRange: "up to 140 km", power: "156 kW / 210 HP", torque: "—", acceleration: "8.5 s", topSpeed: "180 km/h", battery: "10 – 19 kWh", drive: "FWD", charging: "—" },
        design: { paint: SEAL_PAINT, wheels: SEAL_WHEELS, interior: SEAL_INTERIOR, accents: SEAL_ACCENTS },
      },
      {
        id: "seal-06-ev", label: "EV", type: "EV",
        tagline: {
          en: "Pure electric Seal 06 — efficient, urban-ready, clean sedan styling.",
          ka: "სუფთა ელექტრო Seal 06 — ეფექტური, ქალაქური, მინიმალისტური სედანი.",
        },
        image: "/images/models/seal-06-dmi/hero.jpg",
        specs: { totalRange: "425 km WLTC", evRange: "425 km", power: "95 kW / 127 HP", torque: "220 Nm", acceleration: "10.9 s", topSpeed: "—", battery: "56.64 kWh", drive: "FWD", charging: "DC 65 kW / AC 7 kW" },
        design: { paint: SEAL_PAINT, wheels: SEAL_WHEELS, interior: SEAL_INTERIOR, accents: SEAL_ACCENTS },
      },
    ],
  },
  {
    id: "sealion-06",
    name: "BYD Sealion 06",
    category: { en: "SUV", ka: "SUV" },
    versions: [
      {
        id: "sealion-06-dmi", label: "DM-i", type: "PHEV",
        tagline: {
          en: "Family SUV with DM-i hybrid efficiency and stronger real-world performance.",
          ka: "ოჯახური SUV DM-i ჰიბრიდული ეფექტიანობით და ძლიერი წარმადობით.",
        },
        image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
        specs: { totalRange: "up to 1,080 km", evRange: "92 km (FWD) / 81 km (AWD)", power: "160 kW / 214 HP (FWD)", torque: "300 Nm (FWD) / 550 Nm (AWD)", acceleration: "8.5 s (FWD) / 5.9 s (AWD)", topSpeed: "169 – 179 km/h", battery: "18.3 – 32 kWh", drive: "FWD / AWD", charging: "—" },
        design: { paint: SEALION_PAINT, wheels: SEALION_WHEELS, interior: SEALION_INTERIOR, accents: SEALION_ACCENTS },
      },
      {
        id: "sealion-06-ev", label: "EV", type: "EV",
        tagline: {
          en: "Electric family SUV with longer-range options and premium cabin packaging.",
          ka: "ელექტრო ოჯახური SUV გრძელი მარშრუტითა და პრემიუმ სალონით.",
        },
        image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
        specs: { totalRange: "420 – 500 km WLTP", evRange: "420 – 500 km", power: "160 kW / 214 HP", torque: "310 – 330 Nm", acceleration: "9.3 – 9.6 s", topSpeed: "175 km/h", battery: "71.8 – 87 kWh", drive: "FWD", charging: "DC 150 kW" },
        design: { paint: SEALION_PAINT, wheels: SEALION_WHEELS, interior: SEALION_INTERIOR, accents: SEALION_ACCENTS },
      },
    ],
  },
  {
    id: "yuan-up-dmi",
    name: "BYD Yuan Up",
    category: { en: "Compact SUV · DM-i", ka: "კომპაქტ SUV · DM-i" },
    versions: [
      {
        id: "yuan-up-dmi", label: "DM-i", type: "PHEV",
        tagline: {
          en: "Smart compact hybrid SUV — efficient city driving with extended total range.",
          ka: "ჭკვიანი კომპაქტური ჰიბრიდი — ეკონომიური ქალაქური მართვა და გრძელი მარშრუტი.",
        },
        image: "/images/models/yuan-up-dmi/hero.jpg",
        specs: { totalRange: "1,100 km", evRange: "80 km", power: "110 kW / 150 HP", torque: "—", acceleration: "8.9 s", topSpeed: "170 km/h", battery: "12.9 kWh", drive: "FWD", charging: "—" },
        design: { paint: YUAN_PAINT, wheels: YUAN_WHEELS, interior: YUAN_INTERIOR, accents: YUAN_ACCENTS },
      },
    ],
  },
  {
    id: "yuan-up-ev",
    name: "BYD Yuan Up",
    category: { en: "Compact SUV · EV", ka: "კომპაქტ SUV · EV" },
    versions: [
      {
        id: "yuan-up-ev", label: "EV", type: "EV",
        tagline: {
          en: "Compact electric SUV built for city use, easy ownership, and youthful BYD styling.",
          ka: "კომპაქტური ელექტრო SUV ქალაქური გამოყენებისა და ახალგაზრდული სტილისთვის.",
        },
        image: "/images/models/yuan-up-ev/hero.jpg",
        specs: { totalRange: "380 km NEDC", evRange: "380 km", power: "130 kW / 174 HP", torque: "290 Nm", acceleration: "7.9 s", topSpeed: "—", battery: "45 kWh (Blade LFP)", drive: "FWD", charging: "DC 65 kW / AC 5.6 kW" },
        design: { paint: YUAN_PAINT, wheels: YUAN_WHEELS, interior: YUAN_INTERIOR, accents: YUAN_ACCENTS },
      },
    ],
  },
];

const ALL_VERSIONS: SlotVersion[] = FAMILIES.flatMap((f) =>
  f.versions.map((v) => ({ ...v, familyName: f.name, category: f.category }))
);

const DEFAULTS: [string, string, string] = ["seal-06-dmi", "sealion-06-dmi", "yuan-up-ev"];

// ── Full spec rows ─────────────────────────────────────────────────────────

const SPEC_ROWS: { key: string; label: Bilingual; fn: (v: SlotVersion, locale: string) => string }[] = [
  { key: "type",         label: { en: "Powertrain",   ka: "ძრავი"           }, fn: (v)      => v.type === "EV" ? "Electric" : "Plug-in Hybrid" },
  { key: "category",     label: { en: "Body Type",    ka: "ძარის ტიპი"     }, fn: (v, loc) => loc === "ka" ? v.category.ka : v.category.en },
  { key: "totalRange",   label: { en: "Total Range",  ka: "ჯამური მანძილი" }, fn: (v)      => v.specs.totalRange },
  { key: "evRange",      label: { en: "EV Range",     ka: "ელ. მარშრუტი"   }, fn: (v)      => v.specs.evRange },
  { key: "power",        label: { en: "Power",        ka: "სიმძლავრე"       }, fn: (v)      => v.specs.power },
  { key: "torque",       label: { en: "Torque",       ka: "მომენტი"         }, fn: (v)      => v.specs.torque },
  { key: "acceleration", label: { en: "0–100 km/h",   ka: "0–100 კმ/სთ"    }, fn: (v)      => v.specs.acceleration },
  { key: "topSpeed",     label: { en: "Top Speed",    ka: "მაქს. სიჩქარე"  }, fn: (v)      => v.specs.topSpeed },
  { key: "battery",      label: { en: "Battery",      ka: "ბატარეა"         }, fn: (v)      => v.specs.battery },
  { key: "drive",        label: { en: "Drive",        ka: "წამყვანი"        }, fn: (v)      => v.specs.drive },
  { key: "charging",     label: { en: "Charging",     ka: "დამუხტვა"        }, fn: (v)      => v.specs.charging },
];

// ── WheelSwatch — 4 SVG alloy wheel designs ────────────────────────────────
// Design 0: Classic 5-spoke (straight spokes)
// Design 1: Y/Split 5-spoke (spokes fork near rim)
// Design 2: 10-spoke sport (thin double-spoke pairs)
// Design 3: 7-spoke turbine (angled flow blades)

function WheelSwatch({ design, title }: { design: 0 | 1 | 2 | 3; title: string }) {
  // spoke angles for each design
  const fiveSpokes  = [0, 72, 144, 216, 288];
  const tenSpokes   = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
  const sevenSpokes = [0, 51.4, 102.9, 154.3, 205.7, 257.1, 308.6];

  return (
    <div
      title={title}
      className="w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-150"
    >
      <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <radialGradient id={`rim-${design}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor="#5a5a5a" />
            <stop offset="60%"  stopColor="#2e2e2e" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>
          <radialGradient id={`hub-${design}`} cx="40%" cy="35%" r="70%">
            <stop offset="0%"   stopColor="#666" />
            <stop offset="100%" stopColor="#222" />
          </radialGradient>
        </defs>

        {/* Outer tyre */}
        <circle cx="20" cy="20" r="19.5" fill="#111" />
        {/* Tyre highlight */}
        <circle cx="20" cy="20" r="19.5" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />

        {/* Rim face */}
        <circle cx="20" cy="20" r="16" fill={`url(#rim-${design})`} />
        {/* Rim inner ring */}
        <circle cx="20" cy="20" r="15" fill="none" stroke="#444" strokeWidth="0.5" />

        {/* ── Design 0: Classic 5-spoke ── */}
        {design === 0 && fiveSpokes.map((a) => (
          <polygon
            key={a}
            points="18.2,15.5 21.8,15.5 22.5,5 17.5,5"
            fill="#4a4a4a"
            stroke="#5f5f5f"
            strokeWidth="0.4"
            transform={`rotate(${a} 20 20)`}
          />
        ))}

        {/* ── Design 1: Y / split 5-spoke ── */}
        {design === 1 && fiveSpokes.map((a) => (
          <g key={a} transform={`rotate(${a} 20 20)`}>
            {/* Main trunk */}
            <polygon points="18.8,15.8 21.2,15.8 20.8,11 19.2,11" fill="#4a4a4a" stroke="#5f5f5f" strokeWidth="0.35" />
            {/* Left arm */}
            <polygon points="19.2,11 20.8,11 18,5.5 16,7"          fill="#4a4a4a" stroke="#5f5f5f" strokeWidth="0.35" />
            {/* Right arm */}
            <polygon points="19.2,11 20.8,11 22,5.5 24,7"          fill="#4a4a4a" stroke="#5f5f5f" strokeWidth="0.35" />
          </g>
        ))}

        {/* ── Design 2: 10-spoke sport (paired thin) ── */}
        {design === 2 && tenSpokes.map((a) => (
          <polygon
            key={a}
            points="19.2,15.5 20.8,15.5 21.2,5 18.8,5"
            fill="#454545"
            stroke="#606060"
            strokeWidth="0.3"
            transform={`rotate(${a} 20 20)`}
          />
        ))}

        {/* ── Design 3: 7-spoke turbine (angled blades) ── */}
        {design === 3 && sevenSpokes.map((a, i) => (
          <polygon
            key={i}
            points="19,15.5 21,15.5 23.5,5 17,5.5"
            fill="#474747"
            stroke="#5f5f5f"
            strokeWidth="0.35"
            transform={`rotate(${a} 20 20)`}
          />
        ))}

        {/* Barrel shadow ring */}
        <circle cx="20" cy="20" r="15" fill="none" stroke="#222" strokeWidth="1.5" />

        {/* Center hub */}
        <circle cx="20" cy="20" r="4.5" fill={`url(#hub-${design})`} stroke="#555" strokeWidth="0.5" />
        {/* Centre bolt-circle */}
        {[0, 72, 144, 216, 288].map((a) => {
          const rad = (a * Math.PI) / 180;
          const x   = 20 + 2.6 * Math.sin(rad);
          const y   = 20 - 2.6 * Math.cos(rad);
          return <circle key={a} cx={x} cy={y} r="0.55" fill="#333" />;
        })}
        {/* Cap */}
        <circle cx="20" cy="20" r="1.4" fill="#1a1a1a" stroke="#444" strokeWidth="0.4" />
      </svg>
    </div>
  );
}

// ── ModelDropdown ─────────────────────────────────────────────────────────

interface ModelDropdownProps {
  selected:  SlotVersion;
  onSelect:  (v: SlotVersion) => void;
  locale:    string;
  otherIds:  string[];
}

function ModelDropdown({ selected, onSelect, locale, otherIds }: ModelDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const l = (b: Bilingual) => (locale === "ka" ? b.ka : b.en);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* ── Trigger — Rivian-style rounded card ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border transition-all duration-200 ${
          open
            ? "border-white/20 bg-[#2e3133]"
            : "border-white/[0.1] bg-[#272a2b] hover:border-white/[0.18] hover:bg-[#2e3133]"
        }`}
        style={{
          boxShadow: open
            ? "0 12px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06) inset"
            : "0 4px 20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Thumbnail */}
          <div className="w-14 h-9 shrink-0 overflow-hidden rounded bg-white/[0.04]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.image} alt={selected.familyName} className="w-full h-full object-cover" />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[13px] font-semibold text-white leading-tight truncate" style={{ fontFamily: "var(--font-montserrat)" }}>
              {selected.familyName}
            </p>
            <p className="text-[11px] text-white/45 truncate mt-0.5" style={{ fontFamily: "var(--font-montserrat)" }}>
              {selected.label} · {l(selected.category)}
            </p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-white/45 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Panel ── */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-white/[0.12] bg-[#232628] shadow-card overflow-hidden max-h-72 overflow-y-auto">
          {FAMILIES.map((family) => (
            <div key={family.id}>
              <p
                className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-widest text-white/30"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {family.name}
              </p>
              {family.versions.map((ver) => {
                const sv         = ALL_VERSIONS.find((av) => av.id === ver.id)!;
                const isCurrent  = sv.id === selected.id;
                const isElsewhere = otherIds.includes(sv.id);
                return (
                  <button
                    key={sv.id}
                    disabled={isElsewhere && !isCurrent}
                    onClick={() => { onSelect(sv); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors duration-100 text-left ${
                      isCurrent    ? "bg-white/[0.08]" :
                      isElsewhere  ? "opacity-40 cursor-not-allowed" :
                                     "hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="w-12 h-8 shrink-0 overflow-hidden rounded-sm bg-white/[0.04]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sv.image} alt={sv.familyName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate" style={{ fontFamily: "var(--font-montserrat)" }}>
                        {sv.familyName}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 font-bold ${
                        sv.type === "EV" ? "bg-badge-ev-bg text-badge-ev" : "bg-badge-phev-bg text-badge-phev"
                      }`}>
                        {sv.label}
                      </span>
                    </div>
                    {isCurrent && (
                      <svg className="w-4 h-4 text-byd-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
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

// ── Main component ────────────────────────────────────────────────────────

export default function CompareGrid() {
  const locale = useLocale();
  const l = (b: Bilingual) => (locale === "ka" ? b.ka : b.en);

  const [slots, setSlots] = useState<[SlotVersion, SlotVersion, SlotVersion]>([
    ALL_VERSIONS.find((v) => v.id === DEFAULTS[0])!,
    ALL_VERSIONS.find((v) => v.id === DEFAULTS[1])!,
    ALL_VERSIONS.find((v) => v.id === DEFAULTS[2])!,
  ]);

  const updateSlot = (i: number, ver: SlotVersion) =>
    setSlots((prev) => {
      const next = [...prev] as [SlotVersion, SlotVersion, SlotVersion];
      next[i] = ver;
      return next;
    });

  const GLANCE: { key: string; value: (v: SlotVersion) => string; sub: Bilingual }[] = [
    { key: "drive",  value: (v) => v.specs.drive,        sub: { en: "Drive System", ka: "წამყვანი"      } },
    { key: "range",  value: (v) => v.specs.totalRange,   sub: { en: "Total Range",  ka: "ჯამური მანძილი" } },
    { key: "accel",  value: (v) => v.specs.acceleration, sub: { en: "0–100 km/h",   ka: "0–100 კმ/სთ"   } },
    { key: "power",  value: (v) => v.specs.power,        sub: { en: "Power",         ka: "სიმძლავრე"     } },
  ];

  type DesignKey = keyof SlotVersion["design"];
  const DESIGN_CATS: { key: DesignKey; label: Bilingual }[] = [
    { key: "paint",    label: { en: "Paint",             ka: "ფერი"                  } },
    { key: "wheels",   label: { en: "Wheels & Tires",    ka: "დისკები / საბურავები"  } },
    { key: "interior", label: { en: "Interior",          ka: "სალონი"                } },
    { key: "accents",  label: { en: "Accents & Badging", ka: "აქცენტები"            } },
  ];

  return (
    <div>
      {/* ── Sticky dropdown bar ─────────────────────────────────── */}
      <div className="sticky top-[80px] z-40">
        <div className="section-container py-4">
          <div className="grid grid-cols-3 gap-5">
            {slots.map((slot, i) => (
              <ModelDropdown
                key={i}
                selected={slot}
                onSelect={(v) => updateSlot(i, v)}
                locale={locale}
                otherIds={slots.filter((_, j) => j !== i).map((s) => s.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero images + model info ─────────────────────────────── */}
      <div className="section-container pt-8 pb-0">
        <div className="grid grid-cols-3 gap-4">
          {slots.map((slot, i) => (
            <div key={i}>
              <div className="relative overflow-hidden bg-white/[0.03] mb-5" style={{ aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slot.image}
                  alt={`${slot.familyName} ${slot.label}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 font-bold tracking-wide ${
                  slot.type === "EV" ? "bg-badge-ev-bg text-badge-ev" : "bg-badge-phev-bg text-badge-phev"
                }`}
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {slot.type}
              </span>
              <h2 className="text-h6 font-semibold text-white mt-2 mb-1 leading-tight" style={{ letterSpacing: "-0.01em" }}>
                {slot.familyName}
              </h2>
              <p className="text-body3 text-white/50 mb-3 leading-relaxed">{l(slot.tagline)}</p>
              <p className="text-body3 text-white/30 mb-4" style={{ fontFamily: "var(--font-montserrat)" }}>
                {locale === "ka" ? "ფასისთვის დაგვიკავშირდით" : "Contact for pricing"}
              </p>
              <div className="flex gap-2 flex-wrap pb-8">
                <Link
                  href={`/${locale}/booking`}
                  className="px-4 py-2 bg-byd-red text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#A80912] transition-colors duration-150"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {locale === "ka" ? "ტესტ-დრაივი" : "Test Drive"}
                </Link>
                <Link
                  href={`/${locale}/catalog`}
                  className="px-4 py-2 border border-white/[0.18] text-white text-[11px] font-bold uppercase tracking-widest hover:border-white/35 hover:bg-white/[0.04] transition-all duration-150"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {locale === "ka" ? "კატალოგი" : "View Catalog"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── At a glance ─────────────────────────────────────────── */}
      <div className="section-container">
        <div className="border-t border-white/[0.08] pt-8 pb-2">
          <h2 className="text-h5 font-semibold text-white mb-6" style={{ letterSpacing: "-0.01em" }}>
            {locale === "ka" ? "მიმოხილვა" : "At a glance"}
          </h2>
        </div>
        <div className="border-t border-white/[0.1]">
          {GLANCE.map((row) => (
            <div key={row.key} className="border-b border-white/[0.06] py-6">
              <div className="grid grid-cols-3 gap-4">
                {slots.map((slot, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-white leading-snug" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {row.value(slot)}
                    </p>
                    <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wide" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {l(row.sub)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Design section ──────────────────────────────────────── */}
      <div className="section-container pt-10 pb-4">
        <h2 className="text-h5 font-semibold text-white mb-6" style={{ letterSpacing: "-0.01em" }}>
          {locale === "ka" ? "დიზაინი" : "Design"}
        </h2>
        <div className="border-t border-white/[0.1]">
          {DESIGN_CATS.map((cat) => (
            <div key={cat.key} className="border-b border-white/[0.06] py-6">
              <div className="grid grid-cols-3 gap-4">
                {slots.map((slot, i) => {
                  const options = slot.design[cat.key];
                  return (
                    <div key={i}>
                      <p className="text-xs font-semibold text-white mb-3" style={{ fontFamily: "var(--font-montserrat)" }}>
                        {l(cat.label)}
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {options.map((opt) => {
                          if (cat.key === "wheels") {
                            const w = opt as WheelOption;
                            return (
                              <WheelSwatch key={opt.id} design={w.design} title={l(opt.label)} />
                            );
                          }
                          const c = opt as PaintOption | InteriorOption | AccentOption;
                          return (
                            <div
                              key={opt.id}
                              title={l(opt.label)}
                              className="w-9 h-9 rounded-full border border-white/[0.15] cursor-pointer hover:scale-110 hover:border-white/35 transition-all duration-150"
                              style={{ backgroundColor: c.hex }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Full spec table ──────────────────────────────────────── */}
      <div className="section-container pt-8 pb-16">
        <div className="border-t border-white/[0.08] pt-8 mb-6">
          <h2 className="text-h5 font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>
            {locale === "ka" ? "სრული სპეციფიკაცია" : "Full Specifications"}
          </h2>
        </div>
        <div className="border border-white/[0.08] overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th
                  className="text-left py-4 px-5 text-[10px] text-white/30 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-montserrat)", width: "160px" }}
                >
                  {locale === "ka" ? "სპეც." : "Spec"}
                </th>
                {slots.map((slot, i) => (
                  <th key={i} className="text-left py-4 px-5 align-top" style={{ width: "calc((100% - 160px) / 3)" }}>
                    <span className={`text-[10px] px-1.5 py-0.5 font-bold ${
                      slot.type === "EV" ? "bg-badge-ev-bg text-badge-ev" : "bg-badge-phev-bg text-badge-phev"
                    }`}>
                      {slot.type}
                    </span>
                    <p className="text-sm font-semibold text-white mt-1" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {slot.familyName}
                    </p>
                    <p className="text-[11px] text-white/35 mt-0.5" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {slot.label} · {l(slot.category)}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row, idx) => (
                <tr key={row.key} className={`border-b border-white/[0.04] ${idx % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                  <td className="py-3.5 px-5 text-[11px] text-white/35 uppercase tracking-wider" style={{ fontFamily: "var(--font-montserrat)" }}>
                    {l(row.label)}
                  </td>
                  {slots.map((slot, i) => (
                    <td key={i} className="py-3.5 px-5 text-sm text-white font-medium" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {row.fn(slot, locale)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-white/[0.08] bg-white/[0.02]">
                <td className="py-4 px-5 text-[11px] text-white/35 uppercase tracking-wider" style={{ fontFamily: "var(--font-montserrat)" }}>
                  {locale === "ka" ? "ფასი" : "Price"}
                </td>
                {slots.map((_, i) => (
                  <td key={i} className="py-4 px-5 text-[11px] text-white/30 italic" style={{ fontFamily: "var(--font-montserrat)" }}>
                    {locale === "ka" ? "ფასისთვის დაგვიკავშირდით" : "Contact for pricing"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
