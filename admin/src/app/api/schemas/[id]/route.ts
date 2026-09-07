import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteRow, patchRow } from "@/lib/supabase";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  const body = (await request.json()) as Record<string, unknown>;
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ["title", "subtitle", "chapter_id", "class_level", "parts", "publish_web", "publish_mobile"]) {
    if (key in body) patch[key] = body[key];
  }
  const result = await patchRow("schema_models", `id=eq.${encodeURIComponent(id)}`, patch);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  const result = await deleteRow("schema_models", `id=eq.${encodeURIComponent(id)}`);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
