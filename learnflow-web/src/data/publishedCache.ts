import { useSyncExternalStore } from "react";
import { isLyceeClass, normalizeClassId } from "./classes";
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
      essentialText?: string;
      detailedText?: string;
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

function getCatalogEpoch() {
  return catalogEpoch;
}

/** Force un re-render quand le catalogue cloud change. */
export function usePublishedCatalog() {
  return useSyncExternalStore(subscribeCatalog, getCatalogEpoch, getCatalogEpoch);
}

function asRowArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value.filter((row) => row && typeof row === "object") as T[]) : [];
}

function parsePayload(raw: unknown): PublishedLessonRow["payload"] {
  if (typeof raw === "string") {
    try {
      return parsePayload(JSON.parse(raw));
    } catch {
      return {};
    }
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as PublishedLessonRow["payload"];
}

export function setPublishedCatalog(next: { lessons?: PublishedLessonRow[]; schemas?: PublishedSchemaRow[] }) {
  if (next.lessons) lessons = asRowArray<PublishedLessonRow>(next.lessons);
  if (next.schemas) schemas = asRowArray<PublishedSchemaRow>(next.schemas);
  notifyCatalog();
}

export function getPublishedLessons() {
  return lessons;
}

export function getPublishedSchemas() {
  return schemas;
}

export function publishedRowForChapter(chapterId: string, classe?: string) {
  const wanted = normalizeClassId(classe);
  if (!wanted || !Array.isArray(lessons)) return undefined;
  return lessons.find((r) => r?.chapter_id === chapterId && normalizeClassId(r.class_level) === wanted);
}

export function mergePublishedProgramme(
  subjects: ProgrammeSubject[],
  classe: string | undefined,
): ProgrammeSubject[] {
  try {
    const wanted = normalizeClassId(classe);
    const catalog = Array.isArray(lessons) ? lessons : [];
    const mine = catalog.filter((r) => r && wanted && normalizeClassId(r.class_level) === wanted);
    if (mine.length === 0) return subjects;
    const next = (subjects ?? []).map((s) => ({
      ...s,
      themes: (s.themes ?? []).map((t) => ({
        ...t,
        chapters: (t.chapters ?? []).map((c) => ({ ...c, lessons: [...(c.lessons ?? [])] })),
      })),
    }));
    for (const row of mine) {
      const payload = parsePayload(row.payload);
      if (!row?.chapter_id) continue;
      const sid = (row.subject_id in SUBJECT_STYLE ? row.subject_id : "svt") as SubjectId;
      const packedLessons: ProgrammeLesson[] = (Array.isArray(payload.lessons) ? payload.lessons : [])
        .filter((l): l is NonNullable<typeof l> => Boolean(l) && typeof l === "object")
        .map((l, i) =>
          L(
            String(l.id || `${row.chapter_id}-${i}`),
            String(l.title || row.chapter_title || "Leçon"),
            String(l.duration || "12 min"),
            Number(l.xp) || 50,
            i === 0 ? "current" : "locked",
          ),
        );
      const chapter = {
        id: String(row.chapter_id),
        title: String(row.chapter_title || "Chapitre"),
        lessons: packedLessons.length
          ? packedLessons
          : [L(`${row.chapter_id}-1`, String(row.chapter_title || "Leçon"), "12 min", 50, "current")],
      };
      const idx = next.findIndex((s) => s.id === sid);
      if (idx < 0) {
        const label = sid === "pc" && isLyceeClass(classe) ? "PC" : undefined;
        next.push(packSubject(sid, [packTheme(`cloud-${sid}`, "Cours LearnFlow", [chapter])], label));
        continue;
      }
      let replaced = false;
      const themes = (next[idx].themes ?? []).map((theme) => ({
        ...theme,
        chapters: (theme.chapters ?? []).map((ch) => {
          if (ch.id !== row.chapter_id) return ch;
          replaced = true;
          return { ...ch, title: chapter.title, lessons: chapter.lessons };
        }),
      }));
      next[idx] = packSubject(
        sid,
        replaced ? themes : [...themes, packTheme(`cloud-${sid}`, "Cours LearnFlow", [chapter])],
        next[idx].name,
      );
    }
    return next;
  } catch {
    return subjects;
  }
}

export function overlayFiche(chapterId: string, fallback: FicheCoursData | undefined, classe?: string): FicheCoursData | undefined {
  try {
  const row = publishedRowForChapter(chapterId, classe);
  const payload = parsePayload(row?.payload);
  if (!payload.fiche || typeof payload.fiche !== "object") return fallback;
  const f = payload.fiche;
  return {
    chapitreId: chapterId,
    titre: String(row?.chapter_title || fallback?.titre || "Cours"),
    matiereId: String(row?.subject_id || fallback?.matiereId || "svt"),
    pucesEssentiel: Array.isArray(f.pucesEssentiel) ? f.pucesEssentiel : (fallback?.pucesEssentiel ?? []),
    sectionsDetaillees: Array.isArray(f.sectionsDetaillees) ? f.sectionsDetaillees : (fallback?.sectionsDetaillees ?? []),
    motsClesMasques: Array.isArray(f.motsClesMasques) ? f.motsClesMasques : (fallback?.motsClesMasques ?? []),
    essentialText: typeof f.essentialText === "string" && f.essentialText.trim()
      ? f.essentialText
      : Array.isArray(f.pucesEssentiel)
        ? undefined
        : fallback?.essentialText,
    detailedText: typeof f.detailedText === "string" && f.detailedText.trim()
      ? f.detailedText
      : Array.isArray(f.sectionsDetaillees)
        ? undefined
        : fallback?.detailedText,
    analogie: f.analogie && typeof f.analogie === "object"
      ? {
          kicker: "EN D'AUTRE TERME",
          titre: "L'Analogie de Spira",
          parole: String(f.analogie.parole ?? ""),
          concept: String(f.analogie.concept ?? ""),
          exemple: String(f.analogie.exemple ?? ""),
        }
      : fallback?.analogie,
    schema: fallback?.schema,
    situationProbleme: f.situationProbleme ?? fallback?.situationProbleme,
    exempleResolu: f.exempleResolu ?? fallback?.exempleResolu,
  };
  } catch {
    return fallback;
  }
}

export function overlayQuiz(chapterId: string, fallback: QCMData[], classe?: string): QCMData[] {
  const quiz = parsePayload(publishedRowForChapter(chapterId, classe)?.payload).quiz;
  return Array.isArray(quiz) && quiz.length > 0 ? quiz : fallback;
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
    if (lessonsRes.ok) lessons = asRowArray<PublishedLessonRow>(await lessonsRes.json());
    if (schemasRes.ok) schemas = asRowArray<PublishedSchemaRow>(await schemasRes.json());
    notifyCatalog();
  } catch {
    /* offline */
  }
}
