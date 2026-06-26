"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────
   Models mega-menu data
───────────────────────────────────────────────────────────────── */
const MEGA_MODELS = [
  {
    id:        "sealion-06-dmi",
    href:      "/catalog/sealion-06-dmi",
    name:      "Sealion 06 DM-i",
    type:      "PHEV" as const,
    tagline:   "Smart PHEV SUV",
    taglineKa: "ჭკვიანი ჰიბრიდული SUV",
    thumbnail: "/images/homepage/byd-sealion-thumbnail.jpg",
    hoverImage: "/images/homepage/byd-sealion-sideview.jpg",
  },
  {
    id:        "seal-06-dmi",
    href:      "/catalog/seal-06-dmi",
    name:      "Seal 06 DM-i",
    type:      "PHEV" as const,
    tagline:   "Sport PHEV Sedan",
    taglineKa: "სპორტული PHEV სედანი",
    thumbnail: "/images/homepage/byd-seal-thumbnail.jpg",
    hoverImage: "/images/homepage/byd-seal-sideview.jpg",
  },
  {
    id:        "yuan-up-ev",
    href:      "/catalog/yuan-up-ev",
    name:      "Yuan Up EV",
    type:      "EV" as const,
    tagline:   "Compact Electric SUV",
    taglineKa: "კომპაქტური ელექტრო SUV",
    thumbnail: "/images/homepage/byd-yuanup1-thumbnail.jpg",
    hoverImage: "/images/homepage/byd-yuanup1-sideview.jpg",
  },
  {
    id:        "yuan-up-dmi",
    href:      "/catalog/yuan-up-dmi",
    name:      "Yuan Up DM-i",
    type:      "PHEV" as const,
    tagline:   "Efficient PHEV SUV",
    taglineKa: "ეფექტური PHEV SUV",
    thumbnail: "/images/homepage/byd-yuanup2-thumbnail.jpg",
    hoverImage: "/images/homepage/byd-yuanup2-sideview.jpg",
  },
];

const MEGA_MODELS_PER_PAGE = 4;

