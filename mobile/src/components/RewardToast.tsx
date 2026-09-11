import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLearnFlowStore } from "../store/useLearnFlowStore";
import { useAppTheme } from "../theme/useAppTheme";

export default function RewardToast() {
  const toast = useLearnFlowStore((s) => s.rewards?.lastUnlock);
  const clear = useLearnFlowStore((s) => s.clearRewardToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => clear(), 4500);
    return () => clearTimeout(t);
  }, [toast, clear]);

  if (!toast) return null;

  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <Pressable onPress={clear} style={styles.card} accessibilityRole="button">
        <Text style={styles.kicker}>{toast.badge ? "Nouveau badge" : toast.xp ? "Défi réussi" : "Bravo"}</Text>
        <Text style={styles.title}>{toast.title}</Text>
        <Text style={styles.body}>{toast.body}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 54,
    left: 16,
    right: 16,
    zIndex: 80,
  },
  card: {
    borderRadius: 20,
    backgroundColor: "#1677FF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  kicker: { color: "#BFDBFE", fontSize: 10, fontWeight: "800", letterSpacing: 0.8, textTransform: "uppercase" },
  title: { color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 2 },
  body: { color: "#DBEAFE", fontSize: 13, fontWeight: "600", marginTop: 4, lineHeight: 18 },
});
