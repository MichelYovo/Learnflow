import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { isLikelyTogoMobile, normalizeTogoLocal, TOGO_PREFIX } from "../lib/phoneTogo";

export const PARENT_PHONE_LABEL = "WhatsApp de ton père, ta mère ou ton tuteur";
export const PARENT_PHONE_HINT =
  "Pas ton numéro. LearnFlow envoie un message d’accueil à ce parent, puis un petit point sur tes progrès (toutes les 1 à 2 semaines).";
export const PARENT_PHONE_CONFIRM =
  "Je confirme : c’est le WhatsApp d’un parent ou tuteur, pas le mien.";

export default function ParentPhoneField({
  value,
  onChange,
  confirmed = false,
  onConfirmChange,
  optional = false,
}: {
  value: string;
  onChange: (local8: string) => void;
  confirmed?: boolean;
  onConfirmChange?: (v: boolean) => void;
  optional?: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textDark }]}>
        {PARENT_PHONE_LABEL}
        {optional ? " (facultatif)" : ""}
      </Text>
      <Text style={[styles.hint, { color: colors.textMuted }]}>{PARENT_PHONE_HINT}</Text>
      <View style={[styles.row, { borderColor: colors.border }]}>
        <View style={[styles.prefix, { backgroundColor: colors.surfaceAlt }]}>
          <Text style={[styles.prefixText, { color: colors.textDark }]}>{TOGO_PREFIX}</Text>
        </View>
        <TextInput
          style={[styles.input, { color: colors.textDark }]}
          value={value}
          onChangeText={(t) => {
            onChange(normalizeTogoLocal(t));
            onConfirmChange?.(false);
          }}
          keyboardType="number-pad"
          maxLength={8}
          placeholder="90xxxxxx"
          placeholderTextColor="#CBD5E1"
        />
      </View>
      {value.length === 8 && !isLikelyTogoMobile(value) ? (
        <Text style={styles.warn}>Mobile Togo uniquement : commence par 7 (Moov) ou 9 (Togocel).</Text>
      ) : null}
      {value.length > 0 && onConfirmChange ? (
        <Pressable
          onPress={() => onConfirmChange(!confirmed)}
          style={[styles.confirm, { backgroundColor: colors.surfaceAlt }]}
        >
          <View style={[styles.box, { borderColor: confirmed ? "#1677FF" : "#CBD5E1", backgroundColor: confirmed ? "#1677FF" : "transparent" }]}>
            {confirmed ? <Text style={styles.check}>✓</Text> : null}
          </View>
          <Text style={[styles.confirmText, { color: colors.textDark }]}>{PARENT_PHONE_CONFIRM}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 12, fontWeight: "700" },
  hint: { fontSize: 11, fontWeight: "600", marginTop: -2, lineHeight: 16 },
  row: {
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 2,
    borderRadius: 16,
  },
  prefix: { justifyContent: "center", paddingHorizontal: 12 },
  prefixText: { fontSize: 14, fontWeight: "800" },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, fontSize: 14, fontWeight: "600" },
  confirm: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  box: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 1 },
  check: { color: "#fff", fontSize: 11, fontWeight: "800" },
  confirmText: { flex: 1, fontSize: 12, fontWeight: "600", lineHeight: 16 },
  warn: { fontSize: 11, fontWeight: "700", color: "#EF4444" },
});
