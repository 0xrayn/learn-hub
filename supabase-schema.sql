-- ============================================================
-- LearnHub · Supabase Schema
-- Jalankan SEKALI di: Supabase Dashboard → SQL Editor → New Query
-- Aman dijalankan ulang (idempotent / IF NOT EXISTS / DROP IF EXISTS)
-- ============================================================


-- ============================================================
-- 1. TABEL PROFILES
-- ============================================================
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text,
  avatar_url  text,
  role        text default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now()
);

-- Kalau tabel sudah ada tapi kolom role belum ada
alter table public.profiles
  add column if not exists role text default 'user' check (role in ('user', 'admin'));


-- ============================================================
-- 2. RLS PROFILES
--    Pakai security definer function untuk menghindari
--    infinite recursion pada policy admin
-- ============================================================
alter table public.profiles enable row level security;

-- Fungsi helper: cek apakah user yang sedang login adalah admin
-- security definer = jalan sebagai superuser, tidak kena RLS → aman dari recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Hapus policy lama
drop policy if exists "Users can view own profile"   on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Admin can view all profiles"  on public.profiles;

-- Policy baru
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);


-- ============================================================
-- 3. TRIGGER: AUTO-CREATE PROFILE SAAT REGISTER
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- 4. TABEL MODULE_PROGRESS
-- ============================================================
create table if not exists public.module_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  module_id   int not null,
  lesson_idx  int not null,
  completed   boolean default false,
  updated_at  timestamptz default now(),
  unique(user_id, module_id, lesson_idx)
);

alter table public.module_progress enable row level security;

drop policy if exists "Users own their progress"      on public.module_progress;
drop policy if exists "Admin can view all progress"   on public.module_progress;

create policy "Users own their progress"
  on public.module_progress for all
  using (auth.uid() = user_id);

create policy "Admin can view all progress"
  on public.module_progress for select
  using (public.is_admin());


-- ============================================================
-- 5. TABEL ARTIKEL_BOOKMARKS
-- ============================================================
create table if not exists public.artikel_bookmarks (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  artikel_id  int not null,
  created_at  timestamptz default now(),
  unique(user_id, artikel_id)
);

alter table public.artikel_bookmarks enable row level security;

drop policy if exists "Users own their bookmarks"     on public.artikel_bookmarks;
drop policy if exists "Admin can view all bookmarks"  on public.artikel_bookmarks;

create policy "Users own their bookmarks"
  on public.artikel_bookmarks for all
  using (auth.uid() = user_id);

create policy "Admin can view all bookmarks"
  on public.artikel_bookmarks for select
  using (public.is_admin());


-- ============================================================
-- 6. SET ROLE ADMIN
--
--    Jalankan query di bawah ini SETELAH kamu register akun admin:
--
--    Cara cari UUID:
--    Supabase Dashboard → Authentication → Users → copy UUID-nya
--
--    Lalu jalankan:
--
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE id = 'GANTI-DENGAN-UUID-KAMU';
--
--    Verifikasi berhasil:
--
--    SELECT id, name, role FROM public.profiles WHERE role = 'admin';
--
-- ============================================================