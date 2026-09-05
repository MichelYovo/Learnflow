import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Logo from "../../components/Logo";
import Spira from "../../components/Spira";
import type { SpiraScene } from "../../data/spira";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { useAppTheme } from "../../theme/useAppTheme";
import type { AuthStackParamList } from "../../navigation/types";
import type { AppPalette } from "../../theme/palette";

type Props = NativeStackScreenProps<AuthStackParamList, "Onboarding">;

type Slide = {
  speech: string;
  hint?: string;
  scene: SpiraScene;
  visual?: "mastery" | "modes" | "league" | "offline";
};

const SLIDES: Slide[] = [
  {
    speech: "Salut ! Moi c'est Spira. Je t'aide à réussir tes examens, à ton rythme.",
    scene: "onboarding.meet",
  },
  {
    speech: "Ici, tu ne survoles pas. La règle du 10/10 : tu passes seulement quand c'est vraiment acquis.",
    hint: "Fiches, flashcards, quiz — jusqu'à la maîtrise.",
    scene: "onboarding.mastery",
    visual: "mastery",
  },
  {
    speech: "Quatre modes selon le moment : Libre, Guidé, Cramming, ou Blitz 60 secondes.",
    hint: "Tu choisis comment tu révises — jamais l'inverse.",
    scene: "onboarding.modes",
    visual: "modes",
  },
  {
    speech: "Gagne de l'XP, grimpe ta ligue et défie tes camarades. La motivation, sans la pression.",
    scene: "onboarding.league",
    visual: "league",
  },
  {
    speech: "Et tout marche même sans réseau. Programme APC Togo, collège et lycée.",
    hint: "Tes révisions t'attendent partout — bus, maison, école.",
    scene: "onboarding.offline",
    visual: "offline",
  },
];

