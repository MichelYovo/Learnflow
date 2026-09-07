import { classLabel, initialsFromName, LEAGUE_TIERS } from "./brand";
import { SEED_STUDENTS, type AdminStudent } from "../data/seed";
import {
  fetchCloudEvents,
  fetchCloudLeagues,
  fetchCloudStudents,
  isSupabaseConfigured,
  type CloudEvent,
} from "./supabase";

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

export type AdminActivityEvent = {
  id: string;
  studentId: string;
  studentName: string;
  type: string;
  platform: string;
  createdAt: string;
  payload: Record<string, unknown>;
};

export type DashboardData = {
  source: "cloud" | "local";
  students: AdminStudent[];
  leagues: AdminLeagueRow[];
  events: AdminActivityEvent[];
  stats: {
    students: number;
    xpTotal: number;
    avgXp: number;
    activeStreaks: number;
    active24h: number;
    sessions: number;
    webEvents: number;
    mobileEvents: number;
    byClass: { id: string; label: string; count: number }[];
    byTier: { id: string; label: string; count: number; color: string }[];
    last7Days: { day: string; web: number; mobile: number; total: number }[];
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

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function last7DayKeys(): string[] {
  const out: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function seedEvents(students: AdminStudent[]): AdminActivityEvent[] {
  const types = ["login", "chapter_open", "quiz_complete", "xp_gain", "mode_start", "blitz_complete"];
  const now = Date.now();
  return students.slice(0, 8).flatMap((s, i) =>
    types.map((type, ti) => ({
      id: `seed-${s.id}-${type}`,
      studentId: s.id,
      studentName: s.name,
      type,
      platform: i % 2 === 0 ? "web" : "mobile",
      createdAt: new Date(now - (i * 3 + ti) * 3600_000).toISOString(),
      payload: {},
    }))
  );
}

function mapEvents(raw: CloudEvent[], students: AdminStudent[]): AdminActivityEvent[] {
  const names = new Map(students.map((s) => [s.id, s.name]));
  return raw.map((row) => ({
    id: row.id,
    studentId: row.student_id,
    studentName: names.get(row.student_id) ?? "Élève",
    type: row.type,
    platform: row.platform,
    createdAt: row.created_at,
    payload: (row.payload ?? {}) as Record<string, unknown>,
  }));
}

function buildStats(students: AdminStudent[], leagues: AdminLeagueRow[], events: AdminActivityEvent[]): DashboardData["stats"] {
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
  const cutoff = Date.now() - 24 * 3600_000;
  const activeIds = new Set(events.filter((e) => new Date(e.createdAt).getTime() >= cutoff).map((e) => e.studentId));
  const days = last7DayKeys();
  const last7Days = days.map((day) => {
    const ofDay = events.filter((e) => dayKey(e.createdAt) === day);
    const web = ofDay.filter((e) => e.platform === "web").length;
    const mobile = ofDay.filter((e) => e.platform === "mobile").length;
    return { day, web, mobile, total: ofDay.length };
  });
  return {
    students: students.length,
    xpTotal,
    avgXp: students.length ? Math.round(xpTotal / students.length) : 0,
    activeStreaks: students.filter((s) => s.streak >= 3).length,
    active24h: activeIds.size,
    sessions: events.filter((e) => ["login", "quiz_complete", "blitz_complete", "mode_start"].includes(e.type)).length,
    webEvents: events.filter((e) => e.platform === "web").length,
    mobileEvents: events.filter((e) => e.platform === "mobile").length,
    byClass,
    byTier,
    last7Days,
  };
}

export async function loadDashboardData(): Promise<DashboardData> {
  if (isSupabaseConfigured) {
    const [cloudStudents, cloudLeagues, cloudEvents] = await Promise.all([
      fetchCloudStudents(),
      fetchCloudLeagues(),
      fetchCloudEvents(),
    ]);
    if (cloudStudents && cloudStudents.length > 0) {
      const students: AdminStudent[] = cloudStudents.map((row, i) => {
        const seed = SEED_STUDENTS[i % SEED_STUDENTS.length];
        return {
          id: row.id,
          name: row.name,
          email: row.email || `${row.id.slice(0, 8)}@learnflow.tg`,
          classe: row.class_level,
          xpTotale: row.total_xp,
          weeklyXp: cloudLeagues?.find((l) => l.student_id === row.id)?.weekly_xp ?? Math.round(row.total_xp * 0.2),
          streak: row.streak ?? seed.streak,
          lessonsDone: row.lessons_done ?? seed.lessonsDone,
          leagueTier: cloudLeagues?.find((l) => l.student_id === row.id)?.league_tier ?? seed.leagueTier,
          color: seed.color,
          bg: seed.bg,
          platform: row.platform ?? undefined,
          parentPhone: row.parent_phone ?? undefined,
        };
      });
      const leagues = toLeagueRows(students, cloudLeagues ?? undefined);
      const events = mapEvents(cloudEvents ?? [], students);
      return { source: "cloud", students, leagues, events, stats: buildStats(students, leagues, events) };
    }
  }

  const students = SEED_STUDENTS;
  const leagues = toLeagueRows(students);
  const events = seedEvents(students);
  return { source: "local", students, leagues, events, stats: buildStats(students, leagues, events) };
}
