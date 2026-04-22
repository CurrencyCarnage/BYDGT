import { getLocale } from "next-intl/server";
import CompareGrid from "@/components/compare/CompareGrid";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default async function ComparePage() {
  const locale = await getLocale();

  return (
    <div className="pt-24 md:pt-32 pb-section-sm md:pb-section-lg">
      <div className="section-container">
        <ScrollReveal className="mb-12">
          <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "var(--font-source-sans)" }}>
            {locale === "ka" ? "შედარება" : "Compare"}
          </p>
          <h1 className="text-3xl md:text-display font-bold text-white mb-3" style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "-0.02em" }}>
            {locale === "ka" ? "მოდელების შედარება" : "Compare Models"}
          </h1>
          <p className="text-text-secondary font-light" style={{ fontFamily: "var(--font-source-sans)" }}>
            {locale === "ka"
              ? "ვერსიები გადართეთ ჩანართებით, შემდეგ 3-მდე BYD მოდელი შეადარეთ"
              : "Switch powertrain versions with the tabs, then compare up to 3 BYD models side by side"}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <CompareGrid />
        </ScrollReveal>
      </div>
    </div>
  );
}
