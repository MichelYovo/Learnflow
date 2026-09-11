import { NextResponse } from "next/server";
import { chatText } from "@/lib/ai";
import { loadDashboardData } from "@/lib/catalog";
import { classLabel } from "@/lib/brand";
import { inactiveStudents } from "@/lib/inactivity";
import { requireAdmin } from "@/lib/requireAdmin";
import { continueLink } from "@/lib/relanceTypes";
import { inactiveContext, parseSuperProfReply, superProfSystem } from "@/lib/superProf";

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const body = (await request.json()) as { message?: string; path?: string };
  const message = body.message?.trim() ?? "";
  if (message.length < 2) return NextResponse.json({ error: "Question vide." }, { status: 400 });

  const data = await loadDashboardData();
  const inactifs = inactiveStudents(data.students, data.events);
  const openStudent = body.path?.match(/\/dashboard\/eleves\/([^/]+)/)?.[1];
  const focused = openStudent ? data.students.find((s) => s.id === openStudent) : null;
  const focusedInactive = focused ? inactifs.find((s) => s.id === focused.id) : null;

  const ctx = `Données admin LearnFlow (ne résume pas, agis) :
- Page : ${body.path || "/dashboard"}
- Lien de reprise à mettre dans les mails : ${continueLink()}
- Élèves : ${data.stats.students} · actifs 24h : ${data.stats.active24h} · inactifs : ${inactifs.length}
${focused ? `- Élève ouvert : ${focused.name} (${classLabel(focused.classe)}, ${focused.email || "sans email"}, ${focused.xpTotale} XP, ligue ${focused.leagueTier}, leçons ${focused.lessonsDone}, série ${focused.streak} j, dernière activité ${focused.lastSeenAt || "inconnue"})` : ""}
${focusedInactive ? `- Cet élève est inactif depuis ${focusedInactive.absenceLabel}.` : ""}

Élèves inactifs :
${inactiveContext(inactifs)}`;

  const ai = await chatText(superProfSystem(), `${ctx}\n\nDemande admin : ${message}`);
  if (ai.error) return NextResponse.json({ error: ai.error }, { status: 502 });
  const parsed = parseSuperProfReply(ai.text || "");
  return NextResponse.json(parsed);
}
