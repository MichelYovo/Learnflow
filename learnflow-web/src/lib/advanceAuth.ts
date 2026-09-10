import { settleVerifiedUser, type CloudUserInput } from "./authFinish";
import { loadPendingAuth } from "./pendingAuth";

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
    const error = settled.error === "config" ? "config" : settled.error === "suspended" ? "suspended" : undefined;
    go(error ? `/login?error=${error}` : "/login");
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
