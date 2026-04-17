import fs from "fs";
import path from "path";
import { CarModel } from "./types";

export type { CarModel, LocalizedString, ColorOption, VariantOption, CarSpecs } from "./types";
export { getLocalizedValue, formatPrice } from "./types";

const modelsDirectory = path.join(process.cwd(), "content", "models");

const MODEL_ORDER = ["sealion-06-dmi", "seal-06-dmi", "yuan-up-dmi", "yuan-up-ev"];

export function getAllModels(): CarModel[] {
  const fileNames = fs.readdirSync(modelsDirectory);
  return fileNames
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const filePath = path.join(modelsDirectory, name);
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content) as CarModel;
    })
    .sort((a, b) => {
      const ai = MODEL_ORDER.indexOf(a.id);
      const bi = MODEL_ORDER.indexOf(b.id);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
}

export function getModelById(id: string): CarModel | undefined {
  const models = getAllModels();
  return models.find((m) => m.id === id);
}

export function getFeaturedModels(): CarModel[] {
  return getAllModels().filter((m) => m.isFeatured);
}

export function getAvailableModels(): CarModel[] {
  return getAllModels().filter((m) => m.isAvailable);
}
