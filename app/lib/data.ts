export const ARTICLES = [
  {
    id: 1, category: "Pemula", readTime: "5 mnt",
    title: "Apa Itu Bitcoin? Panduan Lengkap untuk Pemula",
    excerpt: "Bitcoin adalah mata uang digital pertama yang beroperasi tanpa bank sentral. Pelajari dasar-dasarnya di sini.",
    content: `Bitcoin adalah sistem pembayaran elektronik peer-to-peer yang diperkenalkan oleh Satoshi Nakamoto pada tahun 2008 melalui whitepaper berjudul "Bitcoin: A Peer-to-Peer Electronic Cash System".

## Apa yang Membuat Bitcoin Istimewa?

Bitcoin berbeda dari mata uang konvensional karena tidak dikendalikan oleh bank sentral atau pemerintah manapun. Transaksi terjadi langsung antara pengguna tanpa perantara, dicatat dalam teknologi blockchain yang transparan dan tidak bisa dimanipulasi.

## Supply yang Terbatas

Salah satu properti paling fundamental Bitcoin adalah jumlahnya yang terbatas — hanya akan ada 21 juta BTC yang pernah ada. Ini berbeda dari mata uang fiat yang bisa dicetak tanpa batas oleh bank sentral, menjadikan Bitcoin bersifat deflasioner secara alami.

## Bagaimana Bitcoin Bekerja?

Setiap transaksi Bitcoin disiarkan ke jaringan peer-to-peer global. Para miner memvalidasi transaksi ini menggunakan mekanisme Proof of Work dan menambahkannya ke blockchain. Sebagai imbalan, miner mendapatkan reward berupa Bitcoin baru.

## Mengapa Bitcoin Berharga?

Nilai Bitcoin didorong oleh beberapa faktor: kelangkaan (supply terbatas), utilitas (bisa dikirim ke mana saja di dunia dalam menit), keamanan (kriptografi terkuat), dan kepercayaan komunitas global yang terus berkembang.

## Siapa yang Bisa Menggunakan Bitcoin?

Siapa pun! Bitcoin tidak memerlukan rekening bank, tidak ada KYC wajib untuk menyimpan sendiri, dan bisa diakses oleh siapa saja yang memiliki koneksi internet. Inilah mengapa Bitcoin sering disebut sebagai "bank tanpa bank".`,
    author: "Rizal Hakim", date: "18 Apr 2025",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80",
    catColor: "#22c55e",
  },
  {
    id: 2, category: "Teknologi", readTime: "8 mnt",
    title: "Memahami Blockchain: Teknologi di Balik Bitcoin",
    excerpt: "Blockchain adalah buku besar digital terdesentralisasi. Inilah cara kerja teknologi revolusioner ini.",
    content: `Blockchain adalah teknologi basis data yang menyimpan data dalam blok-blok yang saling terhubung dan terenkripsi secara kriptografis — itulah mengapa disebut "rantai blok" (chain of blocks).

## Struktur Blok

Setiap blok dalam blockchain Bitcoin berisi: header (metadata), daftar transaksi, dan hash dari blok sebelumnya. Hubungan inilah yang membuat blockchain tidak bisa dimanipulasi — mengubah satu blok akan merusak seluruh rantai setelahnya.

## Desentralisasi

Tidak ada satu entitas pun yang memiliki atau mengontrol blockchain Bitcoin. Ribuan node di seluruh dunia menyimpan salinan lengkap blockchain, membuatnya hampir mustahil untuk diserang atau disensor.

## Proof of Work

Untuk menambahkan blok baru, miner harus memecahkan teka-teki matematika yang disebut hash puzzle. Proses ini membutuhkan komputasi yang sangat besar, menjadikan penipuan secara ekonomi tidak menguntungkan.

## Immutability

Setelah transaksi masuk ke blockchain dan mendapat beberapa konfirmasi, ia praktis tidak bisa dibatalkan atau diubah. Ini menjamin finality dan kepercayaan tanpa perlu pihak ketiga.

## Transparansi

Semua transaksi Bitcoin bersifat publik dan bisa diverifikasi oleh siapa pun melalui block explorer. Meskipun identitas pengguna pseudonim, aliran uang sepenuhnya transparan.`,
    author: "Sari Dewi", date: "16 Apr 2025",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80",
    catColor: "#06b6d4",
  },
  {
    id: 3, category: "Investasi", readTime: "6 mnt",
    title: "Dollar Cost Averaging (DCA) Bitcoin: Strategi Terbaik?",
    excerpt: "DCA adalah strategi populer di kalangan HODLer Bitcoin. Cara menerapkannya dengan benar.",
    content: `Dollar Cost Averaging (DCA) adalah strategi investasi di mana kamu membeli aset dalam jumlah tetap secara berkala, terlepas dari harga saat itu.

## Mengapa DCA Efektif untuk Bitcoin?

Bitcoin sangat volatil. Harganya bisa naik atau turun 20-30% dalam sehari. Dengan DCA, kamu tidak perlu menebak kapan harga terendah — kamu membeli secara konsisten dan mendapatkan harga rata-rata dari waktu ke waktu.

## Contoh DCA Sederhana

Misalkan kamu membeli Rp 500.000 Bitcoin setiap minggu selama 1 tahun. Terkadang kamu beli saat harga tinggi, terkadang saat rendah. Hasilnya, harga rata-rata beli kamu akan lebih baik daripada mencoba timing pasar.

## DCA vs Lump Sum

Lump sum (beli semua sekaligus) bisa lebih menguntungkan jika kamu beli di harga terendah. Tapi siapa yang bisa prediksi itu? DCA menghilangkan tekanan psikologis dan risiko beli di puncak harga.

## Tips Menjalankan DCA

- Tentukan jumlah tetap yang tidak akan mengganggu kebutuhan hidup
- Atur jadwal otomatis (mingguan/bulanan) di exchange terpercaya
- Jangan panik saat harga turun — itulah saat kamu beli lebih murah
- Tetapkan target jangka panjang (minimal 2-4 tahun)

## Tools DCA di Indonesia

Indodax, Tokocrypto, dan Pintu menyediakan fitur auto-buy yang bisa dikonfigurasi untuk DCA otomatis.`,
    author: "Dimas Pratama", date: "14 Apr 2025",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    catColor: "#f59e0b",
  },
  {
    id: 4, category: "Keamanan", readTime: "7 mnt",
    title: "Cara Menyimpan Bitcoin dengan Aman: Hardware Wallet",
    excerpt: "Tidak semua wallet Bitcoin sama amannya. Pelajari cara terbaik melindungi aset kripto Anda.",
    content: `"Not your keys, not your coins" — prinsip fundamental keamanan Bitcoin. Jika kamu tidak memegang private key sendiri, kamu tidak benar-benar memiliki Bitcoin-mu.

## Jenis-jenis Wallet

**Hot Wallet**: Terhubung ke internet. Praktis tapi rentan hack. Contoh: wallet di exchange, MetaMask, mobile wallet.

**Cold Wallet (Hardware Wallet)**: Menyimpan private key secara offline. Jauh lebih aman. Contoh: Ledger, Trezor, Coldcard.

## Mengapa Hardware Wallet?

Hardware wallet menyimpan private key di chip yang terisolasi dari internet. Bahkan jika komputermu terinfeksi malware, hacker tidak bisa mencuri Bitcoin-mu karena kunci tidak pernah meninggalkan device.

## Seed Phrase — Nyawa Bitcoin-mu

Saat setup hardware wallet, kamu mendapat 12-24 kata (seed phrase). Ini adalah master key yang bisa memulihkan semua aset. Simpan:
- Di kertas (bukan digital)
- Di tempat yang aman dari kebakaran/banjir
- Jangan pernah foto atau ketik di HP/komputer

## Best Practices

- Beli hardware wallet langsung dari website resmi produsen, bukan marketplace
- Periksa kemasan tidak ada tanda pembukaan
- Selalu update firmware
- Verifikasi alamat penerima di layar device saat transaksi

## Untuk Jumlah Kecil

Jika kamu baru mulai dengan jumlah kecil, mobile wallet seperti Muun atau Blue Wallet sudah cukup. Tapi begitu nilainya signifikan — investasikan di hardware wallet.`,
    author: "Andi Wijaya", date: "12 Apr 2025",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
    catColor: "#a78bfa",
  },
  {
    id: 5, category: "Sejarah", readTime: "10 mnt",
    title: "Sejarah Bitcoin: Dari Whitepaper Satoshi ke $100K",
    excerpt: "Perjalanan Bitcoin dari anonimitas Satoshi Nakamoto hingga menjadi aset senilai triliunan dolar.",
    content: `Sejarah Bitcoin adalah salah satu kisah paling luar biasa dalam dunia teknologi dan keuangan modern.

## 2008 — Lahirnya Ide

Di tengah krisis finansial global, seseorang (atau sekelompok orang) dengan nama samaran Satoshi Nakamoto mempublikasikan whitepaper "Bitcoin: A Peer-to-Peer Electronic Cash System" pada 31 Oktober 2008. Whitepaper ini menawarkan solusi untuk double-spending problem tanpa membutuhkan pihak ketiga terpercaya.

## 2009 — Genesis Block

Pada 3 Januari 2009, Satoshi menambang blok pertama Bitcoin (Genesis Block). Tersembunyi dalam blok ini adalah pesan: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks" — sebuah kritik pedas terhadap sistem keuangan konvensional.

## 2010 — Pizza Bitcoin Pertama

22 Mei 2010: Laszlo Hanyecz membeli 2 pizza dengan 10.000 BTC — transaksi komersial Bitcoin pertama. Kini 22 Mei diperingati sebagai "Bitcoin Pizza Day". Harga 10.000 BTC hari ini: lebih dari $1 miliar.

## 2013-2017 — Dari Niche ke Mainstream

Bitcoin mulai dikenal luas. Harga menembus $1.000 untuk pertama kalinya pada 2013, kemudian mencapai $20.000 pada akhir 2017 di tengah demam ICO dan altcoin.

## 2020-2021 — Institutional Adoption

MicroStrategy, Tesla, Square mulai membeli Bitcoin sebagai cadangan kas. ETF Bitcoin mulai diajukan ke SEC. Harga menembus $69.000 pada November 2021.

## 2024 — ETF & Halving

Januari 2024: SEC menyetujui Bitcoin Spot ETF pertama di AS, membuka pintu triliunan dolar institutional money. April 2024: Halving keempat terjadi, reward miner turun dari 6.25 ke 3.125 BTC. Akhir 2024: Bitcoin menembus $100.000 untuk pertama kalinya.`,
    author: "Maya Santoso", date: "10 Apr 2025",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80",
    catColor: "#fb923c",
  },
  {
    id: 6, category: "Mining", readTime: "9 mnt",
    title: "Bitcoin Mining: Cara Kerja dan Masih Menguntungkan?",
    excerpt: "Mining Bitcoin adalah proses validasi transaksi. Ketahui cara kerjanya dan apakah masih worth it di 2025.",
    content: `Bitcoin mining adalah proses memvalidasi transaksi dan menambahkan blok baru ke blockchain dengan imbalan Bitcoin baru.

## Bagaimana Mining Bekerja?

Miner menggunakan hardware khusus (ASIC) untuk memecahkan teka-teki matematika yang disebut hash puzzle. Siapa pertama yang menemukan solusinya mendapat reward: saat ini 3.125 BTC per blok + biaya transaksi.

## Proof of Work

Algoritma PoW memastikan bahwa untuk memanipulasi blockchain, seseorang harus menguasai lebih dari 50% total hashrate jaringan — yang secara ekonomi tidak masuk akal karena biayanya jauh melebihi keuntungan.

## Hardware Mining

Dulu Bitcoin bisa ditambang dengan CPU laptop biasa. Kini dibutuhkan ASIC (Application-Specific Integrated Circuit) seperti Antminer S21 atau Whatsminer M60S yang harganya bisa mencapai puluhan juta rupiah per unit.

## Apakah Masih Menguntungkan di 2025?

Ini tergantung banyak faktor:
- **Harga listrik**: Mining menguntungkan jika biaya listrik rendah (<$0.05/kWh ideal)
- **Harga Bitcoin**: Semakin tinggi harga BTC, semakin menguntungkan
- **Difficulty**: Setiap ~2 minggu disesuaikan berdasarkan total hashrate
- **Hardware**: ASIC terbaru jauh lebih efisien per TH/s

## Mining Pool

Solo mining hampir mustahil menguntungkan saat ini. Bergabung dengan mining pool seperti Foundry USA atau Antpool memungkinkan miner kecil mendapat penghasilan konsisten berdasarkan kontribusi hashrate.

## Alternatif: Cloud Mining

Sewa hashrate dari provider cloud mining. Tapi hati-hati — banyak cloud mining yang scam. Riset mendalam sebelum invest.`,
    author: "Fajar Nugroho", date: "8 Apr 2025",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=1200&q=80",
    catColor: "#ef4444",
  },
  {
    id: 7, category: "Teknologi", readTime: "7 mnt",
    title: "Lightning Network: Bitcoin yang Secepat Kilat",
    excerpt: "Layer-2 solution yang membuat transaksi Bitcoin hampir instan dan hampir gratis.",
    content: `Lightning Network adalah protokol layer-2 di atas Bitcoin yang memungkinkan transaksi hampir instan dengan biaya sangat rendah.

## Masalah yang Dipecahkan

Bitcoin mainchain hanya bisa memproses ~7 transaksi per detik, dengan waktu konfirmasi 10 menit dan biaya yang bisa mahal saat jaringan penuh. Lightning Network mengatasi ini dengan payment channel off-chain.

## Cara Kerja

Dua pihak membuka payment channel dengan mengunci sejumlah BTC di blockchain (on-chain). Setelah itu, mereka bisa bertransaksi ribuan kali tanpa menyentuh blockchain — hanya settlement akhir yang on-chain.

## Keunggulan

- Transaksi < 1 detik
- Biaya mendekati nol (satoshi)
- Privacy lebih baik (transaksi tidak on-chain)
- Micropayment menjadi mungkin (bayar Rp 100 untuk baca artikel)

## Adopsi

Lightning Network kini digunakan di El Salvador (Bitcoin legal tender), platform streaming nilai seperti Podcasting 2.0, dan semakin banyak merchant global.`,
    author: "Rizal Hakim", date: "5 Apr 2025",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80",
    catColor: "#06b6d4",
  },
  {
    id: 8, category: "Investasi", readTime: "6 mnt",
    title: "Bitcoin Halving 2024: Dampak ke Harga dan Investor",
    excerpt: "Halving keempat telah terjadi. Apa artinya bagi harga Bitcoin dan strategi investasi?",
    content: `Bitcoin Halving adalah event terjadwal di mana reward mining dipotong 50% setiap 210.000 blok (~4 tahun sekali).

## Halving Keempat — April 2024

Pada 19 April 2024, reward mining turun dari 6.25 BTC menjadi 3.125 BTC per blok. Ini adalah mekanisme deflasioner yang diprogramkan langsung oleh Satoshi Nakamoto ke dalam protokol Bitcoin.

## Pola Historis

- Halving 2012: BTC naik dari $12 ke $1.000+ dalam 12 bulan
- Halving 2016: BTC naik dari $650 ke $20.000 dalam 18 bulan
- Halving 2020: BTC naik dari $8.700 ke $69.000 dalam 18 bulan

## Mengapa Harga Cenderung Naik?

Supply baru Bitcoin berkurang, tapi demand tidak. Secara ekonomi dasar, jika supply turun dan demand tetap atau naik, harga akan naik. Ditambah narasi "digital gold" yang semakin kuat.

## Strategi Post-Halving

- DCA tetap relevan: akumulasi sebelum efek halving terasa penuh
- Jangan FOMO: kenaikan historis terjadi 12-18 bulan setelah halving
- Diversifikasi: jangan taruh semua telur dalam satu keranjang
- HODL: volatilitas jangka pendek adalah noise, tren jangka panjang adalah signal`,
    author: "Dimas Pratama", date: "3 Apr 2025",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=1200&q=80",
    catColor: "#f59e0b",
  },
  {
    id: 9, category: "Pemula", readTime: "5 mnt",
    title: "Cara Beli Bitcoin Pertama di Indonesia (2025)",
    excerpt: "Panduan step-by-step membeli Bitcoin pertama kamu di exchange Indonesia yang terpercaya.",
    content: `Membeli Bitcoin di Indonesia kini semudah transfer bank. Berikut panduan lengkapnya.

## Pilih Exchange Terpercaya

Exchange kripto di Indonesia yang diawasi Bappebti:
- **Indodax** — exchange terbesar, likuiditas tinggi
- **Tokocrypto** — antarmuka modern, cocok pemula
- **Pintu** — desain sederhana, ideal untuk first-timer

## Langkah-langkah

**1. Daftar dan Verifikasi KYC**
Buat akun, upload foto KTP + selfie. Proses verifikasi biasanya 1-24 jam.

**2. Deposit Rupiah**
Transfer IDR via bank, virtual account, atau dompet digital. Minimal deposit bervariasi, ada yang mulai Rp 10.000.

**3. Beli Bitcoin**
Pilih menu "Beli", pilih BTC, masukkan nominal IDR yang ingin dibelikan. Kamu tidak perlu beli 1 BTC penuh — bisa mulai dari Rp 50.000.

**4. Keamanan Akun**
Aktifkan 2FA (Google Authenticator), gunakan password kuat, jangan share informasi login.

## Tips untuk Pemula

- Mulai kecil untuk belajar cara kerja sistem
- Jangan invest uang yang tidak mampu kamu rugi
- Pelajari cara withdraw ke wallet pribadi untuk keamanan jangka panjang
- Follow update regulasi Bappebti`,
    author: "Maya Santoso", date: "1 Apr 2025",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80",
    catColor: "#22c55e",
  },
];

