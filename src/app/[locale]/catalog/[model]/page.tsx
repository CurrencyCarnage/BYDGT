import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { getAllModels, getModelById, getLocalizedValue, formatPrice } from "@/lib/models";
import ModelConfigurator from "@/components/configurator/ModelConfigurator";
import ModelHeroMedia from "@/components/catalog/ModelHeroMedia";

export function generateStaticParams() {
  const models = getAllModels();
  return models.map((model) => ({ model: model.id }));
}

export default function ModelDetailPage({
  params,
}: {
  params: { model: string; locale: string };
}) {
  const model = getModelById(params.model);
  const t = useTranslations("model");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  if (!model) {
    notFound();
  }

  const name = getLocalizedValue(model.name, locale);
  const tagline = getLocalizedValue(model.tagline, locale);

  const specRows = [
    {
      label: t("range"),
      value: `${model.specs.range_km} km`,
    },
    ...(model.specs.electric_range_km
      ? [
          {
            label: t("electricRange"),
            value: `${model.specs.electric_range_km} km`,
          },
        ]
      : []),
    { label: t("power"), value: `${model.specs.power_hp} HP` },
    {
      label: t("acceleration"),
      value: `${model.specs.acceleration_0_100}s`,
    },
    {
      label: t("topSpeed"),
      value: `${model.specs.top_speed_kmh} km/h`,
    },
    {
      label: t("battery"),
      value: `${model.specs.battery_kwh} kWh`,
    },
  ];

  return (
    <div className="pt-24 md:pt-32 pb-section-sm md:pb-section-lg">
      <div className="section-container">
        {/* Back link */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-200 mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {tCommon("back")}
        </Link>

        {/* Hero Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          <ModelHeroMedia
            heroVideo={model.images.heroVideo}
            hero={model.images.hero}
            name={name}
            type={model.type}
            category={model.category}
          />

          {/* Model Info */}
          <div>
            <h1 className="text-3xl md:text-display font-semibold text-text-primary mb-3">
              {name}
            </h1>
            <p className="text-lg text-text-secondary mb-6">{tagline}</p>
            <p className="text-2xl font-bold text-accent mb-8">
              {tCommon("startingFrom")} {formatPrice(model.basePrice)}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              {specRows.slice(0, 4).map((spec) => (
                <div key={spec.label} className="glass-card p-4 hover:translate-y-0">
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    {spec.label}
                  </p>
                  <p className="text-lg font-semibold text-text-primary">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configurator */}
        <div className="mb-16">
          <ModelConfigurator model={model} />
        </div>

        {/* Full Specs Table */}
        <div className="mb-16">
          <h2 className="text-xl md:text-heading font-semibold text-text-primary mb-6">
            {t("specsTitle")}
          </h2>
          <div className="glass-card overflow-hidden">
            {specRows.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex items-center justify-between px-6 py-4 ${
                  i !== specRows.length - 1
                    ? "border-b border-[rgba(255,255,255,0.06)]"
                    : ""
                }`}
              >
                <span className="text-text-secondary">{spec.label}</span>
                <span className="text-text-primary font-medium">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-xl md:text-heading font-semibold text-text-primary mb-6">
            {t("featuresTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {model.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                  <svg
                    className="w-3 h-3 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-text-secondary">
                  {getLocalizedValue(feature, locale)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
