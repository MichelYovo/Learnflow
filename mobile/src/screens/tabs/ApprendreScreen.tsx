import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import SubjectLogo from "../../components/SubjectLogo";
import { CoursesSkeleton } from "../../components/ui";
import { usePublishedCatalog } from "../../data/publishedCache";
import { programmeForLearner } from "../../data/programme";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type {
  ProgrammeChapter,
  ProgrammeSubject,
  ProgrammeTheme,
} from "../../types/learnflow";
import type { MainTabParamList, RootStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type CoursRoute = BottomTabScreenProps<MainTabParamList, "Cours">["route"];

export default function ApprendreScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<CoursRoute>();
  const { colors } = useAppTheme();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const chapterProgress = useLearnFlowStore((s) => s.chapterProgress);
  const catalogEpoch = usePublishedCatalog();
  const programme = useMemo(
    () => programmeForLearner(profile?.classe, profile?.id, chapterProgress),
    [profile?.classe, profile?.id, chapterProgress, catalogEpoch],
  );
  const [level, setLevel] = useState<0 | 1 | 2 | 3>(0);
  const [subject, setSubject] = useState<ProgrammeSubject | null>(null);
  const [theme, setTheme] = useState<ProgrammeTheme | null>(null);
  const [chapter, setChapter] = useState<ProgrammeChapter | null>(null);
  const [booting, setBooting] = useState(true);
  const liveSubject = useMemo(
    () => (subject ? programme.find((s) => s.id === subject.id) ?? subject : null),
    [programme, subject],
  );
  const liveTheme = useMemo(
    () => (liveSubject && theme ? liveSubject.themes.find((t) => t.id === theme.id) ?? theme : null),
    [liveSubject, theme],
  );
  const liveChapter = useMemo(
    () => (liveTheme && chapter ? liveTheme.chapters.find((c) => c.id === chapter.id) ?? chapter : null),
    [liveTheme, chapter],
  );

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setLevel(0);
    setSubject(null);
    setTheme(null);
    setChapter(null);
  }, [profile?.classe]);

  useEffect(() => {
    const subjectId = route.params?.subjectId;
    const resetKey = route.params?.resetKey;
    if (subjectId === undefined && resetKey === undefined) return;
    if (!subjectId) {
      setLevel(0);
      setSubject(null);
      setTheme(null);
      setChapter(null);
      return;
    }
    const found = programme.find((s) => s.id === subjectId);
    if (!found) return;
    setSubject(found);
    setLevel(1);
    setTheme(null);
    setChapter(null);
  }, [route.params?.subjectId, route.params?.resetKey, programme]);

  const goBack = () => {
    if (level === 3) {
      setLevel(2);
      setChapter(null);
    } else if (level === 2) {
      setLevel(1);
      setTheme(null);
    } else if (level === 1) {
      setLevel(0);
      setSubject(null);
    }
  };

  if (booting) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top"]}>
        <CoursesSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
        {level > 0 ? (
          <Pressable onPress={goBack} style={[styles.headerIcon, { backgroundColor: colors.surfaceAlt }]}>
            <Icon name="arrow-left" size={18} color={colors.textDark} />
          </Pressable>
        ) : (
          <Spira scene="tab.cours" size={56} message="" />
        )}
        <View style={styles.headerText}>
          {level === 0 && (
            <>
              <Text style={[styles.title, { color: colors.textDark }]}>Mes cours</Text>
            </>
          )}
          {level === 1 && liveSubject && (
            <Text style={[styles.title, { color: colors.textDark }]} numberOfLines={1}>
              {liveSubject.name}
            </Text>
          )}
          {level === 2 && liveTheme && (
            <>
              <Text style={[styles.sub, { color: colors.textMuted }]} numberOfLines={1}>
                {liveSubject?.name}
              </Text>
              <Text style={[styles.title, { color: colors.textDark }]} numberOfLines={1}>
                {liveTheme.title}
              </Text>
            </>
          )}
          {level === 3 && liveChapter && (
            <>
              <Text style={[styles.sub, { color: colors.textMuted }]} numberOfLines={1}>
                {liveTheme?.title}
              </Text>
              <Text style={[styles.title, { color: colors.textDark }]} numberOfLines={1}>
                {liveChapter.title}
              </Text>
            </>
          )}
        </View>
        {level > 0 && liveSubject ? (
          <View style={[styles.subjectBadge, { backgroundColor: liveSubject.bg }]}>
            <SubjectLogo id={liveSubject.id} size={22} />
          </View>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {level === 0 &&
          programme.map((s) => {
            const done = s.themes.reduce((a, t) => a + t.lessonsDone, 0);
            const total = s.themes.reduce((a, t) => a + t.lessonsTotal, 0);
            return (
              <Pressable
                key={s.id}
                onPress={() => {
                  setSubject(s);
                  setLevel(1);
                }}
                style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}
              >
                <View style={[styles.iconBox, { backgroundColor: s.bg, borderColor: s.border }]}>
                  <SubjectLogo id={s.id} size={32} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.cardTitle, { color: colors.textDark }]}>{s.name}</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: `${s.progress}%`, backgroundColor: s.color }]} />
                    </View>
                    <Text style={[styles.pct, { color: s.color }]}>
                      {done}/{total}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={16} color="#C4C2BF" />
              </Pressable>
            );
          })}

        {level === 1 &&
          liveSubject?.themes.map((t, ti) => {
            const pct = t.lessonsTotal > 0 ? Math.round((t.lessonsDone / t.lessonsTotal) * 100) : 0;
            return (
              <Pressable
                key={t.id}
                onPress={() => {
                  setTheme(t);
                  setLevel(2);
                }}
                style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}
              >
                <View style={[styles.numBox, { backgroundColor: liveSubject.bg }]}>
                  <Text style={[styles.num, { color: liveSubject.color }]}>{ti + 1}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.cardTitle, { color: colors.textDark }]}>{t.title}</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.track}>
                      <View
                        style={[
                          styles.fill,
                          { width: `${pct}%`, backgroundColor: pct === 100 ? colors.secondary : liveSubject.color },
                        ]}
                      />
                    </View>
                    <Text style={[styles.pct, { color: pct === 100 ? colors.secondary : liveSubject.color }]}>
                      {t.lessonsDone}/{t.lessonsTotal}
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={16} color="#C4C2BF" />
              </Pressable>
            );
          })}

        {level === 2 &&
          liveTheme?.chapters.map((c, ci) => {
            const done = c.progressDone ?? 0;
            const total = c.progressTotal ?? 3;
            const pct = Math.round((done / total) * 100);
            const current = done > 0 && done < total;
            return (
              <Pressable
                key={c.id}
                onPress={() => {
                  setChapter(c);
                  setLevel(3);
                }}
                style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }, current && { borderColor: liveSubject?.color ?? colors.primary }]}
              >
                <View
                  style={[
                    styles.numBox,
                    {
                      backgroundColor: current ? liveSubject?.bg ?? colors.mathsBg : colors.surfaceAlt,
                    },
                  ]}
                >
                  <Text style={[styles.chNum, { color: current ? liveSubject?.color : colors.textMuted }]}>Ch.{ci + 1}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.cardTitle, { flex: 1, color: colors.textDark }]}>{c.title}</Text>
                    {current ? (
                      <Text style={[styles.pill, { backgroundColor: liveSubject?.bg, color: liveSubject?.color }]}>En cours</Text>
                    ) : null}
                  </View>
                  <View style={styles.progressRow}>
                    <View style={styles.track}>
                      <View
                        style={[
                          styles.fill,
                          { width: `${pct}%`, backgroundColor: pct === 100 ? colors.secondary : liveSubject?.color },
                        ]}
                      />
                    </View>
                    <Text style={[styles.pct, { color: pct === 100 ? colors.secondary : liveSubject?.color }]}>
                      {done}/{total}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

        {level === 3 &&
          liveChapter?.lessons.map((l, li) => {
            const locked = l.status === "locked";
            return (
              <Pressable
                key={l.id}
                disabled={locked}
                onPress={() => {
                  if (!locked) nav.navigate("Course", { chapterId: liveChapter.id });
                }}
                style={[
                  styles.card,
                  { backgroundColor: colors.white, borderColor: colors.border },
                  l.status === "current" && { borderColor: liveSubject?.color ?? colors.primary },
                  locked && { opacity: 0.5 },
                ]}
              >
                <View
                  style={[
                    styles.lessonNum,
                    {
                      backgroundColor:
                        l.status === "done" ? colors.svtBg : l.status === "current" ? liveSubject?.bg ?? colors.mathsBg : colors.surfaceAlt,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontWeight: "800",
                      fontSize: 12,
                      color:
                        l.status === "done"
                          ? colors.secondary
                          : l.status === "current"
                            ? liveSubject?.color ?? colors.primary
                            : "#C4C2BF",
                    }}
                  >
                    {li + 1}
                  </Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={[styles.cardTitle, { color: colors.textDark }]}>{l.title}</Text>
                </View>
                {l.status === "done" ? (
                  <Icon name="check-circle" size={18} color={colors.secondary} />
                ) : l.status === "locked" ? (
                  <Icon name="lock" size={16} color={colors.textMuted} />
                ) : (
                  <Icon name="play-circle" size={18} color={liveSubject?.color ?? colors.primary} />
                )}
              </Pressable>
            );
          })}

        {level === 3 && liveChapter ? (
          <Pressable
            style={[styles.quizBtn, { backgroundColor: colors.mathsBg, borderColor: colors.mathsBorder }]}
            onPress={() => nav.navigate("AssimilationQuiz", { chapterId: liveChapter.id })}
          >
            <Text style={styles.quizBtnText}>Quizz 10/10</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1, minWidth: 0 },
  title: { fontSize: 22, fontWeight: "800", color: colors.textDark },
  sub: { fontSize: 14, color: colors.textMuted, fontWeight: "600", marginTop: 2 },
  subjectBadge: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  scroll: { padding: 20, gap: 12, paddingBottom: 110 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  numBox: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  num: { fontSize: 16, fontWeight: "800" },
  chNum: { fontSize: 13, fontWeight: "800" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: colors.textDark },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  track: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 99 },
  fill: { height: 8, borderRadius: 99 },
  pct: { fontSize: 13, fontWeight: "800" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  pill: { fontSize: 12, fontWeight: "800", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: "hidden" },
  lessonNum: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  quizBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  quizBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
});
