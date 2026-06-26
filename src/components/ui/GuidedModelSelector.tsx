"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useState } from "react";

type Intent = "city" | "range" | "suv" | "value";

type Recommendation = {
  name: string;
  href:
    | "/catalog/sealion-06-dmi"
    | "/catalog/seal-06-dmi"
    | "/catalog/yuan-up-ev"
    | "/catalog/yuan-up-dmi";
  image: string;
  objectPosition: string;
  taglineEn: string;
  taglineKa: string;
  bulletsEn: [string, string, string];
  bulletsKa: [string, string, string];
  priceEn: string;
  priceKa: string;
};

const RECOMMENDATIONS: Record<Intent, Recommendation> = {
  city: {
    name: "BYD Yuan Up EV",
    href: "/catalog/yuan-up-ev",
    image: "/images/models/yuan-up-ev/hero.jpg",
    objectPosition: "center 50%",
    taglineEn: "The smart choice for city life.",
    taglineKa: "ქალაქური ცხოვრების საუკეთესო არჩევანი.",
    bulletsEn: [
      "Zero emissions, pure electric range",
      "Compact & effortless to park",
      "Advanced safety & connected tech",
    ],
    bulletsKa: [
      "ნულოვანი გამონაბოლქვი, სუფთა ელ. სვლა",
      "კომპაქტური, მოსახერხებელი პარკირება",
      "უახლესი უსაფრთხოება და ტექნოლოგია",
    ],
    priceEn: "From $25,000",
    priceKa: "$25,000-დან",
  },
  range: {
    name: "BYD Seal 06 DM-i",
    href: "/catalog/seal-06-dmi",
    image: "/images/models/seal-06-dmi/hero.jpg",
    objectPosition: "center 50%",
    taglineEn: "Built for those who go the distance.",
    taglineKa: "შექმნილია გრძელი მოგზაურობისთვის.",
    bulletsEn: [
      "Up to 2,110 km combined range",
      "Low fuel consumption on the highway",
      "Elegant premium sedan profile",
    ],
    bulletsKa: [
      "2,110 კმ-მდე კომბინირებული სვლა",
      "დაბალი საწვავის მოხმარება",
      "ელეგანტური პრემიუმ სედანი",
    ],
    priceEn: "From $30,000",
    priceKa: "$30,000-დან",
  },
  suv: {
    name: "BYD Sealion 06 DM-i",
    href: "/catalog/sealion-06-dmi",
    image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
    objectPosition: "center 50%",
    taglineEn: "Power, and efficiency for the whole family.",
    taglineKa: "სივრცე, სიმძლავრე და ეფექტიანობა მთელი ოჯახისთვის.",
    bulletsEn: [
      "Spacious 5-seat SUV for family comfort",
      "Up to 1,670 km combined range",
      "Confident performance in all conditions",
    ],
    bulletsKa: [
      "5-ადგილიანი SUV ოჯახური კომფორტით",
      "1,670 კმ-მდე კომბინირებული სვლა",
      "თავდაჯერებული მართვა ნებისმიერ პირობებში",
    ],
    priceEn: "From $36,000",
    priceKa: "$36,000-დან",
  },
  value: {
    name: "BYD Yuan Up DM-i",
    href: "/catalog/yuan-up-dmi",
    image: "/images/models/yuan-up-dmi/hero.jpg",
    objectPosition: "center 50%",
    taglineEn: "Maximum value without compromise.",
    taglineKa: "მაქსიმალური ღირებულება — კომპრომისის გარეშე.",
    bulletsEn: [
      "Most affordable BYD in Georgia",
      "Up to 1,000 km combined range",
      "Practical compact SUV for every day",
    ],
    bulletsKa: [
      "ყველაზე ხელმისაწვდომი BYD საქართველოში",
      "1,000 კმ-მდე კომბინირებული სვლა",
      "პრაქტიკული კომპაქტური SUV ყოველდღისთვის",
    ],
    priceEn: "From $22,000",
    priceKa: "$22,000-დან",
  },
};

const INTENTS: {
  id: Intent;
  labelEn: string;
  labelKa: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "city",
    labelEn: "City driving",
    labelKa: "ქალაქური მართვა",
    icon: (
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
        />
      </svg>
    ),
  },
  {
    id: "range",
    labelEn: "Long range",
    labelKa: "გრძელი მანძილი",
    icon: (
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
        />
      </svg>
    ),
  },
  {
    id: "suv",
    labelEn: "Family SUV",
    labelKa: "ოჯახური SUV",
    icon: (
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    ),
  },
  {
    id: "value",
    labelEn: "Best value",
    labelKa: "საუკეთესო ფასი",
    icon: (
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    ),
  },
];

