import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import NewsArticle from "@/components/news/NewsArticle";
import { getPublishedNewsBySlug } from "@/lib/news";
import { getLocalizedValue } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const post = await getPublishedNewsBySlug(params.slug);
  if (!post) return {};
  return { title: `${getLocalizedValue(post.title, params.locale)} | BYD Tbilisi`, description: getLocalizedValue(post.excerpt, params.locale), openGraph: post.coverImage ? { images: [{ url: post.coverImage.url, alt: getLocalizedValue(post.coverImage.alt, params.locale) }] } : undefined };
}

export default async function NewsDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const [post, t] = await Promise.all([getPublishedNewsBySlug(params.slug), getTranslations({ locale: params.locale, namespace: "news" })]);
  if (!post) notFound();
  return <div className="min-h-screen bg-byd-dark text-white"><NewsArticle post={post} locale={params.locale} backLabel={t("back")} galleryLabel={t("gallery")} /></div>;
}
