import React from "react";
import { Image, type ImageStyle, type StyleProp } from "react-native";
import type { LigueNom } from "../../types/learnflow";
import { leagueBadgeSource } from "./badgeAssets";

type Props = {
  nom: LigueNom;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export default function LeagueBadge({ nom, size = 56, style }: Props) {
  return (
    <Image
      source={leagueBadgeSource(nom)}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
      accessibilityLabel={`Badge ligue ${nom}`}
    />
  );
}
