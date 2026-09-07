import { NextResponse } from "next/server";
import { normalizePayload } from "@/lib/prof";
import { requireAdmin } from "@/lib/requireAdmin";
import { deleteRow, patchRow } from "@/lib/supabase";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  const body = (await request.json()) as {
    chapter_title?: string;
    class_level?: string;
    subject_id?: string;
    chapter_id?: string;
    payload?: unknown;
  };
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.chapter_title) patch.chapter_title = body.chapter_title;
  if (body.class_level) patch.class_level = body.class_level;
  if (body.subject_id) patch.subject_id = body.subject_id;
  if (body.chapter_id) patch.chapter_id = body.chapter_id;
  if (body.payload) patch.payload = normalizePayload(body.payload);
  const result = await patchRow("course_drafts", `id=eq.${encodeURIComponent(id)}`, patch);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true, draft: Array.isArray(result.data) ? result.data[0] : result.data });
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  const result = await deleteRow("course_drafts", `id=eq.${encodeURIComponent(id)}`);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
