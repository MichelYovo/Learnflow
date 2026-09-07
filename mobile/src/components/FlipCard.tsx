import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "../theme/useAppTheme";

type Props = {
  front: string;
  back: string;
  flipped: boolean;
  onPress: () => void;
};

/** Flip 3D comme le Mode Guidé web (`lf-flip-inner`). */
export default function FlipCard({ front, back, flipped, onPress }: Props) {
  const { colors } = useAppTheme();
  const rot = useSharedValue(0);

  useEffect(() => {
    rot.value = withTiming(flipped ? 180 : 0, { duration: 450, easing: Easing.out(Easing.cubic) });
  }, [flipped, rot]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1100 }, { rotateY: `${rot.value}deg` }],
    opacity: interpolate(rot.value, [0, 89, 90, 180], [1, 1, 0, 0]),
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1100 }, { rotateY: `${rot.value + 180}deg` }],
    opacity: interpolate(rot.value, [0, 89, 90, 180], [0, 0, 1, 1]),
  }));

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={flipped ? "Retourner la carte" : "Voir la réponse"}>
      <View style={styles.scene}>
        <Animated.View style={[styles.face, { backgroundColor: colors.white }, frontStyle]}>
          <Animated.Text style={[styles.text, { color: colors.textDark }]}>{front}</Animated.Text>
        </Animated.View>
        <Animated.View style={[styles.face, styles.back, { backgroundColor: colors.white }, backStyle]}>
          <Animated.Text style={[styles.text, { color: colors.textDark }]}>{back}</Animated.Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scene: { minHeight: 240, marginHorizontal: 24, position: "relative" },
  face: {
    minHeight: 240,
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  back: { ...StyleSheet.absoluteFill },
  text: { fontSize: 24, fontWeight: "800", textAlign: "center", lineHeight: 32 },
});
