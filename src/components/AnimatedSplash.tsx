import React, { useCallback, useEffect, useRef } from "react";
import { AccessibilityInfo, Pressable, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
const STORAGE_KEY = "lf-intro-flash";

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
    if (cinematic) {
      void AsyncStorage.setItem(STORAGE_KEY, "1").catch(() => undefined);
    }
    onFinishRef.current();
  }, [cinematic]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    finished.current = false;
    screenOpacity.value = 1;
    gra.value = 0;
    bim.value = 0;

    const play = (holdMs: number, withFlash: boolean) => {
      if (withFlash) {
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
        holdMs + (withFlash ? FLASH_MS - 180 : 0),
        withTiming(0, { duration: withFlash ? 180 : 420, easing: Easing.out(Easing.quad) }, (ok) => {
          if (ok) runOnJS(done)();
        })
      );
      return setTimeout(done, holdMs + FLASH_MS + 400);
    };

    let fallback: ReturnType<typeof setTimeout> | undefined;

    const start = async () => {
      if (!cinematic) {
        fallback = play(SHORT_HOLD_MS, false);
        return;
      }
      try {
        const seen = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled) return;
        if (seen === "1") {
          done();
          return;
        }
        const reduce = await AccessibilityInfo.isReduceMotionEnabled();
        if (cancelled) return;
        fallback = play(reduce ? 80 : INTRO_HOLD_MS, !reduce);
      } catch {
        if (!cancelled) fallback = play(INTRO_HOLD_MS, true);
      }
    };

    void start();
    return () => {
      cancelled = true;
      if (fallback) clearTimeout(fallback);
    };
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
