import Link from "next/link";
import ModelsTable from "@/components/admin/ModelsTable";
import { getAllModels } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function ModelsPage() {
  const models = await getAllModels();

  return (
    <div className="p-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-white/35 mt-1">
            Toggle availability, or click Edit to update pricing and specs.
          </p>
        </div>
        <Link
          href="/admin/models/new"
          className="flex-shrink-0 bg-byd-red text-white text-sm font-semibold px-4 py-2.5 hover:bg-byd-red/90 transition-colors duration-200"
        >
          + New Product
        </Link>
      </div>

      <ModelsTable initialModels={models} />

      <p className="mt-6 text-xs text-white/35">
        Changes to availability take effect immediately. Price and spec changes
        are applied on the next page load.
      </p>
    </div>
  );
}
