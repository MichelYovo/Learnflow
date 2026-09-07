import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { FOCUS_HINT, openSystemFocusSettings } from "../../lib/focusMode";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { useAppTheme } from "../../theme/useAppTheme";

const BENEFITS = [
  {
    icon: "bell-off" as const,
    title: "Plus de pings",
    body: "WhatsApp, TikTok et les autres restent silencieux le temps de la séance.",
  },
  {
    icon: "book" as const,
    title: "Immersion",
    body: "Tu restes dans tes fiches et tes quiz, sans basculer vers les réseaux.",
  },
  {
    icon: "timer" as const,
    title: "Tu restes maître",
    body: "Dès que tu as fini, tu désactives Ne pas déranger dans les réglages.",
  },
];

export default function FocusModeScreen() {
  const { colors, darkMode } = useAppTheme();
  const dismiss = useLearnFlowStore((s) => s.dismissFocusPrompt);
  const [busy, setBusy] = useState(false);

  const enterApp = () => dismiss();

  const activate = async () => {
    if (busy) return;
    setBusy(true);
    if (Platform.OS === "web") {
      Alert.alert(
        "Sur ton téléphone",
        `Active Ne pas déranger ou le mode Concentration, puis reviens réviser.\n\n${FOCUS_HINT}`,
        [{ text: "J’ai compris", onPress: enterApp }]
      );
      setBusy(false);
      return;
    }
    const opened = await openSystemFocusSettings();
    setBusy(false);
    if (!opened) {
      Alert.alert("Réglages indisponibles", `Ouvre-les toi-même : ${FOCUS_HINT}`, [
        { text: "Plus tard", style: "cancel", onPress: enterApp },
        { text: "OK" },
      ]);
      return;
    }
    enterApp();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Spira scene="auth.focus" size={108} />
        <Text style={[styles.kicker, { color: colors.primary }]}>Avant de réviser</Text>
        <Text style={[styles.title, { color: colors.textDark }]}>Mode concentration</Text>
        <Text style={[styles.lead, { color: colors.textSecondary }]}>
          Active Ne pas déranger pour une vraie immersion — et pour ne pas retomber dans les réseaux sociaux.
        </Text>

        <View style={styles.list}>
          {BENEFITS.map((item) => (
            <View
              key={item.title}
              style={[
                styles.row,
                { backgroundColor: colors.white, borderColor: darkMode ? colors.border : colors.mathsBorder },
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: colors.mathsBg }]}>
                <Icon name={item.icon} size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: colors.textDark }]}>{item.title}</Text>
                <Text style={[styles.rowBody, { color: colors.textSecondary }]}>{item.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          LearnFlow ouvre les réglages de ton téléphone. {FOCUS_HINT}.
        </Text>
        <Pressable onPress={() => void activate()} disabled={busy} style={styles.btnWrap} accessibilityRole="button">
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
            <Icon name="moon" size={18} color="#FFFFFF" />
            <Text style={styles.btnText}>{busy ? "Ouverture…" : "Activer Ne pas déranger"}</Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={enterApp} hitSlop={10} accessibilityRole="button">
          <Text style={[styles.skip, { color: colors.textMuted }]}>Continuer sans ça</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12, alignItems: "center" },
  kicker: { marginTop: 8, fontSize: 12, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase" },
  title: { marginTop: 6, fontSize: 28, fontWeight: "800", letterSpacing: -0.5, textAlign: "center" },
  lead: { marginTop: 10, fontSize: 16, lineHeight: 24, fontWeight: "500", textAlign: "center" },
  list: { width: "100%", marginTop: 22, gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontSize: 15, fontWeight: "800" },
  rowBody: { marginTop: 2, fontSize: 13, lineHeight: 18, fontWeight: "500" },
  footer: { paddingHorizontal: 24, paddingBottom: 16, gap: 12 },
  hint: { fontSize: 12, lineHeight: 17, fontWeight: "500", textAlign: "center" },
  btnWrap: { borderRadius: 18, overflow: "hidden" },
  btn: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  skip: { textAlign: "center", fontWeight: "700", fontSize: 14, paddingVertical: 6 },
});
