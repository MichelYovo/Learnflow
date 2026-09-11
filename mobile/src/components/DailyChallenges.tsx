import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CHALLENGES, withDay, type ChallengeId } from "../engine/rewards";
import { useLearnFlowStore } from "../store/useLearnFlowStore";
import { useAppTheme } from "../theme/useAppTheme";

export default function DailyChallenges({
  onOpen,
}: {
  onOpen: (id: ChallengeId) => void;
}) {
  const { colors } = useAppTheme();
  const rewards = useLearnFlowStore((s) => withDay(s.rewards));
  const ease = useLearnFlowStore((s) => s.hasEaseBoost());
  const open = CHALLENGES.filter((c) => !rewards.completed.includes(c.id));

  return (
    <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.textDark }]}>Défis du jour</Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>
        {ease
          ? "Boost actif : les prochaines questions sont plus faciles."
          : "Réussis un défi : plus d’XP et des questions plus faciles."}
      </Text>
      {open.length === 0 ? (
        <Text style={[styles.done, { color: colors.secondary }]}>Tous les défis du jour sont faits.</Text>
      ) : (
        open.slice(0, 3).map((c) => {
          const progress = rewards.progress[c.id] ?? 0;
          return (
            <Pressable
              key={c.id}
              onPress={() => onOpen(c.id)}
              style={[styles.row, { backgroundColor: colors.surfaceAlt }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.textDark }]}>{c.title}</Text>
                <Text style={[styles.rowBody, { color: colors.textMuted }]}>
                  +{c.xp} XP · {progress}/{c.target}
                </Text>
              </View>
              <Text style={[styles.cta, { color: colors.primary }]}>Go</Text>
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 2, borderRadius: 22, padding: 16, gap: 8 },
  title: { fontSize: 16, fontWeight: "800" },
  sub: { fontSize: 12, fontWeight: "600", lineHeight: 17 },
  done: { fontSize: 13, fontWeight: "800", marginTop: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  rowTitle: { fontSize: 14, fontWeight: "800" },
  rowBody: { fontSize: 11, fontWeight: "600", marginTop: 2 },
  cta: { fontSize: 13, fontWeight: "800" },
});
