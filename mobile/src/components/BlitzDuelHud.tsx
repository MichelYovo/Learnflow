import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "./Icon";

export type DuelHudFighter = {
  name: string;
  score: number;
  answered: number;
  you?: boolean;
  waiting?: boolean;
  done?: boolean;
};

function Slot({ fighter, align }: { fighter: DuelHudFighter; align: "left" | "right" }) {
  const waiting = Boolean(fighter.waiting) || !fighter.name;
  return (
    <View
      style={[
        styles.slot,
        align === "right" ? styles.right : styles.left,
        fighter.you ? styles.you : waiting ? styles.wait : styles.rival,
      ]}
    >
      <Text style={styles.kicker}>{fighter.you ? "TOI" : waiting ? "SLOT 2" : "RIVAL"}</Text>
      <Text style={[styles.name, waiting && styles.muted]} numberOfLines={1}>
        {waiting ? "En attente…" : fighter.name}
      </Text>
      <Text style={styles.score}>
        {waiting ? "—" : `${fighter.score}`}
        {!waiting ? (
          <Text style={styles.meta}>{` pts · Q${fighter.answered + (fighter.done ? 0 : 1)}`}</Text>
        ) : null}
      </Text>
    </View>
  );
}

export default function BlitzDuelHud({
  me,
  rival,
  code,
}: {
  me: DuelHudFighter;
  rival?: DuelHudFighter | null;
  code?: string;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Slot fighter={{ ...me, you: true }} align="left" />
        <View style={styles.mid}>
          <Text style={styles.vs}>VS</Text>
          <Icon name="people" size={14} color="rgba(253,230,138,0.7)" />
        </View>
        <Slot fighter={rival ?? { name: "", score: 0, answered: 0, waiting: true }} align="right" />
      </View>
      {code ? <Text style={styles.code}>{code}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", paddingHorizontal: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  mid: { alignItems: "center", gap: 4, paddingHorizontal: 2 },
  vs: {
    color: "#FBBF24",
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 1.6,
    backgroundColor: "rgba(0,0,0,0.5)",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  slot: { flex: 1, minWidth: 0, borderRadius: 16, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  left: { alignItems: "flex-start" },
  right: { alignItems: "flex-end" },
  you: { backgroundColor: "rgba(245,158,11,0.16)", borderColor: "rgba(251,191,36,0.65)" },
  rival: { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(248,113,113,0.4)" },
  wait: { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.12)" },
  kicker: { color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "900", letterSpacing: 1.4 },
  name: { color: "#fff", fontWeight: "900", fontSize: 13 },
  muted: { color: "rgba(255,255,255,0.4)" },
  score: { color: "#FDE68A", fontWeight: "900", fontSize: 16, marginTop: 2 },
  meta: { color: "rgba(255,255,255,0.45)", fontWeight: "700", fontSize: 11 },
  code: { marginTop: 8, textAlign: "center", color: "rgba(253,230,138,0.7)", fontWeight: "900", letterSpacing: 2, fontSize: 11 },
});
