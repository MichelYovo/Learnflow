import type { AdminStudent } from "@/data/seed";

type EventLike = { studentId: string; createdAt: string };

export const INACTIVITY_DAYS = Number(process.env.INACTIVITY_DAYS) || 7;

export function daysSince(iso?: string | null) {
  if (!iso) return Number.POSITIVE_INFINITY;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.floor((Date.now() - t) / 86_400_000));
}

export function weeksLabel(days: number) {
  if (!Number.isFinite(days) || days >= 10_000) return "un moment";
  if (days < 1) return "moins d’un jour";
  if (days < 7) return `${days} jour${days > 1 ? "s" : ""}`;
  const weeks = Math.floor(days / 7);
  if (weeks < 9) return `${weeks} semaine${weeks > 1 ? "s" : ""}`;
  const months = Math.max(1, Math.floor(days / 30));
  return `${months} mois`;
}

export function lastSeenOf(student: AdminStudent, events: EventLike[]) {
  const lastEvent = events.find((e) => e.studentId === student.id)?.createdAt;
  const stamps = [lastEvent, student.progressUpdatedAt, student.updatedAt, student.createdAt].filter(
    (iso): iso is string => Boolean(iso),
  );
  if (!stamps.length) return undefined;
  return stamps.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
}

export type InactiveStudent = AdminStudent & {
  lastSeenAt?: string;
  inactiveDays: number;
  absenceLabel: string;
};

export function withLastSeen(students: AdminStudent[], events: EventLike[]): AdminStudent[] {
  return students.map((s) => ({
    ...s,
    lastSeenAt: lastSeenOf(s, events),
  }));
}

export function isInactive(student: AdminStudent) {
  if (student.status === "suspendu") return false;
  const days = daysSince(student.lastSeenAt || student.createdAt);
  return days >= INACTIVITY_DAYS;
}

export function inactiveStudents(students: AdminStudent[], events: EventLike[]): InactiveStudent[] {
  return withLastSeen(students, events)
    .filter(isInactive)
    .map((s) => {
      const inactiveDays = daysSince(s.lastSeenAt || s.createdAt);
      return {
        ...s,
        inactiveDays,
        absenceLabel: weeksLabel(inactiveDays),
      };
    })
    .sort((a, b) => b.inactiveDays - a.inactiveDays);
}
