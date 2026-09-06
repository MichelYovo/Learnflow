export const ADMIN_EMAIL_DEFAULT = "admin@learnflow.tg";
export const SUPPORT_EMAIL = "support@learnflow.tg";

export const SUBJECTS = [
  { id: "maths", label: "Mathématiques", color: "#1677FF", bg: "#E6F4FF" },
  { id: "svt", label: "SVT", color: "#10B981", bg: "#ECFDF5" },
  { id: "pc", label: "PCT", color: "#06B6D4", bg: "#ECFEFF" },
  { id: "hg", label: "Histoire-Géo", color: "#F59E0B", bg: "#FFFBEB" },
  { id: "fr", label: "Français", color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "ang", label: "Anglais", color: "#EF4444", bg: "#FEF2F2" },
  { id: "edhc", label: "ECM", color: "#F97316", bg: "#FFF7ED" },
] as const;

export const CLASSES = [
  { id: "6eme", label: "6ème" },
  { id: "5eme", label: "5ème" },
  { id: "4eme", label: "4ème" },
  { id: "3eme", label: "3ème" },
  { id: "2nde", label: "2nde" },
  { id: "1ere", label: "1ère" },
  { id: "Tle", label: "Tle D" },
] as const;

export function classLabel(id: string) {
  return CLASSES.find((c) => c.id === id)?.label ?? id;
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
