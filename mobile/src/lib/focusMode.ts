import { Linking, Platform } from "react-native";

/** Consignes affichées selon le système — LearnFlow ne peut pas forcer le DND. */
export const FOCUS_HINT =
  Platform.OS === "ios"
    ? "Réglages → Concentration → Ne pas déranger"
    : "Paramètres → Ne pas déranger, ou Bien-être numérique → Mode Concentration";

/**
 * Ouvre les réglages système (Ne pas déranger / Concentration).
 * Impossible d’activer le DND à la place de l’élève : iOS l’interdit, Android exige une permission spéciale.
 */
export async function openSystemFocusSettings(): Promise<boolean> {
  try {
    if (Platform.OS === "android") {
      try {
        await Linking.sendIntent("android.settings.ZEN_MODE_SETTINGS");
        return true;
      } catch {
        await Linking.openSettings();
        return true;
      }
    }
    if (Platform.OS === "ios") {
      await Linking.openSettings();
      return true;
    }
    return false;
  } catch {
    try {
      await Linking.openSettings();
      return true;
    } catch {
      return false;
    }
  }
}
