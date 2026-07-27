"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { serviceModels, serviceYears } from "@/components/landing/landingPage.data";
import heroDesktop from "@/servicespage/services-hero-desktop.jpg";
import heroMobile from "@/servicespage/services-hero-mobile.jpg";
import serviceDesktop from "@/servicespage/official-service-workshop-desktop.jpg";
import serviceMobile from "@/servicespage/official-service-workshop-mobile.jpg";
import partsDesktop from "@/servicespage/genuine-spare-parts-desktop.jpg";
import partsMobile from "@/servicespage/genuine-spare-parts-mobile.jpg";
import accessoriesDesktop from "@/servicespage/accessories-feature-desktop.jpg";
import accessoriesMobile from "@/servicespage/accessories-feature-mobile.jpg";
import finderDesktop from "@/servicespage/product-finder-desktop.jpg";
import finderMobile from "@/servicespage/product-finder-mobile.jpg";
import styles from "./servicesHub.module.css";
import CustomSelect, { type SelectOption } from "@/components/ui/CustomSelect";
import DateField from "@/components/ui/DateField";
import PhoneField from "@/components/ui/PhoneField";
import { getTodayIsoInTbilisi } from "@/lib/date";

type Selection = { model?: string; year?: string; categories?: string[] };
const categories = ["serviceParts", "fluids", "filters", "brakes", "exterior", "interior", "electrical", "charging", "protection", "comfort", "other"] as const;
type Category = typeof categories[number];
const partCategories = ["filters", "brakes", "suspension", "exterior", "electrical", "interior", "battery", "other"] as const;
const resultGroups = ["maintenance", "cabin", "brakeFluid", "coolant", "brakePads", "wipers", "chargingCable", "cableBag", "mats", "liner", "organizer", "manual"] as const;
type ResultGroup = typeof resultGroups[number];
const resultCategories: Record<ResultGroup, Category> = {
  maintenance: "serviceParts", cabin: "filters", brakeFluid: "fluids", coolant: "fluids",
  brakePads: "brakes", wipers: "exterior", chargingCable: "charging", cableBag: "charging",
  mats: "protection", liner: "protection", organizer: "comfort", manual: "other",
};
const mappedResultCategories = new Set<Category>(
  resultGroups
    .filter((id) => id !== "manual")
    .map((id) => resultCategories[id])
);
const sectionIds = ["service", "spare-parts", "accessories", "product-finder"] as const;

function Picture({ desktop, mobile, alt, hero }: { desktop: StaticImageData; mobile: StaticImageData; alt: string; hero?: boolean }) {
  return <div className={`${styles.picture} ${hero ? styles.heroPicture : ""}`}><Image src={desktop} alt={alt} fill priority={hero} quality={hero ? 88 : 78} sizes={hero ? "100vw" : "(max-width: 767px) 100vw, 60vw"} className={styles.desktopImage} /><Image src={mobile} alt="" fill priority={hero} quality={hero ? 88 : 78} sizes="100vw" className={styles.mobileImage} /></div>;
}

function go(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }

