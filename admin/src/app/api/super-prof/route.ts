import { NextResponse } from "next/server";
import { chatText } from "@/lib/ai";
import { loadDashboardData } from "@/lib/catalog";
import { requireAdmin } from "@/lib/requireAdmin";

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const body = (await request.json()) as { message?: string; path?: string };
  const message = body.message?.trim() ?? "";
  if (message.length < 2) return NextResponse.json({ error: "Question vide." }, { status: 400 });
  const data = await loadDashboardData();
  const openStudent = body.path?.match(/\/dashboard\/eleves\/([^/]+)/)?.[1];
  const focused = openStudent ? data.students.find((s) => s.id === openStudent) : null;
  const ctx = `Stats LearnFlow admin :
- Source: ${data.source}${data.cloudError ? ` (${data.cloudError})` : ""}
- Page: ${body.path || "/dashboard"}
- Élèves: ${data.stats.students}, actifs 24h: ${data.stats.active24h}, XP total: ${data.stats.xpTotal}
- Classes: ${data.stats.byClass.map((c) => `${c.label}:${c.count}`).join(", ") || "—"}
- Ligues: ${data.stats.byTier.map((t) => `${t.label}:${t.count}`).join(", ")}
${focused ? `- Élève ouvert: ${focused.name} (${focused.classe}, ${focused.status ?? "actif"}, ${focused.xpTotale} XP, ligue ${focused.leagueTier})` : ""}
Noms élèves (max 12): ${data.students.slice(0, 12).map((s) => `${s.name} (${s.classe}, ${s.status ?? "actif"})`).join("; ")}`;
  const ai = await chatText(
    "Tu es Super Prof, assistant de l’administrateur LearnFlow (Togo, programme APC). Réponds en français, court et concret. Tu aides à comprendre les stats, les élèves, et le studio de cours. Tu ne prétends pas modifier la base toi-même.",
    `${ctx}\n\nQuestion admin : ${message}`,
  );
  if (ai.error) return NextResponse.json({ error: ai.error }, { status: 502 });
  return NextResponse.json({ text: ai.text });
}
