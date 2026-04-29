import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import type { CarModel } from "@/lib/types";

async function fetchModels(): Promise<CarModel[]> {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/models`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className="bg-[#1C1E1F] border border-glass-border p-5">
      <p className="text-xs font-medium text-white/35 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`text-3xl font-bold ${accent ?? "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const models = await fetchModels();

  const available = models.filter((m) => m.isAvailable).length;
  const featured = models.filter((m) => m.isFeatured).length;
  const phev = models.filter((m) => m.type === "PHEV").length;
  const ev = models.filter((m) => m.type === "EV").length;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          {greeting()}, {session?.user?.name ?? "Admin"}
        </h1>
        <p className="text-white/35 mt-1">
          Here&apos;s a snapshot of the BYD Georgia catalogue.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Models" value={models.length} />
        <StatCard
          label="Available"
          value={available}
          accent="text-success"
        />
        <StatCard label="Featured" value={featured} accent="text-byd-red" />
        <StatCard
          label="EV / PHEV"
          value={`${ev} / ${phev}`}
          accent="text-[#D4D8DB]"
        />
      </div>

      {/* Model quick-access cards */}
      <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
        Models
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-[#1C1E1F] border border-glass-border p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-white text-sm leading-tight">
                  {model.name.en}
                </p>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 inline-block ${
                    model.type === "EV"
                      ? "bg-badge-ev-bg text-badge-ev"
                      : "bg-badge-phev-bg text-badge-phev"
                  }`}
                >
                  {model.type}
                </span>
              </div>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  model.isAvailable
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-error/10 text-error border-error/20"
                }`}
              >
                {model.isAvailable ? "Live" : "Hidden"}
              </span>
            </div>

            <p className="text-lg font-bold text-white">
              ${model.basePrice.toLocaleString()}
            </p>

            <Link
              href={`/admin/models/${model.id}`}
              className="mt-auto text-center text-sm font-medium text-byd-red border border-byd-red/30 py-2 hover:bg-byd-red/10 transition-colors duration-200"
            >
              Edit Model
            </Link>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="mt-8 pt-8 border-t border-glass-border">
        <Link
          href="/admin/models"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-byd-red transition-colors duration-200"
        >
          View all models →
        </Link>
      </div>
    </div>
  );
}
