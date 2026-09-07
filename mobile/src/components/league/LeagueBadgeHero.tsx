import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { LeagueTierMeta } from "../../data/mock";
import { useAppTheme } from "../../theme/useAppTheme";
import { LeagueBadgeCircle } from "./LeagueBadge";

type Props = {
  tier: LeagueTierMeta;
  title: string;
  subtitle: string;
  subtitleColor?: string;
  rank?: number | null;
  dimmed?: boolean;
};

export default function LeagueBadgeHero({ tier, title, subtitle, subtitleColor, rank, dimmed }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.white }]}>
      <View style={styles.badgeWrap}>
        <LeagueBadgeCircle nom={tier.id} size={108} selected dimmed={dimmed} />
        {rank != null ? (
          <View style={[styles.rankPill, { backgroundColor: tier.color, borderColor: colors.white }]}>
            <Text style={styles.rankText}>#{rank}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.title, { color: colors.textDark }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: subtitleColor ?? colors.textMuted }]}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
    overflow: "hidden",
  },
  badgeWrap: {
    position: "relative",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 4,
  },
  rankPill: {
    position: "absolute",
    bottom: 4,
    alignSelf: "center",
    minWidth: 44,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 3,
    zIndex: 2,
  },
  rankText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900", textAlign: "center" },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
});
