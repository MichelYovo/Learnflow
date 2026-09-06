import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../../components/Logo";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "OTP">;

const DEMO_OTP = "123456";

export default function OTPScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const sent = useRef(false);

  const submit = (value: string) => {
    if (sent.current) return;
    if (value !== DEMO_OTP) {
      setError("Code incorrect. Pour la démo, entre 123456.");
      return;
    }
    sent.current = true;
    navigation.navigate("Success");
  };

  useEffect(() => {
    if (code.length === 6) submit(code);
  }, [code]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]} edges={["top", "bottom"]}>
      <Logo height={76} style={{ alignSelf: "center", marginBottom: 16 }} />
      <Text style={[styles.title, { color: colors.textDark }]}>Vérification</Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>
        Entre le code à 6 chiffres. Pour la démo : 123456
      </Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.white, borderColor: colors.mathsBorder, color: colors.textDark }]}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={(t) => {
          setError("");
          sent.current = false;
          setCode(t.replace(/\D/g, "").slice(0, 6));
        }}
        placeholder="123456"
        placeholderTextColor={colors.textMuted}
        textAlign="center"
        autoFocus
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={() => submit(code)} style={styles.btnWrap}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
          <Text style={styles.btnText}>Valider</Text>
        </LinearGradient>
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
});