/* ─────────────────────────────────────────────────────────────────
   Desktop mega-menu panel
───────────────────────────────────────────────────────────────── */
function MegaMenu({
  locale,
  onClose,
}: {
  locale: string;
  onClose: () => void;
}) {
  const ka = locale === "ka";
  const [modelPage, setModelPage] = useState(0);
  const pageCount = Math.ceil(MEGA_MODELS.length / MEGA_MODELS_PER_PAGE);
  const visibleModels = MEGA_MODELS.slice(
    modelPage * MEGA_MODELS_PER_PAGE,
    (modelPage + 1) * MEGA_MODELS_PER_PAGE
  );
  const canShowNextModels = modelPage < pageCount - 1;

  const showNextModels = () => {
    if (!canShowNextModels) return;
    setModelPage((page) => Math.min(page + 1, pageCount - 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 right-0 z-50 px-3 md:px-5"
      style={{ top: "5rem" }}
    >
      {/* Invisible bridge covers the gap between nav bottom and panel top */}
      <div className="h-2 w-full" />

      <div className="mx-auto flex max-w-[96.5rem] items-stretch gap-2">
        <div
          className="mega-menu-panel min-w-0 flex-1 overflow-hidden"
          style={{
            background: "var(--theme-menu-bg)",
            border:     "1px solid var(--theme-border-subtle)",
            boxShadow:  "var(--theme-menu-shadow)",
          }}
        >
          {/* 2 × 2 model grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/[0.04] p-px">
            {visibleModels.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.22, ease: "easeOut" }}
              >
                <Link
                  href={model.href}
                  onClick={onClose}
                  className="group flex flex-col bg-[#1A1C1D] hover:bg-[#222425] transition-colors duration-180 overflow-hidden"
                  style={{ borderLeft: "2px solid transparent" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "#D70C19";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full overflow-hidden bg-[#252728]" style={{ height: '11.75rem' }}>
                    <Image
                      src={model.thumbnail}
                      alt={model.name}
                      fill
                      sizes="(max-width: 1279px) 50vw, 25vw"
                      className="object-cover object-center transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                      quality={84}

                    />
                    <Image
                      src={model.hoverImage}
                      alt={`${model.name} preview`}
                      fill
                      sizes="(max-width: 1279px) 50vw, 25vw"
                      className="object-cover object-center opacity-0 scale-105 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
                      quality={90}

                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 px-5 py-4 w-full">
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${
                        model.type === "EV" ? "text-[#78B254]" : "text-byd-red"
                      }`}
                    >
                      {model.type}
                    </span>
                    <p className="text-[15px] font-semibold text-white mt-1 leading-tight group-hover:text-white transition-colors">
                      {model.name}
                    </p>
                    <p className="text-[11px] text-white/40 mt-1 leading-snug font-light">
                      {ka ? model.taglineKa : model.tagline}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Footer: view all */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18, duration: 0.2 }}
            className="border-t border-white/[0.06]"
          >
            <Link
              href="/catalog"
              onClick={onClose}
              className="group flex items-center justify-center gap-2 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 hover:text-white/80 transition-colors duration-200"
            >
              {ka ? "ყველა მოდელის ნახვა" : "View all models"}
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <div className="hidden w-12 shrink-0 items-center justify-center md:flex">
          <button
            type="button"
            onClick={showNextModels}
            disabled={!canShowNextModels}
            title={ka ? "შემდეგი 4 მოდელი" : "Show next 4 models"}
            aria-label={ka ? "შემდეგი 4 მოდელი" : "Show next 4 models"}
            className={`flex h-11 w-11 items-center justify-center border transition-all duration-200 ${
              canShowNextModels
                ? "cursor-pointer border-white/24 bg-[#111213]/80 text-white/85 hover:border-byd-red/70 hover:bg-byd-red hover:text-white focus:outline-none focus:ring-2 focus:ring-byd-red/60"
                : "cursor-not-allowed border-white/20 bg-[#111213]/46 text-white/52"
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.4}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Navbar
───────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [megaOpen, setMegaOpen]           = useState(false);
  const [mobileModels, setMobileModels]   = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [overLightSurface, setOverLightSurface] = useState(false);
  const [theme, setTheme]                 = useState<"dark" | "light">("dark");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t       = useTranslations("nav");
  const tCommon = useTranslations("common");
  const locale  = useLocale();
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    const updateHeaderSurface = () => {
      setScrolled(window.scrollY > 20);

      const probeY = Math.min(96, Math.max(72, window.innerHeight * 0.12));
      const elements = document.elementsFromPoint(window.innerWidth / 2, probeY);
      const surfaceElement = elements.find(
        (element) => !element.closest("nav")
      );

      setOverLightSurface(
        Boolean(surfaceElement?.closest('[data-header-theme="light"]'))
      );
    };

    updateHeaderSurface();
    window.addEventListener("scroll", updateHeaderSurface, { passive: true });
    window.addEventListener("resize", updateHeaderSurface);

    return () => {
      window.removeEventListener("scroll", updateHeaderSurface);
      window.removeEventListener("resize", updateHeaderSurface);
    };
  }, [pathname]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("byd-theme");
    const nextTheme = savedTheme === "light" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("light", nextTheme === "light");
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
    setMobileModels(false);
  }, [pathname]);

  /* ── Mega-menu hover intent handlers ── */
  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleMegaClose = (delay = 200) => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), delay);
  };
  const closeMegaImmediate = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(false);
  };

  const switchLocale = () => {
    router.replace(pathname, { locale: locale === "en" ? "ka" : "en" });
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("light", nextTheme === "light");
    window.localStorage.setItem("byd-theme", nextTheme);
  };

  const ka = locale === "ka";
  const isLightSurfacePage =
    pathname === "/compare" ||
    pathname === "/contact" ||
    pathname.endsWith("/compare") ||
    pathname.endsWith("/contact");
  const useLightSurfaceHeader = isLightSurfacePage || overLightSurface;

  /* Non-models nav links */
  const baseLinks = [
    { href: "/"       as const, label: t("home")    },
    { href: "/about"  as const, label: t("about")   },
    { href: "/compare"as const, label: t("compare") },
    { href: "/contact"as const, label: t("contact") },
  ];

  return (
    <nav
      data-scrolled={scrolled ? "true" : "false"}
      data-light-page={useLightSurfaceHeader ? "true" : "false"}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        useLightSurfaceHeader ? "header-on-light-surface" : ""
      } ${
        scrolled
          ? "border-b border-white/[0.03] bg-[#111213]/12 backdrop-blur-[4px] shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          : "border-b border-white/[0.015] bg-[#111213]/5 backdrop-blur-[1.5px]"
      }`}
      style={{ height: "5rem" }}
    >
      <div className="section-container h-full flex items-center justify-between gap-8">

        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link href="/" className="flex-shrink-0 h-[22px] flex items-center gap-3 group">
          <Image
            src="/byd-wordmark.svg"
            alt="BYD"
            width={88}
            height={20}
            priority
            className="block h-[15px] w-auto flex-shrink-0 group-hover:opacity-80 transition-opacity duration-200"
          />
          <div className="hidden sm:flex h-full items-center gap-2 text-white/55 group-hover:text-white/75 transition-colors duration-200">
            <span className="text-[15px] font-semibold tracking-[0.04em] leading-none">
              {ka ? "თბილისი" : "Tbilisi"}
            </span>
            <span className="text-white/25 text-[15px] font-light leading-none">|</span>
            <span className="text-[15px] font-semibold tracking-[0.04em] leading-none">GT Group</span>
          </div>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-7 flex-1 justify-center relative">

          {/* Home, About */}
          {[baseLinks[0], baseLinks[1]].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm${pathname === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          {/* ── Models trigger (with mega-menu) ── */}
          <div
            className="relative"
            onMouseEnter={openMega}
            onMouseLeave={() => scheduleMegaClose(200)}
          >
            <button
              className={`nav-link text-sm flex items-center gap-1 ${
                pathname.startsWith("/catalog") ? "active" : ""
              }`}
              aria-expanded={megaOpen}
              aria-haspopup="true"
            >
              {ka ? "მოდელები" : "Models"}
              <motion.svg
                className="w-3 h-3 text-white/40 mt-px"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                animate={{ rotate: megaOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {megaOpen && (
                <div onMouseEnter={openMega} onMouseLeave={() => scheduleMegaClose(200)}>
                  <MegaMenu locale={locale} onClose={closeMegaImmediate} />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Compare, Contact */}
          {[baseLinks[2], baseLinks[3]].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm${pathname === link.href ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── Right actions ─────────────────────────────────────── */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            className="theme-toggle hidden sm:inline-flex h-9 w-9 items-center justify-center border border-white/15 bg-[#111213]/25 text-white/60 transition-colors duration-200 hover:border-white/35 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-byd-red/70"
          >
            {theme === "dark" ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A8.5 8.5 0 1 1 11.21 3 6.5 6.5 0 0 0 21 12.79Z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={switchLocale}
            aria-label="Switch language"
            className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold tracking-[0.12em] uppercase text-white/45 hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{locale === "en" ? "KA" : "EN"}</span>
          </button>

          <span className="hidden sm:block h-4 w-px bg-white/15" />

          <Link
            href="/booking"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-byd-red text-white text-[13px] font-bold tracking-[0.1em] uppercase hover:bg-[#A80912] transition-colors duration-200"
          >
            {tCommon("bookTestDrive")}
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-[5px] p-1.5"
            aria-label={mobileOpen ? tCommon("close") : tCommon("menu")}
          >
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-200 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          mobileOpen ? "max-h-[560px]" : "max-h-0"
        }`}
      >
        <div className="mobile-menu-panel">
          <div className="section-container py-2">

            {/* Regular links */}
            {[baseLinks[0], baseLinks[1]].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between py-3.5 text-sm border-b border-white/[0.05] transition-colors duration-200 ${
                  pathname === link.href ? "text-white font-semibold" : "text-white/50 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {pathname === link.href && <span className="w-1.5 h-1.5 bg-byd-red" />}
              </Link>
            ))}

            {/* Models accordion */}
            <div className="border-b border-white/[0.05]">
              <button
                onClick={() => setMobileModels(!mobileModels)}
                className="flex items-center justify-between w-full py-3.5 text-sm text-white/50 hover:text-white transition-colors duration-200"
              >
                <span>{ka ? "მოდელები" : "Models"}</span>
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ rotate: mobileModels ? 180 : 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Model sub-items */}
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: mobileModels ? "340px" : "0px" }}
              >
                <div className="pb-3 pl-2 space-y-1">
                  {MEGA_MODELS.map((model) => (
                    <Link
                      key={model.id}
                      href={model.href}
                      onClick={() => { setMobileOpen(false); setMobileModels(false); }}
                      className="flex items-center gap-3 py-2 px-3 hover:bg-white/[0.04] transition-colors duration-150 group"
                    >
                      {/* Mini thumbnail */}
                      <div className="relative w-14 h-10 flex-shrink-0 bg-[#252728] overflow-hidden">
                        <Image
                          src={model.thumbnail}
                          alt={model.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          quality={70}
                        />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white/75 group-hover:text-white transition-colors">
                          {model.name}
                        </p>
                        <span className={`text-[9px] font-semibold uppercase tracking-[0.12em] ${
                          model.type === "EV" ? "text-[#78B254]" : "text-byd-red"
                        }`}>
                          {model.type}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/catalog"
                    onClick={() => { setMobileOpen(false); setMobileModels(false); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/30 hover:text-white/60 transition-colors"
                  >
                    {ka ? "ყველა მოდელი" : "View all"} →
                  </Link>
                </div>
              </div>
            </div>

            {/* Compare, Contact */}
            {[baseLinks[2], baseLinks[3]].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between py-3.5 text-sm border-b border-white/[0.05] last:border-0 transition-colors duration-200 ${
                  pathname === link.href ? "text-white font-semibold" : "text-white/50 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {pathname === link.href && <span className="w-1.5 h-1.5 bg-byd-red" />}
              </Link>
            ))}

            {/* Bottom row */}
            <div className="py-4 flex items-center justify-between border-t border-white/[0.05] mt-1">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="theme-toggle flex h-9 w-9 items-center justify-center border border-white/12 bg-white/[0.04] text-white/45 transition-colors duration-200 hover:border-white/30 hover:text-white"
              >
                {theme === "dark" ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A8.5 8.5 0 1 1 11.21 3 6.5 6.5 0 0 0 21 12.79Z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => { switchLocale(); setMobileOpen(false); }}
                className="text-xs font-semibold tracking-[0.15em] uppercase text-white/35 hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                {locale === "en" ? "ქართული" : "English"}
              </button>
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="inline-flex min-h-11 items-center justify-center bg-byd-red px-4 text-xs font-bold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-[#A80912]"
              >
                {tCommon("bookTestDrive")}
              </Link>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
}
