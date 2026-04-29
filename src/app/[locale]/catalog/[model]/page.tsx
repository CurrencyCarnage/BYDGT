import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getModelById, getLocalizedValue, formatPrice } from "@/lib/models";
import ModelConfigurator from "@/components/configurator/ModelConfigurator";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default async function ModelDetailPage({
  params,
}: {
  params: { model: string; locale: string };
}) {
  const [model, t, tCommon, locale] = await Promise.all([
    getModelById(params.model),
    getTranslations("model"),
    getTranslations("common"),
    getLocale(),
  ]);

  if (!model) {
    notFound();
  }

  const name = getLocalizedValue(model.name, locale);
  const tagline = getLocalizedValue(model.tagline, locale);

  const specRows = [
    { label: t("range"),        value: `${model.specs.range_km} km` },
    ...(model.specs.electric_range_km
      ? [{ label: t("electricRange"), value: `${model.specs.electric_range_km} km` }]
      : []),
    { label: t("power"),        value: `${model.specs.power_hp} HP` },
    { label: t("acceleration"), value: `${model.specs.acceleration_0_100}s` },
    { label: t("topSpeed"),     value: `${model.specs.top_speed_kmh} km/h` },
    { label: t("battery"),      value: `${model.specs.battery_kwh} kWh` },
  ];

  // Top 4 specs for the highlight strip
  const heroSpecs = specRows.slice(0, 4);

  return (
    <div className="bg-byd-dark">

      {/* ── HERO — full-bleed cinematic, model name pinned bottom-left ── */}
      <section className="relative overflow-hidden" style={{ height: "90vh", minHeight: 560, maxHeight: 900 }}>

        {/* Background: video or image */}
        {model.images.heroVideo ? (
          <video
            src={model.images.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : model.images.hero ? (
          <Image
            src={model.images.hero}
            alt={name}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            quality={92}
          />
        ) : (
          <div className="absolute inset-0 bg-[#1A1C1D]" />
        )}

        {/* Gradients for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#252728] via-[#252728]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#252728]/80 via-[#252728]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#252728]/60 via-transparent to-transparent" />

        {/* Back link — top left */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="section-container">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/80 transition-colors duration-200 uppercase tracking-[0.12em] font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {tCommon("back")}
            </Link>
          </div>
        </div>

        {/* Model info — pinned to bottom-left */}
        <div className="absolute inset-0 flex items-end">
          <div className="section-container w-full pb-12">
            {/* Type badge */}
            <div className="mb-5">
              <span className={model.type === "EV" ? "badge-ev" : "badge-phev"}>
                {model.type}
              </span>
            </div>

            {/* Model name — BYD spec H1 */}
            <h1
              className="text-h1 font-semibold text-white leading-[1.1] mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              {name}
            </h1>

            {/* Tagline */}
            <p className="text-h5 text-white/50 font-light mb-6 max-w-lg leading-[1.5]">
              {tagline}
            </p>

            {/* Price + CTAs inline */}
            <div className="flex flex-wrap items-center gap-5">
              <div>
                <p className="text-[11px] text-white/35 uppercase tracking-[0.18em] mb-1">
                  {tCommon("startingFrom")}
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatPrice(model.basePrice)}
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/booking" className="btn-primary-red" style={{ height: "48px" }}>
                  {tCommon("bookTestDrive")}
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ height: "48px" }}>
                  {tCommon("contactUs")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPEC STRIP — light section, 4 headline numbers ── */}
      <div className="bg-[#EFEFEF] border-b border-[#D4D8DB]">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#D4D8DB]">
            {heroSpecs.map((spec, i) => (
              <ScrollReveal key={spec.label} delay={i * 0.08} className="py-8 px-6 text-center">
                <p className="text-3xl md:text-4xl font-semibold text-[#252728] mb-1">
                  {spec.value}
                </p>
                <p className="text-[11px] text-[#686D71] uppercase tracking-[0.18em] font-medium">
                  {spec.label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONFIGURATOR — dark section ── */}
      <section className="py-section-sm md:py-section-lg bg-[#1C1E1F]">
        <div className="section-container">
          <ScrollReveal className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {t("configurator")}
              </p>
            </div>
            <h2 className="text-h3 font-semibold text-white" style={{ letterSpacing: "-0.02em" }}>
              {locale === "ka" ? "კონფიგურაცია" : "Build Your " + name}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ModelConfigurator model={model} />
          </ScrollReveal>
        </div>
      </section>

      {/* ── FULL SPECS — white section ── */}
      <section className="py-section-sm md:py-section-lg bg-white">
        <div className="section-container">
          <ScrollReveal className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                {t("specsTitle")}
              </p>
            </div>
            <h2 className="text-h3 font-semibold text-[#252728]" style={{ letterSpacing: "-0.02em" }}>
              {locale === "ka" ? "სრული სპეციფიკაციები" : "Full Specifications"}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="border border-[#D4D8DB] overflow-hidden">
              {specRows.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F5F6F7]"
                  } ${i !== specRows.length - 1 ? "border-b border-[#E8EAEB]" : ""}`}
                >
                  <span className="text-sm text-[#686D71] font-medium">{spec.label}</span>
                  <span className="text-sm text-[#252728] font-semibold">{spec.value}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── FEATURES — dark section ── */}
      {model.features.length > 0 && (
        <section className="py-section-sm md:py-section-lg bg-[#252728]">
          <div className="section-container">
            <ScrollReveal className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                  {t("featuresTitle")}
                </p>
              </div>
              <h2 className="text-h3 font-semibold text-white" style={{ letterSpacing: "-0.02em" }}>
                {locale === "ka" ? "მახასიათებლები" : "Key Features"}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06]">
              {model.features.map((feature, i) => (
                <ScrollReveal key={i} delay={(i % 4) * 0.07}>
                  <div className="flex items-start gap-4 p-6 bg-[#252728] hover:bg-[#1C1E1F] transition-colors duration-200">
                    <div className="flex-shrink-0 w-5 h-5 bg-byd-red flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-white/65 leading-relaxed">
                      {getLocalizedValue(feature, locale)}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA — BYD Red ── */}
      <section className="py-20 bg-byd-red">
        <div className="section-container text-center">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-5">
              BYD Tbilisi · GT Group
            </p>
            <h2 className="text-h3 font-semibold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              {locale === "ka" ? "მზად ხართ " + name + "-ით მართვისთვის?" : "Ready to drive the " + name + "?"}
            </h2>
            <p className="text-white/65 mb-8 font-light max-w-md mx-auto">
              {locale === "ka"
                ? "დაჯავშნეთ ტესტ დრაივი — სრულიად უფასოდ"
                : "Book a free test drive at BYD Tbilisi — no commitment required"}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-byd-red text-sm font-bold tracking-[0.06em] uppercase hover:bg-[#EFEFEF] transition-all duration-200"
                style={{ minWidth: "200px" }}
              >
                {tCommon("bookTestDrive")}
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white text-white text-sm font-semibold tracking-[0.06em] uppercase hover:bg-white/10 transition-all duration-200"
                style={{ minWidth: "160px" }}
              >
                {locale === "ka" ? "სხვა მოდელები" : "View All Models"}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
