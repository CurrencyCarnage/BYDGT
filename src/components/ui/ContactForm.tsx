"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import PhoneField from "./PhoneField";
import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  normalizeName,
  validateEmail,
  validateName,
  type EmailValidationError,
  type NameValidationError,
} from "@/lib/validation";

const fieldCopy = {
  en: {
    nameHelper: "2–100 characters",
    name: {
      required: "Enter your name.",
      tooShort: "Name must be at least 2 characters.",
      tooLong: "Name must be 100 characters or fewer.",
      charset: "Use letters, spaces, hyphens and apostrophes only.",
      singleWord: "Enter first and last name, separated by a space.",
    },
    email: {
      required: "Enter your email address.",
      tooLong: "Email must be 320 characters or fewer.",
      format: "Enter a valid email address, for example name@example.com.",
      charset: "This email contains characters that are not allowed.",
    },
  },
  ka: {
    nameHelper: "2–100 სიმბოლო",
    name: {
      required: "შეიყვანეთ სახელი.",
      tooShort: "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს.",
      tooLong: "სახელი არ უნდა აღემატებოდეს 100 სიმბოლოს.",
      charset: "გამოიყენეთ მხოლოდ ასოები, ხარვეზი, დეფისი და აპოსტროფი.",
      singleWord: "შეიყვანეთ სახელი და გვარი ხარვეზით გამოყოფილი.",
    },
    email: {
      required: "შეიყვანეთ ელ. ფოსტა.",
      tooLong: "ელ. ფოსტა არ უნდა აღემატებოდეს 320 სიმბოლოს.",
      format: "შეიყვანეთ სწორი ელ. ფოსტა, მაგალითად name@example.com.",
      charset: "ელ. ფოსტა შეიცავს დაუშვებელ სიმბოლოებს.",
    },
  },
};

export default function ContactForm({ initialSubject = "" }: { initialSubject?: string }) {
  const locale = useLocale();
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: initialSubject, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneValid, setPhoneValid] = useState(true);
  const [phoneError, setPhoneError] = useState(false);
  const [nameError, setNameError] = useState<NameValidationError | null>(null);
  const [emailError, setEmailError] = useState<EmailValidationError | null>(null);
  const copy = locale === "ka" ? fieldCopy.ka : fieldCopy.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextNameError = validateName(form.name);
    const nextEmailError = validateEmail(form.email);
    setNameError(nextNameError);
    setEmailError(nextEmailError);
    if (nextNameError || nextEmailError) return;
    if (!phoneValid) {
      setPhoneError(true);
      return;
    }
    setForm((current) => ({ ...current, name: normalizeName(current.name), email: current.email.trim() }));
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
        <p className="text-[var(--theme-text-secondary)] text-sm font-light" style={{ fontFamily: "var(--font-montserrat)" }}>
          {locale === "ka" ? "მალე დაგიკავშირდებით" : "We will get back to you shortly"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="content-surface p-6 md:p-8 space-y-5 h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-xs text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
            {locale === "ka" ? "სახელი" : "Name"} <span className="text-byd-red">*</span>
          </label>
          <input id="contact-name" type="text" required autoComplete="name" maxLength={NAME_MAX_LENGTH}
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); if (nameError) setNameError(null); }}
            onBlur={() => setNameError(validateName(form.name))}
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "contact-name-error" : "contact-name-helper"}
            placeholder={locale === "ka" ? "გიორგი" : "John"}
            className={inputClass + (nameError ? " !border-byd-red" : "")} style={{ fontFamily: "var(--font-montserrat)" }} />
          {nameError ? (
            <p id="contact-name-error" role="alert" className="mt-1.5 text-xs text-byd-red">{copy.name[nameError]}</p>
          ) : (
            <p id="contact-name-helper" className="mt-1.5 text-[11px] text-[var(--theme-text-secondary)]">{copy.nameHelper}</p>
          )}
        </div>
        <div>
          <label className="block text-xs text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
            {locale === "ka" ? "ტელეფონი" : "Phone"}
          </label>
          <PhoneField value={form.phone} onChange={(value) => setForm({ ...form, phone: value })}
            onValidityChange={(valid) => { setPhoneValid(valid); if (valid) setPhoneError(false); }} aria-label={locale === "ka" ? "ტელეფონი" : "Phone"}
            className="form-field-light" />
          {phoneError && (
            <p role="alert" className="mt-1.5 text-xs text-byd-red">
              {locale === "ka" ? "შეიყვანეთ სწორი ტელეფონის ნომერი" : "Enter a valid phone number"}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-xs text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
          {locale === "ka" ? "ელ. ფოსტა" : "Email"} <span className="text-byd-red">*</span>
        </label>
        <input id="contact-email" type="email" required autoComplete="email" inputMode="email" maxLength={EMAIL_MAX_LENGTH}
          value={form.email}
          onChange={(e) => { setForm({ ...form, email: e.target.value }); if (emailError) setEmailError(null); }}
          onBlur={() => setEmailError(validateEmail(form.email))}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "contact-email-error" : undefined}
          placeholder="you@example.com" className={inputClass + (emailError ? " !border-byd-red" : "")} style={{ fontFamily: "var(--font-montserrat)" }} />
        {emailError && (
          <p id="contact-email-error" role="alert" className="mt-1.5 text-xs text-byd-red">{copy.email[emailError]}</p>
        )}
      </div>

      <div>
        <label className="block text-xs text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
          {locale === "ka" ? "თემა" : "Subject"}
        </label>
        <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder={locale === "ka" ? "პროდუქტის შესახებ კითხვა" : "Question about a product"} className={inputClass} style={{ fontFamily: "var(--font-montserrat)" }} />
      </div>

      <div className="flex-1 flex flex-col">
        <label className="block text-xs text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
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
