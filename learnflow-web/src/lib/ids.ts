export function createId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    const rand = Math.random().toString(36).slice(2, 10);
    return `${Date.now().toString(36)}-${rand}`;
  }
}

export function nowIso(): string {
  return new Date().toISOString();
}
