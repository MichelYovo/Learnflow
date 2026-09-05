import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Logo from "./Logo";
import { useAppTheme } from "../theme/useAppTheme";

type Props = {
  onFinish: () => void;
};

/** Splash animé — fade-in + scale-up, hold 2s, fade-out */
export default function AnimatedSplash({ onFinish }: Props) {
  const { colors, darkMode } = useAppTheme();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.82);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    screenOpacity.value = withDelay(
      2000,
      withTiming(0, { duration: 420 }, (finished) => {
        if (finished) runOnJS(onFinish)();
      })
    );
  }, [onFinish, opacity, scale, screenOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
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
      pointerEvents="none"
    >
      <Animated.View style={[styles.logoBox, logoStyle]}>
        <Logo height={108} variant={darkMode ? "onDark" : "onLight"} />
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { zIndex: 999, alignItems: "center", justifyContent: "center" },
  logoBox: { alignItems: "center", gap: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, opacity: 0.85 },
});
