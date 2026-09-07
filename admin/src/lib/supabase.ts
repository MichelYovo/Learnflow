const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
const secretKey = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

export const isSupabaseConfigured =
  /^https?:\/\//i.test(supabaseUrl) &&
  !supabaseUrl.includes("YOUR_PROJECT_REF") &&
  (secretKey.length > 0 || anonKey.length > 0) &&
  !anonKey.startsWith("sb_secret_");

function restHeaders() {
  const key = secretKey || anonKey;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  };
}

async function restGet<T>(pathAndQuery: string): Promise<T[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${pathAndQuery}`, {
      headers: restHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}

export type CloudStudent = {
  id: string;
  parent_id?: string;
  name: string;
  class_level: string;
  total_xp: number;
  email?: string | null;
  parent_phone?: string | null;
  platform?: string | null;
  streak?: number | null;
  lessons_done?: number | null;
  avatar_id?: string | null;
};

export type CloudLeague = {
  id: string;
  student_id: string;
  league_tier: string;
  weekly_xp: number;
  last_sync?: string;
};

export type CloudEvent = {
  id: string;
  student_id: string;
  type: string;
  platform: string;
  payload: Record<string, unknown> | null;
  created_at: string;
};

export async function fetchCloudStudents() {
  return restGet<CloudStudent>("student_profiles?select=*&order=name.asc");
}

export async function fetchCloudLeagues() {
  return restGet<CloudLeague>("league_scores?select=*");
}

export async function fetchCloudEvents() {
  return restGet<CloudEvent>("activity_events?select=*&order=created_at.desc&limit=500");
}
