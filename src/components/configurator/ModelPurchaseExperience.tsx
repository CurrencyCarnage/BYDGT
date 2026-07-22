"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import type { CarModel, CarSpecs } from "@/lib/types";
import { formatPrice, getLocalizedValue, getOfficialVariants, getVariantDetails } from "@/lib/types";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ModelConfigurator from "./ModelConfigurator";

export function CompareTrimsButton({ label, className, style }: { label: string; className?: string; style?: React.CSSProperties }) {
  return <button type="button" onClick={() => document.getElementById("trims")?.scrollIntoView({ behavior: "smooth", block: "start" })} className={className} style={style}>{label}</button>;
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-[#E4E7E8] py-3 last:border-b-0"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A9094]">{label}</p><p className="mt-1 text-base font-semibold text-[#252728]">{value}</p></div>;
}

function SpecsGrid({ specs, ka }: { specs: CarSpecs; ka: boolean }) {
  const power = specs.power_kw ?? specs.power_hp;
  const unit = specs.power_kw ? "kW" : "HP";
  const groups = [
    { title: ka ? "მანძილი და ენერგია" : "Range & energy", items: [{ label: specs.range_label ?? "Range", value: specs.range_km + " km" }, ...(specs.electric_range_km ? [{ label: specs.electric_range_label ?? "Electric range", value: specs.electric_range_km + " km" }] : []), { label: ka ? "ბატარეა" : "Battery", value: specs.battery_kwh + " kWh" }] },
    { title: ka ? "წარმადობა" : "Performance", items: [...(power !== undefined ? [{ label: ka ? "სიმძლავრე" : "Power", value: power + " " + unit }] : []), ...(specs.torque_nm ? [{ label: "Torque", value: specs.torque_nm + " N·m" }] : []), { label: "0–100 km/h", value: specs.acceleration_0_100 + "s" }, ...(specs.top_speed_kmh ? [{ label: ka ? "მაქს. სიჩქარე" : "Top speed", value: specs.top_speed_kmh + " km/h" }] : [])] },
    ...(specs.charging_ac_kw || specs.charging_dc_kw ? [{ title: ka ? "დამუხტვა" : "Charging", items: [...(specs.charging_ac_kw ? [{ label: "AC", value: specs.charging_ac_kw + " kW" }] : []), ...(specs.charging_dc_kw ? [{ label: "DC", value: specs.charging_dc_kw + " kW" }] : [])] }] : []),
  ];
  return <div className="grid gap-4 lg:grid-cols-3">{groups.map((group, index) => <div key={group.title} className="border border-[#DDE1E3] bg-[#FBFBFA] p-5 md:p-6"><div className="mb-3 flex items-center gap-3 border-b border-[#DDE1E3] pb-4"><span className="flex h-8 w-8 items-center justify-center bg-byd-red text-xs font-bold text-white">0{index + 1}</span><h3 className="text-base font-bold text-[#252728]">{group.title}</h3></div>{group.items.map((item) => <SpecItem key={item.label} label={item.label} value={item.value} />)}</div>)}</div>;
}

export default function ModelPurchaseExperience({ model, locale }: { model: CarModel; locale: string }) {
  const ka = locale === "ka";
  const officialVariants = getOfficialVariants(model);
  const baselineVariant = officialVariants[0] ?? null;
  const [selectedVariantId, setSelectedVariantId] = useState(baselineVariant?.id ?? null);
  const baselineDetails = baselineVariant ? getVariantDetails(model, baselineVariant) : null;
  const upgrades = officialVariants.slice(1);
  const modelName = getLocalizedValue(model.name, locale);
  const chooseUpgrade = (id: string) => { setSelectedVariantId(id); document.getElementById("configurator")?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return <>
    <section id="configurator" className="scroll-mt-24 bg-[#1C1E1F] py-section-sm md:py-section-lg"><div className="section-container"><ScrollReveal className="mb-10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">{ka ? "კონფიგურატორი" : "Configurator"}</p><h2 className="mt-3 text-h5 font-semibold text-white md:text-h3">{ka ? modelName + " — კონფიგურაცია" : "Build Your " + modelName}</h2></ScrollReveal><ScrollReveal delay={0.1}><ModelConfigurator model={model} selectedVariantId={selectedVariantId} onVariantChange={setSelectedVariantId} /></ScrollReveal></div></section>


    {baselineDetails && <section className="bg-[#F3F4F5] py-section-sm md:py-section-lg" data-header-theme="light"><div className="section-container"><ScrollReveal className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">{ka ? "შედის სტანდარტულად" : "Included baseline"}</p><h2 className="mt-3 text-h5 font-semibold text-[#252728] md:text-h3">{getLocalizedValue(baselineDetails.name, locale)}</h2><p className="mt-2 text-sm text-[#686D71]">{ka ? "ეს არის ოფიციალური საწყისი კომპლექტაცია; მისი მონაცემები განახლების არჩევით არ იცვლება." : "This official entry trim is the fixed included specification baseline."}</p></ScrollReveal><SpecsGrid specs={baselineDetails.specs} ka={ka} /></div></section>}

    {upgrades.length > 0 && <section id="trims" className="scroll-mt-24 bg-white py-section-sm md:py-section-lg" data-header-theme="light"><div className="section-container"><ScrollReveal className="mb-10"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-byd-red">{ka ? "განახლებები" : "Upgrades"}</p><h2 className="mt-3 text-h5 font-semibold text-[#252728] md:text-h3">{ka ? "აირჩიეთ შემდეგი კომპლექტაცია" : "Choose your next official trim"}</h2></ScrollReveal><div className="space-y-6">{upgrades.map((variant, index) => {
      const details = getVariantDetails(model, variant);
      const name = getLocalizedValue(details.name, locale);
      const selected = selectedVariantId === variant.id;
      const price = model.priceStatus === "contact" ? null : (model.basePrice ?? 0) + variant.priceModifier;
      const bookingHref = "/booking?version=" + encodeURIComponent(model.id) + "&trim=" + encodeURIComponent(variant.id);
      const contactHref = "/contact?subject=" + encodeURIComponent(modelName + " " + getLocalizedValue(details.name, "en"));
      return <ScrollReveal key={variant.id} delay={index * 0.06}><article className={selected ? "border border-byd-red bg-byd-red/[0.03] p-6 md:p-8" : "border border-[#DDE1E3] bg-[#FBFBFA] p-6 md:p-8"}><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-byd-red">{ka ? "განახლება " + (index + 1) : "Upgrade " + (index + 1)}</p><h3 className="mt-2 text-2xl font-bold text-[#252728]">{name}</h3><p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8A9094]">{ka ? "ფასი შეღებვამდე" : "Price before paint"}</p><p className="mt-1 text-lg font-bold text-byd-red">{price === null ? "Contact for pricing" : formatPrice(price)}</p></div><div className="grid gap-2 sm:grid-cols-3"><button type="button" onClick={() => chooseUpgrade(variant.id)} className="min-h-11 border border-[#252728] px-4 text-xs font-bold uppercase text-[#252728]">{selected ? (ka ? "არჩეულია" : "Selected") : (ka ? "არჩევა" : "Select")}</button><Link href={bookingHref} className="inline-flex min-h-11 items-center justify-center bg-byd-red px-4 text-xs font-bold uppercase text-white">{ka ? "ტესტ დრაივი" : "Book test drive"}</Link><Link href={contactHref} className="inline-flex min-h-11 items-center justify-center border border-[#C7CDD0] px-4 text-xs font-bold uppercase text-[#252728]">{ka ? "კონტაქტი" : "Enquire"}</Link></div></div><ul className="mt-6 grid gap-3 md:grid-cols-2">{details.highlights.map((highlight) => <li key={highlight.en} className="flex gap-3 text-sm leading-relaxed text-[#4E5356]"><span className="mt-1 h-2 w-2 flex-shrink-0 bg-byd-red" />{getLocalizedValue(highlight, locale)}</li>)}</ul><div className="mt-6"><SpecsGrid specs={details.specs} ka={ka} /></div></article></ScrollReveal>;
    })}</div></div></section>}
  </>;
}
