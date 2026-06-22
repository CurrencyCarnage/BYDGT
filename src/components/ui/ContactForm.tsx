"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

export default function ContactForm() {
  const locale = useLocale();
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const inputClass = "form-field-light px-4 py-3 text-sm";

  if (submitted) {
    return (
      <div className="content-surface p-10 text-center h-full flex flex-col items-center justify-center">
        <div className="w-12 h-12 bg-byd-red/20 border border-byd-red/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-byd-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-[#252728] font-semibold mb-1" style={{ fontFamily: "var(--font-montserrat)" }}>
          {locale === "ka" ? "გამოგზავნილია!" : "Message Sent!"}
        </p>
        <p className="text-[#686D71] text-sm font-light" style={{ fontFamily: "var(--font-montserrat)" }}>
          {locale === "ka" ? "მალე დაგიკავშირდებით" : "We will get back to you shortly"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="content-surface p-6 md:p-8 space-y-5 h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-[#686D71] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
            {locale === "ka" ? "სახელი" : "Name"} <span className="text-byd-red">*</span>
          </label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={locale === "ka" ? "გიორგი" : "John"} className={inputClass} style={{ fontFamily: "var(--font-montserrat)" }} />
        </div>
        <div>
          <label className="block text-xs text-[#686D71] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
            {locale === "ka" ? "ტელეფონი" : "Phone"}
          </label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+995 5XX XXX XXX" className={inputClass} style={{ fontFamily: "var(--font-montserrat)" }} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#686D71] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
          {locale === "ka" ? "ელ. ფოსტა" : "Email"} <span className="text-byd-red">*</span>
        </label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com" className={inputClass} style={{ fontFamily: "var(--font-montserrat)" }} />
      </div>

      <div>
        <label className="block text-xs text-[#686D71] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
          {locale === "ka" ? "თემა" : "Subject"}
        </label>
        <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder={locale === "ka" ? "მოდელის შესახებ კითხვა" : "Question about a model"} className={inputClass} style={{ fontFamily: "var(--font-montserrat)" }} />
      </div>

      <div className="flex-1 flex flex-col">
        <label className="block text-xs text-[#686D71] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
          {locale === "ka" ? "შეტყობინება" : "Message"} <span className="text-byd-red">*</span>
        </label>
        <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={locale === "ka" ? "თქვენი შეკითხვა..." : "Your message..."} className={inputClass + " resize-none flex-1 min-h-[120px]"} style={{ fontFamily: "var(--font-montserrat)" }} />
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-byd-red text-white font-semibold hover:bg-[#A80912] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-auto"
        style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "0.04em" }}>
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {locale === "ka" ? "იგზავნება..." : "Sending..."}
          </>
        ) : locale === "ka" ? "გაგზავნა" : "Send Message"}
      </button>
    </form>
  );
}
