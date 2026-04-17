"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { CarModel, getLocalizedValue } from "@/lib/types";

interface BookingFormProps {
  models: CarModel[];
}

export default function BookingForm({ models }: BookingFormProps) {
  const locale = useLocale();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    model: "",
    date: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const labels = {
    name: locale === "ka" ? "სახელი და გვარი" : "Full Name",
    phone: locale === "ka" ? "ტელეფონი" : "Phone Number",
    email: locale === "ka" ? "ელ. ფოსტა" : "Email Address",
    model: locale === "ka" ? "მოდელი" : "Model of Interest",
    date: locale === "ka" ? "სასურველი თარიღი" : "Preferred Date",
    message: locale === "ka" ? "შენიშვნა (სურვილისამებრ)" : "Message (optional)",
    submit: locale === "ka" ? "ტესტ დრაივის დაჯავშნა" : "Book Test Drive",
    success: locale === "ka" ? "თქვენი მოთხოვნა მიღებულია! დაგიკავშირდებით მალე." : "Your request has been received! We will contact you shortly.",
    required: locale === "ka" ? "სავალდებულო" : "Required",
    selectModel: locale === "ka" ? "აირჩიეთ მოდელი" : "Select a model",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — replace with real API/email endpoint
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = "w-full bg-bg-tertiary border border-white/[0.08] rounded-button px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all duration-200";

  if (submitted) {
    return (
      <div className="glass-card p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-gt-green/20 border border-gt-green/40 flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-gt-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
          {locale === "ka" ? "დადასტურებულია!" : "Confirmed!"}
        </p>
        <p className="text-white/55 font-light" style={{ fontFamily: "var(--font-source-sans)" }}>
          {labels.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
            {labels.name} <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={locale === "ka" ? "გიორგი ბერიძე" : "John Smith"}
            className={inputClass}
            style={{ fontFamily: "var(--font-source-sans)" }}
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
            {labels.phone} <span className="text-accent">*</span>
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+995 5XX XXX XXX"
            className={inputClass}
            style={{ fontFamily: "var(--font-source-sans)" }}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
          {labels.email}
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
          className={inputClass}
          style={{ fontFamily: "var(--font-source-sans)" }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
            {labels.model} <span className="text-accent">*</span>
          </label>
          <select
            required
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className={inputClass + " cursor-pointer"}
            style={{ fontFamily: "var(--font-source-sans)" }}
          >
            <option value="">{labels.selectModel}</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {getLocalizedValue(m.name, locale)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
            {labels.date} <span className="text-accent">*</span>
          </label>
          <input
            type="date"
            required
            value={form.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass}
            style={{ fontFamily: "var(--font-source-sans)" }}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
          {labels.message}
        </label>
        <textarea
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={locale === "ka" ? "დამატებითი ინფორმაცია..." : "Any additional information..."}
          className={inputClass + " resize-none"}
          style={{ fontFamily: "var(--font-source-sans)" }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-accent text-bg-primary font-semibold rounded-button hover:bg-accent/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "0.04em" }}
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {locale === "ka" ? "იგზავნება..." : "Sending..."}
          </>
        ) : (
          labels.submit
        )}
      </button>
    </form>
  );
}
