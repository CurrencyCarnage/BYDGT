"use client";

import TintedCarImage from "./TintedCarImage";
import { ColorOption, getLocalizedValue } from "@/lib/types";

interface CarColorPreviewProps {
  colorSilhouette?: string;
  colors: ColorOption[];
  selectedColorId: string;
  onSelectColor: (color: ColorOption) => void;
  locale: string;
  selectLabel: string;
  includedLabel: string;
  formatPrice: (price: number) => string;
}

export default function CarColorPreview({
  colorSilhouette,
  colors,
  selectedColorId,
  onSelectColor,
  locale,
  selectLabel,
  includedLabel,
  formatPrice,
}: CarColorPreviewProps) {
  const imageSrc = colorSilhouette;

  return (
    <div className="mb-8 content-surface-soft px-4 py-5 sm:px-5 lg:px-6">
      <div className="mb-5">
        <p className="configurator-section-label text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
          {selectLabel}
        </p>
      </div>

      <div
        className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]"
      >
        {colors.map((color) => {
          const isSelected = selectedColorId === color.id;

          return (
            <button
              type="button"
              key={color.id}
              onClick={() => onSelectColor(color)}
              aria-pressed={isSelected}
              className={`configurator-option group relative overflow-hidden border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                isSelected
                  ? "border-byd-red bg-byd-red/[0.08] shadow-[0_14px_32px_rgba(215,12,25,0.10)]"
                  : "border-[#DDE1E3] bg-white hover:-translate-y-0.5 hover:border-[#BFC5C8]"
              }`}
            >
              {isSelected && (
                <div className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-byd-red/50 bg-byd-red/15 text-byd-red">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {imageSrc && (
                <div className="configurator-color-preview border-b border-[#E6E9EA] bg-[linear-gradient(180deg,#F4F6F7_0%,#E5E9EB_100%)] px-3 pt-5 pb-2">
                  <TintedCarImage
                    src={imageSrc}
                    color={color.hex}
                    alt={getLocalizedValue(color.name, locale)}
                  />
                </div>
              )}

              <div className="flex items-start gap-3 px-4 py-3.5">
                <div
                  className={`mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-white shadow-[0_0_0_3px_rgba(215,12,25,0.24)]"
                      : "border-[#C7CDD0]"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                <div className="min-w-0 text-left">
                  <p className="configurator-option-title truncate text-sm font-semibold text-[#252728]">
                    {getLocalizedValue(color.name, locale)}
                  </p>
                  <p className="configurator-option-meta mt-1 text-[11px] text-[var(--theme-text-muted)]">
                    {color.priceModifier === 0
                      ? includedLabel
                      : `+${formatPrice(color.priceModifier)}`}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
