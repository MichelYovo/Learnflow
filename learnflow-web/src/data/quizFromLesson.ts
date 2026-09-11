import type { QCMData } from "../types/learnflow";
import { ficheForChapter } from "./fiches";
import {
  essentialTextToPuces,
  extractBracketKeywords,
  stripCardinalMarkup,
  toLessonContent,
} from "./lessonContent";
import { findChapterMeta } from "./programme";

export type GeneratedCloze = {
  id: string;
  before: string;
  after: string;
  blank: { id: string; answer: string; options: string[] };
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const a = [...arr];
  let s = hash(seed) || 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function clip(s: string, n = 100) {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  return `${t.slice(0, n - 1).trim()}…`;
}

/** One-line choice: keyword, part after « : », or first sentence. */
function shortChoice(raw: string, n = 54) {
  const t = stripCardinalMarkup(raw)
    .replace(/^[•\-]\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
  const labeled = t.match(/^(.{6,44}?)\s*[:：]\s+(.{6,})$/);
  if (labeled) {
    const rightFirst = (labeled[2].split(/(?<=[.!?])\s+/)[0] ?? labeled[2]).replace(/[.]$/, "").trim();
    if (rightFirst.length >= 6 && rightFirst.length <= n) return rightFirst;
    return clip(labeled[1], n);
  }
  const first = (t.split(/(?<=[.!?])\s+/)[0] ?? t).trim();
  if (first.length >= 6 && first.length <= n) return first;
  return clip(t, n);
}

function sameChoice(a: string, b: string) {
  const fa = fold(a);
  const fb = fold(b);
  if (!fa || !fb) return true;
  return fa === fb || fa.includes(fb) || fb.includes(fa);
}

function pickWrongs(correct: string, pool: string[]): string[] {
  const out: string[] = [];
  const seen = new Set([fold(correct)]);
  for (const raw of pool) {
    const w = shortChoice(raw);
    const key = fold(w);
    if (!w || w.length < 3 || seen.has(key) || sameChoice(w, correct)) continue;
    seen.add(key);
    out.push(w);
    if (out.length === 3) break;
  }
  return out;
}

function notesFor(options: string[], correct: string, explain: string): string[] {
  const why = clip(explain.replace(/\s+/g, " ").trim(), 90);
  return options.map((opt) =>
    fold(opt) === fold(correct) ? why : `Pas ça. ${why}`,
  );
}

export function withOptionNotes(q: QCMData): QCMData {
  if (q.optionNotes && q.optionNotes.length === q.optionsProposees.length) return q;
  const correct = q.optionsProposees[q.indexReponseCorrecte];
  return { ...q, optionNotes: notesFor(q.optionsProposees, correct, q.explicationPedagogique) };
}

function mcq(id: string, enonce: string, correct: string, wrongs: string[], matiere: string, explain?: string): QCMData | null {
  const pool = pickWrongs(correct, wrongs);
  if (pool.length < 3) return null;
  const options = seededShuffle([correct, ...pool.slice(0, 3)], id);
  const why = clip((explain || correct).trim(), 90);
  return {
    id,
    enonceQuestion: enonce,
    optionsProposees: options,
    indexReponseCorrecte: Math.max(0, options.indexOf(correct)),
    explicationPedagogique: why,
    optionNotes: notesFor(options, correct, why),
    matiere,
    ancreCours: id,
  };
}

function cleanLine(s: string) {
  return stripCardinalMarkup(s)
    .replace(/^[•\-]\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stemFromPuce(text: string, keywords: string[]): { stem: string; correct: string } | null {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length < 18) return null;
  const labeled = t.match(/^(.{10,80}?)\s*[:：]\s+(.{12,})$/);
  if (labeled) {
    const left = labeled[1].trim().replace(/\?$/, "");
    return {
      stem: left.length < 22 ? `${left} ?` : `${clip(left, 70)} ?`,
      correct: shortChoice(labeled[2]),
    };
  }
  const iff = t.match(/^(.{12,72}?)\s+(si et seulement si|lorsque|quand|ssi)\s+(.{8,})$/i);
  if (iff) {
    return {
      stem: `${clip(iff[1].trim(), 56)} ${iff[2].toLowerCase()}…`,
      correct: shortChoice(iff[3]),
    };
  }
  const kw = keywords.find((k) => t.toLowerCase().includes(k.toLowerCase()));
  if (kw) {
    return {
      stem: `Que retenir sur « ${kw} » ?`,
      correct: shortChoice(t),
    };
  }
  return {
    stem: "Lequel est exact ?",
    correct: shortChoice(t),
  };
}

function splitSentences(s: string): string[] {
  const t = cleanLine(s);
  if (!t) return [];
  if (t.length < 40) return t.length > 22 ? [t] : [];
  return t
    .split(/(?<=[.!?])\s+(?=[A-ZÉÈÀÂÎÔÛÇ«"0-9])/)
    .map(cleanLine)
    .filter((p) => p.length > 22);
}

/** QCM d'assimilation : uniquement le contenu du chapitre, faux choix du même cours. */
export function quizFromLesson(chapterId: string, classe?: string): QCMData[] {
  const fiche = ficheForChapter(chapterId, classe);
  const lesson = toLessonContent(fiche);
  const meta = findChapterMeta(chapterId);
  const matiere = meta?.subject.name ?? "Cours";
  const puces = (fiche.pucesEssentiel?.length ? fiche.pucesEssentiel : essentialTextToPuces(lesson.essentialText))
    .map(cleanLine)
    .filter((p) => p.length > 16);
  const keywords = extractBracketKeywords(lesson.essentialText);
  const out: QCMData[] = [];

  puces.forEach((puce, i) => {
    if (out.length >= 10) return;
    const parsed = stemFromPuce(puce, keywords);
    if (!parsed) return;
    const wrongs = puces.filter((p) => p !== puce).map((p) => shortChoice(p));
    const q = mcq(
      `${chapterId}-p${i}`,
      parsed.stem,
      parsed.correct,
      wrongs,
      matiere,
      parsed.correct,
    );
    if (q) out.push(q);
  });

  keywords.forEach((kw, i) => {
    if (out.length >= 10) return;
    const line = splitAroundKeyword(lesson.essentialText, kw);
    if (!line) return;
    const wrongs = keywords.filter((k) => k !== kw);
    const q = mcq(
      `${chapterId}-k${i}`,
      `Quel mot manque : « ${clip(line.prompt, 48)} » ?`,
      kw,
      wrongs,
      matiere,
      `C’est « ${kw} ».`,
    );
    if (q) out.push(q);
  });

  const ex = fiche.exempleResolu;
  if (out.length < 10 && ex?.reponseFinale?.trim() && ex.enonce?.trim()) {
    const wrongs = [
      ...(ex.etapes ?? []).map((e) => e.texte),
      ...puces,
    ];
    const q = mcq(
      `${chapterId}-ex`,
      `Quelle conclusion ? ${clip(ex.enonce, 48)}`,
      shortChoice(ex.reponseFinale),
      wrongs,
      matiere,
      ex.reponseFinale,
    );
    if (q) out.push(q);
  }

  const sit = fiche.situationProbleme;
  if (out.length < 10 && sit?.question?.trim() && puces[0]) {
    const q = mcq(
      `${chapterId}-sit`,
      clip(sit.question, 88),
      shortChoice(puces[0]),
      puces.slice(1),
      matiere,
      sit.competenceVisee || puces[0],
    );
    if (q) out.push(q);
  }

  const unique: QCMData[] = [];
  const seen = new Set<string>();
  for (const q of out) {
    const key = `${fold(q.enonceQuestion)}|${fold(q.optionsProposees[q.indexReponseCorrecte] ?? "")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({ ...q, id: `${chapterId}-${unique.length + 1}` });
    if (unique.length === 10) break;
  }

  const extraParas = (fiche.sectionsDetaillees ?? [])
    .flatMap((s) => s.paragraphes.flatMap(splitSentences))
    .filter((p) => p.length > 24);
  extraParas.forEach((para, i) => {
    if (unique.length >= 10) return;
    const parsed = stemFromPuce(para, keywords);
    if (!parsed) return;
    if (seen.has(`${fold(parsed.stem)}|${fold(parsed.correct)}`)) return;
    const q = mcq(
      `${chapterId}-s${i}`,
      parsed.stem,
      parsed.correct,
      extraParas.filter((p) => p !== para).concat(puces),
      matiere,
      parsed.correct,
    );
    if (!q) return;
    seen.add(`${fold(q.enonceQuestion)}|${fold(q.optionsProposees[q.indexReponseCorrecte] ?? "")}`);
    unique.push({ ...q, id: `${chapterId}-${unique.length + 1}` });
  });

  return unique.slice(0, 10);
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitAroundKeyword(text: string, kw: string): { prompt: string } | null {
  const re = new RegExp(`(.{0,42})\\[${escapeRe(kw)}\\](.{0,42})`);
  const m = text.replace(/\n+/g, " ").match(re);
  if (!m) return null;
  const prompt = `${m[1].trim()} […] ${m[2].trim()}`.replace(/\s+/g, " ").trim();
  return { prompt };
}

export function clozeFromLesson(chapterId: string, classe?: string): GeneratedCloze[] {
  const fiche = ficheForChapter(chapterId, classe);
  const lesson = toLessonContent(fiche);
  const keywords = extractBracketKeywords(lesson.essentialText);
  const lines = lesson.essentialText.split("\n").filter((l) => l.includes("["));
  const items: GeneratedCloze[] = [];
  for (let i = 0; i < lines.length && items.length < 6; i++) {
    const raw = lines[i];
    const m = raw.match(/\[([^\]]+)\]/);
    if (!m) continue;
    const answer = m[1];
    const idx = raw.indexOf(m[0]);
    const before = stripCardinalMarkup(raw.slice(0, idx)).replace(/^[•\-]\s+/, "");
    const after = stripCardinalMarkup(raw.slice(idx + m[0].length));
    const wrongs = keywords.filter((k) => k !== answer);
    if (wrongs.length < 3) continue;
    const options = seededShuffle([answer, ...wrongs.slice(0, 3)], `${chapterId}-cloze-${i}`);
    items.push({
      id: `${chapterId}-cl${i}`,
      before,
      after,
      blank: { id: `b${i}`, answer, options },
    });
  }
  return items;
}

export function shuffleQuizOptions(bank: QCMData[]): QCMData[] {
  return bank.map((q) => {
    const correct = q.optionsProposees[q.indexReponseCorrecte];
    const paired = q.optionsProposees.map((opt, i) => ({
      opt,
      note: q.optionNotes?.[i] ?? "",
    }));
    for (let i = paired.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [paired[i], paired[j]] = [paired[j], paired[i]];
    }
    const options = paired.map((p) => p.opt);
    const optionNotes = q.optionNotes?.length
      ? paired.map((p) => p.note)
      : undefined;
    return {
      ...q,
      optionsProposees: options,
      indexReponseCorrecte: Math.max(0, options.indexOf(correct)),
      optionNotes,
    };
  });
}

export function shuffleQuizOrder<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffleClozeItems(items: GeneratedCloze[]): GeneratedCloze[] {
  return shuffleQuizOrder(items).map((item) => {
    const options = [...item.blank.options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return { ...item, blank: { ...item.blank, options } };
  });
}

export const VECTEURS_QCM: QCMData[] = [
  {
    id: "tv1",
    enonceQuestion: "Deux vecteurs non nuls u et v sont colinéaires si et seulement s'il existe un réel k tel que…",
    optionsProposees: ["u · v = 0", "u = k v", "u + v = 0 uniquement", "||u|| = ||v||"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Colinéarité : u = k v. u · v = 0, c'est l'orthogonalité, pas la colinéarité.",
    matiere: "Maths",
  },
  {
    id: "tv2",
    enonceQuestion: "Une base de l'espace est…",
    optionsProposees: ["Un couple de vecteurs colinéaires", "Un triplet de vecteurs non coplanaires", "Un seul vecteur unitaire", "Quatre points alignés"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Trois vecteurs non coplanaires forment une base : tout vecteur s'écrit de façon unique comme combinaison linéaire.",
    matiere: "Maths",
  },
  {
    id: "tv3",
    enonceQuestion: "Dans le repère (O ; i, j, k), OM = x i + y j + z k signifie que M a pour coordonnées…",
    optionsProposees: ["(i ; j ; k)", "(x ; y ; z)", "(O ; M ; k)", "(||OM|| ; 0 ; 0)"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Les scalaires x, y, z sont les coordonnées de M.",
    matiere: "Maths",
  },
  {
    id: "tv4",
    enonceQuestion: "Les coordonnées du vecteur AB sont…",
    optionsProposees: ["(xA + xB ; yA + yB ; zA + zB)", "(xB − xA ; yB − yA ; zB − zA)", "(xA ; yB ; zA)", "(||AB|| ; 0 ; 0)"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "AB = OM_B − OM_A, d'où la différence des coordonnées.",
    matiere: "Maths",
  },
  {
    id: "tv5",
    enonceQuestion: "Trois points A, B, C sont alignés si et seulement si…",
    optionsProposees: ["AB · AC = 0", "AB et AC sont colinéaires", "||AB|| = ||AC||", "A est le milieu de [BC]"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Alignement ⇔ AB et AC colinéaires. AB · AC = 0 voudrait dire un angle droit, pas un alignement.",
    matiere: "Maths",
  },
  {
    id: "tv6",
    enonceQuestion: "La relation de Chasles s'écrit…",
    optionsProposees: ["AB = BA", "AB + BC = AC", "AB · BC = 0", "AB = k BC pour tout k"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "AB + BC = AC reste valable dans l'espace.",
    matiere: "Maths",
  },
  {
    id: "tv7",
    enonceQuestion: "Un vecteur de l'espace est caractérisé par…",
    optionsProposees: ["Uniquement sa norme", "Direction, sens et norme", "Uniquement son origine", "Deux points confondus"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Direction, sens et norme définissent le vecteur.",
    matiere: "Maths",
  },
  {
    id: "tv8",
    enonceQuestion: "Trois vecteurs sont coplanaires lorsqu'ils…",
    optionsProposees: ["Ont la même norme", "Appartiennent à un même plan vectoriel", "Sont deux à deux orthogonaux", "Sont tous nuls"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "Coplanaires = même plan vectoriel. Sinon, ils peuvent former une base.",
    matiere: "Maths",
  },
  {
    id: "tv9",
    enonceQuestion: "Si u = −v avec u et v non nuls, alors u et v sont…",
    optionsProposees: ["Orthogonaux", "Colinéaires de sens opposés", "Non colinéaires", "De normes différentes forcément"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "k = −1 : même direction, sens opposés, même norme.",
    matiere: "Maths",
  },
  {
    id: "tv10",
    enonceQuestion: "Dans une base (i, j, k), tout vecteur u s'écrit…",
    optionsProposees: ["u = i + j + k uniquement", "u = x i + y j + z k de façon unique", "u = 0", "u = i j k"],
    indexReponseCorrecte: 1,
    explicationPedagogique: "C'est la définition d'une base de l'espace.",
    matiere: "Maths",
  },
];

export function isDeltaQuiz(bank: QCMData[]): boolean {
  const blob = bank
    .slice(0, 3)
    .map((q) => q.enonceQuestion)
    .join(" ")
    .toLowerCase();
  return blob.includes("discriminant") || blob.includes("Δ =") || blob.includes("delta");
}
