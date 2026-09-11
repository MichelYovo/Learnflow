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

export function savePendingAuth(pending: PendingAuth): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(withoutPassword(pending)));
}

export function loadPendingAuth(): PendingAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingAuth & { password?: string };
    if (!parsed?.email) return null;
    const safe = withoutPassword(parsed);
    if (parsed.password) sessionStorage.setItem(KEY, JSON.stringify(safe));
    return safe;
  } catch {
    return null;
  }
}

export function clearPendingAuth(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
