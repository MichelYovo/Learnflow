import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
    const t = setTimeout(() => login(), 900);
    return () => clearTimeout(t);
  }, [login]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <Logo height={96} />
      <Spira scene="auth.success" size={112} message="" />
      <Text style={[styles.title, { color: colors.secondary }]}>Bienvenue !</Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>Ton espace élève est prêt.</Text>
      <Pressable onPress={login} style={styles.btnWrap}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
          <Text style={styles.btnText}>Entrer dans LearnFlow</Text>
        </LinearGradient>
      </Pressable>
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
  sub: { color: colors.textMuted, fontWeight: "500", marginBottom: 8 },
  btnWrap: { borderRadius: 16, overflow: "hidden", alignSelf: "stretch", marginTop: 8 },
  btn: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: colors.white, fontWeight: "800", fontSize: 16 },
});
