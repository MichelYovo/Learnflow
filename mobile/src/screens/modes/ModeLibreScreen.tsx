import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { chapterHas3dImage } from "../../data/schemas3d";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ModeLibre">;

export default function ModeLibreScreen({ navigation, route }: Props) {
  const tools = useLearnFlowStore((s) => s.customTools);
  const chapterId = route.params?.chapterId ?? "circulation";
  const open = tools.length === 0;
  const showFiche = open || tools.includes("fiche");
  const showFlash = open || tools.includes("flashcards");
  const show2d = chapterId === "digest";
  const show3d = chapterHas3dImage(chapterId) || chapterId === "cell";
  const showSchema = (show2d || show3d) && (open || tools.includes("schema"));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Mode Libre</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("SessionCustomize", { mode: "Libre", chapterId })}
          style={styles.gear}
        >
          <Icon name="settings" size={16} color={colors.textDark} />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body}>
        <View style={styles.mascot}>
          <Spira scene="mode.libre" size={96} message="" />
        </View>

        {showFiche ? (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("Course", { chapterId, mode: "Libre" })}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.mathsBg }]}>
              <Icon name="book" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Fiche de cours</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}

        {showFlash ? (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("Flashcards", { mode: "Libre", chapterId })}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.hgBg }]}>
              <Icon name="layers" size={22} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Flashcards</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}

        {showSchema ? (
          <>
            {show2d ? (
              <Pressable style={styles.card} onPress={() => navigation.navigate("Schema2D", { chapterId })}>
                <View style={[styles.iconBox, { backgroundColor: colors.svtBg }]}>
                  <Icon name="grid" size={22} color={colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Schémas 2D</Text>
                </View>
                <Icon name="chevron-right" size={16} color={colors.textMuted} />
              </Pressable>
            ) : null}
            {show3d ? (
              <Pressable style={styles.card} onPress={() => navigation.navigate("Schema3D", { chapterId })}>
                <View style={[styles.iconBox, { backgroundColor: colors.svtBg }]}>
                  <Icon name="atom" size={22} color={colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Modèles 3D</Text>
                </View>
                <Icon name="chevron-right" size={16} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </>
        ) : null}

        {tools.includes("qcm") ? (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("AssimilationQuiz", { chapterId })}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.mathsBg }]}>
              <Icon name="quiz" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>QCM</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}

        {tools.includes("trous") ? (
          <Pressable style={styles.card} onPress={() => navigation.navigate("FillBlanks", { chapterId })}>
            <View style={[styles.iconBox, { backgroundColor: colors.frBg }]}>
              <Icon name="pen" size={22} color={colors.violet} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Textes à trous</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </Pressable>
        ) : null}
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
  body: { flexGrow: 1, justifyContent: "center", padding: 20, gap: 14, paddingBottom: 32 },
  mascot: { alignItems: "center", paddingVertical: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
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
