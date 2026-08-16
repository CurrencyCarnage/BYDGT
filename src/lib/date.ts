const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DISPLAY_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export type DateValidationError = "format" | "invalid" | "past" | "future";

function isoFromParts(year: number, month: number, day: number) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function isRealCalendarDate(year: number, month: number, day: number) {
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const value = new Date(Date.UTC(year, month - 1, day));
  return value.getUTCFullYear() === year
    && value.getUTCMonth() === month - 1
    && value.getUTCDate() === day;
}

export function formatIsoDateForDisplay(value: string) {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return "";
  const [, year, month, day] = match;
  if (!isRealCalendarDate(Number(year), Number(month), Number(day))) return "";
  return `${day}/${month}/${year}`;
}

export function parseDisplayDate(value: string) {
  const match = DISPLAY_DATE_PATTERN.exec(value);
  if (!match) return null;
  const [, day, month, year] = match;
  if (!isRealCalendarDate(Number(year), Number(month), Number(day))) return null;
  return isoFromParts(Number(year), Number(month), Number(day));
}

export function validateDisplayDate(value: string, min?: string, max?: string): DateValidationError | null {
  if (!DISPLAY_DATE_PATTERN.test(value)) return "format";
  const isoValue = parseDisplayDate(value);
  if (!isoValue) return "invalid";
  if (min && isoValue < min) return "past";
  if (max && isoValue > max) return "future";
  return null;
}

export function validateIsoDate(value: unknown, min?: string, max?: string) {
  if (typeof value !== "string") return false;
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  if (!isRealCalendarDate(Number(year), Number(month), Number(day))) return false;
  if (min && value < min) return false;
  if (max && value > max) return false;
  return true;
}

export function getTodayIsoInTbilisi(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Tbilisi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

/** Bookings can be requested up to the end of next calendar year. */
export function getMaxBookingIsoInTbilisi(date = new Date()) {
  const currentYear = Number(getTodayIsoInTbilisi(date).slice(0, 4));
  return `${currentYear + 1}-12-31`;
}

export function addIsoDays(isoValue: string, days: number) {
  const match = ISO_DATE_PATTERN.exec(isoValue);
  if (!match) return isoValue;
  const [, year, month, day] = match;
  const next = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + days));
  return isoFromParts(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
}

/** Calendar grid for a month, Monday-first, padded to whole weeks. */
export function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const offset = (firstDay.getUTCDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: Array<{ iso: string; day: number; inMonth: boolean }> = [];

  for (let index = 0; index < offset; index += 1) {
    const date = new Date(Date.UTC(year, month - 1, index - offset + 1));
    cells.push({
      iso: isoFromParts(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()),
      day: date.getUTCDate(),
      inMonth: false,
    });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ iso: isoFromParts(year, month, day), day, inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];
    const next = new Date(`${last.iso}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    cells.push({
      iso: isoFromParts(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate()),
      day: next.getUTCDate(),
      inMonth: false,
    });
  }
  return cells;
}
