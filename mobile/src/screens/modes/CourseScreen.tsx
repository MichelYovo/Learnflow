import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AnalogieSpira from "../../components/AnalogieSpira";
import CourseDetailBlocks from "../../components/course/CourseDetailBlocks";
import Icon from "../../components/Icon";
import InteractiveLessonText from "../../components/InteractiveLessonText";
import { ficheForChapter } from "../../data/fiches";
import { normalizeKeyword, toDetailBlocks, toLessonContent } from "../../data/lessonContent";
import { usePublishedCatalog } from "../../data/publishedCache";
import { chapterHas3dImage } from "../../data/schemas3d";
import { useAppTheme } from "../../theme/useAppTheme";
import { appFont } from "../../theme/typography";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import type { SchemaCoursKind } from "../../types/learnflow";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Course">;
type ActiveTab = "essentiel" | "details";

export default function CourseScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const markChapterPart = useLearnFlowStore((s) => s.markChapterPart);
  const classe = useLearnFlowStore((s) => s.getActiveProfile()?.classe);
  const chapterId = route.params?.chapterId ?? "eq2";
  const catalogEpoch = usePublishedCatalog();
  const fiche = useMemo(() => ficheForChapter(chapterId, classe), [chapterId, classe, catalogEpoch]);
  const lesson = useMemo(() => toLessonContent(fiche), [fiche]);
  const detailBlocks = useMemo(() => toDetailBlocks(fiche), [fiche]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("essentiel");
  const [masked, setMasked] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const show2d = fiche.schema === "2d" || fiche.schema === "both";
  const show3d = fiche.schema === "3d" || fiche.schema === "both" || chapterHas3dImage(chapterId);

  useEffect(() => {
    void import("../../lib/cloud").then((m) => m.trackActivity("chapter_open", { chapterId }));
    markChapterPart(chapterId, "essential");
  }, [chapterId, markChapterPart]);

  const reveal = (word: string) => {
    setRevealed((prev) => new Set(prev).add(normalizeKeyword(word)));
  };

  const selectTab = (next: ActiveTab) => {
    setActiveTab(next);
    if (next === "details") {
      setMasked(false);
      setRevealed(new Set());
      markChapterPart(chapterId, "details");
    } else {
      markChapterPart(chapterId, "essential");
    }
  };

  const analogieBox = fiche.analogie ? <AnalogieSpira analogie={fiche.analogie} /> : null;

  const openSchema = (kind: SchemaCoursKind) => {
    if (kind === "3d") navigation.navigate("Schema3D", { chapterId });
    else navigation.navigate("Schema2D", { chapterId });
  };

  const tabStyle = (tab: ActiveTab) => {
    const on = activeTab === tab;
    return {
      backgroundColor: on ? colors.mathsBg : colors.surfaceAlt,
      borderColor: on ? colors.primary : colors.border,
    };
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => navigation.goBack()} style={[styles.back, { backgroundColor: colors.surfaceAlt }]} accessibilityLabel="Retour">
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.textDark }]} numberOfLines={1}>
            {lesson.title}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.speedRow}>
          <Pressable onPress={() => selectTab("essentiel")} style={[styles.speed, tabStyle("essentiel")]}>
            <Text style={[styles.speedLabel, { color: activeTab === "essentiel" ? colors.primary : colors.textMuted }]}>
              L'Essentiel
            </Text>
            <Text style={[styles.speedHint, { color: activeTab === "essentiel" ? colors.primary : colors.textMuted }]}>
              Fiche réflexe · ~5 min
            </Text>
          </Pressable>
          <Pressable onPress={() => selectTab("details")} style={[styles.speed, tabStyle("details")]}>
            <Text style={[styles.speedLabel, { color: activeTab === "details" ? colors.primary : colors.textMuted }]}>
              En Détails
            </Text>
            <Text style={[styles.speedHint, { color: activeTab === "details" ? colors.primary : colors.textMuted }]}>
              Cours APC complet
            </Text>
          </Pressable>
        </View>

        {activeTab === "essentiel" ? (
          <>
            <Pressable
              onPress={() => {
                setMasked((v) => !v);
                setRevealed(new Set());
              }}
              style={[
                styles.maskToggle,
                { backgroundColor: colors.white, borderColor: colors.border },
                masked && { backgroundColor: colors.hgBg, borderColor: colors.hgBorder },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: masked }}
            >
              <Icon name={masked ? "eye-off" : "eye"} size={16} color={masked ? colors.accent : colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.maskTitle, { color: colors.textDark }]}>Texte masqué</Text>
                <Text style={[styles.maskSub, { color: colors.textMuted }]}>
                  {masked ? "Appuie sur un mot pour le révéler." : "Cache les mots-clés, révèle-les au tap."}
                </Text>
              </View>
              <View style={[styles.maskBadge, { backgroundColor: masked ? colors.accent : colors.surfaceAlt }]}>
                <Text style={[styles.maskBadgeText, { color: masked ? "#FFFFFF" : colors.textMuted }]}>
                  {masked ? "ON" : "OFF"}
                </Text>
              </View>
            </Pressable>

            <View style={[styles.card, { backgroundColor: colors.white }]}>
              <InteractiveLessonText
                text={lesson.essentialText}
                masked={masked}
                revealed={revealed}
                onReveal={reveal}
                textColor={colors.textDark}
              />
            </View>
            {analogieBox}
          </>
        ) : (
          <CourseDetailBlocks blocks={detailBlocks} />
        )}

        {show2d || show3d ? (
          <View style={[styles.schemaBox, { backgroundColor: colors.svtBg }]}>
            <View style={styles.schemaRow}>
              {show2d ? (
                <Pressable style={[styles.schemaBtn, { backgroundColor: colors.white }]} onPress={() => openSchema("2d")}>
                  <Icon name="grid" size={18} color={colors.secondary} />
                  <Text style={[styles.schemaBtnText, { color: colors.textDark }]}>Schéma 2D</Text>
                </Pressable>
              ) : null}
              {show3d ? (
                <Pressable style={[styles.schemaBtn, { backgroundColor: colors.white }]} onPress={() => openSchema("3d")}>
                  <Icon name="atom" size={18} color={colors.cyan} />
                  <Text style={[styles.schemaBtnText, { color: colors.textDark }]}>Modèle 3D</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ) : null}

        <Pressable
          style={[styles.primary, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("AssimilationQuiz", { chapterId })}
        >
          <Text style={styles.primaryText}>Passer le quizz d'assimilation</Text>
        </Pressable>
        <Pressable
          style={[styles.challengeBtn, { backgroundColor: colors.white, borderColor: colors.border }]}
          onPress={() => navigation.navigate("Blitz")}
        >
          <Text style={[styles.challengeBtnText, { color: colors.textDark }]}>Défi Blitz duo · plus d’XP</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontFamily: appFont, fontWeight: "800", fontSize: 18 },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  speedRow: { flexDirection: "row", gap: 10 },
  speed: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    gap: 2,
  },
  speedLabel: { fontFamily: appFont, fontSize: 16, fontWeight: "800", textAlign: "center" },
  speedHint: { fontFamily: appFont, fontSize: 11, fontWeight: "600", textAlign: "center" },
  maskToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  maskTitle: { fontFamily: appFont, fontSize: 15, fontWeight: "800" },
  maskSub: { fontFamily: appFont, fontSize: 12, fontWeight: "500", marginTop: 2 },
  maskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  maskBadgeText: { fontFamily: appFont, fontSize: 11, fontWeight: "800" },
  card: { borderRadius: 24, paddingHorizontal: 20, paddingVertical: 22 },
  schemaBox: { borderRadius: 24, padding: 16 },
  schemaRow: { flexDirection: "row", gap: 8 },
  schemaBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    paddingVertical: 16,
  },
  schemaBtnText: { fontFamily: appFont, fontWeight: "800", fontSize: 15 },
  primary: { borderRadius: 18, paddingVertical: 18, alignItems: "center" },
  primaryText: { fontFamily: appFont, color: "#FFFFFF", fontWeight: "800", fontSize: 17 },
  challengeBtn: { borderRadius: 18, paddingVertical: 14, alignItems: "center", borderWidth: 2 },
  challengeBtnText: { fontFamily: appFont, fontWeight: "800", fontSize: 14 },
});
