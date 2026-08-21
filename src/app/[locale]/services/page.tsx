import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ServicesHub from "@/components/services/ServicesHub";

type ServicesSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const serviceCategories = new Set([
  "serviceParts", "fluids", "filters", "brakes", "exterior", "interior",
  "electrical", "charging", "protection", "comfort", "other",
]);

function categoryValues(value: string | string[] | undefined) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return Array.from(new Set(values.filter((category) => serviceCategories.has(category))));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "landing.servicesPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ServicesPage({ searchParams }: { searchParams: ServicesSearchParams }) {
  const model = firstValue(searchParams.model);
  const trim = firstValue(searchParams.trim);
  const year = firstValue(searchParams.year);
  const categories = categoryValues(searchParams.category);
  return <ServicesHub initialSelection={{ model, trim, year, categories }} />;
}
