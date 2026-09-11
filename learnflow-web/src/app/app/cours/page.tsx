"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Icon from "@/components/Icon";
import Spira from "@/components/Spira";
import SubjectLogo from "@/components/SubjectLogo";
import { AppBar, AppMain } from "@/components/ui";
import { usePublishedCatalog } from "@/data/publishedCache";
import { programmeForLearner } from "@/data/programme";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { useAppTheme } from "@/theme/useAppTheme";
import type { ProgrammeChapter, ProgrammeSubject, ProgrammeTheme } from "@/types/learnflow";

function CoursInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { colors } = useAppTheme();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const chapterProgress = useLearnFlowStore((s) => s.chapterProgress);
  const catalogEpoch = usePublishedCatalog();
  const programme = useMemo(
    () => programmeForLearner(profile?.classe, profile?.id, chapterProgress),
    [profile?.classe, profile?.id, chapterProgress, catalogEpoch],
  );
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);
  const [subject, setSubject] = useState<ProgrammeSubject | null>(null);
  const [theme, setTheme] = useState<ProgrammeTheme | null>(null);
  const [chapter, setChapter] = useState<ProgrammeChapter | null>(null);
  const liveSubject = useMemo(
    () => (subject ? programme.find((s) => s.id === subject.id) ?? subject : null),
    [programme, subject],
  );
  const liveTheme = useMemo(
    () => (liveSubject && theme ? liveSubject.themes.find((t) => t.id === theme.id) ?? theme : null),
    [liveSubject, theme],
  );
  const liveChapter = useMemo(
    () => (liveTheme && chapter ? liveTheme.chapters.find((c) => c.id === chapter.id) ?? chapter : null),
    [liveTheme, chapter],
  );

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
          {level === 1 && liveSubject ? <h1 className="truncate text-xl font-extrabold sm:text-[22px]">{liveSubject.name}</h1> : null}
          {level === 2 && liveTheme ? (
            <>
              <p className="truncate text-sm font-semibold" style={{ color: colors.textMuted }}>
                {liveSubject?.name}
              </p>
              <h1 className="truncate text-[22px] font-extrabold">{liveTheme.title}</h1>
            </>
          ) : null}
          {level === 3 && liveChapter ? (
            <>
              <p className="truncate text-sm font-semibold" style={{ color: colors.textMuted }}>
                {liveTheme?.title}
              </p>
              <h1 className="truncate text-[22px] font-extrabold">{liveChapter.title}</h1>
            </>
          ) : null}
        </div>
        {level > 0 && liveSubject ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: liveSubject.bg }}>
            <SubjectLogo id={liveSubject.id} size={22} />
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
                    <SubjectLogo id={s.id} size={32} />
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

        {level === 1 && liveSubject
          ? liveSubject.themes.map((t, ti) => {
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
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-[16px] font-extrabold" style={{ background: liveSubject.bg, color: liveSubject.color }}>
                    {ti + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-extrabold">{t.title}</span>
                    <span className="mt-2 flex items-center gap-2">
                      <span className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: colors.border }}>
                        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? colors.secondary : liveSubject.color }} />
                      </span>
                      <span className="text-[13px] font-extrabold" style={{ color: pct === 100 ? colors.secondary : liveSubject.color }}>
                        {t.lessonsDone}/{t.lessonsTotal}
                      </span>
                    </span>
                  </span>
                  <Icon name="chevron-right" size={16} color="#C4C2BF" />
                </button>
              );
            })
          : null}

        {level === 2 && liveTheme
          ? liveTheme.chapters.map((c, ci) => {
              const done = c.progressDone ?? 0;
              const total = c.progressTotal ?? 3;
              const pct = Math.round((done / total) * 100);
              const current = done > 0 && done < total;
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
                    borderColor: current ? liveSubject?.color ?? colors.primary : colors.border,
                  }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-[13px] font-extrabold"
                    style={{
                      background: current ? liveSubject?.bg ?? colors.mathsBg : colors.surfaceAlt,
                      color: current ? liveSubject?.color : colors.textMuted,
                    }}
                  >
                    Ch.{ci + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-[16px] font-extrabold">{c.title}</span>
                      {current ? (
                        <span className="rounded-full px-2.5 py-1 text-[12px] font-extrabold" style={{ background: liveSubject?.bg, color: liveSubject?.color }}>
                          En cours
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-2 flex items-center gap-2">
                      <span className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: colors.border }}>
                        <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? colors.secondary : liveSubject?.color }} />
                      </span>
                      <span className="text-[13px] font-extrabold" style={{ color: pct === 100 ? colors.secondary : liveSubject?.color }}>
                        {done}/{total}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })
          : null}

        {level === 3 && liveChapter
          ? liveChapter.lessons.map((l, li) => {
              const locked = l.status === "locked";
              return (
                <button
                  key={l.id}
                  type="button"
                  disabled={locked}
                  onClick={() => router.push(`/app/cours/${liveChapter.id}`)}
                  className="flex w-full items-center gap-3.5 rounded-[22px] border p-4 text-left disabled:opacity-50"
                  style={{
                    background: colors.white,
                    borderColor: l.status === "current" ? liveSubject?.color ?? colors.primary : colors.border,
                  }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-[14px] text-[12px] font-extrabold"
                    style={{
                      background: l.status === "done" ? colors.svtBg : l.status === "current" ? liveSubject?.bg ?? colors.mathsBg : colors.surfaceAlt,
                      color: l.status === "done" ? colors.secondary : l.status === "current" ? liveSubject?.color ?? colors.primary : "#C4C2BF",
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
                    <Icon name="play-circle" size={18} color={liveSubject?.color ?? colors.primary} />
                  )}
                </button>
              );
            })
          : null}

        {level === 3 && liveChapter ? (
          <button
            type="button"
            onClick={() => router.push(`/app/quiz/assimilation/${liveChapter.id}`)}
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
