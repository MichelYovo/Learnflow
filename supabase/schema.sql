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

alter table public.student_profiles add column if not exists status text not null default 'actif';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'student_profiles_status_check'
  ) then
    alter table public.student_profiles
      add constraint student_profiles_status_check
      check (status in ('actif', 'suspendu'));
  end if;
end $$;

-- Compte suspendu : lecture du profil (pour afficher l’erreur), écriture bloquée.
create or replace function public.student_is_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select sp.status = 'actif' from public.student_profiles sp where sp.id = auth.uid()),
    true
  );
$$;

revoke all on function public.student_is_active() from public;
grant execute on function public.student_is_active() to authenticated;

drop policy if exists student_profiles_update_own on public.student_profiles;
create policy student_profiles_update_own
  on public.student_profiles for update
  using (id::text = auth.uid()::text and status is distinct from 'suspendu')
  with check (id::text = auth.uid()::text and status is distinct from 'suspendu');

drop policy if exists activity_events_insert_own on public.activity_events;
create policy activity_events_insert_own
  on public.activity_events for insert
  with check (student_id::text = auth.uid()::text and public.student_is_active());

drop policy if exists league_scores_upsert_own on public.league_scores;
create policy league_scores_upsert_own
  on public.league_scores for insert
  with check (student_id::text = auth.uid()::text and public.student_is_active());

drop policy if exists league_scores_update_own on public.league_scores;
create policy league_scores_update_own
  on public.league_scores for update
  using (student_id::text = auth.uid()::text and public.student_is_active())
  with check (student_id::text = auth.uid()::text and public.student_is_active());

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
    and coalesce(sp.status, 'actif') is distinct from 'suspendu'
  order by ls.weekly_xp desc, ls.last_sync asc nulls last, ls.student_id asc;
$$;

revoke all on function public.league_leaderboard_for_tier(text) from public;
grant execute on function public.league_leaderboard_for_tier(text) to authenticated;

