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

const copy = {
  en: {
    city: "City", location: "Location", previewPopup: "Future BYD Location",
    cities: { tbilisi: "Tbilisi", batumi: "Batumi" },
    title: "Visit Our Showroom", sub: "BYD Tbilisi is located at Aghmashenebeli Ave 216 — our team is ready to welcome you.",
    previewTitle: "BYD Batumi", previewSub: "A future showroom location — details coming soon.",
    chips: [{ val: "Mon–Sun", sub: "Open daily" }, { val: "10:00–19:00", sub: "Working hours" }, { val: "Free", sub: "Parking" }],
  },
  ka: {
    city: "ქალაქი", location: "მდებარეობა", previewPopup: "BYD-ის მომავალი ლოკაცია",
    cities: { tbilisi: "თბილისი", batumi: "ბათუმი" },
    title: "ეწვიეთ შოურუმს", sub: "BYD Tbilisi მდებარეობს აღმაშენებლის ხეივანი 216-ზე — ჩვენი გუნდი მზადაა თქვენ გამოგიწვდოს.",
    previewTitle: "BYD Batumi", previewSub: "მომავალი შოურუმის ლოკაცია — დეტალები მალე დაემატება.",
    chips: [{ val: "ორშ–კვი", sub: "ყოველდღე" }, { val: "10:00–19:00", sub: "სამუშაო საათები" }, { val: "უფასო", sub: "პარკინგი" }],
  },
} as const;

export default function TestDriveLocationMap({ locale }: { locale: Locale }) {
  const [city, setCity] = useState<City>("tbilisi");
  const t = copy[locale];
  const isBatumi = city === "batumi";

  return <>
    <div className="section-container py-10 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="w-6 h-px bg-byd-red" />
            <p className="text-xs text-byd-red uppercase tracking-[0.25em] font-semibold" style={{ fontFamily: "var(--font-montserrat)" }}>
              {isBatumi ? t.previewPopup : t.location}
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#252728]" style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "-0.02em" }}>
            {isBatumi ? t.previewTitle : t.title}
          </h2>
          <p className="text-sm text-[#686D71] mt-1.5 max-w-sm" style={{ fontFamily: "var(--font-montserrat)" }}>
            {isBatumi ? t.previewSub : t.sub}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1.5 text-[10px] text-[#7A8080] uppercase tracking-wider" style={{ fontFamily: "var(--font-montserrat)" }}>
            {t.city}
            <CustomSelect
              aria-label={t.city}
              value={city}
              onChange={(value) => setCity(value as City)}
              placeholder={t.city}
              options={[
                { value: "tbilisi", label: t.cities.tbilisi },
                { value: "batumi", label: t.cities.batumi },
              ]}
              buttonClassName="min-w-[10rem] px-3 py-2.5 text-sm font-semibold"
              style={{ fontFamily: "var(--font-montserrat)" }}
            />
          </label>
          {!isBatumi && t.chips.map((chip) => <div key={chip.val} className="px-4 py-2.5 content-surface-soft text-center min-w-[5.625rem]">
            <p className="text-sm font-bold text-[#252728]" style={{ fontFamily: "var(--font-montserrat)" }}>{chip.val}</p>
            <p className="text-[10px] text-[#7A8080] uppercase tracking-wider mt-0.5" style={{ fontFamily: "var(--font-montserrat)" }}>{chip.sub}</p>
          </div>)}
        </div>
      </div>
    </div>
    <div className="w-full h-[30rem] md:h-[33.75rem] border-t border-[#DDE1E3]">
      <ShowroomMap lat={isBatumi ? 41.6502 : SHOWROOM.lat} lng={isBatumi ? 41.6367 : SHOWROOM.lng} zoom={isBatumi ? 15 : undefined}
        label={isBatumi ? t.previewTitle : SHOWROOM.name} address={isBatumi ? undefined : SHOWROOM.address}
        routePath={isBatumi ? undefined : TEST_DRIVE_ROUTE} preview={isBatumi} popupEyebrow={isBatumi ? t.previewPopup : "BYD Tbilisi"} />
    </div>
  </>;
}
