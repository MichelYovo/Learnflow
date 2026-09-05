import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { colors } from "../../theme/colors";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ParentsGate">;

export default function ParentsGateScreen({ navigation }: Props) {
  const challenge = useMemo(() => {
    const a = 6 + Math.floor(Math.random() * 4);
    const b = 6 + Math.floor(Math.random() * 4);
    return { a, b, answer: a * b };
  }, []);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (Number(value) === challenge.answer) {
      navigation.replace("Parents");
    } else {
      setError(true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.back} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={18} color={colors.textDark} />
      </Pressable>
      <View style={styles.center}>
        <Spira
          scene={error ? "parents.error" : "parents.gate"}
          size={88}
          message=""
        />
        <Text style={styles.title}>Sas parental</Text>
        <Text style={styles.sub}>Calcule {challenge.a} × {challenge.b}</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={value}
          onChangeText={(t) => {
            setValue(t);
            setError(false);
          }}
          placeholder="Résultat"
          placeholderTextColor={colors.textMuted}
        />
        {error ? <Text style={styles.error}>Incorrect — réessaie</Text> : null}
        <Pressable style={styles.primary} onPress={submit}>
          <Text style={styles.primaryText}>Entrer</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  back: { margin: 16, width: 40, height: 40, borderRadius: 14, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 10 },
  title: { fontSize: 22, fontWeight: "800", color: colors.textDark },
  sub: { color: colors.textMuted, fontSize: 16, fontWeight: "700" },
  input: {
    width: "100%",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.mathsBorder,
    borderRadius: 16,
    padding: 16,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    color: colors.textDark,
    marginTop: 8,
  },
  error: { color: colors.danger, fontWeight: "700" },
  primary: { marginTop: 8, backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 },
  primaryText: { color: colors.white, fontWeight: "800" },
});
