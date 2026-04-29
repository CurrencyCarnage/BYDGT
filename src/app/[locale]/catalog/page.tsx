import { getTranslations, getLocale } from "next-intl/server";
import { getAvailableModels } from "@/lib/models";
import CatalogGrid from "@/components/catalog/CatalogGrid";

export default async function CatalogPage() {
  const [t, locale, models] = await Promise.all([
    getTranslations("catalog"),
    getLocale(),
    getAvailableModels(),
  ]);

  return (
    <div className="bg-byd-dark">

      {/* ── Header — dark hero strip ── */}
      <div className="bg-[#1C1E1F] border-b border-white/[0.06]" style={{ paddingTop: "80px" }}>
        <div className="section-container py-14 md:py-20">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
              {locale === "ka" ? "ავტომობილები" : "Vehicles"}
            </p>
          </div>
          <h1 className="text-h2 font-semibold text-white mb-4 leading-[1.15]" style={{ letterSpacing: "-0.02em" }}>
            {t("title")}
          </h1>
          <p className="text-body1 text-white/45 font-light max-w-xl">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="section-container py-12 md:py-16">
        <CatalogGrid models={models} />
      </div>

    </div>
  );
}
