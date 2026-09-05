import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { resolveSpiraScene, type SpiraMoodId, type SpiraScene } from "../data/spira";
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
  /** Humeur explicite. Si `scene` est fourni, sert de surcharge. */
  mood?: SpiraMood;
  /** Scène catalogue — nature + message par défaut. */
  scene?: SpiraScene;
  size?: number;
  message?: string;
  animated?: boolean;
};

const ease = Easing.inOut(Easing.quad);

export default function Spira({ mood, scene, size = 64, message, animated = true }: Props) {
  const { colors } = useAppTheme();
  const fromScene = scene ? resolveSpiraScene(scene) : null;
  const id = resolveSpiraMood(mood ?? fromScene?.mood ?? "neutre");
  const text = message ?? fromScene?.message;
  const t = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(t);
    t.value = 0;
    if (!animated) return;

    const loop = (duration: number) =>
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: ease }),
          withTiming(0, { duration, easing: ease })
        ),
        -1,
        false
      );

    if (id === "enerve") {
      t.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 45 }),
          withTiming(-1, { duration: 45 }),
          withTiming(0.7, { duration: 45 }),
          withTiming(-0.7, { duration: 45 }),
          withTiming(0, { duration: 50 }),
          withDelay(520, withTiming(0, { duration: 1 }))
        ),
        -1,
        false
      );
      return;
    }

    if (id === "surpris") {
      t.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 220, easing: Easing.out(Easing.back(2)) }),
          withTiming(0.35, { duration: 380, easing: ease }),
          withDelay(640, withTiming(0.35, { duration: 1 }))
        ),
        -1,
        false
      );
      return;
    }

    const duration =
      id === "joyeux"
        ? 420
        : id === "fatigue" || id === "calme"
          ? 1100
          : id === "triste"
            ? 900
            : 700;
    t.value = loop(duration);

    return () => cancelAnimation(t);
  }, [animated, id, t]);

  const anim = useAnimatedStyle(() => {
    const v = t.value;
    switch (id) {
      case "joyeux":
        return { transform: [{ translateY: -12 * v }, { scale: 1 + 0.07 * v }] };
      case "calme":
        return { transform: [{ translateY: -8 * v }] };
      case "confiant":
        return { transform: [{ rotate: `${-6 + 12 * v}deg` }, { scale: 1 + 0.04 * v }] };
      case "triste":
        return { transform: [{ translateY: 6 * v }, { rotate: `${4 * v}deg` }] };
      case "enerve":
        return { transform: [{ translateX: v * 7 }, { rotate: `${v * 5}deg` }] };
      case "timide":
        return { transform: [{ scale: 0.92 + 0.08 * v }, { translateY: 4 * (1 - v) }] };
      case "surpris":
        return { transform: [{ scale: 0.86 + 0.22 * v }] };
      case "neutre":
        return { transform: [{ scale: 1 + 0.03 * v }] };
      case "determine":
        return { transform: [{ scale: 1 + 0.08 * v }, { translateY: -4 * v }] };
      case "fatigue":
        return { transform: [{ translateY: 5 * v }, { rotate: `${-5 + 10 * v}deg` }] };
      default:
        return { transform: [{ scale: 1 }] };
    }
  });

  return (
    <View style={styles.wrap}>
      <Animated.View entering={FadeIn.duration(280)} key={id} style={styles.stage}>
        <Animated.View style={[styles.stage, anim]}>
          <Image
            source={ASSETS[id]}
            style={{ width: size, height: size }}
            resizeMode="contain"
            accessibilityLabel={`Spira ${id}`}
          />
        </Animated.View>
      </Animated.View>
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
  stage: { overflow: "visible" },
  bubble: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 280,
  },
  bubbleText: { fontSize: 16, fontWeight: "700", textAlign: "center", lineHeight: 22 },
});
