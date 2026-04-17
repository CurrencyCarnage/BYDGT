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

  const inputClass = "w-full bg-bg-tertiary border border-white/[0.08] rounded-button px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-all duration-200";

  if (submitted) {
    return (
      <div className="glass-card p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-gt-green/20 border border-gt-green/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-gt-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white font-semibold mb-1" style={{ fontFamily: "var(--font-source-sans)" }}>
          {locale === "ka" ? "გამოგზავნილია!" : "Message Sent!"}
        </p>
        <p className="text-white/50 text-sm font-light" style={{ fontFamily: "var(--font-source-sans)" }}>
          {locale === "ka" ? "მალე დაგიკავშირდებით" : "We will get back to you shortly"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
            {locale === "ka" ? "სახელი" : "Name"} <span className="text-accent">*</span>
          </label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={locale === "ka" ? "გიორგი" : "John"} className={inputClass} style={{ fontFamily: "var(--font-source-sans)" }} />
        </div>
        <div>
          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
            {locale === "ka" ? "ტელეფონი" : "Phone"}
          </label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+995 5XX XXX XXX" className={inputClass} style={{ fontFamily: "var(--font-source-sans)" }} />
        </div>
      </div>

      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
          {locale === "ka" ? "ელ. ფოსტა" : "Email"} <span className="text-accent">*</span>
        </label>
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com" className={inputClass} style={{ fontFamily: "var(--font-source-sans)" }} />
      </div>

      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
          {locale === "ka" ? "თემა" : "Subject"}
        </label>
        <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder={locale === "ka" ? "მოდელის შესახებ კითხვა" : "Question about a model"} className={inputClass} style={{ fontFamily: "var(--font-source-sans)" }} />
      </div>

      <div>
        <label className="block text-xs text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-source-sans)" }}>
          {locale === "ka" ? "შეტყობინება" : "Message"} <span className="text-accent">*</span>
        </label>
        <textarea rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={locale === "ka" ? "თქვენი შეკითხვა..." : "Your message..."} className={inputClass + " resize-none"} style={{ fontFamily: "var(--font-source-sans)" }} />
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 bg-white text-bg-primary font-semibold rounded-button hover:bg-white/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ fontFamily: "var(--font-source-sans)", letterSpacing: "0.04em" }}>
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
