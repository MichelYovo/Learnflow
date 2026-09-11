"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AnalogieSpira from "@/components/AnalogieSpira";
import CourseDetailBlocks from "@/components/course/CourseDetailBlocks";
import Icon from "@/components/Icon";
import InteractiveLessonText from "@/components/InteractiveLessonText";
import { AppMain, ScreenHeader } from "@/components/ui";
import { ficheForChapter } from "@/data/fiches";
import { normalizeKeyword, toDetailBlocks, toLessonContent } from "@/data/lessonContent";
import { usePublishedCatalog } from "@/data/publishedCache";
import { chapterHas3dImage } from "@/data/schemas3d";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

type ActiveTab = "essentiel" | "details";

export default function CoursePage() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const router = useRouter();
  const catalogEpoch = usePublishedCatalog();
  const classe = useLearnFlowStore((s) => s.getActiveProfile()?.classe);
  const fiche = useMemo(() => ficheForChapter(chapterId, classe), [chapterId, classe, catalogEpoch]);
  const lesson = useMemo(() => toLessonContent(fiche), [fiche]);
  const detailBlocks = useMemo(() => toDetailBlocks(fiche), [fiche]);
  const { colors } = useAppTheme();
  const markChapterPart = useLearnFlowStore((s) => s.markChapterPart);

  useEffect(() => {
    if (!chapterId) return;
    void import("@/lib/cloud").then((m) => m.trackActivity("chapter_open", { chapterId }));
    markChapterPart(chapterId, "essential");
  }, [chapterId, markChapterPart]);

  const [activeTab, setActiveTab] = useState<ActiveTab>("essentiel");
  const [masked, setMasked] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const show2d = fiche.schema === "2d" || fiche.schema === "both";
  const show3d = fiche.schema === "3d" || fiche.schema === "both" || chapterHas3dImage(chapterId);

  const analogieBox = fiche.analogie ? <AnalogieSpira analogie={fiche.analogie} /> : null;

  const selectTab = (next: ActiveTab) => {
    setActiveTab(next);
    if (next === "details") {
      setMasked(false);
      setRevealed(new Set());
      markChapterPart(chapterId, "details");
    } else {
      markChapterPart(chapterId, "essential");
    }
  };

  const tabStyle = (tab: ActiveTab) => {
    const on = activeTab === tab;
    return {
      background: on ? colors.mathsBg : colors.surfaceAlt,
      borderColor: on ? colors.primary : colors.border,
      color: on ? colors.primary : colors.textMuted,
    };
  };

  return (
    <div>
      <ScreenHeader title={lesson.title} backHref="/app/cours" />
      <AppMain className="space-y-4 py-5 pb-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2.5">
          <button type="button" onClick={() => selectTab("essentiel")} className="min-w-0 flex-1 rounded-[18px] border px-3 py-3" style={tabStyle("essentiel")}>
            <p className="text-center text-[16px] font-extrabold" style={{ color: tabStyle("essentiel").color }}>
              L&apos;Essentiel
            </p>
            <p className="text-center text-[11px] font-semibold" style={{ color: tabStyle("essentiel").color }}>
              Fiche réflexe · ~5 min
            </p>
          </button>
          <button type="button" onClick={() => selectTab("details")} className="min-w-0 flex-1 rounded-[18px] border px-3 py-3" style={tabStyle("details")}>
            <p className="text-center text-[16px] font-extrabold" style={{ color: tabStyle("details").color }}>
              En Détails
            </p>
            <p className="text-center text-[11px] font-semibold" style={{ color: tabStyle("details").color }}>
              Cours APC complet
            </p>
          </button>
        </div>

        {activeTab === "essentiel" ? (
          <>
            <button
              type="button"
              onClick={() => {
                setMasked((v) => !v);
                setRevealed(new Set());
              }}
              className="flex w-full items-center gap-3 rounded-[18px] border px-3.5 py-3 text-left"
              style={{
                background: masked ? colors.hgBg : colors.white,
                borderColor: masked ? colors.hgBorder : colors.border,
              }}
            >
              <Icon name={masked ? "eye-off" : "eye"} size={16} color={masked ? colors.accent : colors.primary} />
              <span className="flex-1">
                <span className="block text-[15px] font-extrabold">Texte masqué</span>
                <span className="text-xs font-medium" style={{ color: colors.textMuted }}>
                  {masked ? "Appuie sur un mot pour le révéler." : "Cache les mots-clés, révèle-les au tap."}
                </span>
              </span>
              <span className="rounded-full px-2.5 py-1 text-[11px] font-extrabold" style={{ background: masked ? colors.accent : colors.surfaceAlt, color: masked ? "#fff" : colors.textMuted }}>
                {masked ? "ON" : "OFF"}
              </span>
            </button>
            <div className="rounded-3xl px-5 py-[22px]" style={{ background: colors.white }}>
              <InteractiveLessonText
                text={lesson.essentialText}
                masked={masked}
                revealed={revealed}
                onReveal={(w) => setRevealed(new Set(revealed).add(normalizeKeyword(w)))}
              />
            </div>
            {analogieBox}
          </>
        ) : (
          <CourseDetailBlocks blocks={detailBlocks} />
        )}

        {show2d || show3d ? (
          <div className="flex flex-col gap-2 rounded-3xl p-4 min-[420px]:flex-row" style={{ background: colors.svtBg }}>
            {show2d ? (
              <button type="button" onClick={() => router.push(`/app/schema/${chapterId}`)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-extrabold" style={{ background: colors.white }}>
                <Icon name="grid" size={18} color={colors.secondary} />
                Schéma 2D
              </button>
            ) : null}
            {show3d ? (
              <button type="button" onClick={() => router.push(`/app/schema3d/${chapterId}`)} className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 font-extrabold" style={{ background: colors.white }}>
                <Icon name="atom" size={18} color={colors.cyan} />
                Modèle 3D
              </button>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => router.push(`/app/quiz/assimilation/${chapterId}`)}
          className="w-full rounded-[18px] py-[18px] text-[17px] font-extrabold text-white"
          style={{ background: colors.primary }}
        >
          Passer le quizz d&apos;assimilation
        </button>
        <button
          type="button"
          onClick={() => router.push("/app/blitz")}
          className="w-full rounded-[18px] border-2 py-3.5 text-sm font-extrabold"
          style={{ background: colors.white, borderColor: colors.border, color: colors.textDark }}
        >
          Défi Blitz duo · plus d’XP
        </button>
      </AppMain>
    </div>
  );
}
