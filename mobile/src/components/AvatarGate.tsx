import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLearnFlowStore } from "../store/useLearnFlowStore";
import { useAppTheme } from "../theme/useAppTheme";
import { AvatarChoiceGrid } from "./AvatarPicker";

export default function AvatarGate() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const avatarId = useLearnFlowStore((s) => s.getActiveProfile()?.avatarId);
  const updateProfileAvatar = useLearnFlowStore((s) => s.updateProfileAvatar);

  if (!isAuthenticated || avatarId) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={() => undefined}>
      <View style={styles.root}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.white, paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <Text style={[styles.title, { color: colors.textDark }]}>Choisis ton avatar</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>
            Une seule fois : il t’identifie dans les ligues et sur ton profil. Personne ne te l’attribue à ta place.
          </Text>
          <AvatarChoiceGrid selectedId={avatarId} onSelect={updateProfileAvatar} />
          <Pressable disabled style={styles.hintWrap}>
            <Text style={[styles.hint, { color: colors.textMuted }]}>Touche un visage pour continuer.</Text>
          </Pressable>
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
    maxHeight: "82%",
  },
  title: { fontSize: 22, fontWeight: "800", paddingHorizontal: 4 },
  sub: { fontSize: 13, fontWeight: "500", marginTop: 8, marginBottom: 12, paddingHorizontal: 4, lineHeight: 18 },
  hintWrap: { paddingVertical: 12, alignItems: "center" },
  hint: { fontSize: 12, fontWeight: "700" },
});
