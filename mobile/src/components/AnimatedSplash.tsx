import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Logo from "./Logo";

/** Logo stagnant avant d’entrer dans l’app. */
export const LOGO_HOLD_MS = 50;

type Props = {
  onFinish: () => void;
  ready?: boolean;
};

export default function AnimatedSplash({ onFinish, ready = true }: Props) {
  const finished = useRef(false);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      if (finished.current) return;
      finished.current = true;
      onFinish();
    }, LOGO_HOLD_MS);
    return () => clearTimeout(t);
  }, [ready, onFinish]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.wrap]} pointerEvents="auto">
      <Logo height={80} variant="onLight" />
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
});
