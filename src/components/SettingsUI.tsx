import React from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import Icon from "./Icon";

type ToggleRowProps = {
  label: string;
  sub?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
};

export function SettingsToggleRow({ label, sub, value, onValueChange }: ToggleRowProps) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.surfaceAlt }]}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={[styles.label, { color: colors.textDark }]}>{label}</Text>
        {sub ? <Text style={[styles.sub, { color: colors.textMuted }]}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.borderStrong, true: colors.mathsBorder }}
        thumbColor={value ? colors.primary : colors.surfaceAlt}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel={label}
      />
    </View>
  );
}

type HeaderProps = {
  title: string;
  onBack: () => void;
};

export function SettingsHeader({ title, onBack }: HeaderProps) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
      <Pressable
        onPress={onBack}
        style={[styles.back, { backgroundColor: colors.surfaceAlt }]}
        accessibilityRole="button"
        accessibilityLabel="Retour"
      >
        <Icon name="arrow-left" size={18} color={colors.textDark} />
      </Pressable>
      <Text style={[styles.title, { color: colors.textDark }]}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 16, fontWeight: "800" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  label: { fontSize: 14, fontWeight: "800" },
  sub: { fontSize: 11, marginTop: 2, lineHeight: 15 },
});
