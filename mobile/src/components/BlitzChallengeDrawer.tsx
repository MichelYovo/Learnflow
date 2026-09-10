import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import Icon from "./Icon";
import type { DifficulteFlash } from "../types/learnflow";

type Props = {
  difficulte: DifficulteFlash;
  codeInput: string;
  onCodeInput: (value: string) => void;
  expanded: boolean;
  onToggle: () => void;
  onInvite: () => void;
  onJoin: () => void;
  incoming?: boolean;
  busy?: boolean;
  joinError?: string;
};

export default function BlitzChallengeDrawer({
  difficulte,
  codeInput,
  onCodeInput,
  expanded,
  onToggle,
  onInvite,
  onJoin,
  incoming,
  busy,
  joinError,
}: Props) {
  return (
    <Animated.View layout={LinearTransition.duration(240)} style={[styles.wrap, incoming && styles.wrapHot]}>
      <Pressable onPress={onToggle} style={styles.handle} accessibilityRole="button" accessibilityLabel="Ouvrir le Duel Blitz">
        <View style={styles.handlePill} />
        <View style={styles.handleRow}>
          <View style={styles.handleLeft}>
            <Icon name="people" size={15} color="#FBBF24" />
            <Text style={styles.handleTitle}>{incoming ? "Duel reçu" : "Duel Blitz"}</Text>
          </View>
          <Text style={styles.handleCode}>{difficulte}</Text>
          <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} color="rgba(255,255,255,0.7)" />
        </View>
        {!expanded ? (
          <Text style={styles.handleHint}>
            {incoming ? "Un ami t'attend — ouvre pour entrer dans l'arène" : "Invite un ami : même arène, en même temps"}
          </Text>
        ) : null}
      </Pressable>

      {expanded ? (
        <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)} style={styles.body}>
          {incoming ? <Text style={styles.bannerWait}>Un ami t'attend dans l'arène</Text> : null}
          <Text style={styles.hook}>Invite un ami : vous jouez en même temps, mêmes questions, même chrono.</Text>
          <Pressable style={styles.whatsapp} onPress={onInvite} disabled={busy}>
            <Icon name="share" size={14} color="#fff" />
            <Text style={styles.whatsappText}>{busy ? "Ouverture…" : "Inviter un ami"}</Text>
          </Pressable>
          <Text style={styles.label}>On t'a défié ? Colle son code</Text>
          <View style={styles.joinRow}>
            <TextInput
              value={codeInput}
              onChangeText={onCodeInput}
              placeholder="Code du rival"
              placeholderTextColor="rgba(255,255,255,0.35)"
              autoCapitalize="characters"
              autoCorrect={false}
              style={styles.input}
            />
            <Pressable style={styles.joinBtn} onPress={onJoin} disabled={busy}>
              <Text style={styles.joinBtnText}>Entrer</Text>
            </Pressable>
          </View>
          {joinError ? <Text style={styles.error}>{joinError}</Text> : null}
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "rgba(0,0,0,0.48)",
    borderWidth: 1.5,
    borderColor: "rgba(251,146,60,0.45)",
    borderRadius: 24,
    overflow: "hidden",
  },
  wrapHot: {
    borderColor: "rgba(251,191,36,0.75)",
  },
  handle: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 },
  handlePill: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.28)",
    marginBottom: 10,
  },
  handleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  handleLeft: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  handleTitle: { color: "#FDE68A", fontWeight: "800", fontSize: 13 },
  handleCode: { color: "#FBBF24", fontWeight: "900", letterSpacing: 1.6, fontSize: 14 },
  handleHint: { color: "rgba(254,243,199,0.55)", fontSize: 11, fontWeight: "600", marginTop: 6 },
  body: { paddingHorizontal: 16, paddingBottom: 16, gap: 10, borderTopWidth: 1, borderTopColor: "rgba(251,146,60,0.22)" },
  bannerWait: {
    color: "#FDE68A",
    backgroundColor: "rgba(245,158,11,0.16)",
    textAlign: "center",
    fontWeight: "800",
    fontSize: 13,
    paddingVertical: 8,
    borderRadius: 14,
    overflow: "hidden",
  },
  hook: { color: "rgba(254,202,202,0.78)", fontSize: 13, fontWeight: "700", textAlign: "center", lineHeight: 18 },
  whatsapp: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "#25D366",
  },
  whatsappText: { color: "#fff", fontWeight: "900", fontSize: 13 },
  label: { color: "rgba(254,243,199,0.55)", fontSize: 11, fontWeight: "800", marginTop: 4 },
  joinRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.4)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  joinBtn: {
    backgroundColor: "#F59E0B",
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  joinBtnText: { color: "#111", fontWeight: "900" },
  error: { color: "#FCA5A5", fontWeight: "700", fontSize: 12, textAlign: "center" },
});
