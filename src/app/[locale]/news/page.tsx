import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NewsGrid from "@/components/news/NewsGrid";
import { getPublishedNews } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "news" });
  return { title: `${t("title")} | BYD Tbilisi`, description: t("intro") };
}

export default async function NewsPage({ params }: { params: { locale: string } }) {
  const [posts, t] = await Promise.all([getPublishedNews(), getTranslations({ locale: params.locale, namespace: "news" })]);
  return <div className="min-h-screen bg-byd-dark pb-20 text-white"><header className="section-container pb-14 pt-36 md:pb-20 md:pt-44"><p className="text-xs font-bold uppercase tracking-[0.18em] text-byd-red">{t("eyebrow")}</p><h1 className="mt-3 text-5xl font-bold md:text-7xl">{t("title")}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-white/55 md:text-lg">{t("intro")}</p></header><section className="section-container" aria-label={t("title")}><NewsGrid posts={posts} locale={params.locale} readLabel={t("readArticle")} emptyLabel={t("empty")} /></section></div>;
}
