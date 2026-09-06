import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Constants from "expo-constants";
import Icon from "../../components/Icon";
import Logo from "../../components/Logo";
import Spira from "../../components/Spira";
import { SettingsHeader } from "../../components/SettingsUI";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "About">;

const VERSION =
  Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";

export default function AboutScreen({ navigation }: Props) {
  const { colors } = useAppTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <SettingsHeader title="À propos" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <Logo height={100} />
          <Text style={[styles.version, { color: colors.textMuted }]}>Version {VERSION} · Togo · APC</Text>
        </View>

        <Spira scene="settings.about" size={72} message="" />

        <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textDark }]}>Mission</Text>
          <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
            Application mobile d'apprentissage pour collégiens et lycéens : fiches, flashcards (algo des J), règle du
            10/10, 4 modes (Libre, Guidé, Cramming, Blitz) et ligues.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textDark }]}>Crédits</Text>
          <Text style={[styles.cardBody, { color: colors.textSecondary }]}>
            LearnFlow MVP · Design Figma · React Native / Expo · Offline-first
          </Text>
          <Pressable onPress={() => void Linking.openURL("https://icons8.com")} hitSlop={6}>
            <Text style={[styles.cardBody, { color: colors.primary, marginTop: 8 }]}>
              Icônes de navigation : Icons8
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.linkBtn, { backgroundColor: colors.white, borderColor: colors.mathsBorder }]}
          onPress={() => void Linking.openURL("mailto:support@learnflow.tg?subject=LearnFlow%20Support")}
        >
          <Icon name="mail" size={16} color={colors.primary} />
          <Text style={styles.linkText}>Contacter le support</Text>
        </Pressable>

        <Pressable style={[styles.linkBtn, { backgroundColor: colors.white, borderColor: colors.mathsBorder }]} onPress={() => navigation.navigate("PrivacySettings")}>
          <Icon name="shield" size={16} color={colors.primary} />
          <Text style={styles.linkText}>Politique de confidentialité</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  body: { padding: 20, gap: 14, alignItems: "stretch" },
  hero: { alignItems: "center", gap: 10, paddingVertical: 16 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { fontSize: 24, fontWeight: "800", color: colors.textDark },
  version: { fontSize: 12, color: colors.textMuted, fontWeight: "600" },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    gap: 6,
  },
  cardTitle: { fontSize: 13, fontWeight: "800", color: colors.textDark },
  cardBody: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.mathsBorder,
    padding: 14,
  },
  linkText: { fontWeight: "800", color: colors.primary, fontSize: 14 },
});
