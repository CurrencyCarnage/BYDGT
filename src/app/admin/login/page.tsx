import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-byd-dark px-4">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-white tracking-tight">
              GT<span className="text-byd-red">Group</span>
            </span>
            <span className="text-white/35 text-sm">×</span>
            <span className="text-lg font-semibold text-white/60">
              BYD
            </span>
          </div>
          <h1 className="text-xl font-semibold text-white">
            Admin Access
          </h1>
          <p className="text-sm text-white/35 mt-1">
            Authorised personnel only
          </p>
        </div>

        {/* Login card */}
        <div className="bg-[#1C1E1F] border border-glass-border p-8 shadow-card">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-white/35 mt-6">
          GT Group · Official BYD Dealer · Georgia
        </p>
      </div>
    </div>
  );
}
