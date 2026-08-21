"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { CarModel } from "@/lib/types";
import CustomSelect from "@/components/ui/CustomSelect";

interface Props {
  initialModel: CarModel;
  mode?: "edit" | "create";
}

export default function ModelEditForm({ initialModel, mode = "edit" }: Props) {
  const router = useRouter();
  const [model, setModel] = useState<CarModel>(initialModel);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function set<K extends keyof CarModel>(key: K, value: CarModel[K]) {
    setModel((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadFile(file: File, type: "hero" | "silhouette" | "heroVideo") {
    setUploading(type);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", type);
      form.append("modelId", model.id);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const { path } = await res.json();

      if (type === "hero") {
        set("images", { ...model.images, hero: path });
      } else if (type === "silhouette") {
        set("images", { ...model.images, colorSilhouette: path });
      } else if (type === "heroVideo") {
        set("images", { ...model.images, heroVideo: path });
      }
      setFeedback({ type: "success", msg: `${type} uploaded successfully.` });
    } catch {
      setFeedback({ type: "error", msg: `Failed to upload ${type}.` });
    } finally {
      setUploading(null);
    }
  }

  async function handleSave() {
    if (mode === "create" && !model.id) {
      setFeedback({ type: "error", msg: "Product ID is required." });
      return;
    }
    if (mode === "create" && !model.name.en) {
      setFeedback({ type: "error", msg: "English name is required." });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const url = mode === "create" ? "/api/models" : `/api/models/${model.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(model),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }

      if (mode === "create") {
        setFeedback({ type: "success", msg: "Product created! Redirecting..." });
        setTimeout(() => router.push(`/admin/models/${model.id}`), 1000);
      } else {
        setFeedback({ type: "success", msg: "Product saved successfully." });
        router.refresh();
      }
    } catch (e) {
      setFeedback({ type: "error", msg: e instanceof Error ? e.message : "Failed to save." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/models/${model.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.push("/admin/models");
      router.refresh();
    } catch {
      setFeedback({ type: "error", msg: "Failed to delete product." });
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="max-w-3xl">

      {/* Section: Identity (create mode only) */}
      {mode === "create" && (
        <Section title="Product Identity">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product ID (slug)">
              <input
                type="text"
                value={model.id}
                onChange={(e) => set("id", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="e.g. han-ev"
                className={inputCls}
              />
              <p className="text-[10px] text-white/30 mt-1">Lowercase, hyphens only. Used in URLs and filenames.</p>
            </Field>
            <Field label="Type">
              <CustomSelect
                value={model.type}
                onChange={(value) => set("type", value as "EV" | "PHEV")}
                placeholder="Type"
                options={[{ value: "EV", label: "EV" }, { value: "PHEV", label: "PHEV" }]}
                buttonClassName="px-4 py-2.5 text-sm"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name (English)">
              <input
                type="text"
                value={model.name.en}
                onChange={(e) => set("name", { ...model.name, en: e.target.value })}
                placeholder="BYD Han EV"
                className={inputCls}
              />
            </Field>
            <Field label="Name (Georgian)">
              <input
                type="text"
                value={model.name.ka}
                onChange={(e) => set("name", { ...model.name, ka: e.target.value })}
                placeholder="BYD Han EV"
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Category">
            <input
              type="text"
              value={model.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Sedan, SUV, Compact"
              className={inputCls}
            />
          </Field>
        </Section>
      )}

      {/* Section: Images */}
      <Section title="Images">
        {mode === "create" && !model.id && (
          <p className="text-xs text-white/30 italic -mt-2 mb-2">Enter a Product ID above first, then upload images.</p>
        )}
        <div className="grid grid-cols-1 gap-5">
          <ImageUpload
            label="Hero Image"
            hint="Full-width background image for the product page (JPG/PNG, ~1920px wide)"
            accept="image/*"
            currentPath={model.images.hero}
            uploading={uploading === "hero"}
            disabled={!model.id}
            onUpload={(file) => uploadFile(file, "hero")}
          />
          <ImageUpload
            label="Color Silhouette"
            hint="Grayscale car outline PNG for the color configurator tinting engine"
            accept="image/png"
            currentPath={model.images.colorSilhouette}
            uploading={uploading === "silhouette"}
            disabled={!model.id}
            onUpload={(file) => uploadFile(file, "silhouette")}
          />
          <ImageUpload
            label="Hero Video (optional)"
            hint="MP4 promo video shown instead of the hero image"
            accept="video/mp4"
            currentPath={model.images.heroVideo}
            uploading={uploading === "heroVideo"}
            disabled={!model.id}
            onUpload={(file) => uploadFile(file, "heroVideo")}
          />
        </div>
      </Section>

      {/* Section: Basic Info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Model Year">
            <input
              type="number"
              min={1900}
              max={2100}
              step={1}
              value={model.year}
              onChange={(e) => set("year", Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="Base Price (USD)">
            <input
              type="number"
              min={0}
              step={100}
                value={model.basePrice ?? 0}
              onChange={(e) => set("basePrice", Number(e.target.value))}
              className={inputCls}
            />
          </Field>
          <div className="flex flex-col gap-4 pt-1">
            <Toggle
              label="Available on site"
              checked={model.isAvailable}
              onChange={(v) => set("isAvailable", v)}
            />
          </div>
        </div>
      </Section>

      {/* Section: Tagline */}
      <Section title="Tagline">
        <Field label="English">
          <input
            type="text"
            value={model.tagline.en}
            onChange={(e) =>
              set("tagline", { ...model.tagline, en: e.target.value })
            }
            className={inputCls}
          />
        </Field>
        <Field label="Georgian (ქართული)">
          <input
            type="text"
            value={model.tagline.ka}
            onChange={(e) =>
              set("tagline", { ...model.tagline, ka: e.target.value })
            }
            className={inputCls}
          />
        </Field>
      </Section>

      {/* Section: Specs */}
      <Section title="Specifications">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Range (km)">
            <input
              type="number"
              min={0}
              value={model.specs.range_km}
              onChange={(e) =>
                set("specs", { ...model.specs, range_km: Number(e.target.value) })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Electric Range (km)">
            <input
              type="number"
              min={0}
              value={model.specs.electric_range_km ?? 0}
              onChange={(e) =>
                set("specs", {
                  ...model.specs,
                  electric_range_km: Number(e.target.value) || undefined,
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Power (hp)">
            <input
              type="number"
              min={0}
              value={model.specs.power_hp}
              onChange={(e) =>
                set("specs", { ...model.specs, power_hp: Number(e.target.value) })
              }
              className={inputCls}
            />
          </Field>
          <Field label="0–100 km/h (s)">
            <input
              type="number"
              min={0}
              step={0.1}
              value={model.specs.acceleration_0_100}
              onChange={(e) =>
                set("specs", {
                  ...model.specs,
                  acceleration_0_100: Number(e.target.value),
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Top Speed (km/h)">
            <input
              type="number"
              min={0}
              value={model.specs.top_speed_kmh}
              onChange={(e) =>
                set("specs", {
                  ...model.specs,
                  top_speed_kmh: Number(e.target.value),
                })
              }
              className={inputCls}
            />
          </Field>
          <Field label="Battery (kWh)">
            <input
              type="number"
              min={0}
              step={0.1}
              value={model.specs.battery_kwh}
              onChange={(e) =>
                set("specs", {
                  ...model.specs,
                  battery_kwh: Number(e.target.value),
                })
              }
              className={inputCls}
            />
          </Field>
        </div>
      </Section>

      {/* Section: Variants */}
      <Section title="Variants">
        <div className="flex flex-col gap-3">
          {model.configurations.variants.map((variant, i) => (
            <div
              key={variant.id}
              className="bg-[#2C2F30] border border-glass-border px-4 py-3"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={variant.name.en}
                    onChange={(e) => {
                      const updated = model.configurations.variants.map((v, idx) =>
                        idx === i ? { ...v, name: { ...v.name, en: e.target.value } } : v
                      );
                      set("configurations", { ...model.configurations, variants: updated });
                    }}
                    placeholder="Name (EN)"
                    className={inputSmCls}
                  />
                  <input
                    type="text"
                    value={variant.name.ka}
                    onChange={(e) => {
                      const updated = model.configurations.variants.map((v, idx) =>
                        idx === i ? { ...v, name: { ...v.name, ka: e.target.value } } : v
                      );
                      set("configurations", { ...model.configurations, variants: updated });
                    }}
                    placeholder="Name (KA)"
                    className={inputSmCls}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/35">+$</span>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={variant.priceModifier}
                    onChange={(e) => {
                      const updated = model.configurations.variants.map((v, idx) =>
                        idx === i ? { ...v, priceModifier: Number(e.target.value) } : v
                      );
                      set("configurations", { ...model.configurations, variants: updated });
                    }}
                    className="w-24 bg-[#1C1E1F] border border-glass-border px-3 py-1.5 text-sm text-white focus:outline-none focus:border-byd-red transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = model.configurations.variants.filter((_, idx) => idx !== i);
                    set("configurations", { ...model.configurations, variants: updated });
                  }}
                  className="text-white/25 hover:text-error transition-colors p-1"
                  title="Remove variant"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newVariant = {
                id: `variant-${Date.now()}`,
                name: { en: "", ka: "" },
                priceModifier: 0,
              };
              set("configurations", {
                ...model.configurations,
                variants: [...model.configurations.variants, newVariant],
              });
            }}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-byd-red border border-dashed border-glass-border hover:border-byd-red/40 px-4 py-2.5 transition-colors duration-200"
          >
            <PlusIcon /> Add Variant
          </button>
        </div>
      </Section>

      {/* Section: Colors */}
      <Section title="Colour Options">
        <div className="flex flex-col gap-3">
          {model.configurations.colors.map((color, i) => (
            <div
              key={color.id}
              className="bg-[#2C2F30] border border-glass-border px-4 py-3"
            >
              <div className="flex items-center gap-4">
                {/* Color picker */}
                <label className="cursor-pointer flex-shrink-0" title="Pick colour">
                  <span
                    className="block w-8 h-8 rounded-full border-2 border-glass-border-hover shadow overflow-hidden"
                    style={{ backgroundColor: color.hex }}
                  />
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => {
                      const updated = model.configurations.colors.map((c, idx) =>
                        idx === i ? { ...c, hex: e.target.value } : c
                      );
                      set("configurations", { ...model.configurations, colors: updated });
                    }}
                    className="sr-only"
                  />
                </label>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={color.name.en}
                    onChange={(e) => {
                      const updated = model.configurations.colors.map((c, idx) =>
                        idx === i ? { ...c, name: { ...c.name, en: e.target.value } } : c
                      );
                      set("configurations", { ...model.configurations, colors: updated });
                    }}
                    placeholder="Name (EN)"
                    className={inputSmCls}
                  />
                  <input
                    type="text"
                    value={color.name.ka}
                    onChange={(e) => {
                      const updated = model.configurations.colors.map((c, idx) =>
                        idx === i ? { ...c, name: { ...c.name, ka: e.target.value } } : c
                      );
                      set("configurations", { ...model.configurations, colors: updated });
                    }}
                    placeholder="Name (KA)"
                    className={inputSmCls}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/35">+$</span>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={color.priceModifier}
                    onChange={(e) => {
                      const updated = model.configurations.colors.map((c, idx) =>
                        idx === i ? { ...c, priceModifier: Number(e.target.value) } : c
                      );
                      set("configurations", { ...model.configurations, colors: updated });
                    }}
                    className="w-24 bg-[#1C1E1F] border border-glass-border px-3 py-1.5 text-sm text-white focus:outline-none focus:border-byd-red transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const updated = model.configurations.colors.filter((_, idx) => idx !== i);
                    set("configurations", { ...model.configurations, colors: updated });
                  }}
                  className="text-white/25 hover:text-error transition-colors p-1"
                  title="Remove colour"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newColor = {
                id: `color-${Date.now()}`,
                name: { en: "", ka: "" },
                hex: "#808080",
                priceModifier: 0,
              };
              set("configurations", {
                ...model.configurations,
                colors: [...model.configurations.colors, newColor],
              });
            }}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-byd-red border border-dashed border-glass-border hover:border-byd-red/40 px-4 py-2.5 transition-colors duration-200"
          >
            <PlusIcon /> Add Colour
          </button>
        </div>
      </Section>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mb-4 text-sm px-4 py-3 border ${
            feedback.type === "success"
              ? "text-success bg-success/10 border-success/20"
              : "text-error bg-error/10 border-error/20"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 pb-12">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-byd-red text-white font-semibold px-6 py-2.5 hover:bg-byd-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {saving
            ? mode === "create" ? "Creating…" : "Saving…"
            : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
        <button
          onClick={() => {
            setModel(initialModel);
            setFeedback(null);
          }}
          disabled={saving}
          className="text-white/35 border border-glass-border px-5 py-2.5 hover:text-white hover:border-glass-border-hover transition-all duration-200"
        >
          Reset
        </button>

      </div>

      {/* Danger zone — delete (edit mode only) */}
      {mode === "edit" && (
        <div className="mt-6 border border-error/20 bg-error/[0.04] px-5 py-4 mb-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-error">Danger Zone</p>
              <p className="text-xs text-white/35 mt-0.5">Permanently delete this product and all its data.</p>
            </div>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs font-semibold text-white bg-error px-4 py-2 hover:bg-error/80 disabled:opacity-50 transition-colors"
                >
                  {deleting ? "Deleting…" : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="text-xs text-white/40 border border-glass-border px-4 py-2 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm font-medium text-error border border-error/40 px-4 py-2 hover:bg-error/10 transition-colors duration-200"
              >
                Delete Product
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Shared sub-components ── */

const inputCls =
  "w-full bg-[#2C2F30] border border-glass-border px-4 py-2.5 text-white text-sm focus:outline-none focus:border-byd-red transition-colors duration-200";

const inputSmCls =
  "w-full bg-[#1C1E1F] border border-glass-border px-3 py-1.5 text-sm text-white focus:outline-none focus:border-byd-red transition-colors";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4 pb-2 border-b border-glass-border">
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-white/60">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-white/60">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-byd-red" : "bg-[#2C2F30] border border-glass-border"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function ImageUpload({
  label,
  hint,
  accept,
  currentPath,
  uploading,
  disabled,
  onUpload,
}: {
  label: string;
  hint: string;
  accept: string;
  currentPath?: string;
  uploading: boolean;
  disabled?: boolean;
  onUpload: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-[#2C2F30] border border-glass-border px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white mb-0.5">{label}</p>
          <p className="text-[11px] text-white/30 mb-2">{hint}</p>
          {currentPath ? (
            <p className="text-xs text-white/50 font-mono truncate">{currentPath}</p>
          ) : (
            <p className="text-xs text-white/25 italic">No file uploaded</p>
          )}
        </div>
        <div>
          <input
            ref={ref}
            type="file"
            accept={accept}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
            className="sr-only"
          />
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={uploading || disabled}
            className="text-xs font-medium text-byd-red border border-byd-red/30 px-3 py-1.5 hover:bg-byd-red/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {uploading ? "Uploading…" : currentPath ? "Replace" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}
