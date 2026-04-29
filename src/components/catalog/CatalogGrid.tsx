"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import ModelCard from "@/components/catalog/ModelCard";
import { CarModel } from "@/lib/types";

interface CatalogGridProps {
  models: CarModel[];
}

export default function CatalogGrid({ models }: CatalogGridProps) {
  const [filter, setFilter] = useState<"all" | "EV" | "PHEV">("all");
  const t = useTranslations("catalog");
  const locale = useLocale();

  const filteredModels =
    filter === "all" ? models : models.filter((m) => m.type === filter);

  const filters: { key: "all" | "EV" | "PHEV"; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "EV", label: t("filterEV") },
    { key: "PHEV", label: t("filterPHEV") },
  ];

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-5 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-200 ${
              filter === f.key
                ? "bg-byd-red text-white"
                : "text-white/50 hover:text-white border border-white/[0.10] hover:border-white/[0.25]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModels.map((model) => (
          <ModelCard key={model.id} model={model} locale={locale} />
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-20 text-white/35">
          <p>No models found for this filter.</p>
        </div>
      )}
    </>
  );
}
