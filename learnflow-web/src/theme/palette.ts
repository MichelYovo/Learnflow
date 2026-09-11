import { colors as lightColors } from "./colors";

export type AppPalette = { [K in keyof typeof lightColors]: string };

/** Thème black OLED — cartes noires, texte clair, accents LearnFlow. */
export const darkColors: AppPalette = {
  primary: "#3B82F6",
  primaryDark: "#2563EB",
  secondary: "#34D399",
  secondaryDark: "#10B981",
  accent: "#FBBF24",
  surface: "#000000",
  surfaceAlt: "#1C1C1E",
  danger: "#F87171",
  textPrimary: "#F5F5F7",
  textSecondary: "#A1A1AA",
  textMuted: "#8E8E93",
  textDark: "#F5F5F7",
  border: "#2C2C2E",
  borderStrong: "#3A3A3C",
  white: "#141414",
  onPrimary: "#FFFFFF",
  indigo: "#818CF8",
  cyan: "#22D3EE",
  violet: "#A78BFA",
  orange: "#FB923C",
  maths: "#60A5FA",
  mathsBg: "#0B1220",
  mathsBorder: "#1E3A5F",
  svt: "#34D399",
  svtBg: "#07150F",
  svtBorder: "#14532D",
  pc: "#22D3EE",
  pcBg: "#061016",
  pcBorder: "#155E75",
  hg: "#FBBF24",
  hgBg: "#161008",
  hgBorder: "#78350F",
  fr: "#A78BFA",
  frBg: "#120B1F",
  frBorder: "#4C1D95",
  ang: "#F87171",
  angBg: "#1A0B0B",
  angBorder: "#7F1D1D",
  edhc: "#FB923C",
  edhcBg: "#1A0E08",
  edhcBorder: "#7C2D12",
  philo: "#A5B4FC",
  philoBg: "#0E0E1A",
  philoBorder: "#312E81",
};

export const palettes = { light: lightColors as AppPalette, dark: darkColors };

export function modeCardSurface(lightBg: string, lightBorder: string, accent: string, darkMode: boolean) {
  if (!darkMode) return { background: lightBg, border: lightBorder };
  return { background: "#141414", border: `${accent}66` };
}
