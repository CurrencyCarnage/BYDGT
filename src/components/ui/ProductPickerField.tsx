"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type ProductPickerOption = {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
};

type ProductPickerFieldProps = {
  value: string;
  options: ProductPickerOption[];
  onChange: (id: string) => void;
  placeholder: string;
  clearLabel?: string;
  onClear?: () => void;
  "aria-label"?: string;
};

/** Same visual language as the product picker on the compare page. */
export default function ProductPickerField({
  value,
  options,
  onChange,
  placeholder,
  clearLabel,
  onClear,
  "aria-label": ariaLabel,
}: ProductPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.id === value) ?? null;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    /* Mousedown misses keyboard exits — close when focus leaves as well. */
    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (!next || rootRef.current?.contains(next)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`flex min-h-[68px] w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
          open
            ? "border-byd-red/40 bg-white shadow-[0_14px_30px_rgba(24,28,32,0.12)]"
            : "border-[#DDE1E3] bg-[#FBFBFA] hover:border-[#BFC5C8] hover:bg-white"
        }`}
      >
        {selected ? (
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-[#ECEFF1]">
              <Image src={selected.image} alt={selected.name} fill sizes="48px" className="object-cover" quality={70} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-[#252728]">{selected.name}</p>
              {selected.subtitle && <p className="truncate text-xs text-[#686D71]">{selected.subtitle}</p>}
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#C7CDD0] bg-[#F0F2F3]">
              <svg className="h-5 w-5 text-[#62676A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-[14px] text-[#686D71]">{placeholder}</p>
          </div>
        )}

        <span className="flex shrink-0 items-center gap-2">
          {selected && onClear && (
            <span
              role="button"
              tabIndex={0}
              aria-label={clearLabel}
              title={clearLabel}
              onClick={(event) => {
                event.stopPropagation();
                onClear();
                setOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                onClear();
                setOpen(false);
              }}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-byd-red/20 bg-byd-red/[0.06] text-byd-red transition-colors duration-200 hover:border-byd-red/40 hover:bg-byd-red/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          )}
          <svg
            className={`h-4 w-4 text-[#686D71] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-[#DDE1E3] bg-white shadow-[0_24px_60px_rgba(24,28,32,0.18)]"
        >
          {options.map((option) => {
            const isSelected = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 border-t border-[#EEF0F1] px-4 py-3 text-left transition-colors first:border-t-0 ${
                  isSelected ? "bg-byd-red/[0.08]" : "hover:bg-[#F7F8F8]"
                }`}
              >
                <div className="relative h-9 w-11 shrink-0 overflow-hidden rounded-md bg-[#ECEFF1]">
                  <Image src={option.image} alt={option.name} fill sizes="44px" className="object-cover" quality={60} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#252728]">{option.name}</p>
                  {option.subtitle && <p className="truncate text-[11px] text-[#686D71]">{option.subtitle}</p>}
                </div>
                {isSelected && (
                  <svg className="h-4 w-4 shrink-0 text-byd-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
