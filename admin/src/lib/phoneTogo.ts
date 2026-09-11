export const TOGO_PREFIX = "+228";

export function normalizeTogoLocal(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00228")) digits = digits.slice(5);
  else if (digits.startsWith("228") && digits.length > 8) digits = digits.slice(3);
  return digits.slice(0, 8);
}

export function maskTogoPhone(e164: string): string {
  const local = normalizeTogoLocal(e164);
  if (local.length !== 8) return `${TOGO_PREFIX} ••••••••`;
  return `${TOGO_PREFIX} ${local.slice(0, 2)} ** ** ${local.slice(6)}`;
}

/** Tout numéro Togo : 8 chiffres après +228. */
export function isValidTogoLocal(local: string): boolean {
  return /^\d{8}$/.test(normalizeTogoLocal(local));
}

export function isLikelyTogoMobile(value?: string): boolean {
  return isValidTogoLocal(value ?? "");
}

export function parentPhoneStatus(value?: string): "ok" | "invalid" | "missing" {
  if (!value?.trim()) return "missing";
  return isValidTogoLocal(value) ? "ok" : "invalid";
}

export function togoWhatsAppDigits(e164: string): string {
  const local = normalizeTogoLocal(e164);
  return local.length === 8 ? `228${local}` : e164.replace(/\D/g, "");
}

export function waMeLink(e164: string, text: string): string {
  return `https://wa.me/${togoWhatsAppDigits(e164)}?text=${encodeURIComponent(text)}`;
}
