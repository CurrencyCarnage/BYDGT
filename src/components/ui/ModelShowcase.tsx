"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useCallback, useEffect, useRef, useState } from "react";

type ShowcaseMode = "vertical" | "line";

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

const SCENES = [
  {
    lightSection: false,
    base: "#0c0d0e",
    groundShadow: "radial-gradient(ellipse 85% 40% at 50% 100%, rgba(215,12,25,0.18) 0%, rgba(0,0,0,0.55) 55%, transparent 80%)",
    carGlow: "radial-gradient(ellipse 70% 90% at 50% 42%, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 48%, transparent 72%)",
  },
  {
    lightSection: true,
    base: "#dde4ee",
    groundShadow: "radial-gradient(ellipse 85% 35% at 50% 100%, rgba(20,50,110,0.16) 0%, rgba(20,50,110,0.05) 55%, transparent 80%)",
    carGlow: "radial-gradient(ellipse 68% 88% at 50% 40%, rgba(255,255,255,1) 0%, rgba(230,240,255,0.82) 38%, rgba(190,215,255,0.22) 68%, transparent 84%)",
  },
  {
    lightSection: false,
    base: "#050709",
    groundShadow: "radial-gradient(ellipse 85% 40% at 50% 100%, rgba(0,200,170,0.16) 0%, rgba(0,0,0,0.60) 55%, transparent 80%)",
    carGlow: "radial-gradient(ellipse 70% 90% at 50% 42%, rgba(0,230,195,0.11) 0%, rgba(80,200,255,0.05) 46%, transparent 72%)",
  },
  {
    lightSection: true,
    base: "#ede8e0",
    groundShadow: "radial-gradient(ellipse 85% 35% at 50% 100%, rgba(170,95,15,0.20) 0%, rgba(120,70,10,0.07) 55%, transparent 80%)",
    carGlow: "radial-gradient(ellipse 68% 88% at 50% 40%, rgba(255,248,228,0.98) 0%, rgba(255,225,155,0.72) 36%, rgba(245,190,85,0.20) 68%, transparent 84%)",
  },
] as const;

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
      {/* eslint-disable-next-line @next/next/no-img-element -- wheel sprites need native <img> for WAAPI ref */}
      <img
        ref={imgRef}
        src={src}
        alt=""
        loading="eager"
        decoding="async"
        draggable={false}
        className={`block h-full w-full ${
          isDark ? "" : "[mix-blend-mode:multiply]"
        }`}
      />
    </div>
  );
}

