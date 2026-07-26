"use client";

import {
  forwardRef,
  KeyboardEvent,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type CustomSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  className?: string;
  buttonClassName?: string;
  style?: React.CSSProperties;
};

const CustomSelect = forwardRef<HTMLButtonElement, CustomSelectProps>(function CustomSelect(
  {
    id,
    value,
    onChange,
    options,
    placeholder,
    disabled = false,
    required = false,
    className = "",
    buttonClassName = "",
    style,
    ...aria
  },
  forwardedRef,
) {
  const generatedId = useId();
  const triggerId = id ?? `byd-select-${generatedId}`;
  const listboxId = `${triggerId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(selectedIndex, 0));
  const selectedOption = options[selectedIndex];

  useImperativeHandle(forwardedRef, () => triggerRef.current as HTMLButtonElement);

  useEffect(() => {
    if (!open) return;
    const nextIndex = Math.max(selectedIndex, 0);
    setActiveIndex(nextIndex);
    requestAnimationFrame(() => optionRefs.current[nextIndex]?.focus());
  }, [open, selectedIndex]);

  useEffect(() => {
    const closeWhenOutside = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeWhenOutside);
    document.addEventListener("touchstart", closeWhenOutside);
    return () => {
      document.removeEventListener("mousedown", closeWhenOutside);
      document.removeEventListener("touchstart", closeWhenOutside);
    };
  }, []);

  const firstEnabledIndex = () => options.findIndex((option) => !option.disabled);
  const moveActive = (direction: 1 | -1) => {
    let nextIndex = activeIndex;
    for (let attempts = 0; attempts < options.length; attempts += 1) {
      nextIndex = (nextIndex + direction + options.length) % options.length;
      if (!options[nextIndex]?.disabled) {
        setActiveIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus();
        return;
      }
    }
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };
  const openList = () => {
    if (disabled) return;
    setOpen(true);
  };
  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openList();
    }
  };
  const onListKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); moveActive(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); moveActive(-1); }
    else if (event.key === "Home") { event.preventDefault(); const next = firstEnabledIndex(); setActiveIndex(next); optionRefs.current[next]?.focus(); }
    else if (event.key === "End") { event.preventDefault(); const next = [...options].map((option, index) => ({ option, index })).reverse().find(({ option }) => !option.disabled)?.index ?? 0; setActiveIndex(next); optionRefs.current[next]?.focus(); }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(activeIndex); }
    else if (event.key === "Escape") { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-required={required || undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onTriggerKeyDown}
        className={`flex min-h-11 w-full items-center justify-between border border-byd-red bg-byd-red px-4 py-3 text-left text-sm font-medium text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:border-[#C7CDD0] disabled:bg-[#E3E6E7] disabled:text-[#7A8080] ${buttonClassName}`}
        style={style}
        data-byd-select-trigger
        {...aria}
      >
        <span className="min-w-0 truncate">{selectedOption?.label ?? placeholder}</span>
        <svg className={`ml-3 h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div id={listboxId} role="listbox" aria-labelledby={triggerId} className="absolute left-0 z-50 mt-1 max-h-60 w-full overflow-auto border border-[var(--theme-border-subtle)] bg-[var(--theme-surface-alt)] py-1 shadow-[var(--theme-menu-shadow)]">
          {options.map((option, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={option.value}
                ref={(node) => { optionRefs.current[index] = node; }}
                type="button"
                role="option"
                aria-selected={option.value === value}
                disabled={option.disabled}
                tabIndex={active ? 0 : -1}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => choose(index)}
                onKeyDown={onListKeyDown}
                className={`flex min-h-11 w-full items-center px-4 py-2 text-left text-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${active ? "bg-byd-red text-white" : "bg-transparent text-[var(--theme-text-primary)]"}`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default CustomSelect;
