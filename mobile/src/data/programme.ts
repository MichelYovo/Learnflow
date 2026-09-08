import type { ChapterProgress, ProgrammeChapter, ProgrammeSubject, ProgrammeTheme, SubjectShortcut } from "../types/learnflow";
import { isLyceeClass, isTleDClass } from "./classes";
import { PROGRAMME_3EME } from "./programme3eme";
import { PROGRAMME_TLE } from "./programmeTle";
import { packSubject, packTheme, SUBJECT_STYLE, type SubjectId } from "./programmeBuild";
import { mergePublishedProgramme } from "./publishedCache";
import { chapterHas3dImage } from "./schemas3d";

const SHORTCUT_ICONS: Record<string, string> = {
  maths: "calculator",
  pc: "atom",
  svt: "microscope",
  hg: "globe",
  fr: "quill",
  ang: "chatbubble",
  edhc: "heart",
  philo: "brain",
};

export function isTleClass(classe?: string): boolean {
  return isTleDClass(classe);
}

export function programmeForClass(classe?: string): ProgrammeSubject[] {
  if (isTleDClass(classe)) return PROGRAMME_TLE;
  if (isLyceeClass(classe)) return [];
  return PROGRAMME_3EME;
}

/** Première leçon de chaque chapitre ouverte. Le 10/10 débloque le Grand Quizz, pas l'accès au cours. */
export function programmeStartingFresh(subjects: ProgrammeSubject[]): ProgrammeSubject[] {
  return subjects.map((subject) => {
    const themes = subject.themes.map((theme) => {
      const chapters = theme.chapters.map((chapter) => ({
        ...chapter,
        lessons: chapter.lessons.map((lesson, i) => ({
          ...lesson,
          status: i === 0 ? ("current" as const) : ("locked" as const),
        })),
      }));
      return packTheme(theme.id, theme.title, chapters);
    });
    return packSubject(subject.id as SubjectId, themes, subject.name);
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
        const completed = Boolean(p?.read) || p?.assimilationScore != null;
        if (!completed) return chapter;
        return {
          ...chapter,
          lessons: chapter.lessons.map((lesson) => ({ ...lesson, status: "done" as const })),
        };
      });
      return packTheme(theme.id, theme.title, chapters);
    });
    return packSubject(subject.id as SubjectId, themes, subject.name);
  });
}

export function programmeForLearner(
  classe?: string,
  profileId?: string,
  chapterProgress: Record<string, ChapterProgress> = {}
): ProgrammeSubject[] {
  const base = programmeForClass(classe);
  const source = programmeStartingFresh(base);
  const merged = mergePublishedProgramme(source, classe);
  return applyChapterProgress(merged, chapterProgress);
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
  if (isTleDClass(classe)) {
    return {
      chapterId: "tle-d-adn",
      title: "Le matériel génétique et la transmission",
      lessonLabel: "SVT · Tle D · À commencer",
      progress: 0,
    };
  }
  if (isLyceeClass(classe)) {
    return {
      chapterId: "",
      title: "Pas de cours pour l’instant",
      lessonLabel: "Lycée",
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
    name: s.id === "maths" ? "Maths" : s.id === "hg" ? "H-G" : s.id === "philo" ? "Philo" : s.name,
    fullName: s.id === "pc" && s.name === "PC" ? "Physique-Chimie" : s.name,
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
  if (isTleDClass(classe)) {
    return [
      { id: "tle-d-adn", subject: "SVT", title: "Matériel génétique", color: "#10B981", bg: "#ECFDF5" },
      { id: "tle-d-nerf", subject: "SVT", title: "Tissu nerveux", color: "#10B981", bg: "#ECFDF5" },
      { id: "tle-d-complexes", subject: "Maths", title: "Nombres complexes", color: "#1677FF", bg: "#E6F4FF" },
    ];
  }
  if (isLyceeClass(classe)) return [];
  return [
    { id: "circulation", subject: "SVT", title: "Circulation sanguine", color: "#10B981", bg: "#ECFDF5" },
    { id: "digest", subject: "SVT", title: "La digestion", color: "#10B981", bg: "#ECFDF5" },
    { id: "eq2", subject: "Maths", title: "Équations du 2nd degré", color: "#1677FF", bg: "#E6F4FF" },
  ];
}

export { chapterHas3dImage, SUBJECT_STYLE };
export type { SubjectId };
