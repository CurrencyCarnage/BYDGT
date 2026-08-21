import Link from "next/link";
import ModelEditForm from "@/components/admin/ModelEditForm";
import type { CarModel } from "@/lib/types";

const emptyModel: CarModel = {
  id: "",
  year: 2026,
  years: [2026],
  name: { en: "", ka: "" },
  tagline: { en: "", ka: "" },
  category: "",
  type: "EV",
  basePrice: 0,
  currency: "USD",
  specs: {
    range_km: 0,
    power_hp: 0,
    acceleration_0_100: 0,
    top_speed_kmh: 0,
    battery_kwh: 0,
  },
  configurations: {
    colors: [],
    variants: [],
  },
  images: {
    hero: "",
    gallery: [],
    colorViews: {},
  },
  features: [],
  isAvailable: false,
  isFeatured: false,
};

export default function NewModelPage() {
  return (
    <div className="p-8">
      <nav className="flex items-center gap-2 text-sm text-white/35 mb-6">
        <Link href="/admin/models" className="hover:text-white transition-colors">
          Products
        </Link>
        <span>/</span>
        <span className="text-white">New Product</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create New Product</h1>
        <p className="text-white/35 mt-1">
          Fill in the details below. New products are hidden by default until you enable availability.
        </p>
      </div>

      <ModelEditForm initialModel={emptyModel} mode="create" />
    </div>
  );
}
