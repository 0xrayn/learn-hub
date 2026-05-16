-- ============================================================
-- 10_schema_notifications_leaderboard.sql
-- Notifikasi per user + Leaderboard (ranking berdasarkan lesson selesai)
-- ============================================================

-- ── 1. TABEL NOTIFICATIONS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade not null,
  type       text not null,           -- 'lesson_new' | 'module_update' | 'badge_earned' | 'quiz_passed'
  title      text not null,
  body       text,
  link       text,                    -- URL tujuan saat notif diklik
  is_read    boolean default false,
  created_at timestamptz default now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own notifications"   ON public.notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin insert notifications"     ON public.notifications;

CREATE POLICY "Users see own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin / superadmin bisa insert notifikasi untuk semua user
CREATE POLICY "Admin insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Index untuk query cepat
CREATE INDEX IF NOT EXISTS idx_notifications_user_id    ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- ── 2. VIEW LEADERBOARD ───────────────────────────────────────
-- Ranking berdasarkan total lesson yang diselesaikan per user
-- (dihitung dari module_progress)

DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard AS
SELECT
  p.id          AS user_id,
  p.name,
  p.avatar_url,
  COUNT(mp.id) FILTER (WHERE mp.completed = true) AS lessons_done,
  COUNT(DISTINCT mp.module_id) FILTER (WHERE mp.completed = true) AS modules_active,
  MAX(mp.updated_at) AS last_active,
  RANK() OVER (ORDER BY COUNT(mp.id) FILTER (WHERE mp.completed = true) DESC) AS rank
FROM public.profiles p
LEFT JOIN public.module_progress mp ON mp.user_id = p.id
GROUP BY p.id, p.name, p.avatar_url
ORDER BY lessons_done DESC;

-- Public read for leaderboard
CREATE POLICY "Public read leaderboard source"
  ON public.module_progress FOR SELECT
  USING (true);

-- ── 3. HELPER: auto-notif saat lesson baru dipublish ─────────
-- (Opsional — bisa dipanggil dari trigger / admin panel)
-- INSERT INTO public.notifications (user_id, type, title, body, link)
-- SELECT id, 'lesson_new', 'Lesson Baru!', 'Ada lesson baru: ' || <lesson_title>, '/edukasi/' || <module_id> || '/lesson/' || <lesson_id>
-- FROM public.profiles;
