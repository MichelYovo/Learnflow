import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import CorrectBurst from "../../components/CorrectBurst";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { chapterTitle, clozeForChapter } from "../../data/modeContent";
import { spiraForScore } from "../../data/spira";
import { playSfx, preloadSfx } from "../../lib/sfx";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "FillBlanks">;

export default function FillBlanksScreen({ navigation, route }: Props) {
  const chapterId = route.params.chapterId;
  const items = useMemo(() => clozeForChapter(chapterId), [chapterId]);
  const [queue, setQueue] = useState(items);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<typeof items>([]);
  const [done, setDone] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const item = queue[Math.min(idx, Math.max(queue.length - 1, 0))];

  useEffect(() => {
    preloadSfx();
  }, []);

  const choose = (opt: string) => {
    if (locked) return;
    setPicked(opt);
    setLocked(true);
    const ok = opt === item.blank.answer;
    playSfx(ok ? "correct" : "wrong");
    if (ok) {
      setScore((s) => s + 1);
      setBurstKey((k) => k + 1);
    } else setWrong((w) => [...w, item]);
  };

  const next = () => {
    if (idx + 1 >= queue.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
    setLocked(false);
  };

  if (done) {
    const total = queue.length;
    const perfect = score === total;
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Spira
            mood={spiraForScore(score, total)}
            size={88}
            message={perfect ? "Textes à trous maîtrisés." : "On reprend uniquement les phrases ratées."}
          />
          <Text style={styles.title}>
            {score}/{total}
          </Text>
          {!perfect && wrong.length > 0 ? (
            <Pressable
              style={styles.primary}
              onPress={() => {
                setQueue(wrong);
                setIdx(0);
                setPicked(null);
                setLocked(false);
                setScore(0);
                setDone(false);
                setWrong([]);
              }}
            >
              <Text style={styles.primaryText}>Boucler sur les erreurs</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.primary} onPress={() => navigation.goBack()}>
              <Text style={styles.primaryText}>Retour au Cramming</Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (!item) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.title}>Aucun texte à trous</Text>
        </View>
      </SafeAreaView>
    );
  }

  const ok = picked === item.blank.answer;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Textes à trous</Text>
          <Text style={styles.sub}>
            {chapterTitle(chapterId)} · {idx + 1}/{queue.length}
          </Text>
        </View>
        <Spira mood={locked ? (ok ? "joyeux" : "triste") : "determine"} size={44} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.badge}>Sans limite de temps · analyse tes erreurs</Text>
        <View style={styles.card}>
          <Text style={styles.sentence}>
            {item.before}
            <Text style={styles.blank}>{picked ?? "______"}</Text>
            {item.after}
          </Text>
        </View>

        <View style={styles.options}>
          {item.blank.options.map((opt) => {
            const sel = picked === opt;
            return (
              <Pressable
                key={opt}
                onPressIn={() => choose(opt)}
                onPress={() => choose(opt)}
                style={[
                  styles.opt,
                  sel && ok && { borderColor: colors.secondary, backgroundColor: colors.svtBg, transform: [{ scale: 1.02 }] },
                  sel && !ok && { borderColor: colors.danger, backgroundColor: colors.angBg },
                ]}
              >
                <Text style={styles.optText}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {locked ? (
          <Pressable style={styles.primary} onPress={next}>
            <Text style={styles.primaryText}>{ok ? "Continuer" : `C'était « ${item.blank.answer} »`}</Text>
          </Pressable>
        ) : null}
      </ScrollView>
      <CorrectBurst trigger={burstKey} />
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
  title: { fontWeight: "800", fontSize: 18, color: colors.textDark },
  sub: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  body: { padding: 20, gap: 14, paddingBottom: 40 },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.hgBg,
    color: colors.accent,
    fontWeight: "800",
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 18,
  },
  sentence: { fontSize: 18, lineHeight: 28, fontWeight: "700", color: colors.textDark },
  blank: { color: colors.primary, fontWeight: "800" },
  options: { gap: 10 },
  opt: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },
  optText: { fontWeight: "700", color: colors.textDark },
  primary: { backgroundColor: colors.accent, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  primaryText: { color: colors.white, fontWeight: "800" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
});
