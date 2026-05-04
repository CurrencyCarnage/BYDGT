import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import HomepageHero from "@/components/ui/HomepageHero";
import ModelShowcase from "@/components/ui/ModelShowcase";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Image from "next/image";

export default async function HomePage() {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
    getLocale(),
  ]);

  const stats = [
    { value: 4,    suffix: "+",    label: locale === "ka" ? "მოდელი"              : "Models Available" },
    { value: 2110, suffix: " km",  label: locale === "ka" ? "მაქს. მანძილი"       : "Max Range" },
    { value: 100,  suffix: "%",    label: locale === "ka" ? "ოფიციალური სერვისი"  : "Official Service" },
    { value: 10,   suffix: "+",    label: locale === "ka" ? "წლის გამოცდილება"    : "Years Experience" },
  ];

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: locale === "ka" ? "ელ. ინფრასტრუქტურა" : "EV Infrastructure",
      desc:  locale === "ka" ? "მუდმივი მხარდაჭერა საქართველოში" : "Full support network across Georgia",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: locale === "ka" ? "ოფიციალური გარანტია" : "Official Warranty",
      desc:  locale === "ka" ? "BYD-ის ავტორიზებული სერვისი"     : "BYD authorized service center",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
        </svg>
      ),
      title: locale === "ka" ? "Blade ბატარეა" : "Blade Battery",
      desc:  locale === "ka" ? "მსოფლიოში ყველაზე უსაფრთხო"   : "World's safest EV battery tech",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      ),
      title: locale === "ka" ? "გლობ. ლიდერი" : "Global Leader",
      desc:  locale === "ka" ? "2024 წ. გაყიდვებში #1"          : "#1 EV brand by global sales 2024",
    },
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

      {/* ── 3. BRAND / WHY BYD — WHITE section ─────────────────── */}
      <section className="py-section-sm md:py-section-lg bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <ScrollReveal direction="left">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                  {locale === "ka" ? "ჩვენ შესახებ" : "About GT Group"}
                </p>
              </div>
              <h2 className="text-h2 font-semibold text-[#252728] mb-6 leading-[1.15]" style={{ letterSpacing: "-0.02em" }}>
                {t("brandTitle")}
              </h2>
              <p className="text-body1 text-[#686D71] leading-relaxed mb-8 font-light">
                {t("brandText")}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#252728] text-white text-sm font-semibold tracking-[0.06em] uppercase hover:bg-[#1C1E1F] transition-all duration-200"
              >
                {t("brandCta")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </ScrollReveal>

            {/* Right — feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#E8EAEB]">
              {features.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.08}>
                  <div className="p-6 bg-white hover:bg-[#F8F8F8] transition-colors duration-200 group">
                    <span className="text-byd-red group-hover:text-[#A5080E] transition-colors duration-200 block mb-4">
                      {item.icon}
                    </span>
                    <h3 className="text-sm font-semibold text-[#252728] mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#686D71] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

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
        className="relative overflow-hidden flex items-center"
        style={{ minHeight: "clamp(580px, 68vh, 780px)", background: "#000" }}
      >
        <Image
          src="/images/homepage/test-drive.jpg"
          alt="BYD test drive"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "68% 54%" }}
          quality={92}
        />
        {/* Left fade — keeps text legible */}
        <div className="absolute inset-0 bg-[linear-gradient(92deg,rgba(14,12,10,0.97)_0%,rgba(14,12,10,0.88)_28%,rgba(14,12,10,0.52)_50%,rgba(14,12,10,0.10)_70%,rgba(14,12,10,0)_100%)]" />

        {/* Content */}
        <div className="relative section-container py-14 md:py-20">
          <ScrollReveal>
            <div className="max-w-lg">
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
