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

export default function HeroSlider({ slides, heroCta, contactLabel }: HeroSliderProps) {
  const [current, setCurrent]             = useState(0);
  const [direction, setDirection]         = useState(1);
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

  useEffect(() => { setVideoDuration(null); }, [current]);

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
    enter:  { opacity: 0, scale: 1.04 },
    center: { opacity: 1, scale: 1,    transition: { duration: 1.4, ease: "easeOut" as const } },
    exit:   { opacity: 0, scale: 1.02, transition: { duration: 0.8, ease: "easeIn"  as const } },
  };

  const contentVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ?  50 : -50 }),
    center: { opacity: 1,  x: 0, transition: { duration: 0.75, ease: "easeOut" as const, delay: 0.15 } },
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 :  30, transition: { duration: 0.4 } }),
  };

  const s = slides[current];
  const barDuration = s.video ? (videoDuration ?? 15) : (s.duration ?? 6000) / 1000;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ paddingTop: 0 }}>

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
          <div className="absolute inset-0 bg-[#1A1C1D]" />

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

          {/* Desktop: left-side gradient so text on left is legible */}
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#1A1C1D] via-[#1A1C1D]/75 to-transparent" />

          {/* Mobile: strong bottom-up gradient — car visible at top, text readable at bottom */}
          <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#1A1C1D] via-[#1A1C1D]/85 to-[#1A1C1D]/20" />

          {/* Top darkening for nav bar on all sizes */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1C1D]/65 via-transparent to-transparent" />

          {/* Bottom page-blend */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#252728] to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── SLIDE CONTENT ────────────────────────────────────────── */}
      {/*
        Mobile  (< md): items-end  → content sits at the bottom, car shows above
        Desktop (≥ md): items-center → content vertically centred over background
      */}
      <div
        className="relative flex-1 flex items-end md:items-center"
        style={{ paddingTop: "80px" }}
      >
        <div className="section-container w-full pb-8 md:pb-32">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`content-${current}`}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-2xl"
            >
              {/* Badge */}
              <div className="mb-4 md:mb-6">
                <span className={slide.type === "EV" ? "badge-ev" : "badge-phev"}>
                  {slide.type}
                </span>
              </div>

              {/* Model name — 38px mobile / 56px desktop */}
              <h1
                className="text-[2.2rem] md:text-h1 font-semibold text-white mb-3 md:mb-5 leading-[1.08] md:leading-[1.1]"
                style={{ letterSpacing: "-0.02em" }}
              >
                {slide.modelName}
              </h1>

              {/* Tagline — 14px mobile / 24px desktop */}
              <p className="text-sm md:text-h5 text-white/55 mb-6 md:mb-10 leading-relaxed md:leading-[1.5] font-light">
                {slide.tagline}
              </p>

              {/* Specs strip */}
              <div className="flex flex-wrap gap-6 md:gap-8 mb-7 md:mb-12">
                {slide.specs.map((spec) => (
                  <div key={spec.label}>
                    <p className="text-xl md:text-2xl font-semibold text-white">
                      {spec.value}
                    </p>
                    <p className="text-[10px] md:text-[11px] text-white/35 uppercase tracking-[0.18em] mt-0.5 font-medium">
                      {spec.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTAs — stacked on mobile, inline on sm+ */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href={slide.href}
                  className="btn-primary justify-center sm:justify-start"
                  style={{ minWidth: "200px" }}
                >
                  {heroCta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary justify-center sm:justify-start"
                  style={{ minWidth: "180px" }}
                >
                  {contactLabel}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── SLIDE INDICATORS ─────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-center gap-2.5 pb-8 md:pb-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-400 ${
              idx === current
                ? "w-8 h-[3px] bg-white"
                : "w-[3px] h-[3px] rounded-full bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* ── ARROW CONTROLS ───────────────────────────────────────── */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-white/15 bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 hover:bg-black/40 transition-all duration-200"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-white/15 bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/50 hover:text-white hover:border-white/40 hover:bg-black/40 transition-all duration-200"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── PROGRESS BAR ─────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.08]">
        <motion.div
          className="h-full bg-byd-red"
          key={`bar-${current}-${videoDuration}`}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: barDuration, ease: "linear" }}
        />
      </div>

    </section>
  );
}
