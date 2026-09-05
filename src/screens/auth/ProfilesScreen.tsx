import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Logo from "../../components/Logo";
import SwitchProfile from "../../components/SwitchProfile";
import Avatar from "../../components/Avatar";
import { classLabel } from "../../data/mock";
import { validateLocalPin } from "../../db";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { ProfileEleve } from "../../types/learnflow";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Profiles">;

export default function ProfilesScreen({ navigation }: Props) {
  const selectProfile = useLearnFlowStore((s) => s.selectProfile);
  const profiles = useLearnFlowStore((s) => s.profiles);
  const { colors } = useAppTheme();
  const [pending, setPending] = useState<ProfileEleve | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmitPin = useCallback(
    async (pin: string) => {
      if (!pending) return;
      setBusy(true);
      setPinError(null);
      try {
        const ok = await validateLocalPin(String(pending.id), pin);
        if (!ok) {
          setPinError("Code PIN incorrect. Réessaie.");
          return;
        }
        const unlocked = pending;
        setPending(null);
        selectProfile(unlocked.id);
      } catch {
        setPinError("Impossible de vérifier le PIN hors ligne.");
      } finally {
        setBusy(false);
      }
    },
    [pending, selectProfile]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <Logo height={88} />
          </View>
          <Text style={[styles.title, { color: colors.textDark }]}>Qui révise aujourd'hui ?</Text>
          <Text style={styles.sub}>Chaque élève garde sa progression séparée.</Text>
        </View>

        <View style={styles.list}>
          {profiles.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => {
                setPinError(null);
                if (p.hasPin) setPending(p);
                else selectProfile(p.id);
              }}
              style={[styles.card, { backgroundColor: colors.white, borderColor: colors.border }]}
            >
              <Avatar
                avatarId={p.avatarId}
                size={56}
                radius={16}
                initials={p.firstName[0]}
                fallbackColor={p.color ?? colors.primary}
              />

              <View style={styles.cardBody}>
                <Text style={[styles.name, { color: colors.textDark }]}>{p.nom}</Text>
                <View style={styles.metaRow}>
                  <View style={[styles.gradePill, { backgroundColor: p.bg ?? colors.mathsBg }]}>
                    <Text style={[styles.gradeText, { color: p.color ?? colors.primary }]}>{p.gradeLabel ?? classLabel(p.classe)}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Icon name="flame" size={11} color={colors.danger} />
                    <Text style={styles.statText}>{p.streak}j</Text>
                  </View>
                  <View style={styles.stat}>
                    <Icon name="zap" size={11} color={colors.accent} />
                    <Text style={styles.statText}>{p.xpTotale.toLocaleString()} XP</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.chevron, { backgroundColor: p.bg ?? colors.mathsBg }]}>
                <Icon name={p.hasPin ? "lock" : "chevron-right"} size={16} color={p.color ?? colors.primary} />
              </View>
            </Pressable>
          ))}

          <Pressable style={[styles.addCard, { backgroundColor: colors.mathsBg, borderColor: colors.mathsBorder }]} onPress={() => navigation.navigate("SignUp", { requirePin: true })}>
            <View style={styles.addAvatar}>
              <Icon name="user" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addTitle}>Ajouter un profil</Text>
              <Text style={styles.addSub}>Nouveau compte pour un autre élève</Text>
            </View>
          </Pressable>

          <View style={styles.infoBanner}>
            <Icon name="lightbulb" size={16} color={colors.accent} />
            <Text style={styles.infoText}>
              Les profils et le PIN (si le multi-profil est activé) sont <Text style={styles.infoBold}>stockés localement</Text> — aucun réseau n'est requis pour changer d'élève.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.accountBtn, { backgroundColor: colors.textDark }]} onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.accountBtnText, { color: colors.surface }]}>Accéder à mon compte</Text>
        </Pressable>
        <Text style={[styles.legal, { color: colors.textMuted }]}>
          En continuant, tu acceptes la politique de confidentialité de LearnFlow.
        </Text>
      </View>

      <SwitchProfile
        visible={pending !== null}
        profileName={pending?.firstName ?? ""}
        accentColor={pending?.color}
        errorMessage={pinError}
        busy={busy}
        onCancel={() => {
          setPending(null);
          setPinError(null);
        }}
        onSubmit={onSubmitPin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: { paddingBottom: 16 },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20, alignItems: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 22 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { fontSize: 20, fontWeight: "800", color: colors.textDark, letterSpacing: -0.3 },
  title: { fontSize: 24, fontWeight: "800", color: colors.textDark, textAlign: "center", lineHeight: 30 },
  sub: { marginTop: 6, fontSize: 14, color: "#78716C", textAlign: "center", fontWeight: "400" },
  list: { paddingHorizontal: 20, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardBody: { flex: 1, minWidth: 0 },
  name: { fontSize: 16, fontWeight: "800", color: colors.textDark },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" },
  gradePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  gradeText: { fontSize: 10, fontWeight: "800" },
  stat: { flexDirection: "row", alignItems: "center", gap: 3 },
  statText: { fontSize: 10, color: colors.textMuted, fontWeight: "600" },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.mathsBorder,
    borderRadius: 24,
    padding: 16,
    backgroundColor: "#F8F8FF",
  },
  addAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.mathsBg,
    borderWidth: 2,
    borderColor: colors.mathsBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  addTitle: { fontSize: 14, fontWeight: "800", color: colors.primary },
  addSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FFFBEB",
    borderWidth: 2,
    borderColor: "#FDE68A",
    borderRadius: 16,
    padding: 12,
  },
  infoText: { flex: 1, fontSize: 10, color: "#92400E", lineHeight: 15, fontWeight: "500" },
  infoBold: { fontWeight: "800" },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 20, gap: 10 },
  accountBtn: {
    backgroundColor: colors.textDark,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  accountBtnText: { color: colors.white, fontWeight: "800", fontSize: 15 },
  legal: { textAlign: "center", fontSize: 11, color: colors.textMuted },
});
