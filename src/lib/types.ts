export interface LocalizedString {
  en: string;
  ka: string;
}

export interface ColorOption {
  id: string;
  name: LocalizedString;
  hex: string;
  priceModifier: number;
}

export interface VariantOption {
  id: string;
  name: LocalizedString;
  priceModifier: number;
}

export interface CarSpecs {
  range_km: number;
  electric_range_km?: number;
  power_hp: number;
  acceleration_0_100: number;
  top_speed_kmh: number;
  battery_kwh: number;
}

export interface CarModel {
  id: string;
  name: LocalizedString;
  tagline: LocalizedString;
  category: string;
  type: "EV" | "PHEV";
  basePrice: number;
  currency: string;
  specs: CarSpecs;
  configurations: {
    colors: ColorOption[];
    variants: VariantOption[];
  };
  images: {
    hero: string;
    heroVideo?: string;
    gallery: string[];
    colorViews: Record<string, string>;
  };
  features: LocalizedString[];
  isAvailable: boolean;
  isFeatured: boolean;
}

export function getLocalizedValue(
  value: LocalizedString,
  locale: string
): string {
  return locale === "ka" ? value.ka : value.en;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
