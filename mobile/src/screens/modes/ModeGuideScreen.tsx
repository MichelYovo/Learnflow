import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import FlipCard from "../../components/FlipCard";
import Icon from "../../components/Icon";
import SessionRecap, { useSessionStats } from "../../components/SessionRecap";
import Spira from "../../components/Spira";
import { SlideIn } from "../../components/ui";
import { spiraForFlashRating, type SpiraMoodId } from "../../data/spira";
import { cardsDueToday, daysUntilNext } from "../../engine/spacedRepetition";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { useAppTheme } from "../../theme/useAppTheme";
import type { DifficulteFlash } from "../../types/learnflow";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ModeGuide">;

function spiraAfterRating(d: DifficulteFlash, days: number) {
  if (d === "Facile") return `Dans ${days} jour${days > 1 ? "s" : ""}.`;
  if (d === "Moyen") return "Bientôt.";
  return "On y revient vite.";
}

export default function ModeGuideScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
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
  const recapStats = useSessionStats({ cards: deck.length });

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

  const header = (right?: React.ReactNode) => (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} style={[styles.back, { backgroundColor: colors.white }]}>
        <Icon name="arrow-left" size={18} color={colors.textDark} />
      </Pressable>
      <Text style={[styles.title, { color: colors.textDark, flex: 1 }]}>Mode Guidé</Text>
      {right}
    </View>
  );

  if (liveDue.length === 0 && !started) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
        {header()}
        <SlideIn id="empty">
          <View style={styles.center}>
            <Spira scene="mode.guide.empty" size={112} message={speech} />
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={[styles.ghostText, { color: colors.primary }]}>Retour accueil</Text>
            </Pressable>
          </View>
        </SlideIn>
      </SafeAreaView>
    );
  }

  if (!started) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
        {header(
          <Pressable
            onPress={() => navigation.navigate("SessionCustomize", { mode: "Guide" })}
            style={[styles.gear, { backgroundColor: colors.white }]}
          >
            <Icon name="settings" size={16} color={colors.textDark} />
          </Pressable>
        )}
        <SlideIn id="start">
          <View style={styles.center}>
            <Spira scene="mode.guide" size={112} message={speech} />
            <Pressable
              style={styles.btnWrap}
              onPress={() => {
                setDeck(liveDue);
                setStarted(true);
                setMood("confiant");
                setSpeech("");
              }}
            >
              <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.primary}>
                <Text style={styles.primaryText}>Lancer l'entretien</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </SlideIn>
      </SafeAreaView>
    );
  }

  if (done) {
    return (
      <SessionRecap success title="Entretien terminé" subtitle="Tes cartes du jour sont faites." stats={recapStats}>
        <Pressable style={styles.btnWrap} onPress={() => navigation.goBack()}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.primary}>
            <Text style={styles.primaryText}>Terminer</Text>
          </LinearGradient>
        </Pressable>
      </SessionRecap>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      {header(
        <Text style={[styles.meta, { color: colors.primary }]}>
          {idx + 1}/{deck.length}
        </Text>
      )}
      <SlideIn id={idx}>
        <View style={styles.play}>
          <View style={styles.spiraRow}>
            <Spira mood={mood} size={64} message={speech} />
          </View>
          <FlipCard front={card.recto} back={card.verso} flipped={flipped} onPress={() => setFlipped((v) => !v)} />
          {flipped ? (
            <View style={styles.rates}>
              {(["Difficile", "Moyen", "Facile"] as DifficulteFlash[]).map((d) => (
                <Pressable
                  key={d}
                  onPress={() => rate(d)}
                  style={[
                    styles.rateBtn,
                    {
                      backgroundColor: colors.white,
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
        </View>
      </SlideIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  gear: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontWeight: "800", fontSize: 22 },
  meta: { fontSize: 15, fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 28, gap: 24 },
  btnWrap: { borderRadius: 18, overflow: "hidden", minWidth: 220 },
  primary: { paddingVertical: 18, paddingHorizontal: 32, alignItems: "center" },
  primaryText: { color: "#FFFFFF", fontWeight: "800", fontSize: 17 },
  ghostText: { fontWeight: "800", fontSize: 16 },
  spiraRow: { alignItems: "center", paddingHorizontal: 16, marginBottom: 8 },
  play: { paddingTop: 4 },
  rates: { flexDirection: "row", gap: 10, padding: 24 },
  rateBtn: { flex: 1, borderWidth: 1.5, borderRadius: 16, paddingVertical: 16, alignItems: "center" },
});
