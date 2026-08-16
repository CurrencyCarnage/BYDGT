import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  type CountryCode,
} from "libphonenumber-js";

export const DEFAULT_PHONE_COUNTRY: CountryCode = "GE";
/** E.164 allows at most 15 digits including the country calling code. */
export const MAX_PHONE_DIGITS = 15;

export type PhoneValue = {
  country: CountryCode;
  callingCode: string;
  nationalNumber: string;
  e164: string;
};

export type PhoneValidationError = "required" | "tooShort" | "tooLong" | "invalid";

const digitRanges: Array<[number, number]> = [
  [0x0030, 0x0039],
  [0x0660, 0x0669],
  [0x06f0, 0x06f9],
  [0xff10, 0xff19],
];

export function normalizePhoneDigits(value: string) {
  let result = "";
  for (const character of value) {
    const code = character.codePointAt(0);
    if (code === undefined) continue;
    const range = digitRanges.find(([start, end]) => code >= start && code <= end);
    if (range) result += String(code - range[0]);
  }
  return result;
}

export function hasDisallowedPhoneCharacters(value: string) {
  for (const character of value) {
    if (normalizePhoneDigits(character)) continue;
    if (" +()-.\u00a0".includes(character)) continue;
    return true;
  }
  return false;
}

/** Digits still available for the national number once the calling code is counted. */
export function getMaxNationalDigits(country: CountryCode) {
  return Math.max(1, MAX_PHONE_DIGITS - getCountryCallingCode(country).length);
}

export function createPhoneValue(
  country: CountryCode = DEFAULT_PHONE_COUNTRY,
  nationalNumber = "",
): PhoneValue {
  const callingCode = getCountryCallingCode(country);
  const digits = normalizePhoneDigits(nationalNumber).slice(0, getMaxNationalDigits(country));
  const parsed = digits
    ? parsePhoneNumberFromString(`+${callingCode}${digits}`, { extract: false })
    : undefined;
  return {
    country,
    callingCode,
    nationalNumber: digits,
    e164: parsed?.isValid() && parsed.country === country ? parsed.number : "",
  };
}

export function parseInternationalPhone(value: string): PhoneValue | null {
  const normalizedValue = value.trim();
  if (!normalizedValue.startsWith("+")) return null;
  const parsed = parsePhoneNumberFromString(normalizedValue, { extract: false });
  if (!parsed?.country) return null;
  return createPhoneValue(parsed.country, parsed.nationalNumber);
}

export function formatNationalPhone(country: CountryCode, nationalNumber: string) {
  return new AsYouType(country).input(normalizePhoneDigits(nationalNumber));
}

export function validatePhoneValue(
  value: PhoneValue,
  required = false,
): PhoneValidationError | null {
  if (!value.nationalNumber) return required ? "required" : null;
  if (value.callingCode.length + value.nationalNumber.length > MAX_PHONE_DIGITS) return "tooLong";
  const lengthError = validatePhoneNumberLength(value.nationalNumber, value.country);
  if (lengthError === "TOO_SHORT") return "tooShort";
  if (lengthError === "TOO_LONG") return "tooLong";
  if (lengthError) return "invalid";
  return value.e164 ? null : "invalid";
}

export function normalizeE164Phone(value: unknown) {
  if (typeof value !== "string") return null;
  const parsed = parsePhoneNumberFromString(value, { extract: false });
  if (!parsed?.isValid()) return null;
  if (parsed.number.replace(/\D/g, "").length > MAX_PHONE_DIGITS) return null;
  return {
    e164: parsed.number,
    country: parsed.country,
  };
}

export function getPhoneCountries(locale: string) {
  const displayNames = new Intl.DisplayNames([locale], { type: "region" });
  return getCountries()
    .map((country) => ({
      country,
      callingCode: getCountryCallingCode(country),
      name: displayNames.of(country) ?? country,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}
