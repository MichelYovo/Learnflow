import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "./Icon";
import type { SubjectShortcut } from "../types/learnflow";
import { resolveSubjectScheme } from "../theme/colors";
import { useAppTheme } from "../theme/useAppTheme";

const PREVIEW_COUNT = 5;

type Props = {
  subjects: SubjectShortcut[];
  onSelectSubject: (subject: SubjectShortcut) => void;
  onSeeAll: () => void;
  title?: string;
  previewCount?: number;
};

/**
 * Mes matières — raccourcis horizontaux (maquette Figma Accueil).
 * 5 cartes visibles ; « Voir tout » ouvre la liste complète.
 */
export default function MesMatieres({
  subjects,
  onSelectSubject,
  onSeeAll,
  title = "Mes matières",
  previewCount = PREVIEW_COUNT,
}: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [seeAllOpen, setSeeAllOpen] = useState(false);

  const preview = useMemo(
    () => subjects.slice(0, previewCount),
    [subjects, previewCount]
  );

  const openSubject = (subject: SubjectShortcut) => {
    setSeeAllOpen(false);
    onSelectSubject(subject);
  };

  const openFullCatalog = () => {
    setSeeAllOpen(false);
    onSeeAll();
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textDark }]}>{title}</Text>
        <Pressable
          onPress={() => setSeeAllOpen(true)}
          hitSlop={8}
          style={({ pressed }) => [styles.seeAllBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Voir toutes les matières"
        >
          <Text style={[styles.seeAll, { color: colors.primary }]}>Voir tout</Text>
          <Icon name="chevron-right" size={12} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {preview.map((subject) => (
          <SubjectShortcutCard
            key={subject.id}
            subject={subject}
            onPress={() => openSubject(subject)}
          />
        ))}
      </ScrollView>

      <Modal
        visible={seeAllOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSeeAllOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.overlay}
            onPress={() => setSeeAllOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.white,
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
            <View style={styles.sheetHead}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={[styles.sheetTitle, { color: colors.textDark }]}>
                  Toutes les matières
                </Text>
              </View>
              <Pressable
                onPress={() => setSeeAllOpen(false)}
                hitSlop={10}
                style={[styles.closeBtn, { backgroundColor: colors.surfaceAlt }]}
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
              {subjects.map((subject) => (
                <SubjectListRow
                  key={subject.id}
                  subject={subject}
                  onPress={() => openSubject(subject)}
                />
              ))}
            </ScrollView>

            <Pressable
              onPress={openFullCatalog}
              style={({ pressed }) => [
                styles.catalogBtn,
                { backgroundColor: colors.mathsBg, borderColor: colors.mathsBorder },
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir Mes cours"
            >
              <Icon name="book" size={16} color={colors.primary} />
              <Text style={[styles.catalogBtnText, { color: colors.primary }]}>
                Ouvrir Mes cours
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SubjectShortcutCard({
  subject,
  onPress,
}: {
  subject: SubjectShortcut;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const scheme = resolveSubjectScheme(subject.colorScheme, colors);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={subject.fullName ?? subject.name}
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
    >
      <View
        style={[
          styles.iconCard,
          { backgroundColor: scheme.bg, borderColor: scheme.border },
        ]}
      >
        <Icon name={subject.icon} size={22} color={scheme.color} />
      </View>
      <Text style={[styles.name, { color: colors.textDark }]} numberOfLines={1}>
        {subject.name}
      </Text>
    </Pressable>
  );
}

function SubjectListRow({
  subject,
  onPress,
}: {
  subject: SubjectShortcut;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const scheme = resolveSubjectScheme(subject.colorScheme, colors);
  const label = subject.fullName ?? subject.name;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${subject.progress} pour cent`}
      style={({ pressed }) => [
        styles.listRow,
        {
          backgroundColor: colors.white,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.listIcon,
          { backgroundColor: scheme.bg, borderColor: scheme.border },
        ]}
      >
        <Icon name={subject.icon} size={20} color={scheme.color} />
      </View>
      <View style={styles.listBody}>
        <Text style={[styles.listName, { color: colors.textDark }]} numberOfLines={1}>
          {label}
        </Text>
        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.fill,
                { width: `${subject.progress}%`, backgroundColor: scheme.color },
              ]}
            />
          </View>
          <Text style={[styles.pct, { color: scheme.color }]}>{subject.progress}%</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14, marginHorizontal: -24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
  },
  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAll: { fontSize: 15, fontWeight: "700" },
  pressed: { opacity: 0.75 },
  row: { gap: 16, paddingHorizontal: 24, paddingBottom: 4 },
  tile: {
    width: 76,
    alignItems: "center",
    gap: 8,
  },
  tilePressed: { transform: [{ scale: 0.94 }], opacity: 0.9 },
  iconCard: {
    width: 64,
    height: 64,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    width: "100%",
  },
  modalRoot: { flex: 1, justifyContent: "flex-end" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 12,
    maxHeight: "82%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  sheetHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  sheetTitle: { fontSize: 18, fontWeight: "800" },
  sheetSub: { fontSize: 12, fontWeight: "600", marginTop: 4 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetList: { flexGrow: 0, maxHeight: 440 },
  sheetListContent: { gap: 8, paddingBottom: 4 },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
  },
  listIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  listBody: { flex: 1, minWidth: 0, gap: 8 },
  listName: { fontSize: 14, fontWeight: "800" },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  track: { flex: 1, height: 6, borderRadius: 99, overflow: "hidden" },
  fill: { height: 6, borderRadius: 99 },
  pct: { fontSize: 11, fontWeight: "800", width: 36, textAlign: "right" },
  catalogBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
  },
  catalogBtnText: { fontSize: 13, fontWeight: "800" },
});
