"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_LINKS } from "@/lib/nav";

export default function MobileNav() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/login");
  }

  return (
    <nav className="sticky top-0 z-40 flex gap-2 overflow-x-auto border-b border-[#F0EFEE] bg-white px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] md:hidden">
      {ADMIN_LINKS.map((link) => {
        const active = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold ${
              active ? "bg-[#1677FF] text-white" : "bg-[#FAFAF9] text-[#64748B]"
            }`}
          >
              {link.short}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => void logout()}
        className="shrink-0 rounded-full bg-[#FEF2F2] px-3 py-1.5 text-xs font-extrabold text-[#EF4444]"
      >
        Sortir
      </button>
    </nav>
  );
}
