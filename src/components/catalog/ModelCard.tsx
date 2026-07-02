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

  const isEV = model.type === "EV";
  const glowColor = isEV ? "rgba(120, 178, 84, 0.35)" : "rgba(215, 12, 25, 0.30)";
  const glowColorHover = isEV ? "rgba(120, 178, 84, 0.55)" : "rgba(215, 12, 25, 0.50)";
  const borderColor = isEV ? "rgba(120, 178, 84, 0.25)" : "rgba(215, 12, 25, 0.20)";
  const borderColorHover = isEV ? "rgba(120, 178, 84, 0.45)" : "rgba(215, 12, 25, 0.40)";

  return (
    <Link href={`/catalog/${model.id}`}>
      <article
        className="model-card group overflow-hidden cursor-pointer h-full flex flex-col rounded-2xl transition-all duration-400 hover:-translate-y-1.5"
        style={{
          background: "#FBFBFA",
          border: `1px solid ${borderColor}`,
          boxShadow: `0 0 18px ${glowColor}, 0 8px 24px rgba(24, 28, 32, 0.06)`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.border = `1px solid ${borderColorHover}`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${glowColorHover}, 0 12px 32px rgba(24, 28, 32, 0.10)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.border = `1px solid ${borderColor}`;
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 18px ${glowColor}, 0 8px 24px rgba(24, 28, 32, 0.06)`;
        }}
      >

        {/* ── Image ─────────────────────────────────────────────── */}
        <div className="relative aspect-[16/10] bg-[#ECEFF1] overflow-hidden rounded-t-2xl">
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
            <div className="absolute inset-0 flex items-center justify-center text-[#686D71]/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m16 0V8a1 1 0 00-1-1h-3.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.293.707V16" />
              </svg>
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

          {/* BYD type badge — spec-compliant: sharp corners, correct colors */}
          <div className="absolute top-3 left-3">
            <span className={isEV ? "badge-ev" : "badge-phev"}>
              {model.type}
            </span>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────────── */}
        <div className="p-5 md:p-6 flex-1 flex flex-col">
          {/* Model name — larger, bolder */}
          <h3 className="text-h6 md:text-h5 font-bold text-[#252728] mb-1.5 group-hover:text-byd-red transition-colors duration-200">
            {name}
          </h3>
          {/* Tagline — Text 2: 14px Regular */}
          <p className="text-body2 text-[#686D71] mb-5 line-clamp-2 font-light">
            {tagline}
          </p>

          {/* Specs strip — bigger icons, darker color */}
          <div className="flex items-center gap-4 text-[13px] text-[#4E5356] mb-5 mt-auto">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#4E5356]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              <span className="font-medium">{model.specs.power_hp} HP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#4E5356]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-medium">{model.specs.range_km} km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#4E5356]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{model.specs.acceleration_0_100}s</span>
            </div>
          </div>

          {/* Price — bottom left, red & bigger with grey "from" label */}
          <div className="pt-4 border-t border-[#E1E4E6]">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] text-[#8A9094] uppercase tracking-wider font-medium">
                {locale === "ka" ? "დან" : "from"}
              </span>
              <p className="text-xl md:text-2xl font-bold text-byd-red">
                {formatPrice(model.basePrice)}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
