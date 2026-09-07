import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "./Icon";
import { useAppTheme } from "../theme/useAppTheme";

type Props = {
  visible: boolean;
  profileName: string;
  accentColor?: string;
  errorMessage?: string | null;
  busy?: boolean;
  onCancel: () => void;
  onSubmit: (pin: string) => void;
};

export default function SwitchProfile({
  visible,
  profileName,
  accentColor,
  errorMessage,
  busy,
  onCancel,
  onSubmit,
}: Props) {
  const { colors, darkMode } = useAppTheme();
  const [pin, setPin] = useState("");
  const submitted = useRef(false);
  const inputRef = useRef<TextInput>(null);
  const accent = accentColor ?? colors.primary;

  const focusPinInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!visible) return;
    setPin("");
    submitted.current = false;
    focusPinInput();
    const frame = requestAnimationFrame(focusPinInput);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  useEffect(() => {
    if (!errorMessage) return;
    submitted.current = false;
    setPin("");
    focusPinInput();
  }, [errorMessage]);

  useEffect(() => {
    if (pin.length === 4 && !busy && !submitted.current) {
      submitted.current = true;
      onSubmit(pin);
    }
  }, [pin, busy, onSubmit]);

  const dots = useMemo(() => [0, 1, 2, 3], []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      onShow={focusPinInput}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onCancel}>
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.white, borderColor: colors.border }]}
            onPress={(e) => {
              e.stopPropagation();
              inputRef.current?.focus();
            }}
          >
            <View style={[styles.lock, { backgroundColor: darkMode ? "#0C1A33" : "#E6F4FF" }]}>
              <Icon name="lock" size={22} color={accent} />
            </View>
            <Text style={[styles.title, { color: colors.textDark }]}>Code PIN</Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>
              Tape le code à 4 chiffres de {profileName} avec ton clavier.
            </Text>

            <View style={styles.pinCapture}>
              <View style={styles.dots} pointerEvents="none">
                {dots.map((index) => {
                  const filled = index < pin.length;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          borderColor: errorMessage ? colors.danger : filled ? accent : colors.borderStrong,
                          backgroundColor: filled ? accent : "transparent",
                        },
                      ]}
                    />
                  );
                })}
              </View>
              {visible ? (
                <TextInput
                  key={profileName}
                  ref={inputRef}
                  value={pin}
                  onChangeText={(value) => {
                    if (busy) return;
                    setPin(value.replace(/\D/g, "").slice(0, 4));
                  }}
                  keyboardType="number-pad"
                  inputMode="numeric"
                  maxLength={4}
                  caretHidden
                  autoFocus
                  showSoftInputOnFocus
                  blurOnSubmit={false}
                  editable={!busy}
                  importantForAutofill="no"
                  autoComplete="off"
                  style={styles.hiddenInput}
                  accessibilityLabel={`Code PIN de ${profileName}`}
                />
              ) : null}
            </View>

            {errorMessage ? <Text style={[styles.error, { color: colors.danger }]}>{errorMessage}</Text> : null}

            <Pressable onPress={onCancel} style={styles.cancel} disabled={busy}>
              <Text style={[styles.cancelText, { color: colors.textMuted }]}>Annuler</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    padding: 20,
  },
  sheet: {
    borderRadius: 28,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    alignItems: "center",
  },
  lock: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "800" },
  sub: { fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 18, paddingHorizontal: 8 },
  pinCapture: {
    width: "100%",
    minHeight: 48,
    marginTop: 20,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dots: { flexDirection: "row", gap: 12 },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0.02,
    color: "transparent",
  },
  error: { fontSize: 12, fontWeight: "700", marginTop: 8, textAlign: "center" },
  cancel: { paddingVertical: 14, minHeight: 44 },
  cancelText: { fontSize: 14, fontWeight: "700" },
});
