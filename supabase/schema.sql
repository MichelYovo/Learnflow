-- LearnFlow — schéma cloud (idempotent)
-- À exécuter dans Supabase → SQL Editor.
-- Les id auth.users sont uuid : toutes les comparaisons RLS passent par ::text.

create table if not exists public.student_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  parent_id uuid,
  name text not null default 'Élève',
  class_level text not null default '3eme',
  total_xp integer not null default 0
);

alter table public.student_profiles add column if not exists email text;
alter table public.student_profiles add column if not exists parent_phone text;
alter table public.student_profiles add column if not exists platform text;
alter table public.student_profiles add column if not exists streak integer not null default 0;
alter table public.student_profiles add column if not exists lessons_done integer not null default 0;
alter table public.student_profiles add column if not exists avatar_id text;
alter table public.student_profiles add column if not exists progress jsonb not null default '{}'::jsonb;
alter table public.student_profiles add column if not exists progress_updated_at timestamptz;
alter table public.student_profiles add column if not exists created_at timestamptz not null default now();
alter table public.student_profiles add column if not exists updated_at timestamptz not null default now();

create table if not exists public.league_scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  league_tier text not null default 'Bronze',
  weekly_xp integer not null default 0,
  last_sync timestamptz not null default now()
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  type text not null,
  platform text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'activity_events_platform_check'
  ) then
    alter table public.activity_events
      add constraint activity_events_platform_check
      check (platform in ('web', 'mobile'));
  end if;
end $$;

create index if not exists activity_events_created_at_idx on public.activity_events (created_at desc);
create index if not exists activity_events_student_id_idx on public.activity_events (student_id);
create index if not exists activity_events_type_idx on public.activity_events (type);
create index if not exists student_profiles_platform_idx on public.student_profiles (platform);

alter table public.student_profiles enable row level security;
alter table public.league_scores enable row level security;
alter table public.activity_events enable row level security;

drop policy if exists student_profiles_select_own on public.student_profiles;
create policy student_profiles_select_own
  on public.student_profiles for select
  using (id::text = auth.uid()::text);

drop policy if exists student_profiles_insert_own on public.student_profiles;
create policy student_profiles_insert_own
  on public.student_profiles for insert
  with check (id::text = auth.uid()::text);

drop policy if exists student_profiles_update_own on public.student_profiles;
create policy student_profiles_update_own
  on public.student_profiles for update
  using (id::text = auth.uid()::text)
  with check (id::text = auth.uid()::text);

drop policy if exists league_scores_select_all on public.league_scores;
create policy league_scores_select_all
  on public.league_scores for select
  using (true);

drop policy if exists league_scores_upsert_own on public.league_scores;
create policy league_scores_upsert_own
  on public.league_scores for insert
  with check (student_id::text = auth.uid()::text);

drop policy if exists league_scores_update_own on public.league_scores;
create policy league_scores_update_own
  on public.league_scores for update
  using (student_id::text = auth.uid()::text);

drop policy if exists activity_events_select_own on public.activity_events;
create policy activity_events_select_own
  on public.activity_events for select
  using (student_id::text = auth.uid()::text);

drop policy if exists activity_events_insert_own on public.activity_events;
create policy activity_events_insert_own
  on public.activity_events for insert
  with check (student_id::text = auth.uid()::text);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.student_profiles to authenticated;
grant select, insert, update on public.league_scores to authenticated;
grant select, insert on public.activity_events to authenticated;
