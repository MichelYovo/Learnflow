import React, { createElement, forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { cssInterop } from "nativewind";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from "@expo-google-fonts/poppins";

/** Familles Expo — une graisse = un fichier (obligatoire sur Android). */
export const poppins = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semiBold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
  extraBold: "Poppins_800ExtraBold",
  black: "Poppins_900Black",
} as const;

export const poppinsFontMap = {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
};

export const poppinsNavFonts = {
  regular: { fontFamily: poppins.regular, fontWeight: "400" as const },
  medium: { fontFamily: poppins.medium, fontWeight: "500" as const },
  bold: { fontFamily: poppins.bold, fontWeight: "700" as const },
  heavy: { fontFamily: poppins.extraBold, fontWeight: "800" as const },
};

function familyForWeight(weight: TextStyle["fontWeight"] | undefined): string {
  const w = weight == null ? "400" : String(weight);
  if (w === "normal") return poppins.regular;
  if (w === "bold") return poppins.bold;
  const n = Number.parseInt(w, 10);
  if (!Number.isFinite(n) || n <= 400) return poppins.regular;
  if (n <= 500) return poppins.medium;
  if (n <= 600) return poppins.semiBold;
  if (n <= 700) return poppins.bold;
  if (n <= 800) return poppins.extraBold;
  return poppins.black;
}

function isCustomNonPoppins(family: string | undefined): boolean {
  if (!family) return false;
  if (family.startsWith("Poppins")) return false;
  return family !== "System" && family !== "sans-serif" && family !== "ui-sans-serif";
}

/** Mappe fontWeight → fichier Poppins, sans toucher aux polices d’icônes. */
export function withPoppins(style: StyleProp<TextStyle>): TextStyle {
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  if (isCustomNonPoppins(flat.fontFamily)) return flat;
  const { fontWeight, fontFamily: existing, ...rest } = flat;
  return {
    ...rest,
    fontFamily: existing?.startsWith("Poppins") ? existing : familyForWeight(fontWeight),
  };
}

function wrapWithPoppins(Base: React.ComponentType<any>, name: string) {
  const Wrapped = forwardRef((props: Record<string, unknown> & { style?: StyleProp<TextStyle> }, ref) =>
    createElement(Base, { ...props, ref, style: withPoppins(props.style) })
  );
  Wrapped.displayName = name;
  return Wrapped;
}

function interopMap(): Map<object, React.ComponentType<any>> {
  return require("react-native-css-interop/dist/runtime/native/api").interopComponents;
}

let installed = false;

/** Branche Poppins sur tous les <Text> / <TextInput> (NativeWind + StyleSheet). */
export function installPoppins() {
  if (installed) return;
  installed = true;
  require("react-native-css-interop/dist/runtime/components");

  const PoppinsText = wrapWithPoppins(Text, "PoppinsText");
  const PoppinsInput = wrapWithPoppins(TextInput, "PoppinsTextInput");
  const StyledText = cssInterop(PoppinsText, { className: "style" });
  const StyledInput = cssInterop(PoppinsInput, {
    className: { target: "style", nativeStyleToProp: { textAlign: true } },
  });

  const map = interopMap();
  map.set(Text, StyledText);
  map.set(TextInput, StyledInput);
}
