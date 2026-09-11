import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLearnFlowStore } from "../store/useLearnFlowStore";
import { useAppTheme } from "../theme/useAppTheme";
import { AvatarChoiceGrid } from "./AvatarPicker";

const listeners = new Set<() => void>();

export function notifyLeftProfilWithoutAvatar() {
  listeners.forEach((fn) => fn());
}

export default function AvatarGate() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const isAuthenticated = useLearnFlowStore((s) => s.isAuthenticated);
  const avatarId = useLearnFlowStore((s) => s.getActiveProfile()?.avatarId);
  const updateProfileAvatar = useLearnFlowStore((s) => s.updateProfileAvatar);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onLeave = () => {
      const id = useLearnFlowStore.getState().getActiveProfile()?.avatarId;
      if (useLearnFlowStore.getState().isAuthenticated && !id) setOpen(true);
    };
    listeners.add(onLeave);
    return () => {
      listeners.delete(onLeave);
    };
  }, []);

  if (!open || !isAuthenticated || avatarId) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={() => undefined}>
      <View style={styles.root}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.white,
              paddingBottom: Math.max(insets.bottom, 12),
              maxHeight: height * 0.88,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.textDark }]}>Choisis ta personnalité</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>
            Elle te suit dans les ligues et sur ton profil. Son look évolue avec ton rang — pas à chaque connexion.
          </Text>
          <AvatarChoiceGrid
            selectedId={avatarId}
            onSelect={(id) => {
              updateProfileAvatar(id);
              setOpen(false);
            }}
          />
          <Text style={[styles.hint, { color: colors.textMuted }]}>Touche une mascotte pour continuer.</Text>
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
    maxHeight: "88%",
  },
  title: { fontSize: 22, fontWeight: "800", paddingHorizontal: 4 },
  sub: { fontSize: 13, fontWeight: "500", marginTop: 8, marginBottom: 12, paddingHorizontal: 4, lineHeight: 18 },
  hint: { fontSize: 12, fontWeight: "700", textAlign: "center", paddingVertical: 12 },
});
