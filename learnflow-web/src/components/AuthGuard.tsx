"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AnimatedSplash from "./AnimatedSplash";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useHydrated } from "./useHydrated";

const AUTH_PATHS = [
  "/onboarding",
  "/splash",
  "/login",
  "/signup",
  "/otp",
  "/success",
  "/complete-profile",
  "/auth/continue",
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const ready = useHydrated();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const onboardingCompleted = useLearnFlowStore((s) => s.onboardingCompleted);
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const focusPromptPending = useLearnFlowStore((s) => s.focusPromptPending);
  const [bootDone, setBootDone] = useState(false);
  const finishBoot = useCallback(() => setBootDone(true), []);

  const isAuthRoute = AUTH_PATHS.some((p) => pathname === p) || pathname.startsWith("/auth/");
  const isFocus = pathname === "/focus";
  const isApp = pathname.startsWith("/app");
  const isComplete = pathname === "/complete-profile";
  const blockedApp =
    (!onboardingCompleted && pathname !== "/onboarding") ||
    (onboardingCompleted && !isAuthenticated && (isApp || pathname === "/profiles")) ||
    (isAuthenticated && focusPromptPending && isApp);

  useEffect(() => {
    if (!ready || !bootDone) return;

    let href: string | null = null;
    if (!onboardingCompleted && pathname !== "/onboarding") href = "/onboarding";
    else if (onboardingCompleted && !isAuthenticated && (isApp || pathname === "/profiles")) href = "/splash";
    else if (isAuthenticated && focusPromptPending && isApp) href = "/focus";
    else if (isAuthenticated && !focusPromptPending && !isComplete && (isAuthRoute || isFocus || pathname === "/")) {
      href = "/app";
    }
    if (href && href !== pathname) router.replace(href);
    // router identity changes after replace() and must not retrigger this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, bootDone, pathname, onboardingCompleted, isAuthenticated, focusPromptPending, isApp, isAuthRoute, isFocus, isComplete]);

  if (!ready) {
    return <AnimatedSplash />;
  }

  if (!bootDone) {
    return <AnimatedSplash onFinish={finishBoot} />;
  }

  // Never mount Accueil / AppShell while redirecting — a throw there used to freeze /app on the splash.
  if (blockedApp) {
    return <AnimatedSplash />;
  }

  return <>{children}</>;
}
