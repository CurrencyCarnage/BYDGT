"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/i18n/routing";
import { serviceCategories, serviceModels, serviceYears } from "./landingPage.data";
import styles from "./landingPage.module.css";
import CustomSelect from "@/components/ui/CustomSelect";

type FinderField = "model" | "year" | "category";
type FinderErrors = Partial<Record<FinderField, string>>;

export default function ServicesQuickFinder() {
  const t = useTranslations("landing.services.form");
  const tSelect = useTranslations("formControls.select");
  const router = useRouter();
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
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
    if (!categories.length) nextErrors.category = t("errorCategory");
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

    const query = new URLSearchParams({ model, year });
    categories.forEach((category) => query.append("category", category));
    router.push(`/services?${query.toString()}`);
  };

  return (
    <form className={styles.finder} onSubmit={handleSubmit} noValidate>
      <div className={styles.finderGrid}>
        <div className={styles.field}>
          <label htmlFor="landing-service-model">{t("modelLabel")}</label>
          <CustomSelect
            id="landing-service-model"
            value={model}
            onChange={(value) => { setModel(value); clearError("model"); }}
            placeholder={t("modelPlaceholder")}
            options={[{ value: "", label: t("modelPlaceholder") }, ...serviceModels.map((item) => ({ value: item.value, label: item.label }))]}
            aria-invalid={Boolean(errors.model)}
            aria-describedby={errors.model ? "landing-service-model-error" : undefined}
          />
          {errors.model && <p id="landing-service-model-error" role="alert" className={styles.fieldError}>{errors.model}</p>}
        </div>

        <div className={styles.field}>
          <label htmlFor="landing-service-year">{t("yearLabel")}</label>
          <CustomSelect
            id="landing-service-year"
            value={year}
            onChange={(value) => { setYear(value); clearError("year"); }}
            placeholder={t("yearPlaceholder")}
            options={[{ value: "", label: t("yearPlaceholder") }, ...serviceYears.map((item) => ({ value: item, label: item }))]}
            aria-invalid={Boolean(errors.year)}
            aria-describedby={errors.year ? "landing-service-year-error" : undefined}
          />
          {errors.year && <p id="landing-service-year-error" role="alert" className={styles.fieldError}>{errors.year}</p>}
        </div>

        <div className={`${styles.field} ${styles.categoryField}`}>
          <label htmlFor="landing-service-category">{t("categoryLabel")}</label>
          <CustomSelect
            id="landing-service-category"
            multiple
            value={categories}
            onChange={(value) => { setCategories(value); clearError("category"); }}
            placeholder={tSelect("multiplePlaceholder")}
            options={serviceCategories.map((item) => ({ value: item, label: t(`categories.${item}`) }))}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "landing-service-category-error" : undefined}
          />
          {errors.category && <p id="landing-service-category-error" role="alert" className={styles.fieldError}>{errors.category}</p>}
        </div>
      </div>

      <button className={styles.finderSubmit} type="submit">{t("submit")}</button>
      <Link className={styles.finderSecondary} href="/services?intent=appointment">{t("book")}</Link>
    </form>
  );
}
