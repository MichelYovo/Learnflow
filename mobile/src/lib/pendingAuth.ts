import AsyncStorage from "@react-native-async-storage/async-storage";

export type AuthFlow = "login" | "signup" | "google";

export type PendingAuth = {
  email: string;
  flow: AuthFlow;
  firstName?: string;
  lastName?: string;
  classe?: string;
  parentPhone?: string;
  password?: string;
  emailOtpVerified?: boolean;
};

const KEY = "learnflow-pending-auth";

export async function savePendingAuth(pending: PendingAuth): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(pending));
}

export async function loadPendingAuth(): Promise<PendingAuth | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingAuth;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function clearPendingAuth(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
