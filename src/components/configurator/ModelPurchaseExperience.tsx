"use client";

import { useState, type ReactNode } from "react";
import { Link } from "@/i18n/routing";
import type { CarModel, CarSpecs, LocalizedString, VariantOption } from "@/lib/types";
import { formatPrice, getLocalizedValue, getOfficialVariants, getVariantDetails } from "@/lib/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CompareButton from "@/components/compare/CompareButton";
import ModelConfigurator from "./ModelConfigurator";

type TrimEntry = {
  variant: VariantOption;
  name: string;
  specs: CarSpecs;
  highlights: LocalizedString[];
  price: number | null;
};

type SpecRow = { label: string; values: (string | null)[] };
type SpecGroup = { title: string; icon: "range" | "performance" | "charging"; rows: SpecRow[] };

const GROUP_ICONS: Record<SpecGroup["icon"], ReactNode> = {
  range: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden="true">
      <rect x="6" y="3" width="12" height="18" rx="2" strokeLinejoin="round" />
      <path d="M10 1.8h4" strokeLinecap="round" />
      <path d="M12 7.5v4h2.4L12 16.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  performance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 11 13" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  charging: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden="true">
      <path d="M13 2 5.5 13.5H11L10 22l8-11.8h-5.5L13 2Z" strokeLinejoin="round" />
    </svg>
  ),
};

function buildGroups(trims: TrimEntry[], ka: boolean): SpecGroup[] {
  const specsList = trims.map((trim) => trim.specs);
  const row = (label: string, read: (specs: CarSpecs) => string | null): SpecRow | null => {
    const values = specsList.map(read);
    return values.some((value) => value !== null) ? { label, values } : null;
  };
  const withUnit = (value: number | undefined, unit: string) =>
    value === undefined || value === null ? null : `${value} ${unit}`;

  const rangeLabel = specsList.find((specs) => specs.range_label)?.range_label ?? (ka ? "სავალი მარაგი" : "Range");
  const electricLabel =
    specsList.find((specs) => specs.electric_range_label)?.electric_range_label ??
    (ka ? "ელექტრო სავალი მარაგი" : "Electric range");
  const usesKw = specsList.some((specs) => specs.power_kw !== undefined);

  const groups: (SpecGroup | null)[] = [
    {
      title: ka ? "მანძილი და ენერგია" : "Range & energy",
      icon: "range" as const,
      rows: [
        row(rangeLabel, (specs) => withUnit(specs.range_km, "km")),
        row(electricLabel, (specs) => withUnit(specs.electric_range_km, "km")),
        row(ka ? "ბატარეა" : "Battery", (specs) => withUnit(specs.battery_kwh, "kWh")),
      ].filter(Boolean) as SpecRow[],
    },
    {
      title: ka ? "წარმადობა" : "Performance",
      icon: "performance" as const,
      rows: [
        row(ka ? "სიმძლავრე" : "Power", (specs) =>
          usesKw ? withUnit(specs.power_kw, "kW") : withUnit(specs.power_hp, "HP")
        ),
        row(ka ? "მაბრუნი მომენტი" : "Torque", (specs) => withUnit(specs.torque_nm, "N·m")),
        row("0–100 km/h", (specs) =>
          specs.acceleration_0_100 === undefined || specs.acceleration_0_100 === null
            ? null
            : `${specs.acceleration_0_100}s`
        ),
        row(ka ? "მაქს. სიჩქარე" : "Top speed", (specs) => withUnit(specs.top_speed_kmh, "km/h")),
      ].filter(Boolean) as SpecRow[],
    },
    {
      title: ka ? "დამუხტვა" : "Charging",
      icon: "charging" as const,
      rows: [
        row("AC", (specs) => withUnit(specs.charging_ac_kw, "kW")),
        row("DC", (specs) => withUnit(specs.charging_dc_kw, "kW")),
      ].filter(Boolean) as SpecRow[],
    },
  ];

  return groups.filter((group): group is SpecGroup => group !== null && group.rows.length > 0);
}

