import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Particle = { dx: number; dy: number; color: string; size: number; delay: number };

const PARTICLES: Particle[] = [
  { dx: -36, dy: -68, color: "#34D399", size: 9, delay: 0 },
  { dx: 42, dy: -62, color: "#FBBF24", size: 7, delay: 20 },
  { dx: 62, dy: -18, color: "#6EE7B7", size: 8, delay: 40 },
  { dx: 48, dy: 44, color: "#A7F3D0", size: 6, delay: 10 },
  { dx: -8, dy: 58, color: "#F59E0B", size: 8, delay: 30 },
  { dx: -58, dy: 28, color: "#10B981", size: 7, delay: 15 },
  { dx: -64, dy: -22, color: "#FDE68A", size: 6, delay: 35 },
  { dx: 12, dy: -78, color: "#34D399", size: 5, delay: 50 },
];

type Props = {
  trigger: number;
  label?: string;
  /** Arena = fond sombre Blitz. */
  tone?: "mint" | "arena";
};

function Spark({ trigger, dx, dy, color, size, delay }: Particle & { trigger: number }) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const o = useSharedValue(0);
  const s = useSharedValue(0.3);

  useEffect(() => {
    if (trigger <= 0) return;
    x.value = 0;
    y.value = 0;
    o.value = 1;
    s.value = 0.35;
    x.value = withDelay(delay, withTiming(dx, { duration: 480, easing: Easing.out(Easing.cubic) }));
    y.value = withDelay(delay, withTiming(dy, { duration: 480, easing: Easing.out(Easing.cubic) }));
    s.value = withDelay(delay, withTiming(1, { duration: 180 }));
    o.value = withDelay(delay + 120, withTiming(0, { duration: 380 }));
  }, [trigger, delay, dx, dy, o, s, x, y]);

  const style = useAnimatedStyle(() => ({
    opacity: o.value,
    transform: [{ translateX: x.value }, { translateY: y.value }, { scale: s.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.spark,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color, marginLeft: -size / 2, marginTop: -size / 2 },
        style,
      ]}
    />
  );
}

export default function CorrectBurst({ trigger, label = "Bien joué", tone = "mint" }: Props) {
  const pop = useSharedValue(0);
  const rise = useSharedValue(8);
  const arena = tone === "arena";

  useEffect(() => {
    if (trigger <= 0) return;
    pop.value = 0;
    rise.value = 10;
    pop.value = withSequence(
      withTiming(1, { duration: 160, easing: Easing.out(Easing.back(1.6)) }),
      withDelay(280, withTiming(0, { duration: 220 }))
    );
    rise.value = withTiming(-18, { duration: 560, easing: Easing.out(Easing.quad) });
  }, [trigger, pop, rise]);

  const chip = useAnimatedStyle(() => ({
    opacity: pop.value,
    transform: [{ translateY: rise.value }, { scale: 0.86 + pop.value * 0.18 }],
  }));

  if (trigger <= 0) return null;

  return (
    <View pointerEvents="none" style={styles.wrap}>
      {PARTICLES.map((p, i) => (
        <Spark key={`${trigger}-${i}`} trigger={trigger} {...p} />
      ))}
      <Animated.View
        style={[
          styles.chip,
          arena ? styles.chipArena : styles.chipMint,
          chip,
        ]}
      >
        <Text style={[styles.chipText, arena && styles.chipTextArena]}>{label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40,
  },
  spark: {
    position: "absolute",
    top: "42%",
    left: "50%",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  chipMint: {
    backgroundColor: "rgba(16,185,129,0.16)",
    borderColor: "rgba(16,185,129,0.55)",
  },
  chipArena: {
    backgroundColor: "rgba(16,185,129,0.22)",
    borderColor: "rgba(52,211,153,0.7)",
  },
  chipText: {
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 0.4,
    color: "#059669",
  },
  chipTextArena: {
    color: "#A7F3D0",
  },
});
