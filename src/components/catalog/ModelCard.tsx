import Image from "next/image";
import { Link } from "@/i18n/routing";
import { CarModel, formatPrice, getLocalizedValue } from "@/lib/types";

interface ModelCardProps {
  model: CarModel;
  locale: string;
}

export default function ModelCard({ model, locale }: ModelCardProps) {
  const name = getLocalizedValue(model.name, locale);
  const tagline = getLocalizedValue(model.tagline, locale);

  return (
    <Link href={`/catalog/${model.id}`}>
      <article className="glass-card group overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-bg-tertiary overflow-hidden">
          {model.images.hero ? (
            <Image
              src={model.images.hero}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              style={{ objectPosition: "center 60%" }}
              quality={90}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m16 0V8a1 1 0 00-1-1h-3.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 00-.293.707V16" />
              </svg>
            </div>
          )}

          {/* Gradient overlays — neutralise bright studio backgrounds */}
          {/* Top: dark scrim blends bright background corners into card */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D14]/65 via-transparent to-black/50" />
          {/* Side edges: subtle darkening so the card border feels intentional */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D14]/20 via-transparent to-[#0D0D14]/20" />

          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={model.type === "EV" ? "badge-ev" : "badge-phev"}>
              {model.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors duration-200">
            {name}
          </h3>
          <p className="text-sm text-text-secondary mb-4 line-clamp-2">
            {tagline}
          </p>

          {/* Specs Strip */}
          <div className="flex items-center gap-4 text-xs text-text-muted mb-4 mt-auto">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{model.specs.power_hp} HP</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{model.specs.range_km} km</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{model.specs.acceleration_0_100}s</span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-3 border-t border-[rgba(255,255,255,0.06)]">
            <p className="text-accent font-semibold text-lg">
              {formatPrice(model.basePrice)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
