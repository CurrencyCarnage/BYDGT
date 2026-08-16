"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SHOWROOM, TEST_DRIVE_ROUTE } from "@/lib/test-drive";
import CustomSelect from "./CustomSelect";

const ShowroomMap = dynamic(() => import("@/components/ui/ShowroomMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#F0F2F3] animate-pulse" />,
});

type Locale = "en" | "ka";
type City = "tbilisi" | "batumi";

/** Both showrooms are real locations — Batumi is pinned at Luka Asatiani St 35. */
const LOCATIONS: Record<City, { name: string; address: string; lat: number; lng: number; route?: [number, number][] }> = {
  tbilisi: {
    name: SHOWROOM.name,
    address: SHOWROOM.address,
    lat: SHOWROOM.lat,
    lng: SHOWROOM.lng,
    route: TEST_DRIVE_ROUTE,
  },
  batumi: {
    name: "BYD Batumi",
    address: "Luka Asatiani St 35, Batumi, Georgia",
    lat: 41.6464,
    lng: 41.6368,
  },
};

const copy = {
  en: {
    city: "City", location: "Location",
    cities: { tbilisi: "Tbilisi", batumi: "Batumi" },
    title: "Visit Our Showroom",
    recenter: "Re-center map on showroom",
    chips: [{ val: "Mon–Sun", sub: "Open daily" }, { val: "10:00–19:00", sub: "Working hours" }, { val: "Free", sub: "Parking" }],
  },
  ka: {
    city: "ქალაქი", location: "მდებარეობა",
    cities: { tbilisi: "თბილისი", batumi: "ბათუმი" },
    title: "ეწვიეთ შოურუმს",
    recenter: "რუკის დაბრუნება შოურუმზე",
    chips: [{ val: "ორშ–კვი", sub: "ყოველდღე" }, { val: "10:00–19:00", sub: "სამუშაო საათები" }, { val: "უფასო", sub: "პარკინგი" }],
  },
} as const;

export default function TestDriveLocationMap({ locale }: { locale: Locale }) {
  const [city, setCity] = useState<City>("tbilisi");
  const t = copy[locale];
  const location = LOCATIONS[city];

  return <>
    {/* Header sits above the map in the stacking order so the city menu can overlap it */}
    <div className="section-container relative z-30 py-10 md:py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-byd-red" />
            <p className="text-xs text-byd-red uppercase tracking-[0.25em] font-semibold" style={{ fontFamily: "var(--font-montserrat)" }}>
              {t.location}
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#252728]" style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "-0.02em" }}>
            {t.title}
          </h2>
        </div>

        {/* Info chips + city selector — fixed sizes so switching city never reflows the row */}
        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          {t.chips.map((chip) => (
            <div
              key={chip.sub}
              className="content-surface-soft flex h-[3.25rem] w-[8.75rem] flex-col items-center justify-center overflow-hidden px-2 text-center"
            >
              <p className="w-full truncate text-sm font-bold text-[#252728]" style={{ fontFamily: "var(--font-montserrat)" }}>{chip.val}</p>
              <p className="mt-0.5 w-full truncate text-[9px] uppercase tracking-wider text-[#7A8080]" style={{ fontFamily: "var(--font-montserrat)" }}>{chip.sub}</p>
            </div>
          ))}
          <CustomSelect
            aria-label={t.city}
            value={city}
            onChange={(value) => setCity(value as City)}
            placeholder={t.city}
            options={[
              { value: "tbilisi", label: t.cities.tbilisi },
              { value: "batumi", label: t.cities.batumi },
            ]}
            className="w-[8.75rem]"
            buttonClassName="!h-[3.25rem] !min-h-[3.25rem] w-full px-3 text-sm font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          />
        </div>
      </div>
    </div>

    {/* isolate keeps Leaflet's internal z-index layers from covering the city menu */}
    <div className="relative isolate z-0 w-full h-[30rem] md:h-[33.75rem] border-t border-[#DDE1E3]">
      <ShowroomMap
        key={city}
        lat={location.lat}
        lng={location.lng}
        zoom={15}
        label={location.name}
        address={location.address}
        routePath={location.route}
        popupEyebrow={location.name}
        recenterLabel={t.recenter}
      />
    </div>
  </>;
}
