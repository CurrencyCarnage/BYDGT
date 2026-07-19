import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import LandingPage from "@/components/landing/LandingPage";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "landing.meta" });
  return { title: t("title"), description: t("description") };
}

export default function GatewayPage() {
  return <LandingPage />;
}
