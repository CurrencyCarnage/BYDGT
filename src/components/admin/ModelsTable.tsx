"use client";

import { useState } from "react";
import Link from "next/link";
import type { CarModel } from "@/lib/types";

async function patchModel(id: string, update: Partial<CarModel>) {
  const res = await fetch(`/api/models/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-40 ${
        checked ? "bg-byd-red" : "bg-[#2C2F30] border border-glass-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function ModelsTable({
  initialModels,
}: {
  initialModels: CarModel[];
}) {
  const [models, setModels] = useState<CarModel[]>(initialModels);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle(
    model: CarModel,
    field: "isAvailable" | "isFeatured"
  ) {
    setSaving(model.id + field);
    setError(null);

    const updated = { ...model, [field]: !model[field] };
    try {
      const saved: CarModel = await patchModel(model.id, updated);
      setModels((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
    } catch {
      setError(`Failed to update ${model.name.en}`);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-4 text-sm text-error bg-error/10 border border-error/20 px-4 py-3">
          {error}
        </p>
      )}

      <div className="overflow-x-auto border border-glass-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-glass-border bg-[#2C2F30]/50">
              <th className="text-left px-5 py-3 text-xs font-medium text-white/35 uppercase tracking-widest">
                Model
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-white/35 uppercase tracking-widest">
                Type
              </th>
              <th className="text-left px-5 py-3 text-xs font-medium text-white/35 uppercase tracking-widest">
                Base Price
              </th>
              <th className="text-center px-5 py-3 text-xs font-medium text-white/35 uppercase tracking-widest">
                Available
              </th>
              <th className="text-center px-5 py-3 text-xs font-medium text-white/35 uppercase tracking-widest">
                Featured
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border">
            {models.map((model) => (
              <tr
                key={model.id}
                className="bg-[#1C1E1F] hover:bg-[#2C2F30]/40 transition-colors duration-150"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-white">
                    {model.name.en}
                  </p>
                  <p className="text-xs text-white/35 mt-0.5">
                    {model.category}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded ${
                      model.type === "EV"
                        ? "bg-badge-ev-bg text-badge-ev"
                        : "bg-badge-phev-bg text-badge-phev"
                    }`}
                  >
                    {model.type}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-white">
                  ${model.basePrice.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-center">
                  <Toggle
                    checked={model.isAvailable}
                    onChange={() => handleToggle(model, "isAvailable")}
                    disabled={saving === model.id + "isAvailable"}
                  />
                </td>
                <td className="px-5 py-4 text-center">
                  <Toggle
                    checked={model.isFeatured}
                    onChange={() => handleToggle(model, "isFeatured")}
                    disabled={saving === model.id + "isFeatured"}
                  />
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/models/${model.id}`}
                    className="text-xs font-medium text-byd-red border border-byd-red/30 px-3 py-1.5 hover:bg-byd-red/10 transition-colors duration-200 whitespace-nowrap"
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
