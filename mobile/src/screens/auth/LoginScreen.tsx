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
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { AuthStackParamList } from "../../navigation/types";
import { signInWithGoogle } from "../../lib/googleAuth";
import { savePendingAuth } from "../../lib/pendingAuth";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const goOtp = (nextEmail: string) => {
    setError("");
    navigation.navigate("OTP", { email: nextEmail, flow: "login" });
  };

  const goApp = async (provider?: "google" | "apple" | "facebook") => {
    setError("");
    if (provider === "google") {
      setBusy(true);
      const result = await signInWithGoogle();
      if (result.error) {
        setBusy(false);
        setError(result.error);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const nextEmail = data.session?.user.email ?? "";
      setBusy(false);
      if (!nextEmail) {
        setError("Impossible de lire l’email Google.");
        return;
      }
      await savePendingAuth({ email: nextEmail, flow: "google" });
      navigation.navigate("OTP", { email: nextEmail, flow: "google" });
      return;
    }
    if (provider) {
      setError("Apple et Facebook arrivent bientôt. Utilise Google ou l’email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Entre l’adresse email de ton compte.");
      return;
    }
    if (password.length < 8) {
      setError("Entre ton mot de passe.");
      return;
    }
    if (!isSupabaseConfigured) {
      setError("Supabase n’est pas configuré.");
      return;
    }
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (authError) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    await savePendingAuth({ email: email.trim().toLowerCase(), flow: "login" });
    goOtp(email.trim().toLowerCase());
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <Pressable onPress={() => navigation.navigate("Splash")} style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}>
        <Icon name="arrow-left" size={18} color={colors.textDark} />
      </Pressable>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Logo height={76} style={{ alignSelf: "center" }} />
          <Text style={styles.title}>Bon retour !</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>Reprends là où tu t'es arrêté.</Text>

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
            <View style={styles.pwHeader}>
              <Text style={[styles.label, { color: colors.textDark }]}>Mot de passe</Text>
              <Text style={styles.forgot}>Mot de passe oublié ?</Text>
            </View>
            <View>
              <TextInput
                style={[styles.input, { paddingRight: 44, backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.textDark }]}
                placeholder="••••••••"
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

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable onPress={() => { void goApp(); }} disabled={busy} style={styles.btnWrap}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
              <Text style={[styles.btnText, { color: colors.onPrimary }]}>{busy ? "Connexion…" : "Se connecter"}</Text>
            </LinearGradient>
          </Pressable>

          <SocialAuth mode="login" onProvider={(p) => { void goApp(p); }} />
        </ScrollView>
      </KeyboardAvoidingView>
      <Text style={[styles.footer, { color: colors.textSecondary }]}>
        Pas encore de compte ?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
          S'inscrire
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, gap: 12 },
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
  sub: { color: "#64748B", fontSize: 13, marginTop: -6, marginBottom: 8, textAlign: "center" },
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: "700", color: "#374151" },
  pwHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  forgot: { fontSize: 12, fontWeight: "700", color: colors.primary },
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
  eye: { position: "absolute", right: 14, top: 16 },
  btnWrap: { borderRadius: 16, overflow: "hidden", marginTop: 4 },
  btn: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  linkCenter: { textAlign: "center", color: colors.primary, fontWeight: "700" },
  footer: { textAlign: "center", color: "#64748B", fontSize: 13, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8 },
  link: { color: colors.primary, fontWeight: "800" },
  error: { color: colors.danger, fontSize: 12, fontWeight: "700" },
});
