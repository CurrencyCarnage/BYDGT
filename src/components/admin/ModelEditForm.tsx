"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CarModel } from "@/lib/types";

export default function ModelEditForm({ initialModel }: { initialModel: CarModel }) {
  const router = useRouter();
  const [model, setModel] = useState<CarModel>(initialModel);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  function set<K extends keyof CarModel>(key: K, value: CarModel[K]) {
    setModel((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/models/${model.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(model),
      });
      if (!res.ok) throw new Error("Save failed");
      setFeedback({ type: "success", msg: "Model saved successfully." });
      router.refresh();
    } catch {
      setFeedback({ type: "error", msg: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {/* Section: Basic Info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Base Price (USD)">
            <input
              type="number"
              min={0}
              step={100}
              value={model.basePrice}
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
            <Toggle
              label="Featured on homepage"
              checked={model.isFeatured}
              onChange={(v) => set("isFeatured", v)}
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
          {model.specs.electric_range_km !== undefined && (
            <Field label="Electric Range (km)">
              <input
                type="number"
                min={0}
                value={model.specs.electric_range_km}
                onChange={(e) =>
                  set("specs", {
                    ...model.specs,
                    electric_range_km: Number(e.target.value),
                  })
                }
                className={inputCls}
              />
            </Field>
          )}
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
              className="flex items-center gap-4 bg-bg-tertiary border border-glass-border rounded-button px-4 py-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {variant.name.en}
                </p>
                <p className="text-xs text-text-muted">{variant.name.ka}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">+$</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={variant.priceModifier}
                  onChange={(e) => {
                    const updated = model.configurations.variants.map((v, idx) =>
                      idx === i
                        ? { ...v, priceModifier: Number(e.target.value) }
                        : v
                    );
                    set("configurations", {
                      ...model.configurations,
                      variants: updated,
                    });
                  }}
                  className="w-24 bg-bg-secondary border border-glass-border rounded-button px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-gt-green transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section: Colors */}
      <Section title="Colour Options">
        <div className="flex flex-col gap-3">
          {model.configurations.colors.map((color, i) => (
            <div
              key={color.id}
              className="flex items-center gap-4 bg-bg-tertiary border border-glass-border rounded-button px-4 py-3"
            >
              {/* Color picker */}
              <label className="cursor-pointer" title="Pick colour">
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
                    set("configurations", {
                      ...model.configurations,
                      colors: updated,
                    });
                  }}
                  className="sr-only"
                />
              </label>

              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {color.name.en}
                </p>
                <p className="text-xs text-text-muted font-mono">{color.hex}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">+$</span>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={color.priceModifier}
                  onChange={(e) => {
                    const updated = model.configurations.colors.map((c, idx) =>
                      idx === i
                        ? { ...c, priceModifier: Number(e.target.value) }
                        : c
                    );
                    set("configurations", {
                      ...model.configurations,
                      colors: updated,
                    });
                  }}
                  className="w-24 bg-bg-secondary border border-glass-border rounded-button px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-gt-green transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mb-4 text-sm px-4 py-3 rounded-button border ${
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
          className="bg-gt-green text-bg-primary font-semibold px-6 py-2.5 rounded-button hover:bg-gt-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-glow-green"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          onClick={() => {
            setModel(initialModel);
            setFeedback(null);
          }}
          disabled={saving}
          className="text-text-muted border border-glass-border px-5 py-2.5 rounded-button hover:text-text-primary hover:border-glass-border-hover transition-all duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */

const inputCls =
  "w-full bg-bg-tertiary border border-glass-border rounded-button px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-gt-green transition-colors duration-200";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4 pb-2 border-b border-glass-border">
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
      <label className="text-xs font-medium text-text-secondary">{label}</label>
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
      <span className="text-sm text-text-secondary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
          checked ? "bg-gt-green" : "bg-bg-tertiary border border-glass-border"
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
