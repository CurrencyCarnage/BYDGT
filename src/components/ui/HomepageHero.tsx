"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";

interface HomepageHeroProps {
  locale: string;
}

type LocalizedContent = {
  title: string;
  subtitle: string;
};

type LocalizedModelSpec = {
  name: string;
  type: string;
  description: string;
  range: string;
  power: string;
  price: string;
};

type ModelSpec = {
  href:
    | "/catalog/sealion-06-dmi"
    | "/catalog/seal-06-dmi"
    | "/catalog/yuan-up-ev"
    | "/catalog/yuan-up-dmi";
  en: LocalizedModelSpec;
  ka: LocalizedModelSpec;
};

type HeroSlide = {
  type: "image" | "video";
  src: string;
  alt: string;
  objectPosition: string;
  mobileSrc?: string;
  mobileObjectPosition?: string;
};

const benefits: Array<{
  icon: JSX.Element;
  en: LocalizedContent;
  ka: LocalizedContent;
}> = [
  {
    icon: (
      <svg
        className="h-5 w-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
    en: { title: "Official Warranty", subtitle: "Up to 8 years" },
    ka: { title: "ოფიციალური გარანტია", subtitle: "8 წლამდე" },
  },
  {
    icon: (
      <svg
        className="h-5 w-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
    en: { title: "Service Network", subtitle: "Across Georgia" },
    ka: { title: "სერვის ქსელი", subtitle: "მთელ საქართველოში" },
  },
  {
    icon: (
      <svg
        className="h-5 w-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    en: { title: "Charging Solutions", subtitle: "Home & Public" },
    ka: { title: "დამუხტვის გადაწყვეტები", subtitle: "სახლი & საჯარო" },
  },
  {
    icon: (
      <svg
        className="h-5 w-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
    en: { title: "Local Support", subtitle: "Here for you" },
    ka: { title: "ლოკალური მხარდაჭერა", subtitle: "ყოველთვის თქვენთვის" },
  },
];

const MODEL_SPECS: Array<ModelSpec | null> = [
  null,
  {
    href: "/catalog/sealion-06-dmi",
    en: {
      name: "Sealion 06 DM-i",
      type: "PHEV SUV",
      description:
        "Electrified family SUV with generous space, confident performance, and long-range DM-i efficiency.",
      range: "1,670 km",
      power: "218 hp",
      price: "From $36,000",
    },
    ka: {
      name: "Sealion 06 DM-i",
      type: "PHEV SUV",
      description:
        "ფართო PHEV SUV ყოველდღიური კომფორტით, ძლიერი დინამიკით და ხანგრძლივი DM-i ეფექტიანობით.",
      range: "1,670 კმ",
      power: "218 ც.ძ.",
      price: "$36,000-დან",
    },
  },
  {
    href: "/catalog/seal-06-dmi",
    en: {
      name: "Seal 06 DM-i",
      type: "PHEV Sedan",
      description:
        "Elegant plug-in hybrid sedan with long-range DM-i efficiency and a composed premium silhouette.",
      range: "2,110 km",
      power: "161 hp",
      price: "From $30,000",
    },
    ka: {
      name: "Seal 06 DM-i",
      type: "PHEV Sedan",
      description:
        "ელეგანტური plug-in hybrid სედანი DM-i ეფექტიანობით, დიდი სავალით და დახვეწილი პრემიუმ იერით.",
      range: "2,110 კმ",
      power: "161 ც.ძ.",
      price: "$30,000-დან",
    },
  },
  {
    href: "/catalog/yuan-up-ev",
    en: {
      name: "Yuan Up EV",
      type: "Pure Electric",
      description:
        "Compact electric crossover with agile city-ready proportions and clean everyday EV practicality.",
      range: "401 km",
      power: "177 hp",
      price: "From $25,000",
    },
    ka: {
      name: "Yuan Up EV",
      type: "Pure Electric",
      description:
        "კომპაქტური ელექტრო ქროსოვერი ქალაქისთვის, სწრაფი ყოველდღიური მანევრულობით და სუფთა EV პრაქტიკულობით.",
      range: "401 კმ",
      power: "177 ც.ძ.",
      price: "$25,000-დან",
    },
  },
  {
    href: "/catalog/yuan-up-dmi",
    en: {
      name: "Yuan Up DM-i",
      type: "PHEV Compact",
      description:
        "Smart compact crossover pairing daily efficiency, flexible range, and confident urban-ready packaging.",
      range: "1,000 km",
      power: "212 hp",
      price: "From $22,000",
    },
    ka: {
      name: "Yuan Up DM-i",
      type: "PHEV Compact",
      description:
        "მოქნილი კომპაქტური ქროსოვერი ყოველდღიური ეფექტიანობით, პრაქტიკული სავალით და ქალაქისთვის მორგებული ფორმით.",
      range: "1,000 კმ",
      power: "212 ც.ძ.",
      price: "$22,000-დან",
    },
  },
];

const SLIDES: HeroSlide[] = [
  {
    type: "image",
    src: "/images/homepage/main-hero-upscaled.jpg",
    alt: "BYD - Electric mobility",
    objectPosition: "center 52%",
    mobileSrc: "/images/homepage/main-hero-mobile.png",
    mobileObjectPosition: "center 84%",
  },
  {
    type: "video",
    src: "/images/models/sealion-06-dmi/sealion-6-promo.mp4",
    alt: "Sealion 06 DM-i",
    objectPosition: "76% center",
    mobileObjectPosition: "center 46%",
  },
  {
    type: "image",
    src: "/images/showroom/seal-showroom.png",
    alt: "Seal 06 DM-i",
    objectPosition: "center center",
    mobileSrc: "/images/homepage/seal-mobile.png",
    mobileObjectPosition: "center 84%",
  },
  {
    type: "image",
    src: "/images/showroom/yuanup-ev-showroom.png",
    alt: "Yuan Up EV",
    objectPosition: "center center",
    mobileSrc: "/images/homepage/yuanup-ev.png",
    mobileObjectPosition: "center 82%",
  },
  {
    type: "image",
    src: "/images/showroom/yuanup-dmi-showroom.png",
    alt: "Yuan Up DM-i",
    objectPosition: "center center",
    mobileSrc: "/images/homepage/yuanup-dmi-phone.png",
    mobileObjectPosition: "center 82%",
  },
];

const SLIDE_DURATION = 6000;
const DESKTOP_OVERLAY_MAIN =
  "linear-gradient(92deg, rgba(10,12,15,0.94) 2%, rgba(10,12,15,0.78) 28%, rgba(10,12,15,0.38) 54%, rgba(10,12,15,0.10) 72%, rgba(10,12,15,0) 100%)";
const DESKTOP_OVERLAY_MODEL =
  "linear-gradient(90deg, rgba(7,10,12,0.95) 0%, rgba(7,10,12,0.88) 20%, rgba(9,12,15,0.72) 34%, rgba(15,18,21,0.52) 46%, rgba(28,31,35,0.28) 58%, rgba(42,45,49,0.10) 71%, rgba(42,45,49,0.02) 84%, rgba(42,45,49,0) 100%)";

export default function HomepageHero({ locale }: HomepageHeroProps) {
  const ka = locale === "ka";
  const [current, setCurrent] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const next = useCallback(() => {
    setCurrent((index) => (index + 1) % SLIDES.length);
  }, []);

  const previous = useCallback(() => {
    setCurrent((index) => (index - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goTo = (index: number) => {
    setCurrent(index);
  };

  useEffect(() => {
    const activeSlide = SLIDES[current];
    const duration =
      activeSlide.type === "video" && videoDuration !== null
        ? videoDuration * 1000
        : SLIDE_DURATION;
    const timer = setTimeout(next, duration);

    return () => clearTimeout(timer);
  }, [current, next, videoDuration]);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < 46 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      next();
    } else {
      previous();
    }
  };

  const slide = SLIDES[current];
  const modelSpec = MODEL_SPECS[current];
  const modelCopy = modelSpec ? (ka ? modelSpec.ka : modelSpec.en) : null;
  const modelStats = modelCopy
    ? [
        { label: ka ? "მანძილი" : "Range", value: modelCopy.range },
        { label: ka ? "სიმძლავრე" : "Power", value: modelCopy.power },
        {
          label: ka ? "საწყისი ფასი" : "Starting Price",
          value: modelCopy.price,
          accent: true,
        },
      ]
    : [];

  return (
    <section
      className="relative flex h-[100svh] min-h-[100svh] flex-col overflow-hidden md:h-auto md:min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-x-0 top-0 bottom-[106px] z-0 md:inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 1.6, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.9, ease: "easeIn" },
          }}
        >
          <div className="absolute inset-0 bg-[#1A1C1D]" />
          {slide.type === "image" ? (
            <>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="hidden object-cover md:block"
                style={{ objectPosition: slide.objectPosition }}
                priority={current === 0}
                quality={94}
              />
              <Image
                src={slide.mobileSrc ?? slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover md:hidden"
                style={{
                  objectPosition:
                    slide.mobileObjectPosition ?? slide.objectPosition,
                }}
                priority={current === 0}
                quality={94}
              />
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                key={`${slide.src}-desktop`}
                src={slide.src}
                autoPlay
                muted
                playsInline
                onLoadedMetadata={(event) =>
                  setVideoDuration(event.currentTarget.duration)
                }
                className="absolute inset-0 hidden h-full w-full object-cover md:block"
                style={{ objectPosition: slide.objectPosition }}
              />
              <video
                key={`${slide.src}-mobile`}
                src={slide.src}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover md:hidden"
                style={{
                  objectPosition:
                    slide.mobileObjectPosition ?? slide.objectPosition,
                }}
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-x-0 top-0 bottom-[106px] z-[1] hidden md:inset-0 md:block"
        style={{
          background:
            current === 0 ? DESKTOP_OVERLAY_MAIN : DESKTOP_OVERLAY_MODEL,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 bottom-[106px] z-[1] md:hidden"
        style={{
          background:
            slide.type === "video"
              ? "linear-gradient(180deg, rgba(8,12,15,0.12) 0%, rgba(8,12,15,0.04) 14%, rgba(8,12,15,0.02) 30%, rgba(8,12,15,0.10) 56%, rgba(8,12,15,0.30) 84%, rgba(8,12,15,0.54) 100%)"
              : "linear-gradient(180deg, rgba(8,12,15,0.09) 0%, rgba(8,12,15,0.03) 14%, rgba(8,12,15,0.01) 30%, rgba(8,12,15,0.06) 58%, rgba(8,12,15,0.18) 82%, rgba(8,12,15,0.38) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 bottom-[106px] z-[2] md:inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(20,22,24,0.16) 0%, rgba(20,22,24,0.04) 12%, transparent 26%)",
        }}
      />
      {current === 0 && (
        <div
          className="absolute bottom-0 left-0 right-0 z-[2] h-44"
          style={{
            background:
              "linear-gradient(to top, rgba(14,16,18,0.94) 0%, rgba(14,16,18,0.72) 38%, rgba(14,16,18,0.28) 65%, transparent 100%)",
          }}
        />
      )}

      <div
        className="relative z-10 flex flex-1 items-start md:items-center"
        style={{ paddingTop: "80px" }}
      >
        <button
          onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Previous slide"
          className="group absolute left-6 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-black/40 md:flex"
        >
          <svg
            className="h-5 w-5 text-white/60 transition-colors duration-200 group-hover:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => goTo((current + 1) % SLIDES.length)}
          aria-label="Next slide"
          className="group absolute right-6 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-black/40 md:flex"
        >
          <svg
            className="h-5 w-5 text-white/60 transition-colors duration-200 group-hover:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="section-container flex h-full w-full flex-col pb-4 pt-4 md:pb-16 md:pt-0 md:justify-center">
          <AnimatePresence mode="wait">
            {current === 0 ? (
              <motion.div
                key="slide-0"
                className="flex h-full max-w-2xl flex-col md:block md:h-auto"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div>
                  <div className="mb-4 flex items-center gap-3 md:mb-5">
                    <span className="h-[2px] w-8 flex-shrink-0 bg-byd-red" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-byd-red">
                      {ka ? "ელექტრო მობილობა" : "Electric Mobility"}
                    </p>
                  </div>
                  <h1
                    className="mb-4 max-w-[15ch] text-[2.28rem] font-semibold leading-[0.98] text-white md:mb-6 md:max-w-none md:text-h1 md:leading-[1.1]"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    {ka ? (
                      "ელექტრო მობილობა, დახვეწილი საქართველოსთვის"
                    ) : (
                      <>
                        Electric mobility,
                        <br className="hidden sm:block" /> refined for Georgia
                      </>
                    )}
                  </h1>
                  <p className="max-w-[22.5rem] text-[0.98rem] font-light leading-[1.52] text-white/70 md:mb-10 md:max-w-lg md:text-body1 md:text-white/55">
                    {ka
                      ? "GT Group არის BYD-ის ოფიციალური დილერი საქართველოში. ინოვაციური ტექნოლოგია. პრემიუმ ხარისხი. ლოკალური მხარდაჭერა."
                      : "GT Group is the official BYD dealer in Georgia. Innovative technology. Premium quality. Local support you can trust."}
                  </p>
                </div>
                <div className="mt-auto pb-2 md:mt-0 md:pb-0">
                  <div className="flex flex-wrap gap-3 sm:flex-row sm:gap-4">
                    <Link
                      href="/catalog"
                      className="btn-primary-red min-h-[46px] justify-center px-5 text-[0.95rem] sm:justify-start"
                      style={{ minWidth: "152px" }}
                    >
                      {ka ? "მოდელების ნახვა" : "Explore Models"}
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="/booking"
                      className="btn-secondary min-h-[46px] justify-center px-5 text-[0.95rem] sm:justify-start"
                      style={{ minWidth: "152px" }}
                    >
                      {ka ? "ტესტ დრაივი" : "Book Test Drive"}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : modelSpec && modelCopy ? (
              <motion.div
                key={`slide-${current}`}
                className="h-full w-full md:h-auto"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div className="h-full md:hidden">
                  <div className="flex h-full flex-col justify-end">
                    <div className="w-full max-w-none pb-1">
                      <h2
                        className="w-full text-[2.06rem] font-semibold leading-[0.96] text-white"
                        style={{ letterSpacing: "-0.025em" }}
                      >
                        {modelCopy.name}
                      </h2>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="h-[2px] w-9 flex-shrink-0 bg-byd-red" />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-byd-red">
                          {modelCopy.type}
                        </p>
                      </div>
                      <div className="mt-0 h-px w-full bg-white/12" />
                      <div className="mt-1 grid w-full grid-cols-3 gap-x-4">
                        {modelStats.map((stat) => (
                          <div key={stat.label}>
                            <p className="mb-1 text-[8px] uppercase tracking-[0.18em] text-white/46">
                              {stat.label}
                            </p>
                            <p
                              className={`text-[1.16rem] font-semibold leading-[1.02] ${
                                stat.accent ? "text-byd-red" : "text-white"
                              }`}
                            >
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 grid w-full grid-cols-2 gap-3">
                        <Link
                          href={modelSpec.href}
                          className="btn-primary-red min-h-[42px] w-full justify-center px-4 text-[0.9rem]"
                          style={{ minWidth: "0" }}
                        >
                          {ka ? "დეტალები" : "View Model"}
                        </Link>
                        <Link
                          href="/booking"
                          className="btn-secondary min-h-[42px] w-full justify-center px-4 text-[0.9rem]"
                          style={{
                            minWidth: "0",
                            background: "rgba(255,255,255,0.02)",
                            borderColor: "rgba(255,255,255,0.24)",
                          }}
                        >
                          {ka ? "ტესტ დრაივი" : "Book Test Drive"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block md:w-[min(35vw,470px)] md:py-8 xl:py-10">
                  <div className="mb-4 flex items-center gap-3 md:mb-8 xl:mb-10">
                    <span className="h-[2px] w-10 flex-shrink-0 bg-byd-red" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-byd-red">
                      {modelCopy.type}
                    </p>
                  </div>

                  <h2
                    className="mb-3 max-w-[11ch] text-[2rem] font-semibold leading-[1.03] text-white md:mb-5 md:max-w-none md:text-[3.35rem] md:leading-[1.04] xl:text-[3.7rem]"
                    style={{ letterSpacing: "-0.025em" }}
                  >
                    {modelCopy.name}
                  </h2>

                  <p className="max-w-[26rem] text-[0.92rem] font-light leading-relaxed text-white/72 md:max-w-[30rem] md:text-[1rem] md:text-white/74">
                    {modelCopy.description}
                  </p>

                  <div className="mt-5 h-px w-full bg-white/12 md:mt-7 xl:mt-8" />

                  <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:flex sm:flex-row sm:items-start sm:gap-0 md:mt-7 xl:mt-8">
                    {modelStats.map((stat, index) => (
                      <div
                        key={stat.label}
                        className={`${
                          index === 2 ? "col-span-2" : ""
                        } sm:flex-1 ${
                          index > 0
                            ? "sm:border-l sm:border-white/[0.12] sm:pl-5 md:pl-6"
                            : ""
                        }`}
                      >
                        <p className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-white/46">
                          {stat.label}
                        </p>
                        <p
                          className={`text-[1.48rem] font-semibold leading-none md:text-[1.72rem] ${
                            stat.accent ? "text-byd-red" : "text-white"
                          }`}
                        >
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4 md:mt-7 xl:mt-8">
                    <Link
                      href={modelSpec.href}
                      className="btn-primary-red justify-center sm:justify-start"
                      style={{ minWidth: "190px" }}
                    >
                      {ka ? "დეტალები" : "View Model"}
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                    <Link
                      href="/booking"
                      className="btn-secondary justify-center sm:justify-start"
                      style={{
                        minWidth: "190px",
                        background: "rgba(255,255,255,0.02)",
                        borderColor: "rgba(255,255,255,0.24)",
                      }}
                    >
                      {ka ? "ტესტ დრაივი" : "Book Test Drive"}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[106px] z-10 flex items-center justify-end gap-4 px-6 pb-2 md:relative md:bottom-auto md:px-10 md:pb-5">
        <p className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-white/25 sm:block">
          {ka ? "ჩვენი სალონი" : "Our Showroom"}
        </p>
        <div className="flex items-center gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Slide ${index + 1}`}
              className={`transition-all duration-400 ${
                index === current
                  ? "h-[2px] w-7 bg-white"
                  : "h-[3px] w-[3px] rounded-full bg-white/28 hover:bg-white/55"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t-0 bg-[#1A1C1D]/80 backdrop-blur-sm md:border-t md:border-white/[0.06]">
        <div className="section-container">
          <div className="grid grid-cols-2 divide-x divide-white/[0.06] md:grid-cols-4">
            {benefits.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.08 }}
                className="flex items-center gap-3 px-4 py-4 md:px-6"
              >
                <span className="text-byd-red">{item.icon}</span>
                <div>
                  <p className="text-[11px] font-semibold leading-tight text-white/80">
                    {ka ? item.ka.title : item.en.title}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/35">
                    {ka ? item.ka.subtitle : item.en.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
