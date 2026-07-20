"use client";

import { getImageProps } from "next/image";
import { MouseEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { landingPanels, LandingPanelDefinition, LandingPanelId } from "./landingPage.data";
import ServicesQuickFinder from "./ServicesQuickFinder";
import styles from "./landingPage.module.css";

const MOBILE_QUERY = "(max-width: 767px)";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

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

function ResponsivePanelImage({ panel, priority }: { panel: LandingPanelDefinition; priority: boolean }) {
  const { props: desktopProps } = getImageProps({
    src: panel.desktopImage,
    alt: "",
    fill: true,
    sizes: "(min-width: 1440px) 42vw, (min-width: 768px) 52vw, 100vw",
    quality: 88,
    priority,
  });
  const { props: mobileProps } = getImageProps({
    src: panel.mobileImage,
    alt: "",
    fill: true,
    sizes: "100vw",
    quality: 86,
    priority,
  });

  return (
    <picture className={styles.panelPicture}>
      <source media={MOBILE_QUERY} srcSet={mobileProps.srcSet} sizes={mobileProps.sizes} />
      <img {...desktopProps} alt="" className={styles.panelImage} aria-hidden="true" />
    </picture>
  );
}

function TrustIcon({ index }: { index: number }) {
  const paths = [
    "M12 3 4.5 6v5.5c0 4.6 3.1 7.7 7.5 9.5 4.4-1.8 7.5-4.9 7.5-9.5V6L12 3Zm-3 9 2 2 4-5",
    "M12 2.5 15 6l4.5.5-.5 4.5 2.5 3.7-3.7 2.5-.8 4.3-5-1.5-5 1.5-.8-4.3-3.7-2.5L5 11l-.5-4.5L9 6l3-3.5Z",
    "M4 13v-2a8 8 0 0 1 16 0v2M4 13H2v5h4v-5H4Zm16 0h2v5h-4v-5h2Zm0 5c0 2-1.5 3-4 3",
    "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0-6v2m0 15v2M4.6 4.6 6 6m12 12 1.4 1.4M2.5 12h2m15 0h2M4.6 19.4 6 18M18 6l1.4-1.4",
    "m13 2-8 12h7l-1 8 8-12h-7l1-8Z",
  ];
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d={paths[index]} /></svg>;
}

export default function LandingPage() {
  const t = useTranslations("landing");
  const locale = useLocale();
  const [activeDesktopPanel, setActiveDesktopPanel] = useState<LandingPanelId | null>(null);
  const [expandedMobilePanel, setExpandedMobilePanel] = useState<LandingPanelId | null>(null);
  const panelRefs = useRef<Partial<Record<LandingPanelId, HTMLElement | null>>>({});

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const resetLayoutState = () => {
      setActiveDesktopPanel(null);
      setExpandedMobilePanel(null);
    };
    media.addEventListener("change", resetLayoutState);
    return () => media.removeEventListener("change", resetLayoutState);
  }, []);

  useEffect(() => {
    setActiveDesktopPanel(null);
    setExpandedMobilePanel(null);
  }, [locale]);

  const isMobileViewport = () => window.matchMedia(MOBILE_QUERY).matches;

  const togglePanel = (id: LandingPanelId) => {
    if (!isMobileViewport()) {
      setActiveDesktopPanel(id);
      return;
    }

    const opening = expandedMobilePanel !== id;
    setExpandedMobilePanel((current) => current === id ? null : id);
    if (!opening) return;

    requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      panelRefs.current[id]?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    });
  };

  const handlePanelPointerEnter = (event: PointerEvent<HTMLElement>, id: LandingPanelId) => {
    if (event.pointerType === "mouse" && !isMobileViewport()) setActiveDesktopPanel(id);
  };

  const handlePanelClick = (event: MouseEvent<HTMLElement>, id: LandingPanelId) => {
    const target = event.target as HTMLElement;
    if (target.closest("a, button, form, input, select, textarea, label")) return;
    togglePanel(id);
  };

  return (
    <section className={styles.page} data-header-theme="dark" aria-label={t("ariaLabel")}>
      <div className={styles.gateway}>
        <div
          className={styles.panels}
          onPointerLeave={(event) => {
            if (!event.currentTarget.contains(document.activeElement)) {
              setActiveDesktopPanel(null);
            }
          }}
        >
          {landingPanels.map((panel, index) => {
            const isActive = activeDesktopPanel === panel.id;
            const isDimmed = activeDesktopPanel !== null && !isActive;
            const isExpanded = expandedMobilePanel === panel.id;
            const isOpen = isActive || isExpanded;
            const panelClassName = [
              styles.panel,
              isActive ? styles.panelActive : "",
              isDimmed ? styles.panelDimmed : "",
              isExpanded ? styles.mobileExpanded : "",
            ].filter(Boolean).join(" ");

            return (
              <article
                key={panel.id}
                data-panel={panel.id}
                ref={(node) => { panelRefs.current[panel.id] = node; }}
                className={panelClassName}
                onClick={(event) => handlePanelClick(event, panel.id)}
                onPointerEnter={(event) => handlePanelPointerEnter(event, panel.id)}
                onFocusCapture={() => { if (!isMobileViewport()) setActiveDesktopPanel(panel.id); }}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget) && !isMobileViewport()) setActiveDesktopPanel(null);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Escape") return;
                  setActiveDesktopPanel(null);
                  setExpandedMobilePanel(null);
                }}
              >
                <ResponsivePanelImage panel={panel} priority={index === 0} />
                <div className={styles.panelOverlay} aria-hidden="true" />

                <div className={styles.panelContent}>
                  <button
                    type="button"
                    className={styles.panelToggle}
                    onClick={() => togglePanel(panel.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${panel.id}-panel-details`}
                    aria-label={t(isOpen ? "common.collapse" : "common.expand", { section: t(`${panel.id}.title`) })}
                  >
                    <span className={styles.panelMeta}>
                      <span className={styles.numberLine} aria-hidden="true" />
                      <span>{panel.number}</span>
                    </span>
                    <span className={styles.categoryIcon}><CategoryIcon id={panel.id} /></span>
                    <span className={`${styles.panelTitle} ${styles.desktopPanelTitle}`}>{t(`${panel.id}.title`)}</span>
                    <span className={`${styles.panelTitle} ${styles.mobilePanelTitle}`}>{t(`${panel.id}.mobileTitle`)}</span>
                    <span className={`${styles.panelDescription} ${styles.desktopDescription}`}>
                      {t(`${panel.id}.description`)}
                    </span>
                    <span className={`${styles.panelDescription} ${styles.mobileDescription}`}>
                      {t(`${panel.id}.compactDescription`)}
                    </span>
                    <span className={styles.mobileArrow} aria-hidden="true">
                      {isExpanded ? <span className={styles.closeMark}>×</span> : <ArrowIcon />}
                    </span>
                  </button>

                  <div
                    id={`${panel.id}-panel-details`}
                    className={styles.panelDetailsGrid}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
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
                      {panel.id === "services" && <ServicesQuickFinder />}
                    </div>
                  </div>

                  <Link className={styles.panelCta} href={panel.href}>
                    <span>{t(isActive || isExpanded ? `${panel.id}.expandedCta` : "common.enter")}</span>
                    <span className={styles.ctaArrow}><ArrowIcon /></span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.trustStrip} aria-label={t("trust.ariaLabel")}>
          {["dealer", "warranty", "support", "parts", "future"].map((item, index) => (
            <div className={styles.trustItem} key={item}>
              <span className={styles.trustIcon}><TrustIcon index={index} /></span>
              <span>{t(`trust.${item}`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
