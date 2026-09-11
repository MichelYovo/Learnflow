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
  required?: boolean;
};

function AvatarGrid({
  selectedId,
  onSelect,
}: {
  selectedId?: string | null;
  onSelect: (id: string) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.grid}>
      {AVATARS.map((persona) => {
        const on = selectedId === persona.id;
        return (
          <Pressable
            key={persona.id}
            onPress={() => onSelect(persona.id)}
            style={[styles.cell, on && { backgroundColor: colors.mathsBg, borderColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={persona.label}
          >
            <Avatar avatarId={persona.id} size={56} selected={on} />
            <Text style={[styles.cellLabel, { color: on ? colors.primary : colors.textDark }]}>{persona.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function AvatarPicker({ visible, selectedId, onSelect, onClose, required }: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={required ? undefined : onClose}>
      <View style={styles.root}>
        <Pressable
          style={styles.overlay}
          onPress={required ? undefined : onClose}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
        />
        <View style={[styles.sheet, { backgroundColor: colors.white, paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
          <View style={styles.head}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.textDark }]}>Choisis ta personnalité</Text>
              <Text style={[styles.sub, { color: colors.textMuted }]}>
                Une mascotte à toi — son look change avec ton rang de ligue.
              </Text>
            </View>
            {required ? null : (
              <Pressable
                onPress={onClose}
                hitSlop={10}
                style={[styles.close, { backgroundColor: colors.surfaceAlt }]}
                accessibilityRole="button"
                accessibilityLabel="Fermer"
              >
                <Icon name="x" size={16} color={colors.textDark} />
              </Pressable>
            )}
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.sheetList} contentContainerStyle={styles.sheetListContent}>
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
    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false} style={styles.embedList} contentContainerStyle={styles.embedContent}>
      <AvatarGrid selectedId={selectedId} onSelect={onSelect} />
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
  embedList: { maxHeight: 280 },
  embedContent: { paddingBottom: 4 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cellLabel: { marginTop: 4, fontSize: 11, fontWeight: "800" },
});
