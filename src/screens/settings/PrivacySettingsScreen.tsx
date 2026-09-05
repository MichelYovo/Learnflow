import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SettingsHeader, SettingsToggleRow } from "../../components/SettingsUI";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PrivacySettings">;

export default function PrivacySettingsScreen({ navigation }: Props) {
  const prefs = useLearnFlowStore((s) => s.settings.privacy);
  const update = useLearnFlowStore((s) => s.updatePrivacyPrefs);
  const clearLocalCache = useLearnFlowStore((s) => s.clearLocalCache);
  const { colors } = useAppTheme();

  const onClear = () => {
    Alert.alert(
      "Effacer le cache local ?",
      "Les préférences et le profil actif sont conservés. Les sessions temporaires seront réinitialisées.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Effacer",
          style: "destructive",
          onPress: () => {
            clearLocalCache();
            Alert.alert("Fait", "Cache local nettoyé.");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <SettingsHeader title="Confidentialité" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.intro, { color: colors.textSecondary }]}>
          Tes données élève restent offline-first sur cet appareil. Tu contrôles ce qui peut être partagé.
        </Text>
        <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <SettingsToggleRow
            label="Profil visible en ligue"
            sub="Afficher ton prénom dans le classement du groupe"
            value={prefs.showInLeague}
            onValueChange={(v) => update({ showInLeague: v })}
          />
          <SettingsToggleRow
            label="Partage de score Blitz"
            sub="Autoriser le texte WhatsApp après un Blitz 60s"
            value={prefs.shareBlitzScores}
            onValueChange={(v) => update({ shareBlitzScores: v })}
          />
          <SettingsToggleRow
            label="SMS parent passif"
            sub="Félicitations uniquement (10/10, Challenger) — jamais intrusif"
            value={prefs.parentSmsPassive}
            onValueChange={(v) => update({ parentSmsPassive: v })}
          />
          <SettingsToggleRow
            label="Analytique anonyme"
            sub="Aider à améliorer LearnFlow sans contenu de cours"
            value={prefs.anonymousAnalytics}
            onValueChange={(v) => update({ anonymousAnalytics: v })}
          />
        </View>

        <Pressable style={[styles.dangerBtn, { backgroundColor: colors.white }]} onPress={onClear}>
          <Text style={styles.dangerText}>Effacer le cache local</Text>
        </Pressable>
        <Text style={[styles.legal, { color: colors.textMuted }]}>
          LearnFlow Togo · Les profils multi-élèves sont stockés localement (AsyncStorage). Aucun mot de passe n'est
          envoyé hors appareil en mode démo.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  body: { padding: 20, gap: 12 },
  intro: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: "hidden",
  },
  dangerBtn: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: "#FECACA",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  dangerText: { color: colors.danger, fontWeight: "800" },
  legal: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});
