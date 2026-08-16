import { promises as fs } from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import type { LocalizedString, NewsImage, NewsPost } from "./types";

const NEWS_DIR = path.join(process.cwd(), "content", "news");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function localized(value: unknown): value is LocalizedString {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.en === "string" && record.en.trim().length > 0
    && typeof record.ka === "string" && record.ka.trim().length > 0;
}

function image(value: unknown): value is NewsImage {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.url === "string"
    && record.url.startsWith("/images/")
    && localized(record.alt);
}

function isValidPost(value: unknown): value is NewsPost {
  if (!value || typeof value !== "object") return false;
  const post = value as Record<string, unknown>;
  if (typeof post.slug !== "string" || !SLUG_PATTERN.test(post.slug)) return false;
  if (!localized(post.title) || !localized(post.excerpt) || !localized(post.body)) return false;
  if (post.coverImage !== null && !image(post.coverImage)) return false;
  if (!Array.isArray(post.gallery) || !post.gallery.every(image)) return false;
  if (typeof post.published !== "boolean") return false;
  if (post.publishedAt !== null && (typeof post.publishedAt !== "string" || Number.isNaN(Date.parse(post.publishedAt)))) return false;
  return typeof post.createdAt === "string" && !Number.isNaN(Date.parse(post.createdAt))
    && typeof post.updatedAt === "string" && !Number.isNaN(Date.parse(post.updatedAt));
}

async function readCheckedInNews(): Promise<NewsPost[]> {
  noStore();
  try {
    const files = await fs.readdir(NEWS_DIR);
    const records = await Promise.all(files.filter((file) => file.endsWith(".json")).map(async (file) => {
      try {
        return JSON.parse(await fs.readFile(path.join(NEWS_DIR, file), "utf8")) as unknown;
      } catch {
        return null;
      }
    }));
    return records.filter(isValidPost);
  } catch {
    return [];
  }
}

export async function getPublishedNews(): Promise<NewsPost[]> {
  return (await readCheckedInNews())
    .filter((post) => post.published && post.publishedAt)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function getPublishedNewsBySlug(slug: string): Promise<NewsPost | undefined> {
  if (!SLUG_PATTERN.test(slug)) return undefined;
  return (await getPublishedNews()).find((post) => post.slug === slug);
}
