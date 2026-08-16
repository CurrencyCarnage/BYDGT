"use client";

import { useEffect, useState } from "react";
import { getMaxBookingIsoInTbilisi, getTodayIsoInTbilisi } from "@/lib/date";

export type Availability = {
  min: string;
  max: string;
  slots: string[];
  bookedSlots: Record<string, string[]>;
};

/**
 * Booked date/time slots, refreshed on mount so a slot requested by someone
 * else shows up as unavailable.
 */
export function useAvailability(fallbackSlots: readonly string[]) {
  const [availability, setAvailability] = useState<Availability>(() => ({
    min: getTodayIsoInTbilisi(),
    max: getMaxBookingIsoInTbilisi(),
    slots: [...fallbackSlots],
    bookedSlots: {},
  }));

  useEffect(() => {
    let active = true;
    fetch("/api/availability", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setAvailability((current) => ({
          min: typeof data.min === "string" ? data.min : current.min,
          max: typeof data.max === "string" ? data.max : current.max,
          slots: Array.isArray(data.slots) && data.slots.length ? data.slots : current.slots,
          bookedSlots: data.bookedSlots && typeof data.bookedSlots === "object" ? data.bookedSlots : {},
        }));
      })
      .catch(() => {
        /* keep the optimistic defaults — the API re-validates on submit */
      });
    return () => {
      active = false;
    };
  }, []);

  return availability;
}
