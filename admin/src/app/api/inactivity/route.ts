import { NextResponse } from "next/server";
import { loadDashboardData } from "@/lib/catalog";
import { inactiveStudents } from "@/lib/inactivity";
import { lastSendFor } from "@/lib/relance";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const data = await loadDashboardData();
  const inactifs = inactiveStudents(data.students, data.events).map((s) => {
    const last = lastSendFor(s.id);
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      classe: s.classe,
      xpTotale: s.xpTotale,
      lastSeenAt: s.lastSeenAt,
      inactiveDays: s.inactiveDays,
      absenceLabel: s.absenceLabel,
      lastRelanceAt: last?.sentAt,
    };
  });
  return NextResponse.json({
    count: inactifs.length,
    thresholdDays: Number(process.env.INACTIVITY_DAYS) || 7,
    students: inactifs,
  });
}
