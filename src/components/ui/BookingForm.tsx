"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { getOfficialTrimLabel, testDriveModels, TIME_SLOTS } from "@/lib/test-drive";
import TestDriveModal, { AgreementFlags } from "./TestDriveModal";
import CustomSelect from "./CustomSelect";

const labels = {
  en: {
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    model: "Product",
    modelHelper: "Select a BYD product family",
    version: "Version / Powertrain",
    versionHelper: "Select a powertrain variant",
    selectedTrim: "Selected trim",
    date: "Preferred Date",
    time: "Preferred Time",
    message: "Notes (optional)",
    submit: "Review & Confirm",
    sending: "Submitting...",
    required: "Required",
    selectModel: "Select a product",
    selectVersion: "Select a version",
    selectTime: "Select a time slot",
    successTitle: "Request Received!",
    successText:
      "Your test drive request has been received. Our team will contact you to confirm availability.",
    newRequest: "Submit Another Request",
    validationError: "Please fill in all required fields",
  },
  ka: {
    fullName: "სახელი და გვარი",
    phone: "ტელეფონი",
    email: "ელ. ფოსტა",
    model: "პროდუქტი",
    modelHelper: "აირჩიეთ BYD პროდუქტი",
    version: "ვერსია / ძრავის ტიპი",
    versionHelper: "აირჩიეთ ძრავის ვარიანტი",
    selectedTrim: "არჩეული კომპლექტაცია",
    date: "სასურველი თარიღი",
    time: "სასურველი დრო",
    message: "შენიშვნა (სურვილისამებრ)",
    submit: "გადახედვა და დადასტურება",
    sending: "იგზავნება...",
    required: "სავალდებულო",
    selectModel: "აირჩიეთ პროდუქტი",
    selectVersion: "აირჩიეთ ვერსია",
    selectTime: "აირჩიეთ დრო",
    successTitle: "მოთხოვნა მიღებულია!",
    successText:
      "თქვენი ტესტდრაივის მოთხოვნა მიღებულია. ჩვენი გუნდი დაგიკავშირდებათ ხელმისაწვდომობის დასადასტურებლად.",
    newRequest: "ახალი მოთხოვნის გაგზავნა",
    validationError: "გთხოვთ შეავსოთ ყველა სავალდებულო ველი",
  },
};

interface BookingFormProps {
  initialModelId?: string;
  initialVersionId?: string;
  initialTrimId?: string;
}

export default function BookingForm({
  initialModelId,
  initialVersionId,
  initialTrimId,
}: BookingFormProps) {
  const locale = useLocale() as "en" | "ka";
  const appliedInitialSelection = useRef(false);
  const t = labels[locale];

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

  const selectedFamily = testDriveModels.find(
    (m) => m.id === form.modelFamilyId
  );
  const versions = selectedFamily?.versions ?? [];
  const selectedTrimLabel = form.trimId && form.versionId
    ? getOfficialTrimLabel(form.versionId, form.trimId)
    : undefined;

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
      setForm((prev) => ({ ...prev, ...versionMatch, trimId: initialTrimId ?? "" }));
      return;
    }

    const familyMatch = testDriveModels.find(
      (model) => model.id === requestedId
    );
    if (!familyMatch) return;

    setForm((prev) => ({
      ...prev,
      modelFamilyId: familyMatch.id,
      versionId:
        familyMatch.versions.length === 1 ? familyMatch.versions[0].id : "",
      trimId: initialTrimId ?? "",
    }));
  }, [initialModelId, initialTrimId, initialVersionId]);

  const set = (field: string, value: string) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleModelChange = (modelId: string) => {
    setError("");
    setForm((prev) => ({ ...prev, modelFamilyId: modelId, versionId: "", trimId: "" }));
  };

  const validateAndOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    const required = [
      "fullName",
      "phone",
      "email",
      "modelFamilyId",
      "versionId",
      "preferredDate",
      "preferredTimeSlot",
    ] as const;
    for (const field of required) {
      if (!form[field].trim()) {
        setError(t.validationError);
        return;
      }
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
        className="content-surface p-6 md:p-8 space-y-5"
      >
        {/* Name + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.fullName} <span className="text-byd-red">*</span>
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder={locale === "ka" ? "გიორგი ბერიძე" : "John Smith"}
              className={inputClass}
              style={{ fontFamily: "var(--font-montserrat)" }}
            />
          </div>
          <div>
            <label
              className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.phone} <span className="text-byd-red">*</span>
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+995 5XX XXX XXX"
              className={inputClass}
              style={{ fontFamily: "var(--font-montserrat)" }}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {t.email} <span className="text-byd-red">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            style={{ fontFamily: "var(--font-montserrat)" }}
          />
        </div>

        {/* Model + Version */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.model} <span className="text-byd-red">*</span>
            </label>
            <CustomSelect
              required
              aria-label={t.model}
              value={form.modelFamilyId}
              onChange={handleModelChange}
              placeholder={t.selectModel}
              options={[{ value: "", label: t.selectModel }, ...testDriveModels.map((model) => ({ value: model.id, label: model.name }))]}
              buttonClassName="px-4 py-3"
              style={{ fontFamily: "var(--font-montserrat)" }}
            />
            <p
              className="text-[11px] text-[#7A8080] mt-1.5"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.modelHelper}
            </p>
          </div>
          <div>
            <label
              className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.version} <span className="text-byd-red">*</span>
            </label>
            <CustomSelect
              required
              aria-label={t.version}
              value={form.versionId}
              onChange={(versionId) => {
                setError("");
                setForm((prev) => ({ ...prev, versionId, trimId: "" }));
              }}
              disabled={!selectedFamily}
              placeholder={t.selectVersion}
              options={[{ value: "", label: t.selectVersion }, ...versions.map((version) => ({ value: version.id, label: version.label }))]}
              buttonClassName="px-4 py-3"
              style={{ fontFamily: "var(--font-montserrat)" }}
            />
            <p
              className="text-[11px] text-[#7A8080] mt-1.5"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.versionHelper}
            </p>
            {selectedTrimLabel && (
              <div className="mt-3 border-l-2 border-byd-red bg-byd-red/[0.06] px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#686D71]">{t.selectedTrim}</p>
                <p className="mt-0.5 text-sm font-semibold text-[#252728]">{selectedTrimLabel}</p>
              </div>
            )}
          </div>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.date} <span className="text-byd-red">*</span>
            </label>
            <input
              type="date"
              required
              value={form.preferredDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => set("preferredDate", e.target.value)}
              className={inputClass}
              style={{ fontFamily: "var(--font-montserrat)" }}
            />
          </div>
          <div>
            <label
              className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {t.time} <span className="text-byd-red">*</span>
            </label>
            <CustomSelect
              required
              aria-label={t.time}
              value={form.preferredTimeSlot}
              onChange={(timeSlot) => set("preferredTimeSlot", timeSlot)}
              placeholder={t.selectTime}
              options={[{ value: "", label: t.selectTime }, ...TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))]}
              buttonClassName="px-4 py-3"
              style={{ fontFamily: "var(--font-montserrat)" }}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            className="block text-xs text-[#686D71] uppercase tracking-wider mb-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {t.message}
          </label>
          <textarea
            rows={3}
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
            className="text-sm text-red-400"
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
