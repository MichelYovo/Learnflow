"use client";

import { LEAGUE_TIERS } from "@/data/mock";
import type { LigueNom } from "@/types/learnflow";

const SRC: Record<string, string> = {
  bronze: "/badges/bronze.png",
  silver: "/badges/silver.png",
  gold: "/badges/gold.png",
  platinum: "/badges/platinum.png",
  diamond: "/badges/diamond.png",
};

export default function LeagueBadge({ nom, size = 56 }: { nom: LigueNom | string; size?: number }) {
  const meta = LEAGUE_TIERS.find((t) => t.id === nom) ?? LEAGUE_TIERS[2];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={SRC[meta.badgeKey]} alt={meta.label} width={size} height={size} className="object-contain" />
  );
}

export function badgeSrc(key: string) {
  return SRC[key] ?? SRC.gold;
}
