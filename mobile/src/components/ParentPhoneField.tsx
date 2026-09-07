import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { normalizeTogoLocal, TOGO_PREFIX } from "../lib/phoneTogo";

export default function ParentPhoneField({
  value,
  onChange,
}: {
  value: string;
  onChange: (local8: string) => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textDark }]}>Numéro parent</Text>
      <Text style={[styles.hint, { color: colors.textMuted }]}>
        Togo uniquement. Un message WhatsApp LearnFlow sera envoyé à ce numéro à chaque connexion.
      </Text>
      <View style={[styles.row, { borderColor: colors.border }]}>
        <View style={[styles.prefix, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={[styles.prefixText, { color: colors.textDark }]}>{TOGO_PREFIX}</Text>
        </View>
        <TextInput
          style={[styles.input, { color: colors.textDark }]}
          value={value}
          onChangeText={(t) => onChange(normalizeTogoLocal(t))}
          keyboardType="number-pad"
          maxLength={8}
          placeholder="90xxxxxx"
          placeholderTextColor="#CBD5E1"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: "700" },
  hint: { fontSize: 11, fontWeight: "600", marginTop: -2 },
  row: {
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 2,
    borderRadius: 16,
  },
  prefix: { justifyContent: "center", paddingHorizontal: 12 },
  prefixText: { fontSize: 14, fontWeight: "800" },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: 14, fontWeight: "600" },
});
