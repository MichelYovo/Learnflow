import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import type { LigueNom } from "../../types/learnflow";
import { LeagueBadgeCircle } from "./LeagueBadge";

const TIER_ORDER: LigueNom[] = ["Bronze", "Argent", "Or", "Platine", "Diamant"];

type Props = {
  selected: LigueNom;
  onSelect: (tier: LigueNom) => void;
  currentTier?: LigueNom;
};

export default function LeagueTierScroller({ selected, onSelect, currentTier }: Props) {
  const currentIndex = TIER_ORDER.indexOf(currentTier ?? selected);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 12,
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
      }}
    >
      {TIER_ORDER.map((id, index) => {
        const on = selected === id;
        const locked = index > currentIndex;
        return (
          <Pressable key={id} onPress={() => onSelect(id)} accessibilityRole="button" style={{ flexShrink: 0 }}>
            <LeagueBadgeCircle nom={id} size={on ? 40 : 28} selected={on} dimmed={locked && !on} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