export default function OnboardingScreen({ navigation }: Props) {
  const { colors, darkMode } = useAppTheme();
  const completeOnboarding = useLearnFlowStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const welcome = step === 0;
  const slideIndex = step - 1;
  const slide = SLIDES[slideIndex];
  const progress = welcome ? 0 : step / SLIDES.length;

  const finish = (screen: "SignUp" | "Login" | "Profiles") => {
    completeOnboarding();
    navigation.navigate(screen);
  };

  const next = () => {
    if (step >= SLIDES.length) {
      finish("SignUp");
      return;
    }
    setStep((s) => s + 1);
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <DecorBlobs darkMode={darkMode} />

      {welcome ? (
        <View style={styles.topWelcome}>
          <Logo height={72} />
        </View>
      ) : (
        <View style={styles.topTour}>
          <Pressable onPress={back} hitSlop={12} style={styles.iconBtn} accessibilityLabel="Retour">
            <Icon name="arrow-left" size={22} color={colors.textDark} />
          </Pressable>
          <View style={[styles.track, { backgroundColor: darkMode ? "#334155" : "#E2E8F0" }]}>
            <Animated.View
              style={[
                styles.fill,
                { width: `${Math.round(progress * 100)}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
          <Pressable onPress={() => finish("SignUp")} hitSlop={12} style={styles.skip}>
            <Text style={[styles.skipText, { color: colors.textMuted }]}>Passer</Text>
          </Pressable>
        </View>
      )}

      <Animated.View key={step} entering={FadeIn.duration(280)} style={styles.stage}>
        {welcome ? <WelcomeBody colors={colors} /> : slide ? <TourBody slide={slide} colors={colors} darkMode={darkMode} /> : null}
      </Animated.View>

      <View style={styles.footer}>
        {welcome ? (
          <>
            <Press3D label="C'est parti" onPress={next} colors={colors} variant="primary" />
            <Press3D
              label="J'ai déjà un compte"
              onPress={() => navigation.navigate("Login")}
              colors={colors}
              variant="secondary"
            />
            <Pressable onPress={() => navigation.navigate("Profiles")} hitSlop={8} style={styles.demoLink}>
              <Text style={[styles.demoText, { color: colors.primary }]}>Continuer avec un profil démo</Text>
            </Pressable>
          </>
        ) : (
          <Press3D
            label={step >= SLIDES.length ? "Créer mon compte" : "Continuer"}
            onPress={next}
            colors={colors}
            variant="primary"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function WelcomeBody({ colors }: { colors: AppPalette }) {
  return (
    <View style={styles.welcome}>
      <Animated.View entering={FadeInDown.duration(500).delay(80)} style={styles.heroMascot}>
        <Spira scene="welcome" size={176} />
      </Animated.View>
      <Animated.View entering={FadeInDown.duration(450).delay(180)} style={styles.welcomeCopy}>
        <Text style={[styles.welcomeTitle, { color: colors.textDark }]}>Réviser autrement.</Text>
        <Text style={[styles.welcomeSub, { color: colors.textSecondary }]}>
          Fiches, quiz 10/10, ligues et Spira — pour collège et lycée, même hors ligne.
        </Text>
      </Animated.View>
    </View>
  );
}

function TourBody({
  slide,
  colors,
  darkMode,
}: {
  slide: Slide;
  colors: AppPalette;
  darkMode: boolean;
}) {
  const intro = !slide.visual;
  return (
    <ScrollView
      contentContainerStyle={[styles.tour, intro && styles.tourIntro]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={[styles.dialogue, intro && styles.dialogueIntro]}>
        <Spira scene={slide.scene} size={intro ? 140 : 100} message="" />
        <SpeechBubble text={slide.speech} colors={colors} darkMode={darkMode} centered={intro} />
      </View>
      {slide.visual ? (
        <View style={styles.visualWrap}>
          <SlideVisual kind={slide.visual} hint={slide.hint} colors={colors} darkMode={darkMode} />
        </View>
      ) : null}
    </ScrollView>
  );
}

function SpeechBubble({
  text,
  colors,
  darkMode,
  centered,
}: {
  text: string;
  colors: AppPalette;
  darkMode: boolean;
  centered?: boolean;
}) {
  const edge = darkMode ? colors.borderStrong : "#E2E8F0";
  const tail = (
    <View
      style={[
        styles.bubbleTail,
        centered ? styles.bubbleTailTop : null,
        { backgroundColor: colors.white, borderColor: edge },
      ]}
    />
  );
  return (
    <View style={[styles.bubbleCol, centered && styles.bubbleColCenter]}>
      {centered ? tail : null}
      <View style={[styles.bubble, { backgroundColor: colors.white, borderColor: edge }]}>
        <Text style={[styles.bubbleText, { color: colors.textDark }]}>{text}</Text>
      </View>
      {centered ? null : tail}
    </View>
  );
}

function SlideVisual({
  kind,
  hint,
  colors,
  darkMode,
}: {
  kind: NonNullable<Slide["visual"]>;
  hint?: string;
  colors: AppPalette;
  darkMode: boolean;
}) {
  const cardBg = colors.white;
  const border = darkMode ? colors.border : "#E2E8F0";

  if (kind === "mastery") {
    return (
      <View style={[styles.scene, { backgroundColor: cardBg, borderColor: border }]}>
        <View style={styles.scoreRow}>
          <Text style={[styles.scoreBig, { color: colors.primary }]}>10</Text>
          <Text style={[styles.scoreSlash, { color: colors.textMuted }]}>/</Text>
          <Text style={[styles.scoreBig, { color: colors.primary }]}>10</Text>
        </View>
        <View style={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="star" size={18} color="#F59E0B" />
          ))}
        </View>
        <Text style={[styles.sceneLabel, { color: colors.textDark }]}>Chapitre maîtrisé</Text>
        {hint ? <Text style={[styles.hint, { color: colors.textSecondary }]}>{hint}</Text> : null}
      </View>
    );
  }

  if (kind === "modes") {
    const modes = [
      { label: "Libre", color: "#1677FF", bg: "#E6F4FF" },
      { label: "Guidé", color: "#10B981", bg: "#ECFDF5" },
      { label: "Cramming", color: "#F59E0B", bg: "#FFFBEB" },
      { label: "Blitz 60s", color: "#EF4444", bg: "#FEF2F2" },
    ];
    return (
      <View style={styles.modesGrid}>
        {modes.map((m) => (
          <View key={m.label} style={[styles.modeChip, { backgroundColor: darkMode ? colors.white : m.bg, borderColor: border }]}>
            <Text style={[styles.modeText, { color: darkMode ? colors.textDark : m.color }]}>{m.label}</Text>
          </View>
        ))}
        {hint ? (
          <Text style={[styles.hint, { color: colors.textSecondary, width: "100%", marginTop: 4 }]}>{hint}</Text>
        ) : null}
      </View>
    );
  }

  if (kind === "league") {
    const bars = [
      { h: 48, c: "#94A3B8" },
      { h: 78, c: "#F59E0B" },
      { h: 58, c: "#CBD5E1" },
    ];
    return (
      <View style={[styles.scene, { backgroundColor: cardBg, borderColor: border }]}>
        <Icon name="trophy" size={28} color="#F59E0B" />
        <View style={styles.podium}>
          {bars.map((b, i) => (
            <View key={i} style={[styles.podiumBar, { height: b.h, backgroundColor: b.c }]} />
          ))}
        </View>
        <Text style={[styles.sceneLabel, { color: colors.textDark }]}>Ta ligue de la semaine</Text>
      </View>
    );
  }

  return (
    <View style={[styles.scene, { backgroundColor: cardBg, borderColor: border }]}>
      <View style={[styles.offlineBadge, { backgroundColor: darkMode ? colors.surfaceAlt : "#E6F4FF" }]}>
        <Icon name="book" size={26} color={colors.primary} />
      </View>
      <Text style={[styles.sceneLabel, { color: colors.textDark }]}>Offline-first</Text>
      {hint ? <Text style={[styles.hint, { color: colors.textSecondary }]}>{hint}</Text> : null}
    </View>
  );
}

function Press3D({
  label,
  onPress,
  variant,
  colors,
}: {
  label: string;
  onPress: () => void;
  variant: "primary" | "secondary";
  colors: AppPalette;
}) {
  const [down, setDown] = useState(false);
  const depth = 4;
  const primary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setDown(true)}
      onPressOut={() => setDown(false)}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={{ height: 52 + depth }}>
        <View
          style={[
            styles.btnFace,
            {
              transform: [{ translateY: down ? depth : 0 }],
              backgroundColor: primary ? colors.primary : colors.white,
              borderColor: primary ? colors.primaryDark : colors.borderStrong,
              borderWidth: 2,
              borderBottomWidth: down ? 2 : 2 + depth,
            },
          ]}
        >
          <Text style={[styles.btnText, { color: primary ? "#FFFFFF" : colors.primary }]}>{label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function DecorBlobs({ darkMode }: { darkMode: boolean }) {
  if (darkMode) return null;
  return (
    <>
      <View style={[styles.blob, styles.blobA]} />
      <View style={[styles.blob, styles.blobB]} />
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.45 },
  blobA: { width: 220, height: 220, backgroundColor: "#E6F4FF", top: -60, right: -70 },
  blobB: { width: 160, height: 160, backgroundColor: "#ECFDF5", bottom: 120, left: -50 },
  topWelcome: { alignItems: "center", paddingTop: 8, minHeight: 84, justifyContent: "center" },
  topTour: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 6,
    gap: 10,
    minHeight: 48,
  },
  iconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  skip: { minWidth: 56, minHeight: 40, alignItems: "flex-end", justifyContent: "center" },
  skipText: { fontWeight: "800", fontSize: 13 },
  track: { flex: 1, height: 14, borderRadius: 99, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 99 },
  stage: { flex: 1 },
  welcome: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, gap: 28 },
  heroMascot: { alignItems: "center" },
  welcomeCopy: { alignItems: "center", gap: 10 },
  welcomeTitle: { fontSize: 32, fontWeight: "800", letterSpacing: -0.8, textAlign: "center" },
  welcomeSub: { fontSize: 16, lineHeight: 24, textAlign: "center", paddingHorizontal: 8 },
  tour: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 12, justifyContent: "space-evenly", paddingBottom: 8 },
  tourIntro: { justifyContent: "center", gap: 8 },
  dialogue: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  dialogueIntro: { flexDirection: "column", alignItems: "center" },
  bubbleCol: { flex: 1, paddingTop: 6 },
  bubbleColCenter: { flex: 0, width: "100%", paddingTop: 4, alignItems: "center" },
  bubble: {
    borderRadius: 20,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  bubbleText: { fontSize: 17, fontWeight: "700", lineHeight: 24, letterSpacing: -0.2 },
  bubbleTail: {
    width: 14,
    height: 14,
    marginLeft: 22,
    marginTop: -8,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "-40deg" }],
  },
  bubbleTailTop: {
    marginLeft: 0,
    marginTop: 0,
    marginBottom: -8,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
  visualWrap: { alignItems: "center" },
  scene: {
    width: "100%",
    borderRadius: 24,
    borderWidth: 2,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "center",
    gap: 10,
  },
  scoreRow: { flexDirection: "row", alignItems: "flex-end", gap: 2 },
  scoreBig: { fontSize: 48, fontWeight: "800", letterSpacing: -1.5, lineHeight: 52 },
  scoreSlash: { fontSize: 32, fontWeight: "800", marginBottom: 4 },
  stars: { flexDirection: "row", gap: 4 },
  sceneLabel: { fontSize: 16, fontWeight: "800" },
  hint: { fontSize: 13, lineHeight: 19, textAlign: "center", fontWeight: "600" },
  modesGrid: { width: "100%", flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  modeChip: {
    width: "47%",
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
  },
  modeText: { fontWeight: "800", fontSize: 15 },
  podium: { flexDirection: "row", alignItems: "flex-end", gap: 10, height: 80 },
  podiumBar: { width: 36, borderRadius: 8 },
  offlineBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { paddingHorizontal: 24, paddingBottom: 18, gap: 10 },
  demoLink: { minHeight: 40, alignItems: "center", justifyContent: "center" },
  demoText: { fontWeight: "800", fontSize: 13 },
  btnFace: {
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontWeight: "800", fontSize: 16, letterSpacing: 0.2 },
});
