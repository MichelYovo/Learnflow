import type { ProgrammeChapter, ProgrammeSubject, ProgrammeTheme, SubjectShortcut } from "../types/learnflow";
import { PROGRAMME_3EME } from "./programme3eme";
import { PROGRAMME_TLE } from "./programmeTle";
import { SUBJECT_STYLE, type SubjectId } from "./programmeBuild";
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
      lessonLabel: "SVT · Tle D · Leçon 2 / 4",
      progress: 45,
    };
  }
  return {
    chapterId: "circulation",
    title: "La circulation sanguine",
    lessonLabel: "SVT · 3ème · Leçon 1 / 3",
    progress: 35,
  };
}

export function firstOpenChapterId(classe?: string): string {
  const programme = programmeForClass(classe);
  for (const subject of programme) {
    for (const theme of subject.themes) {
      for (const chapter of theme.chapters) {
        if (chapter.lessons.some((l) => l.status === "current")) return chapter.id;
      }
    }
  }
  return continueLessonForClass(classe).chapterId;
}

export function subjectShortcutsForClass(classe?: string): SubjectShortcut[] {
  return programmeForClass(classe).map((s) => ({
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
