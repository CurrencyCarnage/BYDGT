import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import HomepageHero from "@/components/ui/HomepageHero";
import ModelShowcase from "@/components/ui/ModelShowcase";
import GuidedModelSelector from "@/components/ui/GuidedModelSelector";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Image from "next/image";

export default async function HomePage() {
  const [tCommon, locale] = await Promise.all([
    getTranslations("common"),
    getLocale(),
  ]);

  const stats = [
    { value: 4,    suffix: "+",    label: locale === "ka" ? "მოდელი"              : "Models Available" },
    { value: 2110, suffix: " km",  label: locale === "ka" ? "მაქს. მანძილი"       : "Max Range" },
    { value: 100,  suffix: "%",    label: locale === "ka" ? "ოფიციალური სერვისი"  : "Official Service" },
    { value: 10,   suffix: "+",    label: locale === "ka" ? "წლის გამოცდილება"    : "Years Experience" },
  ];


  return (
    <>
      {/* ── 1. HERO — full-bleed static ─────────────────────────── */}
      <HomepageHero locale={locale} />

      {/* ── 2. STATS BAR — LIGHT section ────────────────────────── */}
      <div className="bg-[#EFEFEF] border-b border-[#D4D8DB]">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#D4D8DB]">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} className="py-10 px-6 text-center">
                <div className="text-4xl md:text-5xl font-semibold text-[#252728] mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-[11px] text-[#686D71] uppercase tracking-[0.18em] font-medium">
                  {stat.label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. GUIDED MODEL SELECTOR ────────────────────────────── */}
      <GuidedModelSelector locale={locale} />

      {/* ── 5b. MODEL SHOWCASE ──────────────────────────────────────────── */}
      <ModelShowcase locale={locale} />

      {/* ── 5c. MODEL TICKER — repeats as section divider before test drive ── */}
      <div className="border-y border-white/[0.05] overflow-hidden py-3.5 bg-[#252728]">
        <div className="flex animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
          {[0, 1].map((arrIdx) => (
            <div key={arrIdx} className="flex items-center gap-12 px-12">
              {["Sealion 06 DM-i", "Yuan Up DM-i", "Yuan Up EV", "Seal 06 DM-i"].map((name) => (
                <span
                  key={name + arrIdx}
                  className="flex items-center gap-4 text-[11px] text-white/25 uppercase tracking-[0.22em] font-medium"
                >
                  <span className="w-1 h-1 bg-byd-red opacity-70 flex-shrink-0" />
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. CTA BAND ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex items-start md:items-center"
        style={{ minHeight: "clamp(36.25rem, 68vh, 48.75rem)", background: "#000" }}
      >
        {/* Mobile image — car in lower half, text sits at top */}
        <Image
          src="/images/homepage/test-drive-mobile.png"
          alt="BYD test drive"
          fill
          sizes="100vw"
          className="object-cover md:hidden"
          style={{ objectPosition: "center center" }}
          quality={92}
        />
        {/* Desktop image */}
        <Image
          src="/images/homepage/test-drive.jpg"
          alt="BYD test drive"
          fill
          sizes="100vw"
          className="object-cover hidden md:block"
          style={{ objectPosition: "68% 54%" }}
          quality={92}
        />
        {/* Mobile: top-down fade so text at top stays legible over the sky */}
        <div
          className="absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(to bottom, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.60) 28%, rgba(10,8,6,0.18) 52%, transparent 72%)" }}
        />
        {/* Desktop: left-side fade */}
        <div className="absolute inset-0 hidden md:block bg-[linear-gradient(92deg,rgba(14,12,10,0.97)_0%,rgba(14,12,10,0.88)_28%,rgba(14,12,10,0.52)_50%,rgba(14,12,10,0.10)_70%,rgba(14,12,10,0)_100%)]" />

        {/* Content */}
        <div className="relative section-container pt-12 pb-0 md:py-20">
          <ScrollReveal>
            <div className="max-w-lg glass-text p-5 md:p-7">
              {/* Overline */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="h-[2px] w-6 bg-byd-red flex-shrink-0" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-byd-red">
                  {locale === "ka" ? "ტესტ დრაივი" : "Test Drive"}
                </p>
              </div>
              <h2
                className="text-[1.85rem] md:text-[2.6rem] font-semibold text-white leading-[1.1] mb-3"
                style={{ letterSpacing: "-0.025em" }}
              >
                {locale === "ka"
                  ? "მზად ხართ ტესტ დრაივისთვის?"
                  : <>Ready to experience<br className="hidden sm:block" /> the future?</>}
              </h2>
              <p className="text-sm text-white/55 mb-7 font-light leading-relaxed">
                {locale === "ka"
                  ? "დაჯავშნეთ ტესტ დრაივი — სრულიად უფასოდ"
                  : "Book a free test drive at BYD Tbilisi — no commitment required."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-white text-byd-red text-sm font-bold tracking-[0.06em] uppercase hover:bg-[#EFEFEF] transition-all duration-200"
                >
                  {tCommon("bookTestDrive")}
                </Link>
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-white/35 text-white text-sm font-semibold tracking-[0.06em] uppercase hover:bg-white/08 hover:border-white/60 transition-all duration-200"
                >
                  {tCommon("viewAll")}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