function ModelSection({
  model,
  locale,
  index,
  total,
}: {
  model: ModelItem;
  locale: string;
  index: number;
  total: number;
}) {
  const ka = locale === "ka";
  const sectionRef = useRef<HTMLElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const wheelFrontRef = useRef<HTMLImageElement>(null);
  const wheelRearRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    const car = carRef.current;
    const wheelFront = wheelFrontRef.current;
    const wheelRear = wheelRearRef.current;
    if (!section || !car) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const timing: KeyframeAnimationOptions = {
          duration: 2600,
          delay: 120,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "both",
        };

        car.animate(
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
        wheelFront?.animate(wheelFrames, timing);
        wheelRear?.animate(wheelFrames, timing);
      },
      { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // ── Per-model scene config ────────────────────────────────────────────────
  // ── Studio scene config ───────────────────────────────────────────────────
  // Inspired by automotive press-shot lighting: overhead key light, floor
  // bounce, coloured rim light from the car's accent colour, subtle env tint.
  const scenes = [
    // 0 — Sealion 06 DM-i: charcoal studio, BYD-red rim light, asphalt floor
    {
      lightSection: false,
      base: "#0c0d0e",
      groundShadow: "radial-gradient(ellipse 85% 40% at 50% 100%, rgba(215,12,25,0.18) 0%, rgba(0,0,0,0.55) 55%, transparent 80%)",
      carGlow: "radial-gradient(ellipse 70% 90% at 50% 42%, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 48%, transparent 72%)",
    },
    // 1 — Seal 06 DM-i: pearl white studio, ice-blue overhead key
    {
      lightSection: true,
      base: "#dde4ee",
      groundShadow: "radial-gradient(ellipse 85% 35% at 50% 100%, rgba(20,50,110,0.16) 0%, rgba(20,50,110,0.05) 55%, transparent 80%)",
      carGlow: "radial-gradient(ellipse 68% 88% at 50% 40%, rgba(255,255,255,1) 0%, rgba(230,240,255,0.82) 38%, rgba(190,215,255,0.22) 68%, transparent 84%)",
    },
    // 2 — Yuan Up EV: near-black studio, teal-green EV charge rim light
    {
      lightSection: false,
      base: "#050709",
      groundShadow: "radial-gradient(ellipse 85% 40% at 50% 100%, rgba(0,200,170,0.16) 0%, rgba(0,0,0,0.60) 55%, transparent 80%)",
      carGlow: "radial-gradient(ellipse 70% 90% at 50% 42%, rgba(0,230,195,0.11) 0%, rgba(80,200,255,0.05) 46%, transparent 72%)",
    },
    // 3 — Yuan Up DM-i: warm light grey studio, golden sunrise key light
    {
      lightSection: true,
      base: "#ede8e0",
      groundShadow: "radial-gradient(ellipse 85% 35% at 50% 100%, rgba(170,95,15,0.20) 0%, rgba(120,70,10,0.07) 55%, transparent 80%)",
      carGlow: "radial-gradient(ellipse 68% 88% at 50% 40%, rgba(255,248,228,0.98) 0%, rgba(255,225,155,0.72) 36%, rgba(245,190,85,0.20) 68%, transparent 84%)",
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
        borderBottom: lightSection
          ? "1px solid rgba(0,0,0,0.07)"
          : "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* ── Studio base coat ─────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: scene.base }} />

      {/* Top fade from header — seamless blend on first section */}
      {index === 0 && (
        <div className="absolute inset-x-0 top-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(26,28,29,0.35) 0%, transparent 100%)" }} />
      )}

      {/* ── Shared studio layers ─────────────────────────────────── */}
      {/* Overhead key light — wide ellipse from top-centre */}
      <div
        className="absolute inset-x-0 top-0 h-[55%]"
        style={{
          background: lightSection
            ? "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 48%, transparent 80%)"
            : "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 48%, transparent 80%)",
        }}
      />
      {/* Floor gradient — bottom half fades to slightly lighter to sell floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background: lightSection
            ? "linear-gradient(to top, rgba(255,255,255,0.30) 0%, transparent 100%)"
            : "linear-gradient(to top, rgba(255,255,255,0.04) 0%, transparent 100%)",
        }}
      />
      {/* Per-scene accent layers */}
      {index === 0 && (
        <>
          {/* Dark: faint red rim light from car's right (enters from right) */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 70% at 96% 62%, rgba(215,12,25,0.14) 0%, transparent 55%)" }} />
          {/* Subtle cool reflection on left side */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 40% 60% at 0% 55%, rgba(100,130,180,0.06) 0%, transparent 60%)" }} />
        </>
      )}
      {index === 1 && (
        <>
          {/* Light ice-blue tint from upper right — studio softbox */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 80% at 92% 10%, rgba(140,185,245,0.22) 0%, transparent 55%)" }} />
          {/* Subtle grid for precision feel */}
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(60,100,170,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(60,100,170,0.08) 1px, transparent 1px)", backgroundSize: "3.75rem 3.75rem" }} />
        </>
      )}
      {index === 2 && (
        <>
          {/* Teal-green rim from right — EV charge colour */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 65% at 95% 58%, rgba(0,210,175,0.13) 0%, transparent 55%)" }} />
          {/* Deep blue ceiling */}
          <div className="absolute inset-x-0 top-0 h-[30%]" style={{ background: "linear-gradient(to bottom, rgba(0,80,160,0.14) 0%, transparent 100%)" }} />
        </>
      )}
      {index === 3 && (
        <>
          {/* Warm amber key from upper-left — golden hour */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 75% at 8% 0%, rgba(240,175,55,0.28) 0%, rgba(235,140,38,0.08) 48%, transparent 70%)" }} />
          {/* Peach accent right */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 60% at 95% 20%, rgba(240,120,70,0.10) 0%, transparent 55%)" }} />
        </>
      )}

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
            style={{ color: lightSection ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.25)" }}
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
            "text-center text-[clamp(2.1rem,6vw,4.5rem)] font-semibold leading-[0.9] select-none",
            lightSection ? "text-[#0f1214]" : "text-white",
          ].join(" ")}
          style={{ letterSpacing: "-0.045em" }}
        >
          {model.name}
        </h3>

        {/* Car + wheels — rolls in from the right */}
        <div className="mt-auto">
          <Link
            href={model.href}
            aria-label={ka ? `${model.name} დეტალები` : `Explore ${model.name}`}
            className="group block"
          >
            <div
              ref={carRef}
              className={["relative mx-auto", model.stageWidthClass].join(" ")}
              style={{
                transform: "translateX(110vw)",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            >
              {/* Stage: aspect ratio = car bbox, overflow clips wheel halos */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: `${model.width} / ${model.height}` }}
              >
                {/* Ambient car glow — per-theme color */}
                <div
                  className="absolute inset-x-[3%] top-[5%] bottom-[4%] blur-3xl"
                  style={{ background: scene.carGlow }}
                />

                {/* Animated wheel overlays */}
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

                {/* Bottom-edge blend — dissolves the hard overflow-hidden clip into the section bg */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[8%]"
                  style={{ background: `linear-gradient(to top, ${scene.base} 0%, transparent 100%)` }}
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
                  style={{ objectPosition: model.objectPosition }}
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function LineModelSlide({
  model,
  locale,
  index,
  active,
}: {
  model: ModelItem;
  locale: string;
  index: number;
  active: boolean;
}) {
  const ka = locale === "ka";
  const scene = SCENES[index] ?? SCENES[0];
  const carRef = useRef<HTMLDivElement>(null);
  const wheelFrontRef = useRef<HTMLImageElement>(null);
  const wheelRearRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!active || !carRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timing: KeyframeAnimationOptions = {
      duration: 2000,
      easing: "cubic-bezier(0.45, 0, 0.2, 1)",
      fill: "both",
    };
    const animations = [
      carRef.current.animate(
        [
          { transform: "translateX(38vw)", opacity: "0.18" },
          { transform: "translateX(0)", opacity: "1" },
        ],
        timing
      ),
      wheelFrontRef.current?.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(-720deg)" }],
        timing
      ),
      wheelRearRef.current?.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(-720deg)" }],
        timing
      ),
    ].filter(Boolean) as Animation[];

    return () => animations.forEach((animation) => animation.cancel());
  }, [active]);

  return (
    <article
      className="relative h-full w-full flex-none overflow-visible"
      data-header-theme={scene.lightSection ? "light" : undefined}
    >
      <div
        className="absolute bottom-[16%] left-1/2 h-7 w-[min(72vw,58rem)] -translate-x-1/2 rounded-full blur-[18px] md:bottom-[14%]"
        style={{ background: scene.groundShadow }}
      />

      <div className="section-container relative z-10 flex h-full flex-col px-4 py-6 md:py-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p
              className={`mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] md:text-xs 2xl:text-sm ${
                scene.lightSection ? "text-[#4e5356]" : "text-white/45"
              }`}
            >
              {ka ? "მოდელი" : "Model"} {String(index + 1).padStart(2, "0")}
            </p>
            <h3
              className={`text-[clamp(2rem,5vw,4.75rem)] font-semibold leading-[0.94] ${
                scene.lightSection ? "text-[#0f1214]" : "text-white"
              }`}
              style={{ letterSpacing: "-0.045em" }}
            >
              {model.name}
            </h3>
          </div>
          <p
            aria-live="polite"
            className="select-none font-mono text-xs tracking-[0.16em] md:text-sm 2xl:text-base"
            style={{ color: scene.lightSection ? "rgba(0,0,0,0.46)" : "rgba(255,255,255,0.48)" }}
          >
            {String(index + 1).padStart(2, "0")}&thinsp;/&thinsp;
            {String(MODELS.length).padStart(2, "0")}
          </p>
        </div>

        <div className="mt-auto">
          <Link
            href={model.href}
            aria-label={ka ? `${model.name} დეტალები` : `Explore ${model.name}`}
            className="group block"
          >
            <div ref={carRef} className={`relative mx-auto ${model.stageWidthClass}`}>
              <div className="relative -translate-y-10 md:-translate-y-14">
              <div className="relative overflow-visible" style={{ aspectRatio: `${model.width} / ${model.height}` }}>
                <div className="absolute inset-x-[3%] bottom-[4%] top-[5%] blur-3xl" style={{ background: scene.carGlow }} />
                <WheelSprite
                  src={model.frontWheelImage}
                  frame={model.frontWheelFrame}
                  stageWidth={model.width}
                  stageHeight={model.height}
                  imgRef={wheelFrontRef}
                  isDark={!scene.lightSection}
                />
                <WheelSprite
                  src={model.rearWheelImage}
                  frame={model.rearWheelFrame}
                  stageWidth={model.width}
                  stageHeight={model.height}
                  imgRef={wheelRearRef}
                  isDark={!scene.lightSection}
                />
                <Image
                  src={model.foregroundImage}
                  alt={model.name}
                  width={1254}
                  height={1254}
                  priority={active}
                  quality={92}
                  unoptimized
                  sizes="(max-width: 768px) 96vw, min(96vw, 1200px)"
                  className={`pointer-events-none absolute inset-0 z-[2] h-full w-full select-none object-cover ${
                    scene.lightSection ? "[mix-blend-mode:multiply]" : ""
                  }`}
                  style={{ objectPosition: model.objectPosition }}
                />
              </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}

