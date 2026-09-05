import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../../components/Logo";
import Spira from "../../components/Spira";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Success">;

export default function SuccessScreen({}: Props) {
  const login = useLearnFlowStore((s) => s.login);
  const { colors } = useAppTheme();

  useEffect(() => {
    const t = setTimeout(() => login(), 1400);
    return () => clearTimeout(t);
  }, [login]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <Logo height={96} />
      <Spira scene="auth.success" size={112} message="" />
      <Text style={[styles.title, { color: colors.secondary }]}>Bienvenue !</Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>Préparation de ton espace élève…</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  title: { fontSize: 28, fontWeight: "800", color: colors.secondary, marginTop: 12 },
  sub: { color: colors.textMuted, fontWeight: "500" },
});
