"use client";

import Spira from "@/components/Spira";
import { spiraMoodForMode } from "@/data/spira";
import type { AppMode } from "@/types/modes";

type Props = {
  mode: AppMode;
  /** Largeur de la zone mascotte (sprite ≈ 90 %) */
  size: number;
};

export default function ModeMascot({ mode, size }: Props) {
  const sprite = Math.round(size * 0.9);

  return (
    <span
      className={`lf-mode-mascot lf-mode-mascot--${mode}`}
      style={{ width: size, height: Math.round(size * 1.02) }}
      aria-hidden
    >
      <span className="lf-mode-mascot__sprite">
        <Spira mood={spiraMoodForMode(mode)} size={sprite} message="" animated={false} interactive={false} />
      </span>
    </span>
  );
}
