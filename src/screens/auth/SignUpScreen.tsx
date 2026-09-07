import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Logo from "../../components/Logo";
import SocialAuth from "../../components/SocialAuth";
import { CLASSES } from "../../data/mock";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { ClasseAPC } from "../../types/learnflow";
import type { AuthStackParamList } from "../../navigation/types";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const signUp = useLearnFlowStore((s) => s.signUp);
  const { colors } = useAppTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [classe, setClasse] = useState<ClasseAPC | "">("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const submit = (provider: "email" | "google" | "apple" | "facebook" = "email") => {
    if (provider === "email") {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Indique ton prénom et ton nom.");
        return;
      }
      if (!email.includes("@")) {
        setError("Entre une adresse email valide.");
        return;
      }
      if (password.length < 8) {
        setError("Le mot de passe doit faire au moins 8 caractères.");
        return;
      }
      if (password !== confirm) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
      if (!classe) {
        setError("Choisis ta classe.");
        return;
      }
    }
    if (!classe) {
      if (provider !== "email") {
        setClasse("3eme");
      } else {
        setError("Choisis ta classe avant de continuer.");
        return;
      }
    }
    const chosenClasse = classe || "3eme";
    setError("");
    signUp({
      firstName: firstName.trim() || "Élève",
      lastName: lastName.trim() || provider,
      email: email.trim() || `${provider}@learnflow.tg`,
      classe: chosenClasse,
      provider,
    });
    if (isSupabaseConfigured && provider === "email") {
      void supabase.auth.signUp({ email: email.trim(), password });
    }
    navigation.navigate("OTP");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <Pressable onPress={() => navigation.navigate("Splash")} style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}>
        <Icon name="arrow-left" size={18} color={colors.textDark} />
      </Pressable>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Logo height={76} style={{ alignSelf: "center" }} />
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>Inscris-toi pour commencer à apprendre.</Text>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textDark }]}>Prénom</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.textDark }]}
              placeholder="Kofi"
              placeholderTextColor="#CBD5E1"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textDark }]}>Nom</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.textDark }]}
              placeholder="Adjei"
              placeholderTextColor="#CBD5E1"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textDark }]}>Adresse email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.textDark }]}
              placeholder="kofi@learnflow.tg"
              placeholderTextColor="#CBD5E1"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textDark }]}>Mot de passe</Text>
            <View style={styles.pwWrap}>
              <TextInput
                style={[styles.input, { paddingRight: 44, backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.textDark }]}
                placeholder="8 caractères minimum"
                placeholderTextColor="#CBD5E1"
                secureTextEntry={!showPw}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable style={styles.eye} onPress={() => setShowPw(!showPw)}>
                <Icon name={showPw ? "eye-off" : "eye"} size={16} color="#94A3B8" />
              </Pressable>
            </View>
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textDark }]}>Confirmer le mot de passe</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.textDark }]}
              placeholder="Répète ton mot de passe"
              placeholderTextColor="#CBD5E1"
              secureTextEntry={!showPw}
              value={confirm}
              onChangeText={setConfirm}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textDark }]}>Ma classe</Text>
            <View style={styles.classGrid}>
              {CLASSES.map((c) => {
                const on = classe === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setClasse(c.id)}
                    style={[styles.classChip, { backgroundColor: colors.white, borderColor: colors.border }, on && { borderColor: colors.primary, backgroundColor: colors.mathsBg }]}
                  >
                    <Text style={[styles.classText, { color: colors.textMuted }, on && styles.classTextOn]}>{c.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable onPress={() => submit("email")} style={styles.btnWrap}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
              <Text style={[styles.btnText, { color: colors.onPrimary }]}>S'inscrire</Text>
            </LinearGradient>
          </Pressable>

          <SocialAuth mode="signup" onProvider={(p) => submit(p)} />
        </ScrollView>
      </KeyboardAvoidingView>
      <Text style={styles.footer}>
        Déjà inscrit ?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Se connecter
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, gap: 10 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 24,
  },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary, letterSpacing: -0.4, textAlign: "center" },
  sub: { color: "#64748B", fontSize: 13, marginTop: -4, marginBottom: 8, textAlign: "center" },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: "700", color: "#374151" },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textDark,
  },
  pwWrap: { position: "relative" },
  eye: { position: "absolute", right: 14, top: 16 },
  classGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  classChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: colors.white,
  },
  classChipOn: { borderColor: colors.primary, backgroundColor: colors.mathsBg },
  classText: { fontSize: 13, fontWeight: "800", color: "#78716C" },
  classTextOn: { color: colors.primary },
  error: { color: colors.danger, fontSize: 12, fontWeight: "700" },
  btnWrap: { borderRadius: 16, overflow: "hidden", marginTop: 4 },
  btn: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  footer: { textAlign: "center", color: "#64748B", fontSize: 13, marginTop: 4, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8 },
  link: { color: colors.primary, fontWeight: "800" },
});
