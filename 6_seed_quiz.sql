-- ============================================================
-- LearnHub — Seed Data Quiz (v3, title sudah diverifikasi)
-- Jalankan SETELAH 5_schema_quiz.sql
-- ============================================================

DELETE FROM public.lesson_quizzes;

WITH lessons AS (
  SELECT ml.id AS lesson_id, m.num AS modul_num, ml.title AS lesson_title
  FROM public.module_lessons ml
  JOIN public.modules m ON m.id = ml.module_id
  WHERE (m.num, ml.title) IN (
    ('01', 'Apa itu Uang & Masalahnya'),
    ('01', 'Sejarah Bitcoin & Satoshi Nakamoto'),
    ('01', 'Bitcoin vs Uang Konvensional'),
    ('02', 'Apa Itu Blockchain?'),
    ('02', 'Hash Function & SHA-256'),
    ('03', 'Public Key & Private Key'),
    ('03', 'Seed Phrase: Apa & Cara Menyimpannya'),
    ('04', 'Mindset Investor vs Trader'),
    ('04', 'Strategi DCA (Dollar-Cost Averaging)')
  )
),
quiz_data (modul_num, lesson_title, sort_order, question, options, answer, explanation) AS (
  VALUES

  -- Modul 01 — Apa itu Uang & Masalahnya
  ('01'::text, 'Apa itu Uang & Masalahnya'::text, 0::int,
    'Apa fungsi utama uang dalam ekonomi?'::text,
    '["Alat investasi semata","Alat tukar yang diterima umum","Cadangan devisa negara","Aset fisik berwujud"]'::jsonb,
    1::int, 'Fungsi utama uang adalah sebagai alat tukar yang diterima secara umum untuk pembayaran barang, jasa, dan utang.'::text),
  ('01', 'Apa itu Uang & Masalahnya', 1,
    'Masalah utama uang fiat modern adalah...',
    '["Terlalu berat dibawa","Tidak bisa digital","Bisa dicetak tanpa batas oleh bank sentral","Hanya berlaku di satu negara"]'::jsonb,
    2, 'Uang fiat bisa dicetak sembarangan oleh bank sentral, menyebabkan inflasi dan mengikis daya beli masyarakat.'),
  ('01', 'Apa itu Uang & Masalahnya', 2,
    'Bitcoin lahir untuk menyelesaikan masalah apa?',
    '["Kelangkaan fisik emas","Kecepatan transfer bank","Ketergantungan pada pihak ketiga yang terpusat","Pajak transaksi internasional"]'::jsonb,
    2, 'Bitcoin dirancang sebagai sistem pembayaran peer-to-peer yang tidak membutuhkan pihak ketiga terpercaya seperti bank atau pemerintah.'),

  -- Modul 01 — Sejarah Bitcoin & Satoshi Nakamoto
  ('01', 'Sejarah Bitcoin & Satoshi Nakamoto', 0,
    'Kapan whitepaper Bitcoin pertama kali dipublikasikan?',
    '["1 Januari 2009","31 Oktober 2008","22 Mei 2010","3 Januari 2009"]'::jsonb,
    1, 'Whitepaper Bitcoin dipublikasikan oleh Satoshi Nakamoto pada 31 Oktober 2008.'),
  ('01', 'Sejarah Bitcoin & Satoshi Nakamoto', 1,
    'Pesan tersembunyi di blok genesis Bitcoin merujuk pada...',
    '["Harga Bitcoin perdana","Berita bailout bank di The Times 3 Januari 2009","Nama lengkap Satoshi","Tanggal halving pertama"]'::jsonb,
    1, 'Satoshi menyisipkan judul berita The Times sebagai komentar tentang kegagalan sistem keuangan tradisional.'),
  ('01', 'Sejarah Bitcoin & Satoshi Nakamoto', 2,
    'Mengapa identitas Satoshi yang anonim justru menguntungkan Bitcoin?',
    '["Agar tidak kena pajak","Supaya harga Bitcoin naik","Bitcoin tidak bisa dikontrol satu orang karena tidak ada CEO","Agar mudah mencetak lebih banyak Bitcoin"]'::jsonb,
    2, 'Karena tidak ada tokoh sentral yang bisa ditekan atau memengaruhi arah Bitcoin — ini menjamin desentralisasi sejati.'),

  -- Modul 01 — Bitcoin vs Uang Konvensional
  ('01', 'Bitcoin vs Uang Konvensional', 0,
    'Berapa total maksimum Bitcoin yang akan pernah ada?',
    '["100 juta BTC","21 juta BTC","1 miliar BTC","Tidak terbatas"]'::jsonb,
    1, 'Supply Bitcoin dibatasi secara matematis di 21 juta koin — tidak bisa diubah oleh siapapun.'),
  ('01', 'Bitcoin vs Uang Konvensional', 1,
    'Apa keunggulan Bitcoin dibanding rupiah dari sisi sensor?',
    '["Bitcoin lebih mudah dilacak","Bitcoin bisa dibekukan oleh pemerintah","Bitcoin tidak bisa disensor atau dibekukan","Bitcoin membutuhkan KYC"]'::jsonb,
    2, 'Karena Bitcoin berjalan di jaringan terdesentralisasi, tidak ada pihak yang bisa memblokir transaksi secara sepihak.'),

  -- Modul 02 — Apa Itu Blockchain?
  ('02', 'Apa Itu Blockchain?', 0,
    'Apa yang dimaksud blockchain "tidak bisa diubah" (immutable)?',
    '["Data bisa dihapus oleh admin","Mengubah satu blok akan merusak seluruh rantai setelahnya","Hanya developer yang bisa edit","Data disimpan di satu server pusat"]'::jsonb,
    1, 'Karena setiap blok menyimpan hash dari blok sebelumnya — mengubah satu blok berarti semua blok setelahnya menjadi invalid.'),
  ('02', 'Apa Itu Blockchain?', 1,
    'Mengapa blockchain Bitcoin sulit diserang?',
    '["Pakai enkripsi 128-bit","Disimpan di server Google","Butuh mengontrol lebih dari 50% computing power seluruh jaringan","Ada firewall dari NSA"]'::jsonb,
    2, 'Serangan 51% attack membutuhkan computing power lebih dari setengah seluruh jaringan mining Bitcoin — secara ekonomi hampir mustahil.'),
  ('02', 'Apa Itu Blockchain?', 2,
    'Apa yang ada di dalam setiap blok Bitcoin?',
    '["Foto dan video transaksi","Daftar transaksi, timestamp, dan hash blok sebelumnya","Password pengguna","Alamat email penambang"]'::jsonb,
    1, 'Setiap blok berisi kumpulan transaksi tervalidasi, timestamp, hash dari blok sebelumnya, dan nonce dari proses mining.'),

  -- Modul 02 — Hash Function & SHA-256
  ('02', 'Hash Function & SHA-256', 0,
    'Apa sifat paling penting dari fungsi hash kriptografi?',
    '["Bisa di-reverse untuk mendapat input asal","Output selalu sama panjangnya dan tidak bisa di-reverse","Menghasilkan output acak setiap kali","Hanya bisa dipakai untuk Bitcoin"]'::jsonb,
    1, 'Hash bersifat deterministik, satu arah (tidak bisa di-reverse), dan perubahan kecil di input menghasilkan output yang sangat berbeda.'),
  ('02', 'Hash Function & SHA-256', 1,
    'Apa yang harus ditemukan miner untuk menambang blok baru?',
    '["Password jaringan Bitcoin","Hash yang dimulai dengan banyak angka nol sesuai difficulty","Nama Satoshi Nakamoto","Nomor transaksi terbesar"]'::jsonb,
    1, 'Miner harus menemukan nonce yang menghasilkan hash dengan awalan nol sesuai difficulty jaringan — proses ini disebut Proof of Work.'),

  -- Modul 03 — Public Key & Private Key
  ('03', 'Public Key & Private Key', 0,
    'Apa perbedaan public key dan private key?',
    '["Keduanya sama saja","Public key untuk kirim, private key untuk terima","Public key aman dibagikan; private key RAHASIA jangan dibagikan","Private key lebih pendek"]'::jsonb,
    2, 'Public key (dijadikan alamat Bitcoin) aman untuk dibagikan. Private key harus dijaga mutlak — siapa yang punya private key, dialah pemilik Bitcoin.'),
  ('03', 'Public Key & Private Key', 1,
    'Apa yang terjadi jika private key kamu bocor?',
    '["Tidak ada efeknya","Bitcoin kamu bisa dicuri oleh siapapun yang memilikinya","Perlu verifikasi KYC ulang","Hanya bisa digunakan dengan persetujuanmu"]'::jsonb,
    1, 'Siapapun yang memiliki private key bisa langsung mentransfer semua Bitcoin di dompet tersebut tanpa izin siapapun.'),
  ('03', 'Public Key & Private Key', 2,
    'Analogi terbaik untuk public key dan private key adalah...',
    '["Nomor rekening (public key) dan PIN/password (private key)","Username dan password email","Nomor telepon dan IMEI","IP address dan MAC address"]'::jsonb,
    0, 'Public key seperti nomor rekening — aman dibagikan. Private key seperti PIN — tidak boleh dibagikan ke siapapun.'),

  -- Modul 03 — Seed Phrase
  ('03', 'Seed Phrase: Apa & Cara Menyimpannya', 0,
    'Apa itu seed phrase?',
    '["Password akun exchange","12-24 kata yang menjadi kunci master dompet Bitcoin","Nomor rekening Bitcoin","Kode OTP untuk transaksi"]'::jsonb,
    1, 'Seed phrase adalah 12-24 kata yang bisa digunakan untuk memulihkan seluruh dompet kripto beserta semua private key di dalamnya.'),
  ('03', 'Seed Phrase: Apa & Cara Menyimpannya', 1,
    'Cara TERBAIK menyimpan seed phrase adalah...',
    '["Screenshot & simpan di Google Drive","Foto lalu kirim ke email pribadi","Tulis di kertas & simpan di tempat aman secara offline","Ketik di aplikasi notes di HP"]'::jsonb,
    2, 'Seed phrase harus disimpan offline: tulis di kertas atau pelat baja tahan api. TIDAK PERNAH disimpan secara digital.'),
  ('03', 'Seed Phrase: Apa & Cara Menyimpannya', 2,
    'Apa yang terjadi jika seed phrase hilang?',
    '["Bisa minta reset ke customer service","Gunakan email untuk recovery","Bitcoin hilang selamanya, tidak ada yang bisa memulihkan","Hubungi pengembang dompet"]'::jsonb,
    2, 'Bitcoin tidak memiliki customer service. Tanpa seed phrase, akses ke dompet hilang permanen — tidak ada siapapun yang bisa membantu.'),

  -- Modul 04 — Mindset Investor vs Trader
  ('04', 'Mindset Investor vs Trader', 0,
    'Apa perbedaan utama mindset investor jangka panjang vs trader?',
    '["Investor lebih sering transaksi","Investor fokus pada nilai fundamental jangka panjang; trader pada pergerakan harga jangka pendek","Trader tidak perlu analisis","Investor tidak boleh jual Bitcoin"]'::jsonb,
    1, 'Investor beli dan hold berdasarkan keyakinan pada nilai fundamental. Trader mencoba profit dari volatilitas jangka pendek — jauh lebih berisiko.'),
  ('04', 'Mindset Investor vs Trader', 1,
    'Mengapa sebagian besar trader retail akhirnya rugi?',
    '["Karena Bitcoin memang scam","Emosi (FOMO & FUD) sering mengalahkan analisis rasional","Karena trading itu ilegal","Exchange selalu memanipulasi harga"]'::jsonb,
    1, 'Emosi adalah musuh terbesar trader. FOMO mendorong beli di puncak, FUD mendorong jual di bawah — pola yang berulang mengakibatkan kerugian.'),

  -- Modul 04 — Strategi DCA (Dollar-Cost Averaging)
  ('04', 'Strategi DCA (Dollar-Cost Averaging)', 0,
    'DCA (Dollar Cost Averaging) artinya...',
    '["Beli semua sekarang di harga terendah","Beli Bitcoin dalam jumlah tetap secara rutin terlepas dari harga","Jual sebagian saat harga naik","Hanya beli saat harga turun drastis"]'::jsonb,
    1, 'DCA berarti mengalokasikan jumlah uang yang sama secara rutin (misal Rp500.000/minggu) untuk beli Bitcoin — tanpa peduli naik atau turun.'),
  ('04', 'Strategi DCA (Dollar-Cost Averaging)', 1,
    'Apa keuntungan utama strategi DCA?',
    '["Selalu dapat harga terendah","Menghilangkan tekanan menebak waktu pasar yang tepat (timing)","Hanya bisa dilakukan institusi besar","Menghasilkan profit paling tinggi"]'::jsonb,
    1, 'DCA menghilangkan stres kapan waktu terbaik beli — rata-rata harga beli smoothed out seiring waktu, mengurangi dampak volatilitas.')
)
INSERT INTO public.lesson_quizzes (lesson_id, sort_order, question, options, answer, explanation)
SELECT l.lesson_id, qd.sort_order, qd.question, qd.options, qd.answer, qd.explanation
FROM quiz_data qd
JOIN lessons l ON l.modul_num = qd.modul_num AND l.lesson_title = qd.lesson_title;

-- Verifikasi
SELECT m.num, ml.title AS lesson, COUNT(lq.id) AS jumlah_soal
FROM public.lesson_quizzes lq
JOIN public.module_lessons ml ON ml.id = lq.lesson_id
JOIN public.modules m ON m.id = ml.module_id
GROUP BY m.num, ml.title
ORDER BY m.num, ml.title;
