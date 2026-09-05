import React from "react";
import {
  Image,
  useWindowDimensions,
  View,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useAppTheme } from "../theme/useAppTheme";

const LOGO_DARK = require("../../assets/logo-dark.png");
const LOGO_LIGHT = require("../../assets/logo-light.png");
const LOGO_MARK = require("../../assets/logo-mark.png");

/** Wordmark (icône + Learnflow) — ratio largeur / hauteur du PNG */
const WORDMARK_RATIO = 4.25;

type Props = {
  height?: number;
  /** auto = selon thème ; onDark/onLight force ; mark = icône seule */
  variant?: "auto" | "onDark" | "onLight" | "mark";
  /** Agrandit le glyphe (utile si le PNG a beaucoup de marge) */
  scale?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

/**
 * Logo dynamique :
 * - light → logo-light.png
 * - dark → logo-dark.png
 * - mark → logo-mark.png (header compact / FAB)
 */
export default function Logo({
  height = 52,
  variant = "auto",
  scale = 1,
  style,
  imageStyle,
}: Props) {
  const { darkMode } = useAppTheme();
  const { width: screenW } = useWindowDimensions();
  const isMark = variant === "mark";
  const useDarkAsset = variant === "onDark" || (variant === "auto" && darkMode);
  const maxW = Math.max(160, screenW - 40);
  const naturalW = isMark ? height : Math.round(height * WORDMARK_RATIO);
  const width = Math.min(naturalW, maxW);
  const displayH = isMark ? height : Math.max(28, Math.round((width / naturalW) * height));
  const source = isMark ? LOGO_MARK : useDarkAsset ? LOGO_DARK : LOGO_LIGHT;

  return (
    <View style={[{ alignItems: "center", justifyContent: "center" }, style]}>
      <Image
        source={source}
        style={[
          { width, height: displayH },
          scale !== 1 ? { transform: [{ scale }] } : null,
          imageStyle,
        ]}
        resizeMode="contain"
        accessibilityLabel="LearnFlow"
      />
    </View>
  );
}
