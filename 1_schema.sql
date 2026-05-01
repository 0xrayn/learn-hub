-- ============================================================
-- LearnHub Schema — Jalankan PERTAMA
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Drop constraint lama kalau ada (fix superadmin role)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Tabel profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text,
  bio         text,
  avatar_url  text,
  role        text default 'user',
  created_at  timestamptz default now()
);

-- Tambah kolom kalau belum ada
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role       text default 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio        text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Pasang constraint baru (sudah include superadmin)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('user', 'admin', 'superadmin'));

-- RLS Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view profiles"          ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"      ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile"      ON public.profiles;
DROP POLICY IF EXISTS "Superadmin can update all roles"   ON public.profiles;
DROP POLICY IF EXISTS "Superadmin can delete profiles"    ON public.profiles;

CREATE POLICY "Public can view profiles"        ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"    ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"    ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Superadmin can update all roles" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'superadmin')
);
CREATE POLICY "Superadmin can delete profiles"  ON public.profiles FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'superadmin')
);

-- Auto-create profile saat register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, new.raw_user_meta_data->>'name', 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. Tabel module_progress
CREATE TABLE IF NOT EXISTS public.module_progress (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  module_id  int not null,
  lesson_idx int not null,
  completed  boolean default false,
  updated_at timestamptz default now(),
  UNIQUE(user_id, module_id, lesson_idx)
);
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their progress"     ON public.module_progress;
DROP POLICY IF EXISTS "Admin can view all progress"  ON public.module_progress;
CREATE POLICY "Users own their progress"    ON public.module_progress FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all progress" ON public.module_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);


-- 4. Tabel artikel_bookmarks
CREATE TABLE IF NOT EXISTS public.artikel_bookmarks (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  artikel_id int not null,
  created_at timestamptz default now(),
  UNIQUE(user_id, artikel_id)
);
ALTER TABLE public.artikel_bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users own their bookmarks"    ON public.artikel_bookmarks;
DROP POLICY IF EXISTS "Admin can view all bookmarks" ON public.artikel_bookmarks;
CREATE POLICY "Users own their bookmarks"    ON public.artikel_bookmarks FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all bookmarks" ON public.artikel_bookmarks FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);


-- 5. Tabel articles
CREATE TABLE IF NOT EXISTS public.articles (
  id         bigint generated always as identity primary key,
  title      text not null,
  excerpt    text,
  content    text,
  category   text default 'Pemula',
  cat_color  text default '#22c55e',
  author     text default 'Admin',
  image_url  text,
  read_time  text default '5 mnt',
  published  boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read articles"  ON public.articles;
DROP POLICY IF EXISTS "Admin can manage articles" ON public.articles;
CREATE POLICY "Anyone can read articles"  ON public.articles FOR SELECT USING (published = true);
CREATE POLICY "Admin can manage articles" ON public.articles FOR ALL    USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);


-- 6. Tabel modules
CREATE TABLE IF NOT EXISTS public.modules (
  id          bigint generated always as identity primary key,
  num         text not null default '01',
  icon        text default '₿',
  title       text not null,
  description text,
  long_desc   text,
  duration    text default '30 mnt',
  level       text default 'Pemula',
  accent      text default '#f59e0b',
  level_color text default '#22c55e',
  published   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read modules"  ON public.modules;
DROP POLICY IF EXISTS "Admin can manage modules" ON public.modules;
CREATE POLICY "Anyone can read modules"  ON public.modules FOR SELECT USING (published = true);
CREATE POLICY "Admin can manage modules" ON public.modules FOR ALL    USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);


-- 7. Tabel module_lessons
CREATE TABLE IF NOT EXISTS public.module_lessons (
  id         bigint generated always as identity primary key,
  module_id  bigint references public.modules(id) on delete cascade not null,
  title      text not null,
  duration   text default '5 mnt',
  sort_order int default 0,
  created_at timestamptz default now()
);
ALTER TABLE public.module_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read lessons"  ON public.module_lessons;
DROP POLICY IF EXISTS "Admin can manage lessons" ON public.module_lessons;
CREATE POLICY "Anyone can read lessons"  ON public.module_lessons FOR SELECT USING (true);
CREATE POLICY "Admin can manage lessons" ON public.module_lessons FOR ALL    USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);


-- 8. Storage bucket untuk upload foto artikel
INSERT INTO storage.buckets (id, name, public)
VALUES ('artikel-images', 'artikel-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can view artikel images"  ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload artikel images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete artikel images" ON storage.objects;

CREATE POLICY "Anyone can view artikel images"  ON storage.objects FOR SELECT USING (bucket_id = 'artikel-images');
CREATE POLICY "Admin can upload artikel images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'artikel-images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);
CREATE POLICY "Admin can delete artikel images" ON storage.objects FOR DELETE USING (
  bucket_id = 'artikel-images' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);


-- Selesai! Lanjut jalankan file 2_seed.sql
