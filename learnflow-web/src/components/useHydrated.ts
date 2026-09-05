"use client";

import { useEffect, useState } from "react";
import { useLearnFlowStore } from "@/store/useLearnFlowStore";

export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const persist = useLearnFlowStore.persist;
    if (persist.hasHydrated()) {
      setReady(true);
      return;
    }
    const unsub = persist.onFinishHydration(() => setReady(true));
    const t = setTimeout(() => setReady(true), 800);
    return () => {
      unsub?.();
      clearTimeout(t);
    };
  }, []);
  return ready;
}

export function ThemeSync() {
  const darkMode = useLearnFlowStore((s) => s.settings.darkMode);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);
  return null;
}
