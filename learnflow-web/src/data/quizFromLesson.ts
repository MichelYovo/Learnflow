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
    const w = clipWords(tidy(cleanLine(raw)), 120);
    const key = fold(w);
    if (!w || w.length < 2 || seen.has(key) || sameChoice(w, correct)) continue;
    seen.add(key);
    out.push(w);
    if (out.length === 3) break;
  }
  return out;
}

function notesFor(options: string[], correct: string, explain: string): string[] {
  const why = clipWords(explain.replace(/\s+/g, " ").trim(), 160);
  return options.map((opt) =>
    fold(opt) === fold(correct)
      ? why
      : "Cette proposition ne répond pas à la question. Reviens à la phrase du cours.",
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
  const why = clipWords((explain || correct).trim(), 160);
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

function clipWords(s: string, n: number) {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n - 1);
  const sp = cut.lastIndexOf(" ");
  const base = sp > 24 ? cut.slice(0, sp) : cut;
  return `${base.trim()}…`;
}

function tidy(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function asQuestion(s: string) {
  const t = tidy(s).replace(/[.…]+$/, "").replace(/\s*\?+$/, "");
  return `${t} ?`;
}

function looksLikeFormula(s: string) {
  const w = (s.split(/\s+/)[0] ?? "").replace(/[.,;:!?]+$/, "");
  if (!w) return false;
  if (/[0-9=+\-*/^²³₀-₉√∑Δ_]/.test(w)) return true;
  if (/^[A-Za-zΔ]$/.test(w)) return true;
  if (/^[A-Za-z][₀-₉0-9]$/.test(w)) return true;
  return false;
}

function sentenceCase(s: string) {
  const t = tidy(s).replace(/[.]+$/, "");
  if (!t || looksLikeFormula(t)) return t;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function subjectPhrase(s: string) {
  return tidy(s).replace(/^(Le|La|Les|Un|Une|Des)\b/, (w) => w.toLowerCase()).replace(/^L['’]/, "l'");
}

function namedNotion(s: string) {
  const t = subjectPhrase(s);
  const body = t.charAt(0).toLowerCase() + t.slice(1);
  if (/^relations\b/i.test(t)) return `les ${body}`;
  if (/^(loi|relation|théorème|theoreme|formule|règle|regle)\b/i.test(t)) return `la ${body}`;
  return t;
}

type FactKind = "si" | "ecrit" | "def" | "label" | "fait";

type ParsedFact = {
  stem: string;
  correct: string;
  explain: string;
  kind: FactKind;
};

const FAIT_STEMS = [
  "Laquelle de ces affirmations est exacte ?",
  "Quelle phrase correspond au cours ?",
  "Parmi ces propositions, laquelle est juste ?",
];

/** Transforme une puce de cours en question complète, avec une réponse courte. */
function parseFact(raw: string, faitIndex = 0): ParsedFact | null {
  const t = tidy(cleanLine(raw));
  if (t.length < 18) return null;
  const explain = /[.!?…]$/.test(t) ? t : `${t}.`;

  const si = t.match(/^si\s+(.+?)\s*(?:→|->|⇒|:)\s*(.+)$/i);
  if (si && si[2].trim().length >= 4) {
    return {
      kind: "si",
      stem: asQuestion(`Si ${si[1].trim().replace(/[.]$/, "")}, que se passe-t-il`),
      correct: clipWords(sentenceCase(si[2]), 110),
      explain,
    };
  }

  const plus = t.match(/^plus\s+(.{6,80}?),\s+plus\s+(.{6,})$/i);
  if (plus) {
    return {
      kind: "si",
      stem: asQuestion(`Que se passe-t-il lorsque ${subjectPhrase(plus[1])}`),
      correct: clipWords(sentenceCase(plus[2]), 110),
      explain,
    };
  }

  const en = t.match(/^(en\s+[^,]{3,42}),\s+(.{10,})$/i);
  if (en) {
    return {
      kind: "si",
      stem: asQuestion(`${sentenceCase(en[1])}, que se passe-t-il`),
      correct: clipWords(sentenceCase(en[2]), 110),
      explain,
    };
  }

  const iff = t.match(/^(.{10,72}?)\s+(si et seulement si|ssi)\s+(.{8,})$/i);
  if (iff) {
    return {
      kind: "si",
      stem: asQuestion(`${sentenceCase(iff[1])} si et seulement si`),
      correct: clipWords(sentenceCase(iff[3]), 110),
      explain,
    };
  }

  const ecrit = t.match(/^(.{8,90}?)\s+s['’]écrit\s+(.+)$/i);
  if (ecrit && ecrit[2].trim().length >= 4) {
    return {
      kind: "ecrit",
      stem: asQuestion(`Comment s'écrit ${subjectPhrase(ecrit[1])}`),
      correct: clipWords(tidy(ecrit[2]).replace(/[.]$/, ""), 110),
      explain,
    };
  }

  const est = t.match(/^(.{6,70}?)\s+(?:est|désigne|signifie|correspond à)\s+(.{8,})$/i);
  if (est && !/^(si|en)\b/i.test(est[1]) && est[1].split(/\s+/).length <= 14) {
    return {
      kind: "def",
      stem: asQuestion(`Qu'est-ce que ${subjectPhrase(est[1])}`),
      correct: clipWords(sentenceCase(est[2]), 120),
      explain,
    };
  }

  const labeled = t.match(/^(.{6,58}?)\s*[:：]\s+(.{8,})$/);
  if (labeled && !labeled[1].includes(".")) {
    const left = labeled[1].trim();
    const notion = namedNotion(left);
    const stem = /^(loi|relation|relations|théorème|theoreme|formule|règle|regle)\b/i.test(left)
      ? asQuestion(notion.startsWith("les ") ? `Comment s'énoncent ${notion}` : `Comment s'énonce ${notion}`)
      : asQuestion(`Que signifie « ${left.trim()} »`);
    return {
      kind: "label",
      stem,
      correct: clipWords(sentenceCase(labeled[2]), 120),
      explain,
    };
  }

  return {
    kind: "fait",
    stem: FAIT_STEMS[faitIndex % FAIT_STEMS.length],
    correct: clipWords(t.replace(/[.]$/, ""), 120),
    explain,
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

function pushFact(
  out: QCMData[],
  seen: Set<string>,
  fact: ParsedFact,
  wrongPool: string[],
  chapterId: string,
  matiere: string,
) {
  if (out.length >= 10) return false;
  const key = `${fold(fact.stem)}|${fold(fact.correct)}`;
  if (seen.has(key)) return false;
  const q = mcq(`${chapterId}-q${out.length}`, fact.stem, fact.correct, wrongPool, matiere, fact.explain);
  if (!q) return false;
  seen.add(key);
  seen.add(fold(fact.stem));
  out.push({ ...q, id: `${chapterId}-${out.length + 1}` });
  return true;
}

/** QCM d'assimilation : questions formulées à partir du cours, faux choix du même chapitre. */
export function quizFromLesson(chapterId: string, classe?: string): QCMData[] {
  const fiche = ficheForChapter(chapterId, classe);
  const lesson = toLessonContent(fiche);
  const meta = findChapterMeta(chapterId);
  const matiere = meta?.subject.name ?? "Cours";
  const puces = (fiche.pucesEssentiel?.length ? fiche.pucesEssentiel : essentialTextToPuces(lesson.essentialText))
    .map(cleanLine)
    .filter((p) => p.length > 16);
  const extraParas = (fiche.sectionsDetaillees ?? [])
    .flatMap((s) => s.paragraphes.flatMap(splitSentences))
    .filter((p) => p.length > 24);
  const keywords = extractBracketKeywords(lesson.essentialText);

  let faitIndex = 0;
  const fromPuces = puces.map((p) => parseFact(p, faitIndex++)).filter((f): f is ParsedFact => Boolean(f));
  const fromDetails = extraParas.map((p) => parseFact(p, faitIndex++)).filter((f): f is ParsedFact => Boolean(f));
  const ranked = [
    ...fromPuces.filter((f) => f.kind !== "fait"),
    ...fromDetails.filter((f) => f.kind !== "fait"),
    ...fromPuces.filter((f) => f.kind === "fait"),
    ...fromDetails.filter((f) => f.kind === "fait"),
  ];

  const out: QCMData[] = [];
  const seen = new Set<string>();
  let faits = 0;

  for (const fact of ranked) {
    if (out.length >= 8) break;
    if (fact.kind === "fait" && faits >= 3) continue;
    if (seen.has(fold(fact.stem))) continue;
    const sameKind = ranked.filter((f) => f !== fact && f.kind === fact.kind).map((f) => f.correct);
    const others = ranked.filter((f) => f !== fact).map((f) => f.correct);
    const added = pushFact(out, seen, fact, [...sameKind, ...others, ...puces, ...extraParas], chapterId, matiere);
    if (added && fact.kind === "fait") faits += 1;
  }

  let blanks = 0;
  keywords.forEach((kw, i) => {
    if (out.length >= 10 || blanks >= 2) return;
    const line = splitAroundKeyword(lesson.essentialText, kw);
    if (!line) return;
    const stem = `Quel terme remplace les points de suspension : « ${clipWords(line.prompt, 110)} » ?`;
    if (seen.has(fold(stem))) return;
    const q = mcq(
      `${chapterId}-k${i}`,
      stem,
      kw,
      keywords.filter((k) => k !== kw),
      matiere,
      `Le terme attendu est « ${kw} ».`,
    );
    if (!q) return;
    seen.add(fold(stem));
    blanks += 1;
    out.push({ ...q, id: `${chapterId}-${out.length + 1}` });
  });

  const ex = fiche.exempleResolu;
  if (out.length < 10 && ex?.reponseFinale?.trim() && ex.enonce?.trim()) {
    const finale = clipWords(tidy(cleanLine(ex.reponseFinale)).replace(/[.]$/, ""), 110);
    const stem = asQuestion(`Quelle est la conclusion de cet exercice : ${clipWords(tidy(cleanLine(ex.enonce)), 80)}`);
    if (!seen.has(`${fold(stem)}|${fold(finale)}`)) {
      const q = mcq(
        `${chapterId}-ex`,
        stem,
        finale,
        [...(ex.etapes ?? []).map((e) => e.texte), ...puces],
        matiere,
        tidy(ex.reponseFinale),
      );
      if (q) out.push({ ...q, id: `${chapterId}-${out.length + 1}` });
    }
  }

  return out.slice(0, 10);
}

function splitAroundKeyword(text: string, kw: string): { prompt: string } | null {
  const line = text.split(/\n+/).find((l) => l.includes(`[${kw}]`));
  if (!line) return null;
  const prompt = line
    .replace(`[${kw}]`, "…")
    .replace(/\[([^\]]+)\]/g, "$1")
    .replace(/^[•\-]\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
  if (prompt.length < 16 || prompt.includes("[") || prompt.includes("•")) return null;
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
