import { CarModel } from "./types";

export type { CarModel, LocalizedString, ColorOption, VariantOption, CarSpecs } from "./types";
export { getLocalizedValue, formatPrice } from "./types";

// Static JSON imports — bundled at build time, no filesystem access at runtime.
// This works on Vercel, GitHub Pages, and any static/serverless host.
import sealionData from "../../content/models/sealion-06-dmi.json";
import sealData from "../../content/models/seal-06-dmi.json";
import yuanUpDmiData from "../../content/models/yuan-up-dmi.json";
import yuanUpEvData from "../../content/models/yuan-up-ev.json";

const ALL_MODELS: CarModel[] = [
  sealionData as unknown as CarModel,
  sealData as unknown as CarModel,
  yuanUpDmiData as unknown as CarModel,
  yuanUpEvData as unknown as CarModel,
];

export function getAllModels(): CarModel[] {
  return ALL_MODELS;
}

export function getModelById(id: string): CarModel | undefined {
  return ALL_MODELS.find((m) => m.id === id);
}

export function getFeaturedModels(): CarModel[] {
  return ALL_MODELS.filter((m) => m.isFeatured);
}

export function getAvailableModels(): CarModel[] {
  return ALL_MODELS.filter((m) => m.isAvailable);
}
