import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AI_FAQ } from "../data/mock";
import { AI_DAILY_QUOTA, askTutor, remainingAiQuota, type TutorSource } from "../data/tutor";
import { useLearnFlowStore } from "../store/useLearnFlowStore";
import { useAppTheme } from "../theme/useAppTheme";
import Icon from "./Icon";

type Msg = { id: string; role: "user" | "ai"; text: string; source?: TutorSource };

const FAB = 46;
const GLOW = 72;
const TAB_ROW = 56;
const SUGGESTIONS = AI_FAQ.filter((f) =>
  ["Spira", "Guidé", "Blitz", "10/10", "discriminant", "tuteur"].some(
    (k) => f.q.includes(k) || (f.keywords ?? []).some((x) => x.toLowerCase().includes(k.toLowerCase()))
  )
).slice(0, 6);

function sourceLabel(source?: TutorSource): string | null {
  if (source === "faq") return "FAQ locale";
  if (source === "cloud") return "Question cloud";
  if (source === "exhausted") return "Quota atteint";
  return null;
}

function SphereCore({ size, dot, gap }: { size: number; dot: number; gap: number }) {
  const highlight = Math.max(8, Math.round(size * 0.28));
  return (
    <View style={[styles.sphereClip, { width: size, height: size, borderRadius: size / 2 }]}>
      <LinearGradient
        colors={["#E8F8FF", "#7DD3FC", "#38BDF8", "#0284C7"]}
        locations={[0, 0.32, 0.68, 1]}
        start={{ x: 0.12, y: 0.02 }}
        end={{ x: 0.92, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.sphereShine,
          {
            width: highlight,
            height: highlight * 0.72,
            borderRadius: highlight / 2,
            top: size * 0.14,
            left: size * 0.18,
          },
        ]}
      />
      <View style={styles.sphereDots}>
        <View style={[styles.dot, { width: dot, height: dot, borderRadius: dot / 2 }]} />
        <View style={[styles.dot, { width: dot, height: dot, borderRadius: dot / 2, marginLeft: gap }]} />
        <View style={[styles.dot, { width: dot, height: dot, borderRadius: dot / 2, marginLeft: gap }]} />
      </View>
    </View>
  );
}