function SpecMatrixCard({
  group,
  activeIndex,
  columns,
}: {
  group: SpecGroup;
  activeIndex: number;
  columns: number;
}) {
  return (
    <div className="model-trims-card p-5 md:p-6">
      <div className="model-trims-card-heading mb-4 flex items-center gap-3 pb-4">
        <span className="model-trims-card-icon flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full">
          {GROUP_ICONS[group.icon]}
        </span>
        <h3 className="model-trims-card-title text-base font-bold">{group.title}</h3>
      </div>
      <div className="space-y-3">
        {group.rows.map((specRow) => (
          <div key={specRow.label} className="model-trims-row pb-3 last:pb-0">
            <p className="model-trims-row-label text-[10px] font-semibold uppercase tracking-[0.14em]">
              {specRow.label}
            </p>
            <div
              className="mt-1.5 grid items-baseline gap-2"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {specRow.values.map((value, index) => {
                const isActive = index === activeIndex;
                return (
                  <p
                    key={index}
                    className={`transition-all duration-200 ${
                      index === 0 ? "text-left" : index === columns - 1 ? "text-right" : "text-center"
                    } ${
                      isActive
                        ? "model-trims-value-active text-lg font-bold md:text-xl"
                        : "model-trims-value text-sm font-medium"
                    }`}
                  >
                    {value ?? "—"}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ModelPurchaseExperience({ model, locale }: { model: CarModel; locale: string }) {
  const ka = locale === "ka";
  const officialVariants = getOfficialVariants(model);
  const [selectedVariantId, setSelectedVariantId] = useState(officialVariants[0]?.id ?? null);
  const modelName = getLocalizedValue(model.name, locale);

  const trims: TrimEntry[] = officialVariants.map((variant) => {
    const details = getVariantDetails(model, variant);
    return {
      variant,
      name: getLocalizedValue(details.name, locale),
      specs: details.specs,
      highlights: details.highlights,
      price: model.priceStatus === "contact" ? null : (model.basePrice ?? 0) + variant.priceModifier,
    };
  });

  const activeIndex = Math.max(
    0,
    trims.findIndex((trim) => trim.variant.id === selectedVariantId)
  );
  const activeTrim = trims[activeIndex] ?? null;
  const groups = trims.length > 0 ? buildGroups(trims, ka) : [];

  const bookingHref =
    "/booking?version=" +
    encodeURIComponent(model.id) +
    (activeTrim ? "&trim=" + encodeURIComponent(activeTrim.variant.id) : "");
  const contactHref =
    "/contact?subject=" +
    encodeURIComponent(
      modelName +
        (activeTrim ? " " + getLocalizedValue(getVariantDetails(model, activeTrim.variant).name, "en") : "")
    );

  return (
    <div className="model-purchase-experience">
      <section id="configurator" className="scroll-mt-24 bg-[#1C1E1F] pb-0 pt-section-sm md:pt-section-lg">
        <div className="section-container">
          <ScrollReveal className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
              {ka ? "კონფიგურატორი" : "Configurator"}
            </p>
            <h2 className="mt-3 text-h5 font-semibold text-white md:text-h3">
              {ka ? modelName + " — კონფიგურაცია" : "Build Your " + modelName}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ModelConfigurator
              model={model}
              selectedVariantId={selectedVariantId}
              onVariantChange={setSelectedVariantId}
            />
          </ScrollReveal>
        </div>
      </section>

      {activeTrim && (
        <section id="trims" className="model-trims-section scroll-mt-24 pb-section-sm pt-8 md:pb-section-lg md:pt-10">
          <div className="section-container">
            <ScrollReveal className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {ka ? "კომპლექტაციები" : "Trims"}
              </p>
              <h2 className="model-trims-heading mt-3 text-h5 font-semibold md:text-h3">
                {ka ? "აირჩიეთ ოფიციალური კომპლექტაცია" : "Choose your official trim"}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.06}>
              <div className="model-trims-panel p-5 md:p-8">
                {/* ── Trim selector + actions ── */}
                <div className="flex flex-col gap-5 xl:flex-row xl:items-stretch xl:justify-between">
                  <div
                    className={`grid flex-1 grid-cols-1 gap-3 sm:gap-0 ${
                      trims.length >= 3 ? "sm:grid-cols-3" : trims.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"
                    }`}
                  >
                    {trims.map((trim, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={trim.variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(trim.variant.id)}
                          aria-pressed={isActive}
                          className={`model-trims-tab ${
                            isActive ? "model-trims-tab-active" : ""
                          } px-0 py-2 text-left transition-colors duration-200 sm:px-5`}
                        >
                          <span className="model-trims-tab-bar" aria-hidden="true" />
                          <span className="model-trims-tab-name block text-lg font-bold md:text-xl">{trim.name}</span>
                          <span className="model-trims-tab-caption mt-2 block text-[10px] font-semibold uppercase tracking-[0.14em]">
                            {ka ? "ფასი შეღებვამდე" : "Price before paint"}
                          </span>
                          <span className="model-trims-tab-price mt-1 block text-base font-bold md:text-lg">
                            {trim.price === null
                              ? ka
                                ? "ფასისთვის დაგვიკავშირდით"
                                : "Contact for pricing"
                              : formatPrice(trim.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="model-trims-actions grid gap-2 sm:grid-cols-3 xl:flex xl:items-center xl:pl-8">
                    <CompareButton
                      modelId={model.id}
                      modelName={modelName}
                      className="model-trims-action inline-flex min-h-11 items-center justify-center px-4 text-center text-xs font-bold uppercase leading-tight"
                    />
                    <Link
                      href={bookingHref}
                      className="model-trims-action model-trims-action-primary inline-flex min-h-11 items-center justify-center px-4 text-center text-xs font-bold uppercase leading-tight"
                    >
                      {ka ? "ტესტ დრაივი" : "BOOK TEST DRIVE"}
                    </Link>
                    <Link
                      href={contactHref}
                      className="model-trims-action inline-flex min-h-11 items-center justify-center px-4 text-center text-xs font-bold uppercase leading-tight"
                    >
                      {ka ? "კონტაქტი" : "Enquire"}
                    </Link>
                  </div>
                </div>

                <div className="model-trims-divider my-6" />

                {/* ── Spec matrix — every trim, selected one highlighted ── */}
                {groups.length > 0 && (
                  <div className="grid gap-4 lg:grid-cols-3">
                    {groups.map((group) => (
                      <SpecMatrixCard
                        key={group.title}
                        group={group}
                        activeIndex={activeIndex}
                        columns={trims.length}
                      />
                    ))}
                  </div>
                )}

                {/* ── Highlights of the selected trim ── */}
                {activeTrim.highlights.length > 0 && (
                  <ul className="mt-6 grid gap-3 md:grid-cols-2">
                    {activeTrim.highlights.map((highlight) => (
                      <li key={highlight.en} className="model-trims-highlight flex gap-3 text-sm leading-relaxed">
                        <span className="mt-1.5 h-2 w-2 flex-shrink-0 bg-byd-red" />
                        {getLocalizedValue(highlight, locale)}
                      </li>
                    ))}
                  </ul>
                )}

              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  );
}
