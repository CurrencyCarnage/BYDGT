import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CatalogDetail from "@/components/services/CatalogDetail";
import { getCatalogItem, getShopItems, localized } from "@/lib/service-catalog";

const SHOP = "spare-parts";

export function generateStaticParams() {
  return getShopItems(SHOP).map((item) => ({ item: item.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; item: string };
}): Metadata {
  const item = getCatalogItem(SHOP, params.item);
  if (!item) return {};
  return {
    title: `${localized(item.name, params.locale)} · ${item.sku} | BYD Tbilisi`,
    description: localized(item.description, params.locale),
  };
}

export default function Page({ params }: { params: { item: string } }) {
  const item = getCatalogItem(SHOP, params.item);
  if (!item) notFound();
  return <CatalogDetail item={item} />;
}
