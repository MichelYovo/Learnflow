import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CLASS_GROUPS } from "../data/classes";
import type { ClasseAPC } from "../types/learnflow";
import { useAppTheme } from "../theme/useAppTheme";

export default function ClassPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: ClasseAPC) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.wrap}>
      {CLASS_GROUPS.map((group) => (
        <View key={group.id} style={styles.group}>
          <Text style={[styles.groupLabel, { color: colors.textMuted }]}>{group.label.toUpperCase()}</Text>
          <View style={styles.grid}>
            {group.classes.map((c) => {
              const on = value === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => onChange(c.id)}
                  style={[
                    styles.chip,
                    { backgroundColor: colors.white, borderColor: colors.border },
                    on && { borderColor: colors.primary, backgroundColor: colors.mathsBg },
                  ]}
                >
                  <Text style={[styles.chipText, { color: colors.textMuted }, on && { color: colors.primary }]}>
                    {c.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  group: { gap: 8 },
  groupLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipText: { fontSize: 13, fontWeight: "800" },
});
