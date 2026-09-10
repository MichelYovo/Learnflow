import React, { useCallback, useEffect, useRef } from "react";
import { AccessibilityInfo, Pressable, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Logo from "./Logo";
import LogoIntro from "./LogoIntro";

/** Animation logo ~10 s (premier lancement). */
export const LOGO_INTRO_MS = 10_200;
const SHORT_HOLD_MS = 1_600;
const STORAGE_KEY = "lf-intro-logo-v2";

type Props = {
  onFinish: () => void;
  /** Store hydraté — sans ça, logo stagnant seulement. */
  ready?: boolean;
  /** Premier lancement : animation logo. Sinon hold court. */
  cinematic?: boolean;
};

export default function AnimatedSplash({ onFinish, ready = true, cinematic = false }: Props) {
  const screenOpacity = useSharedValue(1);
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

    const play = (holdMs: number) => {
      screenOpacity.value = withDelay(
        holdMs,
        withTiming(0, { duration: 420, easing: Easing.out(Easing.quad) }, (ok) => {
          if (ok) runOnJS(done)();
        })
      );
      return setTimeout(done, holdMs + 500);
    };

    let fallback: ReturnType<typeof setTimeout> | undefined;

    const start = async () => {
      if (!cinematic) {
        fallback = play(SHORT_HOLD_MS);
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
        fallback = play(reduce ? 80 : LOGO_INTRO_MS);
      } catch {
        if (!cancelled) fallback = play(LOGO_INTRO_MS);
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

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="auto">
      <Animated.View style={[StyleSheet.absoluteFill, styles.wrap, wrapStyle]}>
        <Pressable style={styles.logoHit} onPress={cinematic ? done : undefined}>
          {cinematic ? <LogoIntro width={480} /> : <Logo height={80} variant="onLight" />}
        </Pressable>
      </Animated.View>
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
});
