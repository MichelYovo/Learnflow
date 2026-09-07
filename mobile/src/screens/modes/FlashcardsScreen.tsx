import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { spiraMoodForSession } from "../../data/spira";
import { cardsDueToday } from "../../engine/spacedRepetition";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { DifficulteFlash } from "../../types/learnflow";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Flashcards">;

export default function FlashcardsScreen({ navigation, route }: Props) {
  const flashcards = useLearnFlowStore((s) => s.flashcards);
  const rateFlashcard = useLearnFlowStore((s) => s.rateFlashcard);
  const guided = route.params?.mode === "Guide";
  const mood = spiraMoodForSession(route.params?.mode);
  const chapterId = route.params?.chapterId;
  const deck = useMemo(() => {
    const base = guided ? cardsDueToday(flashcards) : flashcards;
    if (chapterId) {
      const scoped = base.filter((c) => !c.chapitreId || c.chapitreId === chapterId);
      if (scoped.length) return scoped;
    }
    return base;
  }, [flashcards, guided, chapterId]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  if (deck.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Spira scene="flash.empty" size={80} />
          <Text style={styles.title}>Aucune carte due</Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.link}>Retour</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const card = deck[Math.min(idx, deck.length - 1)];

  const rate = (d: DifficulteFlash) => {
    rateFlashcard(card.id, d);
    if (idx + 1 >= deck.length) setDone(true);
    else {
      setIdx((i) => i + 1);
      setFlipped(false);
    }
  };

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Spira scene="flash.done" size={88} />
          <Text style={styles.title}>Session flashcards terminée</Text>
          <Pressable style={styles.primary} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryText}>OK</Text>
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
        <Text style={styles.meta}>
          {idx + 1}/{deck.length}
        </Text>
      </View>
      <View style={styles.play}>
      <View style={styles.mascot}>
        <Spira mood={mood} size={52} />
      </View>

      <Pressable style={styles.card} onPress={() => setFlipped(!flipped)}>
        <Text style={styles.cardText}>{flipped ? card.verso : card.recto}</Text>
      </Pressable>

      {flipped && guided ? (
        <View style={styles.rates}>
          {(["Difficile", "Moyen", "Facile"] as DifficulteFlash[]).map((d) => (
            <Pressable
              key={d}
              onPress={() => rate(d)}
              style={[
                styles.rateBtn,
                {
                  borderColor: d === "Facile" ? colors.secondary : d === "Moyen" ? colors.accent : colors.danger,
                },
              ]}
            >
              <Text
                style={{
                  fontWeight: "800",
                  color: d === "Facile" ? colors.secondary : d === "Moyen" ? colors.accent : colors.danger,
                }}
              >
                {d}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      {flipped && !guided ? (
        <Pressable
          style={styles.primary}
          onPress={() => {
            if (idx + 1 >= deck.length) setDone(true);
            else {
              setIdx((i) => i + 1);
              setFlipped(false);
            }
          }}
        >
          <Text style={styles.primaryText}>{idx + 1 >= deck.length ? "Terminer" : "Carte suivante"}</Text>
        </Pressable>
      ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  top: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  meta: { fontWeight: "800", color: colors.primary, flex: 1 },
  mascot: { alignItems: "center", marginBottom: 4 },
  play: { paddingTop: 4 },
  card: {
    marginHorizontal: 24,
    marginTop: 8,
    minHeight: 260,
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { fontSize: 24, fontWeight: "800", color: colors.textDark, textAlign: "center", lineHeight: 32 },
  rates: { flexDirection: "row", gap: 10, padding: 24 },
  rateBtn: { flex: 1, borderWidth: 1.5, borderRadius: 16, paddingVertical: 16, alignItems: "center", backgroundColor: colors.white },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 },
  title: { fontSize: 18, fontWeight: "800", color: colors.textDark },
  link: { color: colors.primary, fontWeight: "800" },
  primary: { marginHorizontal: 20, marginTop: 16, backgroundColor: colors.secondary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, alignItems: "center" },
  primaryText: { color: colors.white, fontWeight: "800" },
});
