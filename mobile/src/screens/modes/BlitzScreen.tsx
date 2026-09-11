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
import BlitzDuelHud from "../../components/BlitzDuelHud";
import BlitzRing from "../../components/BlitzRing";
import CorrectBurst from "../../components/CorrectBurst";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import TimesUpFlash from "../../components/TimesUpFlash";
import { BLITZ_DIFFICULTES, blitzDeck, blitzShareText, blitzWhatsAppUrl } from "../../engine/blitzChallenge";
import { BlitzDuelSession, duelShareLink, extractDuelCode, type DuelState } from "../../engine/blitzDuel";
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
  Facile: { color: "#34D399", hint: "Échauffement — tu chauffes le chrono" },
  Moyen: { color: "#FBBF24", hint: "Mix standard — le rythme Blitz" },
  Difficile: { color: "#F87171", hint: "Seulement si t'as le cran" },
};

export default function BlitzScreen({ navigation, route }: Props) {
  const recordBlitz = useLearnFlowStore((s) => s.recordBlitz);
  const setBlitzDifficulte = useLearnFlowStore((s) => s.setBlitzDifficulte);
  const incoming = route.params?.duelCode ?? route.params?.challengeCode;
  const startDeck = useMemo(() => {
    const d =
      route.params?.difficulte ??
      useLearnFlowStore.getState().settings.blitzDifficulte ??
      "Moyen";
    return blitzDeck(undefined, d);
  }, [route.params?.difficulte]);
  const [deck, setDeck] = useState(startDeck);
  const [difficulte, setDifficulte] = useState<DifficulteFlash>(startDeck.difficulte);
  const [codeInput, setCodeInput] = useState("");
  const [challengeOpen, setChallengeOpen] = useState(true);
  const [joinError, setJoinError] = useState("");
  const [duelBusy, setDuelBusy] = useState(false);
  const [duel, setDuel] = useState<DuelState | null>(null);
  const [countLeft, setCountLeft] = useState(3);
  const [phase, setPhase] = useState<"ready" | "lobby" | "countdown" | "playing" | "done">("ready");
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
  const duelSessionRef = useRef<BlitzDuelSession | null>(null);
  const playStartedFor = useRef<number | null>(null);
  const autoJoinRef = useRef(false);

  const pulse = useSharedValue(1);
  const critical = phase === "playing" && timeLeft <= 10;
  const warning = phase === "playing" && timeLeft <= 20;

  const leaveDuel = () => {
    duelSessionRef.current?.leave();
    duelSessionRef.current = null;
    setDuel(null);
    setCountLeft(3);
    playStartedFor.current = null;
  };

  useEffect(() => {
    preloadSfx();
    return () => {
      duelSessionRef.current?.leave();
    };
  }, []);

  const onDuelUpdate = (state: DuelState) => {
    setDuel(state);
  };

  const inviteDuel = async () => {
    setDuelBusy(true);
    setJoinError("");
    leaveDuel();
    const next = blitzDeck(undefined, difficulte);
    const name = useLearnFlowStore.getState().getActiveProfile().nom;
    const session = await BlitzDuelSession.host({
      code: next.code,
      seed: next.seed,
      difficulte: next.difficulte,
      name,
      onUpdate: onDuelUpdate,
    });
    setDuelBusy(false);
    if ("error" in session) {
      setJoinError(session.error);
      Alert.alert("Duel Blitz", session.error);
      return null;
    }
    duelSessionRef.current = session;
    setDeck(next);
    setDuel(session.snapshot());
    setChallengeOpen(false);
    setPhase("lobby");
    return session;
  };

  const joinDuel = async (raw: string) => {
    const code = extractDuelCode(raw) ?? raw;
    setDuelBusy(true);
    setJoinError("");
    leaveDuel();
    const name = useLearnFlowStore.getState().getActiveProfile().nom;
    const session = await BlitzDuelSession.join({ code, name, onUpdate: onDuelUpdate });
    setDuelBusy(false);
    if ("error" in session) {
      setJoinError(session.error);
      return false;
    }
    duelSessionRef.current = session;
    const snap = session.snapshot();
    setDeck(blitzDeck(snap.seed, snap.difficulte));
    setDifficulte(snap.difficulte);
    setBlitzDifficulte(snap.difficulte);
    setDuel(snap);
    setCodeInput("");
    setChallengeOpen(false);
    setPhase((current) => {
      if (current === "playing" || current === "countdown" || current === "done") return current;
      if (snap.startedAt && snap.startedAt <= Date.now()) return "playing";
      if (snap.startedAt) return "countdown";
      return "lobby";
    });
    return true;
  };

  useEffect(() => {
    if (!incoming || autoJoinRef.current) return;
    autoJoinRef.current = true;
    void joinDuel(incoming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incoming]);

  useEffect(() => {
    if (!duel?.startedAt) return;
    if (phase === "playing" || phase === "done") return;
    const startedAt = duel.startedAt;
    const tick = () => {
      const ms = startedAt - Date.now();
      if (ms > 0) {
        setCountLeft(Math.ceil(ms / 1000));
        setPhase("countdown");
        return;
      }
      if (playStartedFor.current !== startedAt) {
        playStartedFor.current = startedAt;
        endedRef.current = false;
        warnedRef.current = false;
        setRinging(false);
        setScore(0);
        setAnswered(0);
        setQIdx(0);
        setSelected(null);
        setTimeLeft(DURATION);
        setRingProgress(1);
        setBurstKey(0);
      }
      setPhase("playing");
    };
    tick();
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [duel?.startedAt, phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    const started = duel?.startedAt && playStartedFor.current === duel.startedAt ? duel.startedAt : Date.now();
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
  }, [phase, duel?.startedAt]);

  useEffect(() => {
    if (phase === "done") {
      setXp(recordBlitz(score, answered, deck.difficulte));
      setChallengeOpen(true);
      void duelSessionRef.current?.report(score, answered, true);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!duel || (phase !== "playing" && phase !== "done")) return;
    void duelSessionRef.current?.report(score, answered, phase === "done");
  }, [score, answered, phase, duel]);

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
    const duration = critical ? 180 : phase === "ready" || phase === "lobby" ? 640 : warning ? 360 : 820;
    const scaleTo = critical ? 1.14 : phase === "ready" || phase === "lobby" ? 1.08 : 1.05;
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

  const shareChallenge = (withScore: boolean, liveState: DuelState | null = duel) => {
    const allow = useLearnFlowStore.getState().settings.privacy.shareBlitzScores;
    const live = Boolean(liveState);
    const text = blitzShareText({
      code: liveState?.code ?? deck.code,
      difficulte: liveState?.difficulte ?? deck.difficulte,
      live,
      link: live ? duelShareLink(liveState?.code ?? deck.code) : undefined,
      score: withScore && allow ? score : undefined,
      answered: withScore && allow ? answered : undefined,
      rivalName: withScore ? liveState?.rival?.name : undefined,
      rivalScore: withScore && allow ? liveState?.rival?.score : undefined,
    });
    if (withScore && !allow) {
      Alert.alert(
        "Partage du score désactivé",
        "Le code part sans ton score. Active « Partage de score Blitz » dans Profil → Confidentialité pour narguer tes potes."
      );
    }
    const encoded = encodeURIComponent(text);
    void Linking.openURL(`whatsapp://send?text=${encoded}`).catch(() =>
      Linking.openURL(blitzWhatsAppUrl(text))
    );
  };

  const loadDifficulty = (d: DifficulteFlash) => {
    if (d === difficulte) return;
    setDifficulte(d);
    setBlitzDifficulte(d);
    setDeck(blitzDeck(undefined, d));
  };

  const start = () => {
    leaveDuel();
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
      difficulte={difficulte}
      codeInput={codeInput}
      onCodeInput={(value) => {
        setJoinError("");
        setCodeInput(value);
      }}
      expanded={challengeOpen}
      onToggle={() => setChallengeOpen((v) => !v)}
      onInvite={() => {
        void inviteDuel().then((session) => {
          if (session) shareChallenge(false, session.snapshot());
        });
      }}
      onJoin={() => {
        void joinDuel(codeInput);
      }}
      incoming={Boolean(incoming)}
      busy={duelBusy}
      joinError={joinError}
    />
  );

  const hud = duel ? (
    <BlitzDuelHud
      me={{ name: duel.me.name, score, answered, done: phase === "done" }}
      rival={
        duel.rival
          ? { name: duel.rival.name, score: duel.rival.score, answered: duel.rival.answered, done: duel.rival.done }
          : null
      }
      code={phase === "lobby" || phase === "countdown" ? duel.code : undefined}
    />
  ) : null;

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
          <Pressable
            style={styles.back}
            onPress={() => {
              leaveDuel();
              navigation.goBack();
            }}
          >
            <Icon name="arrow-left" size={18} color={colors.white} />
          </Pressable>
        </View>
        {drawer}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.readyScroll} showsVerticalScrollIndicator={false}>
          <Spira scene="mode.blitz.ready" size={88} message="" />

          <Animated.View style={pulseStyle}>
            <BlitzRing value={60} progress={1} size={168} unit="sec" tone="critical" />
          </Animated.View>

          <Text style={styles.readyTitle}>Blitz</Text>
          <Text style={styles.readySub}>60 secondes. Mix de chapitres. Entre seul, ou invite un ami pour un Duel Blitz.</Text>

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
          <Text style={styles.diffHint}>{DIFF_META[difficulte].hint}</Text>

          <Pressable onPress={start} style={styles.startWrap}>
            <LinearGradient colors={["#EF4444", "#7F1D1D"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.start}>
              <Icon name="flame" size={18} color={colors.white} />
              <Text style={styles.startText}>Entrer dans l'arène</Text>
            </LinearGradient>
          </Pressable>
        </ScrollView>
      </>
    );
  }

  if (phase === "lobby" || phase === "countdown") {
    return shell(
      <>
        <View style={styles.topBar}>
          <Pressable
            style={styles.back}
            onPress={() => {
              leaveDuel();
              setPhase("ready");
              setChallengeOpen(true);
            }}
          >
            <Icon name="arrow-left" size={18} color={colors.white} />
          </Pressable>
        </View>
        <View style={styles.center}>
          <Text style={styles.lobbyKicker}>DUEL BLITZ</Text>
          <Text style={styles.readyTitle}>Arène collective</Text>
          <Text style={styles.readySub}>
            {duel?.rival
              ? "Les deux joueurs sont dans l'arène. Ça part."
              : "Envoie le code. Ton ami entre ici — vous jouez en même temps."}
          </Text>
          <View style={{ width: "100%", marginTop: 8 }}>{hud}</View>
          {phase === "countdown" ? (
            <Text style={styles.countHuge}>{countLeft}</Text>
          ) : (
            <>
              <Text style={styles.doneCode}>{duel?.code}</Text>
              <Text style={styles.waitHint}>{duelBusy ? "Connexion…" : "En attente du rival"}</Text>
              <Pressable style={styles.whatsapp} onPress={() => shareChallenge(false)}>
                <Text style={styles.whatsappText}>Envoie l'invitation</Text>
              </Pressable>
            </>
          )}
        </View>
      </>
    );
  }

  if (phase === "done") {
    const rivalScore = duel?.rival?.score ?? null;
    const rivalDone = duel?.rival?.done ?? false;
    const duelOutcome =
      !duel || rivalScore == null
        ? null
        : !rivalDone
          ? "pending"
          : score > rivalScore
            ? "win"
            : score < rivalScore
              ? "lose"
              : "draw";
    const badge =
      duel
        ? duelOutcome === "pending"
          ? "RIVAL ENCORE EN JEU"
          : duelOutcome === "win"
            ? "TU PRENDS L'ARÈNE"
            : duelOutcome === "lose"
              ? "RIVAL EN TÊTE"
              : "MATCH NUL"
        : survived
          ? "CHRONO TENU"
          : "CHRONO GAGNANT";
    return shell(
      <>
        <View style={styles.center}>
          <View style={[styles.dangerBadge, survived || duelOutcome === "win" ? styles.survivedBadge : null]}>
            <Icon name={survived || duelOutcome === "win" ? "flame" : "alert-circle"} size={14} color={survived || duelOutcome === "win" ? "#F97316" : "#F59E0B"} />
            <Text style={styles.dangerBadgeText}>{badge}</Text>
          </View>
          <Spira
            scene={duelOutcome === "lose" ? "mode.blitz.lose" : survived || duelOutcome === "win" ? "mode.blitz.win" : "mode.blitz.lose"}
            size={96}
            message={
              duel
                ? duelOutcome === "pending"
                  ? "Ton rival finit encore."
                  : duelOutcome === "win"
                    ? "L'arène est à toi."
                    : duelOutcome === "lose"
                      ? "Il a tenu plus juste."
                      : "Même arène, même score."
                : survived
                  ? "60 secondes. Tu as tenu."
                  : "Le chrono t'a eu. Reviens plus affûté."
            }
          />
          {duel ? <View style={{ width: "100%" }}>{hud}</View> : null}
          <Text style={styles.doneTitle}>
            {score}/{answered}
          </Text>
          <Text style={styles.doneSub}>
            {duel ? "Duel Blitz" : survived ? "Le mix n'a pas eu ta peau." : "Trop lent sur cette série."} · {deck.difficulte} · +{xp} XP
          </Text>
          {duel ? <Text style={styles.doneCode}>{duel.code}</Text> : null}
          {duel ? (
            <Pressable style={styles.whatsapp} onPress={() => shareChallenge(true)}>
              <Text style={styles.whatsappText}>Envoie le score sur WhatsApp</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => {
              leaveDuel();
              endedRef.current = false;
              warnedRef.current = false;
              setDeck(blitzDeck(undefined, difficulte));
              setTimeLeft(DURATION);
              setRingProgress(1);
              setRinging(false);
              setBurstKey(0);
              setChallengeOpen(true);
              setPhase("ready");
            }}
            style={styles.linkHit}
          >
            <Text style={styles.link}>Nouvelle série</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              leaveDuel();
              navigation.goBack();
            }}
            style={styles.linkHit}
          >
            <Text style={styles.link}>Quitter le défi</Text>
          </Pressable>
        </View>
      </>
    );
  }

  return shell(
    <>
      {duel ? (
        <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>{hud}</View>
      ) : (
        <View style={styles.playTop}>
          <Spira scene={critical ? "mode.blitz.panic" : "mode.blitz.play"} size={48} animated={false} />
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
      )}
      {duel ? (
        <View style={{ alignItems: "center", paddingTop: 4 }}>
          <Animated.View style={pulseStyle}>
            <BlitzRing
              value={timeLeft}
              progress={ringProgress}
              size={118}
              unit="sec"
              tone={ringTone(timeLeft)}
            />
          </Animated.View>
        </View>
      ) : null}
      {critical ? (
        <Text style={styles.criticalBanner}>{duel ? "ARÈNE COMMUNE — NE LÂCHE RIEN" : "DERNIÈRES SECONDES — NE LÂCHE RIEN"}</Text>
      ) : warning ? (
        <Text style={styles.warningBanner}>{duel ? "Le chrono se resserre pour vous deux" : "Le chrono se resserre"}</Text>
      ) : (
        <Text style={styles.liveHint}>{duel ? "Même arène. Même chrono." : "Pas de retour en arrière"}</Text>
      )}

      <View style={styles.playBody}>
        <Text style={styles.subject}>
          {(q.matiere ?? "MIX").toUpperCase()} · {deck.difficulte.toUpperCase()}
          {duel ? " · DUEL" : ""}
        </Text>
        <Text style={styles.q}>{q.enonceQuestion}</Text>
        {q.optionsProposees.map((opt, i) => {
          const picked = selected === i;
          const correct = i === q.indexReponseCorrecte;
          return (
          <Pressable
            key={i}
            onPressIn={() => pick(i)}
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
  readySub: { color: "rgba(254,202,202,0.72)", textAlign: "center", fontWeight: "600", lineHeight: 20, maxWidth: 320 },
  lobbyKicker: { color: "#FDE68A", fontWeight: "900", fontSize: 11, letterSpacing: 2.2 },
  countHuge: { color: "#FBBF24", fontWeight: "900", fontSize: 72, marginTop: 8 },
  waitHint: { color: "rgba(254,202,202,0.7)", fontWeight: "700", fontSize: 13 },
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
  doneCode: { color: "#FDE68A", fontWeight: "900", letterSpacing: 3, fontSize: 22, marginTop: 4 },
  whatsapp: { backgroundColor: "#25D366", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, marginTop: 8 },
  whatsappText: { color: colors.white, fontWeight: "800" },
  linkHit: { marginTop: 4, padding: 8 },
  link: { color: "#FCA5A5", fontWeight: "800" },
});
