"use client";

import { useEffect } from "react";
import { preloadSfx } from "@/lib/sfx";

/** Précharge les SFX quiz/Blitz dès l’entrée dans l’app. */
export default function SfxBootstrap() {
  useEffect(() => {
    preloadSfx();
  }, []);
  return null;
}
