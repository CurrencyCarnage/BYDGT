"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CarModel, getLocalizedValue } from "@/lib/types";

type PreviewMode = "exterior" | "interior";

interface PreviewAsset {
  id: string;
  label: string;
  src: string;
}

interface ModelVisualPreviewProps {
  model: CarModel;
  locale: string;
}

const EXTERIOR_ANGLES_EN = [
  { id: "front-three-quarter", label: "Front 3/4" },
  { id: "side-profile", label: "Side" },
  { id: "rear-three-quarter", label: "Rear 3/4" },
] as const;

const EXTERIOR_ANGLES_KA = [
  { id: "front-three-quarter", label: "წინა 3/4" },
  { id: "side-profile", label: "გვერდი" },
  { id: "rear-three-quarter", label: "უკანა 3/4" },
] as const;

export default function ModelVisualPreview({
  model,
  locale,
}: ModelVisualPreviewProps) {
  const [mode, setMode] = useState<PreviewMode>("exterior");
  const [exteriorIndex, setExteriorIndex] = useState(0);
  const [failedSrcs, setFailedSrcs] = useState<Record<string, true>>({});

  const modelName = getLocalizedValue(model.name, locale);

  const angles = locale === "ka" ? EXTERIOR_ANGLES_KA : EXTERIOR_ANGLES_EN;
  const exteriorAssets = useMemo<PreviewAsset[]>(
    () =>
      angles.map((angle) => ({
        id: angle.id,
        label: angle.label,
        src: `/images/models/${model.id}/exterior-${angle.id}.png`,
      })),
    [model.id, angles]
  );

  const interiorAsset = useMemo<PreviewAsset>(
    () => ({
      id: "cockpit",
      label: "Interior",
      src: `/images/models/${model.id}/interior-cockpit.png`,
    }),
    [model.id]
  );

  const activeAsset =
    mode === "exterior" ? exteriorAssets[exteriorIndex] : interiorAsset;
  const previewSrc = failedSrcs[activeAsset.src] ? model.images.hero : activeAsset.src;

  const goToPreviousAngle = () => {
    setExteriorIndex((current) =>
      current === 0 ? exteriorAssets.length - 1 : current - 1
    );
  };

  const goToNextAngle = () => {
    setExteriorIndex((current) =>
      current === exteriorAssets.length - 1 ? 0 : current + 1
    );
  };

  return (
    <section>
      <div className="relative overflow-hidden bg-[#1C1E1F]">

        <div className="absolute inset-x-0 top-2.5 sm:top-4 z-20 flex justify-center px-4">
          <div className="inline-flex rounded-full border border-white/[0.14] bg-black/28 p-[3px] sm:p-1 shadow-[0_0.75rem_2rem_rgba(0,0,0,0.25)] backdrop-blur-md">
          {(["exterior", "interior"] as const).map((item) => {
            const isActive = mode === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                aria-pressed={isActive}
                  className={`min-h-[1.625rem] sm:min-h-[2.75rem] min-w-[4rem] sm:min-w-[7rem] rounded-full px-2 sm:px-5 text-[10px] sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/70 ${
                  isActive
                      ? "bg-white text-[#17191a] shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.22)]"
                      : "text-white/68 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {item === "exterior"
                  ? (locale === "ka" ? "ექსტერიერი" : "Exterior")
                  : (locale === "ka" ? "ინტერიერი" : "Interior")}
              </button>
            );
          })}
          </div>
        </div>

        <div className="pointer-events-none absolute left-5 top-5 z-20 hidden sm:block">
          <p className="text-[0.72rem] font-semibold uppercase text-white/55">
            BYD
          </p>
          <p className="mt-1 text-lg font-semibold text-white">
            {modelName}
          </p>
        </div>

        <div className="relative aspect-[16/10.5] sm:aspect-[16/7.4] lg:min-h-[29rem]">
          {previewSrc ? (
            <Image
              key={previewSrc}
              src={previewSrc}
              alt={`${modelName} ${activeAsset.label}`}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
              onError={() =>
                setFailedSrcs((current) => ({ ...current, [activeAsset.src]: true }))
              }
              priority={mode === "exterior" && exteriorIndex === 0}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#252728] text-center text-sm font-medium text-white/60">
              {locale === "ka" ? "ავტომობილის გამოსახულება მალე დაემატება" : "Vehicle imagery coming soon"}
            </div>
          )}
        </div>

        {mode === "exterior" && (
          <>
            <button
              type="button"
              onClick={goToPreviousAngle}
              aria-label="Show previous exterior angle"
              className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.14] bg-black/22 text-white/72 backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-[#17191a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/70 md:flex"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
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
              type="button"
              onClick={goToNextAngle}
              aria-label="Show next exterior angle"
              className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.14] bg-black/22 text-white/72 backdrop-blur-md transition-all duration-200 hover:bg-white hover:text-[#17191a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/70 md:flex"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
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

            <div className="absolute inset-x-0 bottom-1.5 sm:bottom-5 z-20 flex justify-center px-4">
              <div className="flex max-w-full items-center gap-0.5 sm:gap-1 rounded-full border border-white/[0.12] bg-black/28 p-0.5 sm:p-1 shadow-[0_0.75rem_2rem_rgba(0,0,0,0.22)] backdrop-blur-md">
              {exteriorAssets.map((asset, index) => {
                const isActive = exteriorIndex === index;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setExteriorIndex(index)}
                    aria-pressed={isActive}
                      className={`flex min-h-[1.75rem] sm:min-h-[2.5rem] items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-4 text-[10px] sm:text-[11px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/70 ${
                      isActive
                          ? "bg-white text-[#17191a]"
                          : "text-white/62 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                      <span
                        className={`h-1 sm:h-1.5 rounded-full transition-all duration-200 ${
                          isActive ? "w-5 sm:w-7 bg-byd-red" : "w-1 sm:w-1.5 bg-white/45"
                        }`}
                      />
                      <span className="hidden sm:inline">{asset.label}</span>
                  </button>
                );
              })}
              </div>
            </div>
          </>
        )}

        {mode === "interior" && (
          <div className="absolute inset-x-0 bottom-3 sm:bottom-5 z-20 flex justify-center px-4">
            <div className="rounded-full border border-white/[0.12] bg-black/28 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-semibold text-white/72 shadow-[0_0.75rem_2rem_rgba(0,0,0,0.22)] backdrop-blur-md">
              {locale === "ka" ? "სალონის ხედი" : "Cockpit View"}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
