import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "./Icon";
import { colors } from "../theme/colors";
import { useAppTheme } from "../theme/useAppTheme";

type Provider = "google" | "apple" | "facebook";

type Props = {
  mode: "login" | "signup";
  onProvider: (provider: Provider) => void;
};

const PROVIDERS: { id: Provider; label: string; icon: string; color: string }[] = [
  { id: "google", label: "Google", icon: "logo-google", color: "#EA4335" },
  { id: "apple", label: "Apple", icon: "logo-apple", color: "#1C1917" },
  { id: "facebook", label: "Facebook", icon: "logo-facebook", color: "#1877F2" },
];

export default function SocialAuth({ mode, onProvider }: Props) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.wrap}>
      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text style={[styles.or, { color: colors.textMuted }]}>{mode === "login" ? "ou se connecter avec" : "ou s'inscrire avec"}</Text>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>

      <Pressable style={[styles.google, { backgroundColor: colors.white, borderColor: colors.border }]} onPress={() => onProvider("google")}>
        <Icon name="logo-google" size={18} color="#EA4335" />
        <Text style={[styles.googleText, { color: colors.textDark }]}>Continuer avec Google</Text>
      </Pressable>

      <View style={styles.row}>
        {PROVIDERS.slice(1).map((p) => (
          <Pressable key={p.id} style={[styles.alt, { backgroundColor: colors.white, borderColor: colors.border }]} onPress={() => onProvider(p.id)}>
            <Icon name={p.icon} size={18} color={p.color} />
            <Text style={[styles.altText, { color: colors.textDark }]}>{p.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  divider: { flexDirection: "row", alignItems: "center", gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  or: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
  google: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
  },
  googleText: { fontSize: 14, fontWeight: "700", color: "#374151" },
  row: { flexDirection: "row", gap: 10 },
  alt: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 12,
  },
  altText: { fontSize: 13, fontWeight: "700", color: "#374151" },
});
