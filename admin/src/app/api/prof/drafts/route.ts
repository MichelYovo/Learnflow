import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { isAdminCloudReady, supabaseUrl as _u } from "@/lib/supabase";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const secretKey = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

export async function GET() {
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  if (!isAdminCloudReady) return NextResponse.json({ drafts: [], error: "Clé secrète manquante." });
  const res = await fetch(`${supabaseUrl}/rest/v1/course_drafts?select=*&order=updated_at.desc`, {
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) return NextResponse.json({ drafts: [], error: await res.text() });
  return NextResponse.json({ drafts: await res.json() });
}
