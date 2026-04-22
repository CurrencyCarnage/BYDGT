"use client";

import { useRef, useState } from "react";
import { useLocale } from "next-intl";

// ── Types ──────────────────────────────────────────────────────────────────

type Bilingual = { en: string; ka: string };

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
  tagline: Bilingual;
  image: string;
  specs: VersionSpecs;
};

type ModelFamily = {
  id: string;
  name: string;
  category: Bilingual;
  versions: ModelVersion[];
};

type ComparableVersion = ModelVersion & { familyName: string; category: Bilingual };

// ── Compare Data ──────────────────────────────────────────────────────────

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
        tagline: {
          en: "Super hybrid sedan — long-distance range with low daily consumption.",
          ka: "სუპერ ჰიბრიდული სედანი — გრძელი მარშრუტი, დაბალი ყოველდღიური მოხმარება.",
        },
        image: "/images/models/seal-06-dmi/hero.jpg",
        specs: {
          totalRange: "up to 1,505 km",
          evRange: "up to 140 km",
          power: "156 kW / 210 HP",
          torque: "—",
          acceleration: "8.5 s",
          topSpeed: "180 km/h",
          battery: "10 – 19 kWh",
          drive: "FWD",
          charging: "—",
        },
      },
      {
        id: "seal-06-ev",
        label: "EV",
        type: "EV",
        tagline: {
          en: "Pure electric Seal 06 — efficient, urban-ready, clean sedan styling.",
          ka: "სუფთა ელექტრო Seal 06 — ეფექტური, ქალაქური, მინიმალისტური სედანი.",
        },
        image: "/images/models/seal-06-dmi/hero.jpg",
        specs: {
          totalRange: "425 km WLTC",
          evRange: "425 km",
          power: "95 kW / 127 HP",
          torque: "220 Nm",
          acceleration: "10.9 s",
          topSpeed: "—",
          battery: "56.64 kWh",
          drive: "FWD",
          charging: "DC 65 kW / AC 7 kW",
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
        tagline: {
          en: "Family SUV with DM-i hybrid efficiency and stronger real-world performance.",
          ka: "ოჯახური SUV DM-i ჰიბრიდული ეფექტიანობით და ძლიერი წარმადობით.",
        },
        image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
        specs: {
          totalRange: "up to 1,080 km",
          evRange: "92 km (FWD) / 81 km (AWD)",
          power: "160 kW / 214 HP (FWD)",
          torque: "300 Nm (FWD) / 550 Nm (AWD)",
          acceleration: "8.5 s (FWD) / 5.9 s (AWD)",
          topSpeed: "169 – 179 km/h",
          battery: "18.3 – 32 kWh",
          drive: "FWD / AWD",
          charging: "—",
        },
      },
      {
        id: "sealion-06-ev",
        label: "EV",
        type: "EV",
        tagline: {
          en: "Electric family SUV with longer-range options and premium cabin packaging.",
          ka: "ელექტრო ოჯახური SUV გრძელი მარშრუტითა და პრემიუმ სალონით.",
        },
        image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
        specs: {
          totalRange: "420 – 500 km WLTP",
          evRange: "420 – 500 km",
          power: "160 kW / 214 HP",
          torque: "310 – 330 Nm",
          acceleration: "9.3 – 9.6 s",
          topSpeed: "175 km/h",
          battery: "71.8 – 87 kWh",
          drive: "FWD",
          charging: "DC 150 kW",
        },
      },
    ],
  },
  {
    id: "yuan-up-dmi",
    name: "BYD Yuan Up",
    category: { en: "Compact SUV · DM-i", ka: "კომპაქტ SUV · DM-i" },
    versions: [
      {
        id: "yuan-up-dmi",
        label: "DM-i",
        type: "PHEV",
        tagline: {
          en: "Smart compact hybrid SUV — efficient city driving with extended total range.",
          ka: "ჭკვიანი კომპაქტური ჰიბრიდი — ეკონომიური ქალაქური მართვა და გრძელი მარშრუტი.",
        },
        image: "/images/models/yuan-up-dmi/hero.jpg",
        specs: {
          totalRange: "1,100 km",
          evRange: "80 km",
          power: "110 kW / 150 HP",
          torque: "—",
          acceleration: "8.9 s",
          topSpeed: "170 km/h",
          battery: "12.9 kWh",
          drive: "FWD",
          charging: "—",
        },
      },
    ],
  },
  {
    id: "yuan-up-ev",
    name: "BYD Yuan Up",
    category: { en: "Compact SUV · EV", ka: "კომპაქტ SUV · EV" },
    versions: [
      {
        id: "yuan-up-ev",
        label: "EV",
        type: "EV",
        tagline: {
          en: "Compact electric SUV built for city use, easy ownership, and youthful BYD styling.",
          ka: "კომპაქტური ელექტრო SUV ქალაქური გამოყენებისა და ახალგაზრდული სტილისთვის.",
        },
        image: "/images/models/yuan-up-ev/hero.jpg",
        specs: {
          totalRange: "380 km NEDC",
          evRange: "380 km",
          power: "130 kW / 174 HP",
          torque: "290 Nm",
          acceleration: "7.9 s",
          topSpeed: "—",
          battery: "45 kWh (Blade LFP)",
          drive: "FWD",
          charging: "DC 65 kW / AC 5.6 kW",
        },
      },
    ],
  },
];