export default function ServicesHub({ initialSelection }: { initialSelection: Selection }) {
  const t = useTranslations("landing.servicesPage");
  const tSelect = useTranslations("formControls.select");
  const [active, setActive] = useState("service");
  const [finder, setFinder] = useState({ model: initialSelection.model ?? "", year: initialSelection.year ?? "", categories: initialSelection.categories ?? [], keyword: "" });
  const [searched, setSearched] = useState(Boolean(initialSelection.model && initialSelection.year && initialSelection.categories?.length));
  const [openFaq, setOpenFaq] = useState(0);
  useEffect(() => { const targets = sectionIds.map((id) => document.getElementById(id)).filter((x): x is HTMLElement => Boolean(x)); const observer = new IntersectionObserver((entries) => { const entry = entries.find((item) => item.isIntersecting); if (entry) setActive(entry.target.id); }, { rootMargin: "-30% 0px -55%" }); targets.forEach((target) => observer.observe(target)); return () => observer.disconnect(); }, []);
  const filtered = useMemo(() => resultGroups.filter((id) => {
    if (id === "manual") return false;
    // The local catalogue has category-level groups rather than per-model fitment
    // records. Model and year still participate in the predicate by rejecting
    // stale or malformed query-string selections; final fitment remains manual.
    const modelMatches = !finder.model || serviceModels.some((model) => model.value === finder.model);
    const yearMatches = !finder.year || serviceYears.some((year) => year === finder.year);
    const categoryMatches = !finder.categories.length || finder.categories.includes(resultCategories[id]);
    const keywordMatches = !finder.keyword || t(`results.${id}.title`).toLocaleLowerCase().includes(finder.keyword.toLocaleLowerCase());
    return modelMatches && yearMatches && categoryMatches && keywordMatches;
  }), [finder.categories, finder.keyword, finder.model, finder.year, t]);
  const needsManualResult = finder.categories.some((category) => !mappedResultCategories.has(category as Category));
  const visibleResults: ResultGroup[] = [
    ...filtered,
    ...(needsManualResult ? ["manual" as const] : []),
  ];
  return <main className={styles.page}>
    <section className={styles.hero}><Picture desktop={heroDesktop} mobile={heroMobile} alt={t("images.hero")} hero /><div className={styles.heroShade} /><div className={`${styles.container} ${styles.heroInner}`}><p className={styles.eyebrow}>{t("hero.eyebrow")}</p><h1>{t("hero.title")}</h1><p className={styles.lead}>{t("hero.body")}</p><div className={styles.actions}><button className={styles.primary} onClick={() => go("service")}>{t("hero.primary")}</button><button className={styles.secondary} onClick={() => go("product-finder")}>{t("hero.secondary")}</button></div><p className={styles.caption}>{t("hero.caption")}</p><div className={styles.trust}>{["service", "components", "fluids", "compatibility"].map((key) => <span key={key}>{t(`hero.trust.${key}`)}</span>)}</div></div></section>
    <nav className={styles.nav} aria-label={t("nav.aria")}><div className={`${styles.container} ${styles.navInner}`}>{sectionIds.map((id) => <button key={id} className={active === id ? styles.active : ""} aria-current={active === id ? "true" : undefined} onClick={() => go(id)}>{t(`nav.${id}`)}</button>)}</div></nav>
    <section id="service" className={styles.section}><div className={`${styles.container} ${styles.split}`}><Picture desktop={serviceDesktop} mobile={serviceMobile} alt={t("images.service")} /><div><Heading t={t} section="official" /><div className={styles.serviceList}>{["maintenance", "diagnostics", "repair", "fluids"].map((key, index) => <article key={key}><span>{`0${index + 1}`}</span><div><h3>{t(`official.items.${key}.title`)}</h3><p>{t(`official.items.${key}.body`)}</p></div></article>)}</div><RequestForm t={t} kind="appointment" /></div></div></section>
    <section id="spare-parts" className={`${styles.section} ${styles.darkSurface}`}><div className={`${styles.container} ${styles.split} ${styles.reverse}`}><Picture desktop={partsDesktop} mobile={partsMobile} alt={t("images.parts")} /><div><Heading t={t} section="parts" /><ul className={styles.tickList}>{["genuine", "compatibility", "vin", "installation", "availability"].map((key) => <li key={key}>{t(`parts.assurance.${key}`)}</li>)}</ul><div className={styles.chips}>{partCategories.map((key) => <span key={key}>{t(`parts.categories.${key}`)}</span>)}</div><RequestForm t={t} kind="parts" /></div></div></section>
    <section id="accessories" className={styles.section}><div className={styles.container}><div className={styles.accessoriesTop}><Picture desktop={accessoriesDesktop} mobile={accessoriesMobile} alt={t("images.accessories")} /><div className={styles.accessoriesCopy}><Heading t={t} section="accessories" /></div></div><div className={styles.accessoryGrid}>{["protection", "storage", "comfort", "exterior"].map((key, index) => <article key={key}><span>{`0${index + 1}`}</span><h3>{t(`accessories.cards.${key}.title`)}</h3><p>{t(`accessories.cards.${key}.body`)}</p><small>{t(`accessories.cards.${key}.examples`)}</small></article>)}</div><div className={styles.actions}><a className={styles.primary} href="mailto:info@byd.ge">{t("accessories.primary")}</a><button className={styles.secondary} onClick={() => go("product-finder")}>{t("accessories.secondary")}</button></div></div></section>
    <section id="product-finder" className={`${styles.section} ${styles.finder}`}><Picture desktop={finderDesktop} mobile={finderMobile} alt={t("images.finder")} /><div className={styles.finderShade} /><div className={`${styles.container} ${styles.finderInner}`}><div className={styles.finderCopy}><Heading t={t} section="finder" /></div><form className={styles.finderForm} onSubmit={(event) => { event.preventDefault(); setSearched(true); }}><Select t={t} label="model" value={finder.model} set={(model) => setFinder({ ...finder, model })} options={serviceModels.map((item) => [item.value, item.label])} /><Select t={t} label="year" value={finder.year} set={(year) => setFinder({ ...finder, year })} options={serviceYears.map((item) => [item, item])} /><label>{t("fields.category")}<CustomSelect multiple value={finder.categories} onChange={(selected) => setFinder({ ...finder, categories: selected })} placeholder={tSelect("multiplePlaceholder")} options={categories.map((key) => ({ value: key, label: t(`finder.categories.${key}`) }))} /></label><label>{t("fields.keyword")}<input value={finder.keyword} onChange={(event) => setFinder({ ...finder, keyword: event.target.value })} /></label><button className={styles.primary}>{t("finder.primary")}</button><button type="button" className={styles.textButton} onClick={() => go("service")}>{t("finder.secondary")}</button><button type="button" className={styles.clearButton} onClick={() => { setFinder({ model: "", year: "", categories: [], keyword: "" }); setSearched(false); }}>{t("finder.clear")}</button></form></div><div className={`${styles.container} ${styles.results}`}>{searched ? <div className={styles.resultGrid}>{(visibleResults.length ? visibleResults : ["manual"]).map((key) => <article key={key}><span>{t(`results.${key}.category`)}</span><h3>{t(`results.${key}.title`)}</h3><p>{t(`results.${key}.body`)}</p><small>{t(`results.${key}.installation`)}</small><em>{t("finder.compatibility")}</em><a href="mailto:info@byd.ge">{t("finder.request")}</a></article>)}</div> : <p className={styles.empty}>{t("finder.empty")}</p>}</div></section>
    <section className={styles.assurance}><div className={`${styles.container} ${styles.assuranceGrid}`}>{["official", "check", "genuine", "installation"].map((key, index) => <article key={key}><span>{`0${index + 1}`}</span><h3>{t(`assurance.${key}.title`)}</h3><p>{t(`assurance.${key}.body`)}</p></article>)}</div></section>
    <section className={`${styles.section} ${styles.faq}`}><div><p className={styles.eyebrow}>{t("faq.eyebrow")}</p><h2>{t("faq.title")}</h2>{["fit", "online", "installation", "service", "stock", "vin"].map((key, index) => <article key={key}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>{t(`faq.items.${key}.question`)}<b>{openFaq === index ? "−" : "+"}</b></button>{openFaq === index && <p>{t(`faq.items.${key}.answer`)}</p>}</article>)}</div></section>
    <section className={styles.final}><div className={`${styles.container} ${styles.finalInner}`}><div><h2>{t("final.title")}</h2><p>{t("final.body")}</p></div><div className={styles.actions}><a className={styles.primary} href="mailto:info@byd.ge">{t("final.primary")}</a><a className={styles.secondary} href="https://wa.me/995XXXXXXXXX" target="_blank" rel="noreferrer">{t("final.secondary")}</a></div></div></section>
  </main>;
}

