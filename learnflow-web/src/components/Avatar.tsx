"use client";

import { getAvatar } from "@/data/avatars";
import type { LigueNom } from "@/types/learnflow";
import CompanionMark from "./CompanionMark";

export default function Avatar({
  avatarId,
  size = 48,
  initials,
  fallbackColor = "#1677FF",
  selected,
  className = "",
  tier,
}: {
  avatarId?: string;
  size?: number;
  initials?: string;
  fallbackColor?: string;
  selected?: boolean;
  className?: string;
  tier?: LigueNom;
}) {
  const persona = getAvatar(avatarId);

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <CompanionMark
        persona={persona}
        size={size}
        tier={persona ? tier : undefined}
        selected={selected}
        initials={initials}
        fallbackColor={fallbackColor}
      />
    </div>
  );
}
