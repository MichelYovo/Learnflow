import React, { useCallback, useEffect, useState } from "react";
import { AccessibilityInfo, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  pickSpiraQuip,
  resolveSpiraScene,
  SPIRA_PEEK_MOODS,
  type SpiraMoodId,
  type SpiraScene,
} from "../data/spira";
import { useAppTheme } from "../theme/useAppTheme";

export type { SpiraMoodId, SpiraScene } from "../data/spira";

/** Anciens noms conservés pour les écrans existants. */
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
  interactive,
  wander,
}: Props) {
  const { colors } = useAppTheme();
  const fromScene = scene ? resolveSpiraScene(scene) : null;
  const baseMood = resolveSpiraMood(mood ?? fromScene?.mood ?? "neutre");
  const text = message === "" ? undefined : (message ?? fromScene?.message);
  const canTap = interactive ?? size >= 52;
  const canWander = wander ?? size >= 64;
  const range = canWander ? Math.min(36, Math.max(14, Math.round(size * 0.32))) : 0;

  const [reduce, setReduce] = useState(false);
  const [flash, setFlash] = useState<SpiraMoodId | null>(null);
  const [quip, setQuip] = useState<string | null>(null);

  const bob = useSharedValue(0);
  const hop = useSharedValue(0);
  const tilt = useSharedValue(0);
  const look = useSharedValue(0);
  const wanderX = useSharedValue(0);

  useEffect(() => {
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduce);
    AccessibilityInfo.isReduceMotionEnabled().then(setReduce);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    cancelAnimation(bob);
    cancelAnimation(tilt);
    bob.value = 0;
    tilt.value = 0;
    if (!animated || reduce) return;
    bob.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 880, easing: ease }),
        withTiming(0, { duration: 880, easing: ease }),
      ),
      -1,
      false,
    );
    tilt.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2100, easing: ease }),
        withTiming(-1, { duration: 2100, easing: ease }),
      ),
      -1,
      true,
    );
    return () => {
      cancelAnimation(bob);
      cancelAnimation(tilt);
    };
  }, [animated, reduce, bob, tilt]);

  useEffect(() => {
    if (!animated || reduce) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      timer = setTimeout(() => {
        if (cancelled) return;
        const roll = Math.random();
        if (canWander && roll < 0.42) {
          const next = (Math.floor(Math.random() * 3) - 1) * range;
          wanderX.value = withSpring(next, { damping: 14, stiffness: 180 });
          hop.value = withSequence(
            withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 320, easing: Easing.bounce }),
          );
        } else if (roll < 0.72) {
          look.value = withSequence(
            withTiming(1, { duration: 260 }),
            withTiming(-1, { duration: 340 }),
            withTiming(0, { duration: 260 }),
          );
        } else {
          hop.value = withSequence(
            withTiming(0.55, { duration: 140 }),
            withTiming(0, { duration: 220 }),
          );
          setFlash(SPIRA_PEEK_MOODS[Math.floor(Math.random() * SPIRA_PEEK_MOODS.length)]);
          setTimeout(() => {
            if (!cancelled) setFlash(null);
          }, 720);
        }
        loop();
      }, 2200 + Math.random() * 2600);
    };
    loop();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [animated, canWander, range, reduce, hop, look, wanderX]);

  const react = useCallback(() => {
    if (!canTap || reduce) return;
    hop.value = withSequence(
      withTiming(1.35, { duration: 180, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 420, easing: Easing.bounce }),
    );
    look.value = withSequence(
      withTiming(1, { duration: 140 }),
      withTiming(-1, { duration: 180 }),
      withTiming(0, { duration: 200 }),
    );
    setFlash(Math.random() > 0.45 ? "joyeux" : "surpris");
    setQuip(pickSpiraQuip());
    setTimeout(() => setFlash(null), 900);
    setTimeout(() => setQuip(null), 2200);
  }, [canTap, reduce, hop, look]);

  const anim = useAnimatedStyle(() => ({
    transform: [
      { perspective: 640 },
      { translateX: wanderX.value },
      { translateY: -8 * bob.value - 20 * hop.value },
      { rotate: `${tilt.value * 7}deg` },
      { rotateY: `${look.value * 22}deg` },
      { scale: 1 + 0.045 * bob.value + 0.08 * hop.value },
    ],
  }));

  const ground = useAnimatedStyle(() => ({
    opacity: 0.18 - 0.08 * hop.value,
    transform: [{ scaleX: 1.05 - 0.18 * bob.value - 0.22 * hop.value }, { scaleY: 1 }],
  }));

  const id = flash ?? baseMood;
  const live = animated && !reduce;

  const sprite = (
    <View style={[styles.stage, { width: size + range * 2, height: size + 10 }]}>
      {quip ? (
        <View style={[styles.quip, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <Text style={[styles.quipText, { color: colors.textDark }]}>{quip}</Text>
        </View>
      ) : null}
      {live ? <Animated.View pointerEvents="none" style={[styles.ground, { width: size * 0.48 }, ground]} /> : null}
      <Animated.View style={[styles.sprite, live ? anim : null]}>
        <Image
          source={ASSETS[id]}
          style={{ width: size, height: size }}
          resizeMode="contain"
          accessibilityLabel={canTap ? "Spira — touche-moi" : `Spira ${id}`}
        />
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.wrap}>
      {canTap ? (
        <Pressable onPress={react} accessibilityRole="button" accessibilityLabel="Spira — touche-moi">
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
  stage: {
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "visible",
  },
  sprite: {
    overflow: "visible",
    shadowColor: "#0F172A",
    shadowOpacity: 0.22,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  ground: {
    position: "absolute",
    bottom: 2,
    height: 8,
    borderRadius: 99,
    backgroundColor: "#0F172A",
  },
  quip: {
    position: "absolute",
    top: -2,
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
