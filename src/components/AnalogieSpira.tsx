import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { AnalogieSpiraData } from "../types/learnflow";
import { colors } from "../theme/colors";
import Spira from "./Spira";

type Props = {
  analogie: AnalogieSpiraData;
};

/**
 * Encadré « En d'autre terme » : Spira parle, analogie du quotidien.
 */
export default function AnalogieSpira({ analogie }: Props) {
  return (
    <View style={styles.box} accessibilityRole="summary">
      <Text style={styles.title}>{analogie.titre}</Text>

      <View style={styles.speechRow}>
        <Spira scene="course.analogy" size={72} message="" />
        <View style={styles.bubble}>
          <Text style={styles.speech}>{analogie.parole}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#EEF4FF",
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  title: { fontSize: 17, fontWeight: "800", color: colors.textDark },
  speechRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bubble: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  speech: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: colors.textDark,
  },
});
