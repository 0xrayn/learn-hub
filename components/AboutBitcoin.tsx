"use client";
import { useState, useMemo } from "react";
import { Cpu, Link2, BarChart2, Globe, ChevronRight } from "lucide-react";

// Static hashes to avoid hydration mismatch (no Math.random() at render time)
const BLOCK_HASHES = ["0000...0000", "a04ec...f2b1", "b7d3a...91c2", "c1e88...3d47"];

const TOPICS = [
  {
    icon: <Globe size={20} />,
    tag: "01",
    title: "Apa itu Bitcoin?",
    short: "Mata uang digital terdesentralisasi pertama di dunia",
    content: [
      "Bitcoin adalah mata uang digital terdesentralisasi yang lahir pada 2009 dari whitepaper Satoshi Nakamoto. Tidak ada bank, pemerintah, atau entitas tunggal yang mengontrolnya — Bitcoin berjalan di atas jaringan peer-to-peer global.",
      "Supply Bitcoin dibatasi keras hanya 21 juta koin. Kelangkaan ini — mirip emas — adalah inti dari proposisi nilai Bitcoin. Per 2024, sekitar 19.7 juta sudah ditambang, tersisa hanya ~1.3 juta lagi.",
      "Bitcoin bisa dibagi hingga 8 desimal (0.00000001 BTC = 1 Satoshi). Artinya kamu bisa mulai dengan nominal sangat kecil, bahkan Rp 50.000 sekalipun.",
    ],
  },
  {
    icon: <Link2 size={20} />,
    tag: "02",
    title: "Cara Kerja Blockchain",
    short: "Buku besar digital yang transparan & tak bisa dimanipulasi",
    content: [
      "Blockchain adalah struktur data dimana setiap 'blok' berisi sekumpulan transaksi yang di-hash bersama. Hash setiap blok menyertakan hash blok sebelumnya — menciptakan rantai yang tidak bisa diputus tanpa merusak seluruh rantai.",
      "Ketika kamu kirim Bitcoin, transaksimu disiarkan ke ribuan node di seluruh dunia. Miner bersaing memecahkan puzzle kriptografi (Proof of Work) untuk memvalidasi transaksi dan menambahkan blok baru — proses ini terjadi setiap ~10 menit.",
      "Setelah masuk blockchain, transaksi permanen dan tidak bisa diubah. Untuk 'hack' satu blok, penyerang harus mengubah semua blok setelahnya dan mengontrol >50% dari seluruh daya komputasi jaringan — secara ekonomi mustahil.",
    ],
  },
  {
    icon: <BarChart2 size={20} />,
    tag: "03",
    title: "Kenapa Harga Naik Turun?",
    short: "Supply, demand, dan sentimen pasar global",
    content: [
      "Bitcoin sangat volatile karena pasar masih relatif kecil dibanding aset tradisional. Supply terbatas 21 juta + demand yang berubah = harga yang bergerak liar. Ini adalah ciri khas aset early-stage.",
      "Faktor utama: regulasi pemerintah (China ban = harga drop), adopsi institusional (BlackRock ETF approval = harga naik), halving events, kondisi makroekonomi global (inflasi, suku bunga), dan sentimen pasar (fear & greed).",
      "Meskipun volatile jangka pendek, Bitcoin memiliki track record long-term yang kuat: dari $0.001 di 2010 ke $73.000+ di ATH 2024. Investor jangka panjang yang 'HODL' biasanya menang.",
    ],
  },
  {
    icon: <Cpu size={20} />,
    tag: "04",
    title: "Mining & Halving",
    short: "Mekanisme deflasi yang membuat Bitcoin semakin langka",
    content: [
      "Mining adalah proses kompetitif dimana ribuan komputer bersaing memecahkan puzzle matematika SHA-256. Pemenang mendapat hak menambahkan blok baru dan menerima reward Bitcoin. Total daya komputasi jaringan (hashrate) kini mencapai 600+ EH/s.",
      "Halving terjadi setiap 210.000 blok (~4 tahun) dan memotong reward miner 50%. Halving ke-4 terjadi April 2024: reward turun dari 6.25 BTC → 3.125 BTC per blok. Halving terakhir (ke-33) akan terjadi sekitar 2140, dimana semua 21 juta BTC sudah beredar.",
      "Pola historis: setiap halving selalu diikuti bull market besar dalam 12-18 bulan. Alasannya sederhana: pasokan baru berkurang 50%, tapi demand (idealnya) tidak. Hukum supply & demand berkerja.",
    ],
  },
];

const BLOCKS = [
  { label: "Genesis Block", emoji: "⛓️" },
  { label: "Block #891,240", emoji: "📦" },
  { label: "Block #891,241", emoji: "📦" },
  { label: "Block #891,242", emoji: "📦" },
];

