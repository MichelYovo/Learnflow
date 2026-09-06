import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { LeaguePlayer } from "../../data/mock";
import { useAppTheme } from "../../theme/useAppTheme";
import Avatar from "../Avatar";

type Props = {
  player: LeaguePlayer;
  onPress?: () => void;
};

export default function LeagueLeaderboardRow({ player, onPress }: Props) {
  const { colors, darkMode } = useAppTheme();
  const highlight = player.you;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minHeight: 64,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 20,
        borderWidth: highlight ? 1.5 : 1,
        borderColor: highlight ? colors.primary : colors.border,
        backgroundColor: highlight
          ? darkMode
            ? "#0C1A33"
            : "#E6F4FF"
          : colors.white,
      }}
    >
      <Text
        style={{
          width: 28,
          fontSize: 15,
          fontWeight: "800",
          color: highlight ? colors.primary : colors.textMuted,
          textAlign: "center",
        }}
      >
        {player.rank}
      </Text>
      <Avatar
        avatarId={player.avatarId}
        size={44}
        radius={22}
        initials={player.initials}
        fallbackColor={player.avatarColor}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: "700", color: colors.textDark }}>
          {player.you ? `${player.name} (toi)` : player.name}
        </Text>
        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
          série {player.streak} j
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, minHeight: 44, paddingLeft: 4 }}>
        <Ionicons name="flash" size={14} color={colors.accent} />
        <Text style={{ fontSize: 14, fontWeight: "800", color: colors.textDark }}>
          {player.xp.toLocaleString("fr-FR")}
        </Text>
      </View>
    </Pressable>
  );
}
