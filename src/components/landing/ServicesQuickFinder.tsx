"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/i18n/routing";
import { serviceCategories, serviceModels, serviceYears } from "./landingPage.data";
import styles from "./landingPage.module.css";

type FinderField = "model" | "year" | "category";
type FinderErrors = Partial<Record<FinderField, string>>;

export default function ServicesQuickFinder() {
  const t = useTranslations("landing.services.form");
  const router = useRouter();
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<FinderErrors>({});

  const clearError = (field: FinderField) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: FinderErrors = {};
    if (!model) nextErrors.model = t("errorModel");
    if (!year) nextErrors.year = t("errorYear");
    if (!category) nextErrors.category = t("errorCategory");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidId = !model
        ? "landing-service-model"
        : !year
        ? "landing-service-year"
        : "landing-service-category";
      requestAnimationFrame(() => document.getElementById(firstInvalidId)?.focus());
      return;
    }

    const query = new URLSearchParams({ model, year, category });
    router.push(`/services?${query.toString()}`);
  };

  return (
    <form className={styles.finder} onSubmit={handleSubmit} noValidate>
      <div className={styles.finderGrid}>
        <div className={styles.field}>
          <label htmlFor="landing-service-model">{t("modelLabel")}</label>
          <select
            id="landing-service-model"
            value={model}
            onChange={(event) => { setModel(event.target.value); clearError("model"); }}
            aria-invalid={Boolean(errors.model)}
            aria-describedby={errors.model ? "landing-service-model-error" : undefined}
          >
            <option value="">{t("modelPlaceholder")}</option>
            {serviceModels.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          {errors.model && <p id="landing-service-model-error" role="alert" className={styles.fieldError}>{errors.model}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="landing-service-year">{t("yearLabel")}</label>
          <select
            id="landing-service-year"
            value={year}
            onChange={(event) => { setYear(event.target.value); clearError("year"); }}
            aria-invalid={Boolean(errors.year)}
            aria-describedby={errors.year ? "landing-service-year-error" : undefined}
          >
            <option value="">{t("yearPlaceholder")}</option>
            {serviceYears.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          {errors.year && <p id="landing-service-year-error" role="alert" className={styles.fieldError}>{errors.year}</p>}
        </div>

        <div className={`${styles.field} ${styles.categoryField}`}>
          <label htmlFor="landing-service-category">{t("categoryLabel")}</label>
          <select
            id="landing-service-category"
            value={category}
            onChange={(event) => { setCategory(event.target.value); clearError("category"); }}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "landing-service-category-error" : undefined}
          >
            <option value="">{t("categoryPlaceholder")}</option>
            {serviceCategories.map((item) => <option key={item} value={item}>{t(`categories.${item}`)}</option>)}
          </select>
          {errors.category && <p id="landing-service-category-error" role="alert" className={styles.fieldError}>{errors.category}</p>}
        </div>
      </div>

      <button className={styles.finderSubmit} type="submit">{t("submit")}</button>
      <Link className={styles.finderSecondary} href="/services?intent=appointment">{t("book")}</Link>
    </form>
  );
}
