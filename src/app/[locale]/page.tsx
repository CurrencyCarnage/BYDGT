import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getFeaturedModels } from "@/lib/models";
import ModelCard from "@/components/catalog/ModelCard";
import HeroSlider from "@/components/ui/HeroSlider";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ShowroomSlider from "@/components/ui/ShowroomSlider";

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
      gradient: "bg-gradient-to-br from-[#0F1014] via-[#111318] to-[#0A0A0F]",
      accentColor: "rgba(93,99,104,0.5)",
      href: "/catalog/sealion-06-dmi",
      image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
      video: "/images/models/sealion-06-dmi/sealion-6-promo.mp4",
      specs: [
        { label: locale === "ka" ? "სიმძლავრე" : "Power", value: "197 HP" },
        { label: locale === "ka" ? "მანძილი" : "Range", value: "1,200 km" },
        { label: "0-100", value: "7.5s" },
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
      gradient: "bg-gradient-to-br from-[#0F0A1A] via-[#1A0F20] to-[#0A0A0F]",
      accentColor: "rgba(127,133,137,0.4)",
      href: "/catalog/seal-06-dmi",
      image: "/images/models/seal-06-dmi/hero.jpg",
      specs: [
        { label: locale === "ka" ? "სიმძლავრე" : "Power", value: "179 HP" },
        { label: locale === "ka" ? "მანძილი" : "Range", value: "1,150 km" },
        { label: "0-100", value: "7.9s" },
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
      gradient: "bg-gradient-to-br from-[#051A10] via-[#0A1F15] to-[#0A0A0F]",
      accentColor: "rgba(93,99,104,0.35)",
      href: "/catalog/yuan-up-ev",
      image: "/images/models/yuan-up-ev/hero.jpg",
      specs: [
        { label: locale === "ka" ? "სიმძლავრე" : "Power", value: "177 HP" },
        { label: locale === "ka" ? "მანძილი" : "Range", value: "401 km" },
        { label: locale === "ka" ? "ბატარეა" : "Battery", value: "45.1 kWh" },
      ],
    },
  ];

  const stats = [
    {
      value: 4,
      suffix: "+",
      label: locale === "ka" ? "მოდელი" : "Models Available",
    },
    {
      value: 1200,
      suffix: " km",
      label: locale === "ka" ? "მაქს. მანძილი" : "Max Range",
    },
    {
      value: 100,
      suffix: "%",
      label: locale === "ka" ? "ოფიციალური სერვისი" : "Official Service",
    },
    {
      value: 10,
      suffix: "+",
      label: locale === "ka" ? "წლის გამოცდილება" : "Years Experience",
    },
  ];

  const features = [
    {
      icon: "⚡",
      title: locale === "ka" ? "ელ. ინფრასტრუქტურა" : "EV Infrastructure",
      desc:
        locale === "ka"
          ? "მუდმივი მხარდაჭერა საქართველოში"
          : "Full support network in Georgia",
    },
    {
      icon: "🛡️",
      title: locale === "ka" ? "ოფიციალური გარანტია" : "Official Warranty",
      desc:
        locale === "ka"
          ? "BYD-ის ავტორიზებული სერვის"
          : "BYD authorized service center",
    },
    {
      icon: "🔋",
      title: locale === "ka" ? "Blade ბატარეა" : "Blade Battery",
      desc:
        locale === "ka"
          ? "მსოფლიოში ყველაზე უსაფრთხო"
          : "World safest EV battery tech",
    },
    {
      icon: "🌍",
      title: locale === "ka" ? "გლობ. ლიდერი" : "Global Leader",
      desc:
        locale === "ka"
          ? "2024 წ. გაყიდვებში #1"
          : "#1 EV brand by sales in 2024",
    },
  ];

  return (
    <>
      <HeroSlider
        slides={heroSlides}
        locale={locale}
        heroTitle={t("heroTitle")}
        heroCta={t("heroCta")}
        contactLabel={tCommon("contactUs")}
      />

      {/* STATS BAR */}
      <div className="bg-bg-secondary border-y border-white/[0.05]">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
            {stats.map((stat, i) => (
              <ScrollReveal
                key={stat.label}
                delay={i * 0.1}
                className="py-8 px-6 text-center"
              >
                <div
                  className="text-3xl md:text-4xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-source-sans)" }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p
                  className="text-xs text-white/40 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-source-sans)" }}
                >
                  {stat.label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* WHY GT GROUP */}
      <section className="relative py-section-sm md:py-section-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E2330] to-[#1A1E28]" />
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#B8BEC8]/[0.06] to-transparent" />
        {/* Smooth fade into surrounding sections */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#1A1E28] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A1E28] to-transparent pointer-events-none" />
        <div className="relative section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p
                className="text-xs text-accent uppercase tracking-[0.2em] mb-4"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {locale === "ka" ? "ჩვენ შესახებ" : "About GT Group"}
              </p>
              <h2
                className="text-3xl md:text-display font-bold text-white mb-6"
                style={{
                  fontFamily: "var(--font-source-sans)",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("brandTitle")}
              </h2>
              <p
                className="text-white/55 text-lg leading-relaxed mb-8 font-light"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {t("brandText")}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-[#1A1E28] font-semibold px-7 py-3.5 rounded-button hover:bg-white/90 transition-all duration-200"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {t("brandCta")}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1}>
                  <div className="p-5 rounded-card bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300">
                    <span className="text-2xl mb-3 block">{item.icon}</span>
                    <h3
                      className="text-sm font-semibold text-white mb-1"
                      style={{ fontFamily: "var(--font-source-sans)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-xs text-white/45 font-light leading-relaxed"
                      style={{ fontFamily: "var(--font-source-sans)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SHOWROOM GALLERY */}
      <section className="py-section-sm md:py-section-lg">
        <ScrollReveal>
          <ShowroomSlider
            label={locale === "ka" ? "ჩვენი სალონი" : "Our Showroom"}
            heading={
              locale === "ka" ? "GT Group — თბილისი" : "GT Group — Tbilisi"
            }
            slides={[
              {
                src: "/images/showroom/homepage-slide-atto.jpg",
                alt: "GT Group showroom — BYD Atto",
              },
              {
                src: "/images/showroom/homepage-slide-atto2.jpg",
                alt: "GT Group showroom — BYD Atto 2",
              },
              {
                src: "/images/showroom/homepage-slide-dolphin.jpg",
                alt: "GT Group showroom — BYD Dolphin",
              },
              {
                src: "/images/showroom/homepage-slide-seal.jpg",
                alt: "GT Group showroom — BYD Seal",
              },
              {
                src: "/images/showroom/homepage-slide-sealion.jpg",
                alt: "GT Group showroom — BYD Sealion",
              },
            ]}
          />
        </ScrollReveal>
      </section>

      {/* SCROLLING TICKER */}
      <div className="border-y border-white/[0.05] overflow-hidden py-3 bg-bg-secondary">
        <div
          className="flex animate-ticker whitespace-nowrap"
          style={{ width: "max-content" }}
        >
          {[0, 1].map((arrIdx) => (
            <div key={arrIdx} className="flex items-center gap-12 px-12">
              {[
                "Sealion 06 DM-i",
                "Yuan Up DM-i",
                "Yuan Up EV",
                "Seal 06 DM-i",
              ].map((name) => (
                <span
                  key={name + arrIdx}
                  className="flex items-center gap-4 text-xs text-white/30 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-source-sans)" }}
                >
                  <span className="w-1 h-1 rounded-full bg-accent opacity-60" />
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED MODELS */}
      <section className="py-section-sm md:py-section-lg">
        <div className="section-container">
          <ScrollReveal className="text-center mb-14">
            <p
              className="text-xs text-white/40 uppercase tracking-[0.2em] mb-4"
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              {locale === "ka" ? "ჩვენი ავტომობილები" : "Our Lineup"}
            </p>
            <h2
              className="text-3xl md:text-display font-bold text-white mb-4"
              style={{
                fontFamily: "var(--font-source-sans)",
                letterSpacing: "-0.02em",
              }}
            >
              {t("featuredTitle")}
            </h2>
            <p
              className="text-white/50 max-w-xl mx-auto font-light"
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
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

          <ScrollReveal delay={0.3} className="text-center mt-10">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/50 px-7 py-3 rounded-button transition-all duration-200"
              style={{
                fontFamily: "var(--font-source-sans)",
                letterSpacing: "0.04em",
              }}
            >
              {tCommon("viewAll")}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-24 text-center">
        <div className="section-container">
          <ScrollReveal>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{
                fontFamily: "var(--font-source-sans)",
                letterSpacing: "-0.02em",
              }}
            >
              {locale === "ka"
                ? "მზად ხართ ტესტ დრაივისთვის?"
                : "Ready to experience the future?"}
            </h2>
            <p
              className="text-white/45 mb-10 font-light text-lg"
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              {locale === "ka"
                ? "დაჯავშნეთ ტესტ დრაივი — სრულიად უფასოდ"
                : "Book a free test drive — no commitment required"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 bg-accent text-[#1A1E28] font-semibold px-8 py-4 rounded-button hover:bg-accent/90 hover:shadow-glow-lg transition-all duration-200"
                style={{
                  fontFamily: "var(--font-source-sans)",
                  letterSpacing: "0.02em",
                }}
              >
                {tCommon("bookTestDrive")}
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 px-8 py-4 rounded-button transition-all duration-200"
                style={{ fontFamily: "var(--font-source-sans)" }}
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
