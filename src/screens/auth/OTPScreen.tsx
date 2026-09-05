import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../../components/Logo";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "OTP">;

export default function OTPScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  const [code, setCode] = useState("");

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <Logo height={76} style={{ alignSelf: "center", marginBottom: 16 }} />
      <Text style={[styles.title, { color: colors.textDark }]}>Vérification OTP</Text>
      <Text style={styles.sub}>Entre le code à 6 chiffres (démo : 123456)</Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        placeholder="••••••"
        placeholderTextColor={colors.textMuted}
        textAlign="center"
      />
      <Pressable
        onPress={() => navigation.navigate("Success")}
        style={styles.btnWrap}
      >
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
});
