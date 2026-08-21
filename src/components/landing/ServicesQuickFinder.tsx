"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/i18n/routing";
import ProductPickerField from "@/components/ui/ProductPickerField";
import { serviceCategories, type ServicePickerModel } from "./landingPage.data";
import styles from "./landingPage.module.css";
import CustomSelect from "@/components/ui/CustomSelect";

type FinderField = "model" | "year" | "category";
type FinderErrors = Partial<Record<FinderField, string>>;

type ServicesQuickFinderProps = {
  models: ServicePickerModel[];
  closeModelPickerRequestKey?: number;
  onModelPickerPointerLeave?: (relatedTarget: EventTarget | null) => void;
};

export default function ServicesQuickFinder({ models, closeModelPickerRequestKey, onModelPickerPointerLeave }: ServicesQuickFinderProps) {
  const t = useTranslations("landing.services.form");
  const tSelect = useTranslations("formControls.select");
  const router = useRouter();
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [year, setYear] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<FinderErrors>({});
  const selectedModel = models.find((item) => item.value === model);
  const modelYears = selectedModel?.years.map(String) ?? [];

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
    if (modelYears.length > 0 && !year) nextErrors.year = t("errorYear");
    if (!categories.length) nextErrors.category = t("errorCategory");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidId = !model
        ? "landing-service-model"
        : modelYears.length > 0 && !year
        ? "landing-service-year"
        : "landing-service-category";
      requestAnimationFrame(() => document.getElementById(firstInvalidId)?.focus());
      return;
    }

    const query = new URLSearchParams({ model });
    if (trim) query.set("trim", trim);
    if (year) query.set("year", year);
    categories.forEach((category) => query.append("category", category));
    router.push(`/services?${query.toString()}`);
  };

  return (
    <form className={styles.finder} onSubmit={handleSubmit} noValidate>
      <div className={styles.finderGrid}>
        <div className={`${styles.field} ${styles.modelField}`}>
          <label htmlFor="landing-service-model">{t("modelLabel")}</label>
          <ProductPickerField
            id="landing-service-model"
            value={model}
            onChange={(value) => {
              const nextModel = models.find((item) => item.value === value);
              setModel(value);
              setTrim("");
              setYear(nextModel?.years[0] ? String(nextModel.years[0]) : "");
              clearError("model");
              clearError("year");
            }}
            onClear={() => {
              setModel("");
              setTrim("");
              setYear("");
              clearError("model");
              clearError("year");
            }}
            clearLabel={t("clearModel")}
            closeRequestKey={closeModelPickerRequestKey}
            closeOnMenuPointerLeave
            onMenuPointerLeave={onModelPickerPointerLeave}
            appearance="services"
            groupedOptions
            groupedOptionsLabel={t("trimLabel")}
            secondaryValue={trim}
            onSecondaryChange={setTrim}
            placeholder={t("modelPlaceholder")}
            options={models.map((item) => ({
              id: item.value,
              name: item.name,
              image: item.image,
              powertrain: item.powertrain,
              variants: item.variants.map((variant) => ({ id: variant.value, name: variant.label })),
            }))}
            aria-label={t("modelLabel")}
            aria-invalid={Boolean(errors.model)}
            aria-describedby={errors.model ? "landing-service-model-error" : undefined}
          />
          {errors.model && <p id="landing-service-model-error" role="alert" className={styles.fieldError}>{errors.model}</p>}
        </div>

        {modelYears.length > 0 && (
          <div key={model} className={`${styles.field} ${styles.yearField}`}>
            <span id="landing-service-year-label" className={styles.fieldLabel}>{t("yearLabel")}</span>
            <div
              className={styles.yearOptions}
              role="radiogroup"
              aria-labelledby="landing-service-year-label"
              aria-invalid={Boolean(errors.year)}
              aria-describedby={errors.year ? "landing-service-year-error" : undefined}
            >
              {modelYears.map((item, index) => {
                const isSelected = year === item;
                return (
                  <button
                    id={index === 0 ? "landing-service-year" : undefined}
                    key={item}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => { setYear(item); clearError("year"); }}
                    className={`${styles.yearOption} ${isSelected ? styles.yearOptionSelected : ""}`}
                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            {errors.year && <p id="landing-service-year-error" role="alert" className={styles.fieldError}>{errors.year}</p>}
          </div>
        )}

        <div className={`${styles.field} ${styles.categoryField}`}>
          <label htmlFor="landing-service-category">{t("categoryLabel")}</label>
          <CustomSelect
            id="landing-service-category"
            multiple
            value={categories}
            onChange={(value) => { setCategories(value); clearError("category"); }}
            buttonClassName="!min-h-[32px] !py-1.5"
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
