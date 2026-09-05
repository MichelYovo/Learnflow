import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { LeaguePlayer } from "../../data/mock";
import { useAppTheme } from "../../theme/useAppTheme";
import { Card } from "../ui";
import Avatar from "../Avatar";

type Props = {
  first: LeaguePlayer;
  second: LeaguePlayer;
  third: LeaguePlayer;
};

const PLACE = {
  1: { height: 132, gradient: ["#FDE68A", "#F59E0B"] as const, size: 64 },
  2: { height: 96, gradient: ["#E2E8F0", "#94A3B8"] as const, size: 52 },
  3: { height: 80, gradient: ["#FED7AA", "#F97316"] as const, size: 52 },
};

export default function LeaguePodium({ first, second, third }: Props) {
  const { colors, darkMode } = useAppTheme();

  const slots: { player: LeaguePlayer; place: 1 | 2 | 3 }[] = [
    { player: second, place: 2 },
    { player: first, place: 1 },
    { player: third, place: 3 },
  ];

  return (
    <Card className="p-5" style={{ marginHorizontal: 16, marginTop: 8 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: "800",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: colors.textMuted,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        Podium de la semaine
      </Text>
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 8 }}>
        {slots.map(({ player, place }) => {
          const meta = PLACE[place];
          return (
            <View key={place} style={{ flex: 1, alignItems: "center", gap: 8 }}>
              {place === 1 ? (
                <Ionicons name="ribbon" size={22} color="#F59E0B" />
              ) : (
                <View style={{ height: 22 }} />
              )}
              <View
                style={{
                  borderWidth: place === 1 ? 3 : 2,
                  borderColor: place === 1 ? "#FBBF24" : darkMode ? colors.border : "#FFFFFF",
                  borderRadius: meta.size / 2 + 3,
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
              <Text
                numberOfLines={1}
                style={{ fontSize: 13, fontWeight: "800", color: colors.textDark, maxWidth: "100%" }}
              >
                {player.you ? "Toi" : player.name.split(" ")[0]}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Ionicons name="flash" size={12} color={colors.primary} />
                <Text style={{ fontSize: 12, fontWeight: "800", color: colors.primary }}>
                  {player.xp.toLocaleString("fr-FR")}
                </Text>
              </View>
              <LinearGradient
                colors={[...meta.gradient]}
                style={{
                  width: "100%",
                  height: meta.height,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingBottom: 12,
                }}
              >
                <Text style={{ fontWeight: "900", fontSize: 18, color: "#0F172A" }}>#{place}</Text>
              </LinearGradient>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
