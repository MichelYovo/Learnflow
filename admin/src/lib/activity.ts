export const AI_DAILY_QUOTA = 5;

export const ACTIVITY_LABELS: Record<string, string> = {
  login: "Connexion",
  signup: "Inscription",
  profile_complete: "Profil complété",
  chapter_open: "Chapitre ouvert",
  quiz_complete: "Quiz 10/10",
  blitz_complete: "Blitz",
  xp_gain: "XP gagné",
  mode_start: "Mode lancé",
  heartbeat: "En ligne",
};

export function todayIsoDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function remainingAiQuota(restant: number, day?: string | null, limit = AI_DAILY_QUOTA): number {
  return day === todayIsoDate() ? Math.max(0, restant) : limit;
}

export function quotaFromProgress(progress: unknown): number | undefined {
  if (!progress || typeof progress !== "object") return undefined;
  const p = progress as { aiQuotaRestant?: number; aiQuotaDay?: string };
  if (typeof p.aiQuotaRestant !== "number") return undefined;
  return remainingAiQuota(p.aiQuotaRestant, p.aiQuotaDay);
}

export function activityLabel(type: string, payload?: Record<string, unknown>): string {
  const base = ACTIVITY_LABELS[type] ?? type;
  if (type === "xp_gain" && typeof payload?.amount === "number") {
    return `${base} +${payload.amount}`;
  }
  return base;
}

export function formatLastSeen(iso?: string): string {
  if (!iso) return "—";
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (Number.isNaN(min)) return "—";
  if (min < 2) return "À l’instant";
  if (min < 60) return `${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function eventCaption(e: { type: string; payload?: Record<string, unknown> }): string {
  return activityLabel(e.type, e.payload);
}
