export type FreezeFields = {
  estGelee?: boolean;
  geleJusqua?: string | null;
  rangProtege?: number;
  rangActuel?: number;
};

export function leagueFreezeActive(ligue: FreezeFields | null | undefined, now = Date.now()): boolean {
  if (!ligue?.estGelee || !ligue.geleJusqua) return false;
  const until = Date.parse(ligue.geleJusqua);
  return Number.isFinite(until) && until > now;
}

export function settleLeagueFreeze<T extends FreezeFields>(ligue: T, now = Date.now()): T {
  if (leagueFreezeActive(ligue, now)) return ligue;
  if (!ligue.estGelee && !ligue.geleJusqua) return ligue;
  return { ...ligue, estGelee: false, geleJusqua: null, rangProtege: undefined };
}

/** Rang affiché : le gel empêche de reculer, une meilleure place reste prise. */
export function rankWhileFrozen(liveRank: number, ligue: FreezeFields): number {
  const live = Math.max(1, liveRank || 1);
  if (!leagueFreezeActive(ligue)) return live;
  const floor = Math.max(1, ligue.rangProtege || ligue.rangActuel || live);
  return Math.min(live, floor);
}

export function pickFreeze(local: FreezeFields, remote: FreezeFields): Required<Pick<FreezeFields, "estGelee" | "geleJusqua">> & { rangProtege?: number } {
  const active = [settleLeagueFreeze(local), settleLeagueFreeze(remote)].filter((row) => leagueFreezeActive(row));
  if (active.length === 0) return { estGelee: false, geleJusqua: null, rangProtege: undefined };
  const best = active.reduce((left, right) =>
    Date.parse(right.geleJusqua || "") > Date.parse(left.geleJusqua || "") ? right : left
  );
  return {
    estGelee: true,
    geleJusqua: best.geleJusqua ?? null,
    rangProtege: best.rangProtege || best.rangActuel,
  };
}

export function freezeUntil(jours: number, now = Date.now()): string {
  const days = Math.max(1, Math.min(14, Math.round(jours) || 7));
  return new Date(now + days * 24 * 60 * 60 * 1000).toISOString();
}

export function formatFreezeUntil(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Lome",
  });
}
