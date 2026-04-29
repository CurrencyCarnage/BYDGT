"use client";

import Image from "next/image";

interface ModelHeroMediaProps {
  heroVideo?: string;
  hero?: string;
  name: string;
  type: "EV" | "PHEV";
  category: string;
}

export default function ModelHeroMedia({
  heroVideo,
  hero,
  name,
  type,
  category,
}: ModelHeroMediaProps) {
  return (
    <div className="relative aspect-[16/10] bg-[#1C1E1F] overflow-hidden">
      {heroVideo ? (
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : hero ? (
        <Image
          src={hero}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
          priority
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white/35 text-sm">Image Coming Soon</p>
        </div>
      )}

      {/* Overlay for badge legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

      {/* Type badge */}
      <div className="absolute top-4 left-4">
        <span className={type === "EV" ? "badge-ev" : "badge-phev"}>
          {type}
        </span>
      </div>

      {/* Category badge */}
      <div className="absolute top-4 right-4">
        <span className="text-caption text-white/35 bg-[#2C2F30] px-3 py-1">
          {category}
        </span>
      </div>
    </div>
  );
}
