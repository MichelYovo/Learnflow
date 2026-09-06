"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/dashboard", label: "Vue d’ensemble", icon: OverviewIcon },
  { href: "/dashboard/eleves", label: "Élèves", icon: StudentsIcon },
  { href: "/dashboard/ligues", label: "Ligues", icon: LeagueIcon },
  { href: "/dashboard/programme", label: "Programme APC", icon: BookIcon },
  { href: "/dashboard/parametres", label: "Paramètres", icon: GearIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-[#F0EFEE] bg-white md:flex">
      <div className="flex h-[72px] items-center border-b border-[#F0EFEE] px-5">
        <Link href="/dashboard" className="flex items-center">
          <Image src="/brand/logo-light.png" alt="LearnFlow" width={150} height={36} className="h-8 w-auto" priority />
        </Link>
      </div>
      <p className="px-5 pt-5 text-[11px] font-extrabold uppercase tracking-widest text-[#A8A29E]">Administration</p>
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition ${
                active ? "bg-[#E6F4FF] text-[#1677FF]" : "text-[#64748B] hover:bg-[#FAFAF9] hover:text-[#1C1917]"
              }`}
            >
              <Icon active={active} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[#F0EFEE] p-3">
        <button
          type="button"
          onClick={() => void logout()}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-[#EF4444] transition hover:bg-[#FEF2F2]"
        >
          <LogoutIcon />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

function OverviewIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="2" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" />
      <rect x="13" y="3" width="8" height="5" rx="2" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" />
      <rect x="13" y="10" width="8" height="11" rx="2" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" />
    </svg>
  );
}

function StudentsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" />
      <path d="M4 19c.6-3 2.6-5 5-5s4.4 2 5 5" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.2" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" />
      <path d="M16.2 14.2c1.7.4 3.1 1.7 3.8 4.8" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LeagueIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 20h8M12 4l2.2 4.5L19 9.2l-3.5 3.4.8 4.7L12 15.3 7.7 17.3l.8-4.7L5 9.2l4.8-.7L12 4z" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5z" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" />
      <path d="M5 18.5A2.5 2.5 0 0 1 7.5 16H20" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" />
    </svg>
  );
}

function GearIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 7.2l1.9 1.1M17.2 15.7l1.9 1.1M4.9 16.8l1.9-1.1M17.2 8.3l1.9-1.1" stroke={active ? "#1677FF" : "#94A3B8"} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3M14 8l4 4-4 4M10 12h8" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
