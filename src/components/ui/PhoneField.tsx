"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

import CustomSelect from "./CustomSelect";
import { getPhonePlaceholder } from "@/lib/phone-example";
import {
  DEFAULT_PHONE_COUNTRY,
  createPhoneValue,
  formatNationalPhone,
  getPhoneCountries,
  hasDisallowedPhoneCharacters,
  normalizePhoneDigits,
  parseInternationalPhone,
  getMaxNationalDigits,
  validatePhoneValue,
  type PhoneValidationError,
  type PhoneValue,
} from "@/lib/phone";

type PhoneFieldProps = {
  id?: string;
  value: string;
  onChange: (e164: string, value: PhoneValue) => void;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  onValidityChange?: (valid: boolean, hasValue: boolean) => void;
};

export default function PhoneField({
  id,
  value,
  onChange,
  required = false,
  className = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  onValidityChange,
}: PhoneFieldProps) {
  const locale = useLocale();
  const t = useTranslations("formControls.phone");
  const generatedId = useId();
  const inputId = id ?? `byd-phone-${generatedId}`;
  const errorId = `${inputId}-error`;
  const countries = useMemo(() => getPhoneCountries(locale), [locale]);
  const [phone, setPhone] = useState<PhoneValue>(() => {
    const parsed = value ? parsePhoneNumberFromString(value, { extract: false }) : undefined;
    return parsed?.country
      ? createPhoneValue(parsed.country, parsed.nationalNumber)
      : createPhoneValue(DEFAULT_PHONE_COUNTRY);
  });
  const [error, setError] = useState<PhoneValidationError | null>(null);
  const [hasDisallowedInput, setHasDisallowedInput] = useState(false);
  const pendingPublishedValueRef = useRef<string | null>(null);

  useEffect(() => {
    if (pendingPublishedValueRef.current === value) {
      pendingPublishedValueRef.current = null;
      return;
    }
    if (!value) {
      setPhone(createPhoneValue(DEFAULT_PHONE_COUNTRY));
      setError(null);
      setHasDisallowedInput(false);
      return;
    }
    const parsed = parsePhoneNumberFromString(value, { extract: false });
    if (parsed?.country) {
      setPhone(createPhoneValue(parsed.country, parsed.nationalNumber));
      setHasDisallowedInput(false);
    }
  }, [value]);

  const publish = (next: PhoneValue, disallowedInput = false) => {
    setPhone(next);
    setHasDisallowedInput(disallowedInput);
    setError(null);
    const validationError = disallowedInput ? "invalid" : validatePhoneValue(next, required);
    const publishedValue = disallowedInput ? "" : next.e164;
    pendingPublishedValueRef.current = publishedValue;
    onChange(publishedValue, next);
    onValidityChange?.(!validationError, Boolean(next.nationalNumber));
  };

  const setNationalNumber = (rawValue: string) => {
    const disallowedInput = hasDisallowedPhoneCharacters(rawValue);
    const international = parseInternationalPhone(rawValue);
    if (international) {
      publish(international, disallowedInput);
      return;
    }
    publish(
      createPhoneValue(phone.country, normalizePhoneDigits(rawValue)),
      disallowedInput,
    );
  };

  const validate = () =>
    setError(hasDisallowedInput ? "invalid" : validatePhoneValue(phone, required));
  const placeholder = getPhonePlaceholder(phone.country, t("placeholder"));
  const maxInputLength = getMaxNationalDigits(phone.country) + 6; // digits + grouping characters
  const errorMessage = error
    ? error === "invalid"
      ? t("invalid", { country: countries.find((item) => item.country === phone.country)?.name ?? phone.country })
      : t(error)
    : "";
  const describedBy = [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <div className={`flex min-h-11 w-full items-stretch overflow-hidden ${className}`}>
        <CustomSelect
          value={phone.country}
          onChange={(country) => publish(createPhoneValue(country as CountryCode, phone.nationalNumber))}
          placeholder={t("countryCode")}
          aria-label={t("countryCode")}
          searchable
          searchPlaceholder={t("searchCountry")}
          menuMinWidth={280}
          options={countries.map((item) => ({
            value: item.country,
            label: `${item.name} — ${item.country} +${item.callingCode}`,
            shortLabel: `+${item.callingCode}`,
          }))}
          className="w-[6.5rem] shrink-0"
          buttonClassName="!h-full !min-h-11 !border-0 !border-r !border-[var(--theme-border-subtle)] !bg-transparent !px-3 !py-2 !text-[var(--theme-text-primary)] focus-visible:!outline-byd-red"
        />
        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          required={required}
          value={formatNationalPhone(phone.country, phone.nationalNumber)}
          onChange={(event) => setNationalNumber(event.target.value)}
          onPaste={(event) => {
            const pasted = event.clipboardData.getData("text");
            if (pasted.trim().startsWith("+")) {
              event.preventDefault();
              setNationalNumber(pasted);
            }
          }}
          onBlur={validate}
          maxLength={maxInputLength}
          placeholder={placeholder}
          aria-label={ariaLabel ?? t("number")}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className="min-w-0 flex-1 !border-0 !bg-transparent px-3 py-2 text-[var(--theme-text-primary)] outline-none"
        />
      </div>
      <span className="sr-only" aria-live="polite">
        {t("selectedCountry", {
          country: countries.find((item) => item.country === phone.country)?.name ?? phone.country,
          code: phone.callingCode,
        })}
      </span>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-byd-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
