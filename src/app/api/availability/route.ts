import { NextResponse } from "next/server";
import { getBookedSlots } from "@/lib/bookings";
import { getMaxBookingIsoInTbilisi, getTodayIsoInTbilisi } from "@/lib/date";
import { TIME_SLOTS } from "@/lib/test-drive";

export const dynamic = "force-dynamic";

/** Slots already requested, so booking forms can gray them out. */
export async function GET() {
  try {
    const bookedSlots = await getBookedSlots();
    return NextResponse.json(
      {
        min: getTodayIsoInTbilisi(),
        max: getMaxBookingIsoInTbilisi(),
        slots: TIME_SLOTS,
        bookedSlots,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[availability] Failed to load booked slots:", error);
    return NextResponse.json(
      {
        min: getTodayIsoInTbilisi(),
        max: getMaxBookingIsoInTbilisi(),
        slots: TIME_SLOTS,
        bookedSlots: {},
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
