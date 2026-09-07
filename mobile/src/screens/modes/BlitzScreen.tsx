import React, { useEffect, useMemo, useRef, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import BlitzChallengeDrawer from "../../components/BlitzChallengeDrawer";
import BlitzRing from "../../components/BlitzRing";
import CorrectBurst from "../../components/CorrectBurst";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import TimesUpFlash from "../../components/TimesUpFlash";
import { BLITZ_DIFFICULTES, blitzDeck, parseChallengeInput } from "../../engine/blitzChallenge";
import { playSfx, preloadSfx } from "../../lib/sfx";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";
import type { DifficulteFlash } from "../../types/learnflow";

type Props = NativeStackScreenProps<RootStackParamList, "Blitz">;
const DURATION = 60;
const ARENA = ["#3B070C", "#090001", "#1A0206"] as const;
const ARENA_CRITICAL = ["#6B0A12", "#1A0004", "#4A0810"] as const;

function HazardTape() {
  return (
    <View style={styles.tape} pointerEvents="none">
      {Array.from({ length: 22 }).map((_, i) => (
        <View
          key={i}
          style={[styles.tapeBar, { backgroundColor: i % 2 === 0 ? "#F59E0B" : "#111111" }]}
        />
      ))}
    </View>
  );
}

function ringTone(seconds: number): "warn" | "critical" {
  if (seconds > 10 && seconds <= 20) return "warn";
  return "critical";
}

const DIFF_META: Record<DifficulteFlash, { color: string; hint: string }> = {
  Facile: { color: "#34D399", hint: "Rappels rapides" },
  Moyen: { color: "#FBBF24", hint: "Mix standard" },
  Difficile: { color: "#F87171", hint: "Pièges & précision" },
};

export default function BlitzScreen({ navigation, route }: Props) {
  const recordBlitz = useLearnFlowStore((s) => s.recordBlitz);
  const setBlitzDifficulte = useLearnFlowStore((s) => s.setBlitzDifficulte);
  const incoming = route.params?.challengeCode;
  const startDeck = useMemo(() => {
    const parsed = incoming ? parseChallengeInput(incoming) : null;
    if (parsed) return parsed;
    const d =
      route.params?.difficulte ??
      useLearnFlowStore.getState().settings.blitzDifficulte ??
      "Moyen";
    return blitzDeck(undefined, d);
  }, [incoming, route.params?.difficulte]);
  const [deck, setDeck] = useState(startDeck);
  const [difficulte, setDifficulte] = useState<DifficulteFlash>(startDeck.difficulte);
  const [codeInput, setCodeInput] = useState("");
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [ringProgress, setRingProgress] = useState(1);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [xp, setXp] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const [ringing, setRinging] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endedRef = useRef(false);
  const warnedRef = useRef(false);

  const pulse = useSharedValue(1);
  const critical = phase === "playing" && timeLeft <= 10;
  const warning = phase === "playing" && timeLeft <= 20;

  useEffect(() => {
    preloadSfx();
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const started = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - started) / 1000;
      const left = Math.max(0, DURATION - elapsed);
      setTimeLeft(left);
      setRingProgress(left / DURATION);
      if (left <= 0 && !endedRef.current) {
        endedRef.current = true;
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeLeft(0);
        setRingProgress(0);
        playSfx("timesUp");
        setRinging(true);
      }
    }, 50);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      setXp(recordBlitz(score, answered, deck.difficulte));
      setChallengeOpen(true);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ringing) return;
    const t = setTimeout(() => setPhase("done"), 1150);
    return () => clearTimeout(t);
  }, [ringing]);

  useEffect(() => {
    if (phase !== "playing" || ringing) return;
    if (timeLeft <= 10 && timeLeft > 0 && !warnedRef.current) {
      warnedRef.current = true;
      playSfx("warn");
    }
  }, [phase, timeLeft, ringing]);

  useEffect(() => {
    if (phase === "done") {
      cancelAnimation(pulse);
      pulse.value = 1;
      return;
    }
    const duration = critical ? 180 : phase === "ready" ? 640 : warning ? 360 : 820;
    const scaleTo = critical ? 1.14 : phase === "ready" ? 1.08 : 1.05;
    pulse.value = withRepeat(
      withSequence(
        withTiming(scaleTo, { duration, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, [phase, critical, warning, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const q = deck.questions[qIdx % deck.questions.length];
  const survived = score >= Math.max(1, Math.floor(answered * 0.6));

  const pick = (i: number) => {
    if (selected !== null || phase !== "playing" || ringing) return;
    setSelected(i);
    const ok = i === q.indexReponseCorrecte;
    playSfx(ok ? "correct" : "wrong");
    if (ok) {
      setScore((s) => s + 1);
      setBurstKey((k) => k + 1);
    }
    setAnswered((a) => a + 1);
    setTimeout(() => {
      setSelected(null);
      setQIdx((x) => x + 1);
    }, 450);
  };

  const shareChallenge = (withScore: boolean) => {
    const allow = useLearnFlowStore.getState().settings.privacy.shareBlitzScores;
    if (withScore && !allow) {
      Alert.alert(
        "Partage désactivé",
        "Active « Partage de score Blitz » dans Profil → Confidentialité."
      );
      return;
    }
    const body = withScore
      ? `LearnFlow Blitz — Survive 60s · ${deck.difficulte}\nCode défi : ${deck.code}\nMon score : ${score}/${answered}\nMême série. Tu bats ${score} ?`
      : `LearnFlow Blitz — Survive 60s · ${deck.difficulte}\nCode défi : ${deck.code}\nEntre le code, même série. Tu tiens 60 secondes ?`;
    const text = encodeURIComponent(body);
    void Linking.openURL(`whatsapp://send?text=${text}`).catch(() =>
      Linking.openURL(`https://wa.me/?text=${text}`)
    );
  };

  const joinCode = () => {
    const parsed = parseChallengeInput(codeInput);
    if (!parsed) {
      Alert.alert("Code invalide", "Format attendu : LF-MXXXX (la lettre indique la difficulté).");
      return;
    }
    setDeck(parsed);
    setDifficulte(parsed.difficulte);
    setBlitzDifficulte(parsed.difficulte);
    setCodeInput("");
    Alert.alert("Défi chargé", `Code ${parsed.code} · ${parsed.difficulte} — mêmes questions que ton ami.`);
  };

  const loadDifficulty = (d: DifficulteFlash) => {
    if (d === difficulte) return;
    setDifficulte(d);
    setBlitzDifficulte(d);
    setDeck(blitzDeck(undefined, d));
  };

  const start = () => {
    endedRef.current = false;
    warnedRef.current = false;
    setTimeLeft(DURATION);
    setRingProgress(1);
    setQIdx(0);
    setSelected(null);
    setScore(0);
    setAnswered(0);
    setBurstKey(0);
    setRinging(false);
    setChallengeOpen(false);
    setPhase("playing");
  };

  const drawer = (
    <BlitzChallengeDrawer
      code={deck.code}
      codeInput={codeInput}
      onCodeInput={setCodeInput}
      expanded={challengeOpen}
      onToggle={() => setChallengeOpen((v) => !v)}
      onCreate={() => setDeck(blitzDeck(undefined, difficulte))}
      onJoin={joinCode}
      onShare={() => shareChallenge(phase === "done")}
    />
  );

  const shell = (child: React.ReactNode) => (
    <LinearGradient colors={critical ? ARENA_CRITICAL : ARENA} style={styles.root} start={{ x: 0.15, y: 0 }} end={{ x: 0.9, y: 1 }}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <HazardTape />
        {child}
      </SafeAreaView>
    </LinearGradient>
  );

  if (phase === "ready") {
    return shell(
      <>
        <View style={styles.topBar}>
          <Pressable style={styles.back} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={18} color={colors.white} />
          </Pressable>
        </View>
        {drawer}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.readyScroll} showsVerticalScrollIndicator={false}>
          <Spira scene="mode.blitz.ready" size={88} message="" />

          <Animated.View style={pulseStyle}>
            <BlitzRing value={60} progress={1} size={168} unit="sec" tone="critical" />
          </Animated.View>

          <Text style={styles.readyTitle}>60 secondes</Text>

          <View style={styles.diffRow}>
            {BLITZ_DIFFICULTES.map((d) => {
              const on = d === difficulte;
              const meta = DIFF_META[d];
              return (
                <Pressable
                  key={d}
                  onPress={() => loadDifficulty(d)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={`Difficulté ${d}`}
                  style={[
                    styles.diffChip,
                    on && { borderColor: meta.color, backgroundColor: `${meta.color}22` },
                  ]}
                >
                  <Text style={[styles.diffChipText, { color: on ? meta.color : "rgba(254,202,202,0.7)" }]}>
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable onPress={start} style={styles.startWrap}>
            <LinearGradient colors={["#EF4444", "#7F1D1D"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.start}>
              <Icon name="flame" size={18} color={colors.white} />
              <Text style={styles.startText}>Je relève le défi</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </>
    );
  }

  if (phase === "done") {
    return shell(
      <>
        {drawer}
        <View style={styles.center}>
          <View style={[styles.dangerBadge, survived ? styles.survivedBadge : null]}>
            <Icon name={survived ? "flame" : "alert-circle"} size={14} color={survived ? "#F97316" : "#F59E0B"} />
            <Text style={styles.dangerBadgeText}>{survived ? "CHRONO TENU" : "CHRONO GAGNANT"}</Text>
          </View>
          <Spira
            scene={survived ? "mode.blitz.win" : "mode.blitz.lose"}
            size={96}
            message={survived ? "60 secondes. Tu as tenu." : "Le chrono t'a eu. Reviens plus affûté."}
          />
          <Text style={styles.doneTitle}>
            {score}/{answered}
          </Text>
          <Text style={styles.doneSub}>
            {survived ? "Le mix n'a pas eu ta peau." : "Trop lent sur cette série."} · {deck.difficulte} · +{xp} XP
          </Text>
          <Pressable style={styles.whatsapp} onPress={() => shareChallenge(true)}>
            <Text style={styles.whatsappText}>Défier un ami · {deck.code}</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              endedRef.current = false;
              warnedRef.current = false;
              setDeck(blitzDeck(undefined, difficulte));
              setTimeLeft(DURATION);
              setRingProgress(1);
              setRinging(false);
              setBurstKey(0);
              setPhase("ready");
            }}
            style={styles.linkHit}
          >
            <Text style={styles.link}>Nouvelle série</Text>
          </Pressable>
          <Pressable onPress={() => navigation.goBack()} style={styles.linkHit}>
            <Text style={styles.link}>Quitter le défi</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return shell(
    <>
      <View style={styles.playTop}>
        <Spira scene={critical ? "mode.blitz.panic" : "mode.blitz.play"} size={48} />
        <Animated.View style={pulseStyle}>
          <BlitzRing
            value={timeLeft}
            progress={ringProgress}
            size={118}
            unit="sec"
            tone={ringTone(timeLeft)}
          />
        </Animated.View>
        <Text style={styles.scoreLive}>
          {score} pts{"\n"}Q{answered + 1}
        </Text>
      </View>
      {critical ? (
        <Text style={styles.criticalBanner}>DERNIÈRES SECONDES — NE LÂCHE RIEN</Text>
      ) : warning ? (
        <Text style={styles.warningBanner}>Le chrono se resserre</Text>
      ) : (
        <Text style={styles.liveHint}>Pas de retour en arrière</Text>
      )}

      <View style={styles.playBody}>
        <Text style={styles.subject}>
          {(q.matiere ?? "MIX").toUpperCase()} · {deck.difficulte.toUpperCase()}
        </Text>
        <Text style={styles.q}>{q.enonceQuestion}</Text>
        {q.optionsProposees.map((opt, i) => {
          const picked = selected === i;
          const correct = i === q.indexReponseCorrecte;
          return (
          <Pressable
            key={i}
            onPress={() => pick(i)}
            style={[
              styles.opt,
              picked && {
                borderColor: correct ? colors.secondary : colors.danger,
                backgroundColor: correct ? "rgba(16,185,129,0.16)" : "rgba(239,68,68,0.22)",
                transform: [{ scale: correct ? 1.03 : 0.99 }],
              },
            ]}
          >
            <Text style={styles.optText}>{opt}</Text>
          </Pressable>
          );
        })}
      </View>
      <CorrectBurst trigger={burstKey} label="+1" tone="arena" />
      <TimesUpFlash visible={ringing} />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  tape: {
    height: 12,
    flexDirection: "row",
    overflow: "hidden",
    backgroundColor: "#111",
  },
  tapeBar: {
    width: 22,
    height: 28,
    marginLeft: -4,
    transform: [{ rotate: "28deg" }, { translateY: -8 }],
  },
  topBar: { paddingHorizontal: 8, paddingTop: 4 },
  back: {
    margin: 8,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  readyScroll: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  dangerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245,158,11,0.12)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.55)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  survivedBadge: {
    backgroundColor: "rgba(249,115,22,0.14)",
    borderColor: "rgba(249,115,22,0.55)",
  },
  dangerBadgeText: {
    color: "#FBBF24",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1.6,
  },
  readyTitle: { fontSize: 28, fontWeight: "900", color: colors.white, letterSpacing: -0.4, textAlign: "center" },
  readySub: { color: "rgba(254,202,202,0.72)", textAlign: "center", fontWeight: "600", lineHeight: 20 },
  warnRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 4 },
  warnChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.4)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  warnChipText: { color: "#FECACA", fontWeight: "800", fontSize: 11 },
  diffLabel: {
    color: "rgba(254,202,202,0.55)",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 8,
  },
  diffRow: { flexDirection: "row", gap: 8, alignSelf: "stretch" },
  diffChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(239,68,68,0.35)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  diffChipText: { fontWeight: "900", fontSize: 12 },
  diffHint: { color: "rgba(254,202,202,0.55)", fontWeight: "700", fontSize: 11, marginTop: -4 },
  startWrap: { marginTop: 8, borderRadius: 18, overflow: "hidden", alignSelf: "stretch" },
  start: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 18,
  },
  startText: { color: colors.white, fontWeight: "900", fontSize: 16, letterSpacing: 0.3 },
  playTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  scoreLive: { color: "rgba(254,202,202,0.8)", fontWeight: "800", fontSize: 13, textAlign: "right", minWidth: 56 },
  criticalBanner: {
    textAlign: "center",
    color: "#FECACA",
    fontWeight: "900",
    fontSize: 11,
    letterSpacing: 1.2,
    marginTop: 8,
  },
  warningBanner: {
    textAlign: "center",
    color: "#F59E0B",
    fontWeight: "800",
    fontSize: 11,
    marginTop: 8,
  },
  liveHint: {
    textAlign: "center",
    color: "rgba(255,255,255,0.38)",
    fontWeight: "700",
    fontSize: 11,
    marginTop: 8,
  },
  playBody: { padding: 20, gap: 10 },
  subject: { color: "#F97316", fontWeight: "900", fontSize: 11, letterSpacing: 1.4 },
  q: { color: colors.white, fontSize: 20, fontWeight: "800", marginBottom: 8, lineHeight: 26 },
  opt: {
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 2,
    borderColor: "rgba(239,68,68,0.28)",
    borderRadius: 16,
    padding: 14,
  },
  optText: { color: colors.white, fontWeight: "700" },
  doneTitle: { fontSize: 44, fontWeight: "900", color: colors.white },
  doneSub: { color: "rgba(254,202,202,0.7)", textAlign: "center", fontWeight: "600" },
  whatsapp: { backgroundColor: "#25D366", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, marginTop: 8 },
  whatsappText: { color: colors.white, fontWeight: "800" },
  linkHit: { marginTop: 4, padding: 8 },
  link: { color: "#FCA5A5", fontWeight: "800" },
});
