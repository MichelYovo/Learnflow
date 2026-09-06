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
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const goOtp = () => {
    setError("");
    navigation.navigate("OTP");
  };

  const goApp = async (provider?: "google" | "apple" | "facebook") => {
    setError("");
    if (provider) {
      navigation.navigate("OTP");
      return;
    }
    if (isSupabaseConfigured && email.includes("@") && password.length >= 8) {
      setBusy(true);
      try {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) {
          setError(authError.message);
          setBusy(false);
          return;
        }
        navigation.navigate("OTP");
        return;
      } catch {
        setError("Connexion cloud indisponible. On continue en local.");
      } finally {
        setBusy(false);
      }
    }
    goOtp();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}>
            <Icon name="arrow-left" size={18} color={colors.textDark} />
          </Pressable>

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

          <Pressable onPress={() => navigation.navigate("Profiles")}>
            <Text style={styles.linkCenter}>Choisir un profil local</Text>
          </Pressable>

          <Text style={[styles.footer, { color: colors.textSecondary }]}>
            Pas encore de compte ?{" "}
            <Text style={styles.link} onPress={() => navigation.navigate("SignUp")}>
              S'inscrire
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingHorizontal: 24, paddingBottom: 32, gap: 14 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  title: { fontSize: 28, fontWeight: "800", color: colors.primary, letterSpacing: -0.4 },
  sub: { color: "#64748B", fontSize: 13, marginTop: -6, marginBottom: 8 },
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
  footer: { textAlign: "center", color: "#64748B", fontSize: 13 },
  link: { color: colors.primary, fontWeight: "800" },
  error: { color: colors.danger, fontSize: 12, fontWeight: "700" },
});