function Heading({ t, section }: { t: ReturnType<typeof useTranslations>; section: string }) { return <><p className={styles.eyebrow}>{t(`${section}.eyebrow`)}</p><h2>{t(`${section}.title`)}</h2><p className={styles.copy}>{t(`${section}.body`)}</p></>; }
function Select({ t, label, value, set, options }: { t: ReturnType<typeof useTranslations>; label: string; value: string; set: (value: string) => void; options: readonly (readonly [string, string])[] }) {
  return <label>{t(`fields.${label}`)}<CustomSelect value={value} onChange={set} placeholder={t("fields.choose")} options={[{ value: "", label: t("fields.choose") }, ...options.map(([value, label]) => ({ value, label }))]} /></label>;
}

function requestOptions(t: ReturnType<typeof useTranslations>, key: string): SelectOption[] {
  if (key === "model") return serviceModels.map((item) => ({ value: item.value, label: item.label }));
  if (key === "year") return serviceYears.map((item) => ({ value: item, label: item }));
  return ["one", "two", "three", "other"].map((item) => ({ value: item, label: t(`forms.options.${item}`) }));
}

type RequestField = {
  key: string;
  kind: "select" | "date" | "phone" | "text" | "textarea";
  optional?: boolean;
  wide?: boolean;
};

