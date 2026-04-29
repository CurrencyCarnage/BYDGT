"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ShowroomSlide {
  src: string;
  alt: string;
}

interface ShowroomSliderProps {
  slides: ShowroomSlide[];
  label?: string;
  heading?: string;
}

export default function ShowroomSlider({ slides, label, heading }: ShowroomSliderProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, scale: 1.04, x: dir > 0 ? 30 : -30 }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.9, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.98,
      x: dir > 0 ? -30 : 30,
      transition: { duration: 0.5, ease: "easeIn" as const },
    }),
  };

  return (
    <div className="w-full">
      {/* Full-bleed slider */}
      <div className="relative overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-[#2C2F30]">
        {/* Slides */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={slides[current].src}
              alt={slides[current].alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 90vw, 1280px"
              className="object-cover object-center"
              style={{ filter: "contrast(1.06) saturate(1.08) brightness(0.97)" }}
              priority={current === 0}
              quality={92}
            />
          </motion.div>
        </AnimatePresence>

        {/* Layered vignette for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10 pointer-events-none" />

        {/* Overlay label + heading — bottom left */}
        {(label || heading) && (
          <div className="absolute bottom-7 left-8 z-10">
            {label && (
              <p className="text-[10px] text-white/50 uppercase tracking-[0.25em] mb-1.5" style={{ fontFamily: "var(--font-montserrat)" }}>
                {label}
              </p>
            )}
            {heading && (
              <h2 className="text-xl md:text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "-0.01em" }}>
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* Slide counter — top right */}
        <div className="absolute top-5 right-6 z-10">
          <span className="text-xs text-white/50 font-light tracking-widest" style={{ fontFamily: "var(--font-montserrat)" }}>
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* Arrow controls */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 border border-white/20 bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:border-byd-red/70 hover:bg-black/45 transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 border border-white/20 bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:border-byd-red/70 hover:bg-black/45 transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <motion.div
            className="h-full bg-white/40"
            key={current}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      </div>

    </div>
  );
}
