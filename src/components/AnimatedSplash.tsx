import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Logo from "./Logo";

/** Hold blanc 2 min 50 avant le flash d’entrée (premier lancement). */
export const INTRO_HOLD_MS = 170_000;
const SHORT_HOLD_MS = 1_600;
const FLASH_MS = 420;

type Props = {
  onFinish: () => void;
  /** Store hydraté — sans ça, logo stagnant seulement. */
  ready?: boolean;
  /** Premier lancement : hold long + flash. Sinon hold court. */
  cinematic?: boolean;
};

export default function AnimatedSplash({ onFinish, ready = true, cinematic = false }: Props) {
  const screenOpacity = useSharedValue(1);
  const gra = useSharedValue(0);
  const bim = useSharedValue(0);
  const onFinishRef = useRef(onFinish);
  const finished = useRef(false);

  onFinishRef.current = onFinish;

  const done = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinishRef.current();
  }, []);

  useEffect(() => {
    if (!ready) return;
    finished.current = false;
    screenOpacity.value = 1;
    gra.value = 0;
    bim.value = 0;

    const holdMs = cinematic ? INTRO_HOLD_MS : SHORT_HOLD_MS;

    if (cinematic) {
      gra.value = withDelay(
        holdMs,
        withSequence(
          withTiming(0.85, { duration: 50, easing: Easing.out(Easing.quad) }),
          withTiming(0.04, { duration: 50 })
        )
      );
      bim.value = withDelay(
        holdMs + 100,
        withSequence(
          withTiming(1, { duration: 70, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 90 }),
          withTiming(0, { duration: 180 })
        )
      );
    }

    screenOpacity.value = withDelay(
      holdMs + (cinematic ? FLASH_MS - 180 : 0),
      withTiming(0, { duration: cinematic ? 180 : 420, easing: Easing.out(Easing.quad) }, (ok) => {
        if (ok) runOnJS(done)();
      })
    );

    const fallback = setTimeout(done, holdMs + FLASH_MS + 400);
    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, cinematic]);

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));
  const graStyle = useAnimatedStyle(() => ({
    opacity: gra.value,
  }));
  const bimStyle = useAnimatedStyle(() => ({
    opacity: bim.value,
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="auto">
      <Animated.View style={[StyleSheet.absoluteFill, styles.wrap, wrapStyle]}>
        <Pressable style={styles.logoHit} onPress={cinematic ? done : undefined}>
          <Logo height={80} variant="onLight" />
        </Pressable>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.gra, graStyle]} />
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.bim, bimStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  logoHit: { alignItems: "center", justifyContent: "center" },
  gra: { zIndex: 1001, backgroundColor: "#9EC5FF" },
  bim: { zIndex: 1002, backgroundColor: "#FFFFFF" },
});
