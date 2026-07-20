import Image from "next/image";
import { Link } from "@/i18n/routing";
import { CarModel, formatPrice, getLocalizedValue } from "@/lib/types";

interface ModelCardProps {
  model: CarModel;
  locale: string;
}

function StatIcon({ type }: { type: "power" | "range" | "speed" }) {
  const paths = {
    power: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    range: "M4 17h16M6 17l2-7h8l2 7M9 10V7h6v3",
    speed: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <svg className="mx-auto mb-2 h-5 w-5 text-byd-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[type]} />
    </svg>
  );
}

export default function ModelCard({ model, locale }: ModelCardProps) {
  const name = getLocalizedValue(model.name, locale);
  const tagline = getLocalizedValue(model.tagline, locale);
  const isEV = model.type === "EV";
  const glowColor = isEV ? "rgba(120, 178, 84, 0.28)" : "rgba(215, 12, 25, 0.24)";
  const glowColorHover = isEV ? "rgba(120, 178, 84, 0.45)" : "rgba(215, 12, 25, 0.42)";
  const borderColor = isEV ? "rgba(120, 178, 84, 0.25)" : "rgba(215, 12, 25, 0.20)";
  const borderColorHover = isEV ? "rgba(120, 178, 84, 0.45)" : "rgba(215, 12, 25, 0.40)";

  return (
    <Link href={`/catalog/${model.id}`} className="block h-full">
      <article
        className="model-card group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl transition-all duration-400 hover:-translate-y-1"
        style={{
          background: "#FBFBFA",
          border: `1px solid ${borderColor}`,
          boxShadow: `0 0 18px ${glowColor}, 0 8px 24px rgba(24, 28, 32, 0.06)`,
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.border = `1px solid ${borderColorHover}`;
          event.currentTarget.style.boxShadow = `0 0 28px ${glowColorHover}, 0 12px 32px rgba(24, 28, 32, 0.10)`;
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.border = `1px solid ${borderColor}`;
          event.currentTarget.style.boxShadow = `0 0 18px ${glowColor}, 0 8px 24px rgba(24, 28, 32, 0.06)`;
        }}
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-[#ECEFF1]">
          {model.images.hero ? (
            <Image
              src={model.images.hero}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              style={{ objectPosition: "center 60%" }}
              quality={90}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#686D71]/40">
              <svg className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 16h14l-1.5-5h-11L5 16Zm2 0v2m10-2v2" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45" />
          <div className="absolute left-3 top-3">
            <span className={isEV ? "badge-ev" : "badge-phev"}>{model.type}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-byd-red">
                {model.category} · {model.type}
              </p>
              <h3 className="text-h6 font-bold leading-tight text-[#252728] transition-colors group-hover:text-byd-red md:text-h5">
                {name}
              </h3>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="block text-[9px] font-medium uppercase tracking-[0.14em] text-[#8A9094]">
                {locale === "ka" ? "დან" : "From"}
              </span>
              <p className="mt-1 text-xl font-bold leading-none text-byd-red md:text-2xl">
                {formatPrice(model.basePrice)}
              </p>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 min-h-[2.6rem] text-sm font-light leading-relaxed text-[#686D71]">
            {tagline}
          </p>

          <div className="relative z-10 mt-4 grid grid-cols-3 gap-2">
            <div className="model-card-spec border border-[#E1E4E6] bg-[#F4F6F7] p-3 text-center shadow-[0_8px_18px_rgba(24,28,32,0.06)]">
              <StatIcon type="power" />
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#8A9094]">{locale === "ka" ? "სიმძლავრე" : "Power"}</p>
              <span className="mt-1 block text-sm font-semibold text-[#252728]">{model.specs.power_hp} HP</span>
            </div>
            <div className="model-card-spec border border-[#E1E4E6] bg-[#F4F6F7] p-3 text-center shadow-[0_8px_18px_rgba(24,28,32,0.06)]">
              <StatIcon type="range" />
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#8A9094]">{locale === "ka" ? "მანძილი" : "Range"}</p>
              <span className="mt-1 block text-sm font-semibold text-[#252728]">{model.specs.range_km} km</span>
            </div>
            <div className="model-card-spec border border-[#E1E4E6] bg-[#F4F6F7] p-3 text-center shadow-[0_8px_18px_rgba(24,28,32,0.06)]">
              <StatIcon type="speed" />
              <p className="text-[10px] uppercase tracking-[0.12em] text-[#8A9094]">0–100</p>
              <span className="mt-1 block text-sm font-semibold text-[#252728]">{model.specs.acceleration_0_100}s</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#E1E4E6] pt-4">
            <span className="text-[11px] font-medium text-[#8A9094]">
              {model.configurations.variants.length} {locale === "ka" ? "კომპლექტაცია" : "trims available"}
            </span>
            <span className="model-card-action inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#252728] transition-colors group-hover:text-byd-red">
              {locale === "ka" ? "ნახვა" : "Explore product"}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
