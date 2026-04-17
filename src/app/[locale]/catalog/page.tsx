import { useTranslations } from "next-intl";
import { getAvailableModels } from "@/lib/models";
import CatalogGrid from "@/components/catalog/CatalogGrid";

export default function CatalogPage() {
  const t = useTranslations("catalog");
  const models = getAvailableModels();

  return (
    <div className="pt-24 md:pt-32 pb-section-sm md:pb-section-lg">
      <div className="section-container">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-display font-semibold text-text-primary mb-3">
            {t("title")}
          </h1>
          <p className="text-text-secondary text-lg">{t("subtitle")}</p>
        </div>

        <CatalogGrid models={models} />
      </div>
    </div>
  );
}