function LineShowcase({ locale }: { locale: string }) {
  const ka = locale === "ka";
  const [current, setCurrent] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const lightScene = SCENES[current]?.lightSection ?? false;
  const slides = [...MODELS, MODELS[0]];

  const advance = useCallback(() => {
    if (isMoving) return;
    setTransitionEnabled(true);
    setIsMoving(true);
    setCurrent((index) => (index + 1) % MODELS.length);
    setTrackIndex((index) => index + 1);
  }, [isMoving]);

  const handleTrackTransitionEnd = () => {
    if (trackIndex === MODELS.length) {
      setTransitionEnabled(false);
      setTrackIndex(0);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setTransitionEnabled(true));
      });
    }
    setIsMoving(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") advance();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance]);

  return (
    <section
      aria-label={ka ? "მოდელების ერთხაზიანი სლაიდერი" : "One-line model slider"}
      className="relative h-[clamp(31rem,66svh,46rem)] overflow-hidden bg-[#0c0d0e]"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        if (touchStartX.current - endX > 48) advance();
        touchStartX.current = null;
      }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {LINE_BACKGROUNDS.map((background, index) => (
          <div
            key={background}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-out motion-reduce:transition-none"
            style={{ background, opacity: index === current ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_32%,rgba(0,0,0,0.12))]" />
      </div>

      <div
        className="relative z-10 flex h-full ease-[cubic-bezier(0.45,0,0.2,1)] motion-reduce:transition-none"
        style={{
          transform: `translate3d(-${trackIndex * 100}%, 0, 0)`,
          transitionProperty: transitionEnabled ? "transform" : "none",
          transitionDuration: transitionEnabled ? "2000ms" : "0ms",
        }}
        onTransitionEnd={handleTrackTransitionEnd}
      >
        {slides.map((model, slideIndex) => {
          const modelIndex = slideIndex === MODELS.length ? 0 : slideIndex;
          return (
          <LineModelSlide
            key={`${model.id}-${slideIndex}`}
            model={model}
            locale={locale}
            index={modelIndex}
            active={modelIndex === current}
          />
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 md:bottom-6">
        <div className="section-container flex items-center justify-between gap-4">
          <div
            className="pointer-events-auto flex cursor-default items-center gap-2"
            aria-hidden="true"
            onClick={(event) => event.stopPropagation()}
          >
            {MODELS.map((model, index) => (
              <span
                key={model.id}
                className={`h-[3px] transition-all duration-500 ${
                  index === current
                    ? "w-9 bg-byd-red"
                    : lightScene
                      ? index < current ? "w-3 bg-black/20" : "w-3 bg-black/45"
                      : index < current ? "w-3 bg-white/18" : "w-3 bg-white/35"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={advance}
            disabled={isMoving}
            className={`pointer-events-auto mr-16 inline-flex min-h-12 items-center gap-3 px-5 text-sm font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-byd-red disabled:cursor-wait disabled:opacity-70 sm:mr-0 2xl:min-h-14 2xl:px-7 2xl:text-base ${
              lightScene
                ? "border border-black/25 bg-black/75 hover:bg-black"
                : "border border-white/25 bg-black/30 hover:border-white/55 hover:bg-black/50"
            }`}
          >
            {ka ? "შემდეგი მოდელი" : "Next model"}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function ShowcaseHeader({
  locale,
  mode,
  onModeChange,
}: {
  locale: string;
  mode: ShowcaseMode;
  onModeChange: (mode: ShowcaseMode) => void;
}) {
  const ka = locale === "ka";
  return (
    // Seamless transition: sits between ticker and first model.
    // Gradient pulls from dark ticker above, softly fades to match first model's studio lighting.
    <div
      className="theme-media-section relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #1a1c1d 0%, #0c0d0e 100%)",
        minHeight: "clamp(5rem, 12vh, 8.75rem)",
      }}
    >
      {/* Matching studio rim light — begins the first scene's lighting */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 85% at 100% 65%, rgba(215,12,25,0.04) 0%, transparent 60%)" }} />

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
          <div
            role="group"
            aria-label={ka ? "ანიმაციის ტიპი" : "Showcase layout"}
            className="inline-grid grid-cols-2 border border-white/15 bg-black/20 p-1"
          >
            {(["vertical", "line"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={mode === item}
                onClick={() => onModeChange(item)}
                className={`min-h-10 px-3 text-xs font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-byd-red md:min-h-11 md:px-4 md:text-sm 2xl:min-h-12 2xl:px-5 2xl:text-base ${
                  mode === item
                    ? "bg-white text-[#111213]"
                    : "text-white/52 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item === "vertical"
                  ? ka ? "ვერტიკალური" : "Vertical"
                  : ka ? "ერთ ხაზად" : "One line"}
              </button>
            ))}
          </div>

        <Link
          href="/catalog"
          className="inline-flex min-h-10 flex-shrink-0 items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55 transition-colors duration-200 hover:text-white md:min-h-11 md:text-sm 2xl:min-h-12 2xl:text-base"
        >
          {ka ? "ყველა" : "All"}
          <svg className="h-4 w-4 2xl:h-5 2xl:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        </div>
      </div>
    </div>
  );
}

export default function ModelShowcase({ locale }: { locale: string }) {
  const [mode, setMode] = useState<ShowcaseMode>("vertical");

  return (
    <div id="showroom" className="bg-[#0c0d0e]">
      <ShowcaseHeader locale={locale} mode={mode} onModeChange={setMode} />
      {mode === "vertical" ? (
        MODELS.map((model, index) => (
          <ModelSection
            key={model.id}
            model={model}
            locale={locale}
            index={index}
            total={MODELS.length}
          />
        ))
      ) : (
        <LineShowcase locale={locale} />
      )}
    </div>
  );
}