export default function AboutBitcoin() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = TOPICS[activeIdx];

  return (
    <section id="tentang" className="relative py-28 px-5 sm:px-8 overflow-hidden">
      {/* BG glow */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(var(--p)/0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5 text-primary"
            style={{ background: "oklch(var(--p)/0.1)", border: "1px solid oklch(var(--p)/0.25)" }}
          >
            📚 Edukasi
          </div>
          <h2
            style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-base-content mb-4"
          >
            Semua yang Perlu Kamu
            <span className="gradient-text"> Tahu</span>
          </h2>
          <p className="text-base-content/50 max-w-xl mx-auto">
            Pelajari Bitcoin dari dasar dengan penjelasan yang mudah dipahami, tanpa jargon berlebihan
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10">
          {/* Tab list */}
          <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TOPICS.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`flex-shrink-0 lg:flex-shrink text-left p-4 rounded-2xl transition-all duration-300 ${
                  activeIdx === i ? "red-glow-sm scale-[1.02]" : "hover:bg-base-content/5"
                }`}
                style={
                  activeIdx === i
                    ? { background: "oklch(var(--p)/0.1)", border: "1px solid oklch(var(--p)/0.35)" }
                    : { background: "oklch(var(--b2)/0.5)", border: "1px solid oklch(var(--b3)/0.5)" }
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl transition-colors ${activeIdx === i ? "text-primary-content" : "text-base-content/40"}`}
                    style={{ background: activeIdx === i ? "oklch(var(--p)/0.3)" : "oklch(var(--b3)/0.5)" }}
                  >
                    {t.icon}
                  </div>
                  <div className="min-w-0">
                    <div
                      className="text-[10px] font-bold tracking-widest mb-0.5"
                      style={{ color: activeIdx === i ? "oklch(var(--p))" : "oklch(var(--bc)/0.25)" }}
                    >
                      {t.tag}
                    </div>
                    <div className={`font-bold text-sm leading-tight ${activeIdx === i ? "text-base-content" : "text-base-content/60"}`}>
                      {t.title}
                    </div>
                    <div className="hidden lg:block text-xs text-base-content/35 mt-1 leading-relaxed">{t.short}</div>
                  </div>
                  {activeIdx === i && <ChevronRight size={14} className="ml-auto flex-shrink-0 mt-0.5 text-primary" />}
                </div>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div
            className="lg:col-span-3 rounded-3xl p-6 sm:p-8"
            style={{ background: "oklch(var(--b2)/0.5)", border: "1px solid oklch(var(--p)/0.2)" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl text-primary-content" style={{ background: "oklch(var(--p)/0.25)" }}>
                {active.icon}
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-widest text-primary">{active.tag}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-black text-base-content">
                  {active.title}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {active.content.map((para, i) => (
                <p key={i} className="text-base-content/65 leading-relaxed text-sm sm:text-base relative pl-4">
                  <span
                    className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
                    style={{ background: i === 0 ? "oklch(var(--p))" : "oklch(var(--p)/0.4)" }}
                  />
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Blockchain visual */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl sm:text-2xl font-black text-base-content mb-2">
              Visualisasi Blockchain
            </h3>
            <p className="text-base-content/40 text-sm">Setiap blok terhubung lewat hash kriptografi</p>
          </div>

          {/* Responsive: scroll horizontally on mobile */}
          <div className="overflow-x-auto pb-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-max mx-auto w-fit px-4">
              {BLOCKS.map(({ label, emoji }, i) => (
                <div key={i} className="flex items-center gap-2 sm:gap-3">
                  <div
                    className={`rounded-2xl p-3 sm:p-4 text-center transition-all hover:scale-105 cursor-default w-[100px] sm:w-[110px] ${
                      i === 0 ? "red-glow-sm" : ""
                    }`}
                    style={{
                      background: i === 0 ? "oklch(var(--p)/0.15)" : "oklch(var(--b2)/0.5)",
                      border: i === 0 ? "1px solid oklch(var(--p)/0.4)" : "1px solid oklch(var(--b3)/0.5)",
                    }}
                  >
                    <div className="text-xl mb-1">{emoji}</div>
                    <div className="text-xs font-bold text-base-content/80">{label}</div>
                    {/* Static hash — no Math.random() to avoid hydration mismatch */}
                    <div
                      className="text-[9px] font-mono mt-1.5 px-2 py-0.5 rounded-md text-primary"
                      style={{ background: "oklch(var(--p)/0.1)" }}
                    >
                      {BLOCK_HASHES[i]}
                    </div>
                  </div>
                  {/* Arrow connector */}
                  <div className="flex items-center gap-0.5">
                    <div className="w-3 sm:w-5 h-px bg-primary/50" />
                    <div className="text-xs text-primary">→</div>
                    <div className="w-3 sm:w-5 h-px bg-primary/50" />
                  </div>
                </div>
              ))}
              {/* "..." last block */}
              <div
                className="rounded-2xl p-3 sm:p-4 text-center"
                style={{
                  background: "oklch(var(--b2)/0.5)",
                  border: "1px solid oklch(var(--b3)/0.5)",
                }}
              >
                <div className="text-2xl font-bold text-base-content/30 px-2">···</div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-base-content/25 mt-4 font-mono">
            // Ubah 1 blok → seluruh rantai invalid → jaringan otomatis menolak
          </p>
        </div>
      </div>
    </section>
  );
}
