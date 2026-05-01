-- ============================================================
-- LearnHub Update — Tambah sample video & konten ke lessons
-- Jalankan SETELAH 3_update_lessons.sql
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================
-- Catatan: Ganti video_url dengan link video kamu sendiri.
-- Contoh di bawah memakai YouTube publik tentang Bitcoin.

-- Update lesson pertama Modul 01 (Apa itu Uang & Masalahnya)
UPDATE public.module_lessons SET
  video_url = 'https://www.youtube.com/watch?v=bBC-nXj3Ng4',
  video_type = 'youtube',
  is_free = true,
  content = E'## Apa itu Uang?\n\nUang adalah alat tukar yang diterima secara umum untuk pembayaran barang, jasa, dan utang.\n\n## Fungsi Uang\n\n- **Alat Tukar**: Menggantikan sistem barter\n- **Satuan Hitung**: Standar pengukur nilai\n- **Penyimpan Nilai**: Bisa disimpan untuk digunakan nanti\n\n## Masalah Uang Modern\n\nUang kertas modern (fiat) punya masalah mendasar:\n\n1. **Inflasi** — Bank sentral bisa mencetak uang tanpa batas\n2. **Kontrol** — Pemerintah bisa membekukan rekening\n3. **Kepercayaan** — Nilainya bergantung pada kepercayaan institusi\n\n> "Bitcoin lahir sebagai solusi atas masalah-masalah ini."\n\n## Ringkasan\n\n- Uang adalah teknologi sosial\n- Uang fiat rentan inflasi dan kontrol terpusat\n- Bitcoin menawarkan alternatif: uang yang tidak bisa dicetak sembarangan'
WHERE title = 'Apa itu Uang & Masalahnya';

-- Update lesson kedua Modul 01
UPDATE public.module_lessons SET
  video_url = 'https://www.youtube.com/watch?v=Gc2en3nHxA4',
  video_type = 'youtube',
  is_free = true,
  content = E'## Siapa Satoshi Nakamoto?\n\nSatoshi Nakamoto adalah nama pseudonim dari pencipta Bitcoin. Identitas aslinya masih menjadi misteri hingga hari ini.\n\n## Timeline Bitcoin\n\n- **2008**: Whitepaper Bitcoin dipublikasikan\n- **2009**: Blok Genesis ditambang, 3 Januari 2009\n- **2010**: Transaksi nyata pertama — 10.000 BTC untuk 2 pizza\n- **2011**: Satoshi menghilang dari komunitas\n- **2021**: Bitcoin capai ATH $69.000\n\n## Blok Genesis\n\nPesan tersembunyi di blok pertama Bitcoin:\n\n```\n"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"\n```\n\nIni bukan kebetulan — Satoshi ingin menunjukkan mengapa Bitcoin diciptakan.\n\n## Mengapa Identitas Satoshi Penting?\n\nJustru karena kita **tidak tahu** siapa Satoshi, Bitcoin tidak bisa dikontrol oleh satu orang. Tidak ada CEO Bitcoin.'
WHERE title = 'Sejarah Bitcoin & Satoshi Nakamoto';

-- Update lesson Modul 01 lainnya
UPDATE public.module_lessons SET
  is_free = false,
  content = E'## Bitcoin vs Uang Konvensional\n\n| Aspek | Bitcoin | Rupiah (Fiat) |\n|-------|---------|---------------|\n| Supply | Terbatas 21 juta | Tidak terbatas |\n| Kontrol | Terdesentralisasi | Bank Sentral |\n| Privasi | Pseudonim | KYC wajib |\n| Inflasi | Deflasioner | Bisa inflasi |\n| Sensor | Tidak bisa disensor | Bisa diblokir |\n\n## Mengapa Bitcoin Unggul?\n\n**Kelangkaan**: Tidak ada yang bisa mencetak Bitcoin lebih dari 21 juta.\n\n**Borderless**: Kirim ke seluruh dunia dalam menit, tanpa izin bank.\n\n**Self-custody**: Kamu sendiri yang pegang kendali aset kamu.\n\n## Tapi...\n\nBitcoin juga punya kelemahan:\n- Volatilitas tinggi\n- Belum banyak merchant yang terima\n- Butuh edukasi untuk pakai dengan aman'
WHERE title = 'Bitcoin vs Uang Konvensional';

