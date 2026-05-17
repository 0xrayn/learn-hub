-- ============================================================
-- 11_fix_notifications_rls_and_streak.sql
-- ============================================================

-- ── 1. FIX RLS: user bisa insert notif untuk diri sendiri ────
-- (diperlukan untuk quiz passed notification dari frontend)
DROP POLICY IF EXISTS "Users insert own notifications" ON public.notifications;
CREATE POLICY "Users insert own notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Juga allow user delete notif milik sendiri (untuk fitur hapus)
DROP POLICY IF EXISTS "Users delete own notifications" ON public.notifications;
CREATE POLICY "Users delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ── 2. STREAK TRACKING ───────────────────────────────────────
-- Tabel untuk track hari belajar per user
CREATE TABLE IF NOT EXISTS public.learning_streaks (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null unique,
  current_streak int default 0 not null,       -- streak hari berturut-turut sekarang
  longest_streak int default 0 not null,       -- rekor terpanjang
  last_active_date date,                        -- terakhir belajar (tanggal)
  updated_at    timestamptz default now()
);

ALTER TABLE public.learning_streaks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own streak"   ON public.learning_streaks;
DROP POLICY IF EXISTS "Users upsert own streak" ON public.learning_streaks;

CREATE POLICY "Users see own streak"
  ON public.learning_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users upsert own streak"
  ON public.learning_streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON public.learning_streaks(user_id);

-- ── 3. FUNCTION: update streak otomatis ──────────────────────
-- Dipanggil dari frontend setiap kali user menandai lesson selesai
CREATE OR REPLACE FUNCTION public.update_learning_streak(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_today        date := current_date;
  v_row          public.learning_streaks%ROWTYPE;
  v_new_streak   int;
  v_new_longest  int;
BEGIN
  SELECT * INTO v_row FROM public.learning_streaks WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    -- First time
    INSERT INTO public.learning_streaks (user_id, current_streak, longest_streak, last_active_date)
    VALUES (p_user_id, 1, 1, v_today);
    RETURN json_build_object('current_streak', 1, 'longest_streak', 1);
  END IF;

  -- Already updated today
  IF v_row.last_active_date = v_today THEN
    RETURN json_build_object('current_streak', v_row.current_streak, 'longest_streak', v_row.longest_streak);
  END IF;

  -- Yesterday → continue streak
  IF v_row.last_active_date = v_today - interval '1 day' THEN
    v_new_streak := v_row.current_streak + 1;
  ELSE
    -- Gap > 1 day → reset streak
    v_new_streak := 1;
  END IF;

  v_new_longest := GREATEST(v_new_streak, v_row.longest_streak);

  UPDATE public.learning_streaks
  SET current_streak = v_new_streak, longest_streak = v_new_longest,
      last_active_date = v_today, updated_at = now()
  WHERE user_id = p_user_id;

  RETURN json_build_object('current_streak', v_new_streak, 'longest_streak', v_new_longest);
END;
$$;
