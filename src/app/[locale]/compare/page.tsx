import { getLocale } from "next-intl/server";
import CompareGrid from "@/components/compare/CompareGrid";

export default async function ComparePage() {
  const locale = await getLocale();

  return (
    <div className="bg-byd-dark">

      {/* ── Header — dark strip ── */}
      <div className="bg-[#1C1E1F] border-b border-white/[0.06]" style={{ paddingTop: "80px" }}>
        <div className="section-container py-14 md:py-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {locale === "ka" ? "შედარება" : "Compare"}
              </p>
            </div>
            <h1 className="text-h2 font-semibold text-white mb-4 leading-[1.15]" style={{ letterSpacing: "-0.02em" }}>
              {locale === "ka" ? "მოდელების შედარება" : "Compare Models"}
            </h1>
            <p className="text-body1 text-white/45 font-light max-w-xl">
              {locale === "ka"
                ? "ეს 3 BYD მოდელი შეადარეთ გვერდიგვერდ — ჩამოსაშლელი მენიუდან შეარჩიეთ"
                : "Compare 3 BYD models side by side — use the dropdowns to swap any model"}
            </p>
        </div>
      </div>

      <CompareGrid />

    </div>
  );
}
