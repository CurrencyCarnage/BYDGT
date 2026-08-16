"use client";

import examples from "libphonenumber-js/examples.mobile.json";
import { getExampleNumber, type CountryCode } from "libphonenumber-js";

/**
 * A realistic national-format sample for the selected country, used as the
 * phone input placeholder so it adapts instead of always showing a Georgian number.
 */
export function getPhonePlaceholder(country: CountryCode, fallback = "") {
  try {
    const example = getExampleNumber(country, examples);
    return example ? example.formatNational() : fallback;
  } catch {
    return fallback;
  }
}
