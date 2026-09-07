import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { settleVerifiedUser, type CloudUserInput } from "./authFinish";
import type { AuthStackParamList } from "../navigation/types";

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
    return { error: settled.error === "config" ? "Supabase n’est pas configuré." : "Session expirée. Reconnecte-toi." };
  }
  if (settled.next === "complete-profile") {
    navigation.replace("CompleteProfile");
    return {};
  }
  applyCloudUser(settled.user, { fresh: settled.fresh, authenticate: false });
  navigation.replace("Success");
  return {};
}
