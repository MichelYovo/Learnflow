import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isCloudProfileId } from "../data/mock";
import { hasParentConfirmed, markParentConfirmed } from "../lib/parentConfirm";
import { isLikelyTogoMobile, maskTogoPhone } from "../lib/phoneTogo";
import { notifySecureLogin } from "../lib/secureAuth";
import { useLearnFlowStore } from "../store/useLearnFlowStore";
import { useAppTheme } from "../theme/useAppTheme";

export default function ParentConfirmModal() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const profile = useLearnFlowStore((s) => s.getActiveProfile());
  const authenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const [mode, setMode] = useState<"confirm" | "invalid" | null>(null);

  useEffect(() => {
    if (!authenticated || !isCloudProfileId(profile.id)) {
      setMode(null);
      return;
    }
    const phone = profile.parentPhone || "";
    if (!phone) {
      setMode(null);
      return;
    }
    if (!isLikelyTogoMobile(phone)) {
      setMode("invalid");
      return;
    }
    let cancelled = false;
    void hasParentConfirmed(profile.id).then((ok) => {
      if (!cancelled) setMode(ok ? null : "confirm");
    });
    return () => {
      cancelled = true;
    };
  }, [authenticated, profile.id, profile.parentPhone]);

  if (!mode || !profile.parentPhone) return null;

  const goFix = () => {
    setMode(null);
    navigation.navigate("PrivacySettings" as never);
  };

  const confirm = () => {
    void markParentConfirmed(profile.id);
    void notifySecureLogin("parent_linked");
    setMode(null);
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={() => undefined}>
      <View style={styles.root}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.white, paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {mode === "invalid" ? (
            <>
              <Text style={styles.kickerInvalid}>Numéro à corriger</Text>
              <Text style={[styles.title, { color: colors.textDark }]}>
                Ce WhatsApp parent n’est pas un mobile Togo
              </Text>
              <Text style={[styles.sub, { color: colors.textMuted }]}>
                Tu as enregistré {maskTogoPhone(profile.parentPhone)}. Un numéro Togo commence par 7 (Moov) ou 9
                (Togocel).
              </Text>
              <Pressable onPress={goFix} style={styles.primary}>
                <Text style={styles.primaryText}>Corriger le numéro</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.kicker}>Vérification</Text>
              <Text style={[styles.title, { color: colors.textDark }]}>
                C’est bien le WhatsApp de ton parent ?
              </Text>
              <Text style={[styles.sub, { color: colors.textMuted }]}>
                Tu as enregistré {maskTogoPhone(profile.parentPhone)}. LearnFlow enverra un message d’accueil et un
                petit point de progrès à ce numéro — pas au tien.
              </Text>
              <Pressable onPress={confirm} style={styles.primary}>
                <Text style={styles.primaryText}>Oui, c’est mon père, ma mère ou mon tuteur</Text>
              </Pressable>
              <Pressable onPress={goFix} style={[styles.secondary, { backgroundColor: colors.surfaceAlt }]}>
                <Text style={[styles.secondaryText, { color: colors.textDark }]}>Non, je corrige le numéro</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15,23,42,0.45)",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 10,
  },
  kicker: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase", color: "#1677FF" },
  kickerInvalid: { fontSize: 11, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase", color: "#EF4444" },
  title: { fontSize: 20, fontWeight: "800" },
  sub: { fontSize: 14, fontWeight: "600", lineHeight: 20 },
  primary: { marginTop: 8, borderRadius: 16, backgroundColor: "#1677FF", paddingVertical: 14, alignItems: "center" },
  primaryText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  secondary: { borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  secondaryText: { fontSize: 14, fontWeight: "800" },
});
