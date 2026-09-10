import type { DifficulteFlash, QCMData } from "../types/learnflow";
import { BLITZ_QCM } from "../data/mock";
import { shuffleQuizOptions } from "../data/quizFromLesson";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const BLITZ_DIFFICULTES: DifficulteFlash[] = ["Facile", "Moyen", "Difficile"];

const DIFF_CHAR: Record<DifficulteFlash, string> = {
  Facile: "F",
  Moyen: "M",
  Difficile: "D",
};

const CHAR_DIFF: Record<string, DifficulteFlash> = {
  F: "Facile",
  M: "Moyen",
  D: "Difficile",
};

export type BlitzDeck = {
  seed: number;
  code: string;
  difficulte: DifficulteFlash;
  questions: QCMData[];
};

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function encodeChallengeCode(seed: number, difficulte: DifficulteFlash = "Moyen") {
  let n = Math.abs(seed) % 32 ** 4;
  let out = "";
  for (let i = 0; i < 4; i++) {
    out = ALPHABET[n % 32] + out;
    n = Math.floor(n / 32);
  }
  return `LF-${DIFF_CHAR[difficulte]}${out}`;
}

export function decodeChallengeCode(raw: string): { seed: number; difficulte: DifficulteFlash } | null {
  const code = raw.trim().toUpperCase().replace(/^LF-?/, "").replace(/[^A-Z0-9]/g, "");
  let difficulte: DifficulteFlash = "Moyen";
  let payload = code;
  if (code.length >= 5 && CHAR_DIFF[code[0]]) {
    difficulte = CHAR_DIFF[code[0]];
    payload = code.slice(1);
  }
  if (payload.length !== 4) return null;
  let n = 0;
  for (const ch of payload) {
    const idx = ALPHABET.indexOf(ch);
    if (idx < 0) return null;
    n = n * 32 + idx;
  }
  return { seed: n, difficulte };
}

export function shuffleWithSeed<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function questionsForBlitz(difficulte: DifficulteFlash): QCMData[] {
  const pool = BLITZ_QCM.filter((q) => q.difficulte === difficulte);
  return pool.length > 0 ? pool : BLITZ_QCM;
}

export function blitzDeck(seed?: number, difficulte: DifficulteFlash = "Moyen"): BlitzDeck {
  const s = seed ?? Math.floor(Math.random() * 32 ** 4);
  return {
    seed: s,
    code: encodeChallengeCode(s, difficulte),
    difficulte,
    questions: shuffleQuizOptions(shuffleWithSeed(questionsForBlitz(difficulte), s)),
  };
}

export function parseChallengeInput(input: string) {
  const parsed = decodeChallengeCode(input);
  if (!parsed) return null;
  return blitzDeck(parsed.seed, parsed.difficulte);
}

export function blitzInviteHook(code: string): string {
  const hooks = [
    "Même arène. Même chrono. Vous jouez en même temps.",
    "Invite un ami : vous entrez tous les deux dans l'arène.",
    "Duel Blitz : deux joueurs, un chrono, zéro excuse.",
    "Colle ça sur WhatsApp — il doit rentrer MAINTENANT.",
  ];
  const n = [...code].reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return hooks[n % hooks.length];
}

export function blitzShareText(input: {
  code: string;
  difficulte: DifficulteFlash;
  score?: number;
  answered?: number;
  live?: boolean;
  link?: string;
  rivalName?: string;
  rivalScore?: number;
}): string {
  const { code, difficulte, score, answered, live, link, rivalName, rivalScore } = input;
  if (live && score != null && rivalScore != null) {
    const mine = score > rivalScore ? "j'ai pris l'arène" : score < rivalScore ? "il m'a eu" : "match nul";
    return [
      `⚔️ DUEL BLITZ — ${mine}`,
      "",
      `Moi ${score}  —  ${rivalName || "Rival"} ${rivalScore}`,
      `Niveau : ${difficulte}`,
      "",
      "Arène collective. 60 secondes. En même temps.",
    ].join("\n");
  }
  if (live) {
    return [
      "⚔️ DUEL BLITZ — j'ouvre l'arène",
      "",
      "On joue EN MÊME TEMPS. 60 secondes. Même questions.",
      "",
      `Code : ${code}`,
      `Niveau : ${difficulte}`,
      ...(link ? ["", `Entre maintenant : ${link}`] : []),
      "",
      "LearnFlow → Blitz → colle le code. Je t'attends.",
    ].join("\n");
  }
  if (score != null && answered != null) {
    return [
      `⚡ BLITZ — j'ai claqué ${score} juste${score > 1 ? "s" : ""} en 60s`,
      "",
      `Niveau : ${difficulte}`,
      "",
      "60 secondes chrono. Tu tiens autant ?",
    ].join("\n");
  }
  return [
    "🔥 BLITZ — 60 secondes chrono",
    "",
    `Niveau : ${difficulte}`,
    "",
    "Sprint solo. Survive 60 secondes.",
  ].join("\n");
}

export function blitzWhatsAppUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
