"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import LogoIntro from "./LogoIntro";

export const INTRO_SESSION_KEY = "lf-intro-logo-v3";
/** Durée de la vidéo source (~10 s), filet de sécurité. */
export const LOGO_INTRO_MS = 10_400;

type Props = {
  /** Animation logo (chaque visite). Sinon logo stagnant, pour le chargement. */
  cinematic?: boolean;
  onFinish?: () => void;
};

export default function AnimatedSplash({ cinematic = false, onFinish }: Props) {
  const [phase, setPhase] = useState<"hold" | "gone">("hold");
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setPhase("gone");
    onFinish?.();
  };

  useEffect(() => {
    if (!cinematic) return;

    const force = new URLSearchParams(window.location.search).has("intro");
    try {
      if (!force && sessionStorage.getItem(INTRO_SESSION_KEY) === "1") {
        finish();
        return;
      }
    } catch {
      /* ignore */
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const holdMs = reduced ? 80 : LOGO_INTRO_MS;
    const tDone = window.setTimeout(finish, holdMs);

    return () => {
      window.clearTimeout(tDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot intro
  }, [cinematic]);

  if (phase === "gone") return null;

  return (
    <div
      className={cinematic ? "lf-boot lf-boot-film" : "lf-boot"}
      onClick={cinematic ? finish : undefined}
      role={cinematic ? "presentation" : undefined}
    >
      {cinematic ? <LogoIntro fill onEnded={finish} /> : <Logo height={80} variant="onLight" animated={false} />}
    </div>
  );
}
