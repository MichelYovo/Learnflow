"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import { ScreenHeader, CardButton } from "@/components/ui";
import { crammingChaptersForClass } from "@/data/programme";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

function CrammingInner() {
  const search = useSearchParams();
  const router = useRouter();
  const { colors } = useAppTheme();
  const classe = useLearnFlowStore((s) => s.getActiveProfile()?.classe);
  const chapters = useMemo(() => crammingChaptersForClass(classe), [classe]);
  const initial = search.get("chapterId") ?? chapters[0]?.id ?? "digest";
  const [chapterId, setChapterId] = useState(chapters.some((c) => c.id === initial) ? initial : chapters[0]?.id ?? "digest");

  return (
    <div>
      <ScreenHeader
        title="Cramming"
        backHref="/app"
        right={
          <button type="button" onClick={() => router.push(`/app/modes/customize?mode=Cramming&chapterId=${chapterId}`)} className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: colors.surfaceAlt }}>
            <Icon name="settings" size={16} color={colors.textDark} />
          </button>
        }
      />
      <div className="mx-auto max-w-xl space-y-4 px-4 py-6 md:px-8">
        <div className="flex justify-center">
          <Spira scene="mode.cramming" size={96} message="" />
        </div>
        <p className="text-sm font-extrabold">Chapitre</p>
        <div className="flex flex-wrap gap-2">
          {chapters.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChapterId(c.id)}
              className="rounded-full border px-3 py-1.5 text-xs font-extrabold"
              style={{
                borderColor: c.id === chapterId ? c.color : colors.border,
                background: c.id === chapterId ? c.bg : colors.white,
                color: c.id === chapterId ? c.color : colors.textDark,
              }}
            >
              {c.subject} · {c.title}
            </button>
          ))}
        </div>
        <CardButton href={`/app/quiz/assimilation/${chapterId}?loop=1`} icon="quiz" iconBg={colors.hgBg} iconColor={colors.accent} title="Quizz d'assimilation" />
        <CardButton href={`/app/trous/${chapterId}`} icon="pen" iconBg={colors.frBg} iconColor={colors.violet} title="Textes à trous" />
      </div>
    </div>
  );
}

export default function ModeCrammingPage() {
  return (
    <Suspense fallback={null}>
      <CrammingInner />
    </Suspense>
  );
}
