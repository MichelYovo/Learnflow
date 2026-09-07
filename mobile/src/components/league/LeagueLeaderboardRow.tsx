import React from "react";
import { Pressable, Text, View } from "react-native";
import type { LeaguePlayer } from "../../data/mock";
import { useAppTheme } from "../../theme/useAppTheme";
import Avatar from "../Avatar";
import Icon from "../Icon";

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
        backgroundColor: highlight ? (darkMode ? "#0C1A33" : "#E6F4FF") : colors.white,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: highlight ? colors.primary : colors.surfaceAlt,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "800", color: highlight ? "#FFFFFF" : colors.textMuted }}>
          {player.rank}
        </Text>
      </View>
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
        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>série {player.streak} j</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Icon name="zap" size={14} color={colors.accent} />
        <Text style={{ fontSize: 14, fontWeight: "800", color: colors.textDark }}>
          {player.xp.toLocaleString("fr-FR")}
        </Text>
      </View>
    </Pressable>
  );
}
