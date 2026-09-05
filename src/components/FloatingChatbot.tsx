import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AI_FAQ, replyAsLocalTutor } from "../data/mock";
import { useAppTheme } from "../theme/useAppTheme";
import Icon from "./Icon";
import Spira from "./Spira";

type Msg = { id: string; role: "user" | "ai"; text: string };

const WELCOME: Msg = {
  id: "welcome",
  role: "ai",
  text: "Salut ! Je suis le tuteur local. Pose une question, ou tape une suggestion.",
};

const FAB = 56;
const TAB_BAR = 56;

export default function FloatingChatbot() {
  const { colors, darkMode } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const listRef = useRef<FlatList<Msg>>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [kb, setKb] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);

  useEffect(() => {
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvt, (e) => setKb(e.endCoordinates.height));
    const hide = Keyboard.addListener(hideEvt, () => setKb(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    return () => clearTimeout(t);
  }, [msgs, open]);

  const tabPad = TAB_BAR + Math.max(insets.bottom, 10) + 12;
  const bottom = kb > 0 ? kb + 8 : tabPad;
  const panelW = Math.min(width - 28, 360);
  const panelH = Math.min(height * 0.52, 440);

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    setInput("");
    const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", text: q };
    const aiMsg: Msg = { id: `a-${Date.now()}`, role: "ai", text: replyAsLocalTutor(q) };
    setMsgs((m) => [...m, userMsg, aiMsg]);
  };

  const close = () => {
    Keyboard.dismiss();
    setOpen(false);
  };

  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, styles.layer]}>
      {open ? (
        <Animated.View
          entering={FadeIn.duration(160)}
          exiting={FadeOut.duration(120)}
          pointerEvents="auto"
          style={[styles.backdrop, { backgroundColor: darkMode ? "rgba(2,6,23,0.55)" : "rgba(15,23,42,0.28)" }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Fermer le tuteur" />
        </Animated.View>
      ) : null}

      <View pointerEvents="box-none" style={[styles.anchor, { bottom, right: 16 }]}>
        {open ? (
          <Animated.View
            entering={FadeIn.duration(180)}
            exiting={FadeOut.duration(120)}
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
            <View style={[styles.panelHeader, { borderBottomColor: colors.border, backgroundColor: colors.surfaceAlt }]}>
              <Spira scene="tutor.ready" size={36} animated={false} message="" />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.panelTitle, { color: colors.textDark }]}>Tuteur</Text>
              </View>
              <Pressable
                onPress={close}
                hitSlop={8}
                style={[styles.closeBtn, { backgroundColor: colors.white, borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel="Fermer le tuteur"
              >
                <Icon name="x" size={16} color={colors.textDark} />
              </Pressable>
            </View>

            <FlatList
              ref={listRef}
              data={msgs}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.bubble,
                    item.role === "user"
                      ? { alignSelf: "flex-end", backgroundColor: colors.primary }
                      : { alignSelf: "flex-start", backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderWidth: 1 },
                  ]}
                >
                  <Text style={[styles.bubbleText, { color: item.role === "user" ? colors.onPrimary : colors.textDark }]}>
                    {item.text}
                  </Text>
                </View>
              )}
              ListFooterComponent={
                msgs.length <= 2 ? (
                  <View style={styles.chips}>
                    {AI_FAQ.slice(0, 4).map((f) => (
                      <Pressable
                        key={f.q}
                        onPress={() => send(f.q)}
                        style={[styles.chip, { backgroundColor: colors.mathsBg, borderColor: colors.mathsBorder }]}
                      >
                        <Text style={[styles.chipText, { color: colors.primary }]} numberOfLines={1}>
                          {f.q}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null
              }
            />

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
                style={[styles.send, { backgroundColor: colors.primary, opacity: input.trim() ? 1 : 0.55 }]}
                onPress={() => send(input)}
                accessibilityRole="button"
                accessibilityLabel="Envoyer"
              >
                <Icon name="send" size={16} color={colors.onPrimary} />
              </Pressable>
            </View>
          </Animated.View>
        ) : null}

        <Pressable
          onPress={() => (open ? close() : setOpen(true))}
          accessibilityRole="button"
          accessibilityLabel={open ? "Fermer le tuteur" : "Ouvrir le tuteur"}
          style={({ pressed }) => [
            styles.fab,
            {
              backgroundColor: colors.primary,
              shadowColor: darkMode ? "#38BDF8" : "#1677FF",
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Icon name={open ? "x" : "message-square"} size={22} color={colors.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    zIndex: 80,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  anchor: {
    position: "absolute",
    alignItems: "flex-end",
    gap: 10,
  },
  fab: {
    width: FAB,
    height: FAB,
    borderRadius: FAB / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
  },
  panel: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  panelTitle: { fontWeight: "800", fontSize: 14 },
  panelSub: { fontSize: 11, fontWeight: "500", marginTop: 1 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { padding: 12, gap: 8, paddingBottom: 4 },
  bubble: { maxWidth: "88%", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  bubbleText: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, paddingTop: 4 },
  chip: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: "100%",
  },
  chipText: { fontSize: 11, fontWeight: "700" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
