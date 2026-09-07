import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Icon from "../../components/Icon";
import Spira from "../../components/Spira";
import { SettingsHeader } from "../../components/SettingsUI";
import { spiraForRatingStars } from "../../data/spira";
import { useLearnFlowStore } from "../../store/useLearnFlowStore";
import { colors } from "../../theme/colors";
import { useAppTheme } from "../../theme/useAppTheme";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RateApp">;

export default function RateAppScreen({ navigation }: Props) {
  const setAppRating = useLearnFlowStore((s) => s.setAppRating);
  const saved = useLearnFlowStore((s) => s.settings.appRating);
  const { colors } = useAppTheme();
  const [stars, setStars] = useState(saved?.stars ?? 0);
  const [comment, setComment] = useState(saved?.comment ?? "");

  const submit = () => {
    if (stars < 1) {
      Alert.alert("Note manquante", "Choisis au moins 1 étoile.");
      return;
    }
    setAppRating({ stars, comment: comment.trim(), at: new Date().toISOString() });
    Alert.alert("Merci !", "Ton avis a été enregistré localement.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.surface }]}>
      <SettingsHeader title="Évaluer l'app" onBack={() => navigation.goBack()} />
      <View style={[styles.body, { flex: 1, justifyContent: "center" }]}>
        <Spira
          mood={spiraForRatingStars(stars)}
          size={88}
          message={
            stars >= 4 ? "Merci !" : stars >= 1 ? "On écoute." : ""
          }
        />
        <Text style={[styles.intro, { color: colors.textDark }]}>Comment trouves-tu LearnFlow ?</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} onPress={() => setStars(n)} hitSlop={8}>
              <Icon name="star" size={36} color={n <= stars ? colors.accent : "#E7E5E4"} />
            </Pressable>
          ))}
        </View>
        <TextInput
          style={[styles.input, { backgroundColor: colors.white, borderColor: colors.border, color: colors.textDark }]}
          placeholder="Un commentaire (optionnel)…"
          placeholderTextColor={colors.textMuted}
          multiline
          value={comment}
          onChangeText={setComment}
        />
        <Pressable style={styles.submit} onPress={submit}>
          <Text style={[styles.submitText, { color: colors.onPrimary }]}>Envoyer mon avis</Text>
        </Pressable>
        {saved ? (
          <Text style={styles.saved}>
            Dernier avis : {saved.stars}/5 · {new Date(saved.at).toLocaleDateString()}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  body: { padding: 20, gap: 16, alignItems: "center" },
  intro: { fontSize: 15, fontWeight: "700", color: colors.textDark, textAlign: "center" },
  stars: { flexDirection: "row", justifyContent: "center", gap: 10 },
  input: {
    minHeight: 100,
    width: "100%",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    textAlignVertical: "top",
    color: colors.textDark,
    fontSize: 14,
  },
  submit: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: { color: colors.white, fontWeight: "800", fontSize: 15 },
  saved: { textAlign: "center", fontSize: 11, color: colors.textMuted },
});
