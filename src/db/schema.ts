export const SCHEMA_VERSION = 3;

/** Colonnes ajoutées après la 1re création — migration idempotente via PRAGMA table_info. */
export const ADDITIVE_COLUMNS: Record<string, { name: string; ddl: string }[]> = {
  LocalProfiles: [
    { name: "first_name", ddl: "TEXT" },
    { name: "last_name", ddl: "TEXT" },
    { name: "email", ddl: "TEXT" },
    { name: "streak", ddl: "INTEGER NOT NULL DEFAULT 0" },
    { name: "rank", ddl: "INTEGER NOT NULL DEFAULT 0" },
    { name: "lessons_done", ddl: "INTEGER NOT NULL DEFAULT 0" },
    { name: "color", ddl: "TEXT" },
    { name: "bg", ddl: "TEXT" },
    { name: "avatar_id", ddl: "TEXT" },
    { name: "dirty", ddl: "INTEGER NOT NULL DEFAULT 1" },
  ],
  StudySessions: [
    { name: "chapter_id", ddl: "TEXT" },
    { name: "chapter_title", ddl: "TEXT" },
    { name: "synced", ddl: "INTEGER NOT NULL DEFAULT 0" },
  ],
  LeagueCache: [
    { name: "initials", ddl: "TEXT" },
    { name: "avatar_color", ddl: "TEXT" },
    { name: "streak", ddl: "INTEGER NOT NULL DEFAULT 0" },
  ],
};

export const SQL_INIT = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS LocalProfiles (
  id TEXT PRIMARY KEY NOT NULL,
  parent_id TEXT NOT NULL,
  name TEXT NOT NULL,
  class_level TEXT NOT NULL,
  total_xp INTEGER NOT NULL DEFAULT 0,
  local_pin_code TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  streak INTEGER NOT NULL DEFAULT 0,
  rank INTEGER NOT NULL DEFAULT 0,
  lessons_done INTEGER NOT NULL DEFAULT 0,
  color TEXT,
  bg TEXT,
  avatar_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  dirty INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS StudySessions (
  id TEXT PRIMARY KEY NOT NULL,
  student_id TEXT NOT NULL,
  chapter_id TEXT,
  chapter_title TEXT,
  xp_gained INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT NOT NULL,
  synced INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (student_id) REFERENCES LocalProfiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS LeagueCache (
  id TEXT PRIMARY KEY NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  league_tier TEXT NOT NULL,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  rank INTEGER NOT NULL DEFAULT 0,
  last_sync TEXT NOT NULL,
  is_you INTEGER NOT NULL DEFAULT 0,
  initials TEXT,
  avatar_color TEXT,
  streak INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS SyncMeta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_local_profiles_parent ON LocalProfiles(parent_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_pending ON StudySessions(synced, student_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_student ON StudySessions(student_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_league_cache_tier_xp ON LeagueCache(league_tier, weekly_xp DESC);
`;
