"use client";

import { getImageProps } from "next/image";
import { PointerEvent, useEffect, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { landingPanels, LandingPanelDefinition, LandingPanelId, type ServicePickerModel } from "./landingPage.data";
import ServicesQuickFinder from "./ServicesQuickFinder";
import styles from "./landingPage.module.css";

const MOBILE_QUERY = "(max-width: 767px)";
const SERVICES_ASSET_VERSION = "20260815-2";

function CategoryIcon({ id }: { id: LandingPanelId }) {
  if (id === "services") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.4 15 .1 2.2-2.3 2.3-2.2-.1-1.5.9-.9 2H9.4l-.9-2-1.5-.9-2.2.1-2.3-2.3.1-2.2-.9-1.5-2-.9V9.4l2-.9L2.6 7l-.1-2.2 2.3-2.3 2.2.1 1.5-.9.9-2h3.2l.9 2 1.5.9 2.2-.1 2.3 2.3-.1 2.2.9 1.5 2 .9v3.2l-2 .9-.9 1.5Z" transform="scale(.74) translate(4.2 4.2)" />
      </svg>
    );
  }

  if (id === "commercial") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h12a2 2 0 0 1 2 2v10H4V5Zm14 5h2l2 3v4h-4v-7Z" />
        <circle cx="8" cy="18" r="2" /><circle cx="18" cy="18" r="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 14 1.6-4.2A3 3 0 0 1 8.4 8h7.2a3 3 0 0 1 2.8 1.8L20 14m-16 0h16v5H4v-5Z" />
      <path strokeLinecap="round" d="M7 14h.01M17 14h.01M7 19v2m10-2v2" />
    </svg>
  );
}

