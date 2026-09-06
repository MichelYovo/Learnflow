import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
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
import { useAppTheme } from "../theme/useAppTheme";

type Props = {
  onFinish: () => void;
};

/** Logo plus grand et plus haut au départ, puis il redescend et s’installe. */
export default function AnimatedSplash({ onFinish }: Props) {
  const { darkMode } = useAppTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1.38);
  const translateY = useSharedValue(-92);
  const screenOpacity = useSharedValue(1);
  const onFinishRef = useRef(onFinish);
  const finished = useRef(false);

  onFinishRef.current = onFinish;

  const done = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinishRef.current();
  }, []);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(
      withTiming(1.38, { duration: 1 }),
      withTiming(1, { duration: 820, easing: Easing.out(Easing.cubic) })
    );
    translateY.value = withSequence(
      withTiming(-92, { duration: 1 }),
      withTiming(8, { duration: 820, easing: Easing.out(Easing.cubic) })
    );
    screenOpacity.value = withDelay(
      2100,
      withTiming(0, { duration: 420 }, (ok) => {
        if (ok) runOnJS(done)();
      })
    );
    const fallback = setTimeout(done, 2700);
    return () => clearTimeout(fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const wrapStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.wrap,
        { backgroundColor: darkMode ? "#0F172A" : "#FAFAF9" },
        wrapStyle,
      ]}
      pointerEvents="auto"
    >
      <Animated.View style={[styles.logoBox, logoStyle]}>
        <Logo height={132} variant={darkMode ? "onDark" : "onLight"} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { zIndex: 999, alignItems: "center", justifyContent: "flex-start", paddingTop: 88 },
  logoBox: { alignItems: "center" },
});
