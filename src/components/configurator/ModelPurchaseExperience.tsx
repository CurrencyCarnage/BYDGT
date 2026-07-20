"use client";

import { useCallback, useState } from "react";
import { Link } from "@/i18n/routing";
import type { CarModel } from "@/lib/types";
import { formatPrice, getLocalizedValue } from "@/lib/types";
import CompareButton from "@/components/compare/CompareButton";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ModelConfigurator, { type ConfiguratorSelection } from "./ModelConfigurator";

export function CompareTrimsButton({
  label,
  className,
  style,
}: {
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById("trims")?.scrollIntoView({ behavior: "smooth", block: "start" })}
      className={className}
      style={style}
    >
      {label}
    </button>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="technical-spec-item border-b border-[#E4E7E8] py-3 last:border-b-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A9094]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#252728]">{value}</p>
    </div>
  );
}

export default function ModelPurchaseExperience({ model, locale }: { model: CarModel; locale: string }) {
  const ka = locale === "ka";
  const defaultColor = model.configurations.colors[0] ?? null;
  const defaultVariant = model.configurations.variants[0] ?? null;
  const [selection, setSelection] = useState<ConfiguratorSelection>({
    colorId: defaultColor?.id ?? null,
    colorName: defaultColor ? getLocalizedValue(defaultColor.name, locale) : "—",
    colorHex: defaultColor?.hex ?? null,
    variantId: defaultVariant?.id ?? null,
    variantName: defaultVariant ? getLocalizedValue(defaultVariant.name, locale) : "—",
    totalPrice: model.basePrice + (defaultColor?.priceModifier ?? 0) + (defaultVariant?.priceModifier ?? 0),
  });
  const handleSelectionChange = useCallback((next: ConfiguratorSelection) => setSelection(next), []);
  const modelName = getLocalizedValue(model.name, locale);

  const groups = [
    {
      title: ka ? "სავალი მარაგი და ენერგია" : "Range & energy",
      items: [
        { label: ka ? "სრული მანძილი" : "Total range", value: `${model.specs.range_km} km` },
        ...(model.specs.electric_range_km
          ? [{ label: ka ? "ელექტრო მანძილი" : "Electric range", value: `${model.specs.electric_range_km} km` }]
          : []),
        { label: ka ? "ბატარეა" : "Battery", value: `${model.specs.battery_kwh} kWh` },
      ],
    },
    {
      title: ka ? "წარმადობა" : "Performance",
      items: [
        { label: ka ? "სიმძლავრე" : "Power", value: `${model.specs.power_hp} HP` },
        { label: "0–100 km/h", value: `${model.specs.acceleration_0_100}s` },
        { label: ka ? "მაქს. სიჩქარე" : "Top speed", value: `${model.specs.top_speed_kmh} km/h` },
      ],
    },
    {
      title: ka ? "არჩეული კონფიგურაცია" : "Selected configuration",
      items: [
        { label: ka ? "კომპლექტაცია" : "Trim", value: selection.variantName || "—" },
        { label: ka ? "ექსტერიერის ფერი" : "Exterior color", value: selection.colorName || "—" },
        { label: ka ? "ძარის ტიპი" : "Body type", value: model.category },
      ],
    },
  ];

  return (
    <>
      <section className="bg-[#1C1E1F] py-section-sm md:py-section-lg">
        <div className="section-container">
          <ScrollReveal className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 flex-shrink-0 bg-byd-red" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {ka ? "კონფიგურატორი" : "Configurator"}
              </p>
            </div>
            <h2 className="text-h5 font-semibold text-white md:text-h3" style={{ letterSpacing: "-0.02em" }}>
              {ka ? `${modelName} — კონფიგურაცია` : `Build Your ${modelName}`}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ModelConfigurator model={model} onSelectionChange={handleSelectionChange} />
          </ScrollReveal>
        </div>
      </section>

      <section className="model-specs-section bg-white py-section-sm md:py-section-lg" data-header-theme="light">
        <div className="section-container">
          <ScrollReveal className="mb-8 md:mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 flex-shrink-0 bg-byd-red" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {ka ? "ტექნიკური მონაცემები" : "Technical specifications"}
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-h5 font-semibold text-[#252728] md:text-h3" style={{ letterSpacing: "-0.02em" }}>
                  {ka ? "თქვენი არჩეული ავტომობილი" : "Your selected vehicle"}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-[#686D71]">
                  {ka ? "მონაცემები ახლდება კონფიგურატორში არჩეული ფერისა და კომპლექტაციის მიხედვით." : "Configuration details update as you change color and trim above."}
                </p>
              </div>
              <div className="technical-selection-summary flex items-center gap-3 border border-[#DDE1E3] bg-[#F7F8F8] px-4 py-3">
                {selection.colorHex && <span className="h-8 w-8 border border-black/15" style={{ background: selection.colorHex }} />}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#8A9094]">{selection.variantName}</p>
                  <p className="mt-0.5 text-lg font-bold text-byd-red">{formatPrice(selection.totalPrice)}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid gap-4 lg:grid-cols-3" key={`${selection.variantId}-${selection.colorId}`}>
            {groups.map((group, index) => (
              <ScrollReveal key={group.title} delay={index * 0.06}>
                <div className="technical-spec-card h-full border border-[#DDE1E3] bg-[#FBFBFA] p-5 shadow-[0_12px_30px_rgba(24,28,32,0.05)] md:p-6">
                  <div className="mb-3 flex items-center gap-3 border-b border-[#DDE1E3] pb-4">
                    <span className="flex h-8 w-8 items-center justify-center bg-byd-red text-xs font-bold text-white">0{index + 1}</span>
                    <h3 className="text-base font-bold text-[#252728]">{group.title}</h3>
                  </div>
                  {group.items.map((item) => <SpecItem key={item.label} label={item.label} value={item.value} />)}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="trims" className="model-trims-section scroll-mt-24 bg-[#F3F4F5] py-section-sm md:py-section-lg" data-header-theme="light">
        <div className="section-container">
          <ScrollReveal className="mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 flex-shrink-0 bg-byd-red" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">{ka ? "კომპლექტაციები" : "Trims"}</p>
            </div>
            <h2 className="text-h5 font-semibold text-[#252728] md:text-h3" style={{ letterSpacing: "-0.02em" }}>
              {ka ? "შეადარეთ კომპლექტაციები" : "Compare available trims"}
            </h2>
          </ScrollReveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {model.configurations.variants.map((variant, index) => {
              const variantName = getLocalizedValue(variant.name, locale);
              const selected = variant.id === selection.variantId;
              const price = model.basePrice + variant.priceModifier;
              return (
                <ScrollReveal key={variant.id} delay={index * 0.06}>
                  <article data-selected={selected ? "true" : "false"} className={`trim-card flex h-full flex-col border bg-white p-5 md:p-6 ${selected ? "border-byd-red shadow-[0_18px_42px_rgba(215,12,25,0.10)]" : "border-[#DDE1E3]"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-byd-red">{ka ? `კომპლექტაცია 0${index + 1}` : `Trim 0${index + 1}`}</p>
                        <h3 className="mt-2 text-2xl font-bold text-[#252728]">{variantName}</h3>
                      </div>
                      {selected && <span className="bg-byd-red px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">{ka ? "არჩეული" : "Selected"}</span>}
                    </div>
                    <p className="mt-5 text-[10px] uppercase tracking-[0.14em] text-[#8A9094]">{ka ? "ფასი ფერამდე" : "Price before paint"}</p>
                    <p className="mt-1 text-3xl font-bold text-byd-red">{formatPrice(price)}</p>
                    <div className="my-5 h-px bg-[#E1E4E6]" />
                    <ul className="mb-6 space-y-3">
                      {model.features.slice(0, 3).map((feature) => (
                        <li key={feature.en} className="flex gap-3 text-sm leading-relaxed text-[#4E5356]">
                          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-byd-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
                          </svg>
                          {getLocalizedValue(feature, locale)}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                      <CompareButton
                        modelId={model.id}
                        modelName={`${modelName} ${variantName}`}
                        className="inline-flex min-h-11 items-center justify-center border border-[#C7CDD0] px-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-[#252728] transition-colors hover:border-byd-red hover:text-byd-red"
                      />
                      <Link href={`/booking?model=${encodeURIComponent(model.id)}&version=${encodeURIComponent(variant.id)}`} className="inline-flex min-h-11 items-center justify-center bg-byd-red px-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#A80912]">
                        {ka ? "ტესტ დრაივი" : "BOOK TEST DRIVE"}
                      </Link>
                      <Link href={`/contact?subject=${encodeURIComponent(`${modelName} ${variantName}`)}`} className="inline-flex min-h-11 items-center justify-center border border-[#C7CDD0] px-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-[#252728] transition-colors hover:border-[#252728]">
                        {ka ? "კონტაქტი" : "Contact"}
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
