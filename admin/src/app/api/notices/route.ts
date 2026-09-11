import { NextResponse } from "next/server";
import { fetchEditorNotices, insertEditorNotice } from "@/lib/supabase";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { data, error } = await fetchEditorNotices();
  if (error) return NextResponse.json({ error, notices: [] }, { status: 200 });
  return NextResponse.json({ notices: data ?? [] });
}

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const body = (await request.json()) as { title?: string; body?: string };
  const title = body.title?.trim() ?? "";
  const text = body.body?.trim() ?? "";
  if (title.length < 3 || text.length < 8) {
    return NextResponse.json({ error: "Titre (3 car. min.) et message (8 car. min.) requis." }, { status: 400 });
  }
  const result = await insertEditorNotice({ title, body: text, active: true });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error || "Impossible d’enregistrer. Vérifie que la table editor_notices existe sur Supabase." },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true, notice: result.data });
}
