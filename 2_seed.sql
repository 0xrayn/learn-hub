-- ============================================================
-- LearnHub Seed Data — Jalankan KEDUA (setelah 1_schema.sql)
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- ── LANGKAH 1: Set role admin & superadmin ───────────────────
-- Ganti email di bawah dengan email yang sudah kamu daftarkan di /register

UPDATE public.profiles SET role = 'superadmin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'superadmin@learnhub.id');

UPDATE public.profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@learnhub.id');

-- Atau pakai UUID langsung (lihat di Supabase > Authentication > Users):
-- UPDATE public.profiles SET role = 'superadmin' WHERE id = 'uuid-kamu-di-sini';


-- ── LANGKAH 2: Seed Artikel ───────────────────────────────────
-- Skip bagian ini kalau artikel sudah ada
INSERT INTO public.articles (title, excerpt, content, category, cat_color, author, image_url, read_time, published) VALUES

('Apa Itu Bitcoin? Panduan Lengkap untuk Pemula',
 'Bitcoin adalah mata uang digital pertama yang beroperasi tanpa bank sentral. Pelajari dasar-dasarnya di sini.',
 E'## Apa Itu Bitcoin?\n\nBitcoin adalah sistem pembayaran elektronik peer-to-peer yang diperkenalkan oleh Satoshi Nakamoto pada tahun 2008. Tidak ada bank, tidak ada pemerintah — hanya jaringan komputer global.\n\n## Supply yang Terbatas\n\nHanya ada 21 juta BTC yang akan pernah ada. Ini membuat Bitcoin bersifat deflasioner — berbeda dari rupiah yang bisa dicetak tanpa batas.\n\n## Cara Kerja Bitcoin\n\nSetiap transaksi disiarkan ke jaringan global. Para miner memvalidasi transaksi menggunakan Proof of Work dan menambahkannya ke blockchain.\n\n## Kenapa Bitcoin Berharga?\n\n- **Kelangkaan**: Supply terbatas 21 juta\n- **Desentralisasi**: Tidak bisa disensor atau dibekukan\n- **Keamanan**: Kriptografi terkuat yang ada\n- **Portabilitas**: Bisa dikirim ke mana saja dalam menit',
 'Pemula','#22c55e','Rizal Hakim',
 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80','5 mnt',true),

('Blockchain: Teknologi di Balik Bitcoin',
 'Blockchain adalah buku besar digital yang terdesentralisasi. Pelajari bagaimana teknologi ini bekerja.',
 E'## Apa Itu Blockchain?\n\nBlockchain adalah database yang tersebar di ribuan komputer di seluruh dunia. Setiap "blok" berisi kumpulan transaksi, dan setiap blok terhubung ke blok sebelumnya.\n\n## Immutabilitas\n\nSekali data masuk ke blockchain, hampir mustahil untuk mengubahnya. Untuk mengubah satu blok, kamu harus mengubah semua blok setelahnya di lebih dari 50% node.\n\n## Desentralisasi\n\nTidak ada satu entitas yang mengontrol blockchain Bitcoin. Ribuan node di seluruh dunia menyimpan salinan lengkap blockchain.',
 'Teknologi','#06b6d4','Dian Pratiwi',
 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80','7 mnt',true),

('Bitcoin vs Investasi Konvensional: Mana yang Lebih Baik?',
 'Membandingkan Bitcoin dengan saham, emas, dan properti dari sudut pandang risiko dan return.',
 E'## Perbandingan Aset\n\n### Bitcoin\n- **Return historis**: +1,000,000% sejak 2010\n- **Volatilitas**: Sangat tinggi\n- **Supply**: Terbatas 21 juta\n\n### Emas\n- **Return historis**: ~8% per tahun\n- **Volatilitas**: Rendah\n\n### Saham (Indeks)\n- **Return historis**: ~10% per tahun (S&P 500)\n- **Volatilitas**: Menengah\n\n## Rekomendasi\n\nDiversifikasi adalah kunci. Bitcoin cocok sebagai 1-5% dari portofolio untuk investor konservatif.',
 'Investasi','#f59e0b','Ahmad Fauzi',
 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80','8 mnt',true),

('Keamanan Aset Kripto: Panduan Lengkap',
 'Cara melindungi Bitcoin dan aset kripto kamu dari hacker, scam, dan kesalahan sendiri.',
 E'## Ancaman Utama\n\n### 1. Exchange Hack\nMt. Gox, FTX, Bitfinex — exchange besar pun bisa bangkrut atau diretas. **"Not your keys, not your coins."**\n\n### 2. Phishing\nEmail atau website palsu yang mencuri seed phrase atau password kamu.\n\n### 3. Scam\nTerlalu bagus untuk jadi kenyataan? Pasti scam.\n\n## Best Practices\n\n1. **Hardware wallet** untuk penyimpanan jangka panjang\n2. **Seed phrase** disimpan offline, bukan di cloud\n3. **2FA** untuk semua akun exchange\n4. **Jangan share** jumlah aset ke orang tidak dikenal',
 'Keamanan','#a78bfa','Sari Indah',
 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80','6 mnt',true),

('Sejarah Bitcoin: Dari Whitepaper ke $100K',
 'Perjalanan Bitcoin dari email misterius Satoshi Nakamoto hingga menjadi aset global senilai triliunan dolar.',
 E'## 2008: Lahirnya Bitcoin\n\n31 Oktober 2008, Satoshi Nakamoto mengirim whitepaper berjudul "Bitcoin: A Peer-to-Peer Electronic Cash System."\n\n## 2009: Blok Genesis\n\n3 Januari 2009, blok pertama Bitcoin di-mine. Satoshi menyisipkan pesan: *"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks."*\n\n## 2010: Pizza Bitcoin\n\n22 Mei 2010 — Laszlo Hanyecz membeli 2 pizza dengan 10.000 BTC. Ini transaksi komersial pertama Bitcoin.\n\n## 2021: All Time High\n\nBitcoin mencapai $69,000 dengan total market cap melampaui $1 triliun.',
 'Sejarah','#fb923c','Budi Santoso',
 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=1200&q=80','10 mnt',true),

('DCA Bitcoin: Strategi Investasi Paling Aman',
 'Dollar-Cost Averaging adalah cara paling terbukti untuk membangun portofolio Bitcoin jangka panjang.',
 E'## Apa Itu DCA?\n\nDCA (Dollar-Cost Averaging) adalah strategi investasi rutin dengan jumlah tetap, terlepas dari harga pasar. Misalnya: beli Rp 500.000 Bitcoin setiap bulan.\n\n## Mengapa DCA Efektif?\n\n- **Menghilangkan timing risk**: Tidak perlu tahu kapan harga terendah\n- **Disiplin**: Otomatis dan konsisten\n- **Psikologi**: Mengurangi stres akibat volatilitas\n\n## Tools DCA di Indonesia\n\n- Indodax, Tokocrypto, Pintu — support auto DCA\n- Set dan lupakan — tinjau setahun sekali',
 'Investasi','#f59e0b','Maya Putri',
 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80','6 mnt',true);


-- ── LANGKAH 3: Seed Modul ─────────────────────────────────────
-- Skip bagian ini kalau modul sudah ada
INSERT INTO public.modules (num, icon, title, description, long_desc, duration, level, accent, level_color, published, sort_order) VALUES
('01','₿','Pengenalan Bitcoin',
 'Pahami apa itu Bitcoin, sejarahnya, dan mengapa ia revolusioner.',
 'Modul ini cocok untuk pemula absolut. Kamu akan belajar dari nol tentang apa itu Bitcoin, siapa Satoshi Nakamoto, dan bagaimana ia berbeda dari uang biasa.',
 '45 mnt','Pemula','#f59e0b','#22c55e',true,1),

('02','⛓','Teknologi Blockchain',
 'Selami teknologi di balik Bitcoin: blockchain, kriptografi, dan node.',
 'Modul ini menjelaskan cara kerja blockchain secara mendalam. Dari struktur blok, hashing SHA-256, hingga bagaimana node memvalidasi transaksi.',
 '60 mnt','Menengah','#06b6d4','#06b6d4',true,2),

('03','🔐','Keamanan & Wallet',
 'Cara menyimpan Bitcoin dengan aman: dari hot wallet hingga cold storage.',
 'Keamanan adalah topik paling penting dalam dunia kripto. Modul ini mengajarkan perbedaan custodial vs non-custodial wallet dan praktik keamanan terbaik.',
 '50 mnt','Pemula','#a78bfa','#22c55e',true,3),

('04','📈','Investasi & Trading Bitcoin',
 'Strategi investasi Bitcoin: DCA, fundamental analysis, dan manajemen risiko.',
 'Bukan tentang cepat kaya — tapi investasi cerdas jangka panjang. Strategi DCA, manajemen portofolio, dan menghindari FOMO.',
 '75 mnt','Menengah','#22c55e','#06b6d4',true,4),

('05','⚡','Lightning Network',
 'Bitcoin untuk pembayaran sehari-hari via Lightning Network.',
 'Lightning Network memungkinkan transaksi Bitcoin instan dengan biaya hampir nol.',
 '55 mnt','Menengah','#f97316','#06b6d4',true,5),

('06','⛏','Bitcoin Mining',
 'Dari konsep Proof of Work hingga cara kerja mining pool dan profitabilitas.',
 'Membahas seluk-beluk mining Bitcoin: algoritma SHA-256, difficulty adjustment, halving, dan analisis profitabilitas.',
 '90 mnt','Lanjutan','#ef4444','#f59e0b',true,6);


-- ── LANGKAH 4: Seed Lessons ───────────────────────────────────
-- Modul 1
WITH m AS (SELECT id FROM public.modules WHERE num = '01' LIMIT 1)
INSERT INTO public.module_lessons (module_id, title, duration, sort_order) VALUES
((SELECT id FROM m),'Apa itu Uang & Masalahnya','8 mnt',0),
((SELECT id FROM m),'Sejarah Bitcoin & Satoshi Nakamoto','10 mnt',1),
((SELECT id FROM m),'Bitcoin vs Uang Konvensional','8 mnt',2),
((SELECT id FROM m),'Supply Terbatas & Deflasi','7 mnt',3),
((SELECT id FROM m),'Cara Pertama Mendapatkan Bitcoin','12 mnt',4);

-- Modul 2
WITH m AS (SELECT id FROM public.modules WHERE num = '02' LIMIT 1)
INSERT INTO public.module_lessons (module_id, title, duration, sort_order) VALUES
((SELECT id FROM m),'Apa Itu Blockchain?','10 mnt',0),
((SELECT id FROM m),'Hash Function & SHA-256','12 mnt',1),
((SELECT id FROM m),'Struktur Blok Bitcoin','10 mnt',2),
((SELECT id FROM m),'Node & Jaringan Peer-to-Peer','12 mnt',3),
((SELECT id FROM m),'Proof of Work','9 mnt',4);

-- Modul 3
WITH m AS (SELECT id FROM public.modules WHERE num = '03' LIMIT 1)
INSERT INTO public.module_lessons (module_id, title, duration, sort_order) VALUES
((SELECT id FROM m),'Public Key & Private Key','10 mnt',0),
((SELECT id FROM m),'Seed Phrase: Apa & Cara Menyimpannya','10 mnt',1),
((SELECT id FROM m),'Hot Wallet vs Cold Wallet','8 mnt',2),
((SELECT id FROM m),'Setup Hardware Wallet','12 mnt',3),
((SELECT id FROM m),'Menghindari Scam & Phishing','10 mnt',4);

-- Modul 4
WITH m AS (SELECT id FROM public.modules WHERE num = '04' LIMIT 1)
INSERT INTO public.module_lessons (module_id, title, duration, sort_order) VALUES
((SELECT id FROM m),'Mindset Investor vs Trader','10 mnt',0),
((SELECT id FROM m),'Strategi DCA','12 mnt',1),
((SELECT id FROM m),'Fundamental Analysis Bitcoin','15 mnt',2),
((SELECT id FROM m),'Manajemen Risiko & Portofolio','13 mnt',3),
((SELECT id FROM m),'Psikologi: FOMO, FUD & HODLing','10 mnt',4);

-- Modul 5
WITH m AS (SELECT id FROM public.modules WHERE num = '05' LIMIT 1)
INSERT INTO public.module_lessons (module_id, title, duration, sort_order) VALUES
((SELECT id FROM m),'Masalah Skalabilitas Bitcoin','8 mnt',0),
((SELECT id FROM m),'Cara Kerja Lightning Network','12 mnt',1),
((SELECT id FROM m),'Payment Channel Explained','10 mnt',2),
((SELECT id FROM m),'Setup Lightning Wallet','13 mnt',3),
((SELECT id FROM m),'Ekosistem App Lightning','12 mnt',4);

-- Modul 6
WITH m AS (SELECT id FROM public.modules WHERE num = '06' LIMIT 1)
INSERT INTO public.module_lessons (module_id, title, duration, sort_order) VALUES
((SELECT id FROM m),'Proof of Work & Difficulty','15 mnt',0),
((SELECT id FROM m),'ASIC Hardware & Setup','18 mnt',1),
((SELECT id FROM m),'Mining Pool: Cara Kerja','12 mnt',2),
((SELECT id FROM m),'Halving & Ekonomi Mining','15 mnt',3),
((SELECT id FROM m),'Analisis Profitabilitas','20 mnt',4);


-- ── Verifikasi ────────────────────────────────────────────────
SELECT
  (SELECT COUNT(*) FROM public.articles)       AS total_artikel,
  (SELECT COUNT(*) FROM public.modules)        AS total_modul,
  (SELECT COUNT(*) FROM public.module_lessons) AS total_lessons,
  (SELECT COUNT(*) FROM public.profiles)       AS total_users;