export const MODULES = [
  {
    id: 1,
    num: "01", icon: "₿", title: "Apa Itu Bitcoin?",
    desc: "Pengenalan dasar Bitcoin sebagai mata uang digital terdesentralisasi pertama di dunia.",
    longDesc: "Modul pertama ini membahas fondasi Bitcoin secara menyeluruh — dari sejarahnya, cara kerjanya, hingga mengapa Bitcoin berbeda dari semua sistem uang yang pernah ada sebelumnya.",
    lessons: [
      { title: "Sejarah uang digital", dur: "8 mnt", done: true },
      { title: "Satoshi Nakamoto & whitepaper", dur: "10 mnt", done: true },
      { title: "Cara kerja BTC", dur: "7 mnt", done: true },
      { title: "Kelebihan vs uang fiat", dur: "5 mnt", done: true },
    ],
    dur: "30 mnt", level: "Pemula", done: true,
    accent: "#f59e0b", levelColor: "#22c55e",
  },
  {
    id: 2,
    num: "02", icon: "🔗", title: "Teknologi Blockchain",
    desc: "Memahami ledger terdesentralisasi yang menopang seluruh ekosistem Bitcoin.",
    longDesc: "Blockchain adalah inovasi teknis paling penting dekade ini. Modul ini membedah cara kerja blockchain dari level konseptual hingga teknis, lengkap dengan contoh nyata.",
    lessons: [
      { title: "Apa itu blockchain", dur: "10 mnt", done: true },
      { title: "Blok dan rantai", dur: "12 mnt", done: true },
      { title: "Konsensus Proof of Work", dur: "13 mnt", done: true },
      { title: "Hash & kriptografi", dur: "10 mnt", done: true },
    ],
    dur: "45 mnt", level: "Pemula", done: true,
    accent: "#06b6d4", levelColor: "#22c55e",
  },
  {
    id: 3,
    num: "03", icon: "👜", title: "Wallet & Kunci Privat",
    desc: "Cara menyimpan, mengirim, dan menerima Bitcoin dengan aman dari ancaman.",
    longDesc: "Keamanan adalah prioritas utama dalam Bitcoin. Modul ini mengajarkan cara mengelola kunci privat, memilih jenis wallet yang tepat, dan praktik keamanan terbaik.",
    lessons: [
      { title: "Hot wallet vs cold wallet", dur: "10 mnt", done: false },
      { title: "Public & private key", dur: "12 mnt", done: false },
      { title: "Seed phrase & backup", dur: "10 mnt", done: false },
      { title: "Keamanan wallet", dur: "8 mnt", done: false },
    ],
    dur: "40 mnt", level: "Menengah", done: false,
    accent: "#a78bfa", levelColor: "#f59e0b",
  },
  {
    id: 4,
    num: "04", icon: "⛏️", title: "Mining Bitcoin",
    desc: "Proses validasi transaksi dan penciptaan Bitcoin baru melalui komputasi.",
    longDesc: "Mining adalah jantung dari jaringan Bitcoin. Pelajari bagaimana proses ini menjaga keamanan jaringan, siapa yang bisa jadi miner, dan apakah masih menguntungkan.",
    lessons: [
      { title: "Proof of Work detail", dur: "14 mnt", done: false },
      { title: "Hash rate & difficulty", dur: "13 mnt", done: false },
      { title: "Block reward & halving", dur: "13 mnt", done: false },
      { title: "Mining pool strategi", dur: "10 mnt", done: false },
    ],
    dur: "50 mnt", level: "Menengah", done: false,
    accent: "#fb923c", levelColor: "#f59e0b",
  },
  {
    id: 5,
    num: "05", icon: "💱", title: "Beli & Jual Bitcoin",
    desc: "Panduan praktis membeli Bitcoin pertama kamu di Indonesia dengan aman.",
    longDesc: "Dari daftar akun hingga transaksi pertama, modul ini adalah panduan praktis lengkap untuk membeli dan menjual Bitcoin di exchange Indonesia.",
    lessons: [
      { title: "CEX vs DEX", dur: "8 mnt", done: false },
      { title: "Exchange terpercaya Indonesia", dur: "10 mnt", done: false },
      { title: "KYC & verifikasi", dur: "7 mnt", done: false },
      { title: "Cara deposit IDR", dur: "10 mnt", done: false },
    ],
    dur: "35 mnt", level: "Pemula", done: false,
    accent: "#22c55e", levelColor: "#22c55e",
  },
  {
    id: 6,
    num: "06", icon: "📊", title: "Analisis Teknikal",
    desc: "Membaca grafik harga dan indikator teknikal untuk keputusan lebih cerdas.",
    longDesc: "Analisis teknikal adalah seni membaca grafik untuk memprediksi pergerakan harga. Modul advanced ini cocok untuk yang sudah memahami dasar-dasar Bitcoin.",
    lessons: [
      { title: "Candlestick chart", dur: "22 mnt", done: false },
      { title: "Support & resistance", dur: "20 mnt", done: false },
      { title: "Moving Average", dur: "24 mnt", done: false },
      { title: "RSI & MACD", dur: "24 mnt", done: false },
    ],
    dur: "90 mnt", level: "Lanjutan", done: false,
    accent: "#ec4899", levelColor: "#ef4444",
  },
];
