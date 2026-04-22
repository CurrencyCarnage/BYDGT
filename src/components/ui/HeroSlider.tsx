"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";

interface HeroSlide {
  id: string;
  modelName: string;
  tagline: string;
  type: "EV" | "PHEV";
  accentColor: string;
  href: string;
  image?: string;
  video?: string;
  /** Auto-advance duration in ms. Defaults to 6000. */
  duration?: number;
  specs: { label: string; value: string }[];
}

interface HeroSliderProps {
  slides: HeroSlide[];
  locale: string;
  heroTitle: string;
  heroCta: string;
  contactLabel: string;
}

export default function HeroSlider({
  slides,
  heroCta,
  contactLabel,
}: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  // Reset video duration whenever the slide changes
  useEffect(() => {
    setVideoDuration(null);
  }, [current]);

  // Per-slide auto-advance timer
  // Video slides: wait for actual video duration (falls back to 15s if not loaded)
  // Static slides: use slide.duration ?? 6000
  useEffect(() => {
    const slide = slides[current];
    if (slide.video) {
      const ms = videoDuration !== null ? videoDuration * 1000 : 15000;
      const timer = setTimeout(next, ms);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(next, slide.duration ?? 6000);
    return () => clearTimeout(timer);
  }, [current, next, slides, videoDuration]);

  const slide = slides[current];

  const bgVariants = {
    enter: { opacity: 0, scale: 1.04 },
    center: { opacity: 1, scale: 1, transition: { duration: 1.4, ease: "easeOut" as const } },
    exit:  { opacity: 0, scale: 1.02, transition: { duration: 0.8, ease: "easeIn" as const } },
  };

  const contentVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.75, ease: "easeOut" as const, delay: 0.15 } },
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30, transition: { duration: 0.4 } }),
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── BACKGROUND LAYER ─────────────────────────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0"
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {/* Base dark fill — always visible while media loads */}
          <div className="absolute inset-0 bg-[#070B14]" />

          {/* Car image — full-bleed, car positioned toward center-right */}
          {slide.image && !slide.video && (
            <Image
              src={slide.image}
              alt={slide.modelName}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
              quality={92}
            />
          )}

          {/* Promo video — full-bleed when available */}
          {slide.video && (
            <video
              ref={videoRef}
              key={slide.video}
              src={slide.video}
              autoPlay
              muted
              loop
              playsInline
              onLoadedMetadata={(e) => setVideoDuration(e.currentTarget.duration)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Left-side text legibility gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/80 to-[#070B14]/10" />

          {/* Subtle top darkening */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/60 via-transparent to-transparent" />

          {/* Bottom fade into page */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#1A1E28] to-transparent" />

          {/* Accent color tint — very subtle, ties image to slide identity */}
          <div
            className="absolute inset-0 mix-blend-color opacity-[0.08]"
            style={{ background: slide.accentColor }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Grid overlay texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── SLIDE CONTENT ────────────────────────────────────────── */}
      <div className="relative flex-1 flex items-center">
        <div className="section-container w-full pt-24 pb-32">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`content-${current}`}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-xl"
            >
              {/* Type badge */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.15em] border ${
                    slide.type === "EV"
                      ? "border-gt-green/40 text-gt-green bg-gt-green/10"
                      : "border-[#FFB800]/40 text-[#FFB800] bg-[#FFB800]/10"
                  }`}
                  style={{ fontFamily: "var(--font-source-sans)" }}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      slide.type === "EV" ? "bg-gt-green" : "bg-[#FFB800]"
                    }`}
                  />
                  {slide.type}
                </span>
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-[1.05]"
                style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "-0.025em" }}
              >
                {slide.modelName}
              </h1>

              <p
                className="text-lg text-white/60 mb-10 leading-relaxed"
                style={{ fontFamily: "var(--font-source-sans)", fontWeight: 300 }}
              >
                {slide.tagline}
              </p>

              {/* Specs strip */}
              <div className="flex flex-wrap gap-8 mb-12">
                {slide.specs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-source-sans)" }}>
                      {spec.value}
                    </p>
                    <p className="text-xs text-white/35 uppercase tracking-[0.15em] mt-0.5" style={{ fontFamily: "var(--font-source-sans)" }}>
                      {spec.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={slide.href}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#1A1E28] font-semibold rounded-button hover:bg-white/90 transition-all duration-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.18)]"
                  style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "0.02em" }}
                >
                  {heroCta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-7 py-3.5 border border-white/20 text-white/75 font-light rounded-button hover:border-white/45 hover:text-white transition-all duration-200"
                  style={{ fontFamily: "var(--font-source-sans)" }}
                >
                  {contactLabel}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── SLIDE INDICATORS ─────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-center gap-3 pb-12">
        {slides.map((s, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`transition-all duration-400 rounded-full ${
              idx === current
                ? "w-8 h-1.5 bg-white"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* ── ARROW CONTROLS ───────────────────────────────────────── */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/15 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/55 hover:text-white hover:border-white/40 hover:bg-black/35 transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full border border-white/15 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white/55 hover:text-white hover:border-white/40 hover:bg-black/35 transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── PROGRESS BAR ─────────────────────────────────────────── */}
      {(() => {
        const s = slides[current];
        const barDuration = s.video
          ? (videoDuration ?? 15)
          : (s.duration ?? 6000) / 1000;
        return (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10">
            <motion.div
              className="h-full bg-white/40"
              key={`bar-${current}-${videoDuration}`}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: barDuration, ease: "linear" }}
            />
          </div>
        );
      })()}
    </section>
  );
}
