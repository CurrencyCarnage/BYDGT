"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LogoutButton from "./LogoutButton";

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/admin/models",
    label: "Models",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
        <rect x="9" y="11" width="14" height="10" rx="2" />
        <circle cx="12" cy="16" r="1" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#1C1E1F] border-r border-glass-border flex flex-col z-50">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-glass-border">
        <div className="flex items-center gap-2.5">
          <Image
            src="/byd-wordmark.svg"
            alt="BYD"
            width={104}
            height={22}
            className="h-4 w-auto flex-shrink-0"
          />
          <span className="text-[10px] font-bold bg-byd-red/10 text-byd-red border border-byd-red/20 px-1.5 py-0.5 tracking-wider uppercase">
            Admin
          </span>
        </div>
        <p className="text-xs text-white/35 mt-1.5">GT Group · Tbilisi Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-byd-red/10 text-byd-red border border-byd-red/20"
                  : "text-white/60 hover:text-white hover:bg-[#2C2F30]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-glass-border">
        <div className="flex items-center gap-2 px-3 py-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-byd-red/20 border border-byd-red/30 flex items-center justify-center text-byd-red text-xs font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-white/60 truncate">
            {adminName}
          </span>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}
