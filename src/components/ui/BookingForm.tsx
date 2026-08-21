"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { getTrimsForVersion, testDriveModels, TIME_SLOTS } from "@/lib/test-drive";
import TestDriveModal, { AgreementFlags } from "./TestDriveModal";
import ProductPickerField, { type ProductPickerOption } from "./ProductPickerField";
import DateTimeField from "./DateTimeField";
import PhoneField from "./PhoneField";
import { useAvailability } from "./useAvailability";
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  normalizeName,
  validateEmail,
  validateName,
  type EmailValidationError,
  type NameValidationError,
} from "@/lib/validation";

const labels = {
  en: {
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    model: "Product",
    modelHelper: "Select a BYD product family",
    version: "Version / Powertrain",
    versionHelper: "Select a powertrain variant",
    trim: "Trim",
    trimHelper: "Select a trim level",
    trimLocked: "Choose a version first",
    selectedTrim: "Selected trim",
    schedule: "Preferred Date & Time",
    message: "Notes (optional)",
    submit: "Review & Confirm",
    sending: "Submitting...",
    required: "Required",
    selectModel: "Select a product",
    selectVersion: "Select a version",
    clearModel: "Clear selected product",
    versionLocked: "Choose a product first",
    successTitle: "Request Received!",
    successText:
      "Your test drive request has been received. Our team will contact you to confirm availability.",
    newRequest: "Submit Another Request",
    validationError: "Please fill in all required fields",
    nameHelper: "First and last name, 2–100 characters",
    nameErrors: {
      required: "Enter your full name.",
      tooShort: "Name must be at least 2 characters.",
      tooLong: "Name must be 100 characters or fewer.",
      charset: "Use letters, spaces, hyphens and apostrophes only.",
      singleWord: "Enter first and last name, separated by a space.",
    },
    emailErrors: {
      required: "Enter your email address.",
      tooLong: "Email must be 320 characters or fewer.",
      format: "Enter a valid email address, for example name@example.com.",
      charset: "This email contains characters that are not allowed.",
    },
  },
  ka: {
    fullName: "სახელი და გვარი",
    phone: "ტელეფონი",
    email: "ელ. ფოსტა",
    model: "პროდუქტი",
    modelHelper: "აირჩიეთ BYD პროდუქტი",
    version: "ვერსია / ძრავის ტიპი",
    versionHelper: "აირჩიეთ ძრავის ვარიანტი",
    trim: "კომპლექტაცია",
    trimHelper: "აირჩიეთ კომპლექტაცია",
    trimLocked: "ჯერ აირჩიეთ ვერსია",
    selectedTrim: "არჩეული კომპლექტაცია",
    schedule: "სასურველი თარიღი და დრო",
    message: "შენიშვნა (სურვილისამებრ)",
    submit: "გადახედვა და დადასტურება",
    sending: "იგზავნება...",
    required: "სავალდებულო",
    selectModel: "აირჩიეთ პროდუქტი",
    selectVersion: "აირჩიეთ ვერსია",
    clearModel: "პროდუქტის გასუფთავება",
    versionLocked: "ჯერ აირჩიეთ პროდუქტი",
    successTitle: "მოთხოვნა მიღებულია!",
    successText:
      "თქვენი ტესტდრაივის მოთხოვნა მიღებულია. ჩვენი გუნდი დაგიკავშირდებათ ხელმისაწვდომობის დასადასტურებლად.",
    newRequest: "ახალი მოთხოვნის გაგზავნა",
    validationError: "გთხოვთ შეავსოთ ყველა სავალდებულო ველი",
    nameHelper: "სახელი და გვარი, 2–100 სიმბოლო",
    nameErrors: {
      required: "შეიყვანეთ სახელი და გვარი.",
      tooShort: "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს.",
      tooLong: "სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს.",
      charset: "გამოიყენეთ მხოლოდ ასოები, ხარვეზი, დეფისი და აპოსტროფი.",
      singleWord: "შეიყვანეთ სახელი და გვარი ხარვეზით გამოყოფილი.",
    },
    emailErrors: {
      required: "შეიყვანეთ ელ. ფოსტა.",
      tooLong: "ელ. ფოსტა არ უნდა აღემატებოდეს 320 სიმბოლოს.",
      format: "შეიყვანეთ სწორი ელ. ფოსტა, მაგალითად name@example.com.",
      charset: "ელ. ფოსტა შეიცავს დაუშვებელ სიმბოლოებს.",
    },
  },
};

