import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, type CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Avatar from "../../components/Avatar";
import NotificationBell from "../../components/NotificationBell";
import LeagueBadge from "../../components/league/LeagueBadge";
import MesMatieres from "../../components/MesMatieres";
import ModeWorkSelector from "../../components/ModeWorkSelector";
import FloatingChatbot from "../../components/FloatingChatbot";
import Spira from "../../components/Spira";
import { HomeSkeleton } from "../../components/ui";
import { AGENDA_MODE_CONFIG, EMPTY_WEEK_CHART } from "../../data/mock";
import { usePublishedCatalog } from "../../data/publishedCache";
import { continueLessonForLearner, programmeForLearner, subjectShortcutsForLearner } from "../../data/programme";
import { cardsDueToday } from "../../engine/spacedRepetition";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { AppMode } from "../../types/modes";
import { MODE_DEFAULT_TOOLS, appModeToSessionMode } from "../../types/modes";
import type { MainTabParamList, RootStackParamList } from "../../navigation/types";

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Accueil">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const ligue = useLearnFlowStore((s) => s.ligue);
  const chapterProgress = useLearnFlowStore((s) => s.chapterProgress);
  const setPendingMode = useLearnFlowStore((s) => s.setPendingMode);
  const setCustomTools = useLearnFlowStore((s) => s.setCustomTools);
  const agendaSessions = useLearnFlowStore((s) => s.agendaSessions);
  const flashcards = useLearnFlowStore((s) => s.flashcards);
  const inbox = useLearnFlowStore((s) => s.inbox);
  const { colors, darkMode } = useAppTheme();
  const catalogEpoch = usePublishedCatalog();
  const weekXp = ligue.scoreHebdo;
  const weekChart = EMPTY_WEEK_CHART;
  const nextLigue =
    ligue.nomLigue === "Bronze"
      ? "Argent"
      : ligue.nomLigue === "Argent"
        ? "Or"
        : ligue.nomLigue === "Or"
          ? "Platine"
          : ligue.nomLigue === "Platine"
            ? "Diamant"
            : null;
  const continueLesson = useMemo(
    () => continueLessonForLearner(profile.classe, profile.id, chapterProgress),
    [profile.classe, profile.id, chapterProgress, catalogEpoch],
  );
  const shortcuts = useMemo(
    () => subjectShortcutsForLearner(profile.classe, profile.id, chapterProgress),
    [profile.classe, profile.id, chapterProgress, catalogEpoch],
  );
  const [selectedMode, setSelectedMode] = useState<AppMode | null>(null);
  const [booting, setBooting] = useState(true);
  const totalDone = useMemo(
    () =>
      programmeForLearner(profile.classe, profile.id, chapterProgress).reduce(
        (a, s) => a + s.themes.reduce((b, t) => b + t.lessonsDone, 0),
        0,
      ),
    [profile.classe, profile.id, chapterProgress, catalogEpoch],
  );
  const todayIdx = (new Date().getDay() + 6) % 7;
  const todaySessions = agendaSessions
    .filter((s) => s.day === todayIdx)
    .sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 650);
    return () => clearTimeout(t);
  }, []);

  const unreadInbox = useMemo(() => inbox.filter((n) => !n.read), [inbox]);
  const greetingName = (profile.firstName || profile.nom || "").trim() || "toi";

  /** Mode Guidé inactif tant qu'aucune flashcard n'est due (algo des J). */
  const dueCount = cardsDueToday(flashcards).length;
  const modeAvailability = useMemo(
    () => ({
      guide:
        dueCount === 0
          ? {
              status: "inactive" as const,
              reason: "Aucune carte due aujourd'hui.",
            }
          : { status: "available" as const },
    }),
    [dueCount]
  );

  const openMode = (mode: AppMode) => {
    setSelectedMode(mode);
    setCustomTools(MODE_DEFAULT_TOOLS[mode]);
    setPendingMode(appModeToSessionMode(mode));
    if (mode === "blitz") {
      nav.navigate("Blitz");
      return;
    }
    if (mode === "libre") nav.navigate("ModeLibre", { chapterId: continueLesson.chapterId });
    else if (mode === "guide") nav.navigate("ModeGuide");
    else nav.navigate("ModeCramming", { chapterId: continueLesson.chapterId });
  };

  if (booting) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top"]}>
        <HomeSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top"]}>
      <View style={[styles.header, { backgroundColor: colors.white }]}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => nav.navigate("Profil")} accessibilityRole="button" accessibilityLabel="Ouvrir mon profil">
            <Avatar
              avatarId={profile.avatarId}
              size={48}
              radius={24}
              initials={(profile.firstName || "?")[0]}
              fallbackColor={profile.color ?? colors.primary}
              tier={ligue.nomLigue}
            />
          </Pressable>
          <View style={styles.greeting}>
            <Text style={[styles.hello, { color: colors.textSecondary }]}>Salut</Text>
            <Text style={[styles.name, { color: colors.textDark }]} numberOfLines={1}>
              {greetingName}
            </Text>
          </View>
        </View>
        <View style={styles.pills}>
          <View style={styles.pill}>
            <Icon name="flame" size={16} color={colors.accent} />
            <Text style={styles.pillText}>{profile.streak}</Text>
          </View>
          <View style={styles.pill}>
            <Icon name="zap" size={16} color={colors.accent} />
            <Text style={styles.pillText}>{profile.xpTotale.toLocaleString()}</Text>
          </View>
          <NotificationBell unreadCount={unreadInbox.length} onPress={() => nav.navigate("NotificationsInbox")} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[colors.primary, "#00B8F4"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <Pressable
            onPress={() => nav.navigate("Course", { chapterId: continueLesson.chapterId })}
            accessibilityRole="button"
            accessibilityLabel="Continuer la leçon"
            style={{ flex: 1, paddingRight: 8 }}
          >
            <Text style={styles.heroTitle}>{continueLesson.title}</Text>
            <Text style={styles.heroSub}>{continueLesson.lessonLabel}</Text>
            <View style={styles.heroTrack}>
              <View style={[styles.heroFill, { width: `${continueLesson.progress}%` }]} />
            </View>
          </Pressable>
          <View style={styles.heroSide}>
            <Spira scene="tab.home" size={72} message="" animated={false} />
            <Pressable
              onPress={() => nav.navigate("Course", { chapterId: continueLesson.chapterId })}
              accessibilityRole="button"
              accessibilityLabel="Continuer"
              style={styles.heroPlay}
            >
              <Text style={styles.heroCta}>Continuer</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <ModeWorkSelector
          selectedMode={selectedMode}
          availability={modeAvailability}
          onSelectMode={openMode}
        />

        <MesMatieres
          subjects={shortcuts}
          onSeeAll={() => nav.navigate("Cours", { subjectId: "", resetKey: Date.now() })}
          onSelectSubject={(subject) =>
            nav.navigate("Cours", { subjectId: subject.slug, resetKey: Date.now() })
          }
        />

        {todaySessions.length > 0 ? (
          <View style={[styles.todayCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <View style={styles.todayHead}>
              <Text style={[styles.sectionTitle, { color: colors.textDark }]}>Aujourd'hui</Text>
              <Pressable onPress={() => nav.navigate("Agenda")} hitSlop={8}>
                <Text style={[styles.agendaLink, { color: colors.primary }]}>Agenda</Text>
              </Pressable>
            </View>
            {todaySessions.map((s) => (
              <View key={s.id} style={styles.sessionRow}>
                <Text style={[styles.sessionTime, { color: colors.textDark }]}>
                  {String(s.hour).padStart(2, "0")}:{String(s.minute).padStart(2, "0")}
                </Text>
                <Text style={[styles.sessionSubject, { color: colors.textDark }]} numberOfLines={1}>
                  {s.subject}
                </Text>
                <Text style={[styles.sessionMode, { color: AGENDA_MODE_CONFIG[s.mode].color }]}>
                  {AGENDA_MODE_CONFIG[s.mode].label}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View
          style={[
            styles.progressCard,
            { backgroundColor: colors.white, borderColor: darkMode ? colors.border : "#F1F5F9" },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: darkMode ? colors.textDark : "#0F172A" }]}>
            Ma progression
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.statCell, styles.statBorder, { borderRightColor: darkMode ? colors.border : "#E5E7EB" }]}>
              <Text style={[styles.statValue, { color: darkMode ? colors.textDark : "#0F172A" }]}>
                {totalDone}
              </Text>
              <Text style={styles.statLabel}>leçons</Text>
            </View>
            <View style={[styles.statCell, styles.statBorder, { borderRightColor: darkMode ? colors.border : "#E5E7EB" }]}>
              <Text style={[styles.statValue, { color: darkMode ? colors.textDark : "#0F172A" }]}>
                { "0h" }
              </Text>
              <Text style={styles.statLabel}>d'étude</Text>
            </View>
            <View style={styles.statCell}>
              <Text style={[styles.statValue, { color: "#F59E0B" }]}>+{weekXp}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
          </View>

          <View style={styles.chartPlot}>
            {weekChart.map((b, i) => (
              <View key={`bar-${i}`} style={styles.chartCol}>
                <View
                  style={{
                    height: b.height,
                    width: 22,
                    borderTopLeftRadius: 11,
                    borderTopRightRadius: 11,
                    backgroundColor: b.color,
                  }}
                />
              </View>
            ))}
          </View>
          <View style={styles.chartRow}>
            {weekChart.map((b, i) => (
              <View key={`lbl-${i}`} style={styles.chartCol}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: b.today ? "800" : "600",
                    color: b.today ? "#1677FF" : "#9CA3AF",
                  }}
                >
                  {b.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => nav.navigate("Ligue")}
          style={[
            styles.leagueCard,
            {
              backgroundColor: darkMode ? "#422006" : "#FFFBEB",
              borderColor: darkMode ? "#78350F" : "#FDE68A",
            },
          ]}
        >
          <LeagueBadge nom={ligue.nomLigue} size={56} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.leagueTitle, { color: darkMode ? "#FDE68A" : "#1C1917" }]}>
              Ligue {ligue.nomLigue}
            </Text>
            <Text style={styles.leagueMeta}>#{ligue.rangActuel}</Text>
            {nextLigue ? (
              <View style={styles.leagueBar}>
                <View style={styles.leagueTrack}>
                  <View style={[styles.leagueFill, { width: `${Math.min(100, ligue.scoreHebdo)}%` }]} />
                </View>
              </View>
            ) : null}
          </View>
          <Icon name="chevron-right" size={20} color="#D97706" />
        </Pressable>
      </ScrollView>

      <FloatingChatbot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flexShrink: 1, minWidth: 0 },
  greeting: { flexShrink: 1, minWidth: 0, gap: 2 },
  hello: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
  name: { fontSize: 20, fontWeight: "800", color: colors.textDark },
  pills: { flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0 },
  agendaLink: { fontSize: 15, fontWeight: "700", color: colors.primary },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  pillText: { fontSize: 14, fontWeight: "800", color: "#D97706" },
  scroll: { padding: 20, paddingBottom: 96, gap: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.textDark },
  todayCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  todayHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sessionRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 6 },
  sessionTime: { width: 52, fontSize: 15, fontWeight: "700" },
  sessionSubject: { flex: 1, fontSize: 16, fontWeight: "700" },
  sessionMode: { fontSize: 12, fontWeight: "800" },
  hero: { borderRadius: 24, paddingVertical: 22, paddingHorizontal: 22, flexDirection: "row", alignItems: "center", minWidth: "100%" },
  heroTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" },
  heroSub: { color: "rgba(255,255,255,0.9)", fontSize: 15, marginTop: 6, fontWeight: "600" },
  heroTrack: { height: 8, backgroundColor: "rgba(255,255,255,0.28)", borderRadius: 99, marginTop: 14 },
  heroFill: { height: 8, backgroundColor: "#FFFFFF", borderRadius: 99 },
  heroSide: { alignItems: "center", gap: 8, flexShrink: 0 },
  heroPlay: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  heroCta: { color: "#1677FF", fontWeight: "800", fontSize: 16 },
  progressCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 22,
    gap: 20,
  },
  statsRow: { flexDirection: "row", alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "800" },
  statLabel: { marginTop: 4, fontSize: 13, fontWeight: "600", color: "#9CA3AF" },
  statCell: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  statBorder: { borderRightWidth: StyleSheet.hairlineWidth },
  chartRow: { width: "100%", flexDirection: "row", marginTop: 8 },
  chartPlot: {
    width: "100%",
    height: 88,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  chartCol: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  leagueCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  leagueTitle: { fontSize: 17, fontWeight: "800" },
  leagueMeta: { fontSize: 15, fontWeight: "600", color: "#D97706", marginTop: 2 },
  leagueBar: { marginTop: 10 },
  leagueTrack: { height: 8, backgroundColor: "#FDE68A", borderRadius: 99, overflow: "hidden" },
  leagueFill: { height: 8, width: "0%", backgroundColor: "#F59E0B", borderRadius: 99 },
});
