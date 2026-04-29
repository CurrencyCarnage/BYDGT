"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { CarModel, formatPrice, getLocalizedValue } from "@/lib/types";

interface ModelConfiguratorProps {
  model: CarModel;
}

export default function ModelConfigurator({ model }: ModelConfiguratorProps) {
  const [selectedColor, setSelectedColor] = useState(
    model.configurations.colors[0]
  );
  const [selectedVariant, setSelectedVariant] = useState(
    model.configurations.variants[0]
  );
  const t = useTranslations("model");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const totalPrice =
    model.basePrice +
    selectedColor.priceModifier +
    selectedVariant.priceModifier;

  return (
    <div className="border border-white/[0.08] bg-[#252728] p-6 md:p-8">

      {/* Color Selector */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-white/35 uppercase tracking-[0.2em] mb-4">
          {t("selectColor")}
        </p>
        <div className="flex flex-wrap gap-3">
          {model.configurations.colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color)}
              className={`group flex items-center gap-3 px-4 py-3 border transition-all duration-200 ${
                selectedColor.id === color.id
                  ? "border-byd-red bg-byd-red/5"
                  : "border-white/[0.08] hover:border-white/[0.25]"
              }`}
            >
              {/* Color Swatch */}
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  selectedColor.id === color.id
                    ? "border-byd-red scale-110"
                    : "border-white/20"
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-left">
                <p className="text-sm font-medium text-white">
                  {getLocalizedValue(color.name, locale)}
                </p>
                <p className="text-xs text-white/35">
                  {color.priceModifier === 0
                    ? t("included")
                    : `+${formatPrice(color.priceModifier)}`}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Variant Selector */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-white/35 uppercase tracking-[0.2em] mb-4">
          {t("selectVariant")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {model.configurations.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={`px-5 py-4 border text-left transition-all duration-200 ${
                selectedVariant.id === variant.id
                  ? "border-byd-red bg-byd-red/5"
                  : "border-white/[0.08] hover:border-white/[0.25]"
              }`}
            >
              <p className="text-sm font-semibold text-white">
                {getLocalizedValue(variant.name, locale)}
              </p>
              <p className="text-xs text-white/35 mt-1">
                {variant.priceModifier === 0
                  ? t("included")
                  : `+${formatPrice(variant.priceModifier)}`}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="pt-6 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between mb-6">
          <span className="text-white/60 font-medium">
            {t("totalPrice")}
          </span>
          <span className="text-3xl font-bold text-white">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/booking" className="btn-primary text-center flex-1">
            {tCommon("bookTestDrive")}
          </a>
          <a href="/contact" className="btn-secondary text-center flex-1">
            {tCommon("contactUs")}
          </a>
          <a
            href={`https://wa.me/995XXXXXXXXX?text=${encodeURIComponent(
              `Hi, I'm interested in the ${getLocalizedValue(model.name, "en")} (${getLocalizedValue(selectedColor.name, "en")}, ${getLocalizedValue(selectedVariant.name, "en")})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost text-center border border-[#25D366] text-[#25D366] hover:bg-[rgba(37,211,102,0.1)]"
          >
            {tCommon("whatsapp")}
          </a>
        </div>
      </div>
    </div>
  );
}
