import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/auth/continue";
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=google`);
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=config`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=google`);
  }

  return NextResponse.redirect(`${origin}${next.startsWith("/") ? next : "/auth/continue"}`);
}
