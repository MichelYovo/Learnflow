import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../../components/Logo";
import ClassPicker from "../../components/ClassPicker";
import ParentPhoneField from "../../components/ParentPhoneField";
import { classLabel } from "../../data/mock";
import { ensureBeginnerLeague, fetchOwnStudentProfile, isProfileComplete, trackActivity, upsertStudentProfile } from "../../lib/cloud";
import { isValidTogoLocal, toTogoE164 } from "../../lib/phoneTogo";
import { notifySecureLogin } from "../../lib/secureAuth";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { ClasseAPC } from "../../types/learnflow";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "CompleteProfile">;

export default function CompleteProfileScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const [classe, setClasse] = useState<ClasseAPC | "">("");
  const [parentLocal, setParentLocal] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("Élève");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      navigation.replace("Login");
      return;
    }
    void (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        navigation.replace("Login");
        return;
      }
      const existing = await fetchOwnStudentProfile();
      if (isProfileComplete(existing)) {
        applyCloudUser(
          {
            id: user.id,
            email: user.email ?? existing?.email ?? "",
            nom: existing?.name ?? String(user.user_metadata?.full_name ?? "Élève"),
            classe: existing?.class_level ?? "3eme",
            parentPhone: existing?.parent_phone ?? "",
            xpTotale: existing?.total_xp ?? 0,
            streak: existing?.streak ?? 0,
            lessonsDone: existing?.lessons_done ?? 0,
            avatarId: existing?.avatar_id ?? undefined,
          },
          { fresh: (existing?.total_xp ?? 0) === 0, authenticate: false },
        );
        void trackActivity("login", { provider: "google" });
        void notifySecureLogin("login");
        navigation.replace("Success");
        return;
      }
      setUserId(user.id);
      setEmail(user.email ?? "");
      const metaName = String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? "").trim();
      setDisplayName(metaName || user.email?.split("@")[0] || "Élève");
    })();
  }, [applyCloudUser, navigation]);

  const submit = async () => {
    if (!classe) {
      setError("Choisis ta classe.");
      return;
    }
    const phone = isValidTogoLocal(parentLocal) ? toTogoE164(parentLocal) : undefined;
    setError("");
    setBusy(true);
    const result = await upsertStudentProfile({
      id: userId,
      parent_id: userId,
      name: displayName,
      email,
      class_level: classe,
      parent_phone: phone ?? null,
      platform: "mobile",
      total_xp: 0,
      streak: 0,
      lessons_done: 0,
    });
    if (result.error) {
      setError(result.error);
      setBusy(false);
      return;
    }
    applyCloudUser(
      {
        id: userId,
        email,
        nom: displayName,
        classe,
        parentPhone: phone,
        xpTotale: 0,
        streak: 0,
        lessonsDone: 0,
        rang: 1,
      },
      { fresh: true, authenticate: false },
    );
    void ensureBeginnerLeague(userId);
    void trackActivity("profile_complete", { classe, platform: "mobile" });
    void notifySecureLogin(phone ? "parent_linked" : "profile_complete");
    navigation.replace("Success");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Logo height={76} style={{ alignSelf: "center" }} />
        <Text style={styles.title}>Dernière étape</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Compte Google : {email || displayName}. Choisis ta classe pour continuer.
        </Text>
        <Text style={[styles.label, { color: colors.textDark }]}>Ma classe</Text>
        <ClassPicker value={classe} onChange={setClasse} />
        <ParentPhoneField value={parentLocal} onChange={setParentLocal} />
        <Text style={[styles.optional, { color: colors.textMuted }]}>
          Numéro parent facultatif. S’il est renseigné, un WhatsApp LearnFlow part aux parents à chaque connexion.
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {classe ? (
          <Text style={[styles.hint, { color: colors.textMuted }]}>Classe : {classLabel(classe)}</Text>
        ) : null}
        <Pressable onPress={() => void submit()} disabled={busy} style={styles.btnWrap}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
            <Text style={[styles.btnText, { color: colors.onPrimary }]}>{busy ? "Enregistrement…" : "Continuer"}</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary, letterSpacing: -0.4, textAlign: "center" },
  sub: { fontSize: 13, textAlign: "center", marginTop: -4, marginBottom: 8 },
  label: { fontSize: 12, fontWeight: "700" },
  classGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  classChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
  },
  classText: { fontSize: 13, fontWeight: "800" },
  classTextOn: { color: colors.primary },
  optional: { fontSize: 11, fontWeight: "600", marginTop: -4 },
  error: { color: colors.danger, fontSize: 12, fontWeight: "700" },
  hint: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  btnWrap: { borderRadius: 16, overflow: "hidden", marginTop: 8 },
  btn: { paddingVertical: 16, alignItems: "center" },
  btnText: { fontWeight: "800", fontSize: 16 },
});
