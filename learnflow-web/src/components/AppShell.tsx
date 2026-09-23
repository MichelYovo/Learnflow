"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAppTheme } from "@/theme/useAppTheme";
import type { IconName } from "./Icon";
import FloatingChatbot from "./FloatingChatbot";
import ParentConfirmModal from "./ParentConfirmModal";
import AvatarGate from "./AvatarGate";
import RewardToast from "./RewardToast";
import AppTour from "./AppTour";
import WidgetErrorBoundary from "./WidgetErrorBoundary";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";

const NAV: { href: string; label: string; icon: IconName; fill: string; outline: string }[] = [
  { href: "/app", label: "Accueil", icon: "home", fill: "/icons/home-fill.png", outline: "/icons/home.png" },
  { href: "/app/cours", label: "Cours", icon: "book", fill: "/icons/book-fill.png", outline: "/icons/book.png" },
  { href: "/app/ligue", label: "Ligues", icon: "trophy", fill: "/icons/trophy-fill.png", outline: "/icons/trophy.png" },
  { href: "/app/profil", label: "Profil", icon: "user", fill: "/icons/user-fill.png", outline: "/icons/user.png" },
];

const SIDE_NAV = [
  ...NAV,
  { href: "/app/agenda", label: "Agenda", fill: "/brand/logo-mark.png", outline: "/brand/logo-mark.png" },
];

/** Black PNG glyphs, tinted like the mobile tab bar so they stay visible on the dark bar. */
function NavGlyph({ src, color, className }: { src: string; color: string; className: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

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
      prefetch
      data-tour={item.href === "/app/cours" ? "nav-cours" : item.href === "/app/ligue" ? "nav-ligue" : undefined}
      className="lf-tabbar-slot flex flex-col items-center justify-end gap-0.5 px-0.5 pb-1 pt-1.5 no-underline"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <NavGlyph
        src={active ? item.fill : item.outline}
        color={active ? primary : muted}
        className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
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

/** Compte le temps passé dans l’app, tant que l’onglet est visible. */
function LiveStudyPulse() {
  const addStudyMs = useLearnFlowStore((s) => s.addStudyMs);
  useEffect(() => {
    let last = Date.now();
    let sinceSync = 0;
    const tick = (countWhileHidden: boolean) => {
      const now = Date.now();
      const delta = now - last;
      last = now;
      if (delta < 1000 || delta > 45_000) return;
      if (!countWhileHidden && document.visibilityState !== "visible") return;
      addStudyMs(delta);
      sinceSync += delta;
      if (sinceSync >= 120_000) {
        sinceSync = 0;
        void import("@/lib/progressSync").then((m) => m.requestProgressSync());
      }
    };
    const id = window.setInterval(() => tick(false), 15_000);
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        tick(true);
        void import("@/lib/progressSync").then((m) => m.requestProgressSync());
      } else {
        last = Date.now();
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [addStudyMs]);
  return null;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const { colors, darkMode } = useAppTheme();
  const fullscreen =
    pathname.startsWith("/app/blitz") ||
    pathname.startsWith("/app/quiz/assimilation") ||
    pathname.startsWith("/app/quiz/grand");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (fullscreen) {
    return (
      <div className="h-dvh min-h-dvh overflow-hidden">
        <LiveStudyPulse />
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full max-w-[100vw] overflow-x-hidden" style={{ background: colors.surface, color: colors.textDark }}>
      <LiveStudyPulse />
      <aside
        className="hidden w-[min(240px,28vw)] shrink-0 flex-col border-r lg:flex"
        style={{ background: colors.white, borderColor: colors.border }}
      >
        <nav className="flex flex-col gap-0.5 p-3" aria-label="Navigation">
          {SIDE_NAV.map((item) => {
            const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                data-tour={
                  item.href === "/app/cours"
                    ? "nav-cours-side"
                    : item.href === "/app/ligue"
                      ? "nav-ligue-side"
                      : item.href === "/app/agenda"
                        ? "nav-agenda-side"
                        : undefined
                }
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold"
                style={{
                  background: active ? (darkMode ? "#1C1C1E" : "#E6F4FF") : "transparent",
                  color: active ? colors.primary : colors.textSecondary,
                }}
              >
                {item.fill.includes("logo-mark") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.fill} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
                ) : (
                  <NavGlyph
                    src={active ? item.fill : item.outline}
                    color={active ? colors.primary : colors.textSecondary}
                    className="h-[18px] w-[18px]"
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div key={pathname} className="lf-page-in flex min-w-0 flex-1 flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <WidgetErrorBoundary
          fallback={
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="text-lg font-extrabold">Cette page a rencontré un souci</p>
              <p className="text-sm font-medium" style={{ color: colors.textMuted }}>
                Réessaie ou ouvre un autre onglet.
              </p>
              <Link href="/app" className="rounded-full bg-[#1677FF] px-5 py-2.5 text-sm font-extrabold text-white">
                Revenir à l’accueil
              </Link>
            </div>
          }
        >
          {children}
        </WidgetErrorBoundary>
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
        <Link href="/app/agenda" prefetch aria-label="Ouvrir l'agenda" className="lf-tabbar-fab" data-tour="agenda">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-mark.png" alt="" width={56} height={56} draggable={false} />
        </Link>
      </nav>

      <WidgetErrorBoundary>
        <FloatingChatbot />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary>
        <ParentConfirmModal />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary>
        <RewardToast />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary>
        <AvatarGate />
      </WidgetErrorBoundary>
      <WidgetErrorBoundary>
        <AppTour />
      </WidgetErrorBoundary>
    </div>
  );
}
