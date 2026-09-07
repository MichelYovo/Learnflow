import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured, supabaseUrl } from "./supabase";

export async function createServerSupabase() {
  if (!isSupabaseConfigured) return null;
  const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* set from a Server Component — ignore */
        }
      },
    },
  });
}
