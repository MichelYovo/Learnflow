import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../../components/Logo";
import { advanceFromSession } from "../../lib/advanceAuth";
import { sendSecureEmailOtp, verifySecureEmailOtp } from "../../lib/secureAuth";
import { loadPendingAuth, savePendingAuth } from "../../lib/pendingAuth";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { AuthStackParamList } from "../../navigation/types";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  return `${local.slice(0, Math.min(2, local.length))}***@${domain}`;
}

function formatMmSs(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Props = NativeStackScreenProps<AuthStackParamList, "OTP">;

export default function OTPScreen({ navigation, route }: Props) {
  const { colors } = useAppTheme();
  const applyCloudUser = useLearnFlowStore((s) => s.applyCloudUser);
  const [email, setEmail] = useState(route.params?.email ?? "");
  const [flow, setFlow] = useState(route.params?.flow ?? "login");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("Envoi du code…");
  const [wait, setWait] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const started = useRef(false);
  const verifyingLock = useRef(false);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let cancelled = false;
    void (async () => {
      const pending = await loadPendingAuth();
      const nextEmail = (route.params?.email || pending?.email || "").trim().toLowerCase();
      const nextFlow = route.params?.flow || pending?.flow || "login";
      if (cancelled) return;
      setEmail(nextEmail);
      setFlow(nextFlow);
      if (!nextEmail.includes("@")) {
        setInfo("");
        setError("Adresse email manquante. Repars de la connexion.");
        return;
      }
      setSending(true);
      const result = await sendSecureEmailOtp(nextEmail);
      if (cancelled) return;
      setSending(false);
      if (result.retryAfterSeconds) setWait(result.retryAfterSeconds);
      if (result.error) {
        setError(result.error);
        setInfo(`Entre le code envoyé à ${maskEmail(nextEmail)} s’il est déjà arrivé.`);
        return;
      }
      setError("");
      setInfo(`Un code à 6 chiffres a été envoyé à ${maskEmail(nextEmail)}.`);
    })();
    return () => {
      cancelled = true;
    };
  }, [route.params?.email, route.params?.flow]);

  const markVerified = async () => {
    const pending = await loadPendingAuth();
    if (pending) await savePendingAuth({ ...pending, emailOtpVerified: true });
    else if (email.includes("@")) await savePendingAuth({ email, flow, emailOtpVerified: true });
  };

  const submit = async (value: string) => {
    if (verifyingLock.current || verifying || sending) return;
    if (value.length !== 6) {
      setError("Entre les 6 chiffres reçus par email.");
      return;
    }
    if (!email.includes("@")) {
      setError("Adresse email manquante.");
      return;
    }
    verifyingLock.current = true;
    setVerifying(true);
    setError("");
    const result = await verifySecureEmailOtp(email, value);
    if (result.error) {
      verifyingLock.current = false;
      setVerifying(false);
      setError(result.error);
      if (result.retryAfterSeconds) setWait(result.retryAfterSeconds);
      return;
    }
    await markVerified();
    const settled = await advanceFromSession(navigation, applyCloudUser);
    if (settled.error) {
      verifyingLock.current = false;
      setVerifying(false);
      setError(settled.error);
    }
  };

  const resend = async () => {
    if (!email.includes("@") || sending || wait > 0) return;
    setError("");
    setSending(true);
    const result = await sendSecureEmailOtp(email, { force: true });
    setSending(false);
    setWait(result.retryAfterSeconds ?? 60);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo(`Nouveau code envoyé à ${maskEmail(email)}.`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <Logo height={76} style={{ alignSelf: "center", marginBottom: 16 }} />
      <Text style={[styles.title, { color: colors.textDark }]}>Entre le code</Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>
        {info || "Le code à 6 chiffres arrive par email. Aucun lien à cliquer."}
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.white, borderColor: colors.mathsBorder, color: colors.textDark }]}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={(t) => {
          setError("");
          verifyingLock.current = false;
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
      <Pressable onPress={() => void submit(code)} disabled={verifying || sending} style={styles.btnWrap}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
          <Text style={styles.btnText}>{verifying ? "Vérification…" : "Valider"}</Text>
        </LinearGradient>
      </Pressable>
      <Pressable onPress={() => void resend()} disabled={wait > 0 || sending} style={{ marginTop: 16 }}>
        <Text style={[styles.resend, { color: wait > 0 || sending ? colors.textMuted : colors.primary }]}>
          {wait > 0 ? `Renvoyer le code dans ${formatMmSs(wait)}` : sending ? "Envoi…" : "Renvoyer le code"}
        </Text>
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