function RequestForm({ t, kind }: { t: ReturnType<typeof useTranslations>; kind: "appointment" | "parts" }) {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [invalid, setInvalid] = useState(false);
  const fields: RequestField[] = kind === "appointment"
    ? [
      { key: "model", kind: "select" }, { key: "year", kind: "select" },
      { key: "serviceType", kind: "select" }, { key: "date", kind: "date" },
      { key: "name", kind: "text" }, { key: "phone", kind: "phone" },
      { key: "note", kind: "textarea", optional: true, wide: true },
    ]
    : [
      { key: "model", kind: "select" }, { key: "year", kind: "select" },
      { key: "vin", kind: "text", optional: true }, { key: "partCategory", kind: "select" },
      { key: "description", kind: "textarea", optional: true, wide: true },
      { key: "installation", kind: "select" }, { key: "name", kind: "text" },
      { key: "phone", kind: "phone" },
    ];
  const setValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setInvalid(false);
  };
  if (sent) return <div className={styles.success}><p>{t(`${kind}.success`)}</p><button className={styles.textButton} onClick={() => { setSent(false); setValues({}); }}>{t("forms.newRequest")}</button></div>;
  return <form className={styles.request} noValidate onSubmit={(event: FormEvent) => { event.preventDefault(); if (fields.filter((field) => !field.optional).some((field) => !values[field.key])) return setInvalid(true); setSent(true); }}><h3>{t(`${kind}.formTitle`)}</h3><p>{t(`${kind}.formText`)}</p><div className={styles.requestFields}>{fields.map((field) => {
    const fieldClass = field.wide ? styles.wideField : undefined;
    const label = t(`fields.${field.key}`);
    if (field.kind === "phone") return <div key={field.key} className={`${styles.fieldGroup} ${fieldClass ?? ""}`}><span>{label}</span><PhoneField required value={values[field.key] ?? ""} onChange={(value) => setValue(field.key, value)} aria-label={label} className="border border-[var(--theme-border-subtle)] bg-[var(--theme-surface-alt)]" /></div>;
    return <label key={field.key} className={fieldClass}>{label}{field.kind === "select" ? <CustomSelect value={values[field.key] ?? ""} onChange={(value) => setValue(field.key, value)} placeholder={t("fields.choose")} options={[{ value: "", label: t("fields.choose") }, ...requestOptions(t, field.key)]} /> : field.kind === "textarea" ? <textarea value={values[field.key] ?? ""} onChange={(event) => setValue(field.key, event.target.value)} /> : field.kind === "date" ? <DateField required value={values[field.key] ?? ""} onChange={(value) => setValue(field.key, value)} min={getTodayIsoInTbilisi()} aria-label={label} /> : <input type="text" value={values[field.key] ?? ""} onChange={(event) => setValue(field.key, event.target.value)} />}</label>;
  })}</div><div className={styles.requestActions}><div className={styles.requestMessages}>{invalid && <small className={styles.error}>{t("forms.required")}</small>}{kind === "parts" && <small>{t("parts.helper")}</small>}</div><button className={styles.primary}>{t(`${kind}.submit`)}</button></div></form>;
}
