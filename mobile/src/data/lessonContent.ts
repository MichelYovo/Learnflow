import type { FicheCoursData, LessonContent, SectionCoursAPC } from "../types/learnflow";

export type LessonSegment = { kind: "text" | "mask"; text: string };

export function normalizeKeyword(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function boldToBrackets(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "[$1]");
}

export function stripCardinalMarkup(s: string): string {
  return s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\[([^\]]+)\]/g, "$1");
}

export function parseMaskedLine(line: string): LessonSegment[] {
  const out: LessonSegment[] = [];
  const re = /\[([^\]]+)\]|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push({ kind: "text", text: line.slice(last, m.index) });
    out.push({ kind: "mask", text: (m[1] ?? m[2]).trim() });
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push({ kind: "text", text: line.slice(last) });
  if (!out.length) out.push({ kind: "text", text: line });
  return out;
}

export function splitLessonLines(text: string): string[] {
  return text.replace(/\r\n/g, "\n").split("\n");
}

export function extractBracketKeywords(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const re = /\[([^\]]+)\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const w = m[1].trim();
    const key = normalizeKeyword(w);
    if (w && !seen.has(key)) {
      seen.add(key);
      out.push(w);
    }
  }
  return out;
}

export function pucesToEssentialText(puces: string[]): string {
  const lines = puces.map((p) => p.trim()).filter(Boolean);
  if (!lines.length) return "";
  return lines
    .map((p, i) => {
      const t = boldToBrackets(p).replace(/^[•\-]\s+/, "");
      return i === 0 ? t : `• ${t}`;
    })
    .join("\n\n");
}

export function sectionsToDetailedText(sections: SectionCoursAPC[]): string {
  return sections
    .map((s) => {
      const body = s.paragraphes.map((p) => stripCardinalMarkup(p).trim()).filter(Boolean).join("\n\n");
      return body ? `${s.titre}\n\n${body}` : s.titre;
    })
    .filter((block) => block.trim())
    .join("\n\n");
}

export function essentialTextToPuces(text: string): string[] {
  return text
    .split(/\n+/)
    .map((l) => l.replace(/^[•\-]\s+/, "").trim())
    .filter(Boolean);
}

export function toLessonContent(fiche: FicheCoursData): LessonContent {
  const essentialText =
    fiche.essentialText?.trim() ||
    fiche.contenuEssentiel?.trim() ||
    pucesToEssentialText(fiche.pucesEssentiel ?? []);
  const detailedText =
    fiche.detailedText?.trim() ||
    fiche.contenuDetaille?.trim() ||
    sectionsToDetailedText(fiche.sectionsDetaillees ?? []);
  return {
    id: fiche.chapitreId,
    title: fiche.titre,
    essentialText,
    detailedText,
  };
}

export function hydrateFiche(fiche: FicheCoursData): FicheCoursData {
  const lesson = toLessonContent(fiche);
  const mots = fiche.motsClesMasques?.length ? fiche.motsClesMasques : extractBracketKeywords(lesson.essentialText);
  return {
    ...fiche,
    essentialText: lesson.essentialText,
    detailedText: lesson.detailedText,
    pucesEssentiel: fiche.pucesEssentiel?.length ? fiche.pucesEssentiel : essentialTextToPuces(lesson.essentialText),
    motsClesMasques: mots,
  };
}

export function countWords(source: string | string[]): number {
  const raw = Array.isArray(source) ? source.join(" ") : source;
  return stripCardinalMarkup(raw)
    .replace(/[•*]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function isDetailHeading(para: string): boolean {
  const t = para.trim();
  return t.length > 0 && t.length < 72 && !t.includes("•") && !/[.!?]$/.test(t);
}