const ALL_VERSIONS: ComparableVersion[] = FAMILIES.flatMap((f) =>
  f.versions.map((v) => ({ ...v, familyName: f.name, category: f.category }))
);

// ── Spec rows ─────────────────────────────────────────────────────────────

const SPEC_ROWS: {
  key: string;
  label: Bilingual;
  fn: (v: ComparableVersion) => string;
}[] = [
  {
    key: "type",
    label: { en: "Powertrain", ka: "ძრავი" },
    fn: (v) => (v.type === "EV" ? "Electric" : "Plug-in Hybrid"),
  },
  {
    key: "category",
    label: { en: "Body Type", ka: "ძარის ტიპი" },
    fn: () => "", // handled separately with locale
  },
  {
    key: "totalRange",
    label: { en: "Total Range", ka: "ჯამური მანძილი" },
    fn: (v) => v.specs.totalRange,
  },
  {
    key: "evRange",
    label: { en: "EV-only Range", ka: "ელ. მარშრუტი" },
    fn: (v) => v.specs.evRange,
  },
  {
    key: "power",
    label: { en: "Power", ka: "სიმძლავრე" },
    fn: (v) => v.specs.power,
  },
  {
    key: "torque",
    label: { en: "Torque", ka: "მომენტი" },
    fn: (v) => v.specs.torque,
  },
  {
    key: "acceleration",
    label: { en: "0–100 km/h", ka: "0–100 კმ/სთ" },
    fn: (v) => v.specs.acceleration,
  },
  {
    key: "topSpeed",
    label: { en: "Top Speed", ka: "მაქს. სიჩქარე" },
    fn: (v) => v.specs.topSpeed,
  },
  {
    key: "battery",
    label: { en: "Battery", ka: "ბატარეა" },
    fn: (v) => v.specs.battery,
  },
  {
    key: "drive",
    label: { en: "Drive", ka: "წამყვანი" },
    fn: (v) => v.specs.drive,
  },
  {
    key: "charging",
    label: { en: "Charging", ka: "დამუხტვა" },
    fn: (v) => v.specs.charging,
  },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function CompareGrid() {
  const locale = useLocale();
  const l = (b: Bilingual) => (locale === "ka" ? b.ka : b.en);

  // Active version tab per family
  const [activeVersions, setActiveVersions] = useState<Record<string, string>>(
    Object.fromEntries(FAMILIES.map((f) => [f.id, f.versions[0].id]))
  );

  // Selected version IDs for comparison (max 3)
  const [selected, setSelected] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Arrow nav — one card width + gap
  const SCROLL_STEP = 336;
  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });

  // Momentum drag
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef<number | null>(null);

  const cancelMomentum = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    cancelMomentum();
    isDragging.current = true;
    dragStartX.current = e.pageX;
    scrollStartLeft.current = scrollRef.current?.scrollLeft ?? 0;
    lastX.current = e.pageX;
    velocity.current = 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    velocity.current = lastX.current - e.pageX;
    lastX.current = e.pageX;
    scrollRef.current.scrollLeft = scrollStartLeft.current + (dragStartX.current - e.pageX);
  };

  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const applyMomentum = () => {
      if (!scrollRef.current || Math.abs(velocity.current) < 0.5) return;
      scrollRef.current.scrollLeft += velocity.current;
      velocity.current *= 0.88;
      rafId.current = requestAnimationFrame(applyMomentum);
    };
    rafId.current = requestAnimationFrame(applyMomentum);
  };

  const toggleSelect = (versionId: string) => {
    setSelected((prev) =>
      prev.includes(versionId)
        ? prev.filter((id) => id !== versionId)
        : prev.length < 3
        ? [...prev, versionId]
        : prev
    );
  };

  const comparing = ALL_VERSIONS.filter((v) => selected.includes(v.id));

  return (
    <div>
      {/* ── Hint text + arrow nav ─────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <p
          className="text-sm text-text-muted"
          style={{ fontFamily: "var(--font-source-sans)" }}
        >
          {locale === "ka"
            ? `ვერსია გადართეთ ჩანართებით და დაამატეთ შედარებაში (${selected.length}/3)`
            : `Switch versions via tabs, then add to compare (${selected.length}/3)`}
        </p>
        {/* Arrow navigation */}
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-white/[0.12] flex items-center justify-center text-text-muted hover:border-white/30 hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-white/[0.12] flex items-center justify-center text-text-muted hover:border-white/30 hover:text-white transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Horizontal scrollable selector ────────────────────────── */}
      <div className="mb-12">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 select-none"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
            cursor: isDragging.current ? "grabbing" : "grab",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Small left spacer so first card border is never clipped */}
          <div className="shrink-0 w-px" />

          {FAMILIES.map((family) => {
            const activeId = activeVersions[family.id];
            const activeV = family.versions.find((v) => v.id === activeId)!;
            const isSelected = selected.includes(activeId);
            const isDisabled = !isSelected && selected.length >= 3;

            return (
              /* ── Landscape card: image left, content right ── */
              <div
                key={family.id}
                onClick={() => !isDisabled && toggleSelect(activeId)}
                className={`shrink-0 w-80 flex flex-row rounded-card border overflow-hidden transition-all duration-300 cursor-pointer group/card ${
                  isSelected
                    ? "border-accent shadow-glow"
                    : isDisabled
                    ? "border-white/[0.06] opacity-50 cursor-not-allowed"
                    : "border-white/[0.1] hover:border-white/[0.28] hover:shadow-glow-sm"
                }`}
                style={{ scrollSnapAlign: "start", height: "190px" }}
              >
                {/* Left accent bar — lit when selected */}
                <div
                  className={`w-0.5 shrink-0 transition-all duration-300 ${
                    isSelected ? "bg-accent" : "bg-transparent"
                  }`}
                />

                {/* Image — 42% width, full height */}
                <div className="relative w-[42%] shrink-0 overflow-hidden bg-white/[0.03]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeV.image}
                    alt={`${family.name} ${activeV.label}`}
                    className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover/card:scale-105"
                    draggable={false}
                  />
                  {/* Right-side fade into content area */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg-primary/60" />
                  {/* Bottom fade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/50 via-transparent to-transparent" />

                  {/* Selected checkmark */}
                  {isSelected && (
                    <div className="absolute top-2.5 left-2.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                      <svg className="w-3 h-3 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content — 58% width */}
                <div className="flex flex-col flex-1 px-4 py-3 min-w-0">
                  {/* Top row: category + type badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <p
                      className="text-[10px] text-text-muted uppercase tracking-widest truncate"
                      style={{ fontFamily: "var(--font-source-sans)" }}
                    >
                      {l(family.category)}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1 ${
                        activeV.type === "EV"
                          ? "bg-badge-ev-bg text-badge-ev"
                          : "bg-badge-phev-bg text-badge-phev"
                      }`}
                    >
                      {activeV.type}
                    </span>
                  </div>

                  {/* Model name */}
                  <h3
                    className="text-sm font-bold text-white mb-2 leading-tight"
                    style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "-0.01em" }}
                  >
                    {family.name}
                  </h3>

                  {/* Version tabs */}
                  {family.versions.length > 1 && (
                    <div className="flex gap-1 mb-2.5">
                      {family.versions.map((version) => {
                        const isActive = activeId === version.id;
                        return (
                          <button
                            key={version.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveVersions((prev) => ({ ...prev, [family.id]: version.id }));
                            }}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide transition-all duration-200 ${
                              isActive
                                ? version.type === "EV"
                                  ? "bg-badge-ev-bg text-badge-ev border border-badge-ev/40"
                                  : "bg-badge-phev-bg text-badge-phev border border-badge-phev/40"
                                : "border border-white/[0.12] text-text-muted hover:border-white/30"
                            }`}
                            style={{ fontFamily: "var(--font-source-sans)" }}
                          >
                            {version.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 3 key specs — first segment only to prevent wrapping */}
                  <div className="flex gap-3">
                    {[
                      {
                        label: locale === "ka" ? "მანძილი" : "Range",
                        value: activeV.specs.totalRange.replace("up to ", "").split(" ").slice(0, 2).join(" "),
                      },
                      {
                        label: locale === "ka" ? "სიმძლ." : "Power",
                        value: activeV.specs.power.split("/")[1]?.trim() ?? activeV.specs.power,
                      },
                      {
                        label: "0–100",
                        value: activeV.specs.acceleration.split("/")[0].trim(),
                      },
                    ].map((s) => (
                      <div key={s.label} className="min-w-0">
                        <p
                          className="text-xs font-bold text-white leading-tight truncate"
                          style={{ fontFamily: "var(--font-source-sans)" }}
                        >
                          {s.value}
                        </p>
                        <p
                          className="text-[10px] text-text-muted mt-0.5 uppercase tracking-wide"
                          style={{ fontFamily: "var(--font-source-sans)" }}
                        >
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Spacer pushes button to bottom regardless of content height */}
                  <div className="flex-1" />

                  {/* Add / Remove button — always pinned to bottom */}
                  <button
                    onClick={(e) => { e.stopPropagation(); if (!isDisabled) toggleSelect(activeId); }}
                    disabled={isDisabled}
                    className={`w-full py-1.5 rounded-button text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${
                      isSelected
                        ? "bg-accent text-bg-primary"
                        : isDisabled
                        ? "border border-white/[0.08] text-text-muted cursor-not-allowed"
                        : "border border-accent/40 text-accent hover:bg-accent/10 hover:border-accent"
                    }`}
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    {isSelected
                      ? locale === "ka" ? "✓ ამოშლა" : "✓ Remove"
                      : locale === "ka" ? "+ დამატება" : "+ Compare"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Small right spacer for last card */}
          <div className="shrink-0 w-1" />
        </div>
      </div>

      {/* ── Comparison table ──────────────────────────────────────── */}
      {comparing.length > 0 ? (
        <div>
          <p
            className="text-xs text-text-muted uppercase tracking-[0.2em] mb-6"
            style={{ fontFamily: "var(--font-source-sans)" }}
          >
            {locale === "ka" ? "შედარება" : "Side-by-side comparison"}
          </p>
          <div className="overflow-x-auto rounded-card border border-white/[0.08]">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th
                    className="text-left py-5 px-5 text-xs text-text-muted uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-source-sans)", width: "140px" }}
                  >
                    {locale === "ka" ? "სპეც." : "Spec"}
                  </th>
                  {comparing.map((v) => (
                    <th
                      key={v.id}
                      className="text-left py-5 px-5 align-top"
                      style={{ width: `calc((100% - 140px) / ${comparing.length})` }}
                    >
                      <div className="rounded-lg overflow-hidden mb-3 h-28 bg-white/[0.03]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.image}
                          alt={`${v.familyName} ${v.label}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span
                        className={`text-caption px-2 py-0.5 rounded-full ${
                          v.type === "EV"
                            ? "bg-badge-ev-bg text-badge-ev"
                            : "bg-badge-phev-bg text-badge-phev"
                        }`}
                      >
                        {v.type}
                      </span>
                      <p
                        className="text-sm font-semibold text-white mt-1.5"
                        style={{ fontFamily: "var(--font-source-sans)" }}
                      >
                        {v.familyName}
                      </p>
                      <p
                        className="text-xs text-text-muted mt-0.5"
                        style={{ fontFamily: "var(--font-source-sans)" }}
                      >
                        {v.label} · {l(v.category)}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SPEC_ROWS.map((row, i) => (
                  <tr
                    key={row.key}
                    className={`border-b border-white/[0.04] ${
                      i % 2 === 0 ? "bg-white/[0.015]" : ""
                    }`}
                  >
                    <td
                      className="py-3.5 px-5 text-xs text-text-muted uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-source-sans)" }}
                    >
                      {l(row.label)}
                    </td>
                    {comparing.map((v) => (
                      <td
                        key={v.id}
                        className="py-3.5 px-5 text-sm text-white font-medium"
                        style={{ fontFamily: "var(--font-source-sans)" }}
                      >
                        {row.key === "category" ? l(v.category) : row.fn(v)}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Price note row */}
                <tr className="border-t border-white/[0.08] bg-white/[0.02]">
                  <td
                    className="py-4 px-5 text-xs text-text-muted uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    {locale === "ka" ? "ფასი" : "Price"}
                  </td>
                  {comparing.map((v) => (
                    <td
                      key={v.id}
                      className="py-4 px-5 text-xs text-text-muted italic"
                      style={{ fontFamily: "var(--font-source-sans)" }}
                    >
                      {locale === "ka"
                        ? "ფასისთვის დაგვიკავშირდით"
                        : "Contact for pricing"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border border-white/[0.06] rounded-card">
          <div className="text-3xl mb-4 opacity-30">⇄</div>
          <p
            className="text-text-muted text-sm"
            style={{ fontFamily: "var(--font-source-sans)" }}
          >
            {locale === "ka"
              ? "ზემოდან ერთი ან მეტი მოდელი დაამატეთ შედარებაში"
              : "Add one or more models above to begin comparing"}
          </p>
        </div>
      )}
    </div>
  );
}
