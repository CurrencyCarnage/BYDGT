import { getLocale } from "next-intl/server";
import Image from "next/image";
import BookingForm from "@/components/ui/BookingForm";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { SHOWROOM } from "@/lib/test-drive";
import TestDriveLocationMap from "@/components/ui/TestDriveLocationMap";

const copy = {
  en: {
    tag: "Test Drive",
    title: "Book a Test Drive",
    subtitle: "Choose your product, pick a time, and our team confirms within 24 hours.",
    stat1: "Free", stat1sub: "No obligation",
    stat2: "24 h",  stat2sub: "Response time",
    stat3: "3",     stat3sub: "Products available",
    formTitle: "Your Details",
    reqTitle: "Requirements",
    reqs: [
      { icon: "age",     text: "Minimum age 21+" },
      { icon: "license", text: "Valid driver's license" },
      { icon: "confirm", text: "Confirmed by dealership" },
      { icon: "avail",   text: "Subject to availability" },
    ],
    locTitle: "Showroom",
    directions: "Get Directions",
    warranty: "Warranty PDF",
    routeTag: "Location",
    routeTitle: "Visit Our Showroom",
    routeSub: "BYD Tbilisi is located at Aghmashenebeli Ave 216 — our team is ready to welcome you.",
    routeChips: [
      { val: "Mon–Sun",       sub: "Open daily" },
      { val: "10:00–19:00",   sub: "Working hours" },
      { val: "Free",          sub: "Parking" },
    ],
  },
  ka: {
    tag: "ტესტ დრაივი",
    title: "ტესტ დრაივის დაჯავშნა",
    subtitle: "აირჩიეთ პროდუქტი, დრო და ჩვენი გუნდი 24 საათში დაადასტურებს.",
    stat1: "უფასო", stat1sub: "ვალდებულება არ არის",
    stat2: "24 სთ",  stat2sub: "პასუხის დრო",
    stat3: "3",      stat3sub: "ხელმისაწვდომი პროდუქტი",
    formTitle: "თქვენი მონაცემები",
    reqTitle: "მოთხოვნები",
    reqs: [
      { icon: "age",     text: "მინ. ასაკი 21+" },
      { icon: "license", text: "მოქმედი მართვის მოწმობა" },
      { icon: "confirm", text: "დილერის დადასტურება" },
      { icon: "avail",   text: "ხელმისაწვდომობის მიხედვით" },
    ],
    locTitle: "შოურუმი",
    directions: "მიმართულებები",
    warranty: "გარანტია PDF",
    routeTag: "მდებარეობა",
    routeTitle: "ეწვიეთ შოურუმს",
    routeSub: "BYD Tbilisi მდებარეობს აღმაშენებლის ხეივანი 216-ზე — ჩვენი გუნდი მზადაა თქვენ გამოგიწვდოს.",
    routeChips: [
      { val: "ორშ–კვი",        sub: "ყოველდღე" },
      { val: "10:00–19:00",    sub: "სამუშაო საათები" },
      { val: "უფასო",          sub: "პარკინგი" },
    ],
  },
};

const reqIcons: Record<string, React.ReactNode> = {
  age: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  license: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
    </svg>
  ),
  confirm: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  avail: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

type BookingSearchParams = {
  model?: string | string[];
  version?: string | string[];
  trim?: string | string[];
};

const getFirstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function BookingPage({
  searchParams,
}: {
  searchParams?: BookingSearchParams;
}) {
  const locale = (await getLocale()) as "en" | "ka";
  const t = copy[locale];
  const initialModelId = getFirstParam(searchParams?.model);
  const initialVersionId = getFirstParam(searchParams?.version);
  const initialTrimId = getFirstParam(searchParams?.trim);

  return (
    <div className="booking-page bg-byd-dark">

      {/* ══════════════════════════════════════════════════════════
          HERO — full viewport, img3 with cars, cinematic
      ══════════════════════════════════════════════════════════ */}
      <section className="booking-media-section relative overflow-hidden" style={{ height: "88vh", minHeight: "32.5rem", maxHeight: "48.75rem" }}>
        <Image
          src="/images/testdrive/img3.jpg"
          alt="BYD Tbilisi"
          fill
          className="object-cover object-center"
          priority
          quality={92}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111213]/95 via-[#111213]/58 to-[#111213]/12" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111213]/92 via-[#111213]/42 to-transparent" />
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "3.25rem 3.25rem" }} />

        {/* Content — pinned to bottom-left, tight and readable */}
        <div className="absolute inset-0 flex items-end">
          <div className="section-container w-full pb-12 pt-28">
            <div className="media-copy-overlay p-5 md:p-7 inline-block">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-byd-red" />
                <p className="text-xs text-byd-red uppercase tracking-[0.3em] font-semibold"
                  style={{ fontFamily: "var(--font-montserrat)" }}>
                  {t.tag}
                </p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.06] mb-4 max-w-2xl"
                style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "-0.03em" }}>
                {t.title}
              </h1>
              <p className="text-base text-white/88 font-normal max-w-md leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-montserrat)" }}>
                {t.subtitle}
              </p>
            </ScrollReveal>

            {/* Stats — directly under subtitle, no big gap */}
            <ScrollReveal delay={0.1}>
              <div className="flex gap-8 pt-6 border-t border-white/12">
                {[
                  { val: t.stat1, sub: t.stat1sub },
                  { val: t.stat2, sub: t.stat2sub },
                  { val: t.stat3, sub: t.stat3sub },
                ].map((s) => (
                  <div key={s.val}>
                    <p className="text-2xl font-bold text-white"
                      style={{ fontFamily: "var(--font-montserrat)" }}>
                      {s.val}
                    </p>
                    <p className="text-[10px] text-white/78 uppercase tracking-[0.14em] mt-0.5"
                      style={{ fontFamily: "var(--font-montserrat)" }}>
                      {s.sub}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FORM + SIDEBAR
          Left (form card with image header) | Right (info panel)
      ══════════════════════════════════════════════════════════ */}
      <section className="section-container pt-10 pb-14 md:pb-20">

        {/* ── Requirements strip ────────────────────────────── */}
        <ScrollReveal delay={0.04}>
          <div className="content-surface overflow-hidden mb-8">
            <div className="h-px bg-gradient-to-r from-byd-red via-byd-red/50 to-transparent" />

            {/* Label row */}
            <div className="flex items-center gap-3 px-6 pt-4 pb-3">
              <span className="w-5 h-px bg-byd-red/60 shrink-0" />
              <p
                className="text-[10px] font-semibold text-[#686D71] uppercase tracking-[0.22em]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {t.reqTitle}
              </p>
            </div>

            {/* 4-column grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-[#DDE1E3]">
              {t.reqs.map((req, idx) => (
                <div
                  key={req.icon}
                  className={[
                    "flex items-center gap-4 px-6 py-5",
                    idx === 0 ? "border-r border-b border-[#DDE1E3] md:border-b-0" : "",
                    idx === 1 ? "border-b border-[#DDE1E3] md:border-b-0 md:border-r md:border-[#DDE1E3]" : "",
                    idx === 2 ? "border-r border-[#DDE1E3]" : "",
                  ].join(" ")}
                >
                  <div className="w-9 h-9 bg-byd-red/[0.08] border border-byd-red/[0.18] flex items-center justify-center text-byd-red shrink-0">
                    {reqIcons[req.icon]}
                  </div>
                  <span
                    className="text-sm text-[#4E5356] leading-snug"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_22.5rem] gap-8 lg:gap-10 items-stretch">

          {/* ── LEFT: clean form card, no image ───────────────── */}
          <ScrollReveal delay={0.05}>
            <div>
              <BookingForm
                initialModelId={initialModelId}
                initialVersionId={initialVersionId}
                initialTrimId={initialTrimId}
              />
            </div>
          </ScrollReveal>

          {/* ── RIGHT: sidebar ────────────────────────────────── */}
          <div className="flex flex-col gap-4 h-full">

            {/* Showroom image — tall, fills visual weight */}
            <ScrollReveal delay={0.08} className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 flex flex-col border border-[#DDE1E3] bg-white overflow-hidden shadow-[0_10px_28px_rgba(24,28,32,0.06)]">
                <div className="relative flex-1 min-h-[12.5rem]">
                  <Image
                    src="/images/testdrive/img3.jpg"
                    alt="BYD Dealership"
                    fill
                    className="object-cover object-center"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#252728] via-[#252728]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                    <div className="media-copy-overlay p-3">
                    <p className="text-[10px] text-white/82 uppercase tracking-widest mb-0.5"
                      style={{ fontFamily: "var(--font-montserrat)" }}>
                      {t.locTitle}
                    </p>
                    <p className="text-base font-bold text-white"
                      style={{ fontFamily: "var(--font-montserrat)" }}>
                      {SHOWROOM.name}
                    </p>
                    <p className="text-xs text-white/84 mt-0.5"
                      style={{ fontFamily: "var(--font-montserrat)" }}>
                      {SHOWROOM.address}
                    </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 bg-[#FBFBFA] border-t border-[#DDE1E3]">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${SHOWROOM.lat},${SHOWROOM.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 text-byd-red text-xs font-semibold hover:bg-byd-red/10 transition-all duration-200 border-r border-[#DDE1E3]"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t.directions}
                  </a>
                  <a
                    href="/documents/byd-warranty-georgia.pdf"
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-3 text-[#686D71] text-xs hover:text-[#252728] hover:bg-[#F0F2F3] transition-all duration-200"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t.warranty}
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* BYD building accent */}
            <ScrollReveal delay={0.1} className="flex-1 flex flex-col min-h-0">
              <div className="relative flex-1 min-h-[120px] overflow-hidden border border-[#DDE1E3]">
                <Image
                  src="/images/testdrive/img4.jpg"
                  alt="BYD Tbilisi Building"
                  fill
                  className="object-cover object-top"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#252728]/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                  <div className="media-copy-overlay p-2.5 inline-block">
                  <p className="text-[10px] text-white/86 uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-montserrat)" }}>
                    BYD Tbilisi · GT Group
                  </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MAP — showroom location
      ══════════════════════════════════════════════════════════ */}
      <section data-header-theme="light" className="booking-location-section border-t border-white/[0.10] bg-[#0A0B0C]">
        <ScrollReveal>
          <TestDriveLocationMap locale={locale} />
        </ScrollReveal>
      </section>

    </div>
  );
}
