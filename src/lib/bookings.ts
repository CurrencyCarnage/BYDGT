import fs from "fs/promises";
import path from "path";
import type { TestDriveBooking } from "./test-drive";
import { getCloudflareEnv, type D1DatabaseLike } from "./cloudflare-env";

const BOOKINGS_DIR = path.join(process.cwd(), "content", "bookings");
let d1Ready: Promise<void> | null = null;

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
