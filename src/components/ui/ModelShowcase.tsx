"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useEffect, useRef, useState } from "react";

type ShowcaseMode = "vertical" | "line";
type AutoRollState = "stopped" | "running" | "stopping";
type HandoffKind = "manual" | "auto";

type Handoff = {
  id: number;
  from: number;
  to: number;
  kind: HandoffKind;
};

type WheelFrame = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type ModelItem = {
  id: string;
  name: string;
  href:
    | "/catalog/sealion-06-dmi"
    | "/catalog/seal-06-dmi"
    | "/catalog/yuan-up-ev"
    | "/catalog/yuan-up-dmi";
  // Path to the 1254×1254 cropped PNG
  foregroundImage: string;
  // Container dimensions (= car bounding-box from pixel analysis).
  // These set the aspect-ratio of the stage div — NOT the image intrinsic size.
  width: number;
  height: number;
  // CSS object-position so object-cover crops to the car, not the transparent padding.
  // Formula: X stays 50% (car is centred horizontally).
  // Y = (container_h − scaled_img_h) cancelled against car vertical centre.
  objectPosition: string;
  stageWidthClass: string;
  tint: string;
  titleWidthClass: string;
  frontWheelImage: string;
  rearWheelImage: string;
  // Wheel frame coords are in the CONTAINER (width×height) coordinate system,
  // after applying the object-cover scale + offset to map 1254px image → container.
  // Adjust left/top to move the overlay; adjust width/height to resize it.
  frontWheelFrame: WheelFrame;
  rearWheelFrame: WheelFrame;
};

const ASSET_VERSION = "20260503a";
const MANUAL_INCOMING_DURATION_MS = 2600;
const MANUAL_OUTGOING_DURATION_MS = MANUAL_INCOMING_DURATION_MS;
const AUTO_ROLL_DURATION_MS = 6500;
const MANUAL_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(media.matches);

    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  return reducedMotion;
}

// ─── Pixel-analysis results for each 1254×1254 cropped image ──────────────────
//
// Image → object-cover in container → display coords:
//   scale   = container_w / 1254
//   y_shift = (container_h − container_w) × objectPositionY%
//   display_x = orig_x × scale
//   display_y = orig_y × scale + y_shift
//   display_r = detected_r × scale
//
// Detected wheel centres (orig 1254px coords):
//   sealion  : front cx=318 cy=755  rear cx=978 cy=747   r≈88
//   seal     : front cx=277 cy=745  rear cx=989 cy=745   r≈93
//   yuanup1  : front cx=330 cy=734  rear cx=954 cy=750   r≈82
//   yuanup2  : front cx=294 cy=767  rear cx=994 cy=775   r≈88
// ──────────────────────────────────────────────────────────────────────────────

