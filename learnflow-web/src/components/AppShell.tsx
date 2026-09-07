"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import Avatar from "./Avatar";
import Logo from "./Logo";
import type { IconName } from "./Icon";
import FloatingChatbot from "./FloatingChatbot";

const NAV: { href: string; label: string; icon: IconName; fill: string; outline: string }[] = [
  { href: "/app", label: "Accueil", icon: "home", fill: "/icons/home-fill.png", outline: "/icons/home.png" },
  { href: "/app/cours", label: "Cours", icon: "book", fill: "/icons/book-fill.png", outline: "/icons/book.png" },
  { href: "/app/ligue", label: "Ligues", icon: "trophy", fill: "/icons/trophy-fill.png", outline: "/icons/trophy.png" },
  { href: "/app/profil", label: "Profil", icon: "user", fill: "/icons/user-fill.png", outline: "/icons/user.png" },
];

function TabLink({
  item,
  active,
  muted,
  primary,
}: {
  item: (typeof NAV)[number];
  active: boolean;
  muted: string;
  primary: string;
}) {
  return (
    <Link
      href={item.href}
      className="lf-tabbar-slot flex flex-col items-center justify-end gap-0.5 px-0.5 pb-1 pt-1.5 no-underline"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={active ? item.fill : item.outline}
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 object-contain sm:h-[22px] sm:w-[22px]"
      />
      <span
        className="max-w-full truncate text-[10px] font-bold leading-tight sm:text-[11px]"
        style={{ color: active ? primary : muted }}
      >
        {item.label}
      </span>
      <span className="h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5" style={{ background: active ? primary : "transparent" }} />
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { colors, darkMode } = useAppTheme();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const fullscreen = pathname.startsWith("/app/blitz");
  const agendaOn = pathname.startsWith("/app/agenda");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (fullscreen) {
    return <div className="h-dvh min-h-dvh overflow-hidden">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh max-w-[100vw] overflow-x-clip" style={{ background: colors.surface, color: colors.textDark }}>
      <aside
        className="hidden w-[min(232px,28vw)] shrink-0 flex-col border-r lg:flex"
        style={{ background: colors.white, borderColor: colors.border }}
      >
        <div className="flex h-[72px] items-center border-b px-5" style={{ borderColor: colors.border }}>
          <Link href="/app" className="min-w-0">
            <Logo height="nav" animated={false} />
          </Link>
        </div>
        <nav className="mt-3 flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold"
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
              background: agendaOn ? (darkMode ? "#0C1A33" : "#E6F4FF") : "transparent",
              color: agendaOn ? colors.primary : colors.textSecondary,
            }}
          >
            <Logo variant="mark" height={28} animated={false} />
            Agenda
          </Link>
        </nav>
        <div className="border-t p-4" style={{ borderColor: colors.border }}>
          <Link href="/app/profil" className="flex items-center gap-3">
            <Avatar avatarId={profile.avatarId} size={40} initials={profile.firstName} fallbackColor={profile.color} />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">{profile.firstName}</p>
              <p className="truncate text-xs font-semibold" style={{ color: colors.textMuted }}>
                {profile.gradeLabel} · {profile.xpTotale.toLocaleString()} XP
              </p>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        {children}
      </div>

      <nav className="lf-tabbar lg:hidden" aria-label="Navigation">
        <div
          className="lf-tabbar-bar border-t"
          style={{
            background: colors.white,
            borderColor: darkMode ? colors.border : "#E7E5E4",
          }}
        >
          {NAV.slice(0, 2).map((item) => (
            <TabLink
              key={item.href}
              item={item}
              active={item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href)}
              muted="#A8A29E"
              primary={colors.primary}
            />
          ))}
          <div className="lf-tabbar-slot" aria-hidden />
          {NAV.slice(2).map((item) => (
            <TabLink
              key={item.href}
              item={item}
              active={pathname.startsWith(item.href)}
              muted="#A8A29E"
              primary={colors.primary}
            />
          ))}
        </div>
        <Link href="/app/agenda" aria-label="Ouvrir l'agenda" className="lf-tabbar-fab">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="" width={56} height={56} draggable={false} />
        </Link>
      </nav>

      <FloatingChatbot />
    </div>
  );
}
