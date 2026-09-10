import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import CorrectBurst from "../../components/CorrectBurst";
import Icon from "../../components/Icon";
import QuizPlay from "../../components/quiz/QuizPlay";
import Spira from "../../components/Spira";
import { questionsForChapter } from "../../data/modeContent";
import { usePublishedCatalog } from "../../data/publishedCache";
import { playSfx, preloadSfx } from "../../lib/sfx";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AssimilationQuiz">;

export default function AssimilationQuizScreen({ navigation, route }: Props) {
  const chapterId = route.params.chapterId;
  const loopErrors = route.params?.loopErrors === true;
  usePublishedCatalog();
  const classe = useLearnFlowStore((s) => s.getActiveProfile()?.classe);
  const bank = questionsForChapter(chapterId, classe);
  const [queue, setQueue] = useState(bank);
  const questions = queue;
  const recordAssimilation = useLearnFlowStore((s) => s.recordAssimilation);
  const markChapterRead = useLearnFlowStore((s) => s.markChapterRead);
  const lockGrandQuizzOneHour = useLearnFlowStore((s) => s.lockGrandQuizzOneHour);
  const firstTryRef = useRef(true);
  const missedRef = useRef<typeof bank>([]);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ xp: number; unlocked: boolean; challenger: boolean } | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  const q = questions[current];

  useEffect(() => {
    preloadSfx();
  }, []);

  const advance = () => {
    const nextScore = score + (selected === q?.indexReponseCorrecte ? 1 : 0);
    setScore(nextScore);
    if (current + 1 >= questions.length) {
      markChapterRead(chapterId);
      const res = recordAssimilation(chapterId, nextScore, questions.length, firstTryRef.current);
      setResult(res);
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.indexReponseCorrecte) {
      playSfx("correct");
      setBurstKey((k) => k + 1);
    } else {
      playSfx("wrong");
      firstTryRef.current = false;
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
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <QuizPlay
        kicker={`Assimilation${q.matiere ? ` · ${q.matiere}` : ""}`}
        current={current}
        total={questions.length}
        question={q.enonceQuestion}
        options={q.optionsProposees}
        correctIndex={q.indexReponseCorrecte}
        selected={selected}
        onPick={pick}
        onBack={() => navigation.goBack()}
        onContinue={advance}
        explanation={q.explicationPedagogique}
        reviewLabel={q.ancreCours ? `Revoir ce point → ${q.ancreCours}` : "Revoir ce point → cours"}
        onReview={() => navigation.navigate("Course", { chapterId })}
        headerRight={<Spira scene="quiz.play" size={36} />}
      />
      <CorrectBurst trigger={burstKey} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  muted: { color: colors.textSecondary, fontSize: 13, lineHeight: 18 },
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
