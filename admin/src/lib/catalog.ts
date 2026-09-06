import { classLabel, initialsFromName, LEAGUE_TIERS } from "./brand";
import { SEED_STUDENTS, type AdminStudent } from "../data/seed";
import { fetchCloudLeagues, fetchCloudStudents, isSupabaseConfigured } from "./supabase";

export type { AdminStudent };

export type AdminLeagueRow = {
  studentId: string;
  name: string;
  tier: string;
  weeklyXp: number;
  rank: number;
  initials: string;
  color: string;
};

export type DashboardData = {
  source: "cloud" | "local";
  students: AdminStudent[];
  leagues: AdminLeagueRow[];
  stats: {
    students: number;
    xpTotal: number;
    avgXp: number;
    activeStreaks: number;
    byClass: { id: string; label: string; count: number }[];
    byTier: { id: string; label: string; count: number; color: string }[];
  };
};

function toLeagueRows(students: AdminStudent[], cloud?: { student_id: string; league_tier: string; weekly_xp: number }[]): AdminLeagueRow[] {
  if (cloud && cloud.length > 0) {
    const byId = new Map(students.map((s) => [s.id, s]));
    const rows = cloud
      .map((row) => {
        const student = byId.get(row.student_id);
        const name = student?.name ?? row.student_id;
        return {
          studentId: row.student_id,
          name,
          tier: row.league_tier,
          weeklyXp: row.weekly_xp,
          rank: 0,
          initials: initialsFromName(name),
          color: student?.color ?? "#1677FF",
        };
      })
      .sort((a, b) => b.weeklyXp - a.weeklyXp)
      .map((row, i) => ({ ...row, rank: i + 1 }));
    return rows;
  }

  return [...students]
    .sort((a, b) => b.weeklyXp - a.weeklyXp)
    .map((s, i) => ({
      studentId: s.id,
      name: s.name,
      tier: s.leagueTier,
      weeklyXp: s.weeklyXp,
      rank: i + 1,
      initials: initialsFromName(s.name),
      color: s.color,
    }));
}

function buildStats(students: AdminStudent[], leagues: AdminLeagueRow[]): DashboardData["stats"] {
  const xpTotal = students.reduce((sum, s) => sum + s.xpTotale, 0);
  const classMap = new Map<string, number>();
  for (const s of students) classMap.set(s.classe, (classMap.get(s.classe) ?? 0) + 1);
  const byClass = [...classMap.entries()].map(([id, count]) => ({
    id,
    label: classLabel(id),
    count,
  }));
  const tierMap = new Map<string, number>();
  for (const row of leagues) tierMap.set(row.tier, (tierMap.get(row.tier) ?? 0) + 1);
  const byTier = LEAGUE_TIERS.map((t) => ({
    id: t.id,
    label: t.label,
    color: t.color,
    count: tierMap.get(t.id) ?? 0,
  }));
  return {
    students: students.length,
    xpTotal,
    avgXp: students.length ? Math.round(xpTotal / students.length) : 0,
    activeStreaks: students.filter((s) => s.streak >= 3).length,
    byClass,
    byTier,
  };
}

export async function loadDashboardData(): Promise<DashboardData> {
  if (isSupabaseConfigured) {
    const [cloudStudents, cloudLeagues] = await Promise.all([fetchCloudStudents(), fetchCloudLeagues()]);
    if (cloudStudents && cloudStudents.length > 0) {
      const students: AdminStudent[] = cloudStudents.map((row, i) => {
        const seed = SEED_STUDENTS[i % SEED_STUDENTS.length];
        return {
          id: row.id,
          name: row.name,
          email: `${row.id.slice(0, 8)}@learnflow.tg`,
          classe: row.class_level,
          xpTotale: row.total_xp,
          weeklyXp: cloudLeagues?.find((l) => l.student_id === row.id)?.weekly_xp ?? Math.round(row.total_xp * 0.2),
          streak: seed.streak,
          lessonsDone: seed.lessonsDone,
          leagueTier: cloudLeagues?.find((l) => l.student_id === row.id)?.league_tier ?? seed.leagueTier,
          color: seed.color,
          bg: seed.bg,
        };
      });
      const leagues = toLeagueRows(students, cloudLeagues ?? undefined);
      return { source: "cloud", students, leagues, stats: buildStats(students, leagues) };
    }
  }

  const students = SEED_STUDENTS;
  const leagues = toLeagueRows(students);
  return { source: "local", students, leagues, stats: buildStats(students, leagues) };
}
