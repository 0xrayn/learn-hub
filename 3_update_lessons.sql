-- ============================================================
-- LearnHub Update — Tambah kolom video & konten ke module_lessons
-- Jalankan di Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- Tambah kolom video_url (YouTube/Vimeo URL atau embed)
ALTER TABLE public.module_lessons ADD COLUMN IF NOT EXISTS video_url   text;

-- Tambah kolom tipe video: 'youtube' | 'vimeo' | 'url' | null
ALTER TABLE public.module_lessons ADD COLUMN IF NOT EXISTS video_type  text default 'youtube';

-- Tambah kolom konten teks/markdown untuk lesson
ALTER TABLE public.module_lessons ADD COLUMN IF NOT EXISTS content     text;

-- Tambah kolom free (lesson bisa diakses tanpa login)
ALTER TABLE public.module_lessons ADD COLUMN IF NOT EXISTS is_free     boolean default false;

-- Update policy: semua orang bisa read lessons (sudah ada, tapi pastikan)
DROP POLICY IF EXISTS "Anyone can read lessons" ON public.module_lessons;
CREATE POLICY "Anyone can read lessons" ON public.module_lessons FOR SELECT USING (true);

-- Selesai! Lesson sekarang punya video_url, video_type, content, is_free
