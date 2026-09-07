"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AnimatedSplash from "./AnimatedSplash";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useHydrated } from "./useHydrated";

const AUTH_PATHS = ["/onboarding", "/splash", "/profiles", "/login", "/signup", "/otp", "/success"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const ready = useHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const onboardingCompleted = useLearnFlowStore((s) => s.onboardingCompleted);
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const focusPromptPending = useLearnFlowStore((s) => s.focusPromptPending);

  useEffect(() => {
    if (!ready) return;
    const isAuthRoute = AUTH_PATHS.some((p) => pathname === p);
    const isFocus = pathname === "/focus";
    const isApp = pathname.startsWith("/app");

    if (!onboardingCompleted && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }
    if (onboardingCompleted && !isAuthenticated && isApp) {
      router.replace("/splash");
      return;
    }
    if (isAuthenticated && focusPromptPending && isApp) {
      router.replace("/focus");
      return;
    }
    if (isAuthenticated && !focusPromptPending && (isAuthRoute || isFocus || pathname === "/")) {
      router.replace("/app");
    }
  }, [ready, pathname, onboardingCompleted, isAuthenticated, focusPromptPending, router]);

  if (!ready) {
    return <AnimatedSplash />;
  }

  return <>{children}</>;
}
