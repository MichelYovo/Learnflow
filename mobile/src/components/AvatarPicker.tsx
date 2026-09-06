import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AVATARS } from "../data/avatars";
import { useAppTheme } from "../theme/useAppTheme";
import Avatar from "./Avatar";
import Icon from "./Icon";

type Props = {
  visible: boolean;
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

function AvatarGrid({
  selectedId,
  onSelect,
  compact,
}: {
  selectedId?: string | null;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  const { colors } = useAppTheme();
  const size = compact ? 56 : 64;
  return (
    <View style={styles.grid}>
      {AVATARS.map((avatar, i) => {
        const on = selectedId === avatar.id;
        return (
          <Pressable
            key={avatar.id}
            onPress={() => onSelect(avatar.id)}
            style={[
              styles.cell,
              on && { backgroundColor: colors.mathsBg, borderColor: colors.primary },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`Avatar ${i + 1}`}
          >
            <Avatar avatarId={avatar.id} size={size} selected={on} />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function AvatarPicker({ visible, selectedId, onSelect, onClose }: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.overlay} onPress={onClose} accessibilityRole="button" accessibilityLabel="Fermer" />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.white, paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
          <View style={styles.head}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.textDark }]}>Choisis ton avatar</Text>
              <Text style={[styles.sub, { color: colors.textMuted }]}>
                10 visages d’élèves — il t’identifie partout dans l’app.
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={[styles.close, { backgroundColor: colors.surfaceAlt }]}
              accessibilityRole="button"
              accessibilityLabel="Fermer"
            >
              <Icon name="x" size={16} color={colors.textDark} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.sheetList}
            contentContainerStyle={styles.sheetListContent}
          >
            <AvatarGrid
              selectedId={selectedId}
              onSelect={(id) => {
                onSelect(id);
                onClose();
              }}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function AvatarChoiceGrid({
  selectedId,
  onSelect,
}: {
  selectedId?: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      style={styles.embedList}
      contentContainerStyle={styles.embedContent}
    >
      <AvatarGrid selectedId={selectedId} onSelect={onSelect} compact />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15,23,42,0.45)",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 8,
    maxHeight: "78%",
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 99,
    marginBottom: 12,
  },
  head: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 12, paddingHorizontal: 4 },
  title: { fontSize: 18, fontWeight: "800" },
  sub: { fontSize: 12, marginTop: 4, fontWeight: "500" },
  close: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetList: { maxHeight: 440 },
  sheetListContent: { paddingBottom: 8 },
  embedList: { maxHeight: 220 },
  embedContent: { paddingBottom: 4 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "20%",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
});
