import { useSyncExternalStore } from "react";
import type { FicheCoursData, ProgrammeLesson, ProgrammeSubject, QCMData } from "../types/learnflow";
import { L, packSubject, packTheme, SUBJECT_STYLE, type SubjectId } from "./programmeBuild";

export type PublishedLessonRow = {
  class_level: string;
  subject_id: string;
  chapter_id: string;
  chapter_title: string;
  payload: {
    lessons?: { id: string; title: string; duration: string; xp: number }[];
    fiche?: Partial<FicheCoursData> & {
      pucesEssentiel?: string[];
      sectionsDetaillees?: { id: string; titre: string; paragraphes: string[] }[];
      motsClesMasques?: string[];
      analogie?: { parole: string; concept: string; exemple: string };
    };
    quiz?: QCMData[];
    flashcards?: { recto: string; verso: string }[];
  };
};

export type PublishedSchemaRow = {
  id?: string;
  class_level: string;
  chapter_id: string;
  title: string;
  subtitle: string;
  image_url: string;
  parts: { id: string; label: string; role: string; x: number; y: number }[];
};

let lessons: PublishedLessonRow[] = [];
let schemas: PublishedSchemaRow[] = [];
let catalogEpoch = 0;
const catalogListeners = new Set<() => void>();

function notifyCatalog() {
  catalogEpoch += 1;
  catalogListeners.forEach((listener) => listener());
}

function subscribeCatalog(listener: () => void) {
  catalogListeners.add(listener);
  return () => {
    catalogListeners.delete(listener);
  };
}

/** Force un re-render quand le catalogue cloud change. */
export function usePublishedCatalog() {
  return useSyncExternalStore(subscribeCatalog, () => catalogEpoch, () => 0);
}

export function setPublishedCatalog(next: { lessons?: PublishedLessonRow[]; schemas?: PublishedSchemaRow[] }) {
  if (next.lessons) lessons = next.lessons;
  if (next.schemas) schemas = next.schemas;
  notifyCatalog();
}

export function getPublishedLessons() {
  return lessons;
}

export function getPublishedSchemas() {
  return schemas;
}

export function publishedRowForChapter(chapterId: string, classe?: string) {
  return (
    lessons.find((r) => r.chapter_id === chapterId && (!classe || r.class_level === classe)) ||
    lessons.find((r) => r.chapter_id === chapterId)
  );
}

export function mergePublishedProgramme(
  subjects: ProgrammeSubject[],
  classe: string | undefined,
): ProgrammeSubject[] {
  const mine = lessons.filter((r) => !classe || r.class_level === classe);
  if (mine.length === 0) return subjects;
  const next = subjects.map((s) => ({
    ...s,
    themes: s.themes.map((t) => ({ ...t, chapters: t.chapters.map((c) => ({ ...c, lessons: [...c.lessons] })) })),
  }));
  for (const row of mine) {
    const sid = (row.subject_id in SUBJECT_STYLE ? row.subject_id : "svt") as SubjectId;
    const packedLessons: ProgrammeLesson[] = (row.payload.lessons ?? []).map((l, i) =>
      L(l.id || `${row.chapter_id}-${i}`, l.title, l.duration || "12 min", l.xp || 50, i === 0 ? "current" : "locked"),
    );
    const chapter = {
      id: row.chapter_id,
      title: row.chapter_title,
      lessons: packedLessons.length ? packedLessons : [L(`${row.chapter_id}-1`, row.chapter_title, "12 min", 50, "current")],
    };
    const idx = next.findIndex((s) => s.id === sid);
    if (idx < 0) {
      next.push(packSubject(sid, [packTheme(`cloud-${sid}`, "Cours LearnFlow", [chapter])]));
      continue;
    }
    let replaced = false;
    const themes = next[idx].themes.map((theme) => ({
      ...theme,
      chapters: theme.chapters.map((ch) => {
        if (ch.id !== row.chapter_id) return ch;
        replaced = true;
        return { ...ch, title: row.chapter_title, lessons: chapter.lessons };
      }),
    }));
    next[idx] = packSubject(sid, replaced ? themes : [...themes, packTheme(`cloud-${sid}`, "Cours LearnFlow", [chapter])]);
  }
  return next;
}

export function overlayFiche(chapterId: string, fallback: FicheCoursData | undefined, classe?: string): FicheCoursData | undefined {
  const row = publishedRowForChapter(chapterId, classe);
  if (!row?.payload.fiche) return fallback;
  const f = row.payload.fiche;
  return {
    chapitreId: chapterId,
    titre: row.chapter_title,
    matiereId: row.subject_id,
    pucesEssentiel: f.pucesEssentiel ?? fallback?.pucesEssentiel ?? [],
    sectionsDetaillees: f.sectionsDetaillees ?? fallback?.sectionsDetaillees ?? [],
    motsClesMasques: f.motsClesMasques ?? fallback?.motsClesMasques ?? [],
    analogie: f.analogie
      ? {
          kicker: "EN D'AUTRE TERME",
          titre: "L'Analogie de Spira",
          parole: f.analogie.parole,
          concept: f.analogie.concept,
          exemple: f.analogie.exemple,
        }
      : fallback?.analogie,
    schema: fallback?.schema,
  };
}

export function overlayQuiz(chapterId: string, fallback: QCMData[], classe?: string): QCMData[] {
  const quiz = publishedRowForChapter(chapterId, classe)?.payload.quiz;
  return quiz && quiz.length > 0 ? quiz : fallback;
}

export async function refreshPublishedCatalog(platform: "web" | "mobile") {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || "").trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    ""
  ).trim();
  if (!url || !key) return;
  const flag = platform === "web" ? "publish_web=eq.true" : "publish_mobile=eq.true";
  const headers = { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" };
  try {
    const [lessonsRes, schemasRes] = await Promise.all([
      fetch(`${url}/rest/v1/published_lessons?select=*&${flag}`, { headers }),
      fetch(`${url}/rest/v1/schema_models?select=*&${flag}`, { headers }),
    ]);
    if (lessonsRes.ok) lessons = (await lessonsRes.json()) as PublishedLessonRow[];
    if (schemasRes.ok) schemas = (await schemasRes.json()) as PublishedSchemaRow[];
    notifyCatalog();
  } catch {
    /* offline */
  }
}
