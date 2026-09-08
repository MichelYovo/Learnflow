import type { ClasseAPC } from "../types/learnflow";

const FACTEUR_CLASSE: Record<string, number> = {
  "6eme": 1.0,
  "5eme": 1.1,
  "4eme": 1.2,
  "3eme": 1.3,
  "2nde": 1.35,
  "2nde-A": 1.35,
  "2nde-S": 1.35,
  "1ere": 1.4,
  "1ere-A": 1.4,
  "1ere-C": 1.4,
  "1ere-D": 1.4,
  Tle: 1.5,
  "Tle-A": 1.5,
  "Tle-C": 1.5,
  "Tle-D": 1.5,
};

function facteurClasse(classe: string) {
  if (FACTEUR_CLASSE[classe] != null) return FACTEUR_CLASSE[classe];
  if (/^Tle/i.test(classe)) return 1.5;
  if (/^1ere/i.test(classe)) return 1.4;
  if (/^2nde/i.test(classe)) return 1.35;
  return 1.2;
}

/** XP = BaseXP * FacteurClasse * DensiteChapitre * MultiplicateurPrecision */
export function calculerXP(params: {
  baseXP: number;
  classe: ClasseAPC | string;
  densiteChapitre?: number;
  multiplicateurPrecision?: number;
}): number {
  const facteur = facteurClasse(params.classe);
  const densite = params.densiteChapitre ?? 1;
  const precision = params.multiplicateurPrecision ?? 1;
  return Math.round(params.baseXP * facteur * densite * precision);
}

export function xpAssimilation(score: number, total: number, classe: string, firstTry: boolean) {
  const precision = score / total;
  const base = score * 25;
  const bonus = score === total ? 1.5 : 1;
  const first = firstTry && score === total ? 1.25 : 1;
  return calculerXP({
    baseXP: base,
    classe,
    densiteChapitre: 1,
    multiplicateurPrecision: precision * bonus * first,
  });
}

const BLITZ_DIFF_XP: Record<string, number> = {
  Facile: 0.8,
  Moyen: 1,
  Difficile: 1.4,
};

export function xpBlitz(score: number, answered: number, classe: string, difficulte = "Moyen") {
  const niveau = BLITZ_DIFF_XP[difficulte] ?? 1;
  return calculerXP({
    baseXP: score * 15,
    classe,
    densiteChapitre: 0.8 * niveau,
    multiplicateurPrecision: answered > 0 ? score / Math.max(answered, 1) + 0.5 : 1,
  });
}
