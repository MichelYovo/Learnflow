import React, { useCallback, useEffect, useState } from "react";
import { AccessibilityInfo, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { pickSpiraQuip, resolveSpiraScene, type SpiraMoodId, type SpiraScene } from "../data/spira";
import { useAppTheme } from "../theme/useAppTheme";

export type { SpiraMoodId, SpiraScene } from "../data/spira";

export type SpiraMood = SpiraMoodId | "idle" | "happy" | "encourage" | "think" | "wink";

const ASSETS: Record<SpiraMoodId, number> = {
  joyeux: require("../../assets/spira/joyeux.png"),
  calme: require("../../assets/spira/calme.png"),
  confiant: require("../../assets/spira/confiant.png"),
  triste: require("../../assets/spira/triste.png"),
  enerve: require("../../assets/spira/enerve.png"),
  timide: require("../../assets/spira/timide.png"),
  surpris: require("../../assets/spira/surpris.png"),
  neutre: require("../../assets/spira/neutre.png"),
  determine: require("../../assets/spira/determine.png"),
  fatigue: require("../../assets/spira/fatigue.png"),
};

const ALIAS: Record<string, SpiraMoodId> = {
  idle: "neutre",
  happy: "joyeux",
  encourage: "calme",
  think: "confiant",
  wink: "timide",
};

export function resolveSpiraMood(mood: SpiraMood): SpiraMoodId {
  if (mood in ASSETS) return mood as SpiraMoodId;
  return ALIAS[mood] ?? "neutre";
}

type Props = {
  mood?: SpiraMood;
  scene?: SpiraScene;
  size?: number;
  message?: string;
  animated?: boolean;
  interactive?: boolean;
  wander?: boolean;
};

const ease = Easing.inOut(Easing.sin);

export default function Spira({
  mood,
  scene,
  size = 64,
  message,
  animated = true,
  interactive = false,
}: Props) {
  const { colors } = useAppTheme();
  const fromScene = scene ? resolveSpiraScene(scene) : null;
  const id = resolveSpiraMood(mood ?? fromScene?.mood ?? "neutre");
  const text = message === "" ? undefined : (message ?? fromScene?.message);
  const [reduce, setReduce] = useState(false);
  const [quip, setQuip] = useState<string | null>(null);

  const bob = useSharedValue(0);
  const hop = useSharedValue(0);

  useEffect(() => {
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    cancelAnimation(bob);
    cancelAnimation(hop);
    bob.value = 0;
    hop.value = 0;
    if (!animated || reduce) return;
    hop.value = withSequence(
      withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) }),
      withTiming(-0.35, { duration: 250, easing: Easing.inOut(Easing.quad) }),
      withTiming(0.2, { duration: 220, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 230, easing: Easing.out(Easing.quad) }),
    );
    const t = setTimeout(() => {
      bob.value = withRepeat(
        withSequence(withTiming(1, { duration: 1400, easing: ease }), withTiming(0, { duration: 1400, easing: ease })),
        -1,
        false,
      );
    }, 900);
    return () => {
      clearTimeout(t);
      cancelAnimation(bob);
      cancelAnimation(hop);
    };
  }, [animated, reduce, bob, hop]);

  const react = useCallback(() => {
    if (!interactive || reduce) return;
    hop.value = withSequence(
      withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 360, easing: Easing.out(Easing.quad) }),
    );
    setQuip(pickSpiraQuip());
    setTimeout(() => setQuip(null), 1800);
  }, [interactive, reduce, hop]);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateY: -10 * hop.value - 4 * bob.value },
      { scaleX: 1 - 0.06 * Math.max(0, hop.value) + 0.08 * Math.max(0, -hop.value) + 0.025 * bob.value },
      { scaleY: 1 + 0.1 * Math.max(0, hop.value) - 0.08 * Math.max(0, -hop.value) - 0.02 * bob.value },
    ],
  }));

  const live = animated && !reduce;
  const sprite = (
    <View style={[styles.stage, { width: size, height: size }]}>
      {quip ? (
        <View style={[styles.quip, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <Text style={[styles.quipText, { color: colors.textDark }]}>{quip}</Text>
        </View>
      ) : null}
      <Animated.View style={[styles.sprite, live ? anim : null]}>
        <Image source={ASSETS[id]} style={{ width: size, height: size }} resizeMode="contain" accessibilityLabel="Spira" />
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.wrap}>
      {interactive ? (
        <Pressable onPress={react} accessibilityRole="button" accessibilityLabel="Spira">
          {sprite}
        </Pressable>
      ) : (
        sprite
      )}
      {text ? (
        <View style={[styles.bubble, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <Text style={[styles.bubbleText, { color: colors.textDark }]}>{text}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 8, overflow: "visible" },
  stage: { alignItems: "center", justifyContent: "flex-end", overflow: "visible" },
  sprite: {
    overflow: "visible",
    shadowColor: "#0F172A",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  quip: {
    position: "absolute",
    top: -6,
    zIndex: 2,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  quipText: { fontSize: 11, fontWeight: "800" },
  bubble: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 280,
  },
  bubbleText: { fontSize: 16, fontWeight: "700", textAlign: "center", lineHeight: 22 },
});
