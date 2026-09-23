import { settleVerifiedUser, type CloudUserInput } from "./authFinish";
import { loadPendingAuth } from "./pendingAuth";

export function loginGateMessage(code: string | null | undefined) {
  switch (code) {
    case "config":
      return "Supabase n’est pas configuré. Ajoute les clés puis réessaie.";
    case "suspended":
      return "Compte suspendu. Contacte l’admin LearnFlow.";
    case "session":
      return "Session expirée. Reconnecte-toi.";
    case "profile":
      return "Impossible de lire ton compte. Vérifie ta connexion et réessaie.";
    case "save":
      return "Impossible d’enregistrer ton profil. Réessaie.";
    default:
      return "";
  }
}

type ApplyCloudUser = (
  user: CloudUserInput,
  opts?: { fresh?: boolean; authenticate?: boolean },
) => void;

export async function advanceFromSession(
  applyCloudUser: ApplyCloudUser,
  go: (path: string) => void,
): Promise<void> {
  const settled = await settleVerifiedUser();
  if (settled.next === "login") {
    const known = settled.error === "config" || settled.error === "suspended" || settled.error === "session" || settled.error === "profile" || settled.error === "save";
    const code = known ? settled.error : "session";
    go(`/login?error=${code}`);
    return;
  }
  if (settled.next === "otp") {
    const pending = loadPendingAuth();
    const q = new URLSearchParams();
    if (pending?.email) q.set("email", pending.email);
    if (pending?.flow) q.set("flow", pending.flow);
    const qs = q.toString();
    go(qs ? `/otp?${qs}` : "/otp");
    return;
  }
  if (settled.next === "complete-profile") {
    go("/complete-profile");
    return;
  }
  applyCloudUser(settled.user, { fresh: settled.fresh, authenticate: false });
  go("/success");
}
