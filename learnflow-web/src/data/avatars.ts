import type { LigueNom } from "@/types/learnflow";

export type EyeStyle = "wide" | "calm" | "dream" | "focus" | "wink" | "cool";
export type MouthStyle = "grin" | "smile" | "soft" | "smirk";

export type AvatarPersona = {
  id: string;
  label: string;
  hint: string;
  body: string;
  face: string;
  tuft: string;
  accent: string;
  eye: EyeStyle;
  mouth: MouthStyle;
};

/** Personnalités façon Spira — pas des visages, pas les couleurs marque. */
export const AVATARS: AvatarPersona[] = [
  { id: "vif", label: "Vif", hint: "Toujours lancé", body: "#FF6B4A", face: "#FFE8DE", tuft: "#FF8A65", accent: "#FFB4A0", eye: "wide", mouth: "grin" },
  { id: "sage", label: "Sage", hint: "Pose et réfléchit", body: "#2A9D8F", face: "#E4F7EF", tuft: "#1F7A70", accent: "#7DD3C7", eye: "calm", mouth: "smile" },
  { id: "reveur", label: "Rêveur", hint: "Tête dans les nuages", body: "#A78BFA", face: "#F3E8FF", tuft: "#8B6CF6", accent: "#DDD6FE", eye: "dream", mouth: "soft" },
  { id: "feu", label: "Feu", hint: "Ne lâche rien", body: "#E07A5F", face: "#FDE8E0", tuft: "#C45C42", accent: "#F4A698", eye: "focus", mouth: "smile" },
  { id: "malin", label: "Malin", hint: "Un clin d’œil d’avance", body: "#7C6AF7", face: "#EDE9FE", tuft: "#5B54E6", accent: "#C4B5FD", eye: "wink", mouth: "smirk" },
  { id: "lumiere", label: "Lumière", hint: "Chaleureux", body: "#F4A261", face: "#FFF3E6", tuft: "#E08C4A", accent: "#F6C89A", eye: "wide", mouth: "grin" },
  { id: "ombre", label: "Ombre", hint: "Calme et sûr", body: "#5B6B8A", face: "#E8EDF5", tuft: "#3F4C68", accent: "#94A3B8", eye: "cool", mouth: "smirk" },
  { id: "pepite", label: "Pépite", hint: "Fraîcheur", body: "#3DDC97", face: "#E6FFF4", tuft: "#22C57A", accent: "#86EFC0", eye: "wide", mouth: "grin" },
];

export const AVATAR_IDS = AVATARS.map((a) => a.id);

const FROM_LEGACY: Record<string, string> = {
  a01: "vif",
  a02: "sage",
  a03: "reveur",
  a04: "feu",
  a05: "malin",
  a06: "lumiere",
  a07: "ombre",
  a08: "pepite",
  a09: "vif",
  a10: "pepite",
  etoile: "vif",
  explorer: "ombre",
  artiste: "reveur",
  champion: "feu",
  lecteur: "sage",
  musicien: "lumiere",
  poete: "reveur",
  stratege: "malin",
  botaniste: "pepite",
  astronaute: "ombre",
  eclaire: "lumiere",
};

export const TIER_LOOK: Record<LigueNom, { ring: string; glow: string; gem: string; crown: boolean; sparkle: boolean }> = {
  Bronze: { ring: "#C47A4A", glow: "rgba(196,122,74,0.28)", gem: "#D4A574", crown: false, sparkle: false },
  Argent: { ring: "#94A3B8", glow: "rgba(148,163,184,0.34)", gem: "#E2E8F0", crown: false, sparkle: false },
  Or: { ring: "#EAB308", glow: "rgba(234,179,8,0.42)", gem: "#FDE68A", crown: true, sparkle: false },
  Platine: { ring: "#A78BFA", glow: "rgba(167,139,250,0.46)", gem: "#DDD6FE", crown: false, sparkle: true },
  Diamant: { ring: "#22D3EE", glow: "rgba(34,211,238,0.48)", gem: "#A5F3FC", crown: true, sparkle: true },
};

export function getAvatar(id?: string | null): AvatarPersona | undefined {
  const resolved = resolveAvatarId(id);
  if (!resolved) return undefined;
  return AVATARS.find((a) => a.id === resolved);
}

export function resolveAvatarId(id?: string | null): string | undefined {
  if (!id) return undefined;
  if (AVATAR_IDS.includes(id)) return id;
  if (id in FROM_LEGACY) return FROM_LEGACY[id];
  const padded = id.replace(/^avatar-?/i, "").replace(/^a/i, "");
  const asNum = Number.parseInt(padded, 10);
  if (Number.isFinite(asNum) && asNum > 0) {
    const key = `a${String(((asNum - 1) % 10) + 1).padStart(2, "0")}`;
    return FROM_LEGACY[key];
  }
  return undefined;
}

export function defaultAvatarId(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_IDS[hash % AVATAR_IDS.length];
}

export function avatarSrc(_id?: string | null): string | undefined {
  return undefined;
}
