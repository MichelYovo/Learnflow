import { classLabel, initialsFromName, LEAGUE_TIERS } from "./brand";
import { type AdminStudent } from "../data/seed";
import { quotaFromProgress } from "./activity";
import { INACTIVITY_DAYS, withLastSeen } from "./inactivity";
import {
  fetchCloudEvents,
  fetchCloudLeagues,
  fetchCloudStudents,
  isAdminCloudReady,
  isSupabaseConfigured,
  type CloudEvent,
  type CloudStudent,
} from "./supabase";

const PALETTE = [
  { color: "#1677FF", bg: "#E6F4FF" },
  { color: "#10B981", bg: "#ECFDF5" },
  { color: "#F59E0B", bg: "#FFFBEB" },
  { color: "#8B5CF6", bg: "#F5F3FF" },
  { color: "#EF4444", bg: "#FEF2F2" },
  { color: "#06B6D4", bg: "#ECFEFF" },
  { color: "#F97316", bg: "#FFF7ED" },
  { color: "#EC4899", bg: "#FDF2F8" },
];

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
  cloudError?: string;
  students: AdminStudent[];
  leagues: AdminLeagueRow[];
  events: AdminActivityEvent[];
  stats: {
    students: number;
    xpTotal: number;
    avgXp: number;
    activeStreaks: number;
    active24h: number;
    inactive: number;
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
  const activeIds = new Set(
    events.filter((e) => new Date(e.createdAt).getTime() >= cutoff).map((e) => e.studentId),
  );
  for (const s of students) {
    const seen = s.lastSeenAt || s.progressUpdatedAt || s.updatedAt;
    if (seen && new Date(seen).getTime() >= cutoff) activeIds.add(s.id);
  }
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
    inactive: students.filter((s) => {
      if (s.status === "suspendu") return false;
      const last = s.lastSeenAt || s.createdAt;
      if (!last) return true;
      return Date.now() - new Date(last).getTime() >= INACTIVITY_DAYS * 86_400_000;
    }).length,
    sessions: events.filter((e) => ["login", "quiz_complete", "blitz_complete", "mode_start"].includes(e.type)).length,
    webEvents: events.filter((e) => e.platform === "web").length,
    mobileEvents: events.filter((e) => e.platform === "mobile").length,
    byClass,
    byTier,
    last7Days,
  };
}

function emptyDashboard(source: DashboardData["source"], cloudError?: string): DashboardData {
  const students: AdminStudent[] = [];
  const leagues: AdminLeagueRow[] = [];
  const events: AdminActivityEvent[] = [];
  return { source, cloudError, students, leagues, events, stats: buildStats(students, leagues, events) };
}

function mapStudent(row: CloudStudent, i: number, weeklyXp: number, leagueTier: string): AdminStudent {
  const palette = PALETTE[i % PALETTE.length];
  return {
    id: row.id,
    name: row.name,
    email: row.email || "",
    classe: row.class_level,
    xpTotale: row.total_xp,
    weeklyXp,
    streak: row.streak ?? 0,
    lessonsDone: row.lessons_done ?? 0,
    leagueTier,
    color: palette.color,
    bg: palette.bg,
    platform: row.platform ?? undefined,
    parentPhone: row.parent_phone ?? undefined,
    status: row.status === "suspendu" ? "suspendu" : "actif",
    createdAt: row.created_at ?? undefined,
    updatedAt: row.updated_at ?? undefined,
    progressUpdatedAt: row.progress_updated_at ?? undefined,
    aiQuotaRestant: quotaFromProgress(row.progress),
  };
}

const DASHBOARD_CACHE_MS = 10_000;
let dashboardCache: { at: number; data: Promise<DashboardData> } | null = null;

export function invalidateDashboardCache() {
  dashboardCache = null;
}

async function loadDashboardDataUncached(): Promise<DashboardData> {
  if (!isSupabaseConfigured) {
    return emptyDashboard("local", "Ajoute NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SECRET_KEY.");
  }
  if (!isAdminCloudReady) {
    return emptyDashboard(
      "local",
      "Ajoute SUPABASE_SECRET_KEY (service_role) : sans elle, RLS masque élèves, XP et mouvements.",
    );
  }
  try {
    const [studentsRes, leaguesRes, eventsRes] = await Promise.all([
      fetchCloudStudents(),
      fetchCloudLeagues(),
      fetchCloudEvents(),
    ]);
    const cloudError = studentsRes.error || leaguesRes.error || eventsRes.error;
    const cloudStudents = studentsRes.data;
    const cloudLeagues = leaguesRes.data;
    const cloudEvents = eventsRes.data;
    if (!cloudStudents) {
      return emptyDashboard("local", cloudError);
    }
    const mapped: AdminStudent[] = cloudStudents.map((row, i) => {
      const league = cloudLeagues?.find((l) => l.student_id === row.id);
      return mapStudent(row, i, league?.weekly_xp ?? 0, league?.league_tier ?? "Bronze");
    });
    const leagues = toLeagueRows(mapped, cloudLeagues ?? undefined);
    const events = mapEvents(cloudEvents ?? [], mapped);
    const students = withLastSeen(mapped, events);
    return { source: "cloud", cloudError, students, leagues, events, stats: buildStats(students, leagues, events) };
  } catch (err) {
    return emptyDashboard("local", err instanceof Error ? err.message : "Erreur cloud");
  }
}

export async function loadDashboardData(): Promise<DashboardData> {
  if (dashboardCache && Date.now() - dashboardCache.at < DASHBOARD_CACHE_MS) {
    return dashboardCache.data;
  }
  const data = loadDashboardDataUncached();
  dashboardCache = { at: Date.now(), data };
  try {
    return await data;
  } catch (err) {
    dashboardCache = null;
    return emptyDashboard("local", err instanceof Error ? err.message : "Erreur cloud");
  }
}

export async function loadStudentDetail(id: string) {
  const data = await loadDashboardData();
  const student = data.students.find((s) => s.id === id) ?? null;
  const events = data.events.filter((e) => e.studentId === id);
  const league = data.leagues.find((l) => l.studentId === id) ?? null;
  return { ...data, student, events, league };
}