function ChatFab({ bottom, onPress }: { bottom: number; onPress: () => void }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.12, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.42 + (1.12 - pulse.value) * 0.9,
  }));

  return (
    <View pointerEvents="box-none" style={[styles.fabWrap, { bottom }]}>
      <Animated.View style={[styles.glow, glowStyle]}>
        <LinearGradient
          colors={["rgba(125,211,252,0.45)", "rgba(56,189,248,0.28)", "rgba(14,165,233,0.2)"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={styles.glowFill}
        />
      </Animated.View>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir le tuteur"
        style={({ pressed }) => [styles.fabHit, { opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }]}
      >
        <SphereCore size={FAB} dot={5} gap={4} />
      </Pressable>
    </View>
  );
}

export default function FloatingChatbot() {
  const { colors, darkMode } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const firstName = useLearnFlowStore((s) => s.getActiveProfile().firstName);
  const consumeAiQuota = useLearnFlowStore((s) => s.consumeAiQuota);
  const aiQuotaRestant = useLearnFlowStore((s) => remainingAiQuota(s.aiQuotaRestant, s.aiQuotaDay));
  const listRef = useRef<FlatList<Msg>>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const welcomeId = useRef("welcome");

  const panelW = Math.min(width - 24, 380);
  const panelH = Math.min(Math.round(height * 0.62), 540);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [msgs, open]);

  useEffect(() => {
    if (!open) return;
    setMsgs((prev) =>
      prev.length
        ? prev
        : [
            {
              id: welcomeId.current,
              role: "ai",
              text: `Salut${firstName ? ` ${firstName}` : ""} ! Je suis le tuteur — pas Spira. FAQ hors ligne illimitée, et ${AI_DAILY_QUOTA} questions cloud par jour.`,
            },
          ]
    );
  }, [open, firstName]);

  const close = () => {
    setInput("");
    setOpen(false);
  };

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    setInput("");
    const reply = askTutor(q, consumeAiQuota);
    setMsgs((m) => [
      ...m,
      { id: `u-${Date.now()}`, role: "user", text: q },
      { id: `a-${Date.now()}`, role: "ai", text: reply.text, source: reply.source },
    ]);
  };

  return (
    <>
      {!open ? (
        <ChatFab
          bottom={TAB_ROW + Math.max(insets.bottom, 10) + 8}
          onPress={() => setOpen(true)}
        />
      ) : null}

      <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={close}>
        <KeyboardAvoidingView style={styles.modalRoot} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Pressable style={[styles.scrim, { backgroundColor: darkMode ? "rgba(2,6,23,0.55)" : "rgba(15,23,42,0.32)" }]} onPress={close} />
          <View pointerEvents="box-none" style={[styles.dock, { paddingBottom: Math.max(insets.bottom, 12) + 8, paddingRight: 12, paddingLeft: 12 }]}>
            <View
              style={[
                styles.panel,
                {
                  width: panelW,
                  height: panelH,
                  backgroundColor: colors.white,
                  borderColor: colors.border,
                  shadowColor: darkMode ? "#38BDF8" : "#0F172A",
                },
              ]}
            >
              <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <View style={styles.headerIcon}>
                  <SphereCore size={36} dot={3.5} gap={3} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.headerTitle}>Tuteur</Text>
                  <Text style={styles.headerSub}>
                    FAQ hors ligne · cloud {aiQuotaRestant}/{AI_DAILY_QUOTA}
                  </Text>
                </View>
                <Pressable onPress={close} hitSlop={8} style={styles.close} accessibilityLabel="Fermer le tuteur">
                  <Icon name="x" size={16} color="#FFFFFF" />
                </Pressable>
              </View>

              <FlatList
                ref={listRef}
                data={msgs}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const tag = sourceLabel(item.source);
                  return (
                    <View
                      style={[
                        styles.bubble,
                        item.role === "user"
                          ? { alignSelf: "flex-end", backgroundColor: colors.primary }
                          : { alignSelf: "flex-start", backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
                      ]}
                    >
                      {tag ? (
                        <Text style={[styles.sourceTag, { color: item.role === "user" ? "rgba(255,255,255,0.8)" : colors.primary }]}>
                          {tag}
                        </Text>
                      ) : null}
                      <Text style={[styles.bubbleText, { color: item.role === "user" ? colors.onPrimary : colors.textDark }]}>
                        {item.text}
                      </Text>
                    </View>
                  );
                }}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}
                keyboardShouldPersistTaps="handled"
              >
                {SUGGESTIONS.map((f) => (
                  <Pressable
                    key={f.q}
                    onPress={() => send(f.q)}
                    style={[styles.chip, { backgroundColor: colors.mathsBg, borderColor: colors.mathsBorder }]}
                  >
                    <Text style={[styles.chipText, { color: colors.primary }]}>{f.q}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.white }]}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.surfaceAlt, color: colors.textDark }]}
                  placeholder="Pose ta question…"
                  placeholderTextColor={colors.textMuted}
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={() => send(input)}
                  returnKeyType="send"
                  blurOnSubmit={false}
                />
                <Pressable
                  onPress={() => send(input)}
                  disabled={!input.trim()}
                  style={[styles.send, { backgroundColor: colors.primary, opacity: input.trim() ? 1 : 0.45 }]}
                  accessibilityLabel="Envoyer"
                >
                  <Icon name="send" size={16} color={colors.onPrimary} />
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fabWrap: {
    position: "absolute",
    right: 10,
    width: GLOW,
    height: GLOW,
    zIndex: 80,
    elevation: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: GLOW,
    height: GLOW,
    borderRadius: GLOW / 2,
  },
  glowFill: {
    flex: 1,
    borderRadius: GLOW / 2,
  },
  fabHit: {
    width: FAB,
    height: FAB,
    borderRadius: FAB / 2,
    overflow: "hidden",
    shadowColor: "#38BDF8",
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  sphereClip: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  sphereShine: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.78)",
  },
  sphereDots: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: { backgroundColor: "#FFFFFF" },
  modalRoot: { flex: 1 },
  scrim: { ...StyleSheet.absoluteFill },
  dock: { flex: 1, justifyContent: "flex-end", alignItems: "flex-end" },
  panel: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  headerTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  headerSub: { color: "rgba(255,255,255,0.82)", fontSize: 11, fontWeight: "600", marginTop: 1 },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  list: { padding: 12, gap: 8, flexGrow: 1 },
  bubble: { maxWidth: "88%", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  sourceTag: { fontSize: 10, fontWeight: "800", marginBottom: 4, textTransform: "uppercase" },
  bubbleText: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
  chips: { paddingHorizontal: 12, paddingBottom: 8, gap: 8, alignItems: "center" },
  chip: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  chipText: { fontSize: 11, fontWeight: "700" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  send: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
