import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getFeaturedModels } from "@/lib/models";
import ModelCard from "@/components/catalog/ModelCard";
import HeroSlider from "@/components/ui/HeroSlider";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ShowroomSlider from "@/components/ui/ShowroomSlider";
import Image from "next/image";

export default async function HomePage() {
  const [t, tCommon, locale, featuredModels] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
    getLocale(),
    getFeaturedModels(),
  ]);

  const heroSlides = [
    {
      id: "sealion-06-dmi",
      modelName: "Sealion 06 DM-i",
      tagline:
        locale === "ka"
          ? "მართეთ გზა ინტელექტუალური ჰიბრიდული ძალით"
          : "Command the road with intelligent hybrid power",
      type: "PHEV" as const,
      gradient: "bg-gradient-to-br from-[#1A1C1D] via-[#252728] to-[#1A1C1D]",
      accentColor: "rgba(215,12,25,0.08)",
      href: "/catalog/sealion-06-dmi",
      image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
      video: "/images/models/sealion-06-dmi/sealion-6-promo.mp4",
      specs: [
        { label: locale === "ka" ? "სიმძლავრე" : "Power",  value: "197 HP" },
        { label: locale === "ka" ? "მანძილი"  : "Range",   value: "1,200 km" },
        { label: "0–100",                                   value: "7.5s" },
      ],
    },
    {
      id: "seal-06-dmi",
      modelName: "Seal 06 DM-i",
      tagline:
        locale === "ka"
          ? "ელეგანტურობა ხვდება ეფექტურობას"
          : "Elegance meets efficiency — redefine driving",
      type: "PHEV" as const,
      gradient: "bg-gradient-to-br from-[#1A1C1D] via-[#252728] to-[#1A1C1D]",
      accentColor: "rgba(104,109,113,0.15)",
      href: "/catalog/seal-06-dmi",
      image: "/images/models/seal-06-dmi/hero.jpg",
      specs: [
        { label: locale === "ka" ? "სიმძლავრე" : "Power",  value: "179 HP" },
        { label: locale === "ka" ? "მანძილი"  : "Range",   value: "1,150 km" },
        { label: "0–100",                                   value: "7.9s" },
      ],
    },
    {
      id: "yuan-up-ev",
      modelName: "Yuan Up EV",
      tagline:
        locale === "ka"
          ? "სუფთა ელექტრო თავისუფლება"
          : "Pure electric freedom for the modern city",
      type: "EV" as const,
      gradient: "bg-gradient-to-br from-[#1A1C1D] via-[#252728] to-[#1A1C1D]",
      accentColor: "rgba(120,178,84,0.08)",
      href: "/catalog/yuan-up-ev",
      image: "/images/models/yuan-up-ev/hero.jpg",
      specs: [
        { label: locale === "ka" ? "სიმძლავრე" : "Power",   value: "177 HP" },
        { label: locale === "ka" ? "მანძილი"  : "Range",    value: "401 km" },
        { label: locale === "ka" ? "ბატარეა"  : "Battery",  value: "45.1 kWh" },
      ],
    },
  ];

  const stats = [
    { value: 4,    suffix: "+",    label: locale === "ka" ? "მოდელი"              : "Models Available" },
    { value: 1200, suffix: " km",  label: locale === "ka" ? "მაქს. მანძილი"       : "Max Range" },
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
      {/* ── 1. HERO — full-bleed dark ───────────────────────────── */}
      <HeroSlider
        slides={heroSlides}
        locale={locale}
        heroTitle={t("heroTitle")}
        heroCta={t("heroCta")}
        contactLabel={tCommon("contactUs")}
      />

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

      {/* ── 4. SHOWROOM GALLERY — dark section ──────────────────── */}
      <section>
        <ScrollReveal>
          <ShowroomSlider
            label={locale === "ka" ? "ჩვენი სალონი" : "Our Showroom"}
            heading={locale === "ka" ? "GT Group — თბილისი" : "GT Group — Tbilisi"}
            slides={[
              { src: "/images/showroom/homepage-slide-atto.jpg",    alt: "GT Group showroom — BYD Atto" },
              { src: "/images/showroom/homepage-slide-atto2.jpg",   alt: "GT Group showroom — BYD Atto 2" },
              { src: "/images/showroom/homepage-slide-dolphin.jpg", alt: "GT Group showroom — BYD Dolphin" },
              { src: "/images/showroom/homepage-slide-seal.jpg",    alt: "GT Group showroom — BYD Seal" },
              { src: "/images/showroom/homepage-slide-sealion.jpg", alt: "GT Group showroom — BYD Sealion" },
            ]}
          />
        </ScrollReveal>
      </section>

      {/* ── 5. MODEL TICKER — dark band ─────────────────────────── */}
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

      {/* ── 6. FEATURED MODELS — LIGHT gray section ─────────────── */}
      <section className="py-section-sm md:py-section-lg bg-[#F5F6F7]">
        <div className="section-container">
          <ScrollReveal className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {locale === "ka" ? "ჩვენი ავტომობილები" : "Our Lineup"}
              </p>
            </div>
            <h2 className="text-h2 font-semibold text-[#252728] mb-4 leading-[1.15]" style={{ letterSpacing: "-0.02em" }}>
              {t("featuredTitle")}
            </h2>
            <p className="text-body1 text-[#686D71] max-w-xl font-light">
              {t("featuredSubtitle")}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredModels.map((model, i) => (
              <ScrollReveal key={model.id} delay={i * 0.12}>
                <ModelCard model={model} locale={locale} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3} className="mt-10">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#252728] text-[#252728] text-sm font-semibold tracking-[0.06em] uppercase hover:bg-[#252728] hover:text-white transition-all duration-200"
            >
              {tCommon("viewAll")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── 7. CTA BAND — Full BYD Red with test drive imagery ─── */}
      {/* Models are directly above this section as requested */}
      <section className="relative py-28 bg-byd-red overflow-hidden">
        {/* Test drive photo background — subtle, darkened */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-multiply"
          style={{ backgroundImage: "url('/images/testdrive/img1.jpg')" }}
        />
        {/* Red gradient overlay to keep text legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-byd-red via-byd-red/90 to-byd-red/70" />

        <div className="relative section-container">
          <ScrollReveal>
            {/* BYD wordmark — white, centred above heading */}
            <div className="flex justify-center mb-6">
              <Image
                src="/byd-wordmark.svg"
                alt="BYD"
                width={104}
                height={22}
                className="h-[22px] w-auto"
              />
            </div>
            {/* Location stamp */}
            <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase text-center mb-6">
              BYD Tbilisi · თბილისი
            </p>
            <h2 className="text-h2 font-semibold text-white mb-4 text-center leading-[1.15]" style={{ letterSpacing: "-0.02em" }}>
              {locale === "ka"
                ? "მზად ხართ ტესტ დრაივისთვის?"
                : "Ready to experience the future?"}
            </h2>
            <p className="text-body1 text-white/70 mb-10 font-light text-center max-w-xl mx-auto">
              {locale === "ka"
                ? "დაჯავშნეთ ტესტ დრაივი — სრულიად უფასოდ"
                : "Book a free test drive at BYD Tbilisi — no commitment required"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-byd-red text-sm font-bold tracking-[0.06em] uppercase hover:bg-[#EFEFEF] transition-all duration-200"
                style={{ minWidth: "200px", justifyContent: "center" }}
              >
                {tCommon("bookTestDrive")}
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white text-sm font-semibold tracking-[0.06em] uppercase hover:bg-white/10 transition-all duration-200"
                style={{ minWidth: "160px", justifyContent: "center" }}
              >
                {tCommon("viewAll")}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
