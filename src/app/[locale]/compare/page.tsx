import { getLocale } from "next-intl/server";
import Image from "next/image";
import CompareGrid from "@/components/compare/CompareGrid";

type CompareSearchParams = {
  models?: string | string[];
};

const toArray = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value.slice(0, 3) : value ? [value] : [];

export default async function ComparePage({
  searchParams,
}: {
  searchParams?: CompareSearchParams;
}) {
  const locale = await getLocale();
  const initialModelIds = toArray(searchParams?.models);

  return (
    <div className="bg-byd-dark">
      {/* ── Header — dark strip ── */}
      <div
        className="compare-page-header compare-page-header--media relative overflow-hidden bg-[#0B0C0D] border-b border-white/[0.06]"
        style={{ paddingTop: "5rem" }}
      >
        {/* Full frame of the header photo — contained, never cropped */}
        <div
          className="relative w-full min-h-[15rem] sm:min-h-[13rem] md:min-h-0"
          style={{ aspectRatio: "1916 / 493" }}
        >
          {/* Middle 60% of the frame: 30% trimmed off the top, 10% off the bottom */}
          <Image
            src="/images/comparepage/compareheader.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 75%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C0D]/88 via-[#0B0C0D]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C0D]/80 via-transparent to-[#0B0C0D]/35" />

          <div className="section-container absolute inset-x-0 bottom-0 z-10 py-8 md:py-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {locale === "ka" ? "შედარება" : "Compare"}
              </p>
            </div>
            <h1
              className="sr-only text-h2 font-semibold text-white mb-4 leading-[1.15] md:not-sr-only"
              style={{ letterSpacing: "-0.02em" }}
            >
              {locale === "ka" ? "პროდუქტების შედარება" : "Compare Products"}
            </h1>
            <p className="text-body1 text-white/86 font-normal max-w-xl">
              {locale === "ka"
                ? "ეს 3 BYD პროდუქტი შეადარეთ გვერდიგვერდ — ჩამოსაშლელი მენიუდან შეარჩიეთ"
                : "Compare 3 BYD products side by side — use the dropdowns to swap any product"}
            </p>
          </div>
        </div>
      </div>

      <CompareGrid initialModelIds={initialModelIds} />
    </div>
  );
}
