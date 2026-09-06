import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import type { LigueNom } from "../../types/learnflow";
import { LEAGUE_TIERS, type LeagueTierMeta } from "../../data/mock";
import { useAppTheme } from "../../theme/useAppTheme";
import { LEAGUE_BADGE_IMAGES } from "./badgeAssets";

type Props = {
  selected: LigueNom;
  onSelect: (tier: LigueNom) => void;
  /** Palier actuel de l'élève — badge pleinement opaque */
  currentTier?: LigueNom;
};

export default function LeagueTierScroller({ selected, onSelect, currentTier }: Props) {
  const { colors, darkMode } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingVertical: 6 }}
    >
      {LEAGUE_TIERS.map((tier) => (
        <TierChip
          key={tier.id}
          tier={tier}
          active={selected === tier.id}
          isCurrent={currentTier === tier.id}
          darkMode={darkMode}
          colors={colors}
          onPress={() => onSelect(tier.id)}
        />
      ))}
    </ScrollView>
  );
}

function TierChip({
  tier,
  active,
  isCurrent,
  darkMode,
  colors,
  onPress,
}: {
  tier: LeagueTierMeta;
  active: boolean;
  isCurrent: boolean;
  darkMode: boolean;
  colors: ReturnType<typeof useAppTheme>["colors"];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={{
        width: 104,
        minHeight: 118,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingTop: 10,
        paddingBottom: 12,
        borderRadius: 22,
        borderWidth: active ? 2 : 1,
        borderColor: active ? tier.color : colors.border,
        backgroundColor: active
          ? darkMode
            ? "#1E293B"
            : tier.accent
          : darkMode
            ? "#0F172A"
            : colors.white,
        shadowColor: tier.color,
        shadowOpacity: active ? 0.25 : 0,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: active ? 4 : 0,
      }}
    >
      <Image
        source={LEAGUE_BADGE_IMAGES[tier.badgeKey]}
        style={{
          width: 72,
          height: 72,
          opacity: active || isCurrent ? 1 : 0.42,
          transform: [{ scale: active ? 1.05 : 1 }],
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontSize: 12,
          fontWeight: active ? "800" : "600",
          color: active ? (darkMode ? "#F8FAFC" : colors.textDark) : colors.textMuted,
        }}
      >
        {tier.label}
      </Text>
      {isCurrent ? (
        <Text style={{ fontSize: 9, fontWeight: "800", color: tier.color, letterSpacing: 0.4 }}>
          ACTUEL
        </Text>
      ) : (
        <View style={{ height: 12 }} />
      )}
    </Pressable>
  );
}
