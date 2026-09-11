import React from "react";
import { Image, type ImageStyle, type StyleProp } from "react-native";

const LOGOS: Record<string, number> = {
  maths: require("../../assets/icons/subjects/maths.png"),
  svt: require("../../assets/icons/subjects/svt.png"),
  pc: require("../../assets/icons/subjects/pc.png"),
  hg: require("../../assets/icons/subjects/hg.png"),
  fr: require("../../assets/icons/subjects/fr.png"),
  ang: require("../../assets/icons/subjects/ang.png"),
  edhc: require("../../assets/icons/subjects/edhc.png"),
  philo: require("../../assets/icons/subjects/philo.png"),
};

export default function SubjectLogo({
  id,
  size = 28,
  style,
}: {
  id?: string | null;
  size?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={LOGOS[id ?? ""] ?? LOGOS.maths}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
}
