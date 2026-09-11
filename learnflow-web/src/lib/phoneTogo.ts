export const TOGO_DIAL = "228";
export const TOGO_PREFIX = `+${TOGO_DIAL}`;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** 8 chiffres locaux (sans 228). */
export function normalizeTogoLocal(value: string): string {
  let digits = digitsOnly(value);
  if (digits.startsWith("00228")) digits = digits.slice(5);
  else if (digits.startsWith("228") && digits.length > 8) digits = digits.slice(3);
  return digits.slice(0, 8);
}

/** 8 chiffres locaux, mobile Togo : 7x (Moov) ou 9x (Togocel). */
export function isValidTogoLocal(local: string): boolean {
  return isLikelyTogoMobile(local);
}

export function isLikelyTogoMobile(value?: string): boolean {
  return /^[79]\d{7}$/.test(normalizeTogoLocal(value ?? ""));
}

export const TOGO_MOBILE_ERROR =
  "Le WhatsApp parent doit être un mobile Togo : 8 chiffres après +228, commençant par 7 (Moov) ou 9 (Togocel).";

export function toTogoE164(local: string): string {
  return `${TOGO_PREFIX}${normalizeTogoLocal(local)}`;
}

export function maskTogoPhone(e164: string): string {
  const local = normalizeTogoLocal(e164);
  if (local.length !== 8) return `${TOGO_PREFIX} ••••••••`;
  return `${TOGO_PREFIX} ${local.slice(0, 2)} ** ** ${local.slice(6)}`;
}
