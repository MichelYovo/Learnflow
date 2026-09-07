import type { LeaguePlayer } from "@/data/mock";
import { beginnerLeagueBoard, initialsFromName } from "@/data/mock";
import { ensureBeginnerLeague } from "@/lib/cloud";
import { getBrowserSupabase, isSupabaseConfigured } from "@/lib/supabase";

export type LeagueBoardRow = {
  id: string;
  student_id: string;
  league_tier: string;
  weekly_xp: number;
  last_sync: string | null;
  display_name: string;
  avatar_id: string | null;
  streak: number;
};

function sortRows(rows: LeagueBoardRow[]): LeagueBoardRow[] {
  return [...rows].sort((a, b) => {
    const xp = (b.weekly_xp ?? 0) - (a.weekly_xp ?? 0);
    if (xp !== 0) return xp;
    return String(a.last_sync ?? "").localeCompare(String(b.last_sync ?? ""));
  });
}

export function rowsToPlayers(rows: LeagueBoardRow[], activeStudentId: string | null): LeaguePlayer[] {
  return sortRows(rows).map((row, index) => ({
    rank: index + 1,
    name: row.display_name?.trim() || "Élève",
    xp: row.weekly_xp ?? 0,
    streak: row.streak ?? 0,
    you: Boolean(activeStudentId && row.student_id === activeStudentId),
    initials: initialsFromName(row.display_name || "Élève"),
    avatarColor: "#1677FF",
    avatarId: row.avatar_id ?? undefined,
    studentId: row.student_id,
  }));
}

export async function fetchLeagueLeaderboard(
  leagueTier: string,
  activeStudentId: string | null,
  self?: { name: string; avatarId?: string; initials?: string }
): Promise<LeaguePlayer[]> {
  const supabase = getBrowserSupabase();
  if (!isSupabaseConfigured || !supabase) {
    return self ? beginnerLeagueBoard(self.name, self.avatarId, self.initials) : [];
  }
  if (activeStudentId) {
    await ensureBeginnerLeague(activeStudentId);
  }

  const rpc = await supabase.rpc("league_leaderboard_for_tier", { p_tier: leagueTier });
  if (!rpc.error && Array.isArray(rpc.data)) {
    const players = rowsToPlayers(rpc.data as LeagueBoardRow[], activeStudentId);
    if (players.length > 0) return players;
  }

  const { data: scoreRows, error } = await supabase
    .from("league_scores")
    .select("id, student_id, league_tier, weekly_xp, last_sync")
    .eq("league_tier", leagueTier)
    .order("weekly_xp", { ascending: false })
    .limit(80);
  if (error) {
    console.warn("[LearnFlow] league_scores", error.message);
    return self ? beginnerLeagueBoard(self.name, self.avatarId, self.initials) : [];
  }
  const scores = (scoreRows ?? []) as {
    id: string;
    student_id: string;
    league_tier: string;
    weekly_xp: number;
    last_sync: string | null;
  }[];
  if (scores.length === 0) {
    return self ? beginnerLeagueBoard(self.name, self.avatarId, self.initials) : [];
  }

  const ids = [...new Set(scores.map((row) => row.student_id))];
  const { data: nameRows } = await supabase.from("student_profiles").select("id, name, avatar_id, streak").in("id", ids);
  const byId = new Map(
    ((nameRows ?? []) as { id: string; name: string; avatar_id: string | null; streak: number | null }[]).map((row) => [
      row.id,
      row,
    ])
  );
  const rows: LeagueBoardRow[] = scores.map((row) => {
    const profile = byId.get(row.student_id);
    return {
      id: row.id,
      student_id: row.student_id,
      league_tier: row.league_tier,
      weekly_xp: row.weekly_xp,
      last_sync: row.last_sync,
      display_name: profile?.name ?? (row.student_id === activeStudentId ? self?.name ?? "Élève" : "Élève"),
      avatar_id: profile?.avatar_id ?? (row.student_id === activeStudentId ? self?.avatarId ?? null : null),
      streak: profile?.streak ?? 0,
    };
  });
  const players = rowsToPlayers(rows, activeStudentId);
  return players.length > 0 ? players : self ? beginnerLeagueBoard(self.name, self.avatarId, self.initials) : [];
}

export function subscribeLeagueLive(onChange: () => void): () => void {
  const supabase = getBrowserSupabase();
  if (!isSupabaseConfigured || !supabase) return () => undefined;
  const channel = supabase
    .channel("league-scores-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "league_scores" }, () => {
      onChange();
    })
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
