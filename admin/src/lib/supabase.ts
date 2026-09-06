const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
const secretKey = (process.env.SUPABASE_SECRET_KEY ?? "").trim();

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

async function restGet<T>(table: string): Promise<T[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`, {
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
};

export type CloudLeague = {
  id: string;
  student_id: string;
  league_tier: string;
  weekly_xp: number;
  last_sync?: string;
};

export async function fetchCloudStudents() {
  return restGet<CloudStudent>("student_profiles");
}

export async function fetchCloudLeagues() {
  return restGet<CloudLeague>("league_scores");
}
