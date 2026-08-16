/**
 * Shared field validation for every public form (test drive, contact, service requests).
 * Every rule returns a stable error code; the UI maps codes to localized copy.
 */

export type NameValidationError =
  | "required"
  | "tooShort"
  | "tooLong"
  | "charset"
  | "singleWord";

export type EmailValidationError = "required" | "tooLong" | "format" | "charset";

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 320;
export const EMAIL_LOCAL_MAX_LENGTH = 64;
export const EMAIL_DOMAIN_MAX_LENGTH = 255;

/** Letters: Latin (incl. accents), Greek, Cyrillic, Georgian (Mkhedruli + Mtavruli). */
const LETTER_RANGES = "A-Za-z\\u00C0-\\u024F\\u0370-\\u03FF\\u0400-\\u04FF\\u10A0-\\u10FF\\u1C90-\\u1CBF";
const NAME_ALLOWED = new RegExp(`^[${LETTER_RANGES}][${LETTER_RANGES}'\u2019\\-. ]*$`);
const HAS_LETTER = new RegExp(`[${LETTER_RANGES}]`);
const EMAIL_LOCAL_ALLOWED = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const EMAIL_DOMAIN_LABEL = /^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?$/;

/** Collapse runs of whitespace and trim — what we store and validate against. */
export function normalizeName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function validateName(
  value: string,
  { required = true, requireFullName = false }: { required?: boolean; requireFullName?: boolean } = {},
): NameValidationError | null {
  const name = normalizeName(value);
  if (!name) return required ? "required" : null;
  if (name.length < NAME_MIN_LENGTH) return "tooShort";
  if (name.length > NAME_MAX_LENGTH) return "tooLong";
  if (!NAME_ALLOWED.test(name)) return "charset";
  const words = name.split(" ").filter(Boolean);
  if (requireFullName && words.length < 2) return "singleWord";
  if (words.some((word) => !HAS_LETTER.test(word))) return "charset";
  return null;
}

export function validateEmail(
  value: string,
  { required = true }: { required?: boolean } = {},
): EmailValidationError | null {
  const email = value.trim();
  if (!email) return required ? "required" : null;
  if (email.length > EMAIL_MAX_LENGTH) return "tooLong";
  if (/\s/.test(email)) return "charset";

  const atIndex = email.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === email.length - 1) return "format";

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (local.length > EMAIL_LOCAL_MAX_LENGTH || domain.length > EMAIL_DOMAIN_MAX_LENGTH) return "tooLong";
  if (!EMAIL_LOCAL_ALLOWED.test(local)) return "charset";

  const labels = domain.split(".");
  if (labels.length < 2) return "format";
  if (labels.some((label) => !EMAIL_DOMAIN_LABEL.test(label))) return "format";
  if (labels[labels.length - 1].length < 2 || /\d/.test(labels[labels.length - 1])) return "format";
  return null;
}

export function isValidName(value: string, options?: { required?: boolean; requireFullName?: boolean }) {
  return validateName(value, options) === null;
}

export function isValidEmail(value: string, options?: { required?: boolean }) {
  return validateEmail(value, options) === null;
}
