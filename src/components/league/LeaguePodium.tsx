import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { LeaguePlayer } from "../../data/mock";
import { useAppTheme } from "../../theme/useAppTheme";
import Avatar from "../Avatar";
import Icon from "../Icon";

type Props = {
  first: LeaguePlayer;
  second: LeaguePlayer;
  third: LeaguePlayer;
};

const PLACE = {
  1: {
    height: 108,
    size: 64,
    ring: "#F59E0B",
    glow: "rgba(245,158,11,0.38)",
    bar: ["#FDE68A", "#F59E0B", "#D97706"] as const,
    lip: "#FEF3C7",
    ink: "#78350F",
  },
  2: {
    height: 78,
    size: 52,
    ring: "#94A3B8",
    glow: "rgba(148,163,184,0.32)",
    bar: ["#F8FAFC", "#CBD5E1", "#94A3B8"] as const,
    lip: "#FFFFFF",
    ink: "#334155",
  },
  3: {
    height: 62,
    size: 52,
    ring: "#F97316",
    glow: "rgba(249,115,22,0.32)",
    bar: ["#FED7AA", "#FB923C", "#EA580C"] as const,
    lip: "#FFEDD5",
    ink: "#9A3412",
  },
} as const;

export default function LeaguePodium({ first, second, third }: Props) {
  const { colors } = useAppTheme();

  const slots: { player: LeaguePlayer; place: 1 | 2 | 3 }[] = [
    { player: second, place: 2 },
    { player: first, place: 1 },
    { player: third, place: 3 },
  ];

  return (
    <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}>
      <Text style={[styles.kicker, { color: colors.textMuted }]}>Podium de la semaine</Text>
      <View style={styles.row}>
        {slots.map(({ player, place }) => {
          const meta = PLACE[place];
          return (
            <View key={place} style={[styles.col, place === 1 ? styles.colFirst : null]}>
              <View style={styles.avatarStack}>
                {place === 1 ? (
                  <View style={styles.crown}>
                    <Icon name="crown" size={16} color="#D97706" />
                  </View>
                ) : null}
                <View
                  style={{
                    borderRadius: 999,
                    padding: place === 1 ? 3 : 2,
                    backgroundColor: meta.ring,
                    shadowColor: meta.ring,
                    shadowOpacity: 0.45,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 6,
                  }}
                >
                  <Avatar
                    avatarId={player.avatarId}
                    size={meta.size}
                    radius={meta.size / 2}
                    initials={player.initials}
                    fallbackColor={player.avatarColor}
                  />
                </View>
                <View style={[styles.placeBadge, { backgroundColor: meta.ring, borderColor: colors.white }]}>
                  <Text style={styles.placeBadgeText}>{place}</Text>
                </View>
              </View>
              <Text
                numberOfLines={1}
                style={[styles.name, { color: player.you ? colors.primary : colors.textDark }]}
              >
                {player.you ? "Toi" : player.name.split(" ")[0]}
              </Text>
              <View style={styles.xpRow}>
                <Icon name="zap" size={11} color={meta.ring} />
                <Text style={[styles.xp, { color: meta.ink }]}>{player.xp.toLocaleString("fr-FR")}</Text>
              </View>
              <LinearGradient colors={[...meta.bar]} style={[styles.bar, { height: meta.height }]}>
                <View style={[styles.lip, { backgroundColor: meta.lip }]} />
                <Text style={[styles.barHash, { color: meta.ink }]}>#{place}</Text>
              </LinearGradient>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 20,
    borderWidth: 1,
    paddingTop: 20,
    overflow: "hidden",
  },
  kicker: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 16,
  },
  row: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 8, gap: 4 },
  col: { flex: 1, alignItems: "center", minWidth: 0, paddingTop: 16 },
  colFirst: { flex: 1.2, zIndex: 1 },
  avatarStack: { alignItems: "center", marginBottom: 10, position: "relative" },
  crown: {
    position: "absolute",
    top: -14,
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F59E0B",
    shadowOpacity: 0.45,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  placeBadge: {
    position: "absolute",
    bottom: -4,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    zIndex: 2,
  },
  placeBadgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "900" },
  name: { fontSize: 13, fontWeight: "800", maxWidth: "100%", paddingHorizontal: 4 },
  xpRow: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 8, marginTop: 2 },
  xp: { fontSize: 11, fontWeight: "800" },
  bar: {
    width: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 12,
  },
  lip: {
    position: "absolute",
    top: 6,
    width: "42%",
    height: 6,
    borderRadius: 99,
    opacity: 0.85,
  },
  barHash: { fontSize: 22, fontWeight: "900" },
});