-- Studio Prof : brouillons (service_role seulement)
create table if not exists public.course_drafts (
  id uuid primary key default gen_random_uuid(),
  class_level text not null,
  subject_id text not null,
  chapter_id text not null,
  chapter_title text not null,
  source_name text,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cours publiés (lecture élèves)
create table if not exists public.published_lessons (
  id uuid primary key default gen_random_uuid(),
  class_level text not null,
  subject_id text not null,
  chapter_id text not null,
  chapter_title text not null,
  payload jsonb not null default '{}'::jsonb,
  publish_web boolean not null default false,
  publish_mobile boolean not null default false,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists published_lessons_class_chapter_uidx
  on public.published_lessons (class_level, chapter_id);

create table if not exists public.schema_models (
  id uuid primary key default gen_random_uuid(),
  class_level text not null,
  chapter_id text not null,
  title text not null,
  subtitle text not null default '',
  image_url text not null,
  parts jsonb not null default '[]'::jsonb,
  publish_web boolean not null default false,
  publish_mobile boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.course_drafts enable row level security;
alter table public.published_lessons enable row level security;
alter table public.schema_models enable row level security;

drop policy if exists published_lessons_select_public on public.published_lessons;
create policy published_lessons_select_public
  on public.published_lessons for select
  using (publish_web or publish_mobile);

drop policy if exists schema_models_select_public on public.schema_models;
create policy schema_models_select_public
  on public.schema_models for select
  using (publish_web or publish_mobile);

grant select on public.published_lessons to anon, authenticated;
grant select on public.schema_models to anon, authenticated;

-- ─────────────────────────────────────────────────────────────
-- Auth sécurisée : codes email (hashés) + journal des alertes.
-- Aucun accès client (anon / authenticated) : service_role only.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.email_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  code_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_challenges_user_created_idx
  on public.email_challenges (user_id, created_at desc);

create table if not exists public.login_notices (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id) on delete cascade,
  channel text not null,
  event text not null default 'login',
  status text not null,
  detail text,
  created_at timestamptz not null default now(),
  constraint login_notices_channel_check check (channel in ('email', 'whatsapp')),
  constraint login_notices_status_check check (status in ('sent', 'skipped', 'error'))
);

create index if not exists login_notices_student_created_idx
  on public.login_notices (student_id, created_at desc);

alter table public.email_challenges enable row level security;
alter table public.login_notices enable row level security;

revoke all on public.email_challenges from anon, authenticated, public;
revoke all on public.login_notices from anon, authenticated, public;

-- ─────────────────────────────────────────────────────────────
-- Messages du site vitrine (formulaire Support / liste d’attente)
-- Insertion publique (anon). Lecture / MAJ : service_role seulement.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  topic text not null default 'support',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint support_messages_topic_check check (topic in ('support', 'waitlist')),
  constraint support_messages_status_check check (status in ('new', 'read'))
);

create index if not exists support_messages_created_at_idx
  on public.support_messages (created_at desc);

create index if not exists support_messages_status_idx
  on public.support_messages (status);

alter table public.support_messages enable row level security;

drop policy if exists support_messages_insert_public on public.support_messages;
create policy support_messages_insert_public
  on public.support_messages for insert
  to anon, authenticated
  with check (
    char_length(trim(name)) between 2 and 80
    and char_length(trim(email)) between 5 and 120
    and char_length(trim(message)) between 8 and 2000
    and topic in ('support', 'waitlist')
  );

grant insert on public.support_messages to anon, authenticated;
revoke select, update, delete on public.support_messages from anon, authenticated, public;

-- ─────────────────────────────────────────────────────────────
-- Messages de l’éditeur (inbox élève)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.editor_notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.editor_notices enable row level security;

drop policy if exists editor_notices_select_public on public.editor_notices;
create policy editor_notices_select_public
  on public.editor_notices for select
  using (active = true);

grant select on public.editor_notices to anon, authenticated;
revoke insert, update, delete on public.editor_notices from anon, authenticated, public;


-- ─────────────────────────────────────────────────────────────
-- Garde-fou XP : limite l'inflation client (anti-cheat soft)
-- Un upsert ne peut pas ajouter plus de 250 XP d'un coup.
-- ─────────────────────────────────────────────────────────────

create or replace function public.guard_student_total_xp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'UPDATE' and OLD.total_xp is not null then
    if NEW.total_xp > OLD.total_xp + 250 then
      NEW.total_xp := OLD.total_xp + 250;
    end if;
    if NEW.total_xp < OLD.total_xp then
      -- Empêche une baisse accidentelle ; l'admin reste libre via service role.
      if current_setting('request.jwt.claim.role', true) is distinct from 'service_role' then
        NEW.total_xp := OLD.total_xp;
      end if;
    end if;
  end if;
  if NEW.total_xp is null or NEW.total_xp < 0 then
    NEW.total_xp := coalesce(OLD.total_xp, 0);
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_guard_student_total_xp on public.student_profiles;
create trigger trg_guard_student_total_xp
  before insert or update of total_xp on public.student_profiles
  for each row execute function public.guard_student_total_xp();

-- ─────────────────────────────────────────────────────────────
-- award_xp : attribution XP côté serveur (anti-cheat)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.xp_awards (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users (id) on delete cascade,
  amount integer not null check (amount > 0 and amount <= 250),
  reason text not null default 'generic',
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (student_id, idempotency_key)
);

create index if not exists xp_awards_student_day_idx
  on public.xp_awards (student_id, created_at desc);

alter table public.xp_awards enable row level security;

drop policy if exists xp_awards_select_own on public.xp_awards;
create policy xp_awards_select_own
  on public.xp_awards for select
  using (student_id::text = auth.uid()::text);

grant select on public.xp_awards to authenticated;
revoke insert, update, delete on public.xp_awards from anon, authenticated, public;

create or replace function public.award_xp(
  p_amount integer,
  p_reason text default 'generic',
  p_idempotency_key text default null
)
returns table (ok boolean, total_xp integer, awarded integer, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  key text;
  already integer;
  day_sum integer;
  new_total integer;
  grant_amt integer;
  daily_cap constant integer := 800;
begin
  if uid is null then
    return query select false, 0, 0, 'non authentifié'::text;
    return;
  end if;

  if p_amount is null or p_amount < 1 then
    return query select false, 0, 0, 'montant invalide'::text;
    return;
  end if;

  grant_amt := least(p_amount, 250);
  key := coalesce(nullif(trim(p_idempotency_key), ''), gen_random_uuid()::text);

  select count(*) into already
  from public.xp_awards a
  where a.student_id = uid and a.idempotency_key = key;

  if already > 0 then
    select sp.total_xp into new_total from public.student_profiles sp where sp.id = uid;
    return query select true, coalesce(new_total, 0), 0, 'déjà attribué'::text;
    return;
  end if;

  select coalesce(sum(a.amount), 0) into day_sum
  from public.xp_awards a
  where a.student_id = uid
    and a.created_at >= (now() at time zone 'Africa/Lome')::date::timestamptz;

  if day_sum >= daily_cap then
    select sp.total_xp into new_total from public.student_profiles sp where sp.id = uid;
    return query select false, coalesce(new_total, 0), 0, 'plafond XP journalier'::text;
    return;
  end if;

  if day_sum + grant_amt > daily_cap then
    grant_amt := daily_cap - day_sum;
  end if;

  insert into public.xp_awards (student_id, amount, reason, idempotency_key)
  values (uid, grant_amt, coalesce(nullif(trim(p_reason), ''), 'generic'), key);

  update public.student_profiles sp
  set total_xp = sp.total_xp + grant_amt,
      updated_at = now()
  where sp.id = uid
  returning sp.total_xp into new_total;

  if new_total is null then
    insert into public.student_profiles (id, parent_id, name, class_level, total_xp)
    values (uid, uid, 'Élève', '3eme', grant_amt)
    on conflict (id) do update
      set total_xp = public.student_profiles.total_xp + grant_amt,
          updated_at = now()
    returning public.student_profiles.total_xp into new_total;
  end if;

  insert into public.league_scores (student_id, league_tier, weekly_xp, last_sync)
  values (uid, 'Bronze', grant_amt, now())
  on conflict (student_id) do update
    set weekly_xp = public.league_scores.weekly_xp + grant_amt,
        last_sync = now();

  return query select true, coalesce(new_total, grant_amt), grant_amt, 'ok'::text;
end;
$$;

revoke all on function public.award_xp(integer, text, text) from public;
grant execute on function public.award_xp(integer, text, text) to authenticated;
