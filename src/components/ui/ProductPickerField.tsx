"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

export type ProductPickerOption = {
  id: string;
  name: string;
  subtitle?: string;
  image: string;
  group?: string;
  powertrain?: "EV" | "PHEV";
  variants?: Array<{ id: string; name: string }>;
};

type ProductPickerFieldProps = {
  id?: string;
  value: string;
  options: ProductPickerOption[];
  onChange: (id: string) => void;
  placeholder: string;
  clearLabel?: string;
  onClear?: () => void;
  closeRequestKey?: string | number;
  closeOnMenuPointerLeave?: boolean;
  onMenuPointerLeave?: (relatedTarget: EventTarget | null) => void;
  appearance?: "default" | "services";
  groupedOptions?: boolean;
  groupedOptionsLabel?: string;
  secondaryValue?: string;
  onSecondaryChange?: (id: string) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

type MenuPosition = {
  left: number;
  top: number;
  width: number;
  maxHeight: number;
  above: boolean;
};

const MENU_GAP = 8;
const VIEWPORT_GAP = 8;
const MENU_MAX_HEIGHT = 320;

/** Image-led product selector shared with the Compare page visual language. */
export default function ProductPickerField({
  id,
  value,
  options,
  onChange,
  placeholder,
  clearLabel,
  onClear,
  closeRequestKey,
  closeOnMenuPointerLeave = false,
  onMenuPointerLeave,
  appearance = "default",
  groupedOptions = false,
  groupedOptionsLabel = "Trims",
  secondaryValue = "",
  onSecondaryChange,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
}: ProductPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const generatedId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const typeaheadRef = useRef("");
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const triggerId = id ?? `product-picker-${generatedId}`;
  const listboxId = `${triggerId}-listbox`;
  const selected = options.find((option) => option.id === value) ?? null;
  const selectedVariant =
    selected?.variants?.find((variant) => variant.id === secondaryValue) ??
    null;
  const selectedIndex = options.findIndex((option) => option.id === value);
  const hasNestedVariants =
    groupedOptions && options.some((option) => option.variants?.length);
  const optionGroups = Array.from(
    options.reduce((groups, option, index) => {
      const key = option.group ?? "";
      const group = groups.get(key) ?? [];
      group.push({ option, index });
      groups.set(key, group);
      return groups;
    }, new Map<string, Array<{ option: ProductPickerOption; index: number }>>()),
    ([label, entries]) => ({ label, entries })
  );
  const activeGroup =
    optionGroups.find(({ entries }) =>
      entries.some(({ index }) => index === activeIndex)
    ) ?? optionGroups[0];
  const activeOption = options[activeIndex] ?? options[0];
  const isServicesAppearance = appearance === "services";

  const closeMenu = useCallback(() => {
    setOpen(false);
    setMenuPosition(null);
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportLeft = viewport?.offsetLeft ?? 0;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportWidth = viewport?.width ?? window.innerWidth;
    const viewportHeight = viewport?.height ?? window.innerHeight;
    const viewportBottom = viewportTop + viewportHeight;
    const menuGap = isServicesAppearance ? 0 : MENU_GAP;
    const spaceBelow = viewportBottom - rect.bottom - VIEWPORT_GAP - menuGap;
    const spaceAbove = rect.top - viewportTop - VIEWPORT_GAP - menuGap;
    const above = spaceBelow < Math.min(220, spaceAbove);
    const availableHeight = Math.max(120, above ? spaceAbove : spaceBelow);
    const width = Math.min(rect.width, viewportWidth - VIEWPORT_GAP * 2);
    const left = Math.min(
      Math.max(rect.left, viewportLeft + VIEWPORT_GAP),
      viewportLeft + viewportWidth - width - VIEWPORT_GAP
    );

    setMenuPosition({
      left,
      top: above ? rect.top - menuGap : rect.bottom + menuGap,
      width,
      maxHeight: Math.min(MENU_MAX_HEIGHT, availableHeight),
      above,
    });
  }, [isServicesAppearance]);

  const openMenu = useCallback(() => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [selectedIndex]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const closeWhenOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      )
        closeMenu();
    };
    document.addEventListener("pointerdown", closeWhenOutside);
    return () => document.removeEventListener("pointerdown", closeWhenOutside);
  }, [closeMenu, open]);

  useEffect(() => {
    if (!open) return;
    const closeWhenFocusLeaves = (event: FocusEvent) => {
      const target = event.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      )
        closeMenu();
    };
    document.addEventListener("focusin", closeWhenFocusLeaves);
    return () => document.removeEventListener("focusin", closeWhenFocusLeaves);
  }, [closeMenu, open]);

  useEffect(() => {
    closeMenu();
  }, [closeMenu, closeRequestKey]);

  useEffect(() => {
    if (!open || !menuPosition || groupedOptions) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, groupedOptions, menuPosition, open]);

  useEffect(
    () => () => {
      if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
    },
    []
  );

  const selectOption = (option: ProductPickerOption) => {
    onChange(option.id);
    closeMenu();
    triggerRef.current?.focus();
  };

  const selectModel = (option: ProductPickerOption) => {
    onChange(option.id);
    setActiveIndex(options.findIndex((item) => item.id === option.id));
  };

  const selectVariant = (option: ProductPickerOption, variantId: string) => {
    onChange(option.id);
    onSecondaryChange?.(variantId);
    closeMenu();
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
      return;
    }

    if (event.key === "Tab") {
      closeMenu();
      return;
    }

    if (event.target !== event.currentTarget) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex(
        (current) => (current + direction + options.length) % options.length
      );
      return;
    }

    if (open && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      setActiveIndex(
        event.key === "Home" ? 0 : Math.max(0, options.length - 1)
      );
      return;
    }

    if (open && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) {
        if (hasNestedVariants) selectModel(option);
        else selectOption(option);
      }
      return;
    }

    if (!open && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openMenu();
      return;
    }

    if (event.key.length === 1 && /\S/.test(event.key)) {
      const key = event.key.toLocaleLowerCase();
      typeaheadRef.current += key;
      if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
      typeaheadTimerRef.current = setTimeout(() => {
        typeaheadRef.current = "";
      }, 500);
      const repeatedCharacter = Array.from(typeaheadRef.current).every(
        (character) => character === key
      );
      const query = repeatedCharacter ? key : typeaheadRef.current;
      const searchStart = open ? activeIndex + 1 : 0;
      const matchIndex = Array.from(
        { length: options.length },
        (_, offset) => (searchStart + offset) % options.length
      ).find((index) =>
        `${options[index].name} ${options[index].subtitle ?? ""}`
          .toLocaleLowerCase()
          .split(/\s+/)
          .some((word) => word.startsWith(query))
      );
      if (matchIndex !== undefined) {
        event.preventDefault();
        setActiveIndex(matchIndex);
        if (!open) setOpen(true);
      }
    }
  };

  const accessibleValue = selected
    ? `${selected.name}${
        selectedVariant
          ? `, ${selectedVariant.name}`
          : selected.subtitle
          ? `, ${selected.subtitle}`
          : ""
      }`
    : placeholder;

  const menu =
    open && menuPosition && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel}
            data-product-picker-menu
            onPointerLeave={
              closeOnMenuPointerLeave
                ? (event) => {
                    if (event.pointerType === "mouse") {
                      closeMenu();
                      onMenuPointerLeave?.(event.relatedTarget);
                    }
                  }
                : undefined
            }
            className={`fixed z-[1200] overflow-hidden rounded-2xl border shadow-[0_24px_60px_rgba(0,0,0,0.34)] ${
              isServicesAppearance
                ? "border-white/15 bg-[#111820] text-white"
                : "border-[#DDE1E3] bg-white"
            }`}
            style={{
              left: menuPosition.left,
              top: menuPosition.top,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
              transform: menuPosition.above ? "translateY(-100%)" : undefined,
            }}
          >
            {hasNestedVariants ? (
              <div className="grid min-h-[184px] grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                <div className="overflow-y-auto border-r border-white/10 py-1.5">
                  {options.map((option, index) => {
                    const isActive = index === activeIndex;
                    const isSelected = option.id === value;
                    return (
                      <button
                        key={option.id}
                        id={`${listboxId}-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onPointerEnter={() => setActiveIndex(index)}
                        onClick={() => selectModel(option)}
                        className={`flex min-h-14 w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200 ${
                          isActive
                            ? "bg-byd-red text-white"
                            : isSelected
                            ? "bg-white/[0.1] text-white"
                            : "text-white/85 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div className="relative h-9 w-11 shrink-0 overflow-hidden rounded-md bg-white/10">
                          <Image
                            src={option.image}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                            quality={60}
                          />
                        </div>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11.2px] font-semibold leading-tight">
                            {option.name}
                          </span>
                          {option.powertrain && (
                            <span
                              className={`mt-1 inline-flex rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase leading-none tracking-[0.12em] ${
                                option.powertrain === "EV"
                                  ? "border-emerald-400/45 bg-emerald-400/10 text-emerald-300"
                                  : "border-red-400/50 bg-red-400/10 text-red-200"
                              }`}
                            >
                              {option.powertrain}
                            </span>
                          )}
                        </span>
                        <svg
                          className="h-3.5 w-3.5 shrink-0 opacity-70"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="m7 5 5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    );
                  })}
                </div>
                {activeOption && (
                  <div
                    key={activeOption.id}
                    className="product-picker-trim-pane flex flex-col justify-center bg-[#171f28] p-2"
                  >
                    <p
                      aria-hidden="true"
                      className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45"
                    >
                      {groupedOptionsLabel}
                    </p>
                    {activeOption.variants?.map((variant) => {
                      const isSelected =
                        activeOption.id === value &&
                        variant.id === secondaryValue;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() =>
                            selectVariant(activeOption, variant.id)
                          }
                          className={`flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
                            isSelected
                              ? "bg-byd-red text-white"
                              : "text-white/78 hover:bg-white/[0.07] hover:text-white"
                          }`}
                        >
                          <span className="min-w-0 truncate">
                            {variant.name}
                          </span>
                          {isSelected && <span aria-hidden="true">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : groupedOptions ? (
              <div className="grid min-h-[184px] grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
                <div className="overflow-y-auto border-r border-white/10 py-1.5">
                  {optionGroups.map(({ label, entries }) => {
                    const isActiveGroup = activeGroup?.label === label;
                    const representative = entries[0].option;
                    return (
                      <div
                        key={label || representative.id}
                        onPointerEnter={() => setActiveIndex(entries[0].index)}
                        onPointerDown={(event) => {
                          if (event.pointerType !== "mouse")
                            setActiveIndex(entries[0].index);
                        }}
                        aria-hidden="true"
                        className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${
                          isActiveGroup
                            ? "bg-byd-red text-white"
                            : "text-white/85 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div className="relative h-9 w-11 shrink-0 overflow-hidden rounded-md bg-white/10">
                          <Image
                            src={representative.image}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                            quality={60}
                          />
                        </div>
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                          {label || representative.name}
                        </span>
                        <svg
                          className="h-3.5 w-3.5 shrink-0 opacity-70"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="m7 5 5 5-5 5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    );
                  })}
                </div>
                {activeGroup && (
                  <div
                    key={activeGroup.label || activeGroup.entries[0].option.id}
                    className="product-picker-trim-pane flex flex-col justify-center bg-[#171f28] p-2"
                  >
                    <p
                      aria-hidden="true"
                      className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45"
                    >
                      {groupedOptionsLabel}
                    </p>
                    {activeGroup.entries.map(({ option, index }) => {
                      const isSelected = option.id === value;
                      const isActive = index === activeIndex;
                      return (
                        <button
                          ref={(node) => {
                            optionRefs.current[index] = node;
                          }}
                          id={`${listboxId}-option-${index}`}
                          key={option.id}
                          type="button"
                          role="option"
                          tabIndex={-1}
                          aria-selected={isSelected}
                          aria-label={`${option.name}${
                            option.subtitle ? `, ${option.subtitle}` : ""
                          }`}
                          onPointerMove={() => setActiveIndex(index)}
                          onClick={() => selectOption(option)}
                          className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                            isActive
                              ? "bg-byd-red text-white"
                              : isSelected
                              ? "bg-byd-red/20 text-white"
                              : "text-white/78 hover:bg-white/[0.07]"
                          }`}
                        >
                          <span className="min-w-0 truncate">
                            {option.subtitle || option.name}
                          </span>
                          {isSelected && <span aria-hidden="true">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              optionGroups.map(({ label, entries }) => (
                <div
                  key={label || "all-products"}
                  className="border-t border-[#EEF0F1] first:border-t-0"
                >
                  {label && (
                    <p className="px-4 pb-2 pt-3 text-[10px] uppercase tracking-[0.18em] text-[#7A8080]">
                      {label}
                    </p>
                  )}
                  {entries.map(({ option, index }) => {
                    const isSelected = option.id === value;
                    const isActive = index === activeIndex;
                    return (
                      <button
                        ref={(node) => {
                          optionRefs.current[index] = node;
                        }}
                        id={`${listboxId}-option-${index}`}
                        key={option.id}
                        type="button"
                        role="option"
                        tabIndex={-1}
                        aria-selected={isSelected}
                        onPointerMove={() => setActiveIndex(index)}
                        onClick={() => selectOption(option)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                          isActive
                            ? "bg-[#F7F8F8]"
                            : isSelected
                            ? "bg-byd-red/[0.08]"
                            : "hover:bg-[#F7F8F8]"
                        }`}
                      >
                        <div className="relative h-9 w-11 shrink-0 overflow-hidden rounded-md bg-[#ECEFF1]">
                          <Image
                            src={option.image}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                            quality={60}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#252728]">
                            {option.name}
                          </p>
                          {option.subtitle && (
                            <p className="truncate text-[11px] text-[#686D71]">
                              {option.subtitle}
                            </p>
                          )}
                        </div>
                        {isSelected && (
                          <svg
                            className="h-4 w-4 shrink-0 text-byd-red"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.4}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <div ref={rootRef} className="relative">
      <div
        ref={triggerRef}
        id={triggerId}
        role="combobox"
        tabIndex={0}
        onClick={() => {
          if (open) closeMenu();
          else openMenu();
        }}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          open ? `${listboxId}-option-${activeIndex}` : undefined
        }
        aria-label={
          ariaLabel ? `${ariaLabel}: ${accessibleValue}` : accessibleValue
        }
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        className={`flex ${
          isServicesAppearance ? "min-h-[52px] py-1.5" : "min-h-[68px] py-3"
        } w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-byd-red/55 ${
          isServicesAppearance
            ? ariaInvalid
              ? "border-white bg-byd-red text-white shadow-[0_0_0_2px_rgba(255,255,255,0.18)]"
              : open
              ? "border-white/45 bg-[#b70b16] text-white shadow-[0_14px_30px_rgba(0,0,0,0.2)]"
              : "border-byd-red bg-byd-red text-white hover:border-white/35 hover:bg-[#c20b17]"
            : open
            ? "border-byd-red/40 bg-white shadow-[0_14px_30px_rgba(24,28,32,0.12)]"
            : ariaInvalid
            ? "border-byd-red bg-white shadow-[0_0_0_1px_rgba(215,12,25,0.18)]"
            : "border-[#DDE1E3] bg-[#FBFBFA] hover:border-[#BFC5C8] hover:bg-white"
        }`}
      >
        {selected ? (
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-[#ECEFF1]">
              <Image
                src={selected.image}
                alt=""
                fill
                sizes="48px"
                className="object-cover"
                quality={70}
              />
            </div>
            <div className="min-w-0">
              <p
                className={`truncate text-[15px] font-semibold ${
                  isServicesAppearance ? "text-white" : "text-[#252728]"
                }`}
              >
                {selected.name}
              </p>
              {(selectedVariant || selected.subtitle) && (
                <p
                  className={`truncate text-xs ${
                    isServicesAppearance ? "text-white/70" : "text-[#686D71]"
                  }`}
                >
                  {selectedVariant?.name ?? selected.subtitle}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed ${
                isServicesAppearance
                  ? "border-white/35 bg-white/10"
                  : "border-[#C7CDD0] bg-[#F0F2F3]"
              }`}
            >
              <svg
                className={`h-5 w-5 ${
                  isServicesAppearance ? "text-white/80" : "text-[#62676A]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p
              className={`text-[14px] ${
                isServicesAppearance ? "text-white" : "text-[#686D71]"
              }`}
            >
              {placeholder}
            </p>
          </div>
        )}

        <span className="flex shrink-0 items-center gap-2">
          {selected && onClear && (
            <button
              type="button"
              aria-label={clearLabel}
              title={clearLabel}
              onClick={(event) => {
                event.stopPropagation();
                onClear();
                closeMenu();
              }}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 ${
                isServicesAppearance
                  ? "border-white/25 bg-white/10 text-white hover:border-white/45 hover:bg-white/20 focus-visible:ring-white/60"
                  : "border-byd-red/20 bg-byd-red/[0.06] text-byd-red hover:border-byd-red/40 hover:bg-byd-red/10 focus-visible:ring-byd-red/50"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.9}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${
              isServicesAppearance ? "text-white/85" : "text-[#686D71]"
            } ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
      {menu}
    </div>
  );
}
