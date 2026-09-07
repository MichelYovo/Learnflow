/**
 * Cloud schema (Supabase). These interfaces match the remote tables.
 * `auth.users` is managed by Supabase Auth — we only type the fields we read.
 */

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
}

export interface StudentProfile {
  id: string;
  parent_id: string;
  name: string;
  class_level: string;
  total_xp: number;
  email?: string | null;
  parent_phone?: string | null;
  platform?: string | null;
  streak?: number | null;
  lessons_done?: number | null;
  avatar_id?: string | null;
}

export interface StudentProfileInsert {
  id?: string;
  parent_id: string;
  name: string;
  class_level: string;
  total_xp?: number;
  email?: string | null;
  parent_phone?: string | null;
  platform?: string | null;
  streak?: number | null;
  lessons_done?: number | null;
  avatar_id?: string | null;
}

export interface StudentProfileUpdate {
  parent_id?: string;
  name?: string;
  class_level?: string;
  total_xp?: number;
}

export interface LeagueScore {
  id: string;
  student_id: string;
  league_tier: string;
  weekly_xp: number;
  last_sync: Date;
}

/** Row shape returned by PostgREST (`timestamptz` → ISO string). */
export interface LeagueScoreRow {
  id: string;
  student_id: string;
  league_tier: string;
  weekly_xp: number;
  last_sync: string;
}

export interface LeagueScoreInsert {
  id?: string;
  student_id: string;
  league_tier: string;
  weekly_xp?: number;
  last_sync?: string;
}

export interface LeagueScoreUpdate {
  student_id?: string;
  league_tier?: string;
  weekly_xp?: number;
  last_sync?: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      student_profiles: {
        Row: StudentProfile;
        Insert: StudentProfileInsert;
        Update: StudentProfileUpdate;
        Relationships: [
          {
            foreignKeyName: "student_profiles_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      league_scores: {
        Row: LeagueScoreRow;
        Insert: LeagueScoreInsert;
        Update: LeagueScoreUpdate;
        Relationships: [
          {
            foreignKeyName: "league_scores_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "student_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export function leagueScoreFromRow(row: LeagueScoreRow): LeagueScore {
  return {
    id: row.id,
    student_id: row.student_id,
    league_tier: row.league_tier,
    weekly_xp: row.weekly_xp,
    last_sync: new Date(row.last_sync),
  };
}
