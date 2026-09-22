"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import { AppMain, ScreenHeader, CardButton } from "@/components/ui";
import { chapterHas3dImage } from "@/data/schemas3d";
import { searchChapters } from "@/data/programme";
import { usePublishedCatalog } from "@/data/publishedCache";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";

function LibreInner() {
  const search = useSearchParams();
  const router = useRouter();
  const { colors } = useAppTheme();
  const tools = useLearnFlowStore((s) => s.customTools);
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const chapterProgress = useLearnFlowStore((s) => s.chapterProgress);
  const chapterId = search.get("chapterId") ?? "circulation";
  const [query, setQuery] = useState("");
  usePublishedCatalog();

  const hits = useMemo(
    () => searchChapters(query, profile?.classe, profile?.id, chapterProgress, 10),
    [query, profile?.classe, profile?.id, chapterProgress],
  );

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
            aria-label="Personnaliser"
          >
            <Icon name="settings" size={16} color={colors.textDark} />
          </button>
        }
      />
      <AppMain narrow fill className="space-y-4 py-6">
        <div className="flex justify-center py-3">
          <Spira scene="mode.libre" size={96} message="" />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[12px] font-extrabold uppercase tracking-wide" style={{ color: colors.textMuted }}>
            Rechercher un cours
          </span>
          <div
            className="flex items-center gap-2 rounded-2xl border px-3 py-2.5"
            style={{ background: colors.white, borderColor: colors.border }}
          >
            <Icon name="search" size={16} color={colors.textMuted} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex. digestion, équations…"
              className="min-w-0 flex-1 bg-transparent text-[15px] font-semibold outline-none"
              style={{ color: colors.textDark }}
              aria-label="Rechercher un cours"
            />
          </div>
        </label>

        {hits.length > 0 ? (
          <ul className="space-y-2" role="listbox" aria-label="Résultats de recherche">
            {hits.map((h) => (
              <li key={h.chapterId}>
                <button
                  type="button"
                  role="option"
                  onClick={() => router.replace(`/app/modes/libre?chapterId=${h.chapterId}`)}
                  className="flex w-full items-center justify-between rounded-2xl border px-3.5 py-3 text-left"
                  style={{
                    background: h.chapterId === chapterId ? colors.mathsBg : colors.white,
                    borderColor: h.chapterId === chapterId ? colors.primary : colors.border,
                  }}
                >
                  <span>
                    <span className="block text-[14px] font-extrabold" style={{ color: colors.textDark }}>
                      {h.title}
                    </span>
                    <span className="text-[11px] font-semibold" style={{ color: colors.textMuted }}>
                      {h.subject} · {h.theme}
                    </span>
                  </span>
                  <Icon name="chevron-right" size={16} color={colors.textMuted} />
                </button>
              </li>
            ))}
          </ul>
        ) : query.trim() ? (
          <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>
            Aucun chapitre trouvé.
          </p>
        ) : null}

        <p className="text-[12px] font-bold" style={{ color: colors.textMuted }}>
          Chapitre actif · outils ci-dessous
        </p>

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
