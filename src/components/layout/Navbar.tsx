"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { CarModel } from "@/lib/types";

/* ─────────────────────────────────────────────────────────────────
   Language-stable label widths

   EN and KA labels differ enough in width that the navbar reflows on
   every language switch. Each label renders its opposite-language twin
   as a hidden sibling in the same grid cell, so the slot is always as
   wide as the longer of the two and nothing moves.

   These strings are sizing hints only — the visible text still comes
   from the message files. If one drifts, the slot is a few pixels off;
   it can never show the wrong text.
   ───────────────────────────────────────────────────────────────── */
const NAV_LABEL_SIZERS = {
  home: { en: "Home", ka: "მთავარი" },
  about: { en: "About Us", ka: "ჩვენს შესახებ" },
  news: { en: "News", ka: "სიახლეები" },
  catalog: { en: "Products", ka: "პროდუქტები" },
  compare: { en: "Compare", ka: "შედარება" },
  contact: { en: "Contact", ka: "კონტაქტი" },
  bookTestDrive: { en: "BOOK TEST DRIVE", ka: "ტესტ დრაივი" },
  bookService: { en: "BOOK A SERVICE", ka: "სერვისის ჯავშანი" },
} as const;

function NavLabel({
  labelKey,
  ka,
  children,
}: {
  labelKey: keyof typeof NAV_LABEL_SIZERS;
  ka: boolean;
  children: ReactNode;
}) {
  const sizer = NAV_LABEL_SIZERS[labelKey];
  return (
    <span className="navbar-label">
      <span>{children}</span>
      <span className="navbar-label-ghost" aria-hidden="true">
        {ka ? sizer.en : sizer.ka}
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Models mega-menu
───────────────────────────────────────────────────────────────── */
type ProductMenuModel = Pick<CarModel, "id" | "name" | "tagline" | "type"> & {
  images: Pick<CarModel["images"], "hero" | "gallery">;
};
type Drivetrain = CarModel["type"];

const MEGA_MODELS_PER_PAGE = 4;
const COMMERCIAL_CONTACT_HREF = "/contact?subject=Commercial%20Vehicles";

const COMMERCIAL_DIRECTIONS = [
  {
    id: "commercial-vehicles",
    title: "Commercial Vehicles",
    titleKa: "კომერციული ავტომობილები",
    eyebrow: "BYD Business",
    eyebrowKa: "BYD ბიზნესი",
    description: "Electric and hybrid mobility options for companies, fleet operators and logistics needs.",
    descriptionKa: "ელექტრო და ჰიბრიდული მობილობის მიმართულება კომპანიებისთვის, ავტოპარკებისა და ლოგისტიკისთვის.",
  },
  {
    id: "fleet-consultation",
    title: "Fleet Consultation",
    titleKa: "ფლოტის კონსულტაცია",
    eyebrow: "Custom Offer",
    eyebrowKa: "ინდივიდუალური შეთავაზება",
    description: "Request product availability, configuration guidance and a tailored commercial proposal.",
    descriptionKa: "მოითხოვეთ პროდუქტების ხელმისაწვდომობა, კონფიგურაციის რჩევა და კომერციული შეთავაზება.",
  },
];

function DrivetrainFilter({
  value,
  onChange,
  locale,
}: {
  value: Drivetrain;
  onChange: (type: Drivetrain) => void;
  locale: string;
}) {
  return (
    <div
      className="flex items-center justify-center gap-1 border-b border-[var(--theme-border-subtle)] bg-[var(--theme-surface-alt)] px-4 py-3"
      role="group"
      aria-label={locale === "ka" ? "ძრავის ტიპის ფილტრი" : "Drivetrain filter"}
    >
      {(["EV", "PHEV"] as const).map((type) => {
        const selected = value === type;
        return (
          <button
            key={type}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(type)}
            className={`min-h-9 min-w-20 border-0 px-4 text-[13px] font-bold uppercase tracking-[0.16em] transition-colors duration-200 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-text-muted)] ${
              selected
                ? type === "EV"
                  ? "bg-[#78B254] text-[#111213]"
                  : "bg-byd-red text-white"
                : "bg-transparent text-[var(--theme-text-muted)] hover:bg-black/[0.06] hover:text-[var(--theme-text-primary)]"
            }`}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}

function ProductMenuImage({
  model,
  name,
  mobile = false,
}: {
  model: ProductMenuModel;
  name: string;
  mobile?: boolean;
}) {
  const hero = model.images.hero?.trim();
  const hoverImage = model.images.gallery.find((image) => image?.trim())?.trim();
  const [heroFailed, setHeroFailed] = useState(!hero);
  const [hoverFailed, setHoverFailed] = useState(!hoverImage);

  useEffect(() => {
    setHeroFailed(!hero);
    setHoverFailed(!hoverImage);
  }, [hero, hoverImage]);

  if (heroFailed || !hero) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2B2E30] to-[#191B1C] text-white/20">
        <svg className={mobile ? "h-7 w-7" : "h-14 w-14"} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 16h14l-1.5-5h-11L5 16Zm2 0v2m10-2v2" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <Image
        src={hero}
        alt={name}
        fill
        sizes={mobile ? "56px" : "(max-width: 1279px) 50vw, 25vw"}
        className={mobile
          ? "object-cover"
          : `object-cover object-center transition-all duration-500 ${hoverImage && !hoverFailed ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"}`}
        quality={mobile ? 70 : 84}
        onError={() => setHeroFailed(true)}
      />
      {!mobile && hoverImage && !hoverFailed && (
        <Image
          src={hoverImage}
          alt={`${name} preview`}
          fill
          sizes="(max-width: 1279px) 50vw, 25vw"
          className="object-cover object-center opacity-0 scale-105 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100"
          quality={90}
          loading="lazy"
          onError={() => setHoverFailed(true)}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Services mega-menu

   Same panel geometry as the product mega-menu — full-bleed, four cards
   on one row, gap-px hairlines, matching card chrome — with a line icon
   standing in for the product photography.
───────────────────────────────────────────────────────────────── */
const SERVICE_MENU_ICONS: Record<string, ReactNode> = {
  /* Wrench — workshop / servicing */
  service: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.7 6.3a4.5 4.5 0 0 0 5.9 5.9l-8.4 8.4a2.6 2.6 0 0 1-3.7-3.7l8.4-8.4Zm0 0L18 3m-8.6 9.3L4.5 7.4A3.2 3.2 0 0 1 7.4 4.5l4.9 4.9"
    />
  ),
  /* Cog — genuine spare parts */
  "spare-parts": (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.6v2.6M12 18.8v2.6M21.4 12h-2.6M5.2 12H2.6M18.6 5.4l-1.8 1.8M7.2 16.8l-1.8 1.8M18.6 18.6l-1.8-1.8M7.2 7.2 5.4 5.4"
      />
    </>
  ),
  /* Layered box — accessories */
  accessories: (
    <>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.9 21 7.4v9.2L12 21.1 3 16.6V7.4l9-4.5Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.4l9 4.5 9-4.5M12 11.9v9.2" />
    </>
  ),
  /* Magnifier over a list — product finder */
  "product-finder": (
    <>
      <circle cx="11" cy="11" r="6.4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m20.4 20.4-4.9-4.9M8.6 10.4h4.8M8.6 13h3.2" />
    </>
  ),
};

function ServicesMegaMenu({
  locale,
  onClose,
  links,
  t,
}: {
  locale: string;
  onClose: () => void;
  links: readonly { id: string; href: string }[];
  t: (key: string) => string;
}) {
  const ka = locale === "ka";

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

      <div className="mx-auto flex max-w-[96.5rem] items-stretch gap-2" data-mega-menu>
        <div
          className="mega-menu-panel min-w-0 flex-1 overflow-hidden"
          style={{
            background: "var(--theme-menu-bg)",
            border: "1px solid var(--theme-border-subtle)",
            boxShadow: "var(--theme-menu-shadow)",
          }}
        >
          <div
            className="grid grid-cols-1 gap-px bg-white/[0.04] p-px md:grid-cols-4"
            role="menu"
            aria-label={t("aria")}
          >
            {links.map((link, i) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.22, ease: "easeOut" }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  role="menuitem"
                  className="mega-menu-card group flex flex-col overflow-hidden bg-[#1A1C1D] transition-colors duration-180 hover:bg-[#222425] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-byd-red/70"
                  style={{ borderLeft: "2px solid transparent" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "#D70C19";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                  }}
                >
                  {/* Icon plate — occupies the product menu's thumbnail slot */}
                  <div
                    className="mega-menu-card-thumb relative flex w-full items-center justify-center overflow-hidden bg-[#252728]"
                    style={{ height: "11.75rem" }}
                  >
                    <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-byd-red/[0.10] blur-3xl" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-byd-red/60 to-transparent opacity-70" />
                    <svg
                      className="relative h-16 w-16 text-white/70 transition-all duration-300 group-hover:scale-105 group-hover:text-byd-red"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.35}
                      aria-hidden="true"
                    >
                      {SERVICE_MENU_ICONS[link.id]}
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="w-full flex-1 px-5 py-4">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-byd-red">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-1 text-[15px] font-semibold leading-tight text-white">
                      {t(link.id)}
                    </p>
                    <p className="mt-1 text-[11px] font-light leading-snug text-white/40">
                      {t(`menuDescription.${link.id}`)}
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
              href="/services"
              onClick={onClose}
              className="group flex items-center justify-center gap-2 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 transition-colors duration-200 hover:text-white/80"
            >
              {ka ? "ყველა სერვისის ნახვა" : "View all services"}
              <svg
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Desktop mega-menu panel
───────────────────────────────────────────────────────────────── */
function MegaMenu({
  locale,
  onClose,
  models,
}: {
  locale: string;
  onClose: () => void;
  models: ProductMenuModel[];
}) {
  const ka = locale === "ka";
  const category = "passenger";
  const [drivetrain, setDrivetrain] = useState<Drivetrain>("EV");
  const [modelPage, setModelPage] = useState(0);
  const filteredModels = models.filter((model) => model.type === drivetrain);
  const pageCount = Math.ceil(filteredModels.length / MEGA_MODELS_PER_PAGE);
  const visibleModels = filteredModels.slice(
    modelPage * MEGA_MODELS_PER_PAGE,
    (modelPage + 1) * MEGA_MODELS_PER_PAGE
  );
  const canShowNextModels = modelPage < pageCount - 1;

  const showNextModels = () => {
    if (!canShowNextModels) return;
    setModelPage((page) => Math.min(page + 1, pageCount - 1));
  };

  const selectDrivetrain = (type: Drivetrain) => {
    setDrivetrain(type);
    setModelPage(0);
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

      <div className="mx-auto flex max-w-[96.5rem] items-stretch gap-2" data-mega-menu>
        <div
          className="mega-menu-panel min-w-0 flex-1 overflow-hidden"
          style={{
            background: "var(--theme-menu-bg)",
            border:     "1px solid var(--theme-border-subtle)",
            boxShadow:  "var(--theme-menu-shadow)",
          }}
        >
          {/* 2 × 2 model grid */}
          {category === "passenger" ? (
            <>
          <DrivetrainFilter value={drivetrain} onChange={selectDrivetrain} locale={locale} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/[0.04] p-px">
            {visibleModels.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.22, ease: "easeOut" }}
              >
                <Link
                  href={`/catalog/${model.id}`}
                  onClick={onClose}
                  className="mega-menu-card group flex flex-col bg-[#1A1C1D] hover:bg-[#222425] transition-colors duration-180 overflow-hidden"
                  style={{ borderLeft: "2px solid transparent" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "#D70C19";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                  }}
                >
                  {/* Thumbnail */}
                  <div className="mega-menu-card-thumb relative w-full overflow-hidden bg-[#252728]" style={{ height: '11.75rem' }}>
                    <ProductMenuImage model={model} name={ka ? model.name.ka : model.name.en} />
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
                      {ka ? model.name.ka : model.name.en}
                    </p>
                    <p className="text-[11px] text-white/40 mt-1 leading-snug font-light">
                      {ka ? model.tagline.ka : model.tagline.en}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
            {visibleModels.length === 0 && (
              <div className="col-span-full flex min-h-[16rem] items-center justify-center px-6 text-center text-sm text-white/40">
                {ka ? "ამ ტიპის პროდუქტი ამჟამად არ არის ხელმისაწვდომი." : "No products of this type are currently available."}
              </div>
            )}
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
              {ka ? "ყველა პროდუქტის ნახვა" : "View all products"}
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
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-px bg-white/[0.04] p-px md:grid-cols-2">
                {COMMERCIAL_DIRECTIONS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.22, ease: "easeOut" }}
                  >
                    <Link
                      href={COMMERCIAL_CONTACT_HREF}
                      onClick={onClose}
                      className="mega-menu-card commercial-direction-card group relative flex min-h-[15.75rem] flex-col justify-between overflow-hidden bg-[#1A1C1D] px-6 py-5 transition-colors duration-200 hover:bg-[#222425]"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-byd-red/70 to-transparent opacity-70" />
                      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-byd-red/[0.10] blur-3xl" />
                      <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-40 border-b border-r border-white/[0.10]" />
                      <div className="relative z-10">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-byd-red">
                          {ka ? item.eyebrowKa : item.eyebrow}
                        </span>
                        <h3 className="mt-2 text-[18px] font-bold leading-tight text-white transition-colors duration-200 group-hover:text-white">
                          {ka ? item.titleKa : item.title}
                        </h3>
                        <p className="mt-3 max-w-md text-[12px] font-light leading-relaxed text-white/48">
                          {ka ? item.descriptionKa : item.description}
                        </p>
                      </div>
                      <div className="relative z-10 mt-8 flex items-center justify-between gap-4">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50 transition-colors duration-200 group-hover:text-white/80">
                          {ka ? "შეთავაზების მოთხოვნა" : "Request offer"}
                        </span>
                        <span className="flex h-10 w-10 items-center justify-center border border-white/[0.18] text-white/70 transition-all duration-200 group-hover:border-byd-red group-hover:bg-byd-red group-hover:text-white">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.2}
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.18, duration: 0.2 }}
                className="border-t border-white/[0.06]"
              >
                <Link
                  href={COMMERCIAL_CONTACT_HREF}
                  onClick={onClose}
                  className="group flex items-center justify-center gap-2 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 transition-colors duration-200 hover:text-white/80"
                >
                  {ka ? "კომერციული კონსულტაცია" : "Commercial consultation"}
                  <svg
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </>
          )}
        </div>

        <div className="hidden w-12 shrink-0 items-center justify-center md:flex">
          <button
            type="button"
            onClick={showNextModels}
            disabled={category !== "passenger" || !canShowNextModels}
            title={ka ? "შემდეგი 4 პროდუქტი" : "Show next 4 products"}
            aria-label={ka ? "შემდეგი 4 პროდუქტი" : "Show next 4 products"}
            className={`mega-pagination-button flex h-11 w-11 items-center justify-center border transition-all duration-200 ${
              category === "passenger" && canShowNextModels
                ? "cursor-pointer border-white/40 bg-[#111213]/80 text-white hover:border-byd-red/70 hover:bg-byd-red hover:text-white focus:outline-none focus:ring-2 focus:ring-byd-red/60"
                : "cursor-not-allowed border-white/34 bg-[#111213]/46 text-white/78"
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
export default function Navbar({ models }: { models: ProductMenuModel[] }) {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [megaOpen, setMegaOpen]           = useState(false);
  const [mobileModels, setMobileModels]   = useState(false);
  const [mobileDrivetrain, setMobileDrivetrain] = useState<Drivetrain>("EV");
  const [scrolled, setScrolled]           = useState(false);
  const [overLightSurface, setOverLightSurface] = useState(false);
  const [theme, setTheme]                 = useState<"dark" | "light">("dark");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t       = useTranslations("nav");
  const tCommon = useTranslations("common");
  const tServicesNav = useTranslations("landing.servicesPage.nav");
  const locale  = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router   = useRouter();

  useEffect(() => {
    const isLightSurface = (element: Element) => {
      const backgroundColor = window.getComputedStyle(element).backgroundColor;
      const match = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return true;

      const [, red, green, blue] = match.map(Number);
      const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
      return luminance > 0.62;
    };

    const updateHeaderSurface = () => {
      setScrolled(window.scrollY > 20);

      const probeY = Math.min(96, Math.max(72, window.innerHeight * 0.12));
      const elements = document.elementsFromPoint(window.innerWidth / 2, probeY);
      const surfaceElement = elements.find(
        (element) => !element.closest("nav")
      );
      const lightSurface = surfaceElement?.closest('[data-header-theme="light"]');

      setOverLightSurface(
        Boolean(lightSurface && isLightSurface(lightSurface))
      );
    };

    updateHeaderSurface();
    window.addEventListener("scroll", updateHeaderSurface, { passive: true });
    window.addEventListener("resize", updateHeaderSurface);

    return () => {
      window.removeEventListener("scroll", updateHeaderSurface);
      window.removeEventListener("resize", updateHeaderSurface);
    };
  }, [pathname, theme]);

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
    sessionStorage.setItem("byd-scroll-y", String(window.scrollY));
    router.replace(pathname, { locale: locale === "en" ? "ka" : "en", scroll: false });
  };

  /* Restore scroll position after locale switch */
  useEffect(() => {
    const saved = sessionStorage.getItem("byd-scroll-y");
    if (saved === null) return;
    sessionStorage.removeItem("byd-scroll-y");
    const y = parseInt(saved, 10);
    window.scrollTo(0, y);
    // Retry after layout settles (server components may render async)
    const t1 = setTimeout(() => window.scrollTo(0, y), 60);
    const t2 = setTimeout(() => window.scrollTo(0, y), 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [locale]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("light", nextTheme === "light");
    window.localStorage.setItem("byd-theme", nextTheme);
  };

  const ka = locale === "ka";
  const isGateway = pathname === "/";
  const isHomepage = isGateway || pathname === "/cars";
  const isPassengerContextPage =
    (pathname === "/about" || pathname === "/contact") &&
    searchParams.get("section") === "passenger";

  const useLightSurfaceHeader =
    overLightSurface || (theme === "light" && (isGateway || !isHomepage));

  const sectionHomeHref =
    isPassengerContextPage
      ? "/cars"
      : pathname === "/commercial" || pathname.startsWith("/commercial/")
      ? "/commercial"
      : pathname === "/services" || pathname.startsWith("/services/")
        ? "/services"
        : pathname === "/cars" ||
            pathname.startsWith("/cars/") ||
            pathname.startsWith("/catalog") ||
            pathname.startsWith("/compare") ||
            pathname.startsWith("/booking")
          ? "/cars"
          : null;
  const hasSelectedSection = sectionHomeHref !== null;
  const isServicesSection = pathname === "/services" || pathname.startsWith("/services/");
  const isCommercialSection =
    pathname === "/commercial" || pathname.startsWith("/commercial/");
  /* Commercial has no product mega-menu and nothing to compare against yet. */
  const showProductsMenu = hasSelectedSection && !isCommercialSection;
  const showCompareLink = hasSelectedSection && !isServicesSection && !isCommercialSection;

  /* Carry the product the visitor is currently viewing into the booking form,
     so Product / Version arrive pre-selected. */
  const catalogModelId = pathname.match(/^\/catalog\/([^/]+)/)?.[1];
  const testDriveHref = catalogModelId
    ? `/booking?version=${encodeURIComponent(catalogModelId)}`
    : "/booking";

  /* Inside Services the primary CTA books a service visit, not a test drive. */
  const primaryCtaHref = isServicesSection ? "/services/service" : testDriveHref;
  const primaryCtaLabel = isServicesSection ? (
    <NavLabel labelKey="bookService" ka={ka}>{tCommon("bookService")}</NavLabel>
  ) : (
    <NavLabel labelKey="bookTestDrive" ka={ka}>{tCommon("bookTestDrive")}</NavLabel>
  );
  const showCompanyInfoNav = isGateway;
  const serviceSectionLinks = [
    { id: "service", href: "/services/service" },
    { id: "spare-parts", href: "/services/spare-parts" },
    { id: "accessories", href: "/services/accessories" },
    { id: "product-finder", href: "/services/product-finder" },
  ] as const;
  const mobileModelCategory = "passenger";
  const filteredMobileModels = models.filter((model) => model.type === mobileDrivetrain);
  const homeLink = sectionHomeHref
    ? {
        href: sectionHomeHref,
        label: <NavLabel labelKey="home" ka={ka}>{t("home")}</NavLabel>,
        activePath: sectionHomeHref,
      }
    : null;
  const aboutLink = {
    href: sectionHomeHref === "/cars" ? "/about?section=passenger" : "/about",
    label: <NavLabel labelKey="about" ka={ka}>{t("about")}</NavLabel>,
    activePath: "/about",
  };
  const compareLink = {
    href: "/compare",
    label: <NavLabel labelKey="compare" ka={ka}>{t("compare")}</NavLabel>,
    activePath: "/compare",
  };
  const newsLink = {
    href: "/news",
    label: <NavLabel labelKey="news" ka={ka}>{t("news")}</NavLabel>,
    activePath: "/news",
  };
  const contactLink = {
    href: sectionHomeHref === "/cars" ? "/contact?section=passenger" : "/contact",
    label: <NavLabel labelKey="contact" ka={ka}>{t("contact")}</NavLabel>,
    activePath: "/contact",
  };
  const leadingNavLinks = homeLink
    ? [homeLink, aboutLink]
    : showCompanyInfoNav
      ? [aboutLink, newsLink, contactLink]
      : [aboutLink];
  const trailingNavLinks = showCompanyInfoNav
    ? []
    : showCompareLink
      ? [compareLink, contactLink]
      : [contactLink];
  const isNavLinkActive = (link: { activePath: string }) =>
    pathname === link.activePath ||
    (link.activePath === "/news" && pathname.startsWith("/news/"));

  return (
    <nav
      data-scrolled={scrolled ? "true" : "false"}
      data-gateway={isGateway ? "true" : "false"}
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
      <div className="section-container relative h-full flex items-center justify-between gap-8">

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
          <div className={`${showCompanyInfoNav ? "hidden lg:flex" : "hidden sm:flex"} h-full items-center gap-2 text-white/55 group-hover:text-white/75 transition-colors duration-200`}>
            <span className="text-[15px] font-semibold tracking-[0.04em] leading-none">
              {ka ? "თბილისი" : "Tbilisi"}
            </span>
            <span className="text-white/25 text-[15px] font-light leading-none">|</span>
            <span className="text-[15px] font-semibold tracking-[0.04em] leading-none">GT Group</span>
          </div>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────── */}
        <div className={`hidden md:flex items-center gap-7 ${
          showCompanyInfoNav ? "absolute left-1/2 -translate-x-1/2" : "flex-1 justify-center"
        }`}>

          {/* Home, About */}
          {leadingNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm${isNavLinkActive(link) ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          {/* ── Products trigger (section links in Services; product mega-menu elsewhere) ── */}
          {showProductsMenu && (
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
              <NavLabel labelKey="catalog" ka={ka}>
                {ka ? "პროდუქტები" : "Products"}
              </NavLabel>
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
              {megaOpen && (isServicesSection ? (
                <div onMouseEnter={openMega} onMouseLeave={() => scheduleMegaClose(200)}>
                  <ServicesMegaMenu
                    locale={locale}
                    onClose={closeMegaImmediate}
                    links={serviceSectionLinks}
                    t={tServicesNav}
                  />
                </div>
              ) : (
                <div onMouseEnter={openMega} onMouseLeave={() => scheduleMegaClose(200)}>
                  <MegaMenu locale={locale} onClose={closeMegaImmediate} models={models} />
                </div>
              ))}
            </AnimatePresence>
          </div>
          )}

          {/* Compare, Contact */}
          {trailingNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link text-sm${isNavLinkActive(link) ? " active" : ""}`}
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
            className="theme-toggle hidden sm:inline-flex h-9 w-9 items-center justify-center border border-white/35 bg-[#111213]/35 text-white transition-colors duration-200 hover:border-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-byd-red/70"
          >
            {theme === "dark" ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.4}
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
                strokeWidth={2.4}
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
          <span className="hidden md:block h-4 w-px bg-white/15" />
          <button
            onClick={switchLocale}
            aria-label="Switch language"
            className="language-toggle hidden sm:flex items-center gap-1.5 text-[13px] font-bold tracking-[0.12em] uppercase text-white hover:text-white transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>{locale === "en" ? "KA" : "EN"}</span>
          </button>
          <span className="hidden sm:block md:hidden h-4 w-px bg-white/15" />

          {!isGateway && (
            <Link
              href={primaryCtaHref}
              className={`navbar-book-test-drive items-center gap-2 px-5 py-2.5 bg-byd-red text-[13px] font-bold tracking-[0.1em] uppercase transition-colors duration-200 ${
                showCompanyInfoNav ? "hidden xl:inline-flex" : "hidden sm:inline-flex"
              }`}
            >
              {primaryCtaLabel}
            </Link>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden flex-col gap-[5px] p-1.5"
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
        className="md:hidden overflow-hidden transition-all duration-400"
        style={{
          maxHeight: mobileOpen ? "calc(100dvh - 5rem)" : "0px",
          overflowY: mobileOpen ? "auto" : "hidden",
        }}
      >
        <div className="mobile-menu-panel">
          <div className="section-container py-2">

            {/* Regular links */}
            {leadingNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between py-3.5 text-sm border-b border-white/[0.05] transition-colors duration-200 ${
                  isNavLinkActive(link) ? "text-white font-semibold" : "text-white/50 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {isNavLinkActive(link) && <span className="w-1.5 h-1.5 bg-byd-red" />}
              </Link>
            ))}

            {/* Models accordion */}
            {showProductsMenu && (
            <div className="border-b border-white/[0.05]">
              <button
                onClick={() => setMobileModels(!mobileModels)}
                className="flex items-center justify-between w-full py-3.5 text-sm text-white/50 hover:text-white transition-colors duration-200"
              >
                <span>{ka ? "პროდუქტები" : "Products"}</span>
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

              {/* Service sections or product sub-items */}
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: mobileModels ? "720px" : "0px" }}
              >
                <div className="pb-3 pl-2 space-y-1">
                  {isServicesSection ? (
                    serviceSectionLinks.map((link) => (
                      <Link
                        key={link.id}
                        href={link.href}
                        onClick={() => { setMobileOpen(false); setMobileModels(false); }}
                        className="block px-3 py-3 text-sm text-white/70 transition-colors duration-200 hover:bg-white/[0.04] hover:text-white"
                      >
                        {tServicesNav(link.id)}
                      </Link>
                    ))
                  ) : mobileModelCategory === "passenger" ? (
                    <>
                  <div className="pr-2">
                    <DrivetrainFilter
                      value={mobileDrivetrain}
                      onChange={setMobileDrivetrain}
                      locale={locale}
                    />
                  </div>
                  {filteredMobileModels.map((model) => (
                    <Link
                      key={model.id}
                      href={`/catalog/${model.id}`}
                      onClick={() => { setMobileOpen(false); setMobileModels(false); }}
                      className="flex items-center gap-3 py-2 px-3 hover:bg-white/[0.04] transition-colors duration-150 group"
                    >
                      {/* Mini thumbnail */}
                      <div className="relative w-14 h-10 flex-shrink-0 bg-[#252728] overflow-hidden">
                        <ProductMenuImage model={model} name={ka ? model.name.ka : model.name.en} mobile />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-white/75 group-hover:text-white transition-colors">
                          {ka ? model.name.ka : model.name.en}
                        </p>
                        <span className={`text-[9px] font-semibold uppercase tracking-[0.12em] ${
                          model.type === "EV" ? "text-[#78B254]" : "text-byd-red"
                        }`}>
                          {model.type}
                        </span>
                      </div>
                    </Link>
                  ))}
                  {filteredMobileModels.length === 0 && (
                    <p className="px-3 py-5 text-sm text-white/40">
                      {ka ? "ამ ტიპის პროდუქტი ამჟამად არ არის ხელმისაწვდომი." : "No products of this type are currently available."}
                    </p>
                  )}
                  <Link
                    href="/catalog"
                    onClick={() => { setMobileOpen(false); setMobileModels(false); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/30 hover:text-white/60 transition-colors"
                  >
                    {ka ? "ყველა პროდუქტი" : "View all"} →
                  </Link>
                    </>
                  ) : (
                    <div className="px-2 pb-1">
                      <Link
                        href={COMMERCIAL_CONTACT_HREF}
                        onClick={() => { setMobileOpen(false); setMobileModels(false); }}
                        className="commercial-mobile-card block border border-white/[0.10] bg-white/[0.04] px-4 py-4 transition-colors duration-200 hover:border-byd-red/55 hover:bg-white/[0.07]"
                      >
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-byd-red">
                          {ka ? "BYD ბიზნესი" : "BYD Business"}
                        </span>
                        <p className="mt-1 text-[14px] font-bold leading-tight text-white">
                          {ka ? "კომერციული ავტომობილები" : "Commercial Vehicles"}
                        </p>
                        <p className="mt-2 text-[12px] font-light leading-relaxed text-white/55">
                          {ka
                            ? "ფლოტის, ბიზნესისა და ლოგისტიკისთვის დაგეგმილი შეთავაზებები."
                            : "Fleet, business and logistics offers handled by consultation."}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                          {ka ? "შეთავაზების მოთხოვნა" : "Request offer"} →
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}

            {/* Compare, Contact */}
            {trailingNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between py-3.5 text-sm border-b border-white/[0.05] last:border-0 transition-colors duration-200 ${
                  isNavLinkActive(link) ? "text-white font-semibold" : "text-white/50 hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {isNavLinkActive(link) && <span className="w-1.5 h-1.5 bg-byd-red" />}
              </Link>
            ))}

            {/* Bottom row */}
            <div className="py-4 flex items-center justify-between border-t border-white/[0.05] mt-1">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="theme-toggle flex h-9 w-9 items-center justify-center border border-white/35 bg-white/[0.06] text-white transition-colors duration-200 hover:border-white/70 hover:text-white"
              >
                {theme === "dark" ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A8.5 8.5 0 1 1 11.21 3 6.5 6.5 0 0 0 21 12.79Z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => { switchLocale(); setMobileOpen(false); }}
                className="language-toggle text-xs font-bold tracking-[0.15em] uppercase text-white hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                {locale === "en" ? "ქართული" : "English"}
              </button>
              {!isGateway && (
                <Link
                  href={primaryCtaHref}
                  onClick={() => setMobileOpen(false)}
                  className="navbar-book-test-drive inline-flex min-h-11 items-center justify-center bg-byd-red px-4 text-xs font-bold uppercase tracking-[0.1em] transition-colors duration-200"
                >
                  {primaryCtaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
}
