"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TestDriveModalProps {
  open: boolean;
  locale: string;
  onClose: () => void;
  onConfirm: (flags: AgreementFlags) => void;
}

export interface AgreementFlags {
  minAgeConfirmed: boolean;
  driversLicenseConfirmed: boolean;
  contactConsentConfirmed: boolean;
  safetyAcknowledgementConfirmed: boolean;
}

const copy = {
  en: {
    title: "Test Drive Eligibility & Confirmation",
    intro: "Before submitting your request, please confirm the following:",
    items: [
      "I am at least 21 years old",
      "I hold a valid driver's license",
      "I understand that submitting this form is a request, not a guaranteed booking",
      "I understand that test drive availability depends on vehicle availability, scheduling, and dealership confirmation",
      "I agree that BYD Tbilisi / GT may contact me by phone or email regarding this request",
    ],
    disclaimer:
      "BYD Tbilisi reserves the right to verify eligibility before confirming a test drive appointment. A valid driver's license may be required at the showroom. Test drive conditions, route, and final confirmation remain subject to dealership approval.",
    checks: [
      "I confirm that I am at least 21 years old",
      "I confirm that I hold a valid driver's license",
      "I agree to be contacted regarding this request",
      "I understand that this is a booking request and must be confirmed by the dealership",
    ],
    cancel: "Cancel",
    confirm: "Confirm and Submit",
  },
  ka: {
    title: "ტესტდრაივის პირობების დადასტურება",
    intro: "გთხოვთ, განაცხადის გაგზავნამდე დაადასტუროთ შემდეგი:",
    items: [
      "ვარ მინიმუმ 21 წლის",
      "მაქვს მოქმედი მართვის მოწმობა",
      "მესმის, რომ ამ ფორმის გაგზავნა წარმოადგენს მოთხოვნას და არა ავტომატურად დადასტურებულ ჯავშანს",
      "მესმის, რომ ტესტდრაივის ხელმისაწვდომობა დამოკიდებულია ავტომობილის ხელმისაწვდომობაზე, განრიგზე და დილერის დადასტურებაზე",
      "ვეთანხმები, რომ BYD Tbilisi / GT დამიკავშირდეს ტელეფონით ან ელფოსტით ამ მოთხოვნასთან დაკავშირებით",
    ],
    disclaimer:
      "BYD Tbilisi უფლებამოსილია გადაამოწმოს მომხმარებლის შესაბამისობა ტესტდრაივის დადასტურებამდე. შოურუმში შესაძლოა მოთხოვნილი იყოს მოქმედი მართვის მოწმობის წარდგენა. ტესტდრაივის პირობები, მარშრუტი და საბოლოო დადასტურება დამოკიდებულია დილერის გადაწყვეტილებაზე.",
    checks: [
      "ვადასტურებ, რომ ვარ მინიმუმ 21 წლის",
      "ვადასტურებ, რომ მაქვს მოქმედი მართვის მოწმობა",
      "ვეთანხმები, რომ დამიკავშირდნენ ამ მოთხოვნასთან დაკავშირებით",
      "მესმის, რომ ეს არის მოთხოვნა და არა ავტომატურად დადასტურებული ჯავშანი",
    ],
    cancel: "გაუქმება",
    confirm: "დადასტურება და გაგზავნა",
  },
};

export default function TestDriveModal({
  open,
  locale,
  onClose,
  onConfirm,
}: TestDriveModalProps) {
  const t = locale === "ka" ? copy.ka : copy.en;
  const [checks, setChecks] = useState([false, false, false, false]);

  const allChecked = checks.every(Boolean);

  // Reset when modal opens
  useEffect(() => {
    if (open) setChecks([false, false, false, false]);
  }, [open]);

  // Close on Escape
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  const toggle = (idx: number) =>
    setChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));

  const handleConfirm = () => {
    if (!allChecked) return;
    onConfirm({
      minAgeConfirmed: checks[0],
      driversLicenseConfirmed: checks[1],
      contactConsentConfirmed: checks[2],
      safetyAcknowledgementConfirmed: checks[3],
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-bg-secondary border border-white/[0.1] rounded-card shadow-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-bg-secondary/95 backdrop-blur-sm border-b border-white/[0.06] px-6 py-5 z-10">
              <div className="flex items-start justify-between">
                <h2
                  className="text-lg font-bold text-white pr-8"
                  style={{ fontFamily: "var(--font-source-sans)" }}
                >
                  {t.title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white transition-colors p-1"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Intro */}
              <p
                className="text-sm text-white/60 leading-relaxed"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {t.intro}
              </p>

              {/* Requirements list */}
              <ul className="space-y-2.5">
                {t.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-white/75"
                    style={{ fontFamily: "var(--font-source-sans)" }}
                  >
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gt-green shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Disclaimer */}
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-button p-4">
                <p
                  className="text-xs text-white/40 leading-relaxed"
                  style={{ fontFamily: "var(--font-source-sans)" }}
                >
                  {t.disclaimer}
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                {t.checks.map((label, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="relative mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={checks[idx]}
                        onChange={() => toggle(idx)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded border border-white/20 bg-white/[0.04] peer-checked:bg-gt-green peer-checked:border-gt-green transition-all duration-200 flex items-center justify-center">
                        {checks[idx] && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span
                      className="text-sm text-white/65 group-hover:text-white/80 transition-colors leading-snug"
                      style={{ fontFamily: "var(--font-source-sans)" }}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="sticky bottom-0 bg-bg-secondary/95 backdrop-blur-sm border-t border-white/[0.06] px-6 py-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-5 border border-white/15 text-white/60 rounded-button hover:border-white/30 hover:text-white/80 transition-all duration-200 text-sm font-medium"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!allChecked}
                className="flex-1 py-3 px-5 bg-gt-green text-[#1A1E28] font-semibold rounded-button hover:bg-gt-green/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                style={{ fontFamily: "var(--font-source-sans)" }}
              >
                {t.confirm}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
