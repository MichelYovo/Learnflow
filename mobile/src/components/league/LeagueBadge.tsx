import React from "react";
import { Image, View, type ImageStyle, type StyleProp } from "react-native";
import type { LigueNom } from "../../types/learnflow";
import { LEAGUE_TIERS } from "../../data/mock";
import { leagueBadgeSource } from "./badgeAssets";

type Props = {
  nom: LigueNom | string;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export default function LeagueBadge({ nom, size = 56, style }: Props) {
  return (
    <Image
      source={leagueBadgeSource(nom as LigueNom)}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
      accessibilityLabel={`Badge ligue ${nom}`}
    />
  );
}

/** Badge 3D dans un cercle coloré du palier — comme le web `LeagueBadgeCircle`. */
export function LeagueBadgeCircle({
  nom,
  size = 56,
  selected = false,
  dimmed = false,
}: {
  nom: LigueNom | string;
  size?: number;
  selected?: boolean;
  dimmed?: boolean;
}) {
  const meta = LEAGUE_TIERS.find((t) => t.id === nom) ?? LEAGUE_TIERS[0];
  const frame = Math.round(size * 1.36);
  return (
    <View
      style={{
        width: frame,
        height: frame,
        borderRadius: frame / 2,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: meta.accent,
        borderWidth: selected ? 2.5 : 1,
        borderColor: selected ? meta.color : `${meta.color}55`,
        opacity: dimmed ? 0.42 : 1,
      }}
    >
      <LeagueBadge nom={nom} size={size} />
    </View>
  );
}
