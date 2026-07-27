const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DISPLAY_DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export type DateValidationError = "format" | "invalid" | "past";

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

export function validateDisplayDate(value: string, min?: string): DateValidationError | null {
  if (!DISPLAY_DATE_PATTERN.test(value)) return "format";
  const isoValue = parseDisplayDate(value);
  if (!isoValue) return "invalid";
  if (min && isoValue < min) return "past";
  return null;
}

export function validateIsoDate(value: unknown, min?: string) {
  if (typeof value !== "string") return false;
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  if (!isRealCalendarDate(Number(year), Number(month), Number(day))) return false;
  return !min || value >= min;
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
