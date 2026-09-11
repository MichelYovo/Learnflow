"use client";

import { useEffect, useRef } from "react";
import Logo from "./Logo";

/** Logo stagnant avant d’entrer dans l’app. */
export const LOGO_HOLD_MS = 50;

type Props = {
  onFinish?: () => void;
};

export default function AnimatedSplash({ onFinish }: Props) {
  const finished = useRef(false);

  useEffect(() => {
    if (!onFinish) return;
    const t = window.setTimeout(() => {
      if (finished.current) return;
      finished.current = true;
      onFinish();
    }, LOGO_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [onFinish]);

  return (
    <div className="lf-boot">
      <Logo height={80} variant="onLight" animated={false} />
    </div>
  );
}
