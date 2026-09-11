const PREFIX = "lf-parent-confirmed:";

export function parentConfirmedKey(userId: string) {
  return `${PREFIX}${userId}`;
}

export function markParentConfirmed(userId: string) {
  try {
    window.localStorage.setItem(parentConfirmedKey(userId), "1");
  } catch {
    /* ignore */
  }
}

export function hasParentConfirmed(userId: string): boolean {
  try {
    return window.localStorage.getItem(parentConfirmedKey(userId)) === "1";
  } catch {
    return false;
  }
}
