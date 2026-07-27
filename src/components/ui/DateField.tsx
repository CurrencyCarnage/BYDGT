"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import {
  formatIsoDateForDisplay,
  parseDisplayDate,
  validateDisplayDate,
  validateIsoDate,
  type DateValidationError,
} from "@/lib/date";

type DateFieldProps = {
  id?: string;
  value: string;
  onChange: (isoValue: string) => void;
  min?: string;
  required?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
};

function formatTypedDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function DateField({
  id,
  value,
  onChange,
  min,
  required,
  className = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: DateFieldProps) {
  const t = useTranslations("formControls.date");
  const generatedId = useId();
  const inputId = id ?? `byd-date-${generatedId}`;
  const errorId = `${inputId}-error`;
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const pendingPublishedValueRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [displayValue, setDisplayValue] = useState(() => formatIsoDateForDisplay(value));
  const [error, setError] = useState<DateValidationError | null>(null);

  useEffect(() => {
    if (pendingPublishedValueRef.current === value) {
      pendingPublishedValueRef.current = null;
      return;
    }
    setDisplayValue(formatIsoDateForDisplay(value));
    setError(null);
  }, [value]);

  useEffect(() => {
    if (!value || validateIsoDate(value, min)) return;
    pendingPublishedValueRef.current = "";
    setDisplayValue("");
    setError("past");
    onChangeRef.current("");
  }, [min, value]);

  const applyDisplayValue = (nextDisplay: string) => {
    setDisplayValue(nextDisplay);
    setError(null);
    if (nextDisplay.length !== 10) {
      pendingPublishedValueRef.current = "";
      onChange("");
      return;
    }
    const validationError = validateDisplayDate(nextDisplay, min);
    const nextIsoValue = validationError ? "" : (parseDisplayDate(nextDisplay) ?? "");
    pendingPublishedValueRef.current = nextIsoValue;
    onChange(nextIsoValue);
  };

  const validate = () => {
    if (!displayValue) {
      setError(required ? "format" : null);
      return;
    }
    setError(validateDisplayDate(displayValue, min));
  };

  const openPicker = () => {
    const nativeInput = nativeInputRef.current;
    if (!nativeInput) return;
    try {
      nativeInput.showPicker();
    } catch {
      nativeInput.focus();
      nativeInput.click();
    }
  };

  const errorMessage = error ? t(error) : "";
  const describedBy = [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={10}
          required={required}
          value={displayValue}
          onChange={(event) => applyDisplayValue(formatTypedDate(event.target.value))}
          onBlur={validate}
          placeholder={t("placeholder")}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          className={`${className} pr-12`}
        />
        <button
          type="button"
          onClick={openPicker}
          aria-label={t("openCalendar")}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-byd-red"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6.5 3.5v3M17.5 3.5v3M4 9h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5Z" />
          </svg>
        </button>
        <input
          ref={nativeInputRef}
          type="date"
          tabIndex={-1}
          aria-hidden="true"
          value={value}
          min={min}
          onChange={(event) => {
            pendingPublishedValueRef.current = event.target.value;
            onChange(event.target.value);
            setDisplayValue(formatIsoDateForDisplay(event.target.value));
            setError(null);
          }}
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            minHeight: 0,
            padding: 0,
            border: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-byd-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
