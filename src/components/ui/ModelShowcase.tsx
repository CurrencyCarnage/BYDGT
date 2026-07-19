"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useEffect, useRef, useState } from "react";

type ShowcaseView = "vertical" | "one-line";

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

const ONE_LINE_SCENES = [
  "radial-gradient(ellipse 58% 78% at 94% 58%, rgba(215,12,25,0.34) 0%, rgba(215,12,25,0.08) 48%, transparent 72%), linear-gradient(135deg, #090b0d 0%, #121416 55%, #19090c 100%)",
  "radial-gradient(ellipse 64% 84% at 88% 18%, rgba(86,151,255,0.42) 0%, rgba(40,84,170,0.12) 48%, transparent 72%), linear-gradient(135deg, #080d17 0%, #111a2a 58%, #09101b 100%)",
  "radial-gradient(ellipse 62% 80% at 92% 56%, rgba(0,220,180,0.34) 0%, rgba(0,125,120,0.10) 50%, transparent 74%), linear-gradient(135deg, #05090a 0%, #0a1717 58%, #061110 100%)",
  "radial-gradient(ellipse 68% 86% at 12% 8%, rgba(255,176,58,0.40) 0%, rgba(173,78,20,0.11) 48%, transparent 72%), linear-gradient(135deg, #110b07 0%, #21150c 58%, #130b08 100%)",
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

    return () => {
      observer.disconnect();
    };
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
    },
    // 1 — Seal 06 DM-i: pearl white studio, ice-blue overhead key
    {
      lightSection: true,
      base: "#dde4ee",
      groundShadow: "radial-gradient(ellipse 85% 35% at 50% 100%, rgba(20,50,110,0.16) 0%, rgba(20,50,110,0.05) 55%, transparent 80%)",
    },
    // 2 — Yuan Up EV: near-black studio, teal-green EV charge rim light
    {
      lightSection: false,
      base: "#050709",
      groundShadow: "radial-gradient(ellipse 85% 40% at 50% 100%, rgba(0,200,170,0.16) 0%, rgba(0,0,0,0.60) 55%, transparent 80%)",
    },
    // 3 — Yuan Up DM-i: warm light grey studio, golden sunrise key light
    {
      lightSection: true,
      base: "#ede8e0",
      groundShadow: "radial-gradient(ellipse 85% 35% at 50% 100%, rgba(170,95,15,0.20) 0%, rgba(120,70,10,0.07) 55%, transparent 80%)",
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
          <Link
            href={model.href}
            aria-label={ka ? `${model.name} დეტალები` : `Explore ${model.name}`}
            className="group block bg-transparent"
          >
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
      <div className="relative section-container flex items-center justify-between gap-6 h-full py-6 md:py-8">
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
            <span className="ml-2 font-light text-white/25 text-[1.15rem] md:text-[1.95rem]">
              {ka ? "აირჩიე." : "Choose."}
            </span>
          </h2>
        </div>
        <Link
          href="/catalog"
          className="hidden flex-shrink-0 items-center gap-3 text-[12px] font-medium uppercase text-white/55 transition-colors duration-200 hover:text-white md:flex"
        >
          {ka ? "ყველა" : "All"}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function ModelShowcase({ locale }: { locale: string }) {
  const [view, setView] = useState<ShowcaseView | null>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const syncView = () => {
      setView(desktopQuery.matches ? "one-line" : "vertical");
    };

    syncView();
    desktopQuery.addEventListener("change", syncView);
    return () => desktopQuery.removeEventListener("change", syncView);
  }, []);

  return (
    <div id="showroom" className="bg-[#0c0d0e]">
      <ShowcaseHeader locale={locale} />
      {view === null ? (
        <div
          aria-hidden="true"
          className="min-h-[clamp(260px,36svh,500px)] bg-[#0c0d0e] md:min-h-[clamp(32rem,78svh,56rem)]"
        />
      ) : view === "vertical" ? (
        <>
        {MODELS.map((model, index) => (
          <ModelSection
            key={model.id}
            model={model}
            locale={locale}
            index={index}
            total={MODELS.length}
          />
        ))}
        </>
      ) : (
        <OneLineShowcase locale={locale} />
      )}
    </div>
  );
}

