import React from "react";
import Svg, { Circle, Ellipse, Path, Defs, RadialGradient, Stop, Text as SvgText } from "react-native-svg";
import { TIER_LOOK, type AvatarPersona, type EyeStyle, type MouthStyle } from "../data/avatars";
import type { LigueNom } from "../types/learnflow";

function Eyes({ style, cx, cy }: { style: EyeStyle; cx: number; cy: number }) {
  if (style === "dream") {
    return (
      <>
        <Path d={`M${cx - 11} ${cy} q4 -5 8 0`} fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
        <Path d={`M${cx + 3} ${cy} q4 -5 8 0`} fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
      </>
    );
  }
  if (style === "wink") {
    return (
      <>
        <Ellipse cx={cx - 7} cy={cy} rx="4.2" ry="5.4" fill="#fff" />
        <Circle cx={cx - 6.2} cy={cy + 0.6} r="1.7" fill="#1E293B" />
        <Path d={`M${cx + 3} ${cy + 1} q4 -6 8 0`} fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
      </>
    );
  }
  const h = style === "calm" || style === "cool" ? 3.6 : style === "focus" ? 5.6 : 5.2;
  const w = style === "focus" ? 3.4 : 4.2;
  const lid = style === "calm" || style === "cool";
  return (
    <>
      <Ellipse cx={cx - 7} cy={cy} rx={w} ry={h} fill="#fff" />
      <Ellipse cx={cx + 7} cy={cy} rx={w} ry={h} fill="#fff" />
      <Circle cx={cx - 6.2} cy={cy + 0.7} r="1.7" fill="#1E293B" />
      <Circle cx={cx + 7.8} cy={cy + 0.7} r="1.7" fill="#1E293B" />
      {lid ? (
        <>
          <Path d={`M${cx - 11} ${cy - 3} q7 -2 14 0`} fill="none" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" />
          <Path d={`M${cx + 3} ${cy - 3} q7 -2 14 0`} fill="none" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" />
        </>
      ) : null}
    </>
  );
}

function Mouth({ style, cx, cy }: { style: MouthStyle; cx: number; cy: number }) {
  if (style === "grin") {
    return <Path d={`M${cx - 7} ${cy} q7 10 14 0`} fill="#1E293B" />;
  }
  if (style === "smirk") {
    return <Path d={`M${cx - 2} ${cy + 2} q8 4 12 -2`} fill="none" stroke="#1E293B" strokeWidth="2.1" strokeLinecap="round" />;
  }
  if (style === "soft") {
    return <Path d={`M${cx - 4} ${cy + 1} q4 4 8 0`} fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />;
  }
  return <Path d={`M${cx - 6} ${cy} q6 7 12 0`} fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />;
}

export default function CompanionMark({
  persona,
  size = 48,
  tier,
  initials,
  fallbackColor = "#64748B",
}: {
  persona?: AvatarPersona;
  size?: number;
  tier?: LigueNom;
  initials?: string;
  fallbackColor?: string;
}) {
  const uid = `${persona?.id ?? "x"}-${size}-${tier ?? "n"}`;
  const look = tier ? TIER_LOOK[tier] : undefined;
  const body = persona?.body ?? fallbackColor;
  const face = persona?.face ?? "#F8FAFC";
  const tuft = persona?.tuft ?? fallbackColor;
  const sparkle = look?.sparkle ?? false;

  return (
    <Svg width={size} height={size} viewBox="0 0 128 128">
      <Defs>
        <RadialGradient id={`b-${uid}`} cx="38%" cy="32%" r="70%">
          <Stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <Stop offset="42%" stopColor={body} />
          <Stop offset="100%" stopColor={body} stopOpacity="0.86" />
        </RadialGradient>
        <RadialGradient id={`f-${uid}`} cx="40%" cy="30%" r="70%">
          <Stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <Stop offset="100%" stopColor={face} />
        </RadialGradient>
      </Defs>
      {look ? <Circle cx="64" cy="66" r="56" fill={look.glow} /> : null}
      <Ellipse cx="64" cy="114" rx="26" ry="6" fill="#0F172A" opacity="0.14" />
      <Path d="M64 18 C78 10 86 22 82 34 C76 28 70 26 64 26 C58 26 52 28 46 34 C42 22 50 10 64 18Z" fill={tuft} />
      <Ellipse cx="28" cy="74" rx="10" ry="13" fill={body} />
      <Ellipse cx="100" cy="74" rx="10" ry="13" fill={body} />
      <Ellipse cx="48" cy="102" rx="11" ry="8" fill={body} />
      <Ellipse cx="80" cy="102" rx="11" ry="8" fill={body} />
      <Ellipse cx="64" cy="72" rx="40" ry="36" fill={`url(#b-${uid})`} />
      <Circle cx="64" cy="70" r="26" fill={`url(#f-${uid})`} />
      {persona ? (
        <>
          <Eyes style={persona.eye} cx={64} cy={66} />
          <Mouth style={persona.mouth} cx={64} cy={78} />
          <Circle cx="50" cy="76" r="3.2" fill={persona.accent} opacity="0.85" />
          <Circle cx="78" cy="76" r="3.2" fill={persona.accent} opacity="0.85" />
        </>
      ) : (
        <SvgText x="64" y="76" textAnchor="middle" fontSize="18" fontWeight="800" fill="#334155">
          {(initials ?? "?").slice(0, 2).toUpperCase()}
        </SvgText>
      )}
      {(sparkle || !look) && persona ? (
        <>
          <Path d="M18 44 l2.2 5.2 5.2 2.2 -5.2 2.2 -2.2 5.2 -2.2 -5.2 -5.2 -2.2 5.2 -2.2Z" fill={look?.gem ?? "#FDE68A"} opacity="0.9" />
          <Path d="M108 36 l1.8 4.2 4.2 1.8 -4.2 1.8 -1.8 4.2 -1.8 -4.2 -4.2 -1.8 4.2 -1.8Z" fill={look?.gem ?? persona.accent} />
        </>
      ) : null}
      {look?.crown ? (
        <Path d="M44 22 l8 10 12 -14 12 14 8 -10 2 16 H42 Z" fill={look.gem} stroke={look.ring} strokeWidth="1.4" />
      ) : null}
      {look ? (
        <Circle cx="64" cy="72" r="52" fill="none" stroke={look.ring} strokeWidth={tier === "Diamant" || tier === "Or" ? 3.2 : 2.2} opacity="0.85" />
      ) : null}
    </Svg>
  );
}
