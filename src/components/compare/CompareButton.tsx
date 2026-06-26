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

function readCachedModelCount(): number {
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
  const [hasModelsInCompare, setHasModelsInCompare] = useState(false);

  useEffect(() => {
    setHasModelsInCompare(readCachedModelCount() > 0);
  }, []);

  const t = locale === "ka" ? labels.ka : labels.en;
  const dynamicLabel = hasModelsInCompare ? t.addTo : t.goTo;

  const handleClick = useCallback(() => {
    const models = readCachedModels();
    const alreadySelected = models.some((m) => m.id === modelId);

    if (alreadySelected) {
      router.push(`/${locale}/compare`);
      return;
    }

    if (models.length === 0) {
      router.push(`/${locale}/compare?models=${encodeURIComponent(modelId)}`);
      return;
    }

    setSelectedModels(models);
    setModalState(models.length >= 3 ? "full" : "navigate");
  }, [modelId, locale, router]);

  const handleRemoveModel = useCallback(
    (removeId: string) => {
      removeCachedModel(removeId);
      const updated = selectedModels.filter((m) => m.id !== removeId);
      setSelectedModels(updated);
      if (modalState === "full" && updated.length < 3) {
        setModalState("navigate");
      }
    },
    [selectedModels, modalState]
  );

  const handleConfirm = useCallback(() => {
    setModalState(null);
    if (modalState === "full") {
      router.push(`/${locale}/compare`);
    } else {
      router.push(`/${locale}/compare?models=${encodeURIComponent(modelId)}`);
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
        selectedModels={selectedModels}
        onClose={handleClose}
        onConfirm={handleConfirm}
        onRemoveModel={handleRemoveModel}
      />
    </>
  );
}
