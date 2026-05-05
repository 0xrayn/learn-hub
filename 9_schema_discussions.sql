-- ============================================================
-- LearnHub — Tabel Diskusi per Lesson
-- Jalankan di Supabase Dashboard → SQL Editor → New Query → Run
-- Jalankan SETELAH 7_update_modules_and_quiz_results.sql
-- ============================================================

-- Tabel lesson_discussions
CREATE TABLE IF NOT EXISTS public.lesson_discussions (
  id          uuid default gen_random_uuid() primary key,
  lesson_id   bigint references public.module_lessons(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  parent_id   uuid references public.lesson_discussions(id) on delete cascade, -- null = top-level, isi = reply
  body        text not null,
  edited      boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Index
CREATE INDEX IF NOT EXISTS discussions_lesson_id_idx ON public.lesson_discussions(lesson_id);
CREATE INDEX IF NOT EXISTS discussions_parent_id_idx ON public.lesson_discussions(parent_id);
CREATE INDEX IF NOT EXISTS discussions_user_id_idx   ON public.lesson_discussions(user_id);

-- RLS
ALTER TABLE public.lesson_discussions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read discussions"   ON public.lesson_discussions;
DROP POLICY IF EXISTS "Users can post discussions"    ON public.lesson_discussions;
DROP POLICY IF EXISTS "Users can edit own discussion" ON public.lesson_discussions;
DROP POLICY IF EXISTS "Users can delete own"          ON public.lesson_discussions;
DROP POLICY IF EXISTS "Admin can delete any"          ON public.lesson_discussions;

CREATE POLICY "Anyone can read discussions"
  ON public.lesson_discussions FOR SELECT USING (true);

CREATE POLICY "Users can post discussions"
  ON public.lesson_discussions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit own discussion"
  ON public.lesson_discussions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own"
  ON public.lesson_discussions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can delete any"
  ON public.lesson_discussions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','superadmin')
    )
  );

-- Selesai! Lanjut update kode aplikasi.
