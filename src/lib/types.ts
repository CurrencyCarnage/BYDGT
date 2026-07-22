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
  specs?: Partial<CarSpecs>;
  highlights?: LocalizedString[];
}

export interface TrimDetails {
  name: LocalizedString;
  specs?: Partial<CarSpecs>;
  highlights?: LocalizedString[];
}

export interface CarSpecs {
  range_km: number;
  range_label?: string;
  electric_range_km?: number;
  electric_range_label?: string;
  power_kw?: number;
  /** @deprecated Existing admin records may still provide the legacy display unit. */
  power_hp?: number;
  torque_nm?: number;
  acceleration_0_100: number;
  battery_kwh: number;
  charging_ac_kw?: number;
  charging_dc_kw?: number;
  top_speed_kmh?: number;
}

export interface CarModel {
  id: string;
  name: LocalizedString;
  tagline: LocalizedString;
  category: string;
  type: "EV" | "PHEV";
  basePrice?: number;
  priceStatus?: "contact";
  currency: string;
  specs: CarSpecs;
  configurations: {
    colors: ColorOption[];
    variants: VariantOption[];
  };
  trimDetails?: Record<string, TrimDetails>;
  images: {
    hero: string;
    heroVideo?: string;
    colorSilhouette?: string;
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

export function getVariantDetails(model: CarModel, variant: VariantOption) {
  const details = model.trimDetails?.[variant.id];
  return {
    ...variant,
    name: details?.name ?? variant.name,
    specs: { ...model.specs, ...variant.specs, ...details?.specs },
    highlights: details?.highlights ?? variant.highlights ?? [],
  };
}

export function getOfficialVariants(model: CarModel): VariantOption[] {
  const variants = model.configurations.variants;
  if (!model.trimDetails) return variants;
  return variants.filter((variant) => model.trimDetails?.[variant.id]);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}
