const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anonKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ""
).trim();
const secretKey = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();

export const isSupabaseConfigured =
  /^https?:\/\//i.test(supabaseUrl) &&
  !supabaseUrl.includes("YOUR_PROJECT_REF") &&
  (secretKey.length > 0 || anonKey.length > 0) &&
  !anonKey.startsWith("sb_secret_");

/** Admin writes need the secret key (bypasses RLS). */
export const isAdminCloudReady = isSupabaseConfigured && secretKey.length > 0 && !secretKey.startsWith("sb_publishable_");

export function cloudStatusLabel() {
  if (!isSupabaseConfigured) return "Non configuré";
  if (!isAdminCloudReady) return "Lecture limitée (clé secrète manquante)";
  return "Connecté";
}

function restHeaders(extra?: Record<string, string>) {
  const key = secretKey || anonKey;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
    ...extra,
  };
}

const FETCH_MS = 12_000;

function fetchErrorMessage(err: unknown) {
  if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
    return "Supabase trop lent. Réessaie dans un instant.";
  }
  return err instanceof Error ? err.message : "Réseau";
}

async function parseJsonBody<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function restGet<T>(pathAndQuery: string): Promise<{ data: T[] | null; error?: string }> {
  if (!isSupabaseConfigured) return { data: null, error: "Supabase non configuré." };
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${pathAndQuery}`, {
      headers: restHeaders(),
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_MS),
    });
    if (!res.ok) {
      const body = await res.text();
      return { data: null, error: body.slice(0, 280) || `HTTP ${res.status}` };
    }
    const data = await parseJsonBody<T[]>(res);
    return { data: Array.isArray(data) ? data : [] };
  } catch (err) {
    return { data: null, error: fetchErrorMessage(err) };
  }
}

async function restSend(method: string, pathAndQuery: string, body?: unknown, prefer?: string) {
  if (!isAdminCloudReady) return { ok: false, error: "Clé secrète Supabase manquante (SUPABASE_SECRET_KEY)." };
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${pathAndQuery}`, {
      method,
      headers: restHeaders({
        "Content-Type": "application/json",
        Prefer: prefer ?? "return=representation",
      }),
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_MS),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: text.slice(0, 400) || `HTTP ${res.status}` };
    }
    return { ok: true, data: await parseJsonBody(res) };
  } catch (err) {
    return { ok: false, error: fetchErrorMessage(err) };
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
  status?: string | null;
  progress_updated_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  progress?: Record<string, unknown> | null;
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

export type SupportMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  topic: "support" | "waitlist" | string;
  status: "new" | "read" | string;
  created_at: string;
};

export async function fetchCloudStudents() {
  return restGet<CloudStudent>("student_profiles?select=*&order=name.asc");
}

export async function fetchCloudStudent(id: string) {
  const { data, error } = await restGet<CloudStudent>(`student_profiles?id=eq.${encodeURIComponent(id)}&select=*`);
  return { student: data?.[0] ?? null, error };
}

export async function fetchCloudLeagues() {
  return restGet<CloudLeague>("league_scores?select=*");
}

export async function fetchCloudEvents(studentId?: string) {
  const filter = studentId ? `&student_id=eq.${encodeURIComponent(studentId)}` : "";
  return restGet<CloudEvent>(`activity_events?select=*&order=created_at.desc&limit=800${filter}`);
}

export async function fetchSupportMessages() {
  return restGet<SupportMessage>("support_messages?select=*&order=created_at.desc&limit=200");
}

export async function markSupportMessageRead(id: string) {
  return restSend("PATCH", `support_messages?id=eq.${encodeURIComponent(id)}`, { status: "read" });
}

export async function updateCloudStudent(id: string, patch: Record<string, unknown>) {
  return restSend("PATCH", `student_profiles?id=eq.${encodeURIComponent(id)}`, patch);
}

export async function insertRow<T extends Record<string, unknown>>(table: string, row: T) {
  return restSend("POST", table, row);
}

export async function upsertRow(table: string, row: Record<string, unknown>, onConflict: string) {
  return restSend("POST", `${table}?on_conflict=${onConflict}`, row, "resolution=merge-duplicates,return=representation");
}

export async function patchRow(table: string, query: string, patch: Record<string, unknown>) {
  return restSend("PATCH", `${table}?${query}`, patch);
}

export async function deleteRow(table: string, query: string) {
  return restSend("DELETE", `${table}?${query}`, undefined, "return=minimal");
}

export async function deleteAuthUser(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!isAdminCloudReady) return { ok: false, error: "Clé secrète Supabase manquante." };
  const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${id}`, {
    method: "DELETE",
    headers: restHeaders(),
    cache: "no-store",
  });
  if (!res.ok && res.status !== 404) {
    return { ok: false, error: (await res.text()).slice(0, 300) };
  }
  return { ok: true };
}

export function adminHasOpenAi() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function adminHasGemini() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export type LoginNotice = {
  id: string;
  student_id: string;
  channel: string;
  event: string;
  status: string;
  detail?: string | null;
  created_at: string;
};

export async function fetchLoginNotices() {
  return restGet<LoginNotice>("login_notices?select=*&order=created_at.desc&limit=400");
}

export async function insertLoginNotice(row: Omit<LoginNotice, "id" | "created_at"> & { id?: string; created_at?: string }) {
  return insertRow("login_notices", {
    id: row.id,
    student_id: row.student_id,
    channel: row.channel,
    event: row.event,
    status: row.status,
    detail: row.detail ?? null,
  });
}

export { supabaseUrl };
