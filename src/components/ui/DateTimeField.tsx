"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  formatIsoDateForDisplay,
  getMonthMatrix,
  getTodayIsoInTbilisi,
  validateIsoDate,
} from "@/lib/date";

type DateTimeFieldProps = {
  id?: string;
  date: string;
  time: string;
  onDateChange: (isoDate: string) => void;
  onTimeChange: (timeSlot: string) => void;
  slots: readonly string[];
  /** ISO date → time slots already taken. */
  bookedSlots?: Record<string, string[]>;
  min: string;
  max: string;
  required?: boolean;
  showError?: boolean;
  "aria-describedby"?: string;
};

const monthKey = (iso: string) => iso.slice(0, 7);
const startOfMonth = (iso: string) => `${monthKey(iso)}-01`;

function shiftMonth(iso: string, delta: number) {
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(5, 7));
  const next = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

export default function DateTimeField({
  id,
  date,
  time,
  onDateChange,
  onTimeChange,
  slots,
  bookedSlots = {},
  min,
  max,
  required = true,
  showError = false,
  "aria-describedby": ariaDescribedBy,
}: DateTimeFieldProps) {
  const locale = useLocale();
  const t = useTranslations("formControls.dateTime");
  const generatedId = useId();
  const fieldId = id ?? `byd-datetime-${generatedId}`;
  const today = getTodayIsoInTbilisi();

  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(date || min || today));

  useEffect(() => {
    if (date) setVisibleMonth(startOfMonth(date));
  }, [date]);

  const cells = useMemo(() => {
    const year = Number(visibleMonth.slice(0, 4));
    const month = Number(visibleMonth.slice(5, 7));
    return getMonthMatrix(year, month);
  }, [visibleMonth]);

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }),
    [locale],
  );
  const dayFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }),
    [locale],
  );
  const weekdays = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
    // 2024-01-01 is a Monday.
    return Array.from({ length: 7 }, (_, index) =>
      formatter.format(new Date(Date.UTC(2024, 0, 1 + index))),
    );
  }, [locale]);

  const takenForDate = date ? bookedSlots[date] ?? [] : [];
  const canGoBack = monthKey(visibleMonth) > monthKey(min);
  const canGoForward = monthKey(visibleMonth) < monthKey(max);
  const isDateSelectable = (iso: string) => validateIsoDate(iso, min, max);
  const allSlotsTaken = (iso: string) => {
    const taken = bookedSlots[iso] ?? [];
    return slots.length > 0 && slots.every((slot) => taken.includes(slot));
  };

  const selectDate = (iso: string) => {
    if (!isDateSelectable(iso)) return;
    // Clicking the selected day clears it — the time goes with it, since a
    // slot without a date means nothing.
    if (iso === date) {
      onDateChange("");
      if (time) onTimeChange("");
      return;
    }
    onDateChange(iso);
    if (time && (bookedSlots[iso] ?? []).includes(time)) onTimeChange("");
  };

  const selectTime = (slot: string) => {
    onTimeChange(slot === time ? "" : slot);
  };

  const summary = date
    ? `${formatIsoDateForDisplay(date)}${time ? ` · ${time}` : ""}`
    : t("empty");
  const missingDate = showError && required && !date;
  const missingTime = showError && required && Boolean(date) && !time;
  const errorId = `${fieldId}-error`;
  const describedBy = [ariaDescribedBy, missingDate || missingTime ? errorId : undefined]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="byd-datetime" id={fieldId} aria-describedby={describedBy}>
      {/* Selection summary — mirrors a normal text field so the value is always visible */}
      <div
        className={`byd-datetime-summary ${date ? "is-filled" : ""} ${
          missingDate || missingTime ? "is-invalid" : ""
        }`}
        aria-live="polite"
      >
        <span className="byd-datetime-summary-label">{t("summaryLabel")}</span>
        <span className="byd-datetime-summary-value">{summary}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
          <path d="M6.5 3.5v3M17.5 3.5v3M4 9h16M5.5 5h13A1.5 1.5 0 0 1 20 6.5v12a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5Z" />
        </svg>
      </div>

      <div className="byd-datetime-panel">
        {/* ── Calendar ── */}
        <div className="byd-datetime-calendar">
          <div className="byd-datetime-monthbar">
            <button
              type="button"
              onClick={() => canGoBack && setVisibleMonth(shiftMonth(visibleMonth, -1))}
              disabled={!canGoBack}
              aria-label={t("previousMonth")}
              className="byd-datetime-navbutton"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="byd-datetime-month" aria-live="polite">
              {monthFormatter.format(new Date(`${visibleMonth}T00:00:00Z`))}
            </p>
            <button
              type="button"
              onClick={() => canGoForward && setVisibleMonth(shiftMonth(visibleMonth, 1))}
              disabled={!canGoForward}
              aria-label={t("nextMonth")}
              className="byd-datetime-navbutton"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="byd-datetime-weekdays" aria-hidden="true">
            {weekdays.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className="byd-datetime-grid" role="group" aria-label={t("dateLabel")}>
            {cells.map((cell) => {
              const selectable = cell.inMonth && isDateSelectable(cell.iso);
              const full = selectable && allSlotsTaken(cell.iso);
              const isSelected = cell.iso === date;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => selectDate(cell.iso)}
                  disabled={!selectable || full}
                  aria-pressed={isSelected}
                  aria-label={`${dayFormatter.format(new Date(`${cell.iso}T00:00:00Z`))}${full ? ` — ${t("fullyBooked")}` : ""}`}
                  title={full ? t("fullyBooked") : isSelected ? t("clearSelection") : undefined}
                  className={[
                    "byd-datetime-day",
                    cell.inMonth ? "" : "is-outside",
                    isSelected ? "is-selected" : "",
                    cell.iso === today ? "is-today" : "",
                    full ? "is-full" : "",
                  ].join(" ")}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Time slots ── */}
        <div className="byd-datetime-slots">
          <p className="byd-datetime-slots-title">{t("timeLabel")}</p>
          <div className="byd-datetime-slots-scroll" role="group" aria-label={t("timeLabel")}>
            {slots.map((slot) => {
              const taken = takenForDate.includes(slot);
              const disabled = !date || taken;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => !disabled && selectTime(slot)}
                  disabled={disabled}
                  aria-pressed={slot === time}
                  aria-label={taken ? `${slot} — ${t("slotTaken")}` : slot}
                  title={taken ? t("slotTaken") : slot === time ? t("clearSelection") : undefined}
                  className={[
                    "byd-datetime-slot",
                    slot === time ? "is-selected" : "",
                    taken ? "is-taken" : "",
                  ].join(" ")}
                >
                  <span>{slot}</span>
                  {taken && <span className="byd-datetime-slot-note">{t("slotTakenShort")}</span>}
                </button>
              );
            })}
          </div>
          {!date && <p className="byd-datetime-hint">{t("pickDateFirst")}</p>}
        </div>
      </div>

      {(missingDate || missingTime) && (
        <p id={errorId} role="alert" className="byd-datetime-error">
          {missingDate ? t("dateRequired") : t("timeRequired")}
        </p>
      )}
    </div>
  );
}
