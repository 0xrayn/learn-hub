# LearnHub — Setup Guide

## Prasyarat
- Node.js 18+
- Akun [Supabase](https://supabase.com) (gratis)

---

## 1. Clone & Install

```bash
# Extract zip, masuk ke folder
cd learnhub_fixed
npm install
```

---

## 2. Setup Supabase

### Buat Project
1. Buka [supabase.com](https://supabase.com) → **New Project**
2. Isi nama project (misal: `learnhub`) → tunggu provisioning selesai

### Buat Tabel (Database Schema)
1. Di sidebar Supabase → **SQL Editor** → **New Query**
2. Copy-paste isi file `supabase-schema.sql`
3. Klik **Run** → semua tabel + RLS otomatis terbuat

### Ambil API Keys
1. **Settings** → **API**
2. Copy:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public** key → `eyJhbGci...`

---

## 3. Setup Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Edit .env.local dan isi dengan nilai dari Supabase
```

Isi `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 4. Setup Auth di Supabase

### Email Auth (sudah aktif by default)
- Supabase → **Authentication** → **Providers** → pastikan **Email** enabled
- **SMTP** (opsional, untuk email konfirmasi): Settings → Auth → SMTP

### Google OAuth (opsional)
1. Buat project di [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials** → **OAuth 2.0 Client IDs**
3. Authorized redirect URIs: `https://xxxx.supabase.co/auth/v1/callback`
4. Supabase → **Authentication** → **Providers** → **Google** → masukkan Client ID & Secret

---

## 5. Jalankan Development Server

```bash
npm run dev
# Buka http://localhost:3000
```

---

## Struktur Fitur

| Route | Akses | Keterangan |
|-------|-------|-----------|
| `/` | Semua | Landing page |
| `/artikel` | Semua | List semua artikel |
| `/artikel/[id]` | Semua | Detail artikel |
| `/edukasi` | Semua | List modul (lock badge tampil) |
| `/edukasi/1` | Semua | Modul gratis |
| `/edukasi/2` | Semua | Modul gratis |
| `/edukasi/3-6` | **Login** | Redirect ke /register jika belum login |
| `/login` | Semua | Form login + Google OAuth |
| `/register` | Semua | Form register + Google OAuth |

---

## Database Tables

| Tabel | Fungsi |
|-------|--------|
| `profiles` | Data profil user (nama, avatar) |
| `module_progress` | Progress belajar per modul per user |
| `artikel_bookmarks` | Bookmark artikel per user |

---

## Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables di Vercel Dashboard
# Settings → Environment Variables → tambah dua env di atas
```
