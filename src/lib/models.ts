import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import type { CarModel } from "./types";
import { getCloudflareEnv, type D1DatabaseLike } from "./cloudflare-env";
import { seedModels } from "./seed-models";

export type { CarModel, LocalizedString, ColorOption, VariantOption, CarSpecs, TrimDetails } from "./types";
export { getLocalizedValue, getOfficialVariants, getVariantDetails, formatPrice } from "./types";

const MODELS_DIR = path.join(process.cwd(), "content", "models");
let d1Ready: Promise<void> | null = null;
const OFFICIAL_MODEL_CONTENT_VERSION = "2026-08-21-model-years-v2";

function sanitizeModelId(id: string) {
  return id.replace(/[^a-z0-9-]/gi, "").toLowerCase();
}

function getDb() {
  return getCloudflareEnv().DB;
}

function preserveCommercialTerms(source: CarModel, existing: CarModel): CarModel {
  const existingColorPrices = new Map(existing.configurations.colors.map((color) => [color.id, color.priceModifier]));
  const existingVariantPrices = new Map(existing.configurations.variants.map((variant) => [variant.id, variant.priceModifier]));

  return {
    ...source,
    basePrice: existing.basePrice ?? source.basePrice,
    currency: existing.currency || source.currency,
    priceStatus: existing.priceStatus ?? source.priceStatus,
    configurations: {
      ...source.configurations,
      colors: source.configurations.colors.map((color) => ({
        ...color,
        priceModifier: existingColorPrices.get(color.id) ?? color.priceModifier,
      })),
      variants: source.configurations.variants.map((variant) => ({
        ...variant,
        priceModifier: existingVariantPrices.get(variant.id) ?? variant.priceModifier,
      })),
    },
  };
}

async function ensureD1(db: D1DatabaseLike) {
  if (!d1Ready) {
    d1Ready = (async () => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS app_meta (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS models (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      const seeded = await db
        .prepare("SELECT value FROM app_meta WHERE key = ?")
        .bind("models_seeded")
        .first<{ value: string }>();

      if (!seeded) {
        for (const model of seedModels) {
          await db
            .prepare(
              `INSERT OR IGNORE INTO models (id, data, created_at, updated_at)
               VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
            )
            .bind(model.id, JSON.stringify(model))
            .run();
        }
        await db
          .prepare("INSERT INTO app_meta (key, value) VALUES (?, ?)")
          .bind("models_seeded", new Date().toISOString())
          .run();
      }

      const migration = await db
        .prepare("SELECT value FROM app_meta WHERE key = ?")
        .bind("official_model_content_version")
        .first<{ value: string }>();

      if (migration?.value !== OFFICIAL_MODEL_CONTENT_VERSION) {
        for (const model of seedModels) {
          const existing = await db
            .prepare("SELECT data FROM models WHERE id = ?")
            .bind(model.id)
            .first<{ data: string }>();
          const migrated = existing
            ? preserveCommercialTerms(model, JSON.parse(existing.data) as CarModel)
            : model;

          await db
            .prepare(
              `INSERT INTO models (id, data, created_at, updated_at)
               VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
               ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`
            )
            .bind(model.id, JSON.stringify(migrated))
            .run();
        }

        await db
          .prepare("INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)")
          .bind("official_model_content_version", OFFICIAL_MODEL_CONTENT_VERSION)
          .run();
      }
    })();
  }

  await d1Ready;
}

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
  noStore();

  const db = getDb();
  if (db) {
    await ensureD1(db);
    const rows = await db
      .prepare("SELECT data FROM models ORDER BY id")
      .all<{ data: string }>();
    return (rows.results ?? []).map((row) => JSON.parse(row.data) as CarModel);
  }

  return readAllFromDisk();
}

export async function getModelById(id: string): Promise<CarModel | undefined> {
  const db = getDb();
  if (db) {
    await ensureD1(db);
    const row = await db
      .prepare("SELECT data FROM models WHERE id = ?")
      .bind(id)
      .first<{ data: string }>();
    return row ? (JSON.parse(row.data) as CarModel) : undefined;
  }

  const models = await readAllFromDisk();
  return models.find((m) => m.id === id);
}

export async function getFeaturedModels(): Promise<CarModel[]> {
  const models = await getAllModels();
  return models.filter((m) => m.isFeatured);
}

export async function getAvailableModels(): Promise<CarModel[]> {
  const models = await getAllModels();
  return models.filter((m) => m.isAvailable);
}

export async function createModel(model: CarModel): Promise<CarModel> {
  const safeId = sanitizeModelId(model.id);
  if (!safeId) {
    throw new Error("Invalid product ID");
  }

  const modelYears = model.years?.length ? Array.from(new Set(model.years)) : [model.year || 2026];
  const newModel = {
    ...model,
    id: safeId,
    year: model.year || modelYears[0],
    years: modelYears,
    isAvailable: false,
    currency: model.currency || "USD",
  };

  const db = getDb();
  if (db) {
    await ensureD1(db);
    const existing = await getModelById(safeId);
    if (existing) {
      throw new Error("A product with this ID already exists");
    }
    await db
      .prepare(
        `INSERT INTO models (id, data, created_at, updated_at)
         VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
      )
      .bind(newModel.id, JSON.stringify(newModel))
      .run();
    return newModel;
  }

  const filePath = path.join(MODELS_DIR, `${safeId}.json`);
  try {
    await fs.access(filePath);
    throw new Error("A product with this ID already exists");
  } catch (error) {
    if (error instanceof Error && error.message.includes("already exists")) {
      throw error;
    }
  }

  await fs.writeFile(filePath, JSON.stringify(newModel, null, 2), "utf-8");
  await fs.mkdir(path.join(process.cwd(), "public", "images", "models", safeId), {
    recursive: true,
  });

  return newModel;
}

export async function updateModel(id: string, model: CarModel): Promise<CarModel> {
  const modelYears = model.years?.length ? Array.from(new Set(model.years)) : [model.year || 2026];
  const updatedModel = { ...model, id, year: model.year || modelYears[0], years: modelYears };
  const db = getDb();

  if (db) {
    await ensureD1(db);
    const existing = await getModelById(id);
    if (!existing) {
      throw new Error("Product not found");
    }
    await db
      .prepare("UPDATE models SET data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(JSON.stringify(updatedModel), id)
      .run();
    return updatedModel;
  }

  const filePath = path.join(MODELS_DIR, `${id}.json`);
  await fs.access(filePath);
  await fs.writeFile(filePath, JSON.stringify(updatedModel, null, 2), "utf-8");
  return updatedModel;
}

export async function deleteModel(id: string): Promise<void> {
  const db = getDb();

  if (db) {
    await ensureD1(db);
    await db.prepare("DELETE FROM models WHERE id = ?").bind(id).run();
    return;
  }

  const filePath = path.join(MODELS_DIR, `${id}.json`);
  await fs.access(filePath);
  await fs.unlink(filePath);
}
