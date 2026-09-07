export type AuthFlow = "login" | "signup" | "google";

export type PendingAuth = {
  email: string;
  flow: AuthFlow;
  firstName?: string;
  lastName?: string;
  classe?: string;
  parentPhone?: string;
  password?: string;
};

const KEY = "learnflow-pending-auth";

export function savePendingAuth(pending: PendingAuth): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(pending));
}

export function loadPendingAuth(): PendingAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingAuth;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingAuth(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