export default function GuidedModelSelector({ locale }: { locale: string }) {
  const ka = locale === "ka";
  const [active, setActive] = useState<Intent>("city");
  const rec = RECOMMENDATIONS[active];

  return (
    <section data-header-theme="light" className="bg-white py-12 md:py-16 border-b border-[#E8EAEB]">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-12 items-center">
          {/* ── Left: selector ──────────────────────────────── */}
          <div>
            <h2
              className="text-[1.5rem] md:text-[1.9rem] font-bold text-[#0f1214] leading-[1.12] mb-2.5"
              style={{ letterSpacing: "-0.022em" }}
            >
              {ka
                ? "რომელი BYD შეესაბამება თქვენს მართვის სტილს?"
                : "Which BYD fits your driving style?"}
            </h2>
            <p className="text-sm text-[#686D71] leading-relaxed mb-7 font-light">
              {ka
                ? "გვითხარით, რა მნიშვნელოვანია თქვენთვის — და ჩვენ გირჩევთ საუკეთესო მოდელს."
                : "Tell us what matters most to you and we'll recommend the right match."}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {INTENTS.map((intent) => {
                const isActive = active === intent.id;
                return (
                  <button
                    key={intent.id}
                    onClick={() => setActive(intent.id)}
                    className={`flex items-center gap-2.5 px-4 py-3.5 rounded-lg border text-left transition-all duration-200 ${
                      isActive
                        ? "bg-byd-red border-byd-red text-white"
                        : "bg-[#F5F6F7] border-[#E2E4E6] text-[#252728] hover:border-[#C0C4C8] hover:bg-[#EDEEF0]"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 ${
                        isActive ? "text-white" : "text-byd-red"
                      }`}
                    >
                      {intent.icon}
                    </span>
                    <span className="text-[13px] font-semibold leading-tight">
                      {ka ? intent.labelKa : intent.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Right: recommendation card — horizontal split ── */}
          <div className="rounded-xl border border-[#E2E4E6] overflow-hidden bg-[#F8F9FA] shadow-sm">
            <div className="flex flex-col sm:flex-row">
              {/* Text content — left half */}
              <div className="flex flex-col p-5 md:p-6 sm:w-[52%]">
                {/* Badge */}
                <span
                  className="self-start mb-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] bg-byd-red text-white"
                  style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}
                >
                  {ka ? "რეკომენდებული" : "Recommended"}
                </span>

                <h3
                  className="text-[1.2rem] font-bold text-[#0f1214] mb-1 leading-tight"
                  style={{ letterSpacing: "-0.015em" }}
                >
                  {rec.name}
                </h3>
                <p className="text-sm text-[#686D71] mb-4">
                  {ka ? rec.taglineKa : rec.taglineEn}
                </p>

                <ul className="space-y-1.5 mb-5">
                  {(ka ? rec.bulletsKa : rec.bulletsEn).map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-[13px] text-[#3A3F44]"
                    >
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0 mt-[3px] text-byd-red"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {/* Price + CTAs pushed to bottom */}
                <div className="mt-auto">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#9CA3AF] mb-0.5 font-medium">
                    {ka ? "საწყისი ფასი" : "Starting from"}
                  </p>
                  <p
                    className="text-[1.45rem] font-bold text-[#0f1214] mb-4"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {ka ? rec.priceKa : rec.priceEn}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href="/booking"
                      className="flex-1 inline-flex items-center justify-center px-3 py-2.5 bg-byd-red text-white text-[11px] font-bold uppercase tracking-[0.08em] hover:bg-[#A80912] transition-colors duration-150"
                    >
                      {ka ? "ტესტ დრაივი" : "Book Test Drive"}
                    </Link>
                    <Link
                      href={rec.href}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2.5 border border-[#C0C4C8] text-[#252728] text-[11px] font-bold uppercase tracking-[0.08em] hover:border-[#252728] hover:bg-[#F0F0F0] transition-all duration-150"
                    >
                      {ka ? "დეტალები" : "View Details"}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Car image — right half */}
              <div className="relative sm:w-[48%] aspect-[4/3] sm:aspect-auto">
                <Image
                  key={rec.image}
                  src={rec.image}
                  alt={rec.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  className="object-cover"
                  style={{ objectPosition: rec.objectPosition }}
                  quality={95}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