function OneLineCar({
  model,
  index,
  position,
  carRef,
  frontWheelRef,
  rearWheelRef,
}: {
  model: ModelItem;
  index: number;
  position: "settled" | "incoming" | "outgoing";
  carRef: React.RefObject<HTMLDivElement>;
  frontWheelRef: React.RefObject<HTMLImageElement>;
  rearWheelRef: React.RefObject<HTMLImageElement>;
}) {
  const incoming = position === "incoming";

  return (
    <div className="absolute inset-x-0 bottom-0 z-10">
      <div
        ref={carRef}
        className={["relative mx-auto bg-transparent", model.stageWidthClass].join(" ")}
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
            isDark
          />
          <WheelSprite
            src={model.rearWheelImage}
            frame={model.rearWheelFrame}
            stageWidth={model.width}
            stageHeight={model.height}
            imgRef={rearWheelRef}
            isDark
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
            className="pointer-events-none absolute inset-0 z-[2] h-full w-full select-none object-cover"
            style={{ objectPosition: model.objectPosition }}
          />
        </div>
      </div>
    </div>
  );
}

function OneLineShowcase({ locale }: { locale: string }) {
  const ka = locale === "ka";
  const [settledIndex, setSettledIndex] = useState(0);
  const [transition, setTransition] = useState<{
    from: number;
    to: number;
  } | null>(null);
  const [initialEntryComplete, setInitialEntryComplete] = useState(false);

  const incomingCarRef = useRef<HTMLDivElement>(null);
  const incomingFrontWheelRef = useRef<HTMLImageElement>(null);
  const incomingRearWheelRef = useRef<HTMLImageElement>(null);
  const outgoingCarRef = useRef<HTMLDivElement>(null);
  const outgoingFrontWheelRef = useRef<HTMLImageElement>(null);
  const outgoingRearWheelRef = useRef<HTMLImageElement>(null);
  const queuedAdvancesRef = useRef(0);

  useEffect(() => {
    const car = incomingCarRef.current;
    const frontWheel = incomingFrontWheelRef.current;
    const rearWheel = incomingRearWheelRef.current;
    if (!car) return;

    const timing: KeyframeAnimationOptions = {
      duration: 2600,
      delay: 120,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "both",
    };
    const carAnimation = car.animate(
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
    const frontAnimation = frontWheel?.animate(wheelFrames, timing);
    const rearAnimation = rearWheel?.animate(wheelFrames, timing);

    carAnimation.finished
      .then(() => {
        setInitialEntryComplete(true);
        if (queuedAdvancesRef.current > 0) {
          queuedAdvancesRef.current -= 1;
          setTransition({ from: 0, to: 1 % MODELS.length });
        }
      })
      .catch(() => undefined);

    return () => {
      carAnimation.cancel();
      frontAnimation?.cancel();
      rearAnimation?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!transition) return;

    const incomingCar = incomingCarRef.current;
    const incomingFrontWheel = incomingFrontWheelRef.current;
    const incomingRearWheel = incomingRearWheelRef.current;
    const outgoingCar = outgoingCarRef.current;
    const outgoingFrontWheel = outgoingFrontWheelRef.current;
    const outgoingRearWheel = outgoingRearWheelRef.current;
    if (!incomingCar || !outgoingCar) return;

    const timing: KeyframeAnimationOptions = {
      duration: 2600,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "both",
    };
    const outgoingTiming: KeyframeAnimationOptions = {
      ...timing,
      duration: 2200,
    };
    const incomingAnimation = incomingCar.animate(
      [
        { transform: "translateX(110vw)", opacity: "0" },
        { transform: "translateX(0px)", opacity: "1" },
      ],
      timing
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
    const incomingFrontAnimation = incomingFrontWheel?.animate(wheelFrames, timing);
    const incomingRearAnimation = incomingRearWheel?.animate(wheelFrames, timing);

    // Keep the outgoing wheels rolling for the entire left-side exit.
    const outgoingFrontAnimation = outgoingFrontWheel?.animate(
      wheelFrames,
      outgoingTiming
    );
    const outgoingRearAnimation = outgoingRearWheel?.animate(
      wheelFrames,
      outgoingTiming
    );

    Promise.all([incomingAnimation.finished, outgoingAnimation.finished])
      .then(() => {
        const arrivedIndex = transition.to;
        setSettledIndex(arrivedIndex);

        if (queuedAdvancesRef.current > 0) {
          queuedAdvancesRef.current -= 1;
          setTransition({
            from: arrivedIndex,
            to: (arrivedIndex + 1) % MODELS.length,
          });
        } else {
          setTransition(null);
        }
      })
      .catch(() => undefined);

    return () => {
      incomingAnimation.cancel();
      outgoingAnimation.cancel();
      incomingFrontAnimation?.cancel();
      incomingRearAnimation?.cancel();
      outgoingFrontAnimation?.cancel();
      outgoingRearAnimation?.cancel();
    };
  }, [transition]);

  const displayedIndex = transition?.to ?? settledIndex;
  const displayedModel = MODELS[displayedIndex];

  const showNext = () => {
    if (transition || !initialEntryComplete) {
      queuedAdvancesRef.current = Math.min(
        queuedAdvancesRef.current + 1,
        MODELS.length
      );
      return;
    }
    setTransition({
      from: settledIndex,
      to: (settledIndex + 1) % MODELS.length,
    });
  };

  return (
    <section
      data-model-section
      data-model-scene="dark"
      className="theme-media-section relative isolate min-h-[clamp(32rem,78svh,56rem)] overflow-hidden"
      style={{ background: ONE_LINE_SCENES[displayedIndex] }}
    >
      <div className="relative z-20 section-container flex min-h-[inherit] flex-col px-4 pb-0 pt-6 md:pt-8">
        <div className="flex justify-end">
          <p className="select-none font-mono text-[10px] tracking-[0.16em] text-white/35">
            {String(displayedIndex + 1).padStart(2, "0")}&thinsp;/&thinsp;
            {String(MODELS.length).padStart(2, "0")}
          </p>
        </div>
        <h3
          className="mx-auto mt-3 max-w-[11ch] bg-transparent text-center text-[clamp(2.2rem,6vw,4.75rem)] font-semibold leading-[0.9] text-white select-none"
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
              index={transition.from}
              position="outgoing"
              carRef={outgoingCarRef}
              frontWheelRef={outgoingFrontWheelRef}
              rearWheelRef={outgoingRearWheelRef}
            />
            <OneLineCar
              key={`incoming-${transition.to}`}
              model={MODELS[transition.to]}
              index={transition.to}
              position="incoming"
              carRef={incomingCarRef}
              frontWheelRef={incomingFrontWheelRef}
              rearWheelRef={incomingRearWheelRef}
            />
          </>
        ) : (
          <OneLineCar
            key={`settled-${settledIndex}`}
            model={MODELS[settledIndex]}
            index={settledIndex}
            position={initialEntryComplete ? "settled" : "incoming"}
            carRef={incomingCarRef}
            frontWheelRef={incomingFrontWheelRef}
            rearWheelRef={incomingRearWheelRef}
          />
        )}
      </div>

      <button
        type="button"
        onClick={showNext}
        aria-label={ka ? "შემდეგი მოდელი" : "Next model"}
        className="absolute right-4 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/20 text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/65 hover:bg-black/35 active:scale-95 md:right-8 md:h-16 md:w-16"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
}
