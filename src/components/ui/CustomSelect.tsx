"use client";

import {
  type CSSProperties,
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

export type SelectOption = {
  value: string;
  label: string;
  shortLabel?: string;
  disabled?: boolean;
};

type SharedSelectProps = {
  id?: string;
  options: readonly SelectOption[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  menuMinWidth?: number;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  className?: string;
  buttonClassName?: string;
  style?: CSSProperties;
};

type SingleSelectProps = SharedSelectProps & {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
};

type MultiSelectProps = SharedSelectProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
};

export type CustomSelectProps = SingleSelectProps | MultiSelectProps;

type MenuPosition = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  bottomSheet: boolean;
  above: boolean;
};

const VIEWPORT_GAP = 8;
const MENU_GAP = 4;
const MENU_MAX_HEIGHT = 240;
const MIN_USEFUL_MENU_HEIGHT = 132;

const CustomSelect = forwardRef<HTMLButtonElement, CustomSelectProps>(function CustomSelect(
  props,
  forwardedRef,
) {
  const {
    id,
    options,
    placeholder,
    disabled = false,
    required = false,
    searchable = false,
    searchPlaceholder,
    menuMinWidth = 0,
    className = "",
    buttonClassName = "",
    style,
    ...aria
  } = props;
  const t = useTranslations("formControls.select");
  const generatedId = useId();
  const triggerId = id ?? `byd-select-${generatedId}`;
  const listboxId = `${triggerId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const focusedForOpenRef = useRef(false);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  const isMultiple = props.multiple === true;
  const selectedValues = useMemo(
    () => new Set(isMultiple ? props.value : props.value ? [props.value] : []),
    [isMultiple, props.value],
  );
  const selectedOptions = options.filter((option) => selectedValues.has(option.value));
  const visibleOptions = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase();
    if (!searchable || !query) return options;
    return options.filter((option) =>
      [option.label, option.shortLabel, option.value]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase().includes(query)),
    );
  }, [options, searchTerm, searchable]);
  const selectedIndex = visibleOptions.findIndex((option) => selectedValues.has(option.value));
  const summary = selectedOptions.map((option) => option.shortLabel ?? option.label).join(", ");

  useImperativeHandle(forwardedRef, () => triggerRef.current as HTMLButtonElement);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportLeft = viewport?.offsetLeft ?? 0;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportWidth = viewport?.width ?? window.innerWidth;
    const viewportHeight = viewport?.height ?? window.innerHeight;
    const viewportRight = viewportLeft + viewportWidth;
    const viewportBottom = viewportTop + viewportHeight;
    const spaceBelow = viewportBottom - rect.bottom - VIEWPORT_GAP - MENU_GAP;
    const spaceAbove = rect.top - viewportTop - VIEWPORT_GAP - MENU_GAP;
    const bottomSheet = isMultiple
      && (viewportWidth < 480 || Math.max(spaceAbove, spaceBelow) < MIN_USEFUL_MENU_HEIGHT);
    if (bottomSheet) {
      setMenuPosition({
        left: viewportLeft + VIEWPORT_GAP,
        top: viewportBottom - Math.min(viewportHeight * 0.72, 520) - VIEWPORT_GAP,
        width: viewportWidth - VIEWPORT_GAP * 2,
        maxHeight: Math.min(viewportHeight * 0.72, 520),
        bottomSheet: true,
        above: false,
      });
      return;
    }

    const openBelow = spaceBelow >= Math.min(MIN_USEFUL_MENU_HEIGHT, spaceAbove);
    const availableHeight = Math.max(88, openBelow ? spaceBelow : spaceAbove);
    const maxHeight = Math.min(MENU_MAX_HEIGHT, availableHeight);
    const width = Math.min(
      Math.max(rect.width, menuMinWidth),
      viewportWidth - VIEWPORT_GAP * 2,
    );
    const left = Math.min(
      Math.max(rect.left, viewportLeft + VIEWPORT_GAP),
      viewportRight - width - VIEWPORT_GAP,
    );
    const top = openBelow
      ? rect.bottom + MENU_GAP
      : rect.top - MENU_GAP;
    setMenuPosition({
      left,
      top,
      width,
      maxHeight,
      bottomSheet: false,
      above: !openBelow,
    });
  }, [isMultiple, menuMinWidth]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    if (triggerRef.current) resizeObserver.observe(triggerRef.current);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!open) return;
    const closeWhenOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeWhenOutside);
    return () => document.removeEventListener("pointerdown", closeWhenOutside);
  }, [open]);

  useEffect(() => {
    if (!open) {
      focusedForOpenRef.current = false;
      return;
    }
    if (!menuPosition || focusedForOpenRef.current) return;
    focusedForOpenRef.current = true;
    const nextIndex = selectedIndex >= 0
      ? selectedIndex
      : visibleOptions.findIndex((option) => !option.disabled);
    const safeIndex = Math.max(nextIndex, 0);
    setActiveIndex(safeIndex);
    requestAnimationFrame(() => {
      if (searchable) searchRef.current?.focus();
      else optionRefs.current[safeIndex]?.focus();
    });
  }, [menuPosition, open, searchable, selectedIndex, visibleOptions]);

  useEffect(() => () => {
    if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
  }, []);

  const moveActive = (direction: 1 | -1) => {
    if (!visibleOptions.length) return;
    let nextIndex = activeIndex;
    for (let attempts = 0; attempts < visibleOptions.length; attempts += 1) {
      nextIndex = (nextIndex + direction + visibleOptions.length) % visibleOptions.length;
      if (!visibleOptions[nextIndex]?.disabled) {
        setActiveIndex(nextIndex);
        optionRefs.current[nextIndex]?.focus();
        return;
      }
    }
  };

  const choose = (index: number) => {
    const option = visibleOptions[index];
    if (!option || option.disabled) return;
    if (props.multiple) {
      props.onChange(
        selectedValues.has(option.value)
          ? props.value.filter((value) => value !== option.value)
          : [...props.value, option.value],
      );
      return;
    }
    props.onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const focusAdjacentToTrigger = (backward: boolean) => {
    const focusable = Array.from(document.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])',
    )).filter((element) =>
      element.tabIndex >= 0
      && !menuRef.current?.contains(element)
      && element.offsetParent !== null,
    );
    const triggerIndex = focusable.indexOf(triggerRef.current as HTMLElement);
    focusable[triggerIndex + (backward ? -1 : 1)]?.focus();
  };

  const typeahead = (key: string) => {
    if (key.length !== 1 || key.trim() === "") return false;
    typeaheadRef.current += key.toLocaleLowerCase();
    if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
    typeaheadTimerRef.current = setTimeout(() => { typeaheadRef.current = ""; }, 700);
    const matchIndex = visibleOptions.findIndex(
      (option) => !option.disabled && option.label.toLocaleLowerCase().startsWith(typeaheadRef.current),
    );
    if (matchIndex >= 0) {
      setActiveIndex(matchIndex);
      optionRefs.current[matchIndex]?.focus();
    }
    return true;
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!disabled) {
        setSearchTerm("");
        setOpen(true);
      }
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); moveActive(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); moveActive(-1); }
    else if (event.key === "Home") {
      event.preventDefault();
      const next = Math.max(visibleOptions.findIndex((option) => !option.disabled), 0);
      setActiveIndex(next);
      optionRefs.current[next]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      const next = [...visibleOptions].map((option, index) => ({ option, index })).reverse()
        .find(({ option }) => !option.disabled)?.index ?? 0;
      setActiveIndex(next);
      optionRefs.current[next]?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(activeIndex);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
      requestAnimationFrame(() => focusAdjacentToTrigger(event.shiftKey));
    } else {
      typeahead(event.key);
    }
  };

  const menu = open && menuPosition && (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: menuPosition.left,
        top: menuPosition.bottomSheet ? "auto" : menuPosition.top,
        bottom: menuPosition.bottomSheet ? VIEWPORT_GAP : "auto",
        transform: menuPosition.above ? "translateY(-100%)" : "none",
        width: menuPosition.width,
        maxHeight: menuPosition.maxHeight,
      }}
      className={`z-[80] flex overflow-hidden border border-[var(--theme-border-subtle)] bg-[var(--theme-surface-alt)] shadow-[var(--theme-menu-shadow)] ${
        menuPosition.bottomSheet || searchable ? "flex-col" : ""
      }`}
    >
      {menuPosition.bottomSheet && (
        <div className="flex min-h-11 items-center justify-between border-b border-[var(--theme-border-subtle)] px-4">
          <strong className="text-sm text-[var(--theme-text-primary)]">{aria["aria-label"] ?? placeholder}</strong>
          <button type="button" onClick={() => { setOpen(false); triggerRef.current?.focus(); }} className="h-11 px-2 text-xl text-[var(--theme-text-primary)]" aria-label={t("done")}>×</button>
        </div>
      )}
      {searchable && (
        <div className="shrink-0 border-b border-[var(--theme-border-subtle)] bg-[var(--theme-surface-bg)] p-2">
          <input
            ref={searchRef}
            type="search"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false);
                triggerRef.current?.focus();
              } else if (event.key === "ArrowDown" && visibleOptions.length) {
                event.preventDefault();
                optionRefs.current[activeIndex]?.focus();
              } else if (event.key === "Tab" && event.shiftKey) {
                event.preventDefault();
                setOpen(false);
                requestAnimationFrame(() => focusAdjacentToTrigger(true));
              } else if (event.key === "Tab" && visibleOptions.length === 0) {
                event.preventDefault();
                setOpen(false);
                requestAnimationFrame(() => focusAdjacentToTrigger(false));
              }
            }}
            placeholder={searchPlaceholder ?? t("searchPlaceholder")}
            aria-label={searchPlaceholder ?? t("searchPlaceholder")}
            className="min-h-11 w-full border border-[var(--theme-border-subtle)] bg-[var(--theme-surface-alt)] px-3 text-sm text-[var(--theme-text-primary)] outline-none placeholder:text-[var(--theme-text-muted)] focus:border-byd-red"
          />
        </div>
      )}
      <div
        id={listboxId}
        role="listbox"
        aria-labelledby={triggerId}
        aria-multiselectable={isMultiple || undefined}
        className="min-h-0 flex-1 overflow-auto py-1"
      >
        {visibleOptions.map((option, index) => {
          const active = index === activeIndex;
          const selected = selectedValues.has(option.value);
          return (
            <button
              key={option.value}
              ref={(node) => { optionRefs.current[index] = node; }}
              type="button"
              role="option"
              aria-selected={isMultiple ? undefined : selected}
              aria-checked={isMultiple ? selected : undefined}
              disabled={option.disabled}
              tabIndex={active ? 0 : -1}
              onMouseEnter={() => { if (!option.disabled) setActiveIndex(index); }}
              onFocus={() => setActiveIndex(index)}
              onClick={() => choose(index)}
              onKeyDown={onListKeyDown}
              className={`flex min-h-11 w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                active
                  ? "bg-byd-red text-white"
                  : selected
                    ? "bg-byd-red/10 text-[var(--theme-text-primary)]"
                    : "bg-transparent text-[var(--theme-text-primary)]"
              }`}
            >
              {isMultiple && (
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center border ${selected ? "border-byd-red bg-byd-red text-white" : "border-current"}`} aria-hidden="true">
                  {selected && <span className="text-[10px] leading-none">✓</span>}
                </span>
              )}
              <span>{option.label}</span>
            </button>
          );
        })}
        {visibleOptions.length === 0 && (
          <p role="status" className="px-4 py-5 text-center text-sm text-[var(--theme-text-muted)]">
            {t("noResults")}
          </p>
        )}
      </div>
      {isMultiple && (
        <div className="flex min-h-11 shrink-0 items-center justify-between border-t border-[var(--theme-border-subtle)] bg-[var(--theme-surface-bg)] px-2">
          <button type="button" onClick={() => props.onChange([])} disabled={props.value.length === 0} className="min-h-11 px-3 text-sm font-semibold text-[var(--theme-text-secondary)] disabled:opacity-40">
            {t("clearAll")}
          </button>
          <button type="button" onClick={() => { setOpen(false); triggerRef.current?.focus(); }} className="min-h-11 px-3 text-sm font-semibold text-byd-red">
            {t("done")}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role={isMultiple ? undefined : "combobox"}
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-required={required || undefined}
        aria-describedby={aria["aria-describedby"]}
        aria-invalid={aria["aria-invalid"]}
        aria-label={aria["aria-label"]}
        disabled={disabled}
        title={summary || undefined}
        onClick={() => {
          if (disabled) return;
          setOpen((current) => {
            if (!current) setSearchTerm("");
            return !current;
          });
        }}
        onKeyDown={onTriggerKeyDown}
        className={`flex min-h-11 w-full items-center justify-between border border-byd-red bg-byd-red px-4 py-3 text-left text-sm font-medium text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:border-[#C7CDD0] disabled:bg-[#E3E6E7] disabled:text-[#7A8080] ${buttonClassName}`}
        style={style}
        data-byd-select-trigger
      >
        <span className="min-w-0 truncate">{summary || placeholder}</span>
        <svg className={`ml-3 h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </div>
  );
});

export default CustomSelect;
