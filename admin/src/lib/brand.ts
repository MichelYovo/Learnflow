export const ADMIN_EMAIL_DEFAULT = "admin@learnflow.tg";
export const SUPPORT_EMAIL = "support@learnflow.tg";

export type CycleScolaire = "college" | "lycee";

export const CLASSES = [
  { id: "6eme", label: "6ème", cycle: "college" as const },
  { id: "5eme", label: "5ème", cycle: "college" as const },
  { id: "4eme", label: "4ème", cycle: "college" as const },
  { id: "3eme", label: "3ème", cycle: "college" as const },
  { id: "2nde-A", label: "2nde A", cycle: "lycee" as const },
  { id: "2nde-S", label: "2nde S", cycle: "lycee" as const },
  { id: "1ere-A", label: "1ère A", cycle: "lycee" as const },
  { id: "1ere-C", label: "1ère C", cycle: "lycee" as const },
  { id: "1ere-D", label: "1ère D", cycle: "lycee" as const },
  { id: "Tle-A", label: "Tle A", cycle: "lycee" as const },
  { id: "Tle-C", label: "Tle C", cycle: "lycee" as const },
  { id: "Tle-D", label: "Tle D", cycle: "lycee" as const },
] as const;

export const CLASS_GROUPS = [
  { id: "college" as const, label: "Collège", classes: CLASSES.filter((c) => c.cycle === "college") },
  { id: "lycee" as const, label: "Lycée", classes: CLASSES.filter((c) => c.cycle === "lycee") },
];

const LEGACY: Record<string, string> = {
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

export function isTleDClass(classe?: string): boolean {
  return normalizeClassId(classe) === "Tle-D";
}

export const SUBJECTS = [
  { id: "maths", label: "Mathématiques", color: "#1677FF", bg: "#E6F4FF" },
  { id: "svt", label: "SVT", color: "#10B981", bg: "#ECFDF5" },
  { id: "pc", label: "PCT", color: "#06B6D4", bg: "#ECFEFF" },
  { id: "hg", label: "Histoire-Géo", color: "#F59E0B", bg: "#FFFBEB" },
  { id: "fr", label: "Français", color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "ang", label: "Anglais", color: "#EF4444", bg: "#FEF2F2" },
  { id: "edhc", label: "ECM", color: "#F97316", bg: "#FFF7ED" },
] as const;

export const SUBJECT_PHILO = { id: "philo", label: "Philosophie", color: "#6366F1", bg: "#EEF2FF" } as const;

export function subjectsForClass(classe?: string) {
  const lycee = isLyceeClass(classe);
  return [
    SUBJECTS[0],
    SUBJECTS[1],
    { ...SUBJECTS[2], label: lycee ? "PC" : "PCT" },
    SUBJECTS[3],
    SUBJECTS[4],
    SUBJECTS[5],
    SUBJECTS[6],
    ...(lycee ? [SUBJECT_PHILO] : []),
  ];
}

export const LEAGUE_TIERS = [
  { id: "Bronze", label: "Bronze", badge: "/brand/bronze.png", color: "#D4A574" },
  { id: "Argent", label: "Argent", badge: "/brand/silver.png", color: "#94A3B8" },
  { id: "Or", label: "Or", badge: "/brand/gold.png", color: "#EAB308" },
  { id: "Platine", label: "Platine", badge: "/brand/platinum.png", color: "#C4B5FD" },
  { id: "Diamant", label: "Diamant", badge: "/brand/diamond.png", color: "#F59E0B" },
] as const;

export function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
