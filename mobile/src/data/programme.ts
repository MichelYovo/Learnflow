import type { ChapterProgress, ProgrammeChapter, ProgrammeSubject, ProgrammeTheme, SubjectShortcut } from "../types/learnflow";
import { isCloudProfileId, LOCAL_TEST_PROFILE_IDS } from "./mock";
import { PROGRAMME_3EME } from "./programme3eme";
import { PROGRAMME_TLE } from "./programmeTle";
import { packSubject, packTheme, SUBJECT_STYLE, type SubjectId } from "./programmeBuild";
import { chapterHas3dImage } from "./schemas3d";

const SHORTCUT_ICONS: Record<string, string> = {
  maths: "calculator",
  pc: "atom",
  svt: "microscope",
  hg: "globe",
  fr: "quill",
  ang: "chatbubble",
  edhc: "heart",
};

export function isTleClass(classe?: string): boolean {
  return classe === "Tle" || classe === "1ere" || classe === "2nde";
}

export function programmeForClass(classe?: string): ProgrammeSubject[] {
  return isTleClass(classe) ? PROGRAMME_TLE : PROGRAMME_3EME;
}

function isDemoProfile(profileId?: string): boolean {
  return !!profileId && LOCAL_TEST_PROFILE_IDS.includes(String(profileId)) && !isCloudProfileId(profileId);
}

/** Tous les cours à 0 %, première leçon ouverte. */
export function programmeStartingFresh(subjects: ProgrammeSubject[]): ProgrammeSubject[] {
  let opened = false;
  return subjects.map((subject) => {
    const themes = subject.themes.map((theme) => {
      const chapters = theme.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson) => {
          if (!opened) {
            opened = true;
            return { ...lesson, status: "current" as const };
          }
          return { ...lesson, status: "locked" as const };
        }),
      }));
      return packTheme(theme.id, theme.title, chapters);
    });
    return packSubject(subject.id as SubjectId, themes);
  });
}

export function applyChapterProgress(
  subjects: ProgrammeSubject[],
  chapterProgress: Record<string, ChapterProgress> = {}
): ProgrammeSubject[] {
  return subjects.map((subject) => {
    const themes = subject.themes.map((theme) => {
      const chapters = theme.chapters.map((chapter) => {
        const p = chapterProgress[chapter.id];
        if (!p || p.assimilationScore == null) return chapter;
        const done = p.assimilationPerfect || p.assimilationScore >= 50;
        if (!done) return chapter;
        return {
          ...chapter,
          lessons: chapter.lessons.map((lesson, i, arr) => ({
            ...lesson,
            status: i < arr.length - 1 ? ("done" as const) : ("current" as const),
          })),
        };
      });
      return packTheme(theme.id, theme.title, chapters);
    });
    return packSubject(subject.id as SubjectId, themes);
  });
}

export function programmeForLearner(
  classe?: string,
  profileId?: string,
  chapterProgress: Record<string, ChapterProgress> = {}
): ProgrammeSubject[] {
  const base = programmeForClass(classe);
  const source = isDemoProfile(profileId) ? base : programmeStartingFresh(base);
  return applyChapterProgress(source, chapterProgress);
}

/** Programme par défaut (3ème) — compat anciens imports. */
export const PROGRAMME: ProgrammeSubject[] = PROGRAMME_3EME;

export type ChapterMeta = {
  subject: ProgrammeSubject;
  theme: ProgrammeTheme;
  chapter: ProgrammeChapter;
};

export function findChapterMeta(chapterId: string): ChapterMeta | null {
  for (const list of [PROGRAMME_3EME, PROGRAMME_TLE]) {
    for (const subject of list) {
      for (const theme of subject.themes) {
        const chapter = theme.chapters.find((c) => c.id === chapterId);
        if (chapter) return { subject, theme, chapter };
      }
    }
  }
  return null;
}

export function subjectIdForChapter(chapterId: string): string | undefined {
  return findChapterMeta(chapterId)?.subject.id;
}

