"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { CarModel, formatPrice, getLocalizedValue, getOfficialVariants, getVariantDetails } from "@/lib/types";
import CarColorPreview from "./CarColorPreview";
import ModelVisualPreview from "./ModelVisualPreview";
import CompareButton from "@/components/compare/CompareButton";

interface ModelConfiguratorProps {
  model: CarModel;
  selectedVariantId?: string | null;
  onVariantChange?: (variantId: string) => void;
  onSelectionChange?: (selection: ConfiguratorSelection) => void;
}

export interface ConfiguratorSelection {
  colorId: string | null;
  colorName: string;
  colorHex: string | null;
  variantId: string | null;
  variantName: string;
  totalPrice: number | null;
}

export default function ModelConfigurator({ model, selectedVariantId, onVariantChange, onSelectionChange }: ModelConfiguratorProps) {
  const variants = getOfficialVariants(model);
  const [localVariantId, setLocalVariantId] = useState<string | null>(variants[0]?.id ?? null);
  const [selectedColor, setSelectedColor] = useState(
    model.configurations.colors[0] ?? null
  );
  const activeVariantId = selectedVariantId ?? localVariantId;
  const selectedVariant = variants.find((variant) => variant.id === activeVariantId) ?? variants[0] ?? null;
  const t = useTranslations("model");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const totalPrice = model.priceStatus === "contact"
    ? null
    : (model.basePrice ?? 0) +
    (selectedColor?.priceModifier ?? 0) +
    (selectedVariant?.priceModifier ?? 0);
  const selectedColorName = selectedColor ? getLocalizedValue(selectedColor.name, locale) : "";
  const selectedVariantName = selectedVariant ? getLocalizedValue(getVariantDetails(model, selectedVariant).name, locale) : "";
  const bookingHref = `/booking?version=${encodeURIComponent(model.id)}&trim=${encodeURIComponent(selectedVariant?.id ?? "")}`;
  const enquiryHref = `/contact?subject=${encodeURIComponent(getLocalizedValue(model.name, "en") + " " + (selectedVariant ? getLocalizedValue(getVariantDetails(model, selectedVariant).name, "en") : ""))}`;

  useEffect(() => {
    onSelectionChange?.({
      colorId: selectedColor?.id ?? null,
      colorName: selectedColorName,
      colorHex: selectedColor?.hex ?? null,
      variantId: selectedVariant?.id ?? null,
      variantName: selectedVariantName,
      totalPrice,
    });
  }, [
    onSelectionChange,
    selectedColor?.hex,
    selectedColor?.id,
    selectedColorName,
    selectedVariant?.id,
    selectedVariantName,
    totalPrice,
  ]);

  return (
    <div className="model-configurator relative overflow-hidden bg-white p-0">
      <div className="configurator-light-glow pointer-events-none absolute inset-x-0 bottom-0 top-[26rem] bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.72),transparent_34%)]" />

      <div className="relative z-10">
        <div className="theme-media-section bg-[#1C1E1F] p-0">
          <ModelVisualPreview model={model} locale={locale} />
        </div>

        <div id="configurator-options" className="scroll-mt-24 p-6 md:p-8">
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

          {variants.length > 0 && (
          <div className="mb-8 content-surface-soft px-4 py-5 sm:px-5 lg:px-6">
          <p className="configurator-section-label mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#686D71]">
            {t("selectVariant")}
          </p>
          <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const details = getVariantDetails(model, variant);

              return (
                <button
                  type="button"
                  key={variant.id}
                  onClick={() => {
                    setLocalVariantId(variant.id);
                    onVariantChange?.(variant.id);
                  }}
                  aria-pressed={isSelected}
                  className={`configurator-option group relative border px-5 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isSelected
                      ? "border-byd-red bg-byd-red/[0.08] shadow-[0_14px_32px_rgba(215,12,25,0.10)]"
                      : "border-[#DDE1E3] bg-white hover:-translate-y-0.5 hover:border-[#BFC5C8]"
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
                  <p className="configurator-option-title pr-12 text-sm font-semibold text-[#252728]">
                    {getLocalizedValue(details.name, locale)}
                  </p>
                  <p className="configurator-option-meta mt-2 text-[11px] text-[#686D71]">
                    {model.priceStatus === "contact"
                      ? (locale === "ka" ? "Contact for pricing" : "Contact for pricing")
                      : variant.priceModifier === 0
                      ? t("included")
                      : `+${formatPrice(variant.priceModifier)}`}
                  </p>
                </button>
              );
            })}
          </div>
          </div>
          )}

          <div className="border-t border-[#DDE1E3] pt-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border-l border-byd-red/50 pl-4">
                <p className="configurator-summary-label text-[10px] uppercase tracking-[0.18em] text-[#686D71]">
                  {t("selectColor")}
                </p>
                <p className="configurator-summary-value mt-2 text-base font-semibold text-[#252728]">
                  {selectedColorName}
                </p>
              </div>
              <div className="border-l border-[#C7CDD0] pl-4">
                <p className="configurator-summary-label text-[10px] uppercase tracking-[0.18em] text-[#686D71]">
                  {t("selectVariant")}
                </p>
                <p className="configurator-summary-value mt-2 text-base font-semibold text-[#252728]">
                  {selectedVariantName}
                </p>
              </div>
            </div>

            <div className="xl:text-right">
              <span className="configurator-summary-label text-[#686D71] font-medium">
                {t("totalPrice")}
              </span>
              <p className="configurator-total-price mt-2 text-4xl font-semibold text-[#252728]">
                {totalPrice === null ? "Contact for pricing" : formatPrice(totalPrice)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Link href={bookingHref} className="btn-primary-red min-h-[48px] text-center">
              {tCommon("bookTestDrive")}
            </Link>
            <CompareButton
              modelId={model.id}
              modelName={getLocalizedValue(model.name, locale)}
              className="configurator-secondary-action inline-flex min-h-[48px] items-center justify-center border border-[#C7CDD0] px-6 text-center text-sm font-semibold text-[#252728] transition-all duration-200 hover:border-[#8A9094] hover:bg-[#F0F2F3]"
            />
            <Link href={enquiryHref} className="configurator-secondary-action inline-flex min-h-[48px] items-center justify-center border border-[#C7CDD0] px-6 text-center text-sm font-semibold text-[#252728] transition-all duration-200 hover:border-[#8A9094] hover:bg-[#F0F2F3]">
              {tCommon("contactUs")}
            </Link>
            <a
              href={`https://wa.me/995XXXXXXXXX?text=${encodeURIComponent(
                `Hi, I'm interested in the ${getLocalizedValue(model.name, "en")}${selectedColor ? ` (${getLocalizedValue(selectedColor.name, "en")}` : ""}${selectedVariant ? `, ${getLocalizedValue(getVariantDetails(model, selectedVariant).name, "en")})` : selectedColor ? ")" : ""}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="configurator-whatsapp-action inline-flex min-h-[48px] items-center justify-center border border-[#25D366]/50 px-6 text-center text-sm font-semibold text-[#25D366] transition-all duration-200 hover:border-[#25D366] hover:bg-[rgba(37,211,102,0.08)] hover:text-[#52e08b]"
            >
              {tCommon("whatsapp")}
            </a>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
