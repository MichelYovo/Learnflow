"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";
import Spira from "@/components/Spira";
import { AppBar, AppMain } from "@/components/ui";
import { programmeForClass } from "@/data/programme";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { ProgrammeChapter, ProgrammeSubject, ProgrammeTheme } from "@/types/learnflow";

const SUBJECT_ICON: Record<string, IconName> = {
  calculator: "calculator",
  leaf: "leaf",
  flask: "flask",
  globe: "globe",
  book: "book",
  chatbubble: "chatbubble",
  heart: "heart",
};

function CoursInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { colors } = useAppTheme();
  const classe = useLearnFlowStore((s) => s.getActiveProfile()?.classe);
  const programme = programmeForClass(classe);
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);
  const [subject, setSubject] = useState<ProgrammeSubject | null>(null);
  const [theme, setTheme] = useState<ProgrammeTheme | null>(null);
  const [chapter, setChapter] = useState<ProgrammeChapter | null>(null);

  useEffect(() => {
    const subjectId = params.get("subjectId");
    if (!subjectId) return;
    const found = programme.find((s) => s.id === subjectId);
    if (!found) return;
    setSubject(found);
    setLevel(1);
    setTheme(null);
    setChapter(null);
  }, [params, programme]);

  const goBack = () => {
    if (level === 3) {
      setLevel(2);
      setChapter(null);
    } else if (level === 2) {
      setLevel(1);
      setTheme(null);
    } else if (level === 1) {
      setLevel(0);
      setSubject(null);
    }
  };

  return (
    <div>
      <AppBar innerClassName="gap-2.5">
        {level > 0 ? (
          <button type="button" onClick={goBack} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px]" style={{ background: colors.surfaceAlt }}>
            <Icon name="arrow-left" size={18} color={colors.textDark} />
          </button>
        ) : (
          <Spira scene="tab.cours" size={56} message="" />
        )}
        <div className="min-w-0 flex-1">
          {level === 0 ? <h1 className="text-xl font-extrabold sm:text-[22px]">Mes cours</h1> : null}
          {level === 1 && subject ? <h1 className="truncate text-xl font-extrabold sm:text-[22px]">{subject.name}</h1> : null}
          {level === 2 && theme ? (
            <>
              <p className="truncate text-sm font-semibold" style={{ color: colors.textMuted }}>
                {subject?.name}
              </p>
              <h1 className="truncate text-[22px] font-extrabold">{theme.title}</h1>
            </>
          ) : null}
          {level === 3 && chapter ? (
            <>
              <p className="truncate text-sm font-semibold" style={{ color: colors.textMuted }}>
                {theme?.title}
              </p>
              <h1 className="truncate text-[22px] font-extrabold">{chapter.title}</h1>
            </>
          ) : null}
        </div>
        {level > 0 && subject ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: subject.bg }}>
            <Icon name={SUBJECT_ICON[subject.icon] ?? "book"} size={15} color={subject.color} />
          </span>
        ) : null}
      </AppBar>

      <AppMain className="space-y-3 py-5 pb-8">
        {level === 0
          ? programme.map((s) => {
              const done = s.themes.reduce((a, t) => a + t.lessonsDone, 0);
              const total = s.themes.reduce((a, t) => a + t.lessonsTotal, 0);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSubject(s);
                    setLevel(1);
                  }}
                  className="flex w-full items-center gap-3.5 rounded-[22px] border p-4 text-left"
                  style={{ background: colors.white, borderColor: colors.border }}
                >
                  <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border" style={{ background: s.bg, borderColor: s.border }}>
                    <Icon name={SUBJECT_ICON[s.icon] ?? "book"} size={22} color={s.color} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-extrabold">{s.name}</span>
                    <span className="mt-2 flex items-center gap-2">
                      <span className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: colors.border }}>
                        <span className="block h-full rounded-full" style={{ width: `${s.progress}%`, background: s.color }} />
                      </span>
                      <span className="text-[13px] font-extrabold" style={{ color: s.color }}>
                        {done}/{total}
                      </span>
                    </span>
                  </span>
                  <Icon name="chevron-right" size={16} color="#C4C2BF" />
                </button>
              );
            })
          : null}

        {level === 1 && subject
          ? subject.themes.map((t, ti) => {
              const pct = t.lessonsTotal > 0 ? Math.round((t.lessonsDone / t.lessonsTotal) * 100) : 0;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTheme(t);
                    setLevel(2);
                  }}
                  className="flex w-full items-center gap-3.5 rounded-[22px] border p-4 text-left"
                  style={{ background: colors.white, borderColor: colors.border }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-[16px] font-extrabold" style={{ background: subject.bg, color: subject.color }}>
                    {ti + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-extrabold">{t.title}</span>
                    <span className="mt-2 flex items-center gap-2">
                      <span className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: colors.border }}>
                        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? colors.secondary : subject.color }} />
                      </span>
                      <span className="text-[13px] font-extrabold" style={{ color: pct === 100 ? colors.secondary : subject.color }}>
                        {t.lessonsDone}/{t.lessonsTotal}
                      </span>
                    </span>
                  </span>
                  <Icon name="chevron-right" size={16} color="#C4C2BF" />
                </button>
              );
            })
          : null}

        {level === 2 && theme
          ? theme.chapters.map((c, ci) => {
              const done = c.lessons.filter((l) => l.status === "done").length;
              const total = c.lessons.length;
              const pct = Math.round((done / total) * 100);
              const current = c.lessons.some((l) => l.status === "current");
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setChapter(c);
                    setLevel(3);
                  }}
                  className="flex w-full items-center gap-3.5 rounded-[22px] border p-4 text-left"
                  style={{
                    background: colors.white,
                    borderColor: current ? subject?.color ?? colors.primary : colors.border,
                  }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-[13px] font-extrabold"
                    style={{
                      background: current ? subject?.bg ?? colors.mathsBg : colors.surfaceAlt,
                      color: current ? subject?.color : colors.textMuted,
                    }}
                  >
                    Ch.{ci + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-[16px] font-extrabold">{c.title}</span>
                      {current ? (
                        <span className="rounded-full px-2.5 py-1 text-[12px] font-extrabold" style={{ background: subject?.bg, color: subject?.color }}>
                          En cours
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-2 flex items-center gap-2">
                      <span className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: colors.border }}>
                        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? colors.secondary : subject?.color }} />
                      </span>
                      <span className="text-[13px] font-extrabold" style={{ color: pct === 100 ? colors.secondary : subject?.color }}>
                        {done}/{total}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })
          : null}

        {level === 3 && chapter
          ? chapter.lessons.map((l, li) => {
              const locked = l.status === "locked";
              return (
                <button
                  key={l.id}
                  type="button"
                  disabled={locked}
                  onClick={() => router.push(`/app/cours/${chapter.id}`)}
                  className="flex w-full items-center gap-3.5 rounded-[22px] border p-4 text-left disabled:opacity-50"
                  style={{
                    background: colors.white,
                    borderColor: l.status === "current" ? subject?.color ?? colors.primary : colors.border,
                  }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-[14px] text-[12px] font-extrabold"
                    style={{
                      background: l.status === "done" ? colors.svtBg : l.status === "current" ? subject?.bg ?? colors.mathsBg : colors.surfaceAlt,
                      color: l.status === "done" ? colors.secondary : l.status === "current" ? subject?.color ?? colors.primary : "#C4C2BF",
                    }}
                  >
                    {li + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-[16px] font-extrabold">{l.title}</span>
                  {l.status === "done" ? (
                    <Icon name="check-circle" size={18} color={colors.secondary} />
                  ) : locked ? (
                    <Icon name="lock" size={16} color={colors.textMuted} />
                  ) : (
                    <Icon name="play-circle" size={18} color={subject?.color ?? colors.primary} />
                  )}
                </button>
              );
            })
          : null}

        {level === 3 && chapter ? (
          <button
            type="button"
            onClick={() => router.push(`/app/quiz/assimilation/${chapter.id}`)}
            className="mt-2 w-full rounded-[18px] py-[18px] text-[16px] font-extrabold text-white"
            style={{ background: colors.primary }}
          >
            Quizz 10/10
          </button>
        ) : null}
      </AppMain>
    </div>
  );
}

export default function CoursPage() {
  return (
    <Suspense fallback={null}>
      <CoursInner />
    </Suspense>
  );
}
