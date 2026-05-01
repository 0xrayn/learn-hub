-- ============================================================
-- LearnHub — Tabel Quiz per Lesson
-- Jalankan di Supabase Dashboard → SQL Editor → New Query → Run
-- Jalankan SETELAH 4_seed_lesson_content.sql
-- ============================================================

-- Buat tabel lesson_quizzes
CREATE TABLE IF NOT EXISTS public.lesson_quizzes (
  id           bigint generated always as identity primary key,
  lesson_id    bigint references public.module_lessons(id) on delete cascade not null,
  sort_order   int default 0,
  question     text not null,
  options      jsonb not null,       -- array of 4 strings
  answer       int not null,         -- index 0-3 dari options yang benar
  explanation  text not null,
  created_at   timestamptz default now()
);

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS lesson_quizzes_lesson_id_idx ON public.lesson_quizzes(lesson_id);

-- RLS
ALTER TABLE public.lesson_quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read quizzes"   ON public.lesson_quizzes;
DROP POLICY IF EXISTS "Admin can manage quizzes"  ON public.lesson_quizzes;

CREATE POLICY "Anyone can read quizzes"  ON public.lesson_quizzes FOR SELECT USING (true);
CREATE POLICY "Admin can manage quizzes" ON public.lesson_quizzes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','superadmin'))
);

-- Selesai! Lanjut jalankan 6_seed_quiz.sql
