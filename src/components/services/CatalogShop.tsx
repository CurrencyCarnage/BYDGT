"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import {
  CATALOG_CATEGORIES,
  getShopItems,
  localized,
  type CatalogShopId,
} from "@/lib/service-catalog";
import CatalogIcon from "./CatalogIcon";
import styles from "./catalogShop.module.css";

export default function CatalogShop({ shop }: { shop: CatalogShopId }) {
  const locale = useLocale();
  const t = useTranslations("serviceShop");
  const [category, setCategory] = useState<string>("all");

  const items = useMemo(() => getShopItems(shop), [shop]);
  const categories = CATALOG_CATEGORIES[shop];

  const visible = useMemo(
    () => (category === "all" ? items : items.filter((item) => item.category === category)),
    [category, items],
  );

  return (
    <section className={styles.shop} id="catalog">
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.filters} role="group" aria-label={t("filterLabel")}>
            <button
              type="button"
              onClick={() => setCategory("all")}
              aria-pressed={category === "all"}
              className={`${styles.chip} ${category === "all" ? styles.chipActive : ""}`}
            >
              {t("all")}
            </button>
            {categories.map((entry) => {
              const active = category === entry.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  /* Re-picking the active filter clears it, matching the
                     deselect behaviour used across the site. */
                  onClick={() => setCategory(active ? "all" : entry.id)}
                  aria-pressed={active}
                  className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                >
                  {localized(entry.label, locale)}
                </button>
              );
            })}
          </div>
          <p className={styles.count} aria-live="polite">
            {t("resultCount", { count: visible.length })}
          </p>
        </div>

        <div className={styles.grid}>
          {visible.map((item) => (
            <Link
              key={item.slug}
              href={`/services/${shop}/${item.slug}`}
              className={styles.card}
            >
              <div className={styles.cardThumb}>
                <CatalogIcon category={item.category} />
                <span className={styles.badge}>
                  {item.availability === "in-stock" ? t("inStock") : t("toOrder")}
                </span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardCategory}>
                  {localized(
                    categories.find((entry) => entry.id === item.category)?.label ?? {
                      en: item.category,
                      ka: item.category,
                    },
                    locale,
                  )}
                </span>
                <p className={styles.cardName}>{localized(item.name, locale)}</p>
                <p className={styles.cardSummary}>{localized(item.summary, locale)}</p>
                <div className={styles.cardFoot}>
                  <span className={styles.sku}>{item.sku}</span>
                  <span className={styles.cardCta}>
                    {t("viewDetails")}
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {visible.length === 0 && <p className={styles.empty}>{t("empty")}</p>}
        </div>
      </div>
    </section>
  );
}
