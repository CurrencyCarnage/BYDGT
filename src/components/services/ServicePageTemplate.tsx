import Image, { type StaticImageData } from "next/image";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/i18n/routing";
import {
  SERVICE_HIGHLIGHT_KEYS,
  SERVICE_PAGE_LIST,
  type ServiceImageSlot,
  type ServicePageContent,
} from "@/lib/service-pages";
import styles from "./servicePage.module.css";

/**
 * Renders one image slot. An admin-supplied `override` URL replaces both
 * breakpoints; otherwise the bundled desktop/mobile pair is used.
 */
function SlotImage({
  slot,
  alt,
  sizes,
  priority = false,
}: {
  slot: ServiceImageSlot;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (slot.override) {
    return (
      <Image
        src={slot.override}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={82}
      />
    );
  }

  const pair: [StaticImageData, StaticImageData] = [slot.desktop, slot.mobile];
  return (
    <>
      <Image
        src={pair[0]}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={82}
        className={styles.desktopImage}
      />
      <Image
        src={pair[1]}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={78}
        className={styles.mobileImage}
      />
    </>
  );
}

function ArrowIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default async function ServicePageTemplate({
  page,
  locale,
  compact = false,
  children,
}: {
  page: ServicePageContent;
  locale: string;
  /** Shop pages drop the editorial middle so the catalogue sits directly
   *  under the hero. */
  compact?: boolean;
  /** Rendered between the hero and the closing CTA. */
  children?: ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: `servicePages.${page.id}` });
  const tCommon = await getTranslations({ locale, namespace: "servicePages.common" });

  const siblings = SERVICE_PAGE_LIST.filter((item) => item.id !== page.id);

  return (
    <div className={styles.page}>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroPicture}>
          <SlotImage
            slot={page.hero}
            alt={t("imageAlt")}
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.heroShade} />

        <div className={`${styles.container} ${styles.heroInner}`}>
          <Link href="/services" className={styles.breadcrumb}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {tCommon("backToServices")}
          </Link>

          <p className={styles.eyebrow}>
            {page.index} · {t("eyebrow")}
          </p>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.lead}>{t("lead")}</p>

          <div className={styles.actions}>
            <a className={styles.primary} href="mailto:info@byd.ge">
              {t("primaryCta")}
            </a>
            <Link className={styles.secondary} href="/contact">
              {tCommon("secondaryCta")}
            </Link>
          </div>
        </div>
      </header>

      {children}

      {/* ── Highlights ─────────────────────────────────────────── */}
      {!compact && (
      <section className={`${styles.container} ${styles.highlights}`}>
        <div className={styles.highlightGrid}>
          {SERVICE_HIGHLIGHT_KEYS.map((key, index) => (
            <article key={key} className={styles.highlightItem}>
              <span className={styles.highlightIndex}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{t(`highlights.${key}.title`)}</h3>
              <p>{t(`highlights.${key}.body`)}</p>
            </article>
          ))}
        </div>
      </section>
      )}

      {/* ── Split band ─────────────────────────────────────────── */}
      {!compact && (
      <section className={styles.split}>
        <div className={`${styles.container} ${styles.splitInner}`}>
          <div className={styles.splitPicture}>
            <SlotImage
              slot={page.feature}
              alt={t("featureImageAlt")}
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
          <div className={styles.splitCopy}>
            <h2>{t("bodyTitle")}</h2>
            <p>{t("body")}</p>
            <ul className={styles.tickList}>
              {SERVICE_HIGHLIGHT_KEYS.map((key) => (
                <li key={key}>{t(`points.${key}`)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      )}

      {/* ── Closing CTA ────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={`${styles.container} ${styles.ctaInner}`}>
          <div>
            <h2>{t("ctaTitle")}</h2>
            <p>{t("ctaBody")}</p>
          </div>
          <div className={styles.ctaActions}>
            <a className={styles.primary} href="mailto:info@byd.ge">
              {t("primaryCta")}
            </a>
            <a
              className={styles.secondary}
              href="https://wa.me/995XXXXXXXXX"
              target="_blank"
              rel="noreferrer"
            >
              {tCommon("whatsapp")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Other service pages ────────────────────────────────── */}
      <nav className={`${styles.container} ${styles.siblings}`} aria-label={tCommon("moreTitle")}>
        <p className={styles.siblingsTitle}>{tCommon("moreTitle")}</p>
        <div className={styles.siblingGrid}>
          {siblings.map((sibling) => (
            <Link key={sibling.id} href={sibling.href} className={styles.siblingCard}>
              <SiblingLabel id={sibling.id} locale={locale} />
              <ArrowIcon />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

async function SiblingLabel({ id, locale }: { id: string; locale: string }) {
  const t = await getTranslations({ locale, namespace: "landing.servicesPage.nav" });
  return <span>{t(id)}</span>;
}
