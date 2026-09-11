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
  const pathname = usePathname();
  const onboardingCompleted = useLearnFlowStore((s) => s.onboardingCompleted);
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const focusPromptPending = useLearnFlowStore((s) => s.focusPromptPending);
  const [bootDone, setBootDone] = useState(false);
  const finishBoot = useCallback(() => setBootDone(true), []);

  useEffect(() => {
    if (!ready || !bootDone) return;
    const isAuthRoute = AUTH_PATHS.some((p) => pathname === p) || pathname.startsWith("/auth/");
    const isFocus = pathname === "/focus";
    const isApp = pathname.startsWith("/app");
    const isComplete = pathname === "/complete-profile";

    if (!onboardingCompleted && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }
    if (onboardingCompleted && !isAuthenticated && (isApp || pathname === "/profiles")) {
      router.replace("/splash");
      return;
    }
    if (isAuthenticated && focusPromptPending && isApp) {
      router.replace("/focus");
      return;
    }
    if (isAuthenticated && !focusPromptPending && !isComplete && (isAuthRoute || isFocus || pathname === "/")) {
      router.replace("/app");
    }
  }, [ready, bootDone, pathname, onboardingCompleted, isAuthenticated, focusPromptPending, router]);

  if (!ready) {
    return <AnimatedSplash />;
  }

  if (!bootDone) {
    return <AnimatedSplash onFinish={finishBoot} />;
  }

  return <>{children}</>;
}
