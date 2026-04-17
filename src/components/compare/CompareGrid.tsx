"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CarModel, formatPrice, getLocalizedValue } from "@/lib/types";

interface CompareGridProps {
  models: CarModel[];
}

export default function CompareGrid({ models }: CompareGridProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const t = useTranslations("model");
  const locale = useLocale();

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const comparing = models.filter((m) => selected.includes(m.id));

  const specRows = [
    { key: "type", label: locale === "ka" ? "ტიპი" : "Type", fn: (m: CarModel) => m.type },
    { key: "category", label: locale === "ka" ? "კატეგორია" : "Category", fn: (m: CarModel) => m.category },
    { key: "price", label: locale === "ka" ? "საწყისი ფასი" : "Starting Price", fn: (m: CarModel) => formatPrice(m.basePrice) },
    { key: "range", label: t("range"), fn: (m: CarModel) => `${m.specs.range_km} km` },
    { key: "elec_range", label: t("electricRange"), fn: (m: CarModel) => m.specs.electric_range_km ? `${m.specs.electric_range_km} km` : "—" },
    { key: "power", label: t("power"), fn: (m: CarModel) => `${m.specs.power_hp} HP` },
    { key: "acc", label: t("acceleration"), fn: (m: CarModel) => `${m.specs.acceleration_0_100}s` },
    { key: "top", label: t("topSpeed"), fn: (m: CarModel) => `${m.specs.top_speed_kmh} km/h` },
    { key: "bat", label: t("battery"), fn: (m: CarModel) => `${m.specs.battery_kwh} kWh` },
  ];

  return (
    <div>
      {/* Model selector */}
      <div className="mb-10">
        <p className="text-sm text-white/50 mb-5" style={{ fontFamily: "var(--font-source-sans)" }}>
          {locale === "ka"
            ? `აირჩიეთ მაქს. 3 მოდელი შესადარებლად (${selected.length}/3)`
            : `Select up to 3 models to compare (${selected.length}/3)`}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {models.map((model) => {
            const isSelected = selected.includes(model.id);
            const isDisabled = !isSelected && selected.length >= 3;
            return (
              <button
                key={model.id}
                onClick={() => toggle(model.id)}
                disabled={isDisabled}
                className={`p-4 rounded-card border text-left transition-all duration-200 ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : isDisabled
                    ? "border-white/5 opacity-40 cursor-not-allowed"
                    : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-caption px-2 py-0.5 rounded-full ${model.type === "EV" ? "bg-badge-ev-bg text-badge-ev" : "bg-badge-phev-bg text-badge-phev"}`}>
                    {model.type}
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-accent bg-accent" : "border-white/30"}`}>
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="text-sm font-semibold text-white mt-2" style={{ fontFamily: "var(--font-source-sans)" }}>
                  {getLocalizedValue(model.name, locale)}
                </p>
                <p className="text-xs text-accent mt-1">{formatPrice(model.basePrice)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison table */}
      {comparing.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left py-4 pr-6 text-xs text-white/30 uppercase tracking-widest w-40" style={{ fontFamily: "var(--font-source-sans)" }}>
                  {locale === "ka" ? "სპეციფიკაცია" : "Spec"}
                </th>
                {comparing.map((m) => (
                  <th key={m.id} className="text-left py-4 px-4 min-w-[160px]">
                    <div>
                      <span className={`text-caption px-2 py-0.5 rounded-full ${m.type === "EV" ? "bg-badge-ev-bg text-badge-ev" : "bg-badge-phev-bg text-badge-phev"}`}>
                        {m.type}
                      </span>
                      <p className="text-sm font-semibold text-white mt-1" style={{ fontFamily: "var(--font-source-sans)" }}>
                        {getLocalizedValue(m.name, locale)}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row, i) => (
                <tr key={row.key} className={`border-b border-white/[0.04] ${i % 2 === 0 ? "bg-white/[0.015]" : ""}`}>
                  <td className="py-3.5 pr-6 text-xs text-white/40 uppercase tracking-wider" style={{ fontFamily: "var(--font-source-sans)" }}>
                    {row.label}
                  </td>
                  {comparing.map((m) => (
                    <td key={m.id} className="py-3.5 px-4 text-sm text-white font-medium" style={{ fontFamily: "var(--font-source-sans)" }}>
                      {row.fn(m)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {comparing.length === 0 && (
        <div className="text-center py-20 border border-white/[0.06] rounded-card">
          <p className="text-white/30 text-sm" style={{ fontFamily: "var(--font-source-sans)" }}>
            {locale === "ka" ? "შეარჩიეთ მოდელები ზემოდან შესადარებლად" : "Select models above to start comparing"}
          </p>
        </div>
      )}
    </div>
  );
}