/** Schémas interactifs : SVT avec visuel 2D (digestion) ou modèle 3D. */
export function chapterHasSchema(chapterId: string): boolean {
  return chapterHas3dImage(chapterId) || chapterId === "digest" || chapterId === "cell";
}

export type ContinueLesson = {
  chapterId: string;
  title: string;
  lessonLabel: string;
  progress: number;
};

export function continueLessonForClass(classe?: string): ContinueLesson {
  if (isTleClass(classe)) {
    return {
      chapterId: "neurones",
      title: "Fonctionnement des neurones",
      lessonLabel: "SVT · Tle D · À commencer",
      progress: 0,
    };
  }
  return {
    chapterId: "circulation",
    title: "La circulation sanguine",
    lessonLabel: "SVT · 3ème · À commencer",
    progress: 0,
  };
}

export function continueLessonForLearner(
  classe?: string,
  profileId?: string,
  chapterProgress: Record<string, ChapterProgress> = {}
): ContinueLesson {
  const programme = programmeForLearner(classe, profileId, chapterProgress);
  for (const subject of programme) {
    for (const theme of subject.themes) {
      for (const chapter of theme.chapters) {
        const current = chapter.lessons.find((l) => l.status === "current");
        if (!current) continue;
        const done = chapter.lessons.filter((l) => l.status === "done").length;
        const total = chapter.lessons.length || 1;
        return {
          chapterId: chapter.id,
          title: chapter.title,
          lessonLabel: `${subject.name} · ${done} / ${total}`,
          progress: Math.round((done / total) * 100),
        };
      }
    }
  }
  const fallback = continueLessonForClass(classe);
  const first = programme[0]?.themes[0]?.chapters[0];
  return {
    chapterId: first?.id ?? fallback.chapterId,
    title: first?.title ?? fallback.title,
    lessonLabel: "À commencer",
    progress: 0,
  };
}

export function firstOpenChapterId(
  classe?: string,
  profileId?: string,
  chapterProgress: Record<string, ChapterProgress> = {}
): string {
  return continueLessonForLearner(classe, profileId, chapterProgress).chapterId;
}

export function subjectShortcutsForClass(classe?: string): SubjectShortcut[] {
  return subjectShortcutsForLearner(classe);
}

export function subjectShortcutsForLearner(
  classe?: string,
  profileId?: string,
  chapterProgress: Record<string, ChapterProgress> = {}
): SubjectShortcut[] {
  return programmeForLearner(classe, profileId, chapterProgress).map((s) => ({
    id: s.id,
    name: s.id === "maths" ? "Maths" : s.id === "hg" ? "H-G" : s.name,
    fullName: s.name,
    progress: s.progress,
    icon: SHORTCUT_ICONS[s.id] ?? s.icon,
    colorScheme: s.id,
    slug: s.id,
  }));
}

export function crammingChaptersForClass(classe?: string): {
  id: string;
  subject: string;
  title: string;
  color: string;
  bg: string;
}[] {
  if (isTleClass(classe)) {
    return [
      { id: "neurones", subject: "SVT", title: "Les neurones", color: "#10B981", bg: "#ECFDF5" },
      { id: "brassage", subject: "SVT", title: "ADN et brassage", color: "#10B981", bg: "#ECFDF5" },
      { id: "complexes", subject: "Maths", title: "Nombres complexes", color: "#1677FF", bg: "#E6F4FF" },
    ];
  }
  return [
    { id: "circulation", subject: "SVT", title: "Circulation sanguine", color: "#10B981", bg: "#ECFDF5" },
    { id: "digest", subject: "SVT", title: "La digestion", color: "#10B981", bg: "#ECFDF5" },
    { id: "eq2", subject: "Maths", title: "Équations du 2nd degré", color: "#1677FF", bg: "#E6F4FF" },
  ];
}

export { chapterHas3dImage, SUBJECT_STYLE };
export type { SubjectId };
