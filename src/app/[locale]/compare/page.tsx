import { getLocale } from "next-intl/server";
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
      <div className="compare-page-header bg-[#1C1E1F] border-b border-white/[0.06]" style={{ paddingTop: "5rem" }}>
        <div className="section-container py-14 md:py-20">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {locale === "ka" ? "შედარება" : "Compare"}
              </p>
            </div>
            <h1 className="text-h2 font-semibold text-white mb-4 leading-[1.15]" style={{ letterSpacing: "-0.02em" }}>
              {locale === "ka" ? "პროდუქტების შედარება" : "Compare Products"}
            </h1>
            <p className="text-body1 text-white/86 font-normal max-w-xl">
              {locale === "ka"
                ? "ეს 3 BYD პროდუქტი შეადარეთ გვერდიგვერდ — ჩამოსაშლელი მენიუდან შეარჩიეთ"
                : "Compare 3 BYD products side by side — use the dropdowns to swap any product"}
            </p>
        </div>
      </div>

      <CompareGrid initialModelIds={initialModelIds} />

    </div>
  );
}
