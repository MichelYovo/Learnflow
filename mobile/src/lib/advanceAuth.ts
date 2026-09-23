import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { settleVerifiedUser, type CloudUserInput } from "./authFinish";
import { loadPendingAuth } from "./pendingAuth";
import type { AuthStackParamList } from "../navigation/types";

export function loginGateMessage(code: string | null | undefined) {
  switch (code) {
    case "config":
      return "Supabase n’est pas configuré.";
    case "suspended":
      return "Compte suspendu. Contacte l’admin LearnFlow.";
    case "profile":
      return "Impossible de lire ton compte. Vérifie ta connexion et réessaie.";
    case "save":
      return "Impossible d’enregistrer ton profil. Réessaie.";
    default:
      return "Session expirée. Reconnecte-toi.";
  }
}

type ApplyCloudUser = (
  user: CloudUserInput,
  opts?: { fresh?: boolean; authenticate?: boolean },
) => void;

export async function advanceFromSession(
  navigation: Pick<NativeStackNavigationProp<AuthStackParamList>, "replace">,
  applyCloudUser: ApplyCloudUser,
): Promise<{ error?: string }> {
  const settled = await settleVerifiedUser();
  if (settled.next === "login") {
    return { error: loginGateMessage(settled.error) };
  }
  if (settled.next === "otp") {
    const pending = await loadPendingAuth();
    navigation.replace("OTP", {
      email: pending?.email,
      flow: pending?.flow,
    });
    return {};
  }
  if (settled.next === "complete-profile") {
    navigation.replace("CompleteProfile");
    return {};
  }
  applyCloudUser(settled.user, { fresh: settled.fresh, authenticate: false });
  navigation.replace("Success");
  return {};
}
