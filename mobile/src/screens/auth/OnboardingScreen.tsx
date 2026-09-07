import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Spira from "../../components/Spira";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { useAppTheme } from "../../theme/useAppTheme";
import type { SpiraScene } from "../../data/spira";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

const SLIDES: { scene: SpiraScene; title: string; body: string }[] = [
  {
    scene: "onboarding.mastery",
    title: "La règle du 10/10",
    body: "Un chapitre n’est validé que lorsqu’il est vraiment acquis. Pas de survol : on vise la maîtrise.",
  },
  {
    scene: "onboarding.modes",
    title: "Quatre modes de révision",
    body: "Libre, Guidé, Cramming ou Blitz 60 secondes — selon le moment, jamais l’inverse.",
  },
  {
    scene: "onboarding.league",
    title: "Ligues et XP",
    body: "Gagne de l’XP, grimpe ta ligue et défie tes camarades. La motivation, sans la pression.",
  },
  {
    scene: "onboarding.offline",
    title: "Même hors ligne",
    body: "Programme APC Togo, collège et lycée. Tes révisions t’attendent partout — bus, maison, école.",
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const { colors, darkMode } = useAppTheme();
  const completeOnboarding = useLearnFlowStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const slide = SLIDES[step];
  const last = step === SLIDES.length - 1;
  const progress = (step + 1) / SLIDES.length;

  const goAuth = () => {
    completeOnboarding();
    navigation.replace("Splash");
  };

  const next = () => {
    if (last) {
      goAuth();
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <View style={[styles.track, { backgroundColor: darkMode ? "#334155" : "#E2E8F0" }]}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%`, backgroundColor: colors.primary }]} />
        </View>
        <Pressable onPress={goAuth} hitSlop={12} style={styles.skip} accessibilityLabel="Passer">
          <Text style={[styles.skipText, { color: colors.textMuted }]}>Passer</Text>
        </Pressable>
      </View>

      <View style={styles.stage}>
        <Spira key={slide.scene} scene={slide.scene} size={128} />
        <Text style={[styles.title, { color: colors.textDark }]}>{slide.title}</Text>
        <Text style={[styles.body, { color: colors.textSecondary }]}>{slide.body}</Text>
      </View>

      <View style={styles.footer}>
        <Pressable onPress={next} accessibilityRole="button" style={styles.btnWrap}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
            <Text style={styles.btnText}>{last ? "Commencer" : "Continuer"}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
    minHeight: 48,
  },
  track: { flex: 1, height: 10, borderRadius: 99, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 99 },
  skip: { minWidth: 56, minHeight: 40, alignItems: "flex-end", justifyContent: "center" },
  skipText: { fontWeight: "800", fontSize: 13 },
  stage: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, gap: 18 },
  title: { fontSize: 28, fontWeight: "800", letterSpacing: -0.6, textAlign: "center" },
  body: { fontSize: 17, lineHeight: 26, textAlign: "center", fontWeight: "500" },
  footer: { paddingHorizontal: 24, paddingBottom: 20 },
  btnWrap: { borderRadius: 16, overflow: "hidden" },
  btn: { minHeight: 54, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
});
