import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import Icon from "./Icon";

type Props = {
  code: string;
  codeInput: string;
  onCodeInput: (value: string) => void;
  expanded: boolean;
  onToggle: () => void;
  onCreate: () => void;
  onJoin: () => void;
  onShare: () => void;
};

export default function BlitzChallengeDrawer({
  code,
  codeInput,
  onCodeInput,
  expanded,
  onToggle,
  onCreate,
  onJoin,
  onShare,
}: Props) {
  return (
    <Animated.View layout={LinearTransition.duration(240)} style={styles.wrap}>
      <Pressable onPress={onToggle} style={styles.handle} accessibilityRole="button" accessibilityLabel="Défi ami">
        <View style={styles.handlePill} />
        <View style={styles.handleRow}>
          <View style={styles.handleLeft}>
            <Icon name="zap" size={14} color="#84CC16" />
            <Text style={styles.handleTitle}>Défi ami</Text>
          </View>
          <Text style={styles.handleCode}>{code}</Text>
          <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} color="rgba(255,255,255,0.7)" />
        </View>
        {!expanded ? (
          <Text style={styles.handleHint}>Déroule pour créer ou rejoindre un code</Text>
        ) : null}
      </Pressable>

      {expanded ? (
        <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(120)} style={styles.body}>
          <Text style={styles.label}>Ton code — même série pour tes amis</Text>
          <Text style={styles.codeHuge}>{code}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.action} onPress={onCreate}>
              <Icon name="refresh-cw" size={14} color="#FDE68A" />
              <Text style={styles.actionText}>Nouveau</Text>
            </Pressable>
            <Pressable style={styles.action} onPress={onShare}>
              <Icon name="share" size={14} color="#86EFAC" />
              <Text style={styles.actionText}>Envoyer</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>Rejoindre le défi d'un ami</Text>
          <View style={styles.joinRow}>
            <TextInput
              value={codeInput}
              onChangeText={onCodeInput}
              placeholder="LF-MXXXX"
              placeholderTextColor="rgba(255,255,255,0.35)"
              autoCapitalize="characters"
              autoCorrect={false}
              style={styles.input}
            />
            <Pressable style={styles.joinBtn} onPress={onJoin}>
              <Text style={styles.joinBtnText}>OK</Text>
            </Pressable>
          </View>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "rgba(0,0,0,0.42)",
    borderWidth: 1,
    borderColor: "rgba(132,204,22,0.35)",
    borderRadius: 22,
    overflow: "hidden",
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
  handleTitle: { color: "#ECFDF5", fontWeight: "800", fontSize: 13 },
  handleCode: { color: "#84CC16", fontWeight: "900", letterSpacing: 1.4, fontSize: 13 },
  handleHint: { color: "rgba(236,253,245,0.45)", fontSize: 11, fontWeight: "600", marginTop: 6 },
  body: { paddingHorizontal: 16, paddingBottom: 16, gap: 10, borderTopWidth: 1, borderTopColor: "rgba(132,204,22,0.18)" },
  label: { color: "rgba(236,253,245,0.55)", fontSize: 11, fontWeight: "800", marginTop: 6 },
  codeHuge: { color: "#F7FEE7", fontSize: 28, fontWeight: "900", letterSpacing: 2, textAlign: "center" },
  actions: { flexDirection: "row", gap: 8 },
  action: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(132,204,22,0.12)",
    borderWidth: 1,
    borderColor: "rgba(132,204,22,0.35)",
  },
  actionText: { color: "#ECFDF5", fontWeight: "800", fontSize: 13 },
  joinRow: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(132,204,22,0.35)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  joinBtn: {
    backgroundColor: "#84CC16",
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  joinBtnText: { color: "#14532D", fontWeight: "900" },
});
