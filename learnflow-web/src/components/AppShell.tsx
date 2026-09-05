"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import Avatar from "./Avatar";
import Logo from "./Logo";
import Icon, { type IconName } from "./Icon";
import FloatingChatbot from "./FloatingChatbot";

const NAV: { href: string; label: string; icon: IconName; fill: string; outline: string }[] = [
  { href: "/app", label: "Accueil", icon: "home", fill: "/icons/home-fill.png", outline: "/icons/home.png" },
  { href: "/app/cours", label: "Cours", icon: "book", fill: "/icons/book-fill.png", outline: "/icons/book.png" },
  { href: "/app/ligue", label: "Ligues", icon: "trophy", fill: "/icons/trophy-fill.png", outline: "/icons/trophy.png" },
  { href: "/app/profil", label: "Profil", icon: "user", fill: "/icons/user-fill.png", outline: "/icons/user.png" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { colors, darkMode } = useAppTheme();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const fullscreen = pathname.startsWith("/app/blitz");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (fullscreen) {
    return <div className="h-dvh min-h-dvh overflow-hidden">{children}</div>;
  }

  return (
    <div className="flex min-h-full" style={{ background: colors.surface, color: colors.textDark }}>
      <aside
        className="hidden w-[248px] shrink-0 flex-col border-r md:flex"
        style={{ background: colors.white, borderColor: colors.border }}
      >
        <div className="flex h-[72px] items-center border-b px-5" style={{ borderColor: colors.border }}>
          <Link href="/app">
            <Logo height={32} />
          </Link>
        </div>
        <nav className="mt-3 flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition"
                style={{
                  background: active ? (darkMode ? "#0C1A33" : "#E6F4FF") : "transparent",
                  color: active ? colors.primary : colors.textSecondary,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={active ? item.fill : item.outline} alt="" width={18} height={18} />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/app/agenda"
            className="mt-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold"
            style={{
              background: pathname.startsWith("/app/agenda") ? colors.primary : darkMode ? "#0C1A33" : "#E6F4FF",
              color: pathname.startsWith("/app/agenda") ? "#fff" : colors.primary,
            }}
          >
            <Icon name="calendar" size={18} color={pathname.startsWith("/app/agenda") ? "#fff" : colors.primary} />
            Agenda
          </Link>
        </nav>
        <div className="border-t p-4" style={{ borderColor: colors.border }}>
          <Link href="/app/profil" className="flex items-center gap-3">
            <Avatar avatarId={profile.avatarId} size={40} initials={profile.firstName} fallbackColor={profile.color} />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">{profile.firstName}</p>
              <p className="text-xs font-semibold" style={{ color: colors.textMuted }}>
                {profile.gradeLabel} · {profile.xpTotale.toLocaleString()} XP
              </p>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-[88px] md:pb-0">{children}</div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-around border-t px-2 pb-3 pt-2 md:hidden"
        style={{ background: colors.white, borderColor: colors.border }}
      >
        {NAV.slice(0, 2).map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className="flex flex-1 flex-col items-center gap-1 py-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active ? item.fill : item.outline} alt="" width={22} height={22} />
              <span className="text-[11px] font-bold" style={{ color: active ? colors.primary : colors.textMuted }}>
                {item.label}
              </span>
            </Link>
          );
        })}
        <Link
          href="/app/agenda"
          className="-mt-8 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg"
          style={{ background: colors.primary }}
          aria-label="Agenda"
        >
          <Icon name="calendar" size={26} color="#fff" />
        </Link>
        {NAV.slice(2).map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className="flex flex-1 flex-col items-center gap-1 py-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={active ? item.fill : item.outline} alt="" width={22} height={22} />
              <span className="text-[11px] font-bold" style={{ color: active ? colors.primary : colors.textMuted }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <FloatingChatbot />
    </div>
  );
}
