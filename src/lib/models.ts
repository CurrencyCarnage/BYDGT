import { promises as fs } from "fs";
import path from "path";
import type { CarModel } from "./types";

export type { CarModel, LocalizedString, ColorOption, VariantOption, CarSpecs } from "./types";
export { getLocalizedValue, formatPrice } from "./types";

const MODELS_DIR = path.join(process.cwd(), "content", "models");

async function readAllFromDisk(): Promise<CarModel[]> {
  const files = await fs.readdir(MODELS_DIR);
  const models = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(MODELS_DIR, file), "utf-8");
        return JSON.parse(raw) as CarModel;
      })
  );
  return models;
}

export async function getAllModels(): Promise<CarModel[]> {
  return readAllFromDisk();
}

export async function getModelById(id: string): Promise<CarModel | undefined> {
  const models = await readAllFromDisk();
  return models.find((m) => m.id === id);
}

export async function getFeaturedModels(): Promise<CarModel[]> {
  const models = await readAllFromDisk();
  return models.filter((m) => m.isFeatured);
}

export async function getAvailableModels(): Promise<CarModel[]> {
  const models = await readAllFromDisk();
  return models.filter((m) => m.isAvailable);
}
