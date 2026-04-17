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
    <div className="glass-card p-6 md:p-8">
      <h2 className="text-xl md:text-heading font-semibold text-text-primary mb-8">
        {t("configurator")}
      </h2>

      {/* Color Selector */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          {t("selectColor")}
        </h3>
        <div className="flex flex-wrap gap-3">
          {model.configurations.colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color)}
              className={`group flex items-center gap-3 px-4 py-3 rounded-card border transition-all duration-200 ${
                selectedColor.id === color.id
                  ? "border-accent bg-[rgba(0,212,255,0.05)]"
                  : "border-glass-border hover:border-glass-border-hover"
              }`}
            >
              {/* Color Swatch */}
              <div
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                  selectedColor.id === color.id
                    ? "border-accent scale-110"
                    : "border-[rgba(255,255,255,0.2)]"
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">
                  {getLocalizedValue(color.name, locale)}
                </p>
                <p className="text-xs text-text-muted">
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
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          {t("selectVariant")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {model.configurations.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={`px-5 py-4 rounded-card border text-left transition-all duration-200 ${
                selectedVariant.id === variant.id
                  ? "border-accent bg-[rgba(0,212,255,0.05)]"
                  : "border-glass-border hover:border-glass-border-hover"
              }`}
            >
              <p className="text-sm font-semibold text-text-primary">
                {getLocalizedValue(variant.name, locale)}
              </p>
              <p className="text-xs text-text-muted mt-1">
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
          <span className="text-text-secondary font-medium">
            {t("totalPrice")}
          </span>
          <span className="text-3xl font-bold text-accent">
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
