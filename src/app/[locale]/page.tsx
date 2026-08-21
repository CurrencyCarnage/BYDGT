import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import LandingPage from "@/components/landing/LandingPage";
import type { ServicePickerModel } from "@/components/landing/landingPage.data";
import { getAvailableModels, getLocalizedValue, getVariantDetails } from "@/lib/models";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "landing.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function GatewayPage({ params }: { params: { locale: string } }) {
  const models = await getAvailableModels();
  const serviceModels: ServicePickerModel[] = models.map((model) => ({
    value: model.id,
    label: getLocalizedValue(model.name, params.locale).replace(/^BYD\s+/i, ""),
    name: getLocalizedValue(model.name, params.locale).replace(/\s+(?:DM-i|EV)$/i, ""),
    image: model.images.hero,
    powertrain: model.type,
    years: Array.from(new Set(model.years?.length ? model.years : [model.year])).sort((a, b) => b - a),
    variants: model.configurations.variants
      .filter((variant) => !model.trimDetails || Boolean(model.trimDetails[variant.id]))
      .map((variant) => ({
        value: variant.id,
        label: getLocalizedValue(getVariantDetails(model, variant).name, params.locale),
      })),
  }));

  return <LandingPage serviceModels={serviceModels} />;
}
