import fs from "fs/promises";
import path from "path";
import type { TestDriveBooking } from "./test-drive";
import { getCloudflareEnv, type D1DatabaseLike } from "./cloudflare-env";
import { getTodayIsoInTbilisi } from "./date";

const BOOKINGS_DIR = path.join(process.cwd(), "content", "bookings");
let d1Ready: Promise<void> | null = null;

/** ISO date → time slots already requested. */
export type BookedSlotMap = Record<string, string[]>;

async function ensureD1(db: D1DatabaseLike) {
  if (!d1Ready) {
    d1Ready = db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `).then(() => undefined);
  }

  await d1Ready;
}

export async function saveBooking(booking: TestDriveBooking) {
  const db = getCloudflareEnv().DB;
  if (db) {
    await ensureD1(db);
    await db
      .prepare(
        `INSERT INTO bookings (id, data, created_at)
         VALUES (?, ?, CURRENT_TIMESTAMP)`
      )
      .bind(booking.id, JSON.stringify(booking))
      .run();
    return;
  }

  await fs.mkdir(BOOKINGS_DIR, { recursive: true });
  await fs.writeFile(
    path.join(BOOKINGS_DIR, `${booking.id}.json`),
    JSON.stringify(booking, null, 2),
    "utf-8"
  );
}

function collect(target: BookedSlotMap, date: unknown, slot: unknown, fromDate: string) {
  if (typeof date !== "string" || typeof slot !== "string") return;
  if (!date || !slot || date < fromDate) return;
  const slots = target[date] ?? (target[date] = []);
  if (!slots.includes(slot)) slots.push(slot);
}

/**
 * Every date/time already requested from today onwards, so the picker can
 * gray out slots that are taken.
 */
export async function getBookedSlots(): Promise<BookedSlotMap> {
  const fromDate = getTodayIsoInTbilisi();
  const booked: BookedSlotMap = {};

  const db = getCloudflareEnv().DB;
  if (db) {
    try {
      await ensureD1(db);
      const rows = await db.prepare(`SELECT data FROM bookings`).all<{ data: string }>();
      for (const row of rows.results ?? []) {
        try {
          const record = JSON.parse(row.data) as Partial<TestDriveBooking>;
          collect(booked, record.preferredDate, record.preferredTimeSlot, fromDate);
        } catch {
          /* skip malformed row */
        }
      }
      return booked;
    } catch (error) {
      console.error("[bookings] Failed to read booked slots from D1:", error);
      return booked;
    }
  }

  try {
    const files = await fs.readdir(BOOKINGS_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = await fs.readFile(path.join(BOOKINGS_DIR, file), "utf-8");
        const record = JSON.parse(raw) as Partial<TestDriveBooking>;
        collect(booked, record.preferredDate, record.preferredTimeSlot, fromDate);
      } catch {
        /* skip malformed file */
      }
    }
  } catch {
    /* no bookings stored yet */
  }

  return booked;
}

export async function isSlotTaken(date: string, slot: string) {
  const booked = await getBookedSlots();
  return (booked[date] ?? []).includes(slot);
}
