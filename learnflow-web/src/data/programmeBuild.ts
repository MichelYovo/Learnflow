import type { ProgrammeChapter, ProgrammeLesson, ProgrammeSubject, ProgrammeTheme } from "../types/learnflow";

export const L = (
  id: string,
  title: string,
  duration: string,
  xp: number,
  status: ProgrammeLesson["status"]
): ProgrammeLesson => ({ id, title, duration, xp, status });

export const SUBJECT_STYLE = {
  maths: { name: "Mathématiques", icon: "calculator", color: "#1677FF", bg: "#E6F4FF", border: "#BAE0FF" },
  svt: { name: "SVT", icon: "leaf", color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
  pc: { name: "PCT", icon: "flask", color: "#06B6D4", bg: "#ECFEFF", border: "#A5F3FC" },
  hg: { name: "Histoire-Géographie", icon: "globe", color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  fr: { name: "Français", icon: "book", color: "#8B5CF6", bg: "#F5F3FF", border: "#DDD6FE" },
  ang: { name: "Anglais", icon: "chatbubble", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  edhc: { name: "ECM", icon: "heart", color: "#F97316", bg: "#FFF7ED", border: "#FED7AA" },
  philo: { name: "Philosophie", icon: "brain", color: "#6366F1", bg: "#EEF2FF", border: "#C7D2FE" },
} as const;

export type SubjectId = keyof typeof SUBJECT_STYLE;

export function packTheme(id: string, title: string, chapters: ProgrammeChapter[]): ProgrammeTheme {
  const lessons = chapters.flatMap((c) => c.lessons);
  return {
    id,
    title,
    chapters,
    lessonsTotal: lessons.length,
    lessonsDone: lessons.filter((l) => l.status === "done").length,
  };
}

export function packSubject(id: SubjectId, themes: ProgrammeTheme[], name?: string): ProgrammeSubject {
  const style = SUBJECT_STYLE[id];
  const done = themes.reduce((a, t) => a + t.lessonsDone, 0);
  const total = themes.reduce((a, t) => a + t.lessonsTotal, 0);
  return {
    id,
    ...style,
    name: name ?? style.name,
    progress: total ? Math.round((done / total) * 100) : 0,
    themes,
  };
}
