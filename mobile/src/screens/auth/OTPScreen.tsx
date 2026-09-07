import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../../components/Logo";
import { advanceFromSession } from "../../lib/advanceAuth";
import { sendEmailOtp, verifyEmailOtp } from "../../lib/emailOtp";
import { loadPendingAuth } from "../../lib/pendingAuth";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "OTP">;

export default function OTPScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const [email, setEmail] = useState(route.params?.email ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("Envoi du code…");
  const [busy, setBusy] = useState(false);
  const sent = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const pending = await loadPendingAuth();
      const nextEmail = (route.params?.email || pending?.email || "").trim().toLowerCase();
      if (cancelled) return;
      setEmail(nextEmail);
      if (!nextEmail.includes("@")) {
        setInfo("");
        setError("Adresse email manquante. Repars de la connexion.");
        return;
      }
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session?.user) {
          setInfo("Compte déjà vérifié, on continue…");
          const settled = await advanceFromSession(navigation, applyCloudUser);
          if (settled.error && !cancelled) {
            setError(settled.error);
            setInfo("");
          }
          return;
        }
      }
      const result = await sendEmailOtp(nextEmail, { shouldCreateUser: pending?.flow === "signup" });
      if (cancelled) return;
      if (result.error) {
        setError(result.error);
        setInfo("");
        return;
      }
      setInfo(`Un code à 6 chiffres a été envoyé à ${nextEmail}. Regarde aussi les spams.`);
    })();
    return () => {
      cancelled = true;
    };
  }, [applyCloudUser, navigation, route.params?.email]);

  const submit = async (value: string) => {
    if (sent.current || busy) return;
    if (value.length !== 6) {
      setError("Entre les 6 chiffres reçus par email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Adresse email manquante.");
      return;
    }
    sent.current = true;
    setBusy(true);
    setError("");
    const result = await verifyEmailOtp(email, value);
    if (result.error) {
      sent.current = false;
      setBusy(false);
      setError(result.error);
      return;
    }
    const settled = await advanceFromSession(navigation, applyCloudUser);
    if (settled.error) {
      sent.current = false;
      setBusy(false);
      setError(settled.error);
    }
  };

  const resend = async () => {
    if (!email.includes("@") || busy) return;
    setError("");
    setBusy(true);
    const pending = await loadPendingAuth();
    const result = await sendEmailOtp(email, { shouldCreateUser: pending?.flow === "signup", force: true });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo(`Nouveau code envoyé à ${email}. Regarde aussi les spams.`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <Logo height={76} style={{ alignSelf: "center", marginBottom: 16 }} />
      <Text style={[styles.title, { color: colors.textDark }]}>Vérification</Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>
        {info || "Entre le code à 6 chiffres reçu par email."}
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.white, borderColor: colors.mathsBorder, color: colors.textDark }]}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={(t) => {
          setError("");
          sent.current = false;
          const next = t.replace(/\D/g, "").slice(0, 6);
          setCode(next);
          if (next.length === 6) void submit(next);
        }}
        placeholder="••••••"
        placeholderTextColor={colors.textMuted}
        textAlign="center"
        autoFocus
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={() => void submit(code)} disabled={busy} style={styles.btnWrap}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
          <Text style={styles.btnText}>{busy ? "Vérification…" : "Valider"}</Text>
        </LinearGradient>
      </Pressable>
      <Pressable onPress={() => void resend()} style={{ marginTop: 16 }}>
        <Text style={[styles.resend, { color: colors.primary }]}>Renvoyer le code</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface, padding: 24, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "800", color: colors.textDark, textAlign: "center" },
  sub: { color: colors.textMuted, textAlign: "center", marginTop: 8, marginBottom: 24 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.mathsBorder,
    borderRadius: 16,
    paddingVertical: 18,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 12,
    color: colors.textDark,
    marginBottom: 16,
  },
  btnWrap: { borderRadius: 16, overflow: "hidden" },
  btn: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  error: { color: colors.danger, textAlign: "center", fontWeight: "700", marginBottom: 12 },
  resend: { textAlign: "center", fontWeight: "800", fontSize: 14 },
});
