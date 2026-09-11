"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AnimatedSplash, { INTRO_SESSION_KEY } from "./AnimatedSplash";
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

function skipFilm(pathname: string) {
  return pathname === "/intro" || pathname.startsWith("/auth/");
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const ready = useHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const onboardingCompleted = useLearnFlowStore((s) => s.onboardingCompleted);
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const focusPromptPending = useLearnFlowStore((s) => s.focusPromptPending);
  const [boot, setBoot] = useState<"wait" | "film" | "done">("wait");

  useEffect(() => {
    if (!ready) return;
    if (skipFilm(pathname)) {
      setBoot("done");
      return;
    }
    try {
      setBoot(sessionStorage.getItem(INTRO_SESSION_KEY) === "1" ? "done" : "film");
    } catch {
      setBoot("film");
    }
  }, [ready, pathname]);

  useEffect(() => {
    if (!ready || boot !== "done") return;
    const isAuthRoute = AUTH_PATHS.some((p) => pathname === p) || pathname.startsWith("/auth/");
    const isFocus = pathname === "/focus";
    const isApp = pathname.startsWith("/app");
    const isComplete = pathname === "/complete-profile";

    if (!onboardingCompleted && pathname !== "/onboarding" && pathname !== "/intro") {
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
  }, [ready, boot, pathname, onboardingCompleted, isAuthenticated, focusPromptPending, router]);

  if (!ready) {
    return <AnimatedSplash />;
  }

  if (boot === "wait") {
    return <AnimatedSplash />;
  }

  if (boot === "film") {
    return <AnimatedSplash cinematic onFinish={() => setBoot("done")} />;
  }

  return <>{children}</>;
}
