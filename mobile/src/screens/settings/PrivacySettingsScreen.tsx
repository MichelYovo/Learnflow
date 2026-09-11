import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import ParentPhoneField from "../../components/ParentPhoneField";
import { SettingsHeader, SettingsToggleRow } from "../../components/SettingsUI";
import { upsertStudentProfile } from "../../lib/cloud";
import { isValidTogoLocal, normalizeTogoLocal, toTogoE164, TOGO_MOBILE_ERROR } from "../../lib/phoneTogo";
import { markParentConfirmed } from "../../lib/parentConfirm";
import { notifySecureLogin } from "../../lib/secureAuth";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PrivacySettings">;

export default function PrivacySettingsScreen({ navigation }: Props) {
  const prefs = useLearnFlowStore((s) => s.settings.privacy);
  const update = useLearnFlowStore((s) => s.updatePrivacyPrefs);
  const clearLocalCache = useLearnFlowStore((s) => s.clearLocalCache);
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const { colors } = useAppTheme();
  const [parentLocal, setParentLocal] = useState(() => normalizeTogoLocal(profile.parentPhone || ""));
  const [parentConfirmed, setParentConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  const saveParent = async () => {
    if (!isValidTogoLocal(parentLocal)) {
      Alert.alert("Numéro", TOGO_MOBILE_ERROR);
      return;
    }
    if (!parentConfirmed) {
      Alert.alert("Confirmation", "Coche la case : c’est le numéro d’un parent, pas le tien.");
      return;
    }
    setBusy(true);
    const phone = toTogoE164(parentLocal);
    const result = await upsertStudentProfile({
      id: profile.id,
      name: profile.nom,
      class_level: String(profile.classe),
      parent_phone: phone,
      email: profile.email,
      total_xp: profile.xpTotale,
      streak: profile.streak,
      lessons_done: profile.lessonsDone,
    });
    setBusy(false);
    if (result.error) {
      Alert.alert("Erreur", result.error);
      return;
    }
    applyCloudUser({
      id: profile.id,
      email: profile.email ?? "",
      nom: profile.nom,
      classe: profile.classe,
      parentPhone: phone,
      xpTotale: profile.xpTotale,
      streak: profile.streak,
      lessonsDone: profile.lessonsDone,
      avatarId: profile.avatarId,
    });
    void notifySecureLogin("parent_linked");
    void markParentConfirmed(profile.id);
    Alert.alert("C’est noté", "Le parent va recevoir un WhatsApp d’accueil LearnFlow.");
  };

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
        <ParentPhoneField
          value={parentLocal}
          onChange={setParentLocal}
          confirmed={parentConfirmed}
          onConfirmChange={setParentConfirmed}
          optional
        />
        <Pressable style={[styles.btn, { backgroundColor: colors.primary }]} onPress={() => void saveParent()} disabled={busy}>
          <Text style={styles.btnText}>{busy ? "Envoi…" : "Enregistrer le WhatsApp parent"}</Text>
        </Pressable>
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
            label="WhatsApp parent"
            sub="Accueil + point de progrès toutes les 1 à 2 semaines — pas à chaque connexion"
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
  btn: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "800" },
  legal: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});
