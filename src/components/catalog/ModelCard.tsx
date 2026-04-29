import Image from "next/image";
import { Link } from "@/i18n/routing";
import { CarModel, formatPrice, getLocalizedValue } from "@/lib/types";

interface ModelCardProps {
  model: CarModel;
  locale: string;
}

export default function ModelCard({ model, locale }: ModelCardProps) {
  const name    = getLocalizedValue(model.name,    locale);
  const tagline = getLocalizedValue(model.tagline, locale);

  return (
    <Link href={`/catalog/${model.id}`}>
      {/* BYD spec card: 0px border-radius, dark bg, border — no glass */}
      <article className="group overflow-hidden cursor-pointer h-full flex flex-col bg-[#1C1E1F] border border-[#2C2F30] hover:border-white/[0.20] transition-all duration-300 hover:-translate-y-1">

        {/* ── Image ─────────────────────────────────────────────── */}
        <div className="relative aspect-[16/10] bg-[#1C1E1F] overflow-hidden">
          {model.images.hero ? (
            <Image
              src={model.images.hero}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-103 transition-transform duration-700"
              style={{ objectPosition: "center 60%" }}
              quality={90}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m16 0V8a1 1 0 00-1-1h-3.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.293.707V16" />
              </svg>
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/40" />

          {/* BYD type badge — spec-compliant: sharp corners, correct colors */}
          <div className="absolute top-3 left-3">
            <span className={model.type === "EV" ? "badge-ev" : "badge-phev"}>
              {model.type}
            </span>
          </div>

          {/* BYD Red bottom accent line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-byd-red scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
        </div>

        {/* ── Content ───────────────────────────────────────────── */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Model name — BYD H7: 16px SemiBold */}
          <h3 className="text-h7 font-semibold text-white mb-1 group-hover:text-[#D4D8DB] transition-colors duration-200">
            {name}
          </h3>
          {/* Tagline — Text 2: 14px Regular */}
          <p className="text-body2 text-white/40 mb-4 line-clamp-2 font-light">
            {tagline}
          </p>

          {/* Specs strip — Text 3: 12px */}
          <div className="flex items-center gap-4 text-body3 text-white/35 mb-4 mt-auto">
            <div className="flex items-center gap-1.5">
              {/* Lightning bolt icon — BYD icon spec 16px */}
              <svg className="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span>{model.specs.power_hp} HP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{model.specs.range_km} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{model.specs.acceleration_0_100}s</span>
            </div>
          </div>

          {/* Price — BYD H6: 20px SemiBold, brand gray */}
          <div className="pt-3 border-t border-white/[0.07]">
            <p className="text-h6 font-semibold text-[#D4D8DB]">
              {formatPrice(model.basePrice)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
