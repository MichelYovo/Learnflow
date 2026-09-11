import { getSecureStorage } from "./secureStorage";

export type AuthFlow = "login" | "signup" | "google";

export type PendingAuth = {
  email: string;
  flow: AuthFlow;
  firstName?: string;
  lastName?: string;
  classe?: string;
  parentPhone?: string;
  emailOtpVerified?: boolean;
};

const KEY = "learnflow-pending-auth";

function withoutPassword(pending: PendingAuth & { password?: string }): PendingAuth {
  const { password: _ignored, ...safe } = pending;
  return safe;
}

export async function savePendingAuth(pending: PendingAuth): Promise<void> {
  await getSecureStorage().setItem(KEY, JSON.stringify(withoutPassword(pending)));
}

export async function loadPendingAuth(): Promise<PendingAuth | null> {
  try {
    const raw = await getSecureStorage().getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingAuth & { password?: string };
    if (!parsed?.email) return null;
    const safe = withoutPassword(parsed);
    if (parsed.password) await getSecureStorage().setItem(KEY, JSON.stringify(safe));
    return safe;
  } catch {
    return null;
  }
}

export async function clearPendingAuth(): Promise<void> {
  await getSecureStorage().removeItem(KEY);
}
