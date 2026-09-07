import type { LigueNom } from "../../types/learnflow";

/** Badges 3D — assets/badges/*.png */
export const LEAGUE_BADGE_IMAGES = {
  bronze: require("../../../assets/badges/bronze.png"),
  silver: require("../../../assets/badges/silver.png"),
  gold: require("../../../assets/badges/gold.png"),
  platinum: require("../../../assets/badges/platinum.png"),
  diamond: require("../../../assets/badges/diamond.png"),
} as const;

const TIER_TO_KEY: Record<LigueNom, keyof typeof LEAGUE_BADGE_IMAGES> = {
  Bronze: "bronze",
  Argent: "silver",
  Or: "gold",
  Platine: "platinum",
  Diamant: "diamond",
};

export function leagueBadgeSource(nom: LigueNom | string) {
  return LEAGUE_BADGE_IMAGES[TIER_TO_KEY[nom as LigueNom] ?? "gold"];
}
