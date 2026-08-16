import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import CatalogShop from "@/components/services/CatalogShop";
import ServicePageTemplate from "@/components/services/ServicePageTemplate";
import { getServicePage } from "@/lib/service-pages";

const PAGE_ID = "accessories";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: `servicePages.${PAGE_ID}.meta`,
  });
  return { title: t("title"), description: t("description") };
}

export default function Page({ params }: { params: { locale: string } }) {
  const page = getServicePage(PAGE_ID);
  if (!page) notFound();
  return (
    <ServicePageTemplate page={page} locale={params.locale} compact>
      <CatalogShop shop={PAGE_ID} />
    </ServicePageTemplate>
  );
}
