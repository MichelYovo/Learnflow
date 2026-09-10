import React from "react";
import { Image, View, useWindowDimensions } from "react-native";

type Props = {
  width?: number;
};

const RATIO = 1280 / 518;

/** Logo animé — mark + wordmark seuls, studio détouré, sans son. */
export default function LogoIntro({ width }: Props) {
  const { width: screenW } = useWindowDimensions();
  const w = Math.min(width ?? 420, Math.max(220, screenW - 48));
  const height = Math.round(w / RATIO);
  return (
    <View style={{ width: w, height, backgroundColor: "transparent" }}>
      <Image
        source={require("../../assets/brand/logo-anim.webp")}
        style={{ width: w, height, backgroundColor: "transparent" }}
        resizeMode="contain"
        accessibilityLabel="LearnFlow"
      />
    </View>
  );
}
