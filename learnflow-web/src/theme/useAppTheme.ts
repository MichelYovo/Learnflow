"use client";

import { useLearnFlowStore } from "@/store/useLearnFlowStore";
import { palettes, type AppPalette } from "./palette";

export function useAppTheme(): { darkMode: boolean; colors: AppPalette } {
  const darkMode = useLearnFlowStore((s) => Boolean(s.settings?.darkMode));
  return { darkMode, colors: darkMode ? palettes.dark : palettes.light };
}
