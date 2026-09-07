import React, { useEffect } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
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

type Props = {
  avatarId?: string | null;
  size?: number;
  initials?: string;
  fallbackColor?: string;
  radius?: number;
  selected?: boolean;
  animated?: boolean;
};

export default function Avatar({
  avatarId,
  size = 48,
  initials,
  fallbackColor = "#1677FF",
  selected,
  animated = false,
}: Props) {
  const source = avatarId ? getAvatar(avatarId).source : null;
  const r = size / 2;
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
            {
              width: size,
              height: size,
              borderRadius: r,
              backgroundColor: source ? "transparent" : fallbackColor,
              ...Platform.select({
                ios: {
                  shadowColor: "#0F172A",
                  shadowOpacity: 0.22,
                  shadowRadius: Math.max(4, size * 0.08),
                  shadowOffset: { width: 0, height: Math.max(2, size * 0.05) },
                },
                default: { elevation: Math.max(3, Math.round(size * 0.06)) },
              }),
            },
          ]}
        >
          {source ? (
            <Image source={source} style={{ width: size, height: size }} resizeMode="cover" />
          ) : (
            <Text style={[styles.initialsText, { fontSize: size * 0.36 }]}>
              {(initials ?? "?").slice(0, 2).toUpperCase()}
            </Text>
          )}
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
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderColor: "#1677FF",
  },
  initialsText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
