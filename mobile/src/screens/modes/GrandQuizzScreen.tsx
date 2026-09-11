import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import CorrectBurst from "../../components/CorrectBurst";
import QuizPlay from "../../components/quiz/QuizPlay";
import SessionRecap, { useSessionStats } from "../../components/SessionRecap";
import Spira from "../../components/Spira";
import { questionsForGrandQuiz } from "../../data/modeContent";
import { usePublishedCatalog } from "../../data/publishedCache";
import { playSfx, preloadSfx } from "../../lib/sfx";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { calculerXP } from "../../engine/xp";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "GrandQuizz">;

export default function GrandQuizzScreen({ navigation, route }: Props) {
  const canAccess = useLearnFlowStore((s) => s.canAccessGrandQuizz(route.params.chapterId));
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const accumulerXP = useLearnFlowStore((s) => s.accumulerXP);
  usePublishedCatalog();
  const questions = questionsForGrandQuiz(route.params.chapterId, profile?.classe);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const recapStats = useSessionStats({ xp: xpGained, score, total: questions.length });

  useEffect(() => {
    preloadSfx();
  }, []);

  if (!canAccess) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.locked}>
          <Spira scene="quiz.locked" size={96} />
          <Text style={styles.lockedTitle}>Grand Quizz verrouillé</Text>
          <Text style={styles.muted}>Valide d'abord le 10/10 (ou attends la fin du repos 1h).</Text>
          <Pressable style={styles.primary} onPress={() => navigation.replace("AssimilationQuiz", { chapterId: route.params.chapterId })}>
            <Text style={styles.primaryText}>Aller à l'assimilation</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const q = questions[current];

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const ok = i === q.indexReponseCorrecte;
    playSfx(ok ? "correct" : "wrong");
    if (ok) setBurstKey((k) => k + 1);
  };

  const continueQuiz = () => {
    const next = score + (selected === q.indexReponseCorrecte ? 1 : 0);
    setScore(next);
    if (current + 1 >= questions.length) {
      const xp = calculerXP({
        baseXP: next * 20,
        classe: profile.classe,
        densiteChapitre: 1.2,
        multiplicateurPrecision: 2,
      });
      accumulerXP(xp);
      setXpGained(xp);
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  if (done) {
    const perfect = score === questions.length;
    return (
      <SessionRecap
        success={perfect}
        title={perfect ? "Sprint parfait !" : `${score}/${questions.length}`}
        subtitle="Grand Quizz terminé · XP sprint ×2 appliqué"
        stats={recapStats}
      >
        <Pressable style={styles.primary} onPress={() => navigation.popToTop()}>
          <Text style={styles.primaryText}>Retour</Text>
        </Pressable>
      </SessionRecap>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <QuizPlay
        kicker={`Grand Quizz${q.matiere ? ` · ${q.matiere}` : ""}`}
        current={current}
        total={questions.length}
        question={q.enonceQuestion}
        options={q.optionsProposees}
        correctIndex={q.indexReponseCorrecte}
        selected={selected}
        onPick={pick}
        onBack={() => navigation.goBack()}
        onContinue={continueQuiz}
        explanation={q.explicationPedagogique}
        headerRight={<Spira scene="quiz.play" size={36} animated={false} />}
      />
      <CorrectBurst trigger={burstKey} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  locked: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  lockedTitle: { fontSize: 22, fontWeight: "800", color: colors.textDark },
  muted: { textAlign: "center", color: colors.textMuted },
  primary: { marginTop: 8, backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 14 },
  primaryText: { color: colors.white, fontWeight: "800" },
});
