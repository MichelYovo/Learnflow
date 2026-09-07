import { Platform, type TextStyle } from "react-native";

/** Police système — pas de chargement réseau, le texte s’affiche tout de suite. */
export const appFont = Platform.select({
  ios: "System",
  android: "sans-serif",
  default: "System",
}) as string;

export const appNavFonts = {
  regular: { fontFamily: appFont, fontWeight: "400" as const },
  medium: { fontFamily: appFont, fontWeight: "500" as const },
  bold: { fontFamily: appFont, fontWeight: "700" as const },
  heavy: { fontFamily: appFont, fontWeight: "800" as const },
};

/** Alias conservé pour les imports existants. */
export const poppinsNavFonts = appNavFonts;

export const poppinsFontMap = {};

export function withAppFont(style: TextStyle): TextStyle {
  if (style.fontFamily && style.fontFamily !== "System" && !style.fontFamily.startsWith("Poppins")) {
    return style;
  }
  return { ...style, fontFamily: appFont };
}

/** Ancien hook NativeWind — ne fait plus rien (Poppins retiré). */
export function installPoppins() {}
