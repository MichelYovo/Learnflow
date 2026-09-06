import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Icon from "./Icon";

type Props = {
  visible: boolean;
};

export default function TimesUpFlash({ visible }: Props) {
  const flash = useSharedValue(0);
  const shake = useSharedValue(0);
  const pop = useSharedValue(0.86);

  useEffect(() => {
    if (!visible) {
      flash.value = 0;
      shake.value = 0;
      pop.value = 0.86;
      return;
    }
    flash.value = withSequence(
      withTiming(0.55, { duration: 90 }),
      withRepeat(withTiming(0.18, { duration: 140 }), 5, true)
    );
    shake.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 45, easing: Easing.linear }),
        withTiming(10, { duration: 90, easing: Easing.linear }),
        withTiming(0, { duration: 45, easing: Easing.linear })
      ),
      4,
      false
    );
    pop.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 160, easing: Easing.out(Easing.quad) }),
        withTiming(0.94, { duration: 160, easing: Easing.in(Easing.quad) })
      ),
      4,
      true
    );
  }, [visible, flash, shake, pop]);

  const veil = useAnimatedStyle(() => ({
    opacity: flash.value,
  }));

  const badge = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: pop.value }],
  }));

  if (!visible) return null;

  return (
    <View pointerEvents="auto" style={styles.wrap}>
      <Animated.View style={[styles.veil, veil]} />
      <Animated.View style={[styles.badge, badge]}>
        <Icon name="timer" size={22} color="#FECACA" />
        <Text style={styles.title}>TEMPS ÉCOULÉ</Text>
        <Text style={styles.sub}>Le chrono a sonné</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  veil: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#EF4444",
  },
  badge: {
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(9,0,1,0.78)",
    borderWidth: 1.5,
    borderColor: "rgba(252,165,165,0.65)",
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 22,
  },
  title: {
    color: "#FECACA",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 1.8,
  },
  sub: {
    color: "rgba(254,202,202,0.78)",
    fontWeight: "700",
    fontSize: 12,
  },
});
