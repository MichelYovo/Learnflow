import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import CorrectBurst from "../../components/CorrectBurst";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { GRAND_QUIZZ } from "../../data/mock";
import { spiraForScore } from "../../data/spira";
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
  const questions = GRAND_QUIZZ;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

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
    const next = ok ? score + 1 : score;
    if (ok) {
      setScore(next);
      setBurstKey((k) => k + 1);
    }
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        const xp = calculerXP({
          baseXP: next * 20,
          classe: profile.classe,
          densiteChapitre: 1.2,
          multiplicateurPrecision: 2,
        });
        accumulerXP(xp);
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 500);
  };

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.locked}>
          <Spira
            mood={spiraForScore(score, questions.length)}
            size={96}
            message={score === questions.length ? "Sprint parfait !" : "Grand Quizz terminé. XP sprint ×2 appliqué."}
          />
          <Text style={styles.lockedTitle}>
            {score}/{questions.length}
          </Text>
          <Text style={styles.muted}>Grand Quizz terminé · XP sprint ×2 appliqué</Text>
          <Pressable style={styles.primary} onPress={() => navigation.popToTop()}>
            <Text style={styles.primaryText}>Retour</Text>
          </Pressable>
        </View>
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
          Grand Quizz · {current + 1}/{questions.length}
        </Text>
        <Spira scene="quiz.play" size={36} />
      </View>
      <View style={styles.body}>
        <Text style={styles.q}>{q.enonceQuestion}</Text>
        {q.optionsProposees.map((opt, i) => (
          <Pressable
            key={i}
            onPress={() => pick(i)}
            style={[
              styles.opt,
              selected === i && {
                borderColor: i === q.indexReponseCorrecte ? colors.secondary : colors.danger,
                backgroundColor: i === q.indexReponseCorrecte ? colors.svtBg : colors.angBg,
                transform: [{ scale: i === q.indexReponseCorrecte ? 1.02 : 0.99 }],
              },
            ]}
          >
            <Text style={styles.optText}>{opt}</Text>
          </Pressable>
        ))}
      </View>
      <CorrectBurst trigger={burstKey} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  top: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  progress: { fontWeight: "800", color: colors.primary },
  body: { padding: 20, gap: 10 },
  q: { fontSize: 18, fontWeight: "800", color: colors.textDark, marginBottom: 8 },
  opt: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.border, borderRadius: 16, padding: 16 },
  optText: { fontWeight: "700", color: colors.textDark },
  locked: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  lockedTitle: { fontSize: 22, fontWeight: "800", color: colors.textDark },
  muted: { textAlign: "center", color: colors.textMuted },
  primary: { marginTop: 8, backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 14 },
  primaryText: { color: colors.white, fontWeight: "800" },
});
