import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import type { LeagueTierMeta } from "../../data/mock";
import { useAppTheme } from "../../theme/useAppTheme";
import { Card } from "../ui";
import { LEAGUE_BADGE_IMAGES } from "./badgeAssets";

type Props = {
  tier: LeagueTierMeta;
  title: string;
  subtitle: string;
};

/** Hero badge — met en valeur le badge 3D confectionné */
export default function LeagueBadgeHero({ tier, title, subtitle }: Props) {
  const { colors, darkMode } = useAppTheme();

  return (
    <Card
      className="p-5"
      style={{
        marginHorizontal: 16,
        marginBottom: 12,
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: darkMode ? "#1E293B" : colors.white,
      }}
    >
      <View
        style={[
          styles.glow,
          {
            backgroundColor: tier.color,
            opacity: darkMode ? 0.18 : 0.12,
          },
        ]}
      />
      <Image
        source={LEAGUE_BADGE_IMAGES[tier.badgeKey]}
        style={styles.badge}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colors.textDark }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    top: 8,
  },
  badge: {
    width: 132,
    height: 132,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
  },
});
