"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { CarModel, formatPrice, getLocalizedValue } from "@/lib/types";
import CarColorPreview from "./CarColorPreview";

interface ModelConfiguratorProps {
  model: CarModel;
}

export default function ModelConfigurator({ model }: ModelConfiguratorProps) {
  const [selectedColor, setSelectedColor] = useState(
    model.configurations.colors[0] ?? null
  );
  const [selectedVariant, setSelectedVariant] = useState(
    model.configurations.variants[0] ?? null
  );
  const t = useTranslations("model");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const totalPrice =
    model.basePrice +
    (selectedColor?.priceModifier ?? 0) +
    (selectedVariant?.priceModifier ?? 0);
  const selectedColorName = selectedColor ? getLocalizedValue(selectedColor.name, locale) : "";
  const selectedVariantName = selectedVariant ? getLocalizedValue(selectedVariant.name, locale) : "";

  return (
    <div className="relative overflow-hidden border border-white/[0.08] bg-[#252728] p-6 md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(215,12,25,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_32%)]" />

      <div className="relative z-10">
        {model.configurations.colors.length > 0 && selectedColor && (
          <CarColorPreview
            colorSilhouette={model.images.colorSilhouette}
            colors={model.configurations.colors}
            selectedColorId={selectedColor.id}
            onSelectColor={setSelectedColor}
            locale={locale}
            selectLabel={t("selectColor")}
            includedLabel={t("included")}
            formatPrice={formatPrice}
          />
        )}

        {model.configurations.variants.length > 0 && (
        <div className="mb-8 border border-white/[0.08] bg-white/[0.02] px-4 py-5 sm:px-5 lg:px-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
            {t("selectVariant")}
          </p>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {model.configurations.variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;

              return (
                <button
                  type="button"
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  aria-pressed={isSelected}
                  className={`group relative border px-5 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#252728] ${
                    isSelected
                      ? "border-byd-red bg-byd-red/[0.08] shadow-[0_18px_40px_rgba(0,0,0,0.24)]"
                      : "border-white/[0.08] bg-black/[0.08] hover:-translate-y-0.5 hover:border-white/[0.22] hover:bg-white/[0.03]"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-byd-red/50 bg-byd-red/15 text-byd-red">
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
                    </span>
                  )}
                  <p className="pr-12 text-sm font-semibold text-white">
                    {getLocalizedValue(variant.name, locale)}
                  </p>
                  <p className="mt-2 text-[11px] text-white/35">
                    {variant.priceModifier === 0
                      ? t("included")
                      : `+${formatPrice(variant.priceModifier)}`}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        )}

        <div className="border-t border-[rgba(255,255,255,0.06)] pt-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-l border-byd-red/50 pl-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                  {t("selectColor")}
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {selectedColorName}
                </p>
              </div>
              <div className="border-l border-white/[0.12] pl-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                  {t("selectVariant")}
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {selectedVariantName}
                </p>
              </div>
            </div>

            <div className="xl:text-right">
              <span className="text-white/60 font-medium">
                {t("totalPrice")}
              </span>
              <p className="mt-2 text-4xl font-semibold text-white">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <Link href="/booking" className="btn-primary min-h-[48px] flex-1 text-center">
              {tCommon("bookTestDrive")}
            </Link>
            <Link href="/contact" className="btn-secondary min-h-[48px] flex-1 text-center">
              {tCommon("contactUs")}
            </Link>
            <a
              href={`https://wa.me/995XXXXXXXXX?text=${encodeURIComponent(
                `Hi, I'm interested in the ${getLocalizedValue(model.name, "en")}${selectedColor ? ` (${getLocalizedValue(selectedColor.name, "en")}` : ""}${selectedVariant ? `, ${getLocalizedValue(selectedVariant.name, "en")})` : selectedColor ? ")" : ""}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center border border-[#25D366]/50 px-6 text-center text-sm font-semibold text-[#25D366] transition-all duration-200 hover:border-[#25D366] hover:bg-[rgba(37,211,102,0.08)] hover:text-[#52e08b]"
            >
              {tCommon("whatsapp")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
