"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

interface HomepageHeroProps {
  locale: string;
}

const benefits = [
  {
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    en: { title: "Official Warranty", sub: "Up to 8 years" },
    ka: { title: "ოფიციალური გარანტია", sub: "8 წლამდე" },
  },
  {
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    en: { title: "Service Network", sub: "Across Georgia" },
    ka: { title: "სერვის ქსელი", sub: "მთელ საქართველოში" },
  },
  {
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    en: { title: "Charging Solutions", sub: "Home & Public" },
    ka: { title: "დამუხტვის გადაწყვეტები", sub: "სახლი & საჯარო" },
  },
  {
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    en: { title: "Local Support", sub: "Here for you" },
    ka: { title: "ლოკალური მხარდაჭერა", sub: "ყოველთვის თქვენთვის" },
  },
];

// Model specs for carousel slides — same content style as the first hero slide
const MODEL_SPECS = [
  null, // First slide is main hero, no specs
  {
    href: "/catalog/sealion-06-dmi",
    en: { name: "Sealion 06 DM-i", type: "PHEV SUV", range: "1,670 km", power: "218 hp", price: "From $36,000" },
    ka: { name: "Sealion 06 DM-i", type: "PHEV SUV", range: "1,670 კმ", power: "218 ც.ძ.", price: "$36,000-დან" },
  },
  {
    href: "/catalog/seal-06-dmi",
    en: { name: "Seal 06 DM-i", type: "PHEV Sedan", range: "2,110 km", power: "161 hp", price: "From $30,000" },
    ka: { name: "Seal 06 DM-i", type: "PHEV Sedan", range: "2,110 კმ", power: "161 ც.ძ.", price: "$30,000-დან" },
  },
  {
    href: "/catalog/yuan-up-ev",
    en: { name: "Yuan Up EV", type: "Pure Electric", range: "401 km", power: "177 hp", price: "From $25,000" },
    ka: { name: "Yuan Up EV", type: "Pure Electric", range: "401 კმ", power: "177 ც.ძ.", price: "$25,000-დან" },
  },
  {
    href: "/catalog/yuan-up-dmi",
    en: { name: "Yuan Up DM-i", type: "PHEV Compact", range: "1,000 km", power: "212 hp", price: "From $22,000" },
    ka: { name: "Yuan Up DM-i", type: "PHEV Compact", range: "1,000 კმ", power: "212 ც.ძ.", price: "$22,000-დან" },
  },
];

// Hero carousel — main hero + model showcase content
// shiftRight slides: image container starts at left: 22% of viewport so the car
// (typically centred in the source image) appears at ~60-65% of the viewport,
// leaving the left 0-22% as solid dark background for the text overlay.
const SLIDES: Array<{
  type: "image" | "video";
  src: string;
  alt: string;
  objectPos: string;
}> = [
  { type: "image", src: "/images/homepage/main-hero-upscaled.jpg", alt: "BYD — Electric mobility", objectPos: "center 52%" },
  { type: "video", src: "/images/models/sealion-06-dmi/sealion-6-promo.mp4", alt: "Sealion 06 DM-i", objectPos: "center center" },
  { type: "image", src: "/images/models/seal-06-dmi/hero.jpg", alt: "Seal 06 DM-i", objectPos: "62% 38%" },
  { type: "image", src: "/images/models/yuan-up-ev/hero.jpg", alt: "Yuan Up EV", objectPos: "62% 38%" },
  { type: "image", src: "/images/models/yuan-up-dmi/hero.jpg", alt: "Yuan Up DM-i", objectPos: "62% 38%" },
];

const SLIDE_DURATION = 6000; // ms per slide (video will auto-play and use its duration)

