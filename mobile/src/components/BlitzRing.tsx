import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Tone = "mint" | "warn" | "critical";

type Props = {
  value: number;
  max?: number;
  /** 0 → 1, remaining fraction. */
  progress: number;
  size?: number;
  unit?: string;
  tone?: Tone;
};

const TONES: Record<Tone, { track: string; stroke: string; value: string; unit: string }> = {
  mint: {
    track: "rgba(132,204,22,0.28)",
    stroke: "#84CC16",
    value: "#ECFCCB",
    unit: "#A3E635",
  },
  warn: {
    track: "rgba(245,158,11,0.28)",
    stroke: "#F59E0B",
    value: "#FEF3C7",
    unit: "#FBBF24",
  },
  critical: {
    track: "rgba(239,68,68,0.28)",
    stroke: "#EF4444",
    value: "#FECACA",
    unit: "#F87171",
  },
};

export default function BlitzRing({
  value,
  max = 60,
  progress,
  size = 172,
  unit = "sec",
  tone = "critical",
}: Props) {
  const palette = TONES[tone];
  const stroke = Math.max(12, Math.round(size * 0.1));
  const svgSize = size;
  const r = (svgSize - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = c * (1 - clamped);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={svgSize} height={svgSize} style={styles.svg}>
        <Circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={r}
          stroke={palette.track}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={r}
          stroke={palette.stroke}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
        />
      </Svg>
      <View style={styles.label} pointerEvents="none">
        <Text
          style={[
            styles.value,
            { color: palette.value, fontSize: size * 0.32, lineHeight: size * 0.36 },
          ]}
        >
          {Math.max(0, Math.ceil(value))}
        </Text>
        <Text style={[styles.unit, { color: palette.unit }]}>{unit}</Text>
      </View>
      {max ? <Text style={styles.srOnly}>{Math.ceil(value)} {unit} restantes</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  svg: { position: "absolute" },
  label: { alignItems: "center", justifyContent: "center" },
  value: { fontWeight: "900", letterSpacing: -2 },
  unit: { fontSize: 13, fontWeight: "800", marginTop: -4, letterSpacing: 0.4 },
  srOnly: { height: 0, overflow: "hidden", position: "absolute" },
});