-- Update beberapa lesson Modul 02
UPDATE public.module_lessons SET
  video_url = 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
  video_type = 'youtube',
  is_free = true,
  content = E'## Apa Itu Blockchain?\n\nBlockchain adalah database yang terdistribusi — artinya tidak disimpan di satu server, tapi di ribuan komputer (node) di seluruh dunia.\n\n## Struktur "Rantai Blok"\n\nSetiap blok berisi:\n- Daftar transaksi\n- Timestamp\n- Hash dari blok sebelumnya\n- Nonce (angka yang digunakan untuk mining)\n\n## Kenapa Tidak Bisa Diubah?\n\nKarena setiap blok terhubung ke blok sebelumnya via **hash**. Kalau kamu ubah satu blok, hash-nya berubah, dan seluruh rantai setelahnya menjadi invalid.\n\n```\nBlok 1 [hash: abc123] → Blok 2 [prev: abc123, hash: def456] → Blok 3 [prev: def456...]\n```\n\n## Desentralisasi = Keamanan\n\nUntuk menyerang blockchain Bitcoin, kamu butuh mengontrol lebih dari 50% computing power seluruh jaringan — yang saat ini hampir mustahil secara ekonomi.'
WHERE title = 'Apa Itu Blockchain?';

UPDATE public.module_lessons SET
  is_free = false,
  content = E'## Apa Itu Hash?\n\nHash adalah output tetap dari sebuah fungsi matematika satu arah. Input berbeda → output berbeda. Tapi output tidak bisa di-reverse ke input.\n\n## SHA-256\n\nBitcoin menggunakan SHA-256 (Secure Hash Algorithm 256-bit).\n\n```\nInput:  "Hello Bitcoin"\nOutput: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e\n```\n\n```\nInput:  "Hello bitcoin" (huruf kecil)\nOutput: 23b2f5e94c1b20f3fac6e...  (sama sekali berbeda!)\n```\n\n## Mengapa SHA-256?\n\n- **Deterministik**: Input sama selalu → output sama\n- **Cepat dihitung**: Tapi tidak bisa di-reverse\n- **Avalanche effect**: Perubahan kecil → output sangat berbeda\n\n## Hash dalam Mining\n\nMiner harus menemukan hash yang dimulai dengan banyak angka nol. Semakin banyak nol yang dibutuhkan, semakin susah (difficulty tinggi).'
WHERE title = 'Hash Function & SHA-256';

-- Update Modul 03 - Keamanan
UPDATE public.module_lessons SET
  video_url = 'https://www.youtube.com/watch?v=S9JGmA5_unY',
  video_type = 'youtube',
  is_free = true,
  content = E'## Kriptografi Kunci Asimetris\n\nBitcoin menggunakan **sepasang kunci**:\n\n### Private Key 🔐\n- Angka acak 256-bit\n- **JANGAN PERNAH** dibagikan ke siapapun\n- Siapa yang pegang private key = yang miliki Bitcoin\n- Contoh: `KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn`\n\n### Public Key 🔓\n- Diturunkan dari private key (satu arah)\n- Aman untuk dibagikan\n- Dijadikan "alamat" Bitcoin kamu\n- Contoh: `1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf...`\n\n## Cara Kerja Transaksi\n\n1. Kamu **sign** transaksi dengan private key\n2. Jaringan **verifikasi** signature menggunakan public key\n3. Jika valid, transaksi diterima\n\n> Tidak ada yang bisa meniru signature kamu tanpa private key!\n\n## INGAT\n\n- Public key = nomor rekening (aman dibagikan)\n- Private key = PIN/password (RAHASIA MUTLAK)'
WHERE title = 'Public Key & Private Key';

UPDATE public.module_lessons SET
  is_free = true,
  content = E'## Apa Itu Seed Phrase?\n\nSeed phrase (atau mnemonic phrase) adalah 12-24 kata yang menjadi "kunci master" dompet Bitcoin kamu.\n\n## Contoh Seed Phrase\n\n```\nwitch collapse practice feed shame open despair \ncreek road again ice least\n```\n\n**⚠️ JANGAN gunakan contoh ini! Ini hanya ilustrasi.**\n\n## Cara Menyimpan dengan Aman\n\n### ✅ Boleh\n- Tulis di kertas, simpan di tempat aman\n- Gunakan pelat baja tahan api dan air\n- Simpan di beberapa tempat berbeda\n\n### ❌ Jangan\n- Foto/screenshot dan simpan di HP\n- Simpan di cloud (Google Drive, iCloud, dll)\n- Ketik di chat/email\n- Beritahu ke siapapun\n\n## Jika Seed Phrase Hilang?\n\nBitcoin kamu **hilang selamanya**. Tidak ada customer service. Tidak ada "lupa password". Inilah mengapa backup sangat krusial.'
WHERE title = 'Seed Phrase: Apa & Cara Menyimpannya';

-- Verifikasi
SELECT title, 
  CASE WHEN video_url IS NOT NULL THEN '✓ Video' ELSE '- No video' END as video_status,
  CASE WHEN content IS NOT NULL THEN '✓ Konten' ELSE '- No content' END as content_status,
  is_free
FROM public.module_lessons 
ORDER BY module_id, sort_order;
