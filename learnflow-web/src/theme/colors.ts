/** Palette LearnFlow — alignée maquette Figma (#1677FF) + CDC accents */
export const colors = {
  primary: "#1677FF",
  primaryDark: "#155EEF",
  secondary: "#10B981",
  secondaryDark: "#0F766E",
  accent: "#F59E0B",
  surface: "#FAFAF9",
  surfaceAlt: "#F5F5F4",
  danger: "#EF4444",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#A8A29E",
  textDark: "#1C1917",
  border: "#F0EFEE",
  borderStrong: "#E7E5E4",
  white: "#FFFFFF",
  /** Texte / icône sur fond primary (ne jamais mapper en mode sombre). */
  onPrimary: "#FFFFFF",
  indigo: "#4F46E5",
  cyan: "#06B6D4",
  violet: "#8B5CF6",
  orange: "#F97316",

  // Subject accents
  maths: "#1677FF",
  mathsBg: "#E6F4FF",
  mathsBorder: "#BAE0FF",
  svt: "#10B981",
  svtBg: "#ECFDF5",
  svtBorder: "#A7F3D0",
  pc: "#06B6D4",
  pcBg: "#ECFEFF",
  pcBorder: "#A5F3FC",
  hg: "#F59E0B",
  hgBg: "#FFFBEB",
  hgBorder: "#FDE68A",
  fr: "#8B5CF6",
  frBg: "#F5F3FF",
  frBorder: "#DDD6FE",
  ang: "#EF4444",
  angBg: "#FEF2F2",
  angBorder: "#FECACA",
  edhc: "#F97316",
  edhcBg: "#FFF7ED",
  edhcBorder: "#FED7AA",
  philo: "#6366F1",
  philoBg: "#EEF2FF",
  philoBorder: "#C7D2FE",
} as const;

export type ColorKey = keyof typeof colors;

type SubjectPalette = {
  maths: string;
  mathsBg: string;
  mathsBorder: string;
  pc: string;
  pcBg: string;
  pcBorder: string;
  svt: string;
  svtBg: string;
  svtBorder: string;
  hg: string;
  hgBg: string;
  hgBorder: string;
  fr: string;
  frBg: string;
  frBorder: string;
  ang: string;
  angBg: string;
  angBorder: string;
  edhc: string;
  edhcBg: string;
  edhcBorder: string;
  philo: string;
  philoBg: string;
  philoBorder: string;
};

/** Palettes pastel par matière — alignées maquette Figma */
export const SUBJECT_COLOR_SCHEMES: Record<string, { color: string; bg: string; border: string }> = {
  maths: { color: colors.maths, bg: colors.mathsBg, border: colors.mathsBorder },
  pc: { color: colors.pc, bg: colors.pcBg, border: colors.pcBorder },
  svt: { color: colors.svt, bg: colors.svtBg, border: colors.svtBorder },
  hg: { color: colors.hg, bg: colors.hgBg, border: colors.hgBorder },
  fr: { color: colors.fr, bg: colors.frBg, border: colors.frBorder },
  ang: { color: colors.ang, bg: colors.angBg, border: colors.angBorder },
  edhc: { color: colors.edhc, bg: colors.edhcBg, border: colors.edhcBorder },
  philo: { color: colors.philo, bg: colors.philoBg, border: colors.philoBorder },
};

export function resolveSubjectScheme(colorScheme: string, palette: SubjectPalette = colors) {
  const schemes: Record<string, { color: string; bg: string; border: string }> = {
    maths: { color: palette.maths, bg: palette.mathsBg, border: palette.mathsBorder },
    pc: { color: palette.pc, bg: palette.pcBg, border: palette.pcBorder },
    svt: { color: palette.svt, bg: palette.svtBg, border: palette.svtBorder },
    hg: { color: palette.hg, bg: palette.hgBg, border: palette.hgBorder },
    fr: { color: palette.fr, bg: palette.frBg, border: palette.frBorder },
    ang: { color: palette.ang, bg: palette.angBg, border: palette.angBorder },
    edhc: { color: palette.edhc, bg: palette.edhcBg, border: palette.edhcBorder },
    philo: { color: palette.philo, bg: palette.philoBg, border: palette.philoBorder },
  };
  return schemes[colorScheme] ?? schemes.maths;
}
