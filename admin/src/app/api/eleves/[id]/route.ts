import { NextResponse } from "next/server";
import { CLASSES } from "@/lib/brand";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteAuthUser, deleteRow, updateCloudStudent } from "@/lib/supabase";

const CLASS_IDS = new Set<string>([...CLASSES.map((c) => c.id), "2nde", "1ere", "Tle"]);

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  let body: { classe?: string; status?: string; name?: string } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.classe) {
    if (!CLASS_IDS.has(body.classe)) {
      return NextResponse.json({ error: "Classe inconnue." }, { status: 400 });
    }
    patch.class_level = body.classe;
  }
  if (body.status) {
    if (body.status !== "actif" && body.status !== "suspendu") {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }
    patch.status = body.status;
  }
  if (body.name?.trim()) patch.name = body.name.trim();
  const result = await updateCloudStudent(id, patch);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  const auth = await deleteAuthUser(id);
  if (!auth.ok) {
    const row = await deleteRow("student_profiles", `id=eq.${encodeURIComponent(id)}`);
    if (!row.ok) return NextResponse.json({ error: auth.error || row.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
