"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface SelectedModel {
  id: string;
  name: string;
  image: string;
}

type ModalState = "navigate" | "full" | null;

interface CompareConfirmModalProps {
  state: ModalState;
  locale: string;
  modelName: string;
  selectedModels: SelectedModel[];
  onClose: () => void;
  onConfirm: () => void;
  onRemoveModel: (id: string) => void;
}

const copy = {
  en: {
    navigateTitle: "Go to Compare",
    fullTitle: "Compare Slots Full",
    cancel: "Cancel",
    confirm: "Go to Compare",
    selectedLabel: "Currently selected:",
    addModel: (name: string) =>
      `${name} will be added to your comparison.`,
    fullMessage:
      "All 3 slots are taken. Remove a model below to make room, or go to the Compare page.",
    goToCompare: "Go to Compare",
    remove: "Remove",
  },
  ka: {
    navigateTitle: "შედარების გვერდზე გადასვლა",
    fullTitle: "შედარების ადგილები შევსებულია",
    cancel: "გაუქმება",
    confirm: "შედარებაზე გადასვლა",
    selectedLabel: "არჩეული მოდელები:",
    addModel: (name: string) =>
      `${name} დაემატება შედარებაში.`,
    fullMessage:
      "სამივე ადგილი შევსებულია. წაშალეთ ქვემოთ ერთ-ერთი მოდელი ახლის დასამატებლად, ან გადახვიდეთ შედარების გვერდზე.",
    goToCompare: "შედარების გვერდზე გადასვლა",
    remove: "წაშლა",
  },
};

export default function CompareConfirmModal({
  state,
  locale,
  modelName,
  selectedModels,
  onClose,
  onConfirm,
  onRemoveModel,
}: CompareConfirmModalProps) {
  const t = locale === "ka" ? copy.ka : copy.en;
  const isFull = state === "full";

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (state) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [state, handleKey]);

  return (
    <AnimatePresence>
      {state && (
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
            className="relative w-full max-w-md bg-white border border-[#D4D8DB] shadow-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="border-b border-[#E8EAEB] px-6 py-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 flex items-center justify-center ${
                      isFull ? "bg-[#F5F6F7]" : "bg-byd-red/10"
                    }`}
                  >
                    {isFull ? (
                      <svg
                        className="w-[18px] h-[18px] text-[#686D71]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-[18px] h-[18px] text-byd-red"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[#252728]">
                    {isFull ? t.fullTitle : t.navigateTitle}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-[#7A8080] hover:text-[#252728] transition-colors p-1"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Status message */}
              {isFull ? (
                <p className="text-sm text-[#4E5356] leading-relaxed">
                  {t.fullMessage}
                </p>
              ) : (
                <div className="flex items-center gap-3 bg-byd-red/[0.05] border border-byd-red/[0.15] p-4">
                  <svg
                    className="w-5 h-5 text-byd-red shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-sm text-[#252728] font-medium">
                    {t.addModel(modelName)}
                  </p>
                </div>
              )}

              {/* Selected model thumbnails */}
              {selectedModels.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7A8080] mb-3">
                    {t.selectedLabel}
                  </p>
                  <div className="space-y-2">
                    {selectedModels.map((model) => (
                      <div
                        key={model.id}
                        className="flex items-center gap-3 bg-[#F5F6F7] border border-[#E8EAEB] p-2 pr-3 group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-10 shrink-0 overflow-hidden bg-[#E8EAEB]">
                          <Image
                            src={model.image}
                            alt={model.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        {/* Name */}
                        <span className="flex-1 text-sm text-[#252728] font-medium truncate">
                          {model.name}
                        </span>
                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => onRemoveModel(model.id)}
                          className="shrink-0 w-7 h-7 flex items-center justify-center text-[#7A8080] hover:text-byd-red hover:bg-byd-red/[0.08] transition-all duration-150"
                          title={t.remove}
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#E8EAEB] px-6 py-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-5 border border-[#D4D8DB] text-[#4E5356] hover:border-[#7A8080] hover:text-[#252728] transition-all duration-200 text-sm font-medium"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-3 px-5 bg-byd-red text-white font-semibold hover:bg-[#A80912] transition-all duration-200 text-sm"
              >
                {isFull ? t.goToCompare : t.confirm}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
