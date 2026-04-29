import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const adminName = session.user?.name ?? "Admin";

  return (
    <div className="flex min-h-screen bg-byd-dark">
      <AdminSidebar adminName={adminName} />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-60 min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
}
