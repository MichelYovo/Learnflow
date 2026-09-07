"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spira from "@/components/Spira";
import { AppMain, ScreenHeader, PrimaryButton } from "@/components/ui";
import { chapterHasSchema } from "@/data/programme";
import { spiraMoodForSession } from "@/data/spira";
import { MODE_DEFAULT_TOOLS } from "@/types/modes";
import type { OutilRevisionId } from "@/types/learnflow";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import Icon, { type IconName } from "@/components/Icon";

const TOOLS: { id: OutilRevisionId; label: string; icon: IconName }[] = [
  { id: "fiche", label: "Fiche cours", icon: "book" },
  { id: "flashcards", label: "Flashcards", icon: "layers" },
  { id: "qcm", label: "QCM", icon: "quiz" },
  { id: "schema", label: "Schéma 2D/3D", icon: "grid" },
  { id: "vraiFaux", label: "Vrai / Faux", icon: "check-circle" },
  { id: "trous", label: "Textes à trous", icon: "pen" },
];

function CustomizeInner() {
  const search = useSearchParams();
  const router = useRouter();
  const { colors } = useAppTheme();
  const mode = (search.get("mode") as "Libre" | "Guide" | "Cramming") ?? "Libre";
  const chapterId = search.get("chapterId") ?? undefined;
  const setCustomTools = useLearnFlowStore((s) => s.setCustomTools);
  const modeKey = mode === "Libre" ? "libre" : mode === "Guide" ? "guide" : "cramming";
  const allowSchema = mode === "Libre" && Boolean(chapterId && chapterHasSchema(chapterId));
  const visible = TOOLS.filter((t) => t.id !== "schema" || allowSchema);
  const [selected, setSelected] = useState<OutilRevisionId[]>(() => {
    const base = MODE_DEFAULT_TOOLS[modeKey];
    return allowSchema ? base : base.filter((id) => id !== "schema");
  });

  const start = () => {
    setCustomTools(selected);
    if (mode === "Libre") router.replace(`/app/modes/libre?chapterId=${chapterId ?? "eq2"}`);
    else if (mode === "Guide") router.replace("/app/modes/guide");
    else router.replace(`/app/modes/cramming?chapterId=${chapterId ?? "digest"}`);
  };

  return (
    <div className="flex min-h-[calc(100dvh-5.5rem)] flex-col lg:min-h-dvh">
      <ScreenHeader title="Personnaliser la séance" backHref="/app" />
      <AppMain narrow fill className="space-y-3 py-6">
        <div className="flex justify-center">
          <Spira mood={spiraMoodForSession(mode)} size={80} message="" />
        </div>
        {visible.map((t) => {
          const on = selected.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelected((prev) => (prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id]))}
              className="flex w-full items-center gap-3 rounded-2xl border p-4"
              style={{ borderColor: on ? colors.primary : colors.border, background: on ? "#E6F4FF" : colors.white }}
            >
              <Icon name={t.icon} size={20} color={on ? colors.primary : colors.textSecondary} />
              <span className="flex-1 text-left font-extrabold">{t.label}</span>
              {on ? <Icon name="check" size={16} color={colors.primary} /> : null}
            </button>
          );
        })}
        <div className="pt-4">
          <PrimaryButton onClick={start}>Lancer</PrimaryButton>
        </div>
      </AppMain>
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense fallback={null}>
      <CustomizeInner />
    </Suspense>
  );
}