const MODELS: ModelItem[] = [
  {
    id: "sealion-06-dmi",
    name: "Sealion 06 DM-i",
    href: "/catalog/sealion-06-dmi",
    foregroundImage: `/images/homepage/cropped/sealion-sidecropped.png?v=${ASSET_VERSION}`,
    // Car bbox in 1254px image: x=82-1192 (w=1110), y=446-856 (h=410)
    width: 1110,
    height: 410,
    objectPosition: "50% 53%",
    stageWidthClass: "w-[min(96vw,70rem)]",
    tint: "rgba(200,205,212,0.18)",
    titleWidthClass: "max-w-[7.5ch]",
    frontWheelImage: `/images/homepage/mapped-wheels/sealion-06-dmi-front.png?v=${ASSET_VERSION}`,
    rearWheelImage: `/images/homepage/mapped-wheels/sealion-06-dmi-rear.png?v=${ASSET_VERSION}`,
    // scale=0.885  y_shift=−371  r_display≈78
    frontWheelFrame: { left: 157, top: 197, width: 222, height: 222 }, // LINE 63
    rearWheelFrame: { left: 748, top: 197, width: 222, height: 222 }, // LINE 64
  },
  {
    id: "seal-06-dmi",
    name: "Seal 06 DM-i",
    href: "/catalog/seal-06-dmi",
    foregroundImage: `/images/homepage/cropped/seal-sidecropped.png?v=${ASSET_VERSION}`,
    // Car bbox: x=56-1228 (w=1172), y=470-832 (h=362)
    width: 1172,
    height: 362,
    objectPosition: "50% 53%",
    stageWidthClass: "w-[min(96vw,73.75rem)]",
    tint: "rgba(195,205,215,0.18)",
    titleWidthClass: "max-w-[6.9ch]",
    frontWheelImage: `/images/homepage/mapped-wheels/seal-06-dmi-front.png?v=${ASSET_VERSION}`,
    rearWheelImage: `/images/homepage/mapped-wheels/seal-06-dmi-rear.png?v=${ASSET_VERSION}`,
    // scale=0.935  y_shift=−429  r_display≈87
    frontWheelFrame: { left: 148, top: 155, width: 228, height: 228 }, // LINE 79
    rearWheelFrame: { left: 810, top: 155, width: 228, height: 228 }, // LINE 80
  },
  {
    id: "yuan-up-ev",
    name: "Yuan Up EV",
    href: "/catalog/yuan-up-ev",
    foregroundImage: `/images/homepage/cropped/yuanup1-sidecropped.png?v=${ASSET_VERSION}`,
    // Car bbox: x=108-1136 (w=1028), y=446-854 (h=408)
    width: 1028,
    height: 408,
    objectPosition: "50% 53%",
    stageWidthClass: "w-[min(96vw,65rem)]",
    tint: "rgba(195,208,195,0.18)",
    titleWidthClass: "max-w-[5.9ch]",
    frontWheelImage: `/images/homepage/mapped-wheels/yuan-up-ev-front.png?v=${ASSET_VERSION}`,
    rearWheelImage: `/images/homepage/mapped-wheels/yuan-up-ev-rear.png?v=${ASSET_VERSION}`,
    // scale=0.820  y_shift=−329  r_display≈67
    frontWheelFrame: { left: 140, top: 200, width: 213, height: 213 }, // LINE 95
    rearWheelFrame: { left: 670, top: 200, width: 213, height: 213 }, // LINE 96
  },
  {
    id: "yuan-up-dmi",
    name: "Yuan Up DM-i",
    href: "/catalog/yuan-up-dmi",
    foregroundImage: `/images/homepage/cropped/yuanup2-sidecropped.png?v=${ASSET_VERSION}`,
    // Car bbox: x=70-1182 (w=1112), y=454-886 (h=432); height extended to 452 to prevent wheel clip
    width: 1112,
    height: 452,
    objectPosition: "50% 57%",
    stageWidthClass: "w-[min(96vw,70rem)]",
    tint: "rgba(195,200,215,0.18)",
    titleWidthClass: "max-w-[7.1ch]",
    frontWheelImage: `/images/homepage/mapped-wheels/yuan-up-dmi-front.png?v=${ASSET_VERSION}`,
    rearWheelImage: `/images/homepage/mapped-wheels/yuan-up-dmi-rear.png?v=${ASSET_VERSION}`,
    // scale=0.887  y_shift=−378  r_display≈78
    frontWheelFrame: { left: 126, top: 208, width: 240, height: 240 }, // LINE 111
    rearWheelFrame: { left: 748, top: 208, width: 240, height: 240 }, // LINE 112
  },
];

const LINE_BACKGROUNDS = [
  "radial-gradient(ellipse 70% 70% at 78% 58%, rgba(155,24,34,0.34) 0%, transparent 62%), linear-gradient(125deg, #08090a 0%, #17191b 52%, #21090d 100%)",
  "radial-gradient(ellipse 75% 80% at 72% 48%, rgba(150,185,235,0.42) 0%, transparent 64%), linear-gradient(125deg, #cfd9e8 0%, #eef3f8 56%, #c5d4e7 100%)",
  "radial-gradient(ellipse 70% 75% at 76% 52%, rgba(0,205,174,0.25) 0%, transparent 62%), linear-gradient(125deg, #050708 0%, #0c1718 55%, #03211d 100%)",
  "radial-gradient(ellipse 72% 75% at 72% 45%, rgba(231,159,55,0.34) 0%, transparent 62%), linear-gradient(125deg, #dfd7cb 0%, #f2eee7 54%, #dfc9aa 100%)",
] as const;

