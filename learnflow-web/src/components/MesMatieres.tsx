"use client";

import { useState } from "react";
import Icon, { type IconName } from "@/components/Icon";
import type { SubjectShortcut } from "@/types/learnflow";
import { resolveSubjectScheme } from "@/theme/colors";
import { useAppTheme } from "@/theme/useAppTheme";

const ICON_MAP: Record<string, IconName> = {
  calculator: "calculator",
  atom: "atom",
  microscope: "microscope",
  globe: "globe",
  quill: "quill",
  chatbubble: "chatbubble",
  brain: "brain",
  heart: "heart",
};

export default function MesMatieres({
  subjects,
  onSelect,
  onSeeAll,
}: {
  subjects: SubjectShortcut[];
  onSelect: (s: SubjectShortcut) => void;
  onSeeAll: () => void;
}) {
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(false);
  const preview = subjects.slice(0, 5);

  return (
    <section data-tour="matieres">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="text-[18px] font-extrabold" style={{ color: colors.textDark }}>
          Mes matières
        </h2>
        <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-0.5 text-[15px] font-bold" style={{ color: colors.primary }}>
          Voir tout
          <Icon name="chevron-right" size={12} color={colors.primary} />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 min-[360px]:grid-cols-4 sm:grid-cols-5 sm:gap-2">
        {preview.map((s) => {
          const scheme = resolveSubjectScheme(s.colorScheme);
          return (
            <button key={s.id} type="button" onClick={() => onSelect(s)} className="flex min-w-0 flex-col items-center gap-1.5 sm:gap-2">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-[18px] border sm:h-16 sm:w-16 sm:rounded-[20px]"
                style={{ background: scheme.bg, borderColor: scheme.border }}
              >
                <Icon name={ICON_MAP[s.icon] ?? "book"} size={20} color={scheme.color} />
              </span>
              <span className="w-full truncate text-center text-[11px] font-bold leading-tight sm:text-[13px]" style={{ color: colors.textDark }}>
                {s.name}
              </span>
            </button>
          );
        })}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/45 p-0 md:items-center md:p-4">
          <div className="max-h-[min(90dvh,82%)] w-full max-w-lg rounded-t-[28px] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:rounded-3xl" style={{ background: colors.white }}>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full" style={{ background: colors.borderStrong }} />
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-lg font-extrabold">Toutes les matières</h3>
              <button type="button" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: colors.surfaceAlt }}>
                <Icon name="x" size={16} color={colors.textDark} />
              </button>
            </div>
            <div className="max-h-[440px] space-y-2 overflow-y-auto">
              {subjects.map((s) => {
                const scheme = resolveSubjectScheme(s.colorScheme);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      onSelect(s);
                    }}
                    className="flex w-full items-center gap-3.5 rounded-[20px] border p-3.5 text-left"
                    style={{ borderColor: colors.border, background: colors.white }}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] border-2" style={{ background: scheme.bg, borderColor: scheme.border }}>
                      <Icon name={ICON_MAP[s.icon] ?? "book"} size={20} color={scheme.color} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold">{s.fullName ?? s.name}</span>
                      <span className="mt-2 flex items-center gap-2">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: colors.border }}>
                          <span className="block h-full rounded-full" style={{ width: `${s.progress}%`, background: scheme.color }} />
                        </span>
                        <span className="w-9 text-right text-[11px] font-extrabold" style={{ color: scheme.color }}>
                          {s.progress}%
                        </span>
                      </span>
                    </span>
                    <Icon name="chevron-right" size={16} color={colors.textMuted} />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSeeAll();
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border py-3.5 text-[13px] font-extrabold"
              style={{ background: colors.mathsBg, borderColor: colors.mathsBorder, color: colors.primary }}
            >
              <Icon name="book" size={16} color={colors.primary} />
              Ouvrir Mes cours
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
