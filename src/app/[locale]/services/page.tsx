import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import DestinationPage from "@/components/landing/DestinationPage";
import { serviceCategories, serviceModels } from "@/components/landing/landingPage.data";

type ServicesSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "landing.destination.services" });
  return { title: t("title"), description: t("description") };
}

export default async function ServicesPage({ searchParams }: { searchParams: ServicesSearchParams }) {
  const t = await getTranslations("landing.destination");
  const formT = await getTranslations("landing.services.form");
  const model = firstValue(searchParams.model);
  const year = firstValue(searchParams.year);
  const category = firstValue(searchParams.category);
  const modelLabel = serviceModels.find((item) => item.value === model)?.label ?? model;
  const categoryLabel = category && serviceCategories.includes(category as (typeof serviceCategories)[number])
    ? formT(`categories.${category}`)
    : category;

  const selections = [
    modelLabel ? { label: t("services.model"), value: modelLabel } : null,
    year ? { label: t("services.year"), value: year } : null,
    categoryLabel ? { label: t("services.category"), value: categoryLabel } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return (
    <DestinationPage
      eyebrow={t("services.eyebrow")}
      title={t("services.title")}
      description={t("services.description")}
      status={t("services.status")}
      backLabel={t("back")}
      selectionsTitle={t("services.selectionsTitle")}
      selections={selections}
      emptySelection={t("services.emptySelection")}
    />
  );
}
