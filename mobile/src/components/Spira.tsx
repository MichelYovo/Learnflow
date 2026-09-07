import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
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
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 720, easing: ease }),
        withTiming(0, { duration: 720, easing: ease })
      ),
      -1,
      false
    );
    return () => cancelAnimation(t);
  }, [animated, t]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: -8 * t.value }, { scale: 1 + 0.04 * t.value }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.stage, animated ? anim : null]}>
        <Image
          source={ASSETS[id]}
          style={{ width: size, height: size }}
          resizeMode="contain"
          accessibilityLabel={`Spira ${id}`}
        />
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
  stage: {
    overflow: "visible",
    shadowColor: "#0F172A",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 0,
  },
  bubble: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: 280,
  },
  bubbleText: { fontSize: 16, fontWeight: "700", textAlign: "center", lineHeight: 22 },
});
