import React, { useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { getAvatar } from "../data/avatars";
import type { LigueNom } from "../types/learnflow";
import CompanionMark from "./CompanionMark";

type Props = {
  avatarId?: string | null;
  size?: number;
  initials?: string;
  fallbackColor?: string;
  radius?: number;
  selected?: boolean;
  animated?: boolean;
  tier?: LigueNom;
};

export default function Avatar({
  avatarId,
  size = 48,
  initials,
  fallbackColor = "#1677FF",
  selected,
  animated = false,
  tier,
}: Props) {
  const persona = getAvatar(avatarId);
  const tilt = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(tilt);
    tilt.value = 0;
    if (!animated) return;
    tilt.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(-1, { duration: 2600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [animated, tilt]);

  const spin = useAnimatedStyle(() => ({
    transform: [{ perspective: 520 }, { rotateY: `${tilt.value * 7}deg` }],
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[{ width: size, height: size }, animated ? spin : null]}>
        <View
          style={[
            styles.orb,
            Platform.select({
              ios: {
                shadowColor: "#0F172A",
                shadowOpacity: 0.16,
                shadowRadius: Math.max(4, size * 0.08),
                shadowOffset: { width: 0, height: Math.max(2, size * 0.05) },
              },
              default: { elevation: Math.max(2, Math.round(size * 0.05)) },
            }),
          ]}
        >
          <CompanionMark
            persona={persona}
            size={size}
            tier={persona ? tier : undefined}
            initials={initials}
            fallbackColor={fallbackColor}
          />
        </View>
        {selected ? (
          <View
            pointerEvents="none"
            style={[
              styles.ring,
              {
                width: size + 6,
                height: size + 6,
                borderRadius: (size + 6) / 2,
                top: -3,
                left: -3,
                borderWidth: Math.max(2.5, size * 0.045),
              },
            ]}
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

export { avatarByIndex } from "../data/avatars";

const styles = StyleSheet.create({
  orb: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderColor: "#1677FF",
  },
});
