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

-- Un élève = une ligne de ligue. Déduplique d’éventuels doublons puis unique.
delete from public.league_scores a
using public.league_scores b
where a.student_id = b.student_id
  and a.ctid < b.ctid;

create unique index if not exists league_scores_student_id_uidx
  on public.league_scores (student_id);

-- Classement public (noms + avatars choisis, pas d’email / téléphone / progress).
create or replace function public.league_leaderboard_for_tier(p_tier text)
returns table (
  id uuid,
  student_id uuid,
  league_tier text,
  weekly_xp integer,
  last_sync timestamptz,
  display_name text,
  avatar_id text,
  streak integer
)
language sql
stable
security definer
set search_path = public
as $$
  select
    ls.id,
    ls.student_id,
    ls.league_tier,
    ls.weekly_xp,
    ls.last_sync,
    coalesce(nullif(trim(sp.name), ''), 'Élève') as display_name,
    sp.avatar_id,
    coalesce(sp.streak, 0) as streak
  from public.league_scores ls
  left join public.student_profiles sp on sp.id = ls.student_id
  where ls.league_tier = p_tier
  order by ls.weekly_xp desc, ls.last_sync asc nulls last, ls.student_id asc;
$$;

revoke all on function public.league_leaderboard_for_tier(text) from public;
grant execute on function public.league_leaderboard_for_tier(text) to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.league_scores;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
