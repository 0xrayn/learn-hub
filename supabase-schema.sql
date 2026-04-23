-- ============================================================
-- LearnHub Supabase Schema
-- Jalankan di: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabel profiles (extend auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- RLS Profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. Tabel module_progress (tracking progress belajar per user)
create table if not exists public.module_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  module_id   int not null,
  lesson_idx  int not null,             -- index pelajaran (0-based)
  completed   boolean default false,
  updated_at  timestamptz default now(),
  unique(user_id, module_id, lesson_idx)
);

-- RLS module_progress
alter table public.module_progress enable row level security;
create policy "Users own their progress" on public.module_progress
  for all using (auth.uid() = user_id);


-- 3. Tabel artikel_bookmarks
create table if not exists public.artikel_bookmarks (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  artikel_id  int not null,
  created_at  timestamptz default now(),
  unique(user_id, artikel_id)
);

-- RLS bookmarks
alter table public.artikel_bookmarks enable row level security;
create policy "Users own their bookmarks" on public.artikel_bookmarks
  for all using (auth.uid() = user_id);
