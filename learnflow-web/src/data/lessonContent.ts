import type {
  ExempleResolu,
  FicheCoursData,
  LessonContent,
  SectionCoursAPC,
  SituationProbleme,
} from "../types/learnflow";

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

export function splitDetailParas(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export interface DetailBlocks {
  situation: SituationProbleme;
  developpement: string;
  exemple: ExempleResolu;
}

function foldTitle(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isSituationTitle(titre: string) {
  const t = foldTitle(titre);
  return /competence|situation|contexte/.test(t);
}

function isExempleTitle(titre: string) {
  return /exemple/.test(foldTitle(titre));
}

function cleanParas(section: SectionCoursAPC): string[] {
  return section.paragraphes.map((p) => stripCardinalMarkup(p).trim()).filter(Boolean);
}

function sectionsFromText(text: string): SectionCoursAPC[] {
  const paras = splitDetailParas(text);
  const out: SectionCoursAPC[] = [];
  let current: SectionCoursAPC | null = null;
  for (const para of paras) {
    if (isDetailHeading(para)) {
      current = { id: `h-${out.length}`, titre: para, paragraphes: [] };
      out.push(current);
    } else if (current) {
      current.paragraphes.push(para);
    } else {
      current = { id: "intro", titre: "", paragraphes: [para] };
      out.push(current);
    }
  }
  return out;
}

function genericSituation(fiche: FicheCoursData): SituationProbleme {
  return {
    recit: fiche.analogie?.exemple?.trim() || `Un exemple du quotidien pour ancrer « ${fiche.titre} ».`,
    question: "Quelle méthode du cours permet de résoudre cette situation ?",
    competenceVisee: `Mobiliser les savoirs du chapitre « ${fiche.titre} » pour résoudre une situation-problème conforme au programme.`,
  };
}

function situationFromSection(section: SectionCoursAPC, fiche: FicheCoursData): SituationProbleme {
  const paras = cleanParas(section);
  const fallback = genericSituation(fiche);
  return {
    recit: fiche.analogie?.exemple?.trim() || fiche.analogie?.parole?.trim() || fallback.recit,
    question: fallback.question,
    competenceVisee: paras[0] || fallback.competenceVisee,
  };
}

function genericExemple(fiche: FicheCoursData): ExempleResolu {
  return {
    enonce: `Un exercice type du chapitre « ${fiche.titre} ».`,
    etapes: [
      { titre: "Identifier", texte: "Repère la notion utile et les données de l'énoncé." },
      { titre: "Appliquer", texte: "Choisis la méthode du cours et mène le raisonnement pas à pas." },
      { titre: "Contrôler", texte: "Vérifie l'unité, l'ordre de grandeur et la cohérence avec l'énoncé." },
    ],
    reponseFinale: "Le résultat est cohérent avec l'énoncé et la fiche réflexe.",
  };
}

function exempleFromSection(section: SectionCoursAPC): ExempleResolu {
  const paras = cleanParas(section);
  if (paras.length === 0) {
    return { enonce: section.titre, etapes: [], reponseFinale: "" };
  }
  if (paras.length === 1) {
    return { enonce: paras[0], etapes: [], reponseFinale: "" };
  }
  if (paras.length === 2) {
    return {
      enonce: paras[0],
      etapes: [{ titre: "Méthode", texte: paras[1] }],
      reponseFinale: paras[1],
    };
  }
  return {
    enonce: paras[0],
    etapes: paras.slice(1, -1).map((texte, i) => ({ titre: `Étape ${i + 1}`, texte })),
    reponseFinale: paras[paras.length - 1],
  };
}

/**
 * Découpe En Détails en 3 blocs APC.
 * Les champs authored (situationProbleme, exempleResolu) priment ;
 * sinon extraction depuis sectionsDetaillees / detailedText.
 */
export function toDetailBlocks(fiche: FicheCoursData): DetailBlocks {
  const fromFiche = (fiche.sectionsDetaillees ?? []).some((s) => s.titre.trim() || s.paragraphes.some((p) => p.trim()))
    ? fiche.sectionsDetaillees
    : sectionsFromText(fiche.detailedText || fiche.contenuDetaille || "");

  const sitSec = fromFiche.find((s) => isSituationTitle(s.titre));
  const exSec = fromFiche.find((s) => isExempleTitle(s.titre));
  const devSecs = fromFiche.filter((s) => !isSituationTitle(s.titre) && !isExempleTitle(s.titre));

  const authoredSit = fiche.situationProbleme;
  const fallbackSit = genericSituation(fiche);
  const situation: SituationProbleme =
    authoredSit && (authoredSit.recit?.trim() || authoredSit.competenceVisee?.trim())
      ? {
          recit: authoredSit.recit?.trim() || fallbackSit.recit,
          question: authoredSit.question?.trim() || fallbackSit.question,
          competenceVisee: authoredSit.competenceVisee?.trim() || fallbackSit.competenceVisee,
        }
      : sitSec
        ? situationFromSection(sitSec, fiche)
        : fallbackSit;

  const authoredEx = fiche.exempleResolu;
  const exemple: ExempleResolu =
    authoredEx && authoredEx.enonce?.trim()
      ? {
          enonce: authoredEx.enonce.trim(),
          etapes: (authoredEx.etapes ?? []).filter((e) => e.texte?.trim()),
          reponseFinale: authoredEx.reponseFinale?.trim() || "",
        }
      : exSec
        ? exempleFromSection(exSec)
        : genericExemple(fiche);

  const developpement =
    sectionsToDetailedText(devSecs).trim() ||
    fiche.detailedText?.trim() ||
    "Les savoirs et savoir-faire sont dans la fiche réflexe. Relis L'Essentiel, puis l'exemple ci-dessous.";

  return {
    situation,
    developpement,
    exemple,
  };
}
