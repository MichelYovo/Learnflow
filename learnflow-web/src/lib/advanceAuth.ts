import { settleVerifiedUser, type CloudUserInput } from "./authFinish";

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
    go(settled.error === "config" ? "/login?error=config" : "/login");
    return;
  }
  if (settled.next === "complete-profile") {
    go("/complete-profile");
    return;
  }
  applyCloudUser(settled.user, { fresh: settled.fresh, authenticate: false });
  go("/success");
}
