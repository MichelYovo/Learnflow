import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { spiraMoodForSession } from "../../data/spira";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { chapterHasSchema } from "../../data/programme";
import { MODE_DEFAULT_TOOLS } from "../../types/modes";
import type { OutilRevisionId } from "../../types/learnflow";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "SessionCustomize">;

const TOOLS: { id: OutilRevisionId; label: string; icon: string; hint?: string }[] = [
  { id: "fiche", label: "Fiche cours", icon: "book" },
  { id: "flashcards", label: "Flashcards", icon: "layers" },
  { id: "qcm", label: "QCM", icon: "quiz" },
  { id: "schema", label: "Schéma 2D/3D", icon: "grid", hint: "SVT uniquement" },
  { id: "vraiFaux", label: "Vrai / Faux", icon: "check-circle" },
  { id: "trous", label: "Textes à trous", icon: "pen" },
];

export default function SessionCustomizeScreen({ navigation, route }: Props) {
  const mode = route.params.mode;
  const chapterId = route.params.chapterId;
  const setCustomTools = useLearnFlowStore((s) => s.setCustomTools);
  const modeKey = mode === "Libre" ? "libre" : mode === "Guide" ? "guide" : "cramming";
  const allowSchema = mode === "Libre" && Boolean(chapterId && chapterHasSchema(chapterId));
  const visibleTools = TOOLS.filter((t) => t.id !== "schema" || allowSchema);
  const [selected, setSelected] = useState<OutilRevisionId[]>(() => {
    const base = MODE_DEFAULT_TOOLS[modeKey];
    return allowSchema ? base : base.filter((id) => id !== "schema");
  });

  const toggle = (id: OutilRevisionId) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const start = () => {
    setCustomTools(selected);
    if (mode === "Libre") navigation.replace("ModeLibre", { chapterId: chapterId ?? "eq2" });
    else if (mode === "Guide") navigation.replace("ModeGuide");
    else navigation.replace("ModeCramming", { chapterId: chapterId ?? "digest" });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Personnaliser</Text>
        </View>
        <Spira mood={spiraMoodForSession(mode)} size={48} message="" />
      </View>

      <View style={styles.stage}>
      <View style={styles.grid}>
        {visibleTools.map((t) => {
          const on = selected.includes(t.id);
          return (
            <Pressable
              key={t.id}
              onPress={() => toggle(t.id)}
              style={[styles.tool, on && { borderColor: colors.primary, backgroundColor: colors.mathsBg }]}
            >
              <Icon name={t.icon} size={20} color={on ? colors.primary : colors.textMuted} />
              <Text style={[styles.toolLabel, on && { color: colors.primary }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
      </View>

      <Pressable style={styles.primary} onPress={start}>
        <Text style={[styles.primaryText]}>Lancer</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface, padding: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  back: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  title: { fontWeight: "800", fontSize: 22, color: colors.textDark },
  stage: { flex: 1, justifyContent: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tool: {
    width: "48%",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    gap: 10,
    minHeight: 96,
  },
  toolLabel: { fontWeight: "800", color: colors.textDark, fontSize: 15 },
  primary: { marginTop: "auto", backgroundColor: colors.primary, borderRadius: 18, paddingVertical: 18, alignItems: "center" },
  primaryText: { color: colors.white, fontWeight: "800", fontSize: 17 },
});
