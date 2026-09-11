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
  const darkMode = useLearnFlowStore((s) => Boolean(s.settings?.darkMode));
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    root.style.colorScheme = darkMode ? "dark" : "light";
    root.dataset.theme = darkMode ? "dark" : "light";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", darkMode ? "#000000" : "#1677FF");
  }, [darkMode]);
  return null;
}
