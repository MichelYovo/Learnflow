/** Local SQLite models — single source of truth for the UI (offline-first). */

export interface LocalProfile {
  id: string;
  parent_id: string;
  name: string;
  class_level: string;
  total_xp: number;
  local_pin_code: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  streak: number;
  rank: number;
  lessons_done: number;
  color: string | null;
  bg: string | null;
  avatar_id: string | null;
  created_at: string;
  updated_at: string;
  dirty: number;
}

export interface LocalProfileInput {
  id?: string;
  parent_id: string;
  name: string;
  class_level: string;
  total_xp?: number;
  pin?: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  streak?: number;
  rank?: number;
  lessons_done?: number;
  color?: string | null;
  bg?: string | null;
  avatar_id?: string | null;
}

export interface StudySession {
  id: string;
  student_id: string;
  chapter_id: string | null;
  chapter_title: string | null;
  xp_gained: number;
  completed_at: string;
  synced: number;
}

export interface StudySessionInput {
  student_id: string;
  chapter_id?: string | null;
  chapter_title?: string | null;
  xp_gained: number;
  completed_at?: string;
}

export interface LeagueCacheRow {
  id: string;
  student_id: string;
  student_name: string;
  league_tier: string;
  weekly_xp: number;
  rank: number;
  last_sync: string;
  is_you: number;
  initials: string | null;
  avatar_color: string | null;
  streak: number;
  avatar_id?: string | null;
}

export type SyncMetaKey = "last_sync_at" | "last_sync_error" | "schema_version";
