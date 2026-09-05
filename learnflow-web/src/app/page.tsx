"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHydrated } from "@/components/useHydrated";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import Logo from "@/components/Logo";

export default function HomeGate() {
  const ready = useHydrated();
  const router = useRouter();
  const { colors } = useAppTheme();
  const onboardingCompleted = useLearnFlowStore((s) => s.onboardingCompleted);
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const focusPromptPending = useLearnFlowStore((s) => s.focusPromptPending);

  useEffect(() => {
    if (!ready) return;
    if (!onboardingCompleted) router.replace("/onboarding");
    else if (!isAuthenticated) router.replace("/splash");
    else if (focusPromptPending) router.replace("/focus");
    else router.replace("/app");
  }, [ready, onboardingCompleted, isAuthenticated, focusPromptPending, router]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6" style={{ background: colors.surface }}>
      <Logo height={48} />
    </div>
  );
}
