import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function QuizTabScreen() {
  const nav = useNavigation<Nav>();
  const canAccess = useLearnFlowStore((s) => s.canAccessGrandQuizz);
  const chapterProgress = useLearnFlowStore((s) => s.chapterProgress);
  const unlocked = canAccess("eq2");
  const lockedUntil = chapterProgress.eq2?.grandQuizzLockedUntil;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => nav.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <Text style={styles.title}>Quiz</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable style={[styles.card, { borderColor: colors.mathsBorder }]} onPress={() => nav.navigate("AssimilationQuiz", { chapterId: "eq2" })}>
          <View style={[styles.icon, { backgroundColor: colors.mathsBg }]}>
            <Icon name="target" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Quizz d'assimilation</Text>
          </View>
          <Icon name="chevron-right" size={18} color={colors.primary} />
        </Pressable>

        <Pressable
          style={[styles.card, { borderColor: unlocked ? colors.svtBorder : colors.borderStrong, opacity: unlocked ? 1 : 0.7 }]}
          onPress={() => {
            if (unlocked) nav.navigate("GrandQuizz", { chapterId: "eq2" });
            else nav.navigate("AssimilationQuiz", { chapterId: "eq2" });
          }}
        >
          <View style={[styles.icon, { backgroundColor: unlocked ? colors.svtBg : colors.surfaceAlt }]}>
            <Icon name={unlocked ? "zap" : "lock"} size={22} color={unlocked ? colors.secondary : colors.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Grand Quizz</Text>
            {unlocked ? null : (
              <Text style={styles.muted}>
                {lockedUntil && new Date(lockedUntil) > new Date() ? "Repos 1 h" : "10/10 requis"}
              </Text>
            )}
          </View>
        </Pressable>

        <Pressable style={[styles.card, { borderColor: colors.hgBorder }]} onPress={() => nav.navigate("Flashcards", {})}>
          <View style={[styles.icon, { backgroundColor: colors.hgBg }]}>
            <Icon name="layers" size={22} color={colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Flashcards</Text>
          </View>
        </Pressable>

        <Pressable style={[styles.card, { borderColor: colors.angBorder }]} onPress={() => nav.navigate("Blitz")}>
          <View style={[styles.icon, { backgroundColor: colors.angBg }]}>
            <Icon name="timer" size={22} color={colors.danger} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Blitz 60s</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  back: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "800", color: colors.textDark },
  scroll: { padding: 24, gap: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    minHeight: 76,
  },
  icon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 17, fontWeight: "800", color: colors.textDark },
  muted: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
});
