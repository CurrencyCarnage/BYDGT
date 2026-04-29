import type { CarModel } from "@/lib/types";
import ModelsTable from "@/components/admin/ModelsTable";

async function fetchModels(): Promise<CarModel[]> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/models`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function ModelsPage() {
  const models = await fetchModels();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Models</h1>
        <p className="text-white/35 mt-1">
          Toggle availability and featured status, or click Edit to update
          pricing and specs.
        </p>
      </div>

      <ModelsTable initialModels={models} />

      <p className="mt-6 text-xs text-white/35">
        Changes to availability and featured status take effect immediately.
        Price and spec changes are applied on the next page load.
      </p>
    </div>
  );
}
