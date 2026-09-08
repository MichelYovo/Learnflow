import type { QCMData } from "../types/learnflow";
import { ficheForChapter } from "./fiches";
import {
  essentialTextToPuces,
  extractBracketKeywords,
  stripCardinalMarkup,
  toLessonContent,
} from "./lessonContent";
import { findChapterMeta } from "./programme";
import { PROGRAMME_3EME } from "./programme3eme";
import { PROGRAMME_TLE } from "./programmeTle";

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

const DISTRACTORS = [
  "le discriminant Δ = b² − 4ac",
  "la bile produite par le pancréas",
  "un neurone qui conduit dans les deux sens",
  "une équation du premier degré",
  "la petite circulation uniquement",
  "un module égal à l'argument",
];

function siblingTitles(chapterId: string, titre: string): string[] {
  const lists = [...PROGRAMME_3EME, ...PROGRAMME_TLE];
  const titles: string[] = [];
  for (const subject of lists) {
    for (const theme of subject.themes) {
      const hit = theme.chapters.some((c) => c.id === chapterId);
      if (!hit) continue;
      for (const c of theme.chapters) {
        if (c.title !== titre) titles.push(c.title);
      }
    }
  }
  if (titles.length >= 3) return titles.slice(0, 6);
  for (const subject of lists) {
    for (const theme of subject.themes) {
      for (const c of theme.chapters) {
        if (c.title !== titre && !titles.includes(c.title)) titles.push(c.title);
      }
    }
  }
  return titles.slice(0, 6);
}

function mcq(id: string, enonce: string, correct: string, wrongs: string[], matiere: string): QCMData {
  const pool = [...new Set(wrongs.map((w) => w.trim()).filter((w) => w && w !== correct))];
  while (pool.length < 3) pool.push(DISTRACTORS[pool.length % DISTRACTORS.length]);
  const options = seededShuffle([correct, ...pool.slice(0, 3)], id);
  return {
    id,
    enonceQuestion: enonce,
    optionsProposees: options,
    indexReponseCorrecte: Math.max(0, options.indexOf(correct)),
    explicationPedagogique: correct,
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

/** QCM d'assimilation généré à partir de la fiche du chapitre — jamais le quiz Δ. */
export function quizFromLesson(chapterId: string, classe?: string): QCMData[] {
  const fiche = ficheForChapter(chapterId, classe);
  const lesson = toLessonContent(fiche);
  const meta = findChapterMeta(chapterId);
  const matiere = meta?.subject.name ?? "Cours";
  const puces = (fiche.pucesEssentiel ?? []).map(cleanLine).filter((p) => p.length > 12);
  const fromText = essentialTextToPuces(lesson.essentialText).map(cleanLine).filter((p) => p.length > 12);
  const facts = (puces.length >= 3 ? puces : fromText).slice(0, 8);
  const keywords = extractBracketKeywords(lesson.essentialText);
  const others = siblingTitles(chapterId, lesson.title);
  const out: QCMData[] = [];

  out.push(
    mcq(
      `${chapterId}-titre`,
      "Ce quiz d'assimilation porte sur quel chapitre ?",
      lesson.title,
      others.length ? others : ["Équations du 2nd degré", "La digestion", "Nombres complexes"],
      matiere,
    ),
  );

  out.push(
    mcq(
      `${chapterId}-matiere`,
      `Le chapitre « ${lesson.title} » appartient à quelle matière ?`,
      matiere,
      ["Maths", "SVT", "PC", "Histoire-Géo", "Français"].filter((m) => m !== matiere),
      matiere,
    ),
  );

  facts.forEach((fact, i) => {
    const wrongs = facts.filter((f) => f !== fact).concat(DISTRACTORS);
    out.push(mcq(`${chapterId}-f${i}`, "Quelle affirmation est exacte pour ce cours ?", fact, wrongs, matiere));
  });

  keywords.forEach((kw, i) => {
    if (out.length >= 10) return;
    const line = splitAroundKeyword(lesson.essentialText, kw);
    if (!line) return;
    const wrongs = keywords.filter((k) => k !== kw).concat(["discriminant", "bile", "synapse"]);
    out.push(
      mcq(
        `${chapterId}-k${i}`,
        `Dans ce chapitre, quel mot complète : « ${line.prompt} » ?`,
        kw,
        wrongs,
        matiere,
      ),
    );
  });

  if (out.length < 10) {
    out.push(
      mcq(
        `${chapterId}-apc`,
        "En Détails, le cours développé sert à…",
        "Présenter la compétence, les savoirs et les savoir-faire APC",
        [
          "Raccourcir L'Essentiel en le coupant",
          "Reposer les questions du discriminant Δ",
          "Remplacer le quizz 10/10",
        ],
        matiere,
      ),
    );
  }
  if (out.length < 10) {
    out.push(
      mcq(
        `${chapterId}-mask`,
        "Les mots entre [crochets] dans L'Essentiel servent à…",
        "Le rappel actif (texte masqué)",
        ["Décorer le titre", "Remplacer En Détails", "Noter le discriminant"],
        matiere,
      ),
    );
  }

  const unique: QCMData[] = [];
  const seen = new Set<string>();
  for (const q of out) {
    if (seen.has(q.enonceQuestion)) continue;
    seen.add(q.enonceQuestion);
    unique.push({ ...q, id: `${chapterId}-${unique.length + 1}` });
    if (unique.length === 10) break;
  }
  while (unique.length < 10 && unique.length > 0) {
    const src = unique[unique.length % unique.length];
    unique.push({ ...src, id: `${chapterId}-p${unique.length}` });
  }
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
    const wrongs = keywords.filter((k) => k !== answer).concat(["discriminant", "bile", "synapse"]);
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
    const options = [...q.optionsProposees];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      ...q,
      optionsProposees: options,
      indexReponseCorrecte: Math.max(0, options.indexOf(correct)),
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
    explicationPedagogique: "Colinéarité : u = k v. Géométriquement, ils portent des droites parallèles.",
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
    explicationPedagogique: "Alignement ⇔ AB et AC colinéaires.",
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
