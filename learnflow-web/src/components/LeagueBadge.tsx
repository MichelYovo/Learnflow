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
  const meta = LEAGUE_TIERS.find((t) => t.id === nom) ?? LEAGUE_TIERS[0];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={SRC[meta.badgeKey]} alt={meta.label} width={size} height={size} className="relative z-[1] object-contain" />
  );
}

export function badgeSrc(key: string) {
  return SRC[key] ?? SRC.gold;
}

/** Badge 3D centré dans un cercle coloré du palier */
export function LeagueBadgeCircle({
  nom,
  size = 56,
  selected = false,
  dimmed = false,
}: {
  nom: LigueNom | string;
  size?: number;
  selected?: boolean;
  dimmed?: boolean;
}) {
  const meta = LEAGUE_TIERS.find((t) => t.id === nom) ?? LEAGUE_TIERS[0];
  const frame = Math.round(size * 1.36);
  return (
    <span
      className="relative inline-flex items-center justify-center overflow-hidden rounded-full"
      style={{
        width: frame,
        height: frame,
        background: `radial-gradient(circle at 50% 42%, ${meta.color}55 0%, ${meta.color}22 52%, ${meta.accent} 78%)`,
        boxShadow: selected ? `0 0 0 2.5px ${meta.color}` : `0 0 0 1px ${meta.color}33`,
        opacity: dimmed ? 0.42 : 1,
      }}
    >
      <LeagueBadge nom={nom} size={size} />
    </span>
  );
}
