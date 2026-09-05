import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { spiraForFlashRating, type SpiraMoodId } from "../../data/spira";
import { cardsDueToday, daysUntilNext } from "../../engine/spacedRepetition";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { DifficulteFlash } from "../../types/learnflow";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ModeGuide">;

function spiraAfterRating(d: DifficulteFlash, days: number) {
  if (d === "Facile") return `Dans ${days} jour${days > 1 ? "s" : ""}.`;
  if (d === "Moyen") return "Bientôt.";
  return "On y revient vite.";
}

export default function ModeGuideScreen({ navigation }: Props) {
  const flashcards = useLearnFlowStore((s) => s.flashcards);
  const rateFlashcard = useLearnFlowStore((s) => s.rateFlashcard);
  const liveDue = useMemo(() => cardsDueToday(flashcards), [flashcards]);
  const [deck, setDeck] = useState(liveDue);
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [mood, setMood] = useState<SpiraMoodId>("confiant");
  const [speech, setSpeech] = useState(
    liveDue.length > 0
      ? `${liveDue.length} carte${liveDue.length > 1 ? "s" : ""} due${liveDue.length > 1 ? "s" : ""} aujourd'hui.`
      : "Rien à réviser aujourd'hui."
  );

  const card = deck[Math.min(idx, Math.max(deck.length - 1, 0))];

  const rate = (d: DifficulteFlash) => {
    if (!card) return;
    const days = daysUntilNext(d, card.intervalleRepetJ);
    rateFlashcard(card.id, d);
    setMood(spiraForFlashRating(d));
    setSpeech(spiraAfterRating(d, days));
    if (idx + 1 >= deck.length) {
      setTimeout(() => setDone(true), 420);
    } else {
      setTimeout(() => {
        setIdx((i) => i + 1);
        setFlipped(false);
      }, 280);
    }
  };

  if (liveDue.length === 0 && !started) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <Icon name="arrow-left" size={18} color={colors.textDark} />
          </Pressable>
          <View>
            <Text style={styles.title}>Mode Guidé</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Spira scene="mode.guide.empty" size={96} message={speech} />
          <Pressable style={styles.ghost} onPress={() => navigation.goBack()}>
            <Text style={styles.ghostText}>Retour accueil</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!started) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.back}>
            <Icon name="arrow-left" size={18} color={colors.textDark} />
          </Pressable>
          <View>
            <Text style={styles.title}>Mode Guidé</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Spira scene="mode.guide" size={96} message={speech} />
          <Pressable
            style={styles.primary}
            onPress={() => {
              setDeck(liveDue);
              setStarted(true);
              setMood("confiant");
              setSpeech("");
            }}
          >
            <Text style={styles.primaryText}>Lancer l'entretien</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Spira scene="mode.guide.done" size={88} />
          <Pressable style={styles.primary} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryText}>Terminer</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="arrow-left" size={18} color={colors.textDark} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Mode Guidé</Text>
          <Text style={styles.meta}>
            {idx + 1}/{deck.length}
          </Text>
        </View>
      </View>

      <View style={styles.spiraRow}>
        <Spira mood={mood} size={56} message={speech} />
      </View>

      <Pressable style={styles.card} onPress={() => setFlipped(!flipped)}>
        <Text style={styles.cardText}>{flipped ? card.verso : card.recto}</Text>
      </Pressable>

      {flipped ? (
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
  title: { fontWeight: "800", fontSize: 22, color: colors.textDark },
  meta: { fontSize: 15, fontWeight: "700", color: colors.primary, marginTop: 2 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, gap: 24 },
  primary: { backgroundColor: colors.primary, borderRadius: 18, paddingVertical: 18, paddingHorizontal: 32, alignItems: "center", minWidth: 220 },
  primaryText: { color: colors.white, fontWeight: "800", fontSize: 17 },
  ghost: { paddingVertical: 10 },
  ghostText: { color: colors.primary, fontWeight: "800", fontSize: 16 },
  spiraRow: { alignItems: "center", paddingHorizontal: 16, marginBottom: 8 },
  card: {
    marginHorizontal: 24,
    minHeight: 240,
    backgroundColor: colors.white,
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: { fontSize: 24, fontWeight: "800", color: colors.textDark, textAlign: "center", lineHeight: 32 },
  rates: { flexDirection: "row", gap: 10, padding: 24 },
  rateBtn: { flex: 1, borderWidth: 1.5, borderRadius: 16, paddingVertical: 16, alignItems: "center", backgroundColor: colors.white },
});
