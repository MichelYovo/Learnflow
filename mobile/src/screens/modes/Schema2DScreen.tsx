import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { DIGEST_HOTSPOTS } from "../../data/modeContent";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Schema2D">;

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Schema2DScreen({ navigation }: Props) {
  const [labels] = useState(() => shuffle(DIGEST_HOTSPOTS.map((h) => h.label)));
  const [box, setBox] = useState({ w: 1, h: 1 });
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const used = new Set(Object.values(pairs));
  const allPlaced = Object.keys(pairs).length === DIGEST_HOTSPOTS.length;
  const score = DIGEST_HOTSPOTS.filter((h) => pairs[h.id] === h.label).length;

  const assign = (label: string) => {
    if (!selectedSpot || checked) return;
    setPairs((p) => ({ ...p, [selectedSpot]: label }));
    setSelectedSpot(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Schéma 2D</Text>
        </View>
        <Spira scene="schema" size={48} message="" />
      </View>

      <View
        style={styles.canvas}
        onLayout={(e) => setBox({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        <View style={styles.tube} />
        {DIGEST_HOTSPOTS.map((h) => {
          const placed = pairs[h.id];
          const ok = checked && placed === h.label;
          const ko = checked && placed && placed !== h.label;
          return (
            <Pressable
              key={h.id}
              onPress={() => !checked && setSelectedSpot(h.id)}
              style={[
                styles.hotspot,
                { left: (h.x / 100) * box.w, top: (h.y / 100) * box.h },
                selectedSpot === h.id && styles.hotspotOn,
                ok && styles.hotspotOk,
                ko && styles.hotspotKo,
              ]}
            >
              <Text style={styles.hotspotText}>{placed ?? "?"}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.chips}>
        {labels.map((label) => {
          const taken = used.has(label);
          return (
            <Pressable
              key={label}
              disabled={taken || !selectedSpot || checked}
              onPress={() => assign(label)}
              style={[styles.chip, taken && styles.chipUsed]}
            >
              <Text style={[styles.chipText, taken && styles.chipTextUsed]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      {checked ? (
        <View style={styles.footer}>
          <Text style={styles.score}>
            {score}/{DIGEST_HOTSPOTS.length} associations justes
          </Text>
          <Pressable
            style={styles.primary}
            onPress={() => {
              setPairs({});
              setChecked(false);
              setSelectedSpot(null);
            }}
          >
            <Text style={styles.primaryText}>Réessayer</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[styles.primary, !allPlaced && { opacity: 0.45 }]}
          disabled={!allPlaced}
          onPress={() => setChecked(true)}
        >
          <Text style={styles.primaryText}>Valider le schéma</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontWeight: "800", fontSize: 18, color: colors.textDark },
  sub: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  canvas: {
    marginHorizontal: 20,
    height: 320,
    backgroundColor: colors.svtBg,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.svtBorder,
    overflow: "hidden",
  },
  tube: {
    position: "absolute",
    left: "48%",
    top: 28,
    width: 10,
    height: 250,
    borderRadius: 8,
    backgroundColor: "#6EE7B7",
  },
  hotspot: {
    position: "absolute",
    transform: [{ translateX: -42 }, { translateY: -16 }],
    minWidth: 84,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.svtBorder,
    alignItems: "center",
  },
  hotspotOn: { borderColor: colors.primary, backgroundColor: colors.mathsBg },
  hotspotOk: { borderColor: colors.secondary, backgroundColor: colors.svtBg },
  hotspotKo: { borderColor: colors.danger, backgroundColor: colors.angBg },
  hotspotText: { fontSize: 11, fontWeight: "800", color: colors.textDark },
  hint: { paddingHorizontal: 20, paddingTop: 10, fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 16 },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipUsed: { opacity: 0.35 },
  chipText: { fontWeight: "800", color: colors.textDark, fontSize: 12 },
  chipTextUsed: { color: colors.textMuted },
  footer: { paddingHorizontal: 20, gap: 10 },
  score: { textAlign: "center", fontWeight: "800", color: colors.secondary },
  primary: {
    marginHorizontal: 20,
    marginTop: 4,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryText: { color: colors.white, fontWeight: "800" },
});