interface BookingFormProps {
  initialModelId?: string;
  initialVersionId?: string;
  initialTrimId?: string;
}

const PRODUCT_IMAGES: Record<string, string> = {
  "seal-06": "/images/models/seal-06-dmi/hero.jpg",
  "sealion-06": "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
  "yuan-up": "/images/models/yuan-up-ev/hero.jpg",
};

export default function BookingForm({
  initialModelId,
  initialVersionId,
  initialTrimId,
}: BookingFormProps) {
  const locale = useLocale() as "en" | "ka";
  const appliedInitialSelection = useRef(false);
  const t = labels[locale];
  const availability = useAvailability(TIME_SLOTS);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    modelFamilyId: "",
    versionId: "",
    trimId: "",
    preferredDate: "",
    preferredTimeSlot: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState<NameValidationError | null>(null);
  const [emailError, setEmailError] = useState<EmailValidationError | null>(null);
  const [phoneValid, setPhoneValid] = useState(false);
  const [showFieldErrors, setShowFieldErrors] = useState(false);

  const selectedFamily = testDriveModels.find(
    (m) => m.id === form.modelFamilyId
  );
  const versions = selectedFamily?.versions ?? [];
  const trims = form.versionId ? getTrimsForVersion(form.versionId) : [];

  /** A version offering exactly one trim needs no second choice. */
  const soleTrimFor = (versionId: string) => {
    const available = versionId ? getTrimsForVersion(versionId) : [];
    return available.length === 1 ? available[0].id : "";
  };

  useEffect(() => {
    if (appliedInitialSelection.current) return;
    appliedInitialSelection.current = true;

    const requestedId = initialVersionId || initialModelId;
    if (!requestedId) return;

    const versionMatch = testDriveModels
      .flatMap((model) =>
        model.versions.map((version) => ({
          modelFamilyId: model.id,
          versionId: version.id,
        }))
      )
      .find((item) => item.versionId === requestedId);

    if (versionMatch) {
      setForm((prev) => ({
        ...prev,
        ...versionMatch,
        trimId: initialTrimId ?? soleTrimFor(versionMatch.versionId),
      }));
      return;
    }

    const familyMatch = testDriveModels.find(
      (model) => model.id === requestedId
    );
    if (!familyMatch) return;

    const onlyVersionId =
      familyMatch.versions.length === 1 ? familyMatch.versions[0].id : "";

    setForm((prev) => ({
      ...prev,
      modelFamilyId: familyMatch.id,
      versionId: onlyVersionId,
      trimId: initialTrimId ?? soleTrimFor(onlyVersionId),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialModelId, initialTrimId, initialVersionId]);

  const handleVersionChange = (versionId: string) => {
    setError("");
    setForm((prev) =>
      // Clicking the selected version clears it, and the trim with it.
      prev.versionId === versionId
        ? { ...prev, versionId: "", trimId: "" }
        : { ...prev, versionId, trimId: soleTrimFor(versionId) },
    );
  };

  const handleTrimChange = (trimId: string) => {
    setError("");
    setForm((prev) => ({ ...prev, trimId: prev.trimId === trimId ? "" : trimId }));
  };

  const set = (field: string, value: string) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleModelChange = (modelId: string) => {
    setError("");
    const family = testDriveModels.find((model) => model.id === modelId);
    // A single-powertrain product needs no second choice — pick it automatically.
    const onlyVersionId = family?.versions.length === 1 ? family.versions[0].id : "";
    setForm((prev) => ({
      ...prev,
      modelFamilyId: modelId,
      versionId: onlyVersionId,
      trimId: soleTrimFor(onlyVersionId),
    }));
  };

  const productOptions: ProductPickerOption[] = testDriveModels.map((model) => ({
    id: model.id,
    name: model.name,
    subtitle: model.versions.map((version) => version.label).join(" · "),
    image: PRODUCT_IMAGES[model.id] ?? "/images/models/seal-06-dmi/hero.jpg",
  }));

  const validateAndOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFieldErrors(true);

    const nextNameError = validateName(form.fullName, { requireFullName: true });
    const nextEmailError = validateEmail(form.email);
    setNameError(nextNameError);
    setEmailError(nextEmailError);

    if (nextNameError || nextEmailError || !phoneValid) {
      setError(t.validationError);
      return;
    }

    const required = [
      "fullName",
      "phone",
      "email",
      "preferredDate",
      "preferredTimeSlot",
    ] as const;
    for (const field of required) {
      if (!form[field].trim()) {
        setError(t.validationError);
        return;
      }
    }

    // Product selection is optional, but a selected product still needs a version.
    if (form.modelFamilyId && !form.versionId) {
      setError(t.validationError);
      return;
    }

    // Trim is required only where the chosen version actually offers trims.
    if (trims.length > 0 && !form.trimId) {
      setError(t.validationError);
      return;
    }

    setModalOpen(true);
  };

  const handleConfirm = async (flags: AgreementFlags) => {
    setModalOpen(false);
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/test-drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fullName: normalizeName(form.fullName),
          email: form.email.trim(),
          language: locale,
          agreement: {
            accepted: true,
            acceptedAt: new Date().toISOString(),
            ...flags,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "form-field-light px-4 py-3 text-sm";
  const invalidClass = " !border-byd-red";

  if (submitted) {
    return (
      <div className="content-surface p-10 text-center">
        <div className="w-14 h-14 bg-byd-red/20 border border-byd-red/40 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-7 h-7 text-byd-red"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p
          className="text-[#252728] font-semibold text-lg mb-2"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {t.successTitle}
        </p>
        <p
          className="text-[#686D71] font-light mb-6"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {t.successText}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setShowFieldErrors(false);
            setNameError(null);
            setEmailError(null);
            setPhoneValid(false);
            setForm({
              fullName: "",
              phone: "",
              email: "",
              modelFamilyId: "",
              versionId: "",
              trimId: "",
              preferredDate: "",
              preferredTimeSlot: "",
              message: "",
            });
          }}
          className="text-sm text-byd-red hover:text-byd-red/80 transition-colors"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {t.newRequest}
        </button>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={validateAndOpenModal}
        noValidate
        className="content-surface p-6 md:p-8 space-y-5"
      >
        {/* Name + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="booking-full-name"
              className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.fullName} <span className="text-byd-red">*</span>
            </label>
            <input
              id="booking-full-name"
              type="text"
              required
              autoComplete="name"
              maxLength={NAME_MAX_LENGTH}
              value={form.fullName}
              onChange={(e) => {
                set("fullName", e.target.value);
                if (nameError) setNameError(null);
              }}
              onBlur={() => setNameError(validateName(form.fullName, { requireFullName: true }))}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "booking-full-name-error" : "booking-full-name-helper"}
              placeholder={locale === "ka" ? "გიორგი ბერიძე" : "John Smith"}
              className={inputClass + (nameError ? invalidClass : "")}
              style={{ fontFamily: "var(--font-montserrat)" }}
            />
            {nameError ? (
              <p id="booking-full-name-error" role="alert" className="mt-1.5 text-xs text-byd-red">
                {t.nameErrors[nameError]}
              </p>
            ) : (
              <p id="booking-full-name-helper" className="text-[11px] text-[#7A8080] mt-1.5" style={{ fontFamily: "var(--font-montserrat)" }}>
                {t.nameHelper}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.phone} <span className="text-byd-red">*</span>
            </label>
            <PhoneField
              required
              value={form.phone}
              onChange={(value) => set("phone", value)}
              onValidityChange={(valid) => setPhoneValid(valid)}
              aria-label={t.phone}
              className="form-field-light"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="booking-email"
            className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {t.email} <span className="text-byd-red">*</span>
          </label>
          <input
            id="booking-email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={EMAIL_MAX_LENGTH}
            value={form.email}
            onChange={(e) => {
              set("email", e.target.value);
              if (emailError) setEmailError(null);
            }}
            onBlur={() => setEmailError(validateEmail(form.email))}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "booking-email-error" : undefined}
            placeholder="you@example.com"
            className={inputClass + (emailError ? invalidClass : "")}
            style={{ fontFamily: "var(--font-montserrat)" }}
          />
          {emailError && (
            <p id="booking-email-error" role="alert" className="mt-1.5 text-xs text-byd-red">
              {t.emailErrors[emailError]}
            </p>
          )}
        </div>

        {/* Product + Version — equal-height columns keep labels, controls and
            helper text on shared baselines. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          <div className="flex h-full flex-col">
            <label
              className="byd-field-label"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.model}
            </label>
            <ProductPickerField
              aria-label={t.model}
              value={form.modelFamilyId}
              options={productOptions}
              onChange={handleModelChange}
              onClear={() => setForm((prev) => ({ ...prev, modelFamilyId: "", versionId: "", trimId: "" }))}
              clearLabel={t.clearModel}
              placeholder={t.selectModel}
            />
            <p
              className="byd-field-helper"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.modelHelper}
            </p>
          </div>
          <div className="flex h-full flex-col">
            <label
              className="byd-field-label"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.version} {selectedFamily && <span className="text-byd-red">*</span>}
            </label>
            <div
              role="radiogroup"
              aria-label={t.version}
              className={`byd-version-toggle ${selectedFamily ? "" : "is-locked"}`}
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {selectedFamily ? (
                versions.map((version) => {
                  const isSelected = form.versionId === version.id;
                  return (
                    <button
                      key={version.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleVersionChange(version.id)}
                      className={`byd-version-option ${isSelected ? "is-selected" : ""}`}
                    >
                      {version.label}
                    </button>
                  );
                })
              ) : (
                <span className="byd-version-placeholder">{t.versionLocked}</span>
              )}
            </div>
            <p
              className="byd-field-helper"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.versionHelper}
            </p>
          </div>
        </div>

        {/* Trim — revealed once a version is chosen. Keyed on versionId so the
            pop-in replays whenever the trim set changes. */}
        {trims.length > 0 && (
          <div key={form.versionId} className="byd-trim-block flex flex-col">
            <label
              className="byd-field-label"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.trim} <span className="text-byd-red">*</span>
            </label>
            <div
              role="radiogroup"
              aria-label={t.trim}
              className="byd-trim-toggle"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {trims.map((trim, index) => {
                const isSelected = form.trimId === trim.id;
                return (
                  <button
                    key={trim.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleTrimChange(trim.id)}
                    className={`byd-trim-option ${isSelected ? "is-selected" : ""}`}
                    style={{ animationDelay: `${index * 52}ms` }}
                  >
                    {trim.label}
                  </button>
                );
              })}
            </div>
            <p
              className="byd-field-helper"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.trimHelper}
            </p>
          </div>
        )}

        {/* Date + Time — one combined scheduler */}
        <div>
          <p
            className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {t.schedule} <span className="text-byd-red">*</span>
          </p>
          <DateTimeField
            date={form.preferredDate}
            time={form.preferredTimeSlot}
            onDateChange={(value) => set("preferredDate", value)}
            onTimeChange={(value) => set("preferredTimeSlot", value)}
            slots={availability.slots}
            bookedSlots={availability.bookedSlots}
            min={availability.min}
            max={availability.max}
            showError={showFieldErrors}
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="booking-message"
            className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {t.message}
          </label>
          <textarea
            id="booking-message"
            rows={3}
            maxLength={1000}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder={
              locale === "ka"
                ? "დამატებითი ინფორმაცია..."
                : "Any additional information..."
            }
            className={inputClass + " resize-none"}
            style={{ fontFamily: "var(--font-montserrat)" }}
          />
        </div>

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="text-sm text-byd-red"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-byd-red text-white font-semibold hover:bg-[#A80912] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            fontFamily: "var(--font-montserrat)",
            letterSpacing: "0.04em",
          }}
        >
          {loading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              {t.sending}
            </>
          ) : (
            <>
              {t.submit}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </>
          )}
        </button>
      </form>

      <TestDriveModal
        open={modalOpen}
        locale={locale}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
