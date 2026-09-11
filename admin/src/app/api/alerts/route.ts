import { NextResponse } from "next/server";
import { loadDashboardData } from "@/lib/catalog";
import { inactiveStudents } from "@/lib/inactivity";
import { loadParentSettings, needsRecap, needsWelcome } from "@/lib/parentNotify";
import { requireAdmin } from "@/lib/requireAdmin";
import { fetchLoginNotices } from "@/lib/supabase";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  try {
    const data = await loadDashboardData();
    const notices = (await fetchLoginNotices()).data ?? [];
    const settings = loadParentSettings();
    const inactifs = inactiveStudents(data.students, data.events);
    const welcomeDue = data.students.filter((s) => needsWelcome(s, notices)).length;
    const recapDue = data.students.filter((s) => needsRecap(s, notices, settings.cadenceDays)).length;
    return NextResponse.json({
      inactive: inactifs.length,
      welcomeDue,
      recapDue,
      students: inactifs.slice(0, 5).map((s) => ({
        id: s.id,
        name: s.name,
        absenceLabel: s.absenceLabel,
      })),
    });
  } catch (err) {
    return NextResponse.json({
      inactive: 0,
      welcomeDue: 0,
      recapDue: 0,
      students: [],
      error: err instanceof Error ? err.message : "Alerts indisponibles.",
    });
  }
}
