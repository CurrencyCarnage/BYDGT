"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useEffect, useRef, useState } from "react";

type WheelFrame = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type ModelItem = {
  id: string;
  name: string;
  nameKa: string;
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
    nameKa: "\u10e1\u10d8\u10da\u10d0\u10d8\u10dd\u10dc 06 DM-i",
    href: "/catalog/sealion-06-dmi",
    foregroundImage: `/images/homepage/cropped/sealion-sidecropped.png?v=${ASSET_VERSION}`,
    // Car bbox in 1254px image: x=82-1192 (w=1110), y=446-856 (h=410)
    width: 1110,
    height: 410,
    objectPosition: "50% 53%",
    stageWidthClass: "w-[min(96vw,1120px)]",
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
    nameKa: "\u10e1\u10d8\u10da 06 DM-i",
    href: "/catalog/seal-06-dmi",
    foregroundImage: `/images/homepage/cropped/seal-sidecropped.png?v=${ASSET_VERSION}`,
    // Car bbox: x=56-1228 (w=1172), y=470-832 (h=362)
    width: 1172,
    height: 362,
    objectPosition: "50% 53%",
    stageWidthClass: "w-[min(96vw,1180px)]",
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
    nameKa: "\u10d8\u10e3\u10d0\u10dc \u10d0\u10de EV",
    href: "/catalog/yuan-up-ev",
    foregroundImage: `/images/homepage/cropped/yuanup1-sidecropped.png?v=${ASSET_VERSION}`,
    // Car bbox: x=108-1136 (w=1028), y=446-854 (h=408)
    width: 1028,
    height: 408,
    objectPosition: "50% 53%",
    stageWidthClass: "w-[min(96vw,1040px)]",
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
    nameKa: "\u10d8\u10e3\u10d0\u10dc \u10d0\u10de DM-i",
    href: "/catalog/yuan-up-dmi",
    foregroundImage: `/images/homepage/cropped/yuanup2-sidecropped.png?v=${ASSET_VERSION}`,
    // Car bbox: x=70-1182 (w=1112), y=454-886 (h=432); height extended to 452 to prevent wheel clip
    width: 1112,
    height: 452,
    objectPosition: "50% 57%",
    stageWidthClass: "w-[min(96vw,1120px)]",
    tint: "rgba(195,200,215,0.18)",
    titleWidthClass: "max-w-[7.1ch]",
    frontWheelImage: `/images/homepage/mapped-wheels/yuan-up-dmi-front.png?v=${ASSET_VERSION}`,
    rearWheelImage: `/images/homepage/mapped-wheels/yuan-up-dmi-rear.png?v=${ASSET_VERSION}`,
    // scale=0.887  y_shift=−378  r_display≈78
    frontWheelFrame: { left: 126, top: 208, width: 240, height: 240 }, // LINE 111
    rearWheelFrame: { left: 748, top: 208, width: 240, height: 240 }, // LINE 112
  },
];

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
      <img
        ref={imgRef}
        src={src}
        alt=""
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
  const [entered, setEntered] = useState(false);

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

        setEntered(true);

        const timing: KeyframeAnimationOptions = {
          duration: 5000,
          delay: 300,
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
      { threshold: 0.2 }
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
      className="relative isolate overflow-hidden"
      style={{
        minHeight: "clamp(440px, 58svh, 600px)",
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
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "linear-gradient(rgba(60,100,170,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(60,100,170,0.08) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
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
        className="absolute left-1/2 bottom-[6%] h-6 w-[min(70vw,860px)] -translate-x-1/2 rounded-[999px] blur-[14px]"
        style={{ background: scene.groundShadow }}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 section-container flex min-h-[inherit] flex-col px-4 pt-8 pb-5 md:pt-10">
        {/* Counter */}
        <div className="flex justify-end">
          <p
            className="select-none font-mono text-[10px] tracking-[0.16em]"
            style={{ color: lightSection ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.25)" }}
          >
            {String(index + 1).padStart(2, "0")}&thinsp;/&thinsp;
            {String(total).padStart(2, "0")}
          </p>
        </div>

        {/* Title */}
        <h3
          className={[
            "mx-auto mt-4 md:mt-5",
            model.titleWidthClass,
            "text-center text-[clamp(2.1rem,6vw,4.5rem)] font-semibold leading-[0.9] select-none",
            lightSection ? "text-[#0f1214]" : "text-white",
            entered ? "sc-title-enter" : "sc-title-hidden",
          ].join(" ")}
          style={{ letterSpacing: "-0.045em" }}
        >
          {ka ? model.nameKa : model.name}
        </h3>

        {/* Car + wheels — rolls in from the right */}
        <div className="mt-auto pt-3 md:pt-4">
          <Link
            href={model.href}
            aria-label={ka ? `${model.nameKa} დეტალები` : `Explore ${model.name}`}
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

                {/* Car body */}
                <Image
                  src={model.foregroundImage}
                  alt={ka ? model.nameKa : model.name}
                  width={1254}
                  height={1254}
                  priority={index === 0}
                  quality={92}
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

function ShowcaseHeader({ locale }: { locale: string }) {
  const ka = locale === "ka";
  return (
    // Seamless transition: sits between ticker and first model.
    // Gradient pulls from dark ticker above, softly fades to match first model's studio lighting.
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #1a1c1d 0%, #0c0d0e 100%)",
        minHeight: "clamp(80px, 12vh, 140px)",
      }}
    >
      {/* Matching studio rim light — begins the first scene's lighting */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 85% at 100% 65%, rgba(215,12,25,0.04) 0%, transparent 60%)" }} />

      <div className="relative section-container flex items-center justify-between gap-6 h-full">
        <div>
          <div className="mb-2 flex items-center gap-2.5">
            <span className="h-[2px] w-5 flex-shrink-0 bg-byd-red" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-byd-red">
              {ka ? "ჩვენი ლაინაპი" : "Our lineup"}
            </p>
          </div>
          <h2
            className="text-[1.75rem] font-semibold leading-tight text-white md:text-[2.4rem]"
            style={{ letterSpacing: "-0.03em" }}
          >
            {ka ? "BYD ინოვაცია." : "BYD innovation."}
            <span className="ml-2.5 font-light text-white/25 text-[1.4rem] md:text-[1.95rem]">
              {ka ? "აირჩიე." : "Choose."}
            </span>
          </h2>
        </div>
        <Link
          href="/catalog"
          className="hidden flex-shrink-0 items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-white/25 transition-colors duration-200 hover:text-white/50 md:flex"
        >
          {ka ? "ყველა" : "All"}
          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function ModelShowcase({ locale }: { locale: string }) {
  return (
    <div className="bg-[#0c0d0e]">
      <ShowcaseHeader locale={locale} />
      {MODELS.map((model, index) => (
        <ModelSection
          key={model.id}
          model={model}
          locale={locale}
          index={index}
          total={MODELS.length}
        />
      ))}
    </div>
  );
}
