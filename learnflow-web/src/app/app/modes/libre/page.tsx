"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import { AppMain, ScreenHeader, CardButton } from "@/components/ui";
import { chapterHas3dImage } from "@/data/schemas3d";
import { usePublishedCatalog } from "@/data/publishedCache";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

function LibreInner() {
  const search = useSearchParams();
  const router = useRouter();
  const { colors } = useAppTheme();
  const tools = useLearnFlowStore((s) => s.customTools);
  const chapterId = search.get("chapterId") ?? "circulation";
  usePublishedCatalog();
  const open = tools.length === 0;
  const showFiche = open || tools.includes("fiche");
  const showFlash = open || tools.includes("flashcards");
  const show2d = chapterId === "digest";
  const show3d = chapterHas3dImage(chapterId);
  const showSchema = (show2d || show3d) && (open || tools.includes("schema"));

  return (
    <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col lg:min-h-dvh">
      <ScreenHeader
        title="Mode Libre"
        backHref="/app"
        right={
          <button
            type="button"
            onClick={() => router.push(`/app/modes/customize?mode=Libre&chapterId=${chapterId}`)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{ background: colors.white }}
          >
            <Icon name="settings" size={16} color={colors.textDark} />
          </button>
        }
      />
      <AppMain narrow fill className="space-y-4 py-6">
        <div className="flex justify-center py-3">
          <Spira scene="mode.libre" size={96} message="" />
        </div>
        {showFiche ? (
          <CardButton href={`/app/cours/${chapterId}`} icon="book" iconBg={colors.mathsBg} iconColor={colors.primary} title="Fiche de cours" />
        ) : null}
        {showFlash ? (
          <CardButton href={`/app/flashcards?mode=Libre&chapterId=${chapterId}`} icon="layers" iconBg={colors.hgBg} iconColor={colors.accent} title="Flashcards" />
        ) : null}
        {showSchema && show2d ? (
          <CardButton href={`/app/schema/${chapterId}`} icon="grid" iconBg={colors.svtBg} iconColor={colors.secondary} title="Schémas 2D" />
        ) : null}
        {showSchema && show3d ? (
          <CardButton href={`/app/schema3d/${chapterId}`} icon="atom" iconBg={colors.svtBg} iconColor={colors.secondary} title="Modèles 3D" />
        ) : null}
        {tools.includes("qcm") ? (
          <CardButton href={`/app/quiz/assimilation/${chapterId}`} icon="quiz" iconBg={colors.mathsBg} iconColor={colors.primary} title="QCM" />
        ) : null}
        {tools.includes("trous") ? (
          <CardButton href={`/app/trous/${chapterId}`} icon="pen" iconBg={colors.frBg} iconColor={colors.violet} title="Textes à trous" />
        ) : null}
      </AppMain>
    </div>
  );
}

export default function ModeLibrePage() {
  return (
    <Suspense fallback={null}>
      <LibreInner />
    </Suspense>
  );
}
