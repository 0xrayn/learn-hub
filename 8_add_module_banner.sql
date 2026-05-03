-- Migration: tambah kolom banner_url ke tabel modules
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS banner_url text;

-- Pastikan bucket modul-images sudah ada di Supabase Storage
-- (buat manual di dashboard jika belum ada)
