import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

/** Limite iOS/Android SecureStore : on découpe les JWT trop longs. */
const CHUNK = 1800;
const CHUNKED = "CHUNKED:";

function nativeStore() {
  return Platform.OS !== "web";
}

async function setNative(key: string, value: string) {
  if (value.length <= CHUNK) {
    await SecureStore.setItemAsync(key, value);
    return;
  }
  const parts = Math.ceil(value.length / CHUNK);
  await SecureStore.setItemAsync(key, `${CHUNKED}${parts}`);
  await Promise.all(
    Array.from({ length: parts }, (_, i) =>
      SecureStore.setItemAsync(`${key}.${i}`, value.slice(i * CHUNK, (i + 1) * CHUNK)),
    ),
  );
}

async function getNative(key: string) {
  const head = await SecureStore.getItemAsync(key);
  if (head) {
    if (!head.startsWith(CHUNKED)) return head;
    const parts = Number(head.slice(CHUNKED.length));
    if (!Number.isFinite(parts) || parts < 1) return null;
    const chunks = await Promise.all(
      Array.from({ length: parts }, (_, i) => SecureStore.getItemAsync(`${key}.${i}`)),
    );
    if (chunks.some((chunk) => !chunk)) return null;
    return chunks.join("");
  }
  const legacy = await AsyncStorage.getItem(key);
  if (!legacy) return null;
  await setNative(key, legacy);
  await AsyncStorage.removeItem(key);
  return legacy;
}

async function removeNative(key: string) {
  const head = await SecureStore.getItemAsync(key);
  if (head?.startsWith(CHUNKED)) {
    const parts = Number(head.slice(CHUNKED.length));
    await Promise.all(
      Array.from({ length: Number.isFinite(parts) ? parts : 0 }, (_, i) =>
        SecureStore.deleteItemAsync(`${key}.${i}`).catch(() => undefined),
      ),
    );
  }
  await SecureStore.deleteItemAsync(key).catch(() => undefined);
}

/** Coffre du téléphone (Keychain / Keystore). Sur web : AsyncStorage. */
export function getSecureStorage() {
  return {
    getItem: (key: string) => (nativeStore() ? getNative(key) : AsyncStorage.getItem(key)),
    setItem: (key: string, value: string) =>
      nativeStore() ? setNative(key, value) : AsyncStorage.setItem(key, value),
    removeItem: (key: string) => (nativeStore() ? removeNative(key) : AsyncStorage.removeItem(key)),
  };
}