export default function HomepageHero({ locale }: HomepageHeroProps) {
  const ka = locale === "ka";
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const goTo = (idx: number) => {
    setCurrent(idx);
  };

  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const slide = SLIDES[current];
    if (slide.type === "video") {
      const duration = videoDuration !== null ? videoDuration * 1000 : SLIDE_DURATION;
      const timer = setTimeout(next, duration);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(next, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current, next, videoDuration]);

  const slide = SLIDES[current];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── SLIDING BACKGROUND LAYER ─────────────────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 1.6, ease: "easeOut" } }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.9, ease: "easeIn" } }}
        >
          <div className="absolute inset-0 bg-[#1A1C1D]" />
          {slide.type === "image" && (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.objectPos }}
              priority={current === 0}
              quality={94}
            />
          )}
          {slide.type === "video" && (
            <video
              ref={videoRef}
              key={slide.src}
              src={slide.src}
              autoPlay
              muted
              playsInline
              onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── PERSISTENT OVERLAYS ────────────────────────────────────── */}
      {/* Desktop left gradient — main hero only */}
      {current === 0 && (
        <div className="absolute inset-0 hidden md:block" style={{
          background: "linear-gradient(92deg, rgba(10,12,15,0.94) 2%, rgba(10,12,15,0.78) 28%, rgba(10,12,15,0.38) 54%, rgba(10,12,15,0.10) 72%, rgba(10,12,15,0) 100%)"
        }} />
      )}
      {/* Mobile: bottom-up */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#141618]/98 via-[#141618]/82 to-[#141618]/22" />
      {/* Top nav darkening — always present */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(20,22,24,0.72) 0%, rgba(20,22,24,0.12) 18%, transparent 36%)" }} />
      {/* Bottom blend — main hero only */}
      {current === 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-44" style={{ background: "linear-gradient(to top, rgba(14,16,18,0.94) 0%, rgba(14,16,18,0.72) 38%, rgba(14,16,18,0.28) 65%, transparent 100%)" }} />
      )}

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div
        className="relative flex-1 flex items-end md:items-center z-10"
        style={{ paddingTop: "80px" }}
      >
        {/* Navigation Arrows — Desktop only, centered vertically in the flex-1 area */}
        <button
          onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Previous slide"
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-white/20 bg-black/20 hover:bg-black/40 hover:border-white/50 backdrop-blur-sm transition-all duration-200 group"
        >
          <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goTo((current + 1) % SLIDES.length)}
          aria-label="Next slide"
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full border border-white/20 bg-black/20 hover:bg-black/40 hover:border-white/50 backdrop-blur-sm transition-all duration-200 group"
        >
          <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="section-container w-full pb-6 md:pb-16">
          <AnimatePresence mode="wait">
            {current === 0 ? (
              /* ── FIRST SLIDE: brand hero text ── */
              <motion.div
                key="slide-0"
                className="max-w-2xl"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-byd-red">
                    {ka ? "ელექტრო მომავალი" : "Electric Mobility"}
                  </p>
                </div>
                <h1
                  className="text-[2.4rem] md:text-h1 font-semibold text-white mb-5 md:mb-6 leading-[1.07] md:leading-[1.1]"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  {ka
                    ? "ელექტრო მობილობა, დახვეწილი საქართველოსთვის"
                    : <>Electric mobility,<br className="hidden sm:block" /> refined for Georgia</>}
                </h1>
                <p className="text-sm md:text-body1 text-white/55 mb-8 md:mb-10 leading-relaxed font-light max-w-lg">
                  {ka
                    ? "GT Group-ი BYD-ის ოფიციალური დილერია საქართველოში. ინოვაციური ტექნოლოგია. პრემიუმ ხარისხი. ლოკალური მხარდაჭერა."
                    : "GT Group is the official BYD dealer in Georgia. Innovative technology. Premium quality. Local support you can trust."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/catalog" className="btn-primary-red justify-center sm:justify-start" style={{ minWidth: "190px" }}>
                    {ka ? "მოდელების ნახვა" : "Explore Models"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/booking" className="btn-secondary justify-center sm:justify-start" style={{ minWidth: "190px" }}>
                    {ka ? "ტესტ დრაივი" : "Book Test Drive"}
                  </Link>
                </div>
              </motion.div>
            ) : MODEL_SPECS[current] ? (
              /* ── ALL MODEL SLIDES (1-4): left-column layout, no shades ── */
              <motion.div
                key={`slide-${current}`}
                className="max-w-xs md:max-w-sm"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-byd-red">
                    {ka ? MODEL_SPECS[current]!.ka.type : MODEL_SPECS[current]!.en.type}
                  </p>
                </div>
                <h2
                  className="text-[2.4rem] md:text-h1 font-semibold text-white mb-6 md:mb-8 leading-[1.07] md:leading-[1.1]"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  {ka ? MODEL_SPECS[current]!.ka.name : MODEL_SPECS[current]!.en.name}
                </h2>
                <div className="flex items-start gap-6 md:gap-10 mb-8 md:mb-10">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.20em] mb-1.5">{ka ? "მანძილი" : "Range"}</p>
                    <p className="text-xl md:text-2xl font-semibold text-white leading-none">{ka ? MODEL_SPECS[current]!.ka.range : MODEL_SPECS[current]!.en.range}</p>
                  </div>
                  <div className="w-px h-10 bg-white/15 mt-3 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.20em] mb-1.5">{ka ? "სიმძლავრე" : "Power"}</p>
                    <p className="text-xl md:text-2xl font-semibold text-white leading-none">{ka ? MODEL_SPECS[current]!.ka.power : MODEL_SPECS[current]!.en.power}</p>
                  </div>
                  <div className="w-px h-10 bg-white/15 mt-3 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.20em] mb-1.5">{ka ? "ფასი" : "Starting Price"}</p>
                    <p className="text-xl md:text-2xl font-semibold text-byd-red leading-none">{ka ? MODEL_SPECS[current]!.ka.price : MODEL_SPECS[current]!.en.price}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href={MODEL_SPECS[current]!.href} className="btn-primary-red justify-center sm:justify-start" style={{ minWidth: "190px" }}>
                    {ka ? "დეტალები" : "View Model"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link href="/booking" className="btn-secondary justify-center sm:justify-start" style={{ minWidth: "190px" }}>
                    {ka ? "ტესტ დრაივი" : "Book Test Drive"}
                  </Link>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* ── SLIDE DOTS + COUNTER — bottom right ──────────────────── */}
      <div className="relative z-10 flex items-center justify-end gap-4 px-6 md:px-10 pb-4 md:pb-5">
        {/* Label */}
        <p className="hidden sm:block text-[10px] text-white/25 uppercase tracking-[0.2em] font-medium">
          {ka ? "ჩვენი სალონი" : "Our Showroom"}
        </p>
        {/* Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`transition-all duration-400 ${
                idx === current
                  ? "w-7 h-[2px] bg-white"
                  : "w-[3px] h-[3px] rounded-full bg-white/28 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── BENEFITS BAR ─────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-white/[0.06] bg-[#1A1C1D]/80 backdrop-blur-sm">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {benefits.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-3 py-4 px-4 md:px-6"
              >
                <span className="text-byd-red">{item.icon}</span>
                <div>
                  <p className="text-[11px] font-semibold text-white/80 leading-tight">
                    {ka ? item.ka.title : item.en.title}
                  </p>
                  <p className="text-[10px] text-white/35 mt-0.5">
                    {ka ? item.ka.sub : item.en.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROGRESS BAR (removed — cleaner look) ─────────────────────── */}

    </section>
  );
}
