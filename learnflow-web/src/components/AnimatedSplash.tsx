"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

const STORAGE_KEY = "lf-intro-flash";

type Props = {
  /** Hold blanc ≥ 50 s + flash (premier lancement). Sinon logo stagnant, pour le chargement. */
  cinematic?: boolean;
  onFinish?: () => void;
};

export default function AnimatedSplash({ cinematic = false, onFinish }: Props) {
  const [phase, setPhase] = useState<"hold" | "flash" | "gone">("hold");
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setPhase("gone");
    onFinish?.();
  };

  useEffect(() => {
    if (!cinematic) return;

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        finish();
        return;
      }
    } catch {
      /* ignore */
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const holdMs = reduced ? 80 : 50_000;
    const flashMs = reduced ? 40 : 420;

    const tFlash = window.setTimeout(() => setPhase("flash"), holdMs);
    const tDone = window.setTimeout(finish, holdMs + flashMs);

    return () => {
      window.clearTimeout(tFlash);
      window.clearTimeout(tDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot intro
  }, [cinematic]);

  if (phase === "gone") return null;

  return (
    <>
      <div
        className={`lf-boot ${phase === "flash" ? "lf-boot-out" : ""}`}
        onClick={cinematic ? finish : undefined}
        role={cinematic ? "presentation" : undefined}
      >
        <Logo height={80} variant="onLight" animated={false} />
      </div>
      {phase === "flash" ? <div className="lf-boot-flash" aria-hidden /> : null}
    </>
  );
}
