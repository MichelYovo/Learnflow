import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import Spira from "./Spira";
import { spiraMoodForMode } from "../data/spira";
import type { AppMode } from "../types/modes";

type Props = {
  mode: AppMode;
  size: number;
  groundColor?: string;
};

/** Props expressives autour de Spira — personnalité distinctive par mode. */
export default function ModeMascot({ mode, size, groundColor = "rgba(15,23,42,0.14)" }: Props) {
  const sprite = Math.round(size * 0.9);
  const height = Math.round(size * 1.08);

  return (
    <View style={[styles.wrap, { width: size, height }]} pointerEvents="none">
      {mode === "blitz" ? <BlitzProps size={size} /> : null}

      <View style={[styles.sprite, poseStyle(mode)]}>
        <Spira mood={spiraMoodForMode(mode)} size={sprite} message="" animated={false} interactive={false} />
      </View>

      {mode === "libre" ? <LibreProps size={size} /> : null}
      {mode === "guide" ? <GuideProps size={size} /> : null}
      {mode === "cramming" ? <CrammingProps size={size} /> : null}

      <View style={[styles.ground, { backgroundColor: groundColor, width: size * 0.58 }]} />
    </View>
  );
}

function poseStyle(mode: AppMode) {
  switch (mode) {
    case "libre":
      return { transform: [{ scaleY: 1.06 }, { scaleX: 0.96 }, { rotate: "-4deg" }] };
    case "guide":
      return { transform: [{ rotate: "3deg" }] };
    case "cramming":
      return { transform: [{ scale: 1.02 }, { rotate: "-2deg" }] };
    case "blitz":
      return { transform: [{ skewX: "-6deg" }, { rotate: "4deg" }, { translateX: 4 }] };
    default:
      return undefined;
  }
}

function LibreProps({ size }: { size: number }) {
  const w = size * 0.72;
  return (
    <View
      style={[
        styles.propFront,
        {
          top: size * 0.18,
          left: (size - w) / 2,
          width: w,
          height: w * 0.44,
        },
      ]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 64 28">
        <Path d="M8 14c0-3 3-6 8-6h8c2.5 0 4 1.2 4 3v2c0 1.8-1.5 3-4 3H16c-5 0-8-1.2-8-2z" fill="#0F172A" />
        <Path d="M36 14c0-3 3-6 8-6h8c2.5 0 4 1.2 4 3v2c0 1.8-1.5 3-4 3H44c-5 0-8-1.2-8-2z" fill="#0F172A" />
        <Path d="M28 12h8" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <Path d="M10 10l4-4M54 10l-4-4" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
        <Ellipse cx="20" cy="14" rx="5" ry="3" fill="#38BDF8" opacity="0.55" />
        <Ellipse cx="48" cy="14" rx="5" ry="3" fill="#38BDF8" opacity="0.55" />
      </Svg>
    </View>
  );
}

function GuideProps({ size }: { size: number }) {
  const s = size * 0.28;
  return (
    <View style={[styles.propFront, { top: size * 0.04, right: size * 0.02, width: s, height: s }]}>
      <Svg width="100%" height="100%" viewBox="0 0 40 40">
        <Circle cx="20" cy="20" r="16" fill="#1677FF" />
        <Circle cx="20" cy="20" r="12" fill="#E6F4FF" />
        <Path d="M20 10v10l7 4" stroke="#0958D9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

function CrammingProps({ size }: { size: number }) {
  const bookW = size * 0.26;
  return (
    <>
      <View
        style={[
          styles.propFront,
          { bottom: size * 0.22, left: -size * 0.02, width: bookW, height: bookW * 0.86, transform: [{ rotate: "-18deg" }] },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 28 24">
          <Rect x="2" y="4" width="20" height="16" rx="2" fill="#F59E0B" />
          <Rect x="4" y="6" width="16" height="12" rx="1" fill="#FEF3C7" />
          <Path d="M8 10h8M8 13h6" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
      </View>
      <View
        style={[
          styles.propFront,
          { bottom: size * 0.18, right: -size * 0.04, width: bookW, height: bookW * 0.86, transform: [{ rotate: "16deg" }] },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 28 24">
          <Rect x="4" y="3" width="20" height="16" rx="2" fill="#EF4444" />
          <Rect x="6" y="5" width="16" height="12" rx="1" fill="#FEE2E2" />
          <Path d="M10 9h8M10 12h5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
      </View>
      <View style={[styles.sweat, { top: size * 0.12, right: size * 0.18, width: 7, height: 11, transform: [{ rotate: "18deg" }] }]} />
      <View
        style={[
          styles.sweat,
          { top: size * 0.22, right: size * 0.08, width: 5, height: 8, opacity: 0.75, transform: [{ rotate: "28deg" }] },
        ]}
      />
      <View
        style={[
          styles.sweat,
          { top: size * 0.08, left: size * 0.22, width: 6, height: 9, opacity: 0.8, transform: [{ rotate: "-22deg" }] },
        ]}
      />
    </>
  );
}

function BlitzProps({ size }: { size: number }) {
  const w = size * 0.42;
  return (
    <View style={[styles.propBack, { top: size * 0.08, left: -size * 0.06, width: w, height: w * 1.15 }]}>
      <Svg width="100%" height="100%" viewBox="0 0 48 56">
        <Path d="M40 8H8" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <Path d="M36 20H4" stroke="#F87171" strokeWidth="3.5" strokeLinecap="round" opacity="0.75" />
        <Path d="M38 32H10" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
        <Path d="M34 44H6" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <Path d="M42 14l-6 4 6 4" fill="#FBBF24" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "visible",
  },
  sprite: {
    zIndex: 2,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  ground: {
    position: "absolute",
    bottom: "2%",
    height: "10%",
    borderRadius: 999,
    zIndex: 1,
  },
  propBack: {
    position: "absolute",
    zIndex: 1,
  },
  propFront: {
    position: "absolute",
    zIndex: 3,
  },
  sweat: {
    position: "absolute",
    zIndex: 3,
    borderRadius: 8,
    backgroundColor: "#38BDF8",
    opacity: 0.9,
  },
});
