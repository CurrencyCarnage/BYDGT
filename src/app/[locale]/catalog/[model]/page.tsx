import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { getModelById, getLocalizedValue, getOfficialVariants, formatPrice } from "@/lib/models";
import { getVariantDetails } from "@/lib/types";
import ModelPurchaseExperience from "@/components/configurator/ModelPurchaseExperience";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";


export const dynamic = "force-dynamic";

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

  const retiredFeatureItems = model.features;

  const name = getLocalizedValue(model.name, locale);
  const tagline = getLocalizedValue(model.tagline, locale);
  const bookingHref = `/booking?version=${encodeURIComponent(model.id)}`;


  // Best-trim specs for the highlight strip — advertise the highest figures
  const officialTrims = getOfficialVariants(model);
  const bestSpecs = officialTrims.reduce((best, variant) => {
    const merged = getVariantDetails(model, variant).specs;
    return {
      range_km: Math.max(best.range_km, merged.range_km ?? 0),
      electric_range_km: Math.max(best.electric_range_km, merged.electric_range_km ?? 0),
      power_kw: Math.max(best.power_kw, merged.power_kw ?? 0),
      acceleration_0_100: best.acceleration_0_100 === 0 ? merged.acceleration_0_100 : Math.min(best.acceleration_0_100, merged.acceleration_0_100),
      top_speed_kmh: Math.max(best.top_speed_kmh, merged.top_speed_kmh ?? 0),
    };
  }, { range_km: model.specs.range_km, electric_range_km: model.specs.electric_range_km ?? 0, power_kw: model.specs.power_kw ?? model.specs.power_hp ?? 0, acceleration_0_100: model.specs.acceleration_0_100, top_speed_kmh: model.specs.top_speed_kmh ?? 0 });

  const isKa = locale === "ka";
  const hasBetterRange = bestSpecs.range_km > model.specs.range_km;
  const hasBetterPower = bestSpecs.power_kw > (model.specs.power_kw ?? model.specs.power_hp ?? 0);
  const hasBetterAccel = bestSpecs.acceleration_0_100 < model.specs.acceleration_0_100;

  const heroSpecs = [
    { label: model.specs.range_label ?? t("range"), value: bestSpecs.range_km, suffix: " km", upTo: hasBetterRange },
    ...(bestSpecs.electric_range_km > 0
      ? [{ label: t("electricRange"), value: bestSpecs.electric_range_km, suffix: " km", upTo: bestSpecs.electric_range_km > (model.specs.electric_range_km ?? 0) }]
      : []),
    { label: t("power"), value: bestSpecs.power_kw, suffix: " kW", upTo: hasBetterPower },
    { label: t("acceleration"), value: bestSpecs.acceleration_0_100, suffix: "s", decimals: 1, upTo: hasBetterAccel },
    ...(bestSpecs.top_speed_kmh > 0 ? [{ label: t("topSpeed"), value: bestSpecs.top_speed_kmh, suffix: " km/h", upTo: false }] : []),
  ].slice(0, 4);

  return (
    <div className="bg-byd-dark">

      {/* ── HERO — full-bleed cinematic, model name pinned bottom-left ── */}
      <section className="model-detail-hero relative overflow-hidden" style={{ height: "90vh", minHeight: "35rem", maxHeight: "56.25rem" }}>

        {/* Background: video or image */}
        {model.images.heroVideo ? (
          <video
            src={model.images.heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={model.images.hero || undefined}
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
            unoptimized
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
          <div className="section-container w-full pb-6 md:pb-12">
            <div className="p-4 md:p-7 inline-block">
            {/* Type badge */}
            <div className="mb-3 md:mb-5">
              <span className={model.type === "EV" ? "badge-ev" : "badge-phev"}>
                {model.type}
              </span>
            </div>

            {/* Model name */}
            <h1
              className="text-[clamp(1.75rem,7.5vw,2.5rem)] md:text-h1 font-semibold text-white leading-[1.08] mb-2 md:mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              {name}
            </h1>

            {/* Tagline */}
            <p className="text-[clamp(0.85rem,3.8vw,1.1rem)] md:text-h5 text-white/50 font-light mb-4 md:mb-6 max-w-lg leading-[1.4]">
              {tagline}
            </p>

            {/* Price + CTAs */}
            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-5">
              <div>
                <p className="text-[11px] text-white/35 uppercase tracking-[0.18em] mb-1">
                  {tCommon("startingFrom")}
                </p>
                <p className="text-2xl md:text-3xl font-bold text-white">
                    {model.priceStatus === "contact" ? "Contact for pricing" : formatPrice(model.basePrice ?? 0)}
                </p>
              </div>
              <div className="model-hero-cta-group grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:gap-3">
                <Link href={bookingHref} className="model-hero-cta btn-primary-red justify-center px-3 text-[0.78rem] leading-tight sm:text-[clamp(0.6rem,2.8vw,0.875rem)] md:text-sm" style={{ minHeight: "2.75rem" }}>
                  {tCommon("bookTestDrive")}
                </Link>

                <Link href="/contact" className="model-hero-cta btn-secondary justify-center px-3 text-[0.78rem] leading-tight sm:text-[clamp(0.6rem,2.8vw,0.875rem)] md:text-sm" style={{ minHeight: "2.75rem" }}>
                  {tCommon("contactUs")}
                </Link>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPEC STRIP — best-trim headline numbers ── */}
      <div className="spec-strip-section bg-[#EFEFEF] border-b border-[#D4D8DB]" data-header-theme="light">
        <div className="section-container">
          <div className={`grid grid-cols-2 ${heroSpecs.length >= 4 ? "md:grid-cols-4" : heroSpecs.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} divide-x spec-strip-divider`}>
            {heroSpecs.map((spec, i) => (
              <ScrollReveal key={spec.label} delay={i * 0.08} className="py-8 px-6 text-center">
                <p className="text-3xl md:text-4xl font-semibold spec-strip-value mb-1">
                  {spec.upTo && !isKa && <span className="text-xs font-medium spec-strip-upto mr-1">up to</span>}
                  <AnimatedCounter
                    value={spec.value}
                    suffix={spec.suffix}
                    decimals={"decimals" in spec ? spec.decimals : 0}
                  />
                  {spec.upTo && isKa && <span className="text-xs font-medium spec-strip-upto ml-1">-მდე</span>}
                </p>
                <p className="text-[11px] spec-strip-label uppercase tracking-[0.18em] font-medium">
                  {spec.label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <ModelPurchaseExperience model={model} locale={locale} />

      {/* ── FEATURES — dark section ── */}
      {retiredFeatureItems.length > 0 && false && (
        <section className="model-features-section py-section-sm md:py-section-lg bg-[#F7F8F8]" data-header-theme="light">
          <div className="section-container">
            <ScrollReveal className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-byd-red flex-shrink-0" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">
                  {t("featuresTitle")}
                </p>
              </div>
              <h2 className="text-h5 md:text-h3 font-semibold text-[#252728]" style={{ letterSpacing: "-0.02em" }}>
                {locale === "ka" ? "მახასიათებლები" : "Key Features"}
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {retiredFeatureItems.map((feature, i) => (
                <ScrollReveal key={i} delay={(i % 4) * 0.07}>
                  <div className="flex items-start gap-4 p-6 content-surface-soft hover:border-[#BFC5C8] transition-colors duration-200">
                    <div className="flex-shrink-0 w-5 h-5 bg-byd-red flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-white leading-relaxed">
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
      <section className="model-detail-cta py-20 bg-byd-red">
        <div className="section-container text-center">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-[0.3em] text-white/50 uppercase mb-5">
              BYD Tbilisi · GT Group
            </p>
            <h2 className="text-h5 md:text-h3 font-semibold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
              {locale === "ka" ? "მზად ხართ " + name + "-ისთვის?" : "Ready to drive the " + name + "?"}
            </h2>
            <p className="text-white/65 mb-8 font-light max-w-md mx-auto">
              {locale === "ka"
                ? "დაჯავშნეთ ტესტ დრაივი — უფასოდ"
                : "Book a free test drive at BYD Tbilisi — no commitment required"}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-4 max-w-sm mx-auto sm:max-w-none">
              <Link
                href={bookingHref}
                className="inline-flex items-center justify-center gap-2 border border-white/35 bg-[#A80912] px-5 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-white shadow-[0_16px_38px_rgba(37,39,40,0.18)] transition-all duration-200 hover:bg-[#7F0710]"
              >
                {tCommon("bookTestDrive")}
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 border-2 border-white text-white text-sm font-semibold tracking-[0.06em] uppercase hover:bg-white/10 transition-all duration-200"
              >
                {locale === "ka" ? "სხვა პროდუქტები" : "View All Products"}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
