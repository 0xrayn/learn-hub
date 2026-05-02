-- ============================================================
-- LearnHub — Update #7: Cover Image + Quiz Results
-- Jalankan di Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Tambah kolom cover_image ke tabel modules
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS cover_image text;

-- 2. Seed cover images per modul (pakai Unsplash topic Bitcoin/crypto/finance)
--    Gunakan foto landscape yang relevan dan bebas pakai
UPDATE public.modules SET cover_image = CASE
  WHEN num = '01' THEN 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=1200&q=80'
  WHEN num = '02' THEN 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=1200&q=80'
  WHEN num = '03' THEN 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&q=80'
  WHEN num = '04' THEN 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80'
  WHEN num = '05' THEN 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80'
  WHEN num = '06' THEN 'https://images.unsplash.com/photo-1646833472085-2434869f7a73?w=1200&q=80'
  WHEN num = '07' THEN 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80'
  WHEN num = '08' THEN 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&q=80'
  ELSE 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80'
END
WHERE cover_image IS NULL;

-- 3. Tabel quiz_results — simpan skor quiz per user per lesson
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  lesson_id   bigint references public.module_lessons(id) on delete cascade not null,
  score       int not null,          -- 0-100
  total_q     int not null,          -- total soal
  correct_q   int not null,          -- jumlah benar
  passed      boolean default false, -- score >= 60
  attempts    int default 1,         -- berapa kali ngerjain
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  UNIQUE(user_id, lesson_id)
);

-- Index
CREATE INDEX IF NOT EXISTS quiz_results_user_id_idx ON public.quiz_results(user_id);
CREATE INDEX IF NOT EXISTS quiz_results_lesson_id_idx ON public.quiz_results(lesson_id);

-- RLS
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own their quiz results"    ON public.quiz_results;
DROP POLICY IF EXISTS "Admin can view all quiz results" ON public.quiz_results;

CREATE POLICY "Users own their quiz results"    ON public.quiz_results FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all quiz results" ON public.quiz_results FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);

-- Selesai! Cover image + quiz results siap dipakai.