function subscribeToTheme(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function isLightTheme() {
  return document.documentElement.classList.contains("light");
}

function ResponsivePanelImage({ panel, priority, isLightMode }: { panel: LandingPanelDefinition; priority: boolean; isLightMode: boolean }) {
  const desktopSource = isLightMode ? panel.lightDesktopImage : panel.desktopImage;
  const mobileSource = isLightMode ? panel.lightMobileImage : panel.mobileImage;
  const versionedDesktopSource = panel.id === "services"
    ? { ...desktopSource, src: `${desktopSource.src}?v=${SERVICES_ASSET_VERSION}` }
    : desktopSource;
  const versionedMobileSource = panel.id === "services"
    ? { ...mobileSource, src: `${mobileSource.src}?v=${SERVICES_ASSET_VERSION}` }
    : mobileSource;
  const { props: desktopProps } = getImageProps({
    src: versionedDesktopSource,
    alt: "",
    fill: true,
    sizes: "(min-width: 1440px) 42vw, (min-width: 768px) 52vw, 100vw",
    quality: 88,
    priority,
  });
  const { props: mobileProps } = getImageProps({
    src: versionedMobileSource,
    alt: "",
    fill: true,
    sizes: "100vw",
    quality: 86,
    priority,
  });

  return (
    <picture className={styles.panelPicture}>
      <source media={MOBILE_QUERY} srcSet={mobileProps.srcSet} sizes={mobileProps.sizes} />
      <img
        {...desktopProps}
        alt=""
        className={styles.panelImage}
        aria-hidden="true"
      />
    </picture>
  );
}

function TrustIcon({ index }: { index: number }) {
  const paths = [
    // 01 — the only official dealer (certified badge)
    "M12 2.6 14 4.8l2.9-.2.6 2.9 2.6 1.4-1.2 2.7 1.2 2.7-2.6 1.4-.6 2.9-2.9-.2-2 2.2-2-2.2-2.9.2-.6-2.9L4 14.3l1.2-2.7L4 8.9l2.5-1.4.6-2.9 2.9.2L12 2.6Zm-2.4 9.2 1.9 1.9 3.5-3.7",
    // 02 — warranty (shield + check)
    "M12 3 4.5 6v5.5c0 4.6 3.1 7.7 7.5 9.5 4.4-1.8 7.5-4.9 7.5-9.5V6L12 3Zm-3 9 2 2 4-5",
    // 03 — genuine spare parts and service (wrench)
    "M15.2 7.1a3.8 3.8 0 0 0 4.9 4.9l-7 7a2.4 2.4 0 1 1-3.4-3.4l7-7Zm0 0 2.6-2.6M8.9 12 3.8 6.9a2.9 2.9 0 0 1 3.8-3.8l4.9 4.9",
  ];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={paths[index]} /></svg>;
}

export default function LandingPage({ serviceModels }: { serviceModels: ServicePickerModel[] }) {
  const t = useTranslations("landing");
  const locale = useLocale();
  const isLightMode = useSyncExternalStore(subscribeToTheme, isLightTheme, () => false);
  const [activeDesktopPanel, setActiveDesktopPanel] = useState<LandingPanelId | null>(null);
  const [servicesPickerDismissKey, setServicesPickerDismissKey] = useState(0);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const resetLayoutState = () => setActiveDesktopPanel(null);
    media.addEventListener("change", resetLayoutState);
    return () => media.removeEventListener("change", resetLayoutState);
  }, []);

  useEffect(() => {
    setActiveDesktopPanel(null);
  }, [locale]);

  const isMobileViewport = () => window.matchMedia(MOBILE_QUERY).matches;

  const handlePanelPointerEnter = (event: PointerEvent<HTMLElement>, id: LandingPanelId) => {
    if (event.pointerType === "mouse" && !isMobileViewport()) setActiveDesktopPanel(id);
  };

  const handleServicesMenuPointerLeave = (relatedTarget: EventTarget | null) => {
    if (relatedTarget instanceof Element && relatedTarget.closest('[data-panel="services"]')) return;
    setServicesPickerDismissKey((current) => current + 1);
    setActiveDesktopPanel(null);
  };

  return (
    <section className={styles.page} data-header-theme="dark" aria-label={t("ariaLabel")}>
      <div className={styles.gateway}>
        <div
          className={styles.panels}
          onPointerLeave={(event) => {
            const relatedTarget = event.relatedTarget;
            if (
              relatedTarget instanceof Element &&
              relatedTarget.closest('[data-product-picker-menu], .byd-select-menu')
            ) return;
            if (!event.currentTarget.contains(document.activeElement)) {
              if (activeDesktopPanel === "services") {
                setServicesPickerDismissKey((current) => current + 1);
              }
              setActiveDesktopPanel(null);
            }
          }}
        >
          {landingPanels.map((panel, index) => {
            const isActive = activeDesktopPanel === panel.id;
            const isDimmed = activeDesktopPanel !== null && !isActive;
            const isOpen = isActive;
            const panelTitle = t(`${panel.id}.title`);
            const mobilePanelTitle = t(`${panel.id}.mobileTitle`);
            const panelSectionLabel = panelTitle === mobilePanelTitle
              ? panelTitle
              : `${panelTitle} / ${mobilePanelTitle}`;
            const panelClassName = [
              styles.panel,
              isActive ? styles.panelActive : "",
              isDimmed ? styles.panelDimmed : "",
            ].filter(Boolean).join(" ");

            return (
              <article
                key={panel.id}
                data-panel={panel.id}
                className={panelClassName}
                onPointerEnter={(event) => handlePanelPointerEnter(event, panel.id)}
                onPointerLeave={(event) => {
                  if (panel.id === "services" && event.pointerType === "mouse") {
                    const relatedTarget = event.relatedTarget;
                    if (relatedTarget instanceof Element && relatedTarget.closest("[data-product-picker-menu]")) return;
                    setServicesPickerDismissKey((current) => current + 1);
                    setActiveDesktopPanel(null);
                  }
                }}
                onFocusCapture={() => { if (!isMobileViewport()) setActiveDesktopPanel(panel.id); }}
                onBlurCapture={(event) => {
                  const nextTarget = event.relatedTarget;
                  if (nextTarget instanceof Element && nextTarget.closest("[data-product-picker-menu]")) return;
                  if (!event.currentTarget.contains(event.relatedTarget) && !isMobileViewport()) setActiveDesktopPanel(null);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Escape") return;
                  setActiveDesktopPanel(null);
                }}
              >
                <ResponsivePanelImage panel={panel} priority={index === 0} isLightMode={isLightMode} />
                <div className={styles.panelOverlay} aria-hidden="true" />
                <Link
                  className={styles.panelLink}
                  href={panel.href}
                  aria-label={`${panelSectionLabel} — ${t(`${panel.id}.expandedCta`)}`}
                  data-panel-link
                />

                <div className={styles.panelContent}>
                  <div className={styles.panelToggle} aria-hidden="true">
                    <span className={styles.panelMeta}>
                      <span className={styles.numberLine} aria-hidden="true" />
                      <span>{panel.number}</span>
                    </span>
                    <span className={styles.categoryIcon}><CategoryIcon id={panel.id} /></span>
                    <span className={`${styles.panelTitle} ${styles.desktopPanelTitle}`}>{panelTitle}</span>
                    <span className={`${styles.panelTitle} ${styles.mobilePanelTitle}`}>{mobilePanelTitle}</span>
                    <span className={`${styles.panelDescription} ${styles.desktopDescription}`}>
                      {t(`${panel.id}.description`)}
                    </span>
                    <span className={`${styles.panelDescription} ${styles.mobileDescription}`}>
                      {t(`${panel.id}.compactDescription`)}
                    </span>
                  </div>

                  <div
                    id={`${panel.id}-panel-details`}
                    className={styles.panelDetailsGrid}
                    aria-hidden={!isOpen}
                    ref={(node) => { if (node) node.inert = !isOpen; }}
                  >
                    <div className={styles.panelDetailsInner}>
                      <p className={`${styles.expandedDescription} ${styles.desktopExpandedDescription}`}>{t(`${panel.id}.expandedDescription`)}</p>
                      <p className={`${styles.expandedDescription} ${styles.mobileExpandedDescription}`}>{t(`${panel.id}.mobileExpandedDescription`)}</p>
                      <ul className={`${styles.featureList} ${styles.desktopFeatureList}`}>
                        {panel.featureKeys.map((feature) => (
                          <li key={feature}><span aria-hidden="true">✓</span>{t(`${panel.id}.features.${feature}`)}</li>
                        ))}
                      </ul>
                      {panel.id !== "services" && (
                        <ul className={`${styles.featureList} ${styles.mobileFeatureList}`}>
                          {panel.featureKeys.slice(0, 3).map((feature) => (
                            <li key={feature}><span aria-hidden="true">✓</span>{t(`${panel.id}.mobileFeatures.${feature}`)}</li>
                          ))}
                        </ul>
                      )}
                      {panel.id === "services" && (
                        <ServicesQuickFinder
                          models={serviceModels}
                          closeModelPickerRequestKey={servicesPickerDismissKey}
                          onModelPickerPointerLeave={handleServicesMenuPointerLeave}
                        />
                      )}
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.trustStrip} aria-label={t("trust.ariaLabel")}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}><TrustIcon index={0} /></span>
            <span>{t("trust.dealer")}</span>
          </div>

          <div className={`${styles.trustItem} ${styles.trustExpandable}`} tabIndex={0} aria-describedby="trust-warranty-details">
            <span className={styles.trustLabelRow}>
              <span className={styles.trustIcon}><TrustIcon index={1} /></span>
              <span>{t("trust.warranty")}</span>
              <span className={styles.trustChevron} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" /></svg>
              </span>
            </span>
            <div className={styles.trustPopover} id="trust-warranty-details" role="tooltip">
              <dl className={styles.trustDetails}>
                {["vehicle", "battery", "drivetrain"].map((detail) => (
                  <div className={styles.trustDetailRow} key={detail}>
                    <dt>{t(`trust.warrantyDetails.${detail}.label`)}</dt>
                    <dd>{t(`trust.warrantyDetails.${detail}.value`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className={styles.trustItem}>
            <span className={styles.trustIcon}><TrustIcon index={2} /></span>
            <span>{t("trust.parts")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
