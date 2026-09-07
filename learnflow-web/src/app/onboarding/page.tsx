"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spira from "@/components/Spira";
import { AuthStage, PrimaryButton, Page } from "@/components/ui";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { SpiraScene } from "@/data/spira";

const SLIDES: { scene: SpiraScene; title: string; body: string }[] = [
  {
    scene: "onboarding.mastery",
    title: "La règle du 10/10",
    body: "Un chapitre n’est validé que lorsqu’il est vraiment acquis. Pas de survol : on vise la maîtrise.",
  },
  {
    scene: "onboarding.modes",
    title: "Quatre modes de révision",
    body: "Libre, Guidé, Cramming ou Blitz 60 secondes — selon le moment, jamais l’inverse.",
  },
  {
    scene: "onboarding.league",
    title: "Ligues et XP",
    body: "Gagne de l’XP, grimpe ta ligue et défie tes camarades. La motivation, sans la pression.",
  },
  {
    scene: "onboarding.offline",
    title: "Même hors ligne",
    body: "Programme APC Togo, collège et lycée. Tes révisions t’attendent partout — bus, maison, école.",
  },
];

export default function OnboardingPage() {
  const { colors, darkMode } = useAppTheme();
  const completeOnboarding = useLearnFlowStore((s) => s.completeOnboarding);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const last = step === SLIDES.length - 1;

  const goAuth = () => {
    completeOnboarding();
    router.replace("/splash");
  };

  return (
    <Page>
      <AuthStage
        top={
          <div className="flex min-h-12 items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ background: darkMode ? "#334155" : "#E2E8F0" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${((step + 1) / SLIDES.length) * 100}%`, background: colors.primary }}
              />
            </div>
            <button type="button" onClick={goAuth} className="min-w-14 text-right text-[13px] font-extrabold" style={{ color: colors.textMuted }}>
              Passer
            </button>
          </div>
        }
        footer={
          <PrimaryButton onClick={() => (last ? goAuth() : setStep((s) => s + 1))}>
            {last ? "Commencer" : "Continuer"}
          </PrimaryButton>
        }
      >
        <div key={step} className="lf-slide-in flex flex-col items-center gap-[18px] px-2 text-center">
          <Spira scene={slide.scene} size={108} message="" />
          <h1 className="text-[22px] font-extrabold tracking-tight sm:text-[28px]">{slide.title}</h1>
          <p className="max-w-md text-[15px] font-medium leading-6 sm:text-[17px] sm:leading-[26px]" style={{ color: colors.textSecondary }}>
            {slide.body}
          </p>
        </div>
      </AuthStage>
    </Page>
  );
}
