"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import CompareConfirmModal from "./CompareConfirmModal";
import type { SelectedModel } from "./CompareConfirmModal";

const COMPARE_SELECTION_STORAGE_KEY = "byd-compare-selected-models";

/** Lightweight lookup — just enough to render thumbnails in the modal. */
const VERSION_INFO: Record<string, { name: string; image: string }> = {
  "seal-06-dmi": {
    name: "BYD Seal 06 DM-i",
    image: "/images/models/seal-06-dmi/hero.jpg",
  },
  "seal-06-ev": {
    name: "BYD Seal 06 EV",
    image: "/images/models/seal-06-dmi/hero.jpg",
  },
  "sealion-06-dmi": {
    name: "BYD Sealion 06 DM-i",
    image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
  },
  "sealion-06-ev": {
    name: "BYD Sealion 06 EV",
    image: "/images/models/sealion-06-dmi/hero-smoke-grey.jpg",
  },
  "yuan-up-ev": {
    name: "BYD Yuan Up EV",
    image: "/images/models/yuan-up-ev/hero.jpg",
  },
  "yuan-up-dmi": {
    name: "BYD Yuan Up DM-i",
    image: "/images/models/yuan-up-dmi/hero.jpg",
  },
};

interface CompareButtonProps {
  modelId: string;
  modelName: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function isModelInCompare(modelId: string): boolean {
  try {
    const raw = window.localStorage.getItem(COMPARE_SELECTION_STORAGE_KEY);
    if (!raw) return false;
    const ids: unknown[] = JSON.parse(raw);
    if (!Array.isArray(ids)) return false;
    return ids.some((id) => id === modelId);
  } catch {
    return false;
  }
}

function readCachedModels(): SelectedModel[] {
  try {
    const raw = window.localStorage.getItem(COMPARE_SELECTION_STORAGE_KEY);
    if (!raw) return [];
    const ids: unknown[] = JSON.parse(raw);
    if (!Array.isArray(ids)) return [];
    const models: SelectedModel[] = [];
    for (const id of ids) {
      if (typeof id !== "string" || !id) continue;
      const info = VERSION_INFO[id];
      if (info) models.push({ id, ...info });
    }
    return models;
  } catch {
    return [];
  }
}

function addModelToCache(modelId: string): boolean {
  try {
    const raw = window.localStorage.getItem(COMPARE_SELECTION_STORAGE_KEY);
    const ids: (string | null)[] = raw ? JSON.parse(raw) : [null, null, null];
    if (!Array.isArray(ids)) return false;
    while (ids.length < 3) ids.push(null);
    // Already present?
    if (ids.includes(modelId)) return false;
    const emptyIndex = ids.findIndex((id) => id === null);
    if (emptyIndex === -1) return false; // all full
    ids[emptyIndex] = modelId;
    window.localStorage.setItem(
      COMPARE_SELECTION_STORAGE_KEY,
      JSON.stringify(ids)
    );
    return true;
  } catch {
    return false;
  }
}

function removeCachedModel(removeId: string) {
  try {
    const raw = window.localStorage.getItem(COMPARE_SELECTION_STORAGE_KEY);
    if (!raw) return;
    const ids: unknown[] = JSON.parse(raw);
    if (!Array.isArray(ids)) return;
    const updated = ids.map((id) => (id === removeId ? null : id));
    window.localStorage.setItem(
      COMPARE_SELECTION_STORAGE_KEY,
      JSON.stringify(updated)
    );
  } catch {
    /* ignore */
  }
}

function getCachedSlotCount(): number {
  try {
    const raw = window.localStorage.getItem(COMPARE_SELECTION_STORAGE_KEY);
    if (!raw) return 0;
    const ids: unknown[] = JSON.parse(raw);
    if (!Array.isArray(ids)) return 0;
    return ids.filter((id) => typeof id === "string" && id).length;
  } catch {
    return 0;
  }
}

const labels = {
  en: { goTo: "Go to Compare", addTo: "Add to Compare" },
  ka: { goTo: "შედარებაზე გადასვლა", addTo: "შედარებაში დამატება" },
};

export default function CompareButton({
  modelId,
  modelName,
  className,
  style,
  children,
}: CompareButtonProps) {
  const locale = useLocale();
  const router = useRouter();
  const [modalState, setModalState] = useState<"navigate" | "full" | null>(
    null
  );
  const [selectedModels, setSelectedModels] = useState<SelectedModel[]>([]);
  const [isInCompare, setIsInCompare] = useState(false);

  useEffect(() => {
    const syncState = () => setIsInCompare(isModelInCompare(modelId));
    syncState();
    window.addEventListener("storage", syncState);
    window.addEventListener("byd-compare-change", syncState);
    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener("byd-compare-change", syncState);
    };
  }, [modelId]);

  const t = locale === "ka" ? labels.ka : labels.en;
  const dynamicLabel = isInCompare ? t.goTo : t.addTo;

  const handleClick = useCallback(() => {
    // Already in compare → navigate directly
    if (isModelInCompare(modelId)) {
      router.push(`/${locale}/compare`);
      return;
    }

    const slotCount = getCachedSlotCount();

    // All 3 slots full → show full modal
    if (slotCount >= 3) {
      setSelectedModels(readCachedModels());
      setModalState("full");
      return;
    }

    // Slots available → add directly, show toast
    const added = addModelToCache(modelId);
    if (added) {
      setIsInCompare(true);
      window.dispatchEvent(new Event("byd-compare-change"));
      const models = readCachedModels();
      setSelectedModels(models);
      setModalState("navigate");
    } else {
      // Fallback: navigate to compare
      router.push(`/${locale}/compare?models=${encodeURIComponent(modelId)}`);
    }
  }, [modelId, locale, router]);

  const handleRemoveModel = useCallback(
    (removeId: string) => {
      removeCachedModel(removeId);
      window.dispatchEvent(new Event("byd-compare-change"));
      const updated = selectedModels.filter((m) => m.id !== removeId);
      setSelectedModels(updated);
      // Stay in full modal — don't auto-close
    },
    [selectedModels]
  );

  const handleAddInSlot = useCallback(() => {
    // Add the current model to the now-empty slot
    const added = addModelToCache(modelId);
    if (added) {
      setIsInCompare(true);
      window.dispatchEvent(new Event("byd-compare-change"));
      setModalState(null);
      router.push(`/${locale}/compare`);
    }
  }, [modelId, locale, router]);

  const handleConfirm = useCallback(() => {
    setModalState(null);
    if (modalState === "full") {
      // Try to add the model first if there's room now
      const slotCount = getCachedSlotCount();
      if (slotCount < 3) {
        addModelToCache(modelId);
        setIsInCompare(true);
        window.dispatchEvent(new Event("byd-compare-change"));
      }
      router.push(`/${locale}/compare`);
    } else {
      router.push(`/${locale}/compare`);
    }
  }, [modalState, modelId, locale, router]);

  const handleClose = useCallback(() => {
    setModalState(null);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className}
        style={style}
      >
        {children ?? dynamicLabel}
      </button>
      <CompareConfirmModal
        state={modalState}
        locale={locale}
        modelName={modelName}
        modelId={modelId}
        selectedModels={selectedModels}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onRemoveModel={handleRemoveModel}
        onAddInSlot={handleAddInSlot}
      />
    </>
  );
}
