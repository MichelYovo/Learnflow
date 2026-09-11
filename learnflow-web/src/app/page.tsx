"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AnimatedSplash from "@/components/AnimatedSplash";
import { useHydrated } from "@/components/useHydrated";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";

export default function HomeGate() {
  const ready = useHydrated();
  const router = useRouter();
  const onboardingCompleted = useLearnFlowStore((s) => s.onboardingCompleted);
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const focusPromptPending = useLearnFlowStore((s) => s.focusPromptPending);

  useEffect(() => {
    if (!ready) return;
    const href = !onboardingCompleted
      ? "/onboarding"
      : !isAuthenticated
        ? "/splash"
        : focusPromptPending
          ? "/focus"
          : "/app";
    router.replace(href);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, onboardingCompleted, isAuthenticated, focusPromptPending]);

  return <AnimatedSplash />;
}
