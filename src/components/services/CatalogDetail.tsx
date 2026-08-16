"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import {
  CATALOG_CATEGORIES,
  getShopItems,
  localized,
  type CatalogItem,
} from "@/lib/service-catalog";
import CatalogIcon from "./CatalogIcon";
import styles from "./catalogShop.module.css";

const ENQUIRY_ADDRESS = "info@byd.ge";

export default function CatalogDetail({ item }: { item: CatalogItem }) {
  const locale = useLocale();
  const t = useTranslations("serviceShop");

  /* Pre-select the first value of each option group so the enquiry always
     carries a complete specification. */
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    Object.fromEntries(item.options.map((group) => [group.id, group.values[0]?.id ?? ""])),
  );

  const categories = CATALOG_CATEGORIES[item.shop];
  const categoryLabel = categories.find((entry) => entry.id === item.category)?.label;
  const related = getShopItems(item.shop)
    .filter((entry) => entry.slug !== item.slug && entry.category === item.category)
    .slice(0, 4);

  const chosen = item.options
    .map((group) => {
      const value = group.values.find((option) => option.id === selection[group.id]);
      return value ? `${localized(group.label, locale)}: ${localized(value.label, locale)}` : null;
    })
    .filter(Boolean)
    .join(", ");

  /* The whole shop ends at an enquiry, not a checkout — the mailto carries
     the SKU and the chosen options so the parts team can reply directly. */
  const subject = `${t("enquirySubject")}: ${localized(item.name, locale)} (${item.sku})`;
  const body = [
    `${t("enquiryProduct")}: ${localized(item.name, locale)}`,
    `${t("enquirySku")}: ${item.sku}`,
    chosen ? `${t("enquiryOptions")}: ${chosen}` : null,
    "",
    t("enquiryVinPrompt"),
  ]
    .filter(Boolean)
    .join("\n");

  const mailto = `mailto:${ENQUIRY_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section className={styles.detail}>
      <div className={styles.container}>
        <nav className={styles.crumbs} aria-label={t("breadcrumb")}>
          <Link href="/services">{t("services")}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/services/${item.shop}`}>{t(`shop.${item.shop}`)}</Link>
          <span aria-hidden="true">/</span>
          <span>{localized(item.name, locale)}</span>
        </nav>

        <div className={styles.detailInner}>
          <div className={styles.detailMedia}>
            <CatalogIcon category={item.category} />
            <span className={styles.mediaNote}>{t("imagePending")}</span>
          </div>

          <div>
            {categoryLabel && (
              <span className={styles.detailCategory}>{localized(categoryLabel, locale)}</span>
            )}
            <h1 className={styles.detailName}>{localized(item.name, locale)}</h1>
            <p className={styles.detailSummary}>{localized(item.summary, locale)}</p>

            <div className={styles.metaRow}>
              <span className={styles.metaTag}>{item.sku}</span>
              <span className={styles.metaTag}>
                {item.availability === "in-stock" ? t("inStock") : t("toOrder")}
              </span>
              <span className={styles.metaTag}>{t("priceOnRequest")}</span>
            </div>

            {item.options.map((group) => (
              <div key={group.id} className={styles.optionBlock}>
                <span className={styles.optionLabel}>{localized(group.label, locale)}</span>
                <div className={styles.optionRow} role="radiogroup" aria-label={localized(group.label, locale)}>
                  {group.values.map((value) => {
                    const active = selection[group.id] === value.id;
                    return (
                      <button
                        key={value.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() =>
                          setSelection((prev) => ({ ...prev, [group.id]: value.id }))
                        }
                        className={`${styles.optionButton} ${active ? styles.optionSelected : ""}`}
                      >
                        {localized(value.label, locale)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className={styles.actions}>
              <a className={styles.primary} href={mailto}>
                {t("contactCta")}
              </a>
              <Link className={styles.secondary} href="/contact">
                {t("callUs")}
              </Link>
            </div>
            <p className={styles.enquiryNote}>{t("enquiryNote")}</p>
          </div>
        </div>

        {/* ── Specs + description ── */}
        <div className={styles.blocks}>
          <div className={styles.blockGrid}>
            <div>
              <p className={styles.blockTitle}>{t("specifications")}</p>
              <table className={styles.specTable}>
                <tbody>
                  {item.specs.map((spec, index) => (
                    <tr key={index}>
                      <th scope="row">{localized(spec.label, locale)}</th>
                      <td>{localized(spec.value, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className={styles.blockTitle}>{t("about")}</p>
              <p className={styles.description}>{localized(item.description, locale)}</p>

              <p className={`${styles.blockTitle} ${styles.optionBlock}`}>{t("fitment")}</p>
              <div className={styles.fitList}>
                {item.fitment.map((model) => (
                  <span key={model} className={styles.metaTag}>
                    {model}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <div className={styles.related}>
            <p className={styles.blockTitle}>{t("related")}</p>
            <div className={styles.grid}>
              {related.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/services/${entry.shop}/${entry.slug}`}
                  className={styles.card}
                >
                  <div className={styles.cardThumb}>
                    <CatalogIcon category={entry.category} />
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardName}>{localized(entry.name, locale)}</p>
                    <p className={styles.cardSummary}>{localized(entry.summary, locale)}</p>
                    <div className={styles.cardFoot}>
                      <span className={styles.sku}>{entry.sku}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
