import { notFound } from "next/navigation";
import Link from "next/link";
import type { CarModel } from "@/lib/types";
import ModelEditForm from "@/components/admin/ModelEditForm";

async function fetchModel(id: string): Promise<CarModel | null> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/models/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function ModelEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const model = await fetchModel(params.id);
  if (!model) notFound();

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link
          href="/admin/models"
          className="hover:text-text-primary transition-colors"
        >
          Models
        </Link>
        <span>/</span>
        <span className="text-text-primary">{model.name.en}</span>
      </nav>

      <div className="flex items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {model.name.en}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                model.type === "EV"
                  ? "bg-badge-ev-bg text-badge-ev"
                  : "bg-badge-phev-bg text-badge-phev"
              }`}
            >
              {model.type}
            </span>
            <span className="text-text-muted text-xs">{model.category}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                model.isAvailable
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-error/10 text-error border-error/20"
              }`}
            >
              {model.isAvailable ? "Available" : "Hidden"}
            </span>
          </div>
        </div>
      </div>

      <ModelEditForm initialModel={model} />
    </div>
  );
}
