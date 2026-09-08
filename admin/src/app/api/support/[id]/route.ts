import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { markSupportMessageRead } from "@/lib/supabase";
import { markLocalRead } from "@/lib/supportInbox";

export async function PATCH(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "Identifiant manquant." }, { status: 400 });
  const cloud = await markSupportMessageRead(id);
  if (cloud.ok) return NextResponse.json({ ok: true });
  const local = await markLocalRead(id);
  if (!local) return NextResponse.json({ error: cloud.error ?? "Message introuvable." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
