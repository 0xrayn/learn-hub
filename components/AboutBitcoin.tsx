"use client";
import { useState } from "react";
import { Cpu, Link2, BarChart2, Globe, ChevronRight, ExternalLink } from "lucide-react";

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

export default function AboutBitcoin() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = TOPICS[activeIdx];

  return (
    <section id="tentang" className="relative py-28 px-5 sm:px-8 overflow-hidden">
      {/* BG glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,0,45,0.05) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "rgba(232,0,45,0.1)", border: "1px solid rgba(232,0,45,0.25)", color: "#ff4d6d" }}>
            📚 Edukasi
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Semua yang Perlu Kamu
            <span className="gradient-text"> Tahu</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Pelajari Bitcoin dari dasar dengan penjelasan yang mudah dipahami, tanpa jargon berlebihan
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10">
          {/* Tab list */}
          <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {TOPICS.map((t, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                className={`flex-shrink-0 lg:flex-shrink text-left p-4 rounded-2xl transition-all duration-300 ${
                  activeIdx === i ? "red-glow-sm scale-[1.02]" : "hover:bg-white/3"
                }`}
                style={activeIdx === i
                  ? { background: "rgba(232,0,45,0.1)", border: "1px solid rgba(232,0,45,0.35)" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }
                }>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl transition-colors ${
                    activeIdx === i ? "text-white" : "text-white/40"
                  }`}
                    style={{ background: activeIdx === i ? "rgba(232,0,45,0.3)" : "rgba(255,255,255,0.05)" }}>
                    {t.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold tracking-widest mb-0.5"
                      style={{ color: activeIdx === i ? "#e8002d" : "rgba(255,255,255,0.25)" }}>
                      {t.tag}
                    </div>
                    <div className={`font-bold text-sm leading-tight ${activeIdx === i ? "text-white" : "text-white/60"}`}>
                      {t.title}
                    </div>
                    <div className="hidden lg:block text-xs text-white/35 mt-1 leading-relaxed">{t.short}</div>
                  </div>
                  {activeIdx === i && <ChevronRight size={14} className="ml-auto flex-shrink-0 mt-0.5" style={{ color: "#e8002d" }} />}
                </div>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="lg:col-span-3 rounded-3xl p-6 sm:p-8"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(232,0,45,0.2)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl text-white" style={{ background: "rgba(232,0,45,0.25)" }}>
                {active.icon}
              </div>
              <div>
                <div className="text-[10px] font-bold tracking-widest" style={{ color: "#e8002d" }}>
                  {active.tag}
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif" }}
                  className="text-xl font-black text-white">{active.title}</h3>
              </div>
            </div>

            <div className="space-y-4">
              {active.content.map((para, i) => (
                <p key={i} className="text-white/65 leading-relaxed text-sm sm:text-base relative pl-4">
                  <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
                    style={{ background: i === 0 ? "#e8002d" : "rgba(232,0,45,0.4)" }} />
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Blockchain visual */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl sm:text-2xl font-black text-white mb-2">
              Visualisasi Blockchain
            </h3>
            <p className="text-white/40 text-sm">Setiap blok terhubung lewat hash kriptografi</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3">
            {["Genesis Block", "Block #891,240", "Block #891,241", "Block #891,242", "..."].map((label, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3">
                <div className={`rounded-2xl p-3 sm:p-4 text-center transition-all hover:scale-105 cursor-default ${
                  i === 0 ? "red-glow-sm" : ""
                }`}
                  style={{
                    background: i === 0 ? "rgba(232,0,45,0.15)" : "rgba(255,255,255,0.04)",
                    border: i === 0 ? "1px solid rgba(232,0,45,0.4)" : "1px solid rgba(255,255,255,0.1)",
                    minWidth: i === 4 ? "auto" : "100px",
                  }}>
                  {i < 4 ? (
                    <>
                      <div className="text-xl mb-1">{i === 0 ? "⛓️" : "📦"}</div>
                      <div className="text-xs font-bold text-white/80">{label}</div>
                      <div className="text-[9px] font-mono mt-1.5 px-2 py-0.5 rounded-md"
                        style={{ color: "#e8002d", background: "rgba(232,0,45,0.1)" }}>
                        {i === 0 ? "0000...0000" : `a${Math.floor(Math.random() * 1e4).toString(16).padStart(4, "0")}...`}
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl font-bold text-white/30 px-2">···</div>
                  )}
                </div>
                {i < 4 && (
                  <div className="flex items-center gap-0.5">
                    <div className="w-3 sm:w-5 h-px" style={{ background: "rgba(232,0,45,0.5)" }} />
                    <div className="text-xs" style={{ color: "#e8002d" }}>→</div>
                    <div className="w-3 sm:w-5 h-px" style={{ background: "rgba(232,0,45,0.5)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-white/25 mt-4 font-mono">
            // Ubah 1 blok → seluruh rantai invalid → jaringan otomatis menolak
          </p>
        </div>
      </div>
    </section>
  );
}
