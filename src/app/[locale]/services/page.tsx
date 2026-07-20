import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ServicesHub from "@/components/services/ServicesHub";

type ServicesSearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "landing.servicesPage.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function ServicesPage({ searchParams }: { searchParams: ServicesSearchParams }) {
  const model = firstValue(searchParams.model);
  const year = firstValue(searchParams.year);
  const category = firstValue(searchParams.category);
  return <ServicesHub initialSelection={{ model, year, category }} />;
}
