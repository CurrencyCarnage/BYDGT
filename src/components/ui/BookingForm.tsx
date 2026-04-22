"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { testDriveModels, TIME_SLOTS } from "@/lib/test-drive";
import TestDriveModal, { AgreementFlags } from "./TestDriveModal";

const labels = {
  en: {
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    model: "Model",
    modelHelper: "Select a BYD model family",
    version: "Version / Powertrain",
    versionHelper: "Select a powertrain variant",
    date: "Preferred Date",
    time: "Preferred Time",
    message: "Notes (optional)",
    submit: "Review & Confirm",
    sending: "Submitting...",
    required: "Required",
    selectModel: "Select a model",
    selectVersion: "Select a version",
    selectTime: "Select a time slot",
    successTitle: "Request Received!",
    successText: "Your test drive request has been received. Our team will contact you to confirm availability.",
    newRequest: "Submit Another Request",
    validationError: "Please fill in all required fields",
  },
  ka: {
    fullName: "სახელი და გვარი",
    phone: "ტელეფონი",
    email: "ელ. ფოსტა",
    model: "მოდელი",
    modelHelper: "აირჩიეთ BYD მოდელი",
    version: "ვერსია / ძრავის ტიპი",
    versionHelper: "აირჩიეთ ძრავის ვარიანტი",
    date: "სასურველი თარიღი",
    time: "სასურველი დრო",
    message: "შენიშვნა (სურვილისამებრ)",
    submit: "გადახედვა და დადასტურება",
    sending: "იგზავნება...",
    required: "სავალდებულო",
    selectModel: "აირჩიეთ მოდელი",
    selectVersion: "აირჩიეთ ვერსია",
    selectTime: "აირჩიეთ დრო",
    successTitle: "მოთხოვნა მიღებულია!",
    successText: "თქვენი ტესტდრაივის მოთხოვნა მიღებულია. ჩვენი გუნდი დაგიკავშირდებათ ხელმისაწვდომობის დასადასტურებლად.",
    newRequest: "ახალი მოთხოვნის გაგზავნა",
    validationError: "გთხოვთ შეავსოთ ყველა სავალდებულო ველი",
  },
};

export default function BookingForm() {
  const locale = useLocale() as "en" | "ka";
  const t = labels[locale];

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    modelFamilyId: "",
    versionId: "",
    preferredDate: "",
    preferredTimeSlot: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  const selectedFamily = testDriveModels.find((m) => m.id === form.modelFamilyId);
  const versions = selectedFamily?.versions ?? [];

  const set = (field: string, value: string) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleModelChange = (modelId: string) => {
    setError("");
    setForm((prev) => ({ ...prev, modelFamilyId: modelId, versionId: "" }));
  };

  const validateAndOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["fullName", "phone", "email", "modelFamilyId", "versionId", "preferredDate", "preferredTimeSlot"] as const;
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

  const inputClass =
    "w-full bg-bg-tertiary border border-white/[0.08] rounded-button px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-gt-green/50 focus:ring-1 focus:ring-gt-green/25 transition-all duration-200";

  if (submitted) {
    return (
      <div className="glass-card p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-gt-green/20 border border-gt-green/40 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-gt-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
          {t.successTitle}
        </p>
        <p className="text-white/55 font-light mb-6" style={{ fontFamily: "var(--font-source-sans)" }}>
          {t.successText}
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ fullName: "", phone: "", email: "", modelFamilyId: "", versionId: "", preferredDate: "", preferredTimeSlot: "", message: "" });
          }}
          className="text-sm text-gt-green hover:text-gt-green/80 transition-colors"
          style={{ fontFamily: "var(--font-source-sans)" }}
        >
          {t.newRequest}
        </button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={validateAndOpenModal} className="glass-card p-6 md:p-8 space-y-5">
        {/* Name + Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
              {t.fullName} <span className="text-gt-green">*</span>
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder={locale === "ka" ? "გიორგი ბერიძე" : "John Smith"}
              className={inputClass}
              style={{ fontFamily: "var(--font-source-sans)" }}
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
              {t.phone} <span className="text-gt-green">*</span>
            </label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+995 5XX XXX XXX"
              className={inputClass}
              style={{ fontFamily: "var(--font-source-sans)" }}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
            {t.email} <span className="text-gt-green">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            style={{ fontFamily: "var(--font-source-sans)" }}
          />
        </div>

        {/* Model + Version */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
              {t.model} <span className="text-gt-green">*</span>
            </label>
            <select
              required
              value={form.modelFamilyId}
              onChange={(e) => handleModelChange(e.target.value)}
              className={inputClass + " cursor-pointer"}
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              <option value="">{t.selectModel}</option>
              {testDriveModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-white/25 mt-1.5" style={{ fontFamily: "var(--font-source-sans)" }}>{t.modelHelper}</p>
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
              {t.version} <span className="text-gt-green">*</span>
            </label>
            <select
              required
              value={form.versionId}
              onChange={(e) => set("versionId", e.target.value)}
              disabled={!selectedFamily}
              className={inputClass + " cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"}
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              <option value="">{t.selectVersion}</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-white/25 mt-1.5" style={{ fontFamily: "var(--font-source-sans)" }}>{t.versionHelper}</p>
          </div>
        </div>

        {/* Date + Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
              {t.date} <span className="text-gt-green">*</span>
            </label>
            <input
              type="date"
              required
              value={form.preferredDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => set("preferredDate", e.target.value)}
              className={inputClass}
              style={{ fontFamily: "var(--font-source-sans)" }}
            />
          </div>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
              {t.time} <span className="text-gt-green">*</span>
            </label>
            <select
              required
              value={form.preferredTimeSlot}
              onChange={(e) => set("preferredTimeSlot", e.target.value)}
              className={inputClass + " cursor-pointer"}
              style={{ fontFamily: "var(--font-source-sans)" }}
            >
              <option value="">{t.selectTime}</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
            {t.message}
          </label>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder={locale === "ka" ? "დამატებითი ინფორმაცია..." : "Any additional information..."}
            className={inputClass + " resize-none"}
            style={{ fontFamily: "var(--font-source-sans)" }}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400" style={{ fontFamily: "var(--font-source-sans)" }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gt-green text-[#1A1E28] font-semibold rounded-button hover:bg-gt-green/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "0.04em" }}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t.sending}
            </>
          ) : (
            <>
              {t.submit}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
