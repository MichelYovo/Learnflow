"use client";

import { AppMain, CardButton, ScreenHeader } from "@/components/ui";
import { continueLessonForLearner } from "@/data/programme";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

export default function QuizHubPage() {
  const { colors } = useAppTheme();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const canAccess = useLearnFlowStore((s) => s.canAccessGrandQuizz);
  const chapterProgress = useLearnFlowStore((s) => s.chapterProgress);
  const chapterId = continueLessonForLearner(profile.classe, profile.id, chapterProgress).chapterId;
  const unlocked = canAccess(chapterId);
  const lockedUntil = chapterProgress[chapterId]?.grandQuizzLockedUntil;

  return (
    <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col lg:min-h-dvh">
      <ScreenHeader title="Quiz" backHref="/app" />
      <AppMain narrow fill className="space-y-3 py-6">
        <CardButton
          href={`/app/quiz/assimilation/${chapterId}`}
          icon="target"
          iconBg={colors.mathsBg}
          iconColor={colors.primary}
          title="Quizz d'assimilation"
          sub="10 questions · règle 10/10"
          border={colors.mathsBorder}
        />
        <CardButton
          href={unlocked ? `/app/quiz/grand/${chapterId}` : `/app/quiz/assimilation/${chapterId}`}
          icon={unlocked ? "zap" : "lock"}
          iconBg={unlocked ? colors.svtBg : colors.surfaceAlt}
          iconColor={unlocked ? colors.secondary : colors.textMuted}
          title="Grand Quizz"
          sub={unlocked ? "XP sprint ×2" : lockedUntil && new Date(lockedUntil) > new Date() ? "Repos 1 h" : "10/10 requis"}
          border={unlocked ? colors.svtBorder : colors.borderStrong}
        />
        <CardButton href="/app/flashcards" icon="layers" iconBg={colors.hgBg} iconColor={colors.accent} title="Flashcards" border={colors.hgBorder} />
        <CardButton href="/app/blitz" icon="timer" iconBg={colors.angBg} iconColor={colors.danger} title="Blitz 60s" border={colors.angBorder} />
      </AppMain>
    </div>
  );
}
