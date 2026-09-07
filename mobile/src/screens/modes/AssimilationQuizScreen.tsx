import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import CorrectBurst from "../../components/CorrectBurst";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { questionsForChapter } from "../../data/modeContent";
import { playSfx, preloadSfx } from "../../lib/sfx";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AssimilationQuiz">;

export default function AssimilationQuizScreen({ navigation, route }: Props) {
  const chapterId = route.params.chapterId;
  const loopErrors = route.params?.loopErrors === true;
  const bank = questionsForChapter(chapterId);
  const [queue, setQueue] = useState(bank);
  const questions = queue;
  const recordAssimilation = useLearnFlowStore((s) => s.recordAssimilation);
  const lockGrandQuizzOneHour = useLearnFlowStore((s) => s.lockGrandQuizzOneHour);
  const firstTryRef = useRef(true);
  const missedRef = useRef<typeof bank>([]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ xp: number; unlocked: boolean; challenger: boolean } | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  const q = questions[current];

  useEffect(() => {
    preloadSfx();
  }, []);

  const advance = (nextScore: number) => {
    if (current + 1 >= questions.length) {
      const res = recordAssimilation(chapterId, nextScore, questions.length, firstTryRef.current);
      setResult(res);
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setWrong(false);
    }
  };

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.indexReponseCorrecte) {
      playSfx("correct");
      setBurstKey((k) => k + 1);
      const next = score + 1;
      setScore(next);
      setTimeout(() => advance(next), 700);
    } else {
      playSfx("wrong");
      firstTryRef.current = false;
      setWrong(true);
      missedRef.current = [...missedRef.current, q];
    }
  };

  if (done && result) {
    const perfect = result.unlocked;
    if (loopErrors) {
      const missed = missedRef.current;
      return (
        <SafeAreaView style={styles.safe}>
          <LinearGradient
            colors={perfect ? ["#10B981", "#059669"] : ["#F59E0B", "#D97706"]}
            style={styles.resultHero}
          >
            <Icon name={perfect ? "award" : "alert-circle"} size={40} color={colors.white} />
            <Text style={styles.resultTitle}>{score}/{questions.length}</Text>
            <Text style={styles.resultSub}>
              {perfect
                ? `Chapitre maîtrisé · +${result.xp} XP`
                : "Sans chrono — on reboucle uniquement sur tes erreurs."}
            </Text>
          </LinearGradient>
          <View style={styles.choices}>
            {!perfect && missed.length > 0 ? (
              <Pressable
                style={styles.primary}
                onPress={() => {
                  setQueue(missed);
                  missedRef.current = [];
                  setDone(false);
                  setCurrent(0);
                  setScore(0);
                  setSelected(null);
                  setWrong(false);
                  setResult(null);
                }}
              >
                <Text style={styles.primaryText}>Boucler sur les {missed.length} erreurs</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.primary} onPress={() => navigation.goBack()}>
                <Text style={styles.primaryText}>Retour Cramming</Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={perfect ? ["#10B981", "#059669"] : ["#EF4444", "#DC2626"]}
          style={styles.resultHero}
        >
          <Icon name={perfect ? "award" : "alert-circle"} size={40} color={colors.white} />
          <Text style={styles.resultTitle}>{perfect ? "Parfait !" : `${score}/${questions.length}`}</Text>
          <Text style={styles.resultSub}>
            {perfect
              ? `Règle du 10/10 validée · +${result.xp} XP${result.challenger ? " · Badge CHALLENGER" : ""}`
              : "Accès au Grand Quizz refusé — revois les points ratés"}
          </Text>
        </LinearGradient>

        {perfect ? (
          <View style={styles.choices}>
            <Text style={styles.choiceLabel}>Étape 2 — Instant T</Text>
            <Pressable
              style={[styles.choiceCard, { borderColor: colors.mathsBorder, backgroundColor: colors.mathsBg }]}
              onPress={() => navigation.replace("GrandQuizz", { chapterId })}
            >
              <Icon name="zap" size={22} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.choiceTitle, { color: colors.primary }]}>Option Sprint</Text>
                <Text style={styles.muted}>Enchaîner le Grand Quizz maintenant</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.choiceCard}
              onPress={() => {
                lockGrandQuizzOneHour(chapterId);
                navigation.popToTop();
              }}
            >
              <Spira scene="quiz.rest" size={44} message="" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.choiceTitle, { color: colors.accent }]}>Option Repos</Text>
                <Text style={styles.muted}>Verrouille 1h + rappel local (démo)</Text>
              </View>
            </Pressable>
            {result.challenger ? (
              <Spira scene="quiz.perfect" size={88} />
            ) : (
              <Spira scene="quiz.pass" size={80} />
            )}
          </View>
        ) : (
          <View style={styles.choices}>
            <Spira scene="quiz.fail" size={88} />
            <Pressable
              style={styles.primary}
              onPress={() => navigation.navigate("Course", { chapterId })}
            >
              <Text style={styles.primaryText}>Revoir ce point (deep link cours)</Text>
            </Pressable>
            <Pressable
              style={styles.secondary}
              onPress={() => {
                setDone(false);
                setCurrent(0);
                setScore(0);
                setSelected(null);
                setWrong(false);
                setResult(null);
              }}
            >
              <Text style={styles.secondaryText}>Réessayer le quizz</Text>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={colors.textDark} />
        </Pressable>
        <Text style={styles.progress}>
          {current + 1}/{questions.length}
        </Text>
        <Spira scene="quiz.play" size={36} />
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${((current + 1) / questions.length) * 100}%` }]} />
      </View>

      <Text style={styles.q}>{q.enonceQuestion}</Text>
      <View style={[styles.options, wrong && styles.optionsWrong]}>
        {q.optionsProposees.map((opt, i) => {
          const isSel = selected === i;
          const ok = isSel && i === q.indexReponseCorrecte;
          const ko = isSel && i !== q.indexReponseCorrecte;
          return (
            <Pressable
              key={i}
                onPressIn={() => pick(i)}
                onPress={() => pick(i)}
              style={[
                styles.opt,
                ok && { borderColor: colors.secondary, backgroundColor: colors.svtBg, transform: [{ scale: 1.02 }] },
                ko && { borderColor: colors.danger, backgroundColor: colors.angBg },
              ]}
            >
              <Text style={styles.optText}>{opt}</Text>
            </Pressable>
          );
        })}

        {wrong ? (
          <View style={styles.feedback}>
            <Spira scene="quiz.wrong" size={52} />
            <Text style={styles.feedbackTitle}>Pas tout à fait</Text>
            <Text style={styles.muted}>{q.explicationPedagogique}</Text>
            <Pressable
              style={styles.linkBtn}
              onPress={() => navigation.navigate("Course", { chapterId })}
            >
              <Text style={styles.linkText}>Revoir ce point → {q.ancreCours}</Text>
            </Pressable>
            <Pressable style={styles.primary} onPress={() => advance(score)}>
              <Text style={styles.primaryText}>Continuer</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
      <CorrectBurst trigger={burstKey} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  progress: { fontWeight: "800", color: colors.primary },
  track: { height: 4, backgroundColor: colors.border, marginHorizontal: 16 },
  fill: { height: 4, backgroundColor: colors.primary },
  q: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textDark,
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 0,
  },
  options: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 16,
    gap: 16,
  },
  optionsWrong: {
    justifyContent: "flex-start",
    paddingTop: 16,
    paddingBottom: 16,
  },
  opt: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optText: { fontWeight: "700", color: colors.textDark },
  feedback: {
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.angBorder,
    marginTop: 0,
    flex: 1,
    justifyContent: "space-between",
  },
  feedbackTitle: { fontWeight: "800", color: colors.danger },
  muted: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
  linkBtn: { paddingVertical: 4 },
  linkText: { color: colors.primary, fontWeight: "800", fontSize: 13 },
  primary: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  primaryText: { color: colors.white, fontWeight: "800" },
  secondary: { borderWidth: 2, borderColor: colors.border, borderRadius: 14, paddingVertical: 14, alignItems: "center", backgroundColor: colors.white },
  secondaryText: { fontWeight: "800", color: colors.textDark },
  resultHero: { padding: 28, alignItems: "center", gap: 10 },
  resultTitle: { color: colors.white, fontSize: 28, fontWeight: "800" },
  resultSub: { color: "rgba(255,255,255,0.9)", textAlign: "center", fontSize: 13 },
  choices: { flex: 1, padding: 20, gap: 12 },
  choiceLabel: { fontSize: 10, fontWeight: "800", color: colors.textMuted, textTransform: "uppercase", letterSpacing: 1, textAlign: "center" },
  choiceCard: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
  },
  choiceTitle: { fontWeight: "800", fontSize: 15 },
});
