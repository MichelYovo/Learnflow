import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "lf-parent-confirmed:";

export function parentConfirmedKey(userId: string) {
  return `${PREFIX}${userId}`;
}

export async function markParentConfirmed(userId: string) {
  try {
    await AsyncStorage.setItem(parentConfirmedKey(userId), "1");
  } catch {
    /* ignore */
  }
}

export async function hasParentConfirmed(userId: string): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(parentConfirmedKey(userId))) === "1";
  } catch {
    return false;
  }
}
