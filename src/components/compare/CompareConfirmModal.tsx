"use client";

import { useEffect, useCallback, useRef } from "react";
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
  modelId: string;
  selectedModels: SelectedModel[];
  onClose: () => void;
  onConfirm: () => void;
  onRemoveModel: (id: string) => void;
  onAddInSlot: () => void;
}

const copy = {
  en: {
    navigateTitle: "Added to Compare",
    fullTitle: "Compare Slots Full",
    cancel: "Cancel",
    confirm: "Go to Compare",
    selectedLabel: "Currently selected:",
    addModel: (name: string) =>
      `${name} has been added to compare.`,
    fullMessage:
      "All 3 slots are taken. Remove a product below to make room.",
    goToCompare: "Go to Compare",
    remove: "Remove",
    slotCount: (n: number) => `${n}/3 products selected`,
    addInSlot: "+ Add in this slot",
  },
  ka: {
    navigateTitle: "შედარებაში დაემატა",
    fullTitle: "შედარების ადგილები შევსებულია",
    cancel: "გაუქმება",
    confirm: "შედარებაზე გადასვლა",
    selectedLabel: "არჩეული პროდუქტები:",
    addModel: (name: string) =>
      `${name} დაემატა შედარებაში.`,
    fullMessage:
      "სამივე ადგილი შევსებულია. წაშალეთ პროდუქტი ახლის დასამატებლად.",
    goToCompare: "შედარების გვერდზე გადასვლა",
    remove: "წაშლა",
    slotCount: (n: number) => `${n}/3 პროდუქტი არჩეულია`,
    addInSlot: "+ ამ ადგილზე დამატება",
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
  onAddInSlot,
}: CompareConfirmModalProps) {
  const t = locale === "ka" ? copy.ka : copy.en;
  const isFull = state === "full";
  const autoDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (state) {
      document.addEventListener("keydown", handleKey);
      if (isFull) document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [state, handleKey, isFull]);

  // Auto-dismiss toast after 10 seconds
  useEffect(() => {
    if (state === "navigate") {
      autoDismissTimer.current = setTimeout(() => {
        onClose();
      }, 10000);
    }
    return () => {
      if (autoDismissTimer.current) {
        clearTimeout(autoDismissTimer.current);
        autoDismissTimer.current = null;
      }
    };
  }, [state, onClose]);

  // Build 3 slots for full modal (filled + empty)
  const totalSlots = 3;
  const emptySlotCount = totalSlots - selectedModels.length;

  return (
    <AnimatePresence>
      {state === "navigate" && (
        /* ── Bottom sheet / toast-style notification — auto-dismisses in 10s ── */
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[100] flex justify-center p-4 pointer-events-none"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
        >
          <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_-4px_40px_rgba(0,0,0,0.15),0_8px_32px_rgba(0,0,0,0.12)] border border-[#E8EAEB]">
            {/* Content */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start gap-3.5">
                {/* Success icon */}
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent2-green/10">
                  <svg className="h-[18px] w-[18px] text-accent2-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-[#252728] leading-snug">
                    {t.addModel(modelName)}
                  </p>
                  <p className="mt-1 text-xs text-[#7A8080]">
                    {t.slotCount(selectedModels.length)}
                  </p>
                </div>
                {/* Close X */}
                <button
                  onClick={onClose}
                  className="shrink-0 -mt-0.5 -mr-1 p-1.5 text-[#7A8080] hover:text-[#252728] transition-colors rounded-full hover:bg-[#F5F6F7]"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex border-t border-[#E8EAEB]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 text-sm font-medium text-[#7A8080] hover:text-[#252728] hover:bg-[#F5F6F7] transition-all duration-150 border-r border-[#E8EAEB]"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-3.5 text-sm font-semibold text-byd-red hover:bg-byd-red/[0.05] transition-all duration-150"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {state === "full" && (
        /* ── Centered modal for full-state — stays open on individual removal ── */
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
            className="relative w-full max-w-md bg-white border border-[#D4D8DB] shadow-2xl rounded-xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="border-b border-[#E8EAEB] px-6 py-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#FEF2F2] rounded-full">
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
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-[#252728]">
                    {t.fullTitle}
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
              <p className="text-sm text-[#4E5356] leading-relaxed">
                {t.fullMessage}
              </p>

              {/* 3 slots: filled models + empty slots with "+ add here" */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#7A8080] mb-3">
                  {t.selectedLabel}
                </p>
                <div className="space-y-2">
                  {selectedModels.map((model) => (
                    <div
                      key={model.id}
                      className="flex items-center gap-3 bg-[#F5F6F7] border border-[#E8EAEB] p-2 pr-3 group rounded-lg"
                    >
                      <div className="relative w-16 h-10 shrink-0 overflow-hidden bg-[#E8EAEB] rounded">
                        <Image
                          src={model.image}
                          alt={model.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="flex-1 text-sm text-[#252728] font-medium truncate">
                        {model.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveModel(model.id)}
                        className="shrink-0 w-7 h-7 flex items-center justify-center text-[#7A8080] hover:text-byd-red hover:bg-byd-red/[0.08] transition-all duration-150 rounded-full"
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

                  {/* Empty slot placeholders with "+ add in this slot" */}
                  {Array.from({ length: emptySlotCount }).map((_, i) => (
                    <button
                      key={`empty-${i}`}
                      type="button"
                      onClick={onAddInSlot}
                      className="flex w-full items-center gap-3 rounded-lg border border-dashed border-[#C7CDD0] bg-[#FAFBFB] p-2 pr-3 text-left transition-all duration-200 hover:border-byd-red/40 hover:bg-byd-red/[0.03]"
                    >
                      <div className="flex w-16 h-10 shrink-0 items-center justify-center rounded bg-[#F0F2F3]">
                        <svg
                          className="h-4 w-4 text-[#62676A]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="flex-1 text-sm text-byd-red font-medium">
                        {t.addInSlot}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#E8EAEB] px-6 py-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-5 border border-[#D4D8DB] text-[#4E5356] hover:border-[#7A8080] hover:text-[#252728] transition-all duration-200 text-sm font-medium rounded-lg"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-3 px-5 bg-byd-red text-white font-semibold hover:bg-[#A80912] transition-all duration-200 text-sm rounded-lg"
              >
                {t.goToCompare}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
