-- =========================================================================
-- FREEDOM IN CHRIST - SUPABASE DATABASE SCHEMA
-- Biblical Purity & Freedom Web Application
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  full_name text,
  email text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. JOURNAL ENTRIES TABLE
create table if not exists public.journal_entries (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  mood text not null default 'peaceful',
  trigger text,
  scripture text,
  prayer text,
  what_learned text,
  next_step text,
  is_favorite boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  synced_at timestamptz default now()
);

-- 3. TRIGGERS TABLE
create table if not exists public.triggers (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  trigger_type text not null,
  description text,
  location text,
  device text,
  emotion text,
  intensity integer default 3,
  action_taken text,
  resisted boolean default true,
  date timestamptz default now() not null,
  created_at timestamptz default now() not null
);

-- 4. HABITS TABLE
create table if not exists public.habits (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  frequency text default 'daily',
  category text default 'spiritual',
  icon text default 'shield',
  active boolean default true,
  created_at timestamptz default now() not null
);

-- 5. HABIT COMPLETIONS TABLE
create table if not exists public.habit_completions (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  habit_id text not null,
  completion_date date not null,
  created_at timestamptz default now() not null,
  unique(user_id, habit_id, completion_date)
);

-- 6. PROGRESS SUMMARY TABLE
create table if not exists public.progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  pornography_free_start timestamptz default now() not null,
  masturbation_free_start timestamptz default now() not null,
  last_fall_date timestamptz,
  total_temptations_resisted integer default 0,
  total_armor_prayers_completed integer default 0,
  total_scripture_reading_days integer default 0,
  total_prayer_days integer default 0,
  updated_at timestamptz default now() not null
);

-- 7. STUMBLES & RESTORATION TABLE
create table if not exists public.stumbles (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date timestamptz default now() not null,
  trigger text,
  location text,
  feeling text,
  what_happened_before text,
  what_to_change_next_time text,
  recovery_plan text,
  confession_made boolean default true,
  received_grace boolean default true,
  created_at timestamptz default now() not null
);

-- 8. SCRIPTURE FAVORITES TABLE
create table if not exists public.scripture_favorites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  scripture_reference text not null,
  created_at timestamptz default now() not null,
  unique(user_id, scripture_reference)
);

-- 9. PRAYERS TABLE
create table if not exists public.prayers (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  category text not null,
  content text not null,
  scripture_anchor text,
  is_custom boolean default true,
  created_at timestamptz default now() not null
);

-- 10. ACCOUNTABILITY CONTACTS TABLE
create table if not exists public.accountability_contacts (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  phone text,
  email text,
  relationship text,
  notes text,
  created_at timestamptz default now() not null
);

-- 11. FASTING RECORDS TABLE
create table if not exists public.fasting (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  start_time timestamptz not null,
  end_time timestamptz,
  intention text,
  notes text,
  is_active boolean default true,
  created_at timestamptz default now() not null
);

-- 12. PRAYER ALTAR WATCHES TABLE
create table if not exists public.prayer_altars (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  time text not null,
  scripture_ref text,
  scripture_text text,
  focus text,
  alarm_enabled boolean default true,
  sound_type text default 'cathedral-bell',
  active boolean default true,
  created_at timestamptz default now() not null
);

-- 13. SETTINGS TABLE
create table if not exists public.settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  app_name text default 'Freedom in Christ',
  theme text default 'dark',
  notifications_enabled boolean default false,
  morning_reminder_time text default '07:00',
  evening_reminder_time text default '21:30',
  armor_reminder_enabled boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Each user can ONLY read and write their own rows.
-- =========================================================================

alter table public.profiles enable row level security;
alter table public.journal_entries enable row level security;
alter table public.triggers enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.progress enable row level security;
alter table public.stumbles enable row level security;
alter table public.scripture_favorites enable row level security;
alter table public.prayers enable row level security;
alter table public.accountability_contacts enable row level security;
alter table public.fasting enable row level security;
alter table public.prayer_altars enable row level security;
alter table public.settings enable row level security;

-- Prayer Altars Policies
create policy "Users can manage own prayer altars" on public.prayer_altars
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Profiles Policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

-- Journal Entries Policies
create policy "Users can manage own journal" on public.journal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Triggers Policies
create policy "Users can manage own triggers" on public.triggers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Habits Policies
create policy "Users can manage own habits" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Habit Completions Policies
create policy "Users can manage own completions" on public.habit_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Progress Policies
create policy "Users can manage own progress" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Stumbles Policies
create policy "Users can manage own stumbles" on public.stumbles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Scripture Favorites Policies
create policy "Users can manage own favorites" on public.scripture_favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Prayers Policies
create policy "Users can manage own prayers" on public.prayers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Accountability Contacts Policies
create policy "Users can manage own contacts" on public.accountability_contacts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Fasting Policies
create policy "Users can manage own fasting" on public.fasting
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Settings Policies
create policy "Users can manage own settings" on public.settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  insert into public.settings (user_id)
  values (new.id);

  insert into public.progress (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
