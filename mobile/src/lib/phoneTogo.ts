export const TOGO_DIAL = "228";
export const TOGO_PREFIX = `+${TOGO_DIAL}`;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function normalizeTogoLocal(value: string): string {
  let digits = digitsOnly(value);
  if (digits.startsWith("00228")) digits = digits.slice(5);
  else if (digits.startsWith("228") && digits.length > 8) digits = digits.slice(3);
  return digits.slice(0, 8);
}

export function isValidTogoLocal(local: string): boolean {
  return /^\d{8}$/.test(local);
}

export function toTogoE164(local: string): string {
  return `${TOGO_PREFIX}${normalizeTogoLocal(local)}`;
}

export function maskTogoPhone(e164: string): string {
  const local = normalizeTogoLocal(e164);
  if (local.length !== 8) return `${TOGO_PREFIX} ••••••••`;
  return `${TOGO_PREFIX} ${local.slice(0, 2)} ** ** ${local.slice(6)}`;
}
