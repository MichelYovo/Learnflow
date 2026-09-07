import * as Crypto from "expo-crypto";

const PIN_PATTERN = /^\d{4}$/;

export function isValidPinFormat(pin: string): boolean {
  return PIN_PATTERN.test(pin);
}

/** Hash SHA-256 stocké : une chaîne vide signifie « pas de PIN ». */
export function isPinConfigured(storedHash?: string | null): boolean {
  return typeof storedHash === "string" && storedHash.length > 0;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function hashPin(pin: string, profileId: string): Promise<string> {
  if (!isValidPinFormat(pin)) {
    throw new Error("Le code PIN doit contenir exactement 4 chiffres.");
  }
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${profileId}:${pin}`
  );
}

export async function verifyPin(
  pin: string,
  profileId: string,
  storedHash: string
): Promise<boolean> {
  if (!isValidPinFormat(pin) || !storedHash) return false;
  try {
    const candidate = await hashPin(pin, profileId);
    return timingSafeEqual(candidate, storedHash);
  } catch {
    return false;
  }
}
