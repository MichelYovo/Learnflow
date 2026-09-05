import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { crammingChaptersForClass } from "../../data/programme";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ModeCramming">;

export default function ModeCrammingScreen({ navigation, route }: Props) {
  const classe = useLearnFlowStore((s) => s.getActiveProfile()?.classe);
  const chapters = useMemo(() => crammingChaptersForClass(classe), [classe]);
  const initial = route.params?.chapterId ?? chapters[0]?.id ?? "digest";
  const [chapterId, setChapterId] = useState(
    chapters.some((c) => c.id === initial) ? initial : chapters[0]?.id ?? "digest"
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Cramming</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("SessionCustomize", { mode: "Cramming", chapterId })}
          style={styles.gear}
        >
          <Icon name="settings" size={16} color={colors.textDark} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.mascot}>
          <Spira scene="mode.cramming" size={96} message="" />
        </View>

        <Text style={styles.label}>Chapitre</Text>
        <View style={styles.row}>
          {chapters.map((c) => {
            const on = c.id === chapterId;
            return (
              <Pressable
                key={c.id}
                onPress={() => setChapterId(c.id)}
                style={[styles.chip, on && { borderColor: c.color, backgroundColor: c.bg }]}
              >
                <Text style={[styles.chipText, on && { color: c.color }]}>
                  {c.subject} · {c.title}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={[styles.tool, { borderColor: colors.hgBorder }]}
          onPress={() => navigation.navigate("AssimilationQuiz", { chapterId, loopErrors: true })}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.hgBg }]}>
            <Icon name="quiz" size={22} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Quizz d'assimilation</Text>
          </View>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </Pressable>

        <Pressable
          style={[styles.tool, { borderColor: colors.frBorder }]}
          onPress={() => navigation.navigate("FillBlanks", { chapterId })}
        >
          <View style={[styles.iconBox, { backgroundColor: colors.frBg }]}>
            <Icon name="pen" size={22} color={colors.violet} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Textes à trous</Text>
          </View>
          <Icon name="chevron-right" size={16} color={colors.textMuted} />
        </Pressable>
      </ScrollView>
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
  gear: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontWeight: "800", fontSize: 22, color: colors.textDark },
  body: { padding: 24, gap: 16, paddingBottom: 40 },
  mascot: { alignItems: "center", paddingVertical: 12 },
  label: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textDark,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  chipText: { fontWeight: "700", fontSize: 14, color: colors.textMuted },
  tool: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    minHeight: 72,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontWeight: "800", color: colors.textDark, fontSize: 17 },
});
