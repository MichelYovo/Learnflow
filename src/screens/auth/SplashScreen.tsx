import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../../components/Logo";
import Spira from "../../components/Spira";
import { useAppTheme } from "../../theme/useAppTheme";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Splash">;

export default function SplashScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <View style={styles.content}>
        <Logo height={108} />
        <Spira scene="splash" size={88} />
        <Text style={[styles.tag, { color: colors.primary }]}>Programme APC Togo</Text>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => navigation.navigate("SignUp")} style={styles.primaryWrap}>
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.primary}>
            <Text style={styles.primaryText}>Créer un compte</Text>
          </LinearGradient>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("Login")}
          style={[styles.secondary, { borderColor: colors.borderStrong, backgroundColor: colors.white }]}
        >
          <Text style={[styles.secondaryText, { color: colors.textDark }]}>J'ai déjà un compte</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Profiles")}>
          <Text style={[styles.link, { color: colors.primary }]}>Continuer avec un profil démo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 24 },
  content: { flex: 1, justifyContent: "center", alignItems: "center", gap: 16 },
  tag: { fontSize: 16, fontWeight: "700" },
  sub: { fontSize: 14, textAlign: "center", lineHeight: 20, marginTop: 4 },
  actions: { gap: 12, paddingBottom: 24 },
  primaryWrap: { borderRadius: 18, overflow: "hidden" },
  primary: { paddingVertical: 16, alignItems: "center" },
  primaryText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  secondary: {
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryText: { fontWeight: "700", fontSize: 15 },
  link: { textAlign: "center", fontWeight: "700", fontSize: 13, marginTop: 4 },
});
