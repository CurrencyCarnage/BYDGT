import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import DestinationPage from "@/components/landing/DestinationPage";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "landing.destination.commercial" });
  return { title: t("title"), description: t("description") };
}

export default async function CommercialPage() {
  const t = await getTranslations("landing.destination");
  return (
    <DestinationPage
      eyebrow={t("commercial.eyebrow")}
      title={t("commercial.title")}
      description={t("commercial.description")}
      status={t("commercial.status")}
      backLabel={t("back")}
    />
  );
}
