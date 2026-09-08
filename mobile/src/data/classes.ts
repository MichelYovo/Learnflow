import type { ClasseAPC } from "../types/learnflow";

export type CycleScolaire = "college" | "lycee";

export type ClasseOption = { id: ClasseAPC; label: string; cycle: CycleScolaire };

export const CLASSES: ClasseOption[] = [
  { id: "6eme", label: "6ème", cycle: "college" },
  { id: "5eme", label: "5ème", cycle: "college" },
  { id: "4eme", label: "4ème", cycle: "college" },
  { id: "3eme", label: "3ème", cycle: "college" },
  { id: "2nde-A", label: "2nde A", cycle: "lycee" },
  { id: "2nde-S", label: "2nde S", cycle: "lycee" },
  { id: "1ere-A", label: "1ère A", cycle: "lycee" },
  { id: "1ere-C", label: "1ère C", cycle: "lycee" },
  { id: "1ere-D", label: "1ère D", cycle: "lycee" },
  { id: "Tle-A", label: "Tle A", cycle: "lycee" },
  { id: "Tle-C", label: "Tle C", cycle: "lycee" },
  { id: "Tle-D", label: "Tle D", cycle: "lycee" },
];

export const CLASS_GROUPS: { id: CycleScolaire; label: string; classes: ClasseOption[] }[] = [
  { id: "college", label: "Collège", classes: CLASSES.filter((c) => c.cycle === "college") },
  { id: "lycee", label: "Lycée", classes: CLASSES.filter((c) => c.cycle === "lycee") },
];

const LEGACY: Record<string, ClasseAPC> = {
  "2nde": "2nde-S",
  "1ere": "1ere-D",
  Tle: "Tle-D",
};

export function normalizeClassId(id?: string): string {
  if (!id) return "";
  return LEGACY[id] ?? id;
}

export function classLabel(id: string) {
  const resolved = normalizeClassId(id);
  return CLASSES.find((c) => c.id === resolved)?.label ?? id;
}

export function isLyceeClass(classe?: string): boolean {
  if (!classe) return false;
  return /^(2nde|1ere|Tle)/i.test(classe);
}

/** Cours Données_LF : Terminale D uniquement (y compris l’ancien id `Tle`). */
export function isTleDClass(classe?: string): boolean {
  return normalizeClassId(classe) === "Tle-D";
}

export function cycleForClass(classe?: string): CycleScolaire {
  return isLyceeClass(classe) ? "lycee" : "college";
}

/** Année scolaire (pour partager un cours Tle entre Tle A/C/D). */
export function classYear(classe?: string): "college" | "2nde" | "1ere" | "tle" | "" {
  if (!classe) return "";
  if (/^Tle/i.test(classe)) return "tle";
  if (/^1ere/i.test(classe)) return "1ere";
  if (/^2nde/i.test(classe)) return "2nde";
  return "college";
}

export function sameClassYear(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  if (a === b) return true;
  const ya = classYear(a);
  const yb = classYear(b);
  if (!ya || !yb) return false;
  if (ya === "college" || yb === "college") return a === b;
  return ya === yb;
}

export type SubjectOption = { id: string; label: string };

const SUBJECTS_SHARED: SubjectOption[] = [
  { id: "maths", label: "Mathématiques" },
  { id: "svt", label: "SVT" },
  { id: "hg", label: "Histoire-Géo" },
  { id: "fr", label: "Français" },
  { id: "ang", label: "Anglais" },
  { id: "edhc", label: "ECM" },
];

export function subjectsForClass(classe?: string): SubjectOption[] {
  const lycee = isLyceeClass(classe);
  const pc: SubjectOption = { id: "pc", label: lycee ? "PC" : "PCT" };
  const list = [SUBJECTS_SHARED[0], SUBJECTS_SHARED[1], pc, ...SUBJECTS_SHARED.slice(2)];
  if (lycee) list.push({ id: "philo", label: "Philosophie" });
  return list;
}