function WheelSprite({
  src,
  frame,
  stageWidth,
  stageHeight,
  imgRef,
  isDark,
}: {
  src: string;
  frame: WheelFrame;
  stageWidth: number;
  stageHeight: number;
  imgRef: React.RefObject<HTMLImageElement>;
  isDark: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[3] select-none"
      style={{
        left: `${(frame.left / stageWidth) * 100}%`,
        top: `${(frame.top / stageHeight) * 100}%`,
        width: `${(frame.width / stageWidth) * 100}%`,
        height: `${(frame.height / stageHeight) * 100}%`,
      }}
    >
      {/*
       * Invert the wheel PNG's alpha mask inside the rim so glass only appears
       * through transparent spoke openings—not over the tyre or wheel artwork.
       * This shared layer covers every carousel and mobile wheel sprite.
       */}
      <span
        className="absolute inset-0 z-0 [backdrop-filter:blur(6px)]"
        style={{
          background: isDark
            ? "rgba(7, 12, 20, 0.68)"
            : "rgba(24, 33, 45, 0.62)",
          WebkitBackdropFilter: "blur(6px)",
          WebkitMaskImage: `radial-gradient(circle at center, #000 0 39%, transparent 40%), url(\"${src}\")`,
          WebkitMaskSize: "100% 100%, 100% 100%",
          WebkitMaskPosition: "center, center",
          WebkitMaskRepeat: "no-repeat, no-repeat",
          WebkitMaskComposite: "xor",
          maskImage: `radial-gradient(circle at center, #000 0 39%, transparent 40%), url(\"${src}\")`,
          maskSize: "100% 100%, 100% 100%",
          maskPosition: "center, center",
          maskRepeat: "no-repeat, no-repeat",
          maskComposite: "exclude",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- wheel sprites need native <img> for WAAPI ref */}
      <img
        ref={imgRef}
        src={src}
        alt=""
        loading="eager"
        decoding="async"
        draggable={false}
        className={`relative z-[1] block h-full w-full ${
          isDark ? "" : "[mix-blend-mode:multiply]"
        }`}
      />
    </div>
  );
}

function baseCarWheelCutoutMask(model: ModelItem): React.CSSProperties {
  const wheelCutouts = [model.frontWheelFrame, model.rearWheelFrame].map(
    (frame) => {
      const centerX = ((frame.left + frame.width / 2) / model.width) * 100;
      const centerY = ((frame.top + frame.height / 2) / model.height) * 100;

      // The mapped sprite frame includes transparent padding around the tyre.
      // A 39% radius removes the base-cutout wheel without cutting the fender.
      return `radial-gradient(circle 39% at ${centerX}% ${centerY}%, #000 99%, transparent 100%)`;
    }
  );

  return {
    // Start with the full car cutout, then exclude its two embedded wheels.
    // The independently animated wheel sprites above supply the visible wheels.
    WebkitMaskImage: ["linear-gradient(#000 0 0)", ...wheelCutouts].join(", "),
    WebkitMaskSize: "100% 100%",
    WebkitMaskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskComposite: "xor, xor",
    maskImage: ["linear-gradient(#000 0 0)", ...wheelCutouts].join(", "),
    maskSize: "100% 100%",
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskComposite: "exclude, exclude",
  } as React.CSSProperties;
}

function ModelSection({
  model,
  locale,
  index,
  total,
  reducedMotion,
}: {
  model: ModelItem;
  locale: string;
  index: number;
  total: number;
  reducedMotion: boolean;
}) {
  const ka = locale === "ka";
  const [entryComplete, setEntryComplete] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const wheelFrontRef = useRef<HTMLImageElement>(null);
  const wheelRearRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const car = carRef.current;
    const wheelFront = wheelFrontRef.current;
    const wheelRear = wheelRearRef.current;
    if (!section || !car || entryComplete) return;

    let carAnimation: Animation | null = null;
    let frontAnimation: Animation | undefined;
    let rearAnimation: Animation | undefined;
    let disposed = false;

    const settleCar = () => {
      if (disposed) return;

      // Keep the parked position when the finished WAAPI effect is cleaned up.
      car.style.transform = "translateX(0px)";
      car.style.opacity = "1";
      setEntryComplete(true);
    };

    if (
      reducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      settleCar();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const timing: KeyframeAnimationOptions = {
          duration: MANUAL_INCOMING_DURATION_MS,
          delay: 120,
          easing: MANUAL_EASING,
          fill: "both",
        };

        carAnimation = car.animate(
          [
            { transform: "translateX(110vw)", opacity: "0" },
            { transform: "translateX(0px)", opacity: "1" },
          ],
          timing
        );

        const wheelFrames: Keyframe[] = [
          { transform: "rotate(0deg)" },
          { transform: "rotate(-720deg)" },
        ];
        frontAnimation = wheelFront?.animate(wheelFrames, timing);
        rearAnimation = wheelRear?.animate(wheelFrames, timing);

        carAnimation.finished.then(settleCar).catch(() => undefined);
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(section);

    return () => {
      disposed = true;
      observer.disconnect();
      carAnimation?.cancel();
      frontAnimation?.cancel();
      rearAnimation?.cancel();
    };
  }, [entryComplete, reducedMotion]);

  // ── Per-model scene config ────────────────────────────────────────────────
  // ── Studio scene config ───────────────────────────────────────────────────
  // Inspired by automotive press-shot lighting: overhead key light, floor
  // bounce, coloured rim light from the car's accent colour, subtle env tint.
  const scenes = [
    // 0 — Sealion 06 DM-i: charcoal studio, BYD-red rim light, asphalt floor
    {
      lightSection: false,
      base: "#0c0d0e",
      groundShadow:
        "radial-gradient(ellipse 85% 40% at 50% 100%, rgba(215,12,25,0.18) 0%, rgba(0,0,0,0.55) 55%, transparent 80%)",
    },
    // 1 — Seal 06 DM-i: pearl white studio, ice-blue overhead key
    {
      lightSection: true,
      base: "#dde4ee",
      groundShadow:
        "radial-gradient(ellipse 85% 35% at 50% 100%, rgba(20,50,110,0.16) 0%, rgba(20,50,110,0.05) 55%, transparent 80%)",
    },
    // 2 — Yuan Up EV: near-black studio, teal-green EV charge rim light
    {
      lightSection: false,
      base: "#050709",
      groundShadow:
        "radial-gradient(ellipse 85% 40% at 50% 100%, rgba(0,200,170,0.16) 0%, rgba(0,0,0,0.60) 55%, transparent 80%)",
    },
    // 3 — Yuan Up DM-i: warm light grey studio, golden sunrise key light
    {
      lightSection: true,
      base: "#ede8e0",
      groundShadow:
        "radial-gradient(ellipse 85% 35% at 50% 100%, rgba(170,95,15,0.20) 0%, rgba(120,70,10,0.07) 55%, transparent 80%)",
    },
  ];
  const scene = scenes[index] ?? scenes[0];
  const { lightSection } = scene;

  return (
    <section
      ref={sectionRef}
      id={model.id}
      data-model-section
      data-model-scene={lightSection ? "light" : "dark"}
      data-header-theme={lightSection ? "light" : undefined}
      className="relative isolate overflow-hidden md:![min-height:88svh]"
      style={{
        minHeight: "clamp(260px, 36svh, 500px)",
        background: scene.base,
        borderBottom: lightSection
          ? "1px solid rgba(0,0,0,0.07)"
          : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Ground shadow */}
      <div
        className="absolute left-1/2 bottom-[6%] h-6 w-[min(70vw,53.75rem)] -translate-x-1/2 rounded-[999px] blur-[14px]"
        style={{ background: scene.groundShadow }}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 section-container flex min-h-[inherit] flex-col px-4 pt-4 pb-0 md:pt-8">
        {/* Counter */}
        <div className="flex justify-end">
          <p
            className="select-none font-mono text-xs tracking-[0.16em] md:text-sm 2xl:text-base"
            style={{
              color: lightSection
                ? "rgba(0,0,0,0.30)"
                : "rgba(255,255,255,0.25)",
            }}
          >
            {String(index + 1).padStart(2, "0")}&thinsp;/&thinsp;
            {String(total).padStart(2, "0")}
          </p>
        </div>

        {/* Title */}
        <h3
          className={[
            "mx-auto mt-2 md:mt-3",
            model.titleWidthClass,
            "bg-transparent text-center text-[clamp(2.1rem,6vw,4.5rem)] font-semibold leading-[0.9] select-none",
            lightSection ? "text-[#0f1214]" : "text-white",
          ].join(" ")}
          style={{ letterSpacing: "-0.045em" }}
        >
          {model.name}
        </h3>

        {/* Car + wheels — scroll-triggered roll-in for mobile Vertical view */}
        <div className="mt-auto">
          <div
            ref={carRef}
            className={[
              "showcase-car-stage relative mx-auto bg-transparent",
              model.stageWidthClass,
            ].join(" ")}
            style={{
              transform: "translateX(110vw)",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
              {/* Transparent stage: aspect ratio = car bbox; overflow only clips wheel halos. */}
              <div
                className="relative overflow-hidden bg-transparent"
                style={{ aspectRatio: `${model.width} / ${model.height}` }}
              >
                {/* Wheel overlays rotate only with the One Line roll-in. */}
                <WheelSprite
                  src={model.frontWheelImage}
                  frame={model.frontWheelFrame}
                  stageWidth={model.width}
                  stageHeight={model.height}
                  imgRef={wheelFrontRef}
                  isDark={!lightSection}
                />
                <WheelSprite
                  src={model.rearWheelImage}
                  frame={model.rearWheelFrame}
                  stageWidth={model.width}
                  stageHeight={model.height}
                  imgRef={wheelRearRef}
                  isDark={!lightSection}
                />

                {/* Car body */}
                <Image
                  src={model.foregroundImage}
                  alt={model.name}
                  width={1254}
                  height={1254}
                  priority={index === 0}
                  quality={92}
                  unoptimized
                  sizes="(max-width: 768px) 96vw, min(96vw, 1200px)"
                  className={`pointer-events-none absolute inset-0 z-[2] h-full w-full select-none object-cover ${
                    lightSection ? "[mix-blend-mode:multiply]" : ""
                  }`}
                  style={{
                    objectPosition: model.objectPosition,
                    ...baseCarWheelCutoutMask(model),
                  }}
                />
              </div>
            {entryComplete ? (
              <Link
                href={model.href}
                aria-label={ka ? `${model.name}-ის ნახვა` : `View ${model.name}`}
                className="absolute inset-0 z-[4] block cursor-pointer bg-transparent transition-[box-shadow,filter] duration-200 hover:shadow-[inset_0_-2px_0_rgba(215,12,25,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-byd-red"
              >
                <span className="sr-only">
                  {ka ? `${model.name}-ის ნახვა` : `View ${model.name}`}
                </span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
function ShowcaseHeader({
  locale,
}: {
  locale: string;
}) {
  const ka = locale === "ka";
  return (
    <div
      className="theme-media-section relative overflow-hidden"
      style={{
        background: "#111314",
        minHeight: "clamp(5rem, 12vh, 8.75rem)",
      }}
    >
      {/* Matching studio rim light — begins the first scene's lighting */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 85% at 100% 65%, rgba(215,12,25,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative section-container flex h-full flex-col justify-center gap-5 py-6 sm:flex-row sm:items-center sm:justify-between md:py-8">
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-[2px] w-5 flex-shrink-0 bg-byd-red" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-byd-red">
              {ka ? "ჩვენი ლაინაპი" : "Our lineup"}
            </p>
          </div>
          <h2
            className="text-[1.75rem] font-semibold leading-tight text-white md:text-[2.6rem] 2xl:text-[3rem]"
            style={{ letterSpacing: "-0.03em" }}
          >
            {ka ? "BYD ინოვაცია." : "BYD innovation."}
            <span className="ml-2 font-light text-white/25 text-[1.15rem] md:text-[1.95rem]">
              {ka ? "აირჩიე." : "Choose."}
            </span>
          </h2>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3 md:gap-5">
          <Link
            href="/catalog"
            className="inline-flex min-h-10 flex-shrink-0 items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55 transition-colors duration-200 hover:text-white md:min-h-11 md:text-sm 2xl:min-h-12 2xl:text-base"
          >
            {ka ? "ყველა" : "All"}
            <svg
              className="h-4 w-4 2xl:h-5 2xl:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ModelShowcase({ locale }: { locale: string }) {
  const [mode, setMode] = useState<ShowcaseMode>("vertical");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const syncMode = () => setMode(media.matches ? "line" : "vertical");
    syncMode();
    media.addEventListener("change", syncMode);
    return () => media.removeEventListener("change", syncMode);
  }, []);

  return (
    <div id="showroom" className="bg-[#0c0d0e]">
      <ShowcaseHeader locale={locale} />
      {mode === "vertical" ? (
        MODELS.map((model, index) => (
          <ModelSection
            key={model.id}
            model={model}
            locale={locale}
            index={index}
            total={MODELS.length}
            reducedMotion={reducedMotion}
          />
        ))
      ) : (
        <OneLineShowcase locale={locale} reducedMotion={reducedMotion} />
      )}
    </div>
  );
}

function OneLineCar({
  model,
  ka,
  index,
  position,
  actionable,
  carRef,
  frontWheelRef,
  rearWheelRef,
}: {
  model: ModelItem;
  ka: boolean;
  index: number;
  position: "settled" | "incoming" | "outgoing";
  actionable: boolean;
  carRef: React.RefObject<HTMLDivElement>;
  frontWheelRef: React.RefObject<HTMLImageElement>;
  rearWheelRef: React.RefObject<HTMLImageElement>;
}) {
  const incoming = position === "incoming";
  const lightScene = index === 1 || index === 3;
  return (
    <div className="absolute inset-x-0 bottom-0 z-10">
    <div
      ref={carRef}
      className={[
        "relative mx-auto bg-transparent",
        model.stageWidthClass,
      ].join(" ")}
      style={{
        transform: incoming ? "translateX(110vw)" : "translateX(0)",
        opacity: incoming ? 0 : 1,
        willChange: "transform, opacity",
      }}
    >
      <div
        className="relative overflow-hidden bg-transparent"
        style={{ aspectRatio: `${model.width} / ${model.height}` }}
      >
        <WheelSprite
          src={model.frontWheelImage}
          frame={model.frontWheelFrame}
          stageWidth={model.width}
          stageHeight={model.height}
          imgRef={frontWheelRef}
          isDark={!lightScene}
        />
        <WheelSprite
          src={model.rearWheelImage}
          frame={model.rearWheelFrame}
          stageWidth={model.width}
          stageHeight={model.height}
          imgRef={rearWheelRef}
          isDark={!lightScene}
        />
        <Image
          src={model.foregroundImage}
          alt={model.name}
          width={1254}
          height={1254}
          priority={index === 0}
          quality={92}
          unoptimized
          sizes="(max-width: 768px) 96vw, min(96vw, 1200px)"
          className={`pointer-events-none absolute inset-0 z-[2] h-full w-full select-none object-cover ${
            lightScene ? "[mix-blend-mode:multiply]" : ""
          }`}
          style={{
            objectPosition: model.objectPosition,
            ...baseCarWheelCutoutMask(model),
          }}
        />
      </div>
      {actionable ? (
        <Link
          href={model.href}
          aria-label={ka ? `${model.name}-ის ნახვა` : `View ${model.name}`}
          className="absolute inset-0 z-[4] block cursor-pointer bg-transparent transition-[box-shadow,filter] duration-200 hover:shadow-[inset_0_-2px_0_rgba(215,12,25,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-byd-red"
        >
          <span className="sr-only">
            {ka ? `${model.name}-ის ნახვა` : `View ${model.name}`}
          </span>
        </Link>
      ) : null}
    </div>
    </div>
  );
}

function OneLineShowcase({
  locale,
  reducedMotion,
}: {
  locale: string;
  reducedMotion: boolean;
}) {
  const ka = locale === "ka";
  const [settledIndex, setSettledIndex] = useState(0);
  const [transition, setTransition] = useState<Handoff | null>(null);
  const [initialEntryComplete, setInitialEntryComplete] = useState(false);
  const [autoRollState, setAutoRollState] =
    useState<AutoRollState>("stopped");
  const [motionOptIn, setMotionOptIn] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const incomingCarRef = useRef<HTMLDivElement>(null);
  const incomingFrontWheelRef = useRef<HTMLImageElement>(null);
  const incomingRearWheelRef = useRef<HTMLImageElement>(null);
  const outgoingCarRef = useRef<HTMLDivElement>(null);
  const outgoingFrontWheelRef = useRef<HTMLImageElement>(null);
  const outgoingRearWheelRef = useRef<HTMLImageElement>(null);
  const nextHandoffIdRef = useRef(0);
  const activeHandoffIdRef = useRef<number | null>(null);
  const autoRollStateRef = useRef<AutoRollState>("stopped");
  const transitionRef = useRef<Handoff | null>(null);

  const updateAutoRollState = (next: AutoRollState) => {
    autoRollStateRef.current = next;
    setAutoRollState(next);
  };

  useEffect(() => {
    transitionRef.current = transition;
  }, [transition]);

  useEffect(() => {
    const section = sectionRef.current;
    const car = incomingCarRef.current;
    const frontWheel = incomingFrontWheelRef.current;
    const rearWheel = incomingRearWheelRef.current;
    if (!section || !car || initialEntryComplete) return;

    let carAnimation: Animation | null = null;
    let frontAnimation: Animation | undefined;
    let rearAnimation: Animation | undefined;
    let disposed = false;

    const settleInitialCar = () => {
      if (disposed) return;

      car.style.transform = "translateX(0px)";
      car.style.opacity = "1";
      setInitialEntryComplete(true);
    };

    if (
      reducedMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      settleInitialCar();
      return;
    }

    const startInitialEntry = () => {
      const timing: KeyframeAnimationOptions = {
        duration: MANUAL_INCOMING_DURATION_MS,
        delay: 0,
        easing: MANUAL_EASING,
        fill: "both",
      };
      carAnimation = car.animate(
        [
          { transform: "translateX(110vw)", opacity: "0" },
          { transform: "translateX(0px)", opacity: "1" },
        ],
        timing
      );
      const wheelFrames: Keyframe[] = [
        { transform: "rotate(0deg)" },
        { transform: "rotate(-720deg)" },
      ];
      frontAnimation = frontWheel?.animate(wheelFrames, timing);
      rearAnimation = rearWheel?.animate(wheelFrames, timing);

      carAnimation.finished
        .then(settleInitialCar)
        .catch(() => undefined);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.14) return;

        observer.disconnect();
        startInitialEntry();
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(section);

    return () => {
      disposed = true;
      observer.disconnect();
      carAnimation?.cancel();
      frontAnimation?.cancel();
      rearAnimation?.cancel();
    };
  }, [initialEntryComplete, reducedMotion]);

  useEffect(() => {
    if (!transition) return;

    const incomingCar = incomingCarRef.current;
    const incomingFrontWheel = incomingFrontWheelRef.current;
    const incomingRearWheel = incomingRearWheelRef.current;
    const outgoingCar = outgoingCarRef.current;
    const outgoingFrontWheel = outgoingFrontWheelRef.current;
    const outgoingRearWheel = outgoingRearWheelRef.current;
    if (!incomingCar || !outgoingCar) {
      setSettledIndex(transition.to);
      setTransition(null);
      return;
    }

    if (
      !motionOptIn &&
      (reducedMotion ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      incomingCar.style.transform = "translateX(0px)";
      incomingCar.style.opacity = "1";
      setSettledIndex(transition.to);
      activeHandoffIdRef.current = null;
      transitionRef.current = null;
      setTransition(null);
      autoRollStateRef.current = "stopped";
      setAutoRollState("stopped");
      return;
    }

    const automatic = transition.kind === "auto";
    const incomingTiming: KeyframeAnimationOptions = {
      duration: automatic
        ? AUTO_ROLL_DURATION_MS
        : MANUAL_INCOMING_DURATION_MS,
      easing: automatic ? "linear" : MANUAL_EASING,
      fill: "both",
    };
    const outgoingTiming: KeyframeAnimationOptions = {
      ...incomingTiming,
      duration: automatic
        ? AUTO_ROLL_DURATION_MS
        : MANUAL_OUTGOING_DURATION_MS,
    };
    let disposed = false;
    const handoffId = transition.id;
    activeHandoffIdRef.current = handoffId;

    const incomingAnimation = incomingCar.animate(
      [
        { transform: "translateX(110vw)", opacity: "0" },
        { transform: "translateX(0px)", opacity: "1" },
      ],
      incomingTiming
    );
    const outgoingAnimation = outgoingCar.animate(
      [
        { transform: "translateX(0px)", opacity: "1" },
        { transform: "translateX(-110vw)", opacity: "0" },
      ],
      outgoingTiming
    );
    const wheelFrames: Keyframe[] = [
      { transform: "rotate(0deg)" },
      { transform: "rotate(-720deg)" },
    ];
    const incomingFrontAnimation = incomingFrontWheel?.animate(
      wheelFrames,
      incomingTiming
    );
    const incomingRearAnimation = incomingRearWheel?.animate(
      wheelFrames,
      incomingTiming
    );

    // Keep the outgoing wheels rolling for the entire left-side exit.
    const outgoingFrontAnimation = outgoingFrontWheel?.animate(
      wheelFrames,
      outgoingTiming
    );
    const outgoingRearAnimation = outgoingRearWheel?.animate(
      wheelFrames,
      outgoingTiming
    );

    // Incoming and outgoing cars complete the same handoff before the scene
    // settles. This keeps the old car visible for its entire roll-out instead of
    // removing it as soon as only the incoming car finishes.
    const animations = [
      incomingAnimation,
      outgoingAnimation,
      incomingFrontAnimation,
      incomingRearAnimation,
      outgoingFrontAnimation,
      outgoingRearAnimation,
    ].filter((animation): animation is Animation => Boolean(animation));

    Promise.all(animations.map((animation) => animation.finished))
      .then(() => {
        if (
          disposed ||
          activeHandoffIdRef.current !== handoffId ||
          transitionRef.current?.id !== handoffId
        ) {
          return;
        }

        const arrivedIndex = transition.to;
        incomingCar.style.transform = "translateX(0px)";
        incomingCar.style.opacity = "1";
        setSettledIndex(arrivedIndex);
        activeHandoffIdRef.current = null;
        setTransition(null);

        if (autoRollStateRef.current === "stopping") {
          autoRollStateRef.current = "stopped";
          setAutoRollState("stopped");
        }
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      if (activeHandoffIdRef.current === handoffId) {
        activeHandoffIdRef.current = null;
      }
      incomingAnimation.cancel();
      outgoingAnimation.cancel();
      incomingFrontAnimation?.cancel();
      incomingRearAnimation?.cancel();
      outgoingFrontAnimation?.cancel();
      outgoingRearAnimation?.cancel();
    };
  }, [motionOptIn, reducedMotion, transition]);

  useEffect(() => {
    const syncVisibility = () => {
      const visible = document.visibilityState === "visible";
      setDocumentVisible(visible);

      if (!visible && autoRollStateRef.current === "running") {
        const nextState: AutoRollState = transitionRef.current
          ? "stopping"
          : "stopped";
        autoRollStateRef.current = nextState;
        setAutoRollState(nextState);
      }
    };

    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    return () =>
      document.removeEventListener("visibilitychange", syncVisibility);
  }, []);

  useEffect(() => {
    if (
      autoRollState !== "running" ||
      !initialEntryComplete ||
      transition ||
      !documentVisible ||
      (!motionOptIn && reducedMotion)
    ) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setTransition((current) => {
        if (current || autoRollStateRef.current !== "running") {
          return current;
        }

        const nextIndex = (settledIndex + 1) % MODELS.length;
        return {
          id: ++nextHandoffIdRef.current,
          from: settledIndex,
          to: nextIndex,
          kind: "auto",
        };
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [
    autoRollState,
    documentVisible,
    initialEntryComplete,
    motionOptIn,
    reducedMotion,
    settledIndex,
    transition,
  ]);

  const displayedIndex = transition?.to ?? settledIndex;
  const displayedModel = MODELS[displayedIndex];
  const lightScene = displayedIndex === 1 || displayedIndex === 3;
  const isAnimating = transition !== null || !initialEntryComplete;
  const nextDisabled = isAnimating || autoRollState !== "stopped";

  const showNext = () => {
    if (nextDisabled) {
      return;
    }
    setMotionOptIn(true);
    setTransition({
      id: ++nextHandoffIdRef.current,
      from: settledIndex,
      to: (settledIndex + 1) % MODELS.length,
      kind: "manual",
    });
  };

  const toggleAutoRoll = () => {
    if (autoRollStateRef.current === "stopping") return;

    if (autoRollStateRef.current === "running") {
      updateAutoRollState(transitionRef.current ? "stopping" : "stopped");
      return;
    }

    setMotionOptIn(true);
    updateAutoRollState("running");
  };

  const autoStatus =
    autoRollState === "stopping"
      ? ka
        ? "მოძრაობა შეწყდება მიმდინარე პროდუქტის შემდეგ."
        : "Stopping after this product."
      : reducedMotion && !motionOptIn
        ? ka
          ? "შემცირებული მოძრაობა ჩართულია. მოძრაობის სანახავად აირჩიეთ დაწყება ან შემდეგი."
          : "Reduced motion is on. Choose Start or Next to enable vehicle motion."
        : "";

  return (
    <section
      ref={sectionRef}
      data-model-section
      data-model-scene={lightScene ? "light" : "dark"}
      data-header-theme={lightScene ? "light" : undefined}
      className="theme-media-section relative isolate min-h-[clamp(32rem,78svh,56rem)] overflow-hidden"
      style={{ background: LINE_BACKGROUNDS[displayedIndex] }}
    >
      <div className="relative z-20 section-container flex min-h-[inherit] flex-col px-4 pb-0 pt-6 md:pt-8">
        <div className="flex items-start justify-end gap-3">
          <div className="flex max-w-[15rem] flex-col items-end gap-1.5">
            <button
              type="button"
              onClick={toggleAutoRoll}
              aria-pressed={autoRollState !== "stopped"}
              aria-describedby={autoStatus ? "auto-roll-status" : undefined}
              disabled={autoRollState === "stopping"}
              className={[
                "inline-flex min-h-11 cursor-pointer items-center gap-2 border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm transition-[border-color,background-color,color,opacity] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-byd-red disabled:cursor-not-allowed disabled:opacity-55",
                autoRollState !== "stopped"
                  ? "border-byd-red bg-byd-red text-white"
                  : lightScene
                    ? "border-black/25 bg-white/70 text-[#202326] hover:border-byd-red"
                    : "border-white/30 bg-black/25 text-white hover:border-byd-red",
              ].join(" ")}
            >
              <span>{ka ? "ავტომატური მოძრაობა" : "Auto roll"}</span>
              <span aria-hidden="true" className="h-3 w-px bg-current opacity-35" />
              <span>
                {autoRollState === "running"
                  ? ka
                    ? "შეჩერება"
                    : "Stop"
                  : autoRollState === "stopping"
                    ? ka
                      ? "ჩერდება…"
                      : "Stopping…"
                  : ka
                    ? "დაწყება"
                    : "Start"}
              </span>
              {autoRollState !== "stopped" ? (
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M4 3h3v10H4zM9 3h3v10H9z" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M4.5 2.5 13 8l-8.5 5.5z" />
                </svg>
              )}
            </button>
            {autoStatus ? (
              <p
                id="auto-roll-status"
                aria-live="polite"
                className={`text-right text-[10px] leading-4 ${
                  lightScene ? "text-black/65" : "text-white/65"
                }`}
              >
                {autoStatus}
              </p>
            ) : null}
          </div>
          <p className={`select-none font-mono text-[10px] tracking-[0.16em] ${
            lightScene ? "text-black/45" : "text-white/35"
          }`}>
            {String(displayedIndex + 1).padStart(2, "0")}&thinsp;/&thinsp;
            {String(MODELS.length).padStart(2, "0")}
          </p>
        </div>
        <h3
          className={`mx-auto mt-3 max-w-[11ch] bg-transparent text-center text-[clamp(2.2rem,6vw,4.75rem)] font-semibold leading-[0.9] select-none ${
            lightScene ? "text-[#111213]" : "text-white"
          }`}
          style={{ letterSpacing: "-0.045em" }}
        >
          {displayedModel.name}
        </h3>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[68%]">
        {transition ? (
          <>
            <OneLineCar
              key={`outgoing-${transition.from}`}
              model={MODELS[transition.from]}
              ka={ka}
              index={transition.from}
              position="outgoing"
              actionable={false}
              carRef={outgoingCarRef}
              frontWheelRef={outgoingFrontWheelRef}
              rearWheelRef={outgoingRearWheelRef}
            />
            <OneLineCar
              key={`incoming-${transition.to}`}
              model={MODELS[transition.to]}
              ka={ka}
              index={transition.to}
              position="incoming"
              actionable={false}
              carRef={incomingCarRef}
              frontWheelRef={incomingFrontWheelRef}
              rearWheelRef={incomingRearWheelRef}
            />
          </>
        ) : (
          <OneLineCar
            key={`settled-${settledIndex}`}
            model={MODELS[settledIndex]}
            ka={ka}
            index={settledIndex}
            position={initialEntryComplete ? "settled" : "incoming"}
            actionable={
              initialEntryComplete &&
              autoRollState === "stopped" &&
              transition === null
            }
            carRef={incomingCarRef}
            frontWheelRef={incomingFrontWheelRef}
            rearWheelRef={incomingRearWheelRef}
          />
        )}
      </div>

      <button
        type="button"
        onClick={showNext}
        aria-label={ka ? "შემდეგი პროდუქტი" : "Next product"}
        aria-describedby={nextDisabled ? "showcase-next-disabled-reason" : undefined}
        disabled={nextDisabled}
        className={`absolute right-4 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-[border-color,background-color,opacity] duration-200 md:right-8 md:h-16 md:w-16 ${
          nextDisabled
            ? "cursor-not-allowed opacity-35"
            : "hover:border-white/65 hover:bg-black/35 active:scale-95"
        }`}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <p id="showcase-next-disabled-reason" className="sr-only">
        {ka
          ? "შემდეგი პროდუქტი ხელმისაწვდომი გახდება მიმდინარე მოძრაობის დასრულების შემდეგ."
          : "The next product becomes available after the current movement finishes."}
      </p>
    </section>
  );
}
