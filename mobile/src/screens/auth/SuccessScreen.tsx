import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../../components/Logo";
import Spira from "../../components/Spira";
import { SlideIn } from "../../components/ui";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
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
      <SlideIn id="success">
        <View style={styles.center}>
          <Logo height={88} float />
          <Spira scene="auth.success" size={120} />
          <Text style={[styles.title, { color: colors.textDark }]}>Compte prêt</Text>
          <Pressable onPress={login} style={styles.btnWrap}>
            <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.btn}>
              <Text style={styles.btnText}>Entrer dans LearnFlow</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SlideIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    padding: 24,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  title: { fontSize: 28, fontWeight: "800", marginTop: 16, textAlign: "center" },
  btnWrap: { borderRadius: 16, overflow: "hidden", alignSelf: "stretch", marginTop: 24 },
  btn: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
});
