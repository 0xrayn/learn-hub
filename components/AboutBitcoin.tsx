"use client";
import { useState } from "react";
import { Cpu, Link2, BarChart2, Globe, ArrowRight } from "lucide-react";

const TOPICS = [
  {
    icon: Globe,
    tag: "01",
    title: "Apa itu Bitcoin?",
    short: "Mata uang digital terdesentralisasi pertama",
    content: [
      "Bitcoin adalah mata uang digital terdesentralisasi yang lahir pada 2009 dari whitepaper Satoshi Nakamoto. Tidak ada bank, pemerintah, atau entitas tunggal yang mengontrolnya.",
      "Supply Bitcoin dibatasi keras hanya 21 juta koin. Kelangkaan ini mirip emas. Per 2024, sekitar 19.7 juta sudah ditambang, tersisa hanya ~1.3 juta lagi.",
      "Bitcoin bisa dibagi hingga 8 desimal (0.00000001 BTC = 1 Satoshi). Kamu bisa mulai dengan nominal sangat kecil, bahkan Rp 50.000 sekalipun.",
    ],
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
  {
    icon: Link2,
    tag: "02",
    title: "Cara Kerja Blockchain",
    short: "Buku besar digital yang transparan & aman",
    content: [
      "Blockchain adalah struktur data dimana setiap blok berisi transaksi yang di-hash bersama. Hash setiap blok menyertakan hash blok sebelumnya — menciptakan rantai yang tidak bisa diputus.",
      "Ketika kamu kirim Bitcoin, transaksimu disiarkan ke ribuan node. Miner bersaing memecahkan puzzle kriptografi untuk memvalidasi transaksi — proses ini terjadi setiap ~10 menit.",
      "Setelah masuk blockchain, transaksi permanen. Untuk hack satu blok, penyerang harus mengontrol >50% daya komputasi jaringan — secara ekonomi mustahil.",
    ],
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/30",
  },
  {
    icon: BarChart2,
    tag: "03",
    title: "Kenapa Harga Naik Turun?",
    short: "Supply, demand, dan sentimen pasar global",
    content: [
      "Bitcoin sangat volatile karena pasar masih relatif kecil. Supply terbatas 21 juta + demand berubah = harga bergerak liar. Ini ciri khas aset early-stage.",
      "Faktor utama: regulasi pemerintah, adopsi institusional (BlackRock ETF), halving events, kondisi makroekonomi global, dan sentimen pasar (fear & greed).",
      "Meskipun volatile jangka pendek, Bitcoin memiliki track record long-term yang kuat: dari $0.001 di 2010 ke $73.000+ di ATH 2024.",
    ],
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
  {
    icon: Cpu,
    tag: "04",
    title: "Mining & Halving",
    short: "Mekanisme deflasi yang membuat BTC langka",
    content: [
      "Mining adalah proses kompetitif dimana ribuan komputer bersaing memecahkan puzzle SHA-256. Pemenang mendapat reward Bitcoin. Hashrate jaringan kini mencapai 600+ EH/s.",
      "Halving terjadi setiap 210.000 blok (~4 tahun) dan memotong reward 50%. Halving ke-4 terjadi April 2024: reward turun dari 6.25 BTC → 3.125 BTC per blok.",
      "Pola historis: setiap halving selalu diikuti bull market besar dalam 12-18 bulan. Pasokan baru berkurang 50%, tapi demand tidak — hukum supply & demand bekerja.",
    ],
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
  },
];

const BLOCK_HASHES = ["0000...a04e", "b7d3...91c2", "c1e8...3d47", "f924...8b01"];
const BLOCKS = [
  { label: "Genesis Block", num: "#0", genesis: true },
  { label: "Block #891,240", num: "#240", genesis: false },
  { label: "Block #891,241", num: "#241", genesis: false },
  { label: "Block #891,242", num: "#242", genesis: false },
];

export default function AboutBitcoin() {
  const [active, setActive] = useState(0);
  const topic = TOPICS[active];

  return (
    <section id="tentang" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-base-content/8 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="pill mb-5 inline-flex">
            <Globe size={10} />
            Modul Edukasi
          </span>
          <h2 className="font-display font-black text-base-content mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}>
            Belajar <span className="text-gradient">Bitcoin</span> Step by Step
          </h2>
          <p className="text-base-content/50 text-base sm:text-lg max-w-xl mx-auto">
            4 modul fundamental yang wajib kamu pahami sebelum masuk ke dunia kripto.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Sidebar tabs */}
          <div className="lg:col-span-2 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scroll-x">
            {TOPICS.map((t, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 flex-shrink-0 w-72 sm:w-auto lg:w-auto ${
                  active === i
                    ? `${t.bgColor} ${t.borderColor} shadow-lg`
                    : "border-base-content/8 hover:border-base-content/18 hover:bg-base-content/4"
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active === i ? t.bgColor : "bg-base-content/6"}`}>
                  <t.icon size={18} className={active === i ? t.color : "text-base-content/40"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] font-mono-code font-bold uppercase tracking-wider mb-0.5 ${active === i ? t.color : "text-base-content/35"}`}>
                    {t.tag}
                  </div>
                  <div className={`font-semibold text-sm leading-snug ${active === i ? "text-base-content" : "text-base-content/65"}`}>
                    {t.title}
                  </div>
                  <div className="text-xs text-base-content/35 mt-0.5 truncate">{t.short}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="lg:col-span-3 space-y-5">
            <div className={`glass-static p-6 sm:p-8 border ${topic.borderColor}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${topic.bgColor} flex-shrink-0`}>
                  <topic.icon size={22} className={topic.color} />
                </div>
                <div>
                  <div className={`text-[10px] font-mono-code font-bold uppercase tracking-wider ${topic.color} mb-1`}>
                    Modul {topic.tag}
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-base-content" style={{ letterSpacing: "-0.01em" }}>
                    {topic.title}
                  </h3>
                  <p className="text-base-content/50 text-sm mt-1">{topic.short}</p>
                </div>
              </div>

              <div className="space-y-4">
                {topic.content.map((para, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`w-1 rounded-full flex-shrink-0 mt-1 ${topic.bgColor}`} style={{ minHeight: "1.25rem" }} />
                    <p className="text-base-content/70 text-sm sm:text-base leading-relaxed">{para}</p>
                  </div>
                ))}
              </div>

              <a href="#artikel" className={`inline-flex items-center gap-2 mt-6 text-sm font-semibold ${topic.color} hover:gap-3 transition-all`}>
                Baca Artikel Lengkap <ArrowRight size={14} />
              </a>
            </div>

            {/* Blockchain visual */}
            {active === 1 && (
              <div className="glass-static p-5 overflow-x-auto scroll-x">
                <p className="text-[9px] font-mono-code uppercase tracking-[0.18em] text-base-content/30 mb-4">// Blockchain Structure</p>
                <div className="flex items-center gap-0 min-w-max">
                  {BLOCKS.map((block, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`block-node p-3 text-center ${block.genesis ? "border-primary/40" : ""}`} style={{ minWidth: "120px" }}>
                        <div className="text-lg mb-1">{block.genesis ? "⛓️" : "📦"}</div>
                        <div className="text-[9px] font-mono-code text-base-content/50 font-bold">{block.num}</div>
                        <div className="text-[8px] font-mono-code text-base-content/30 mt-1">{BLOCK_HASHES[i]}</div>
                      </div>
                      {i < BLOCKS.length - 1 && (
                        <div className="block-connector mx-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Halving visual */}
            {active === 3 && (
              <div className="glass-static p-5">
                <p className="text-[9px] font-mono-code uppercase tracking-[0.18em] text-base-content/30 mb-4">// Halving History</p>
                <div className="space-y-3">
                  {[
                    { year: "2009", reward: "50 BTC", width: "100%" },
                    { year: "2012", reward: "25 BTC", width: "50%" },
                    { year: "2016", reward: "12.5 BTC", width: "25%" },
                    { year: "2020", reward: "6.25 BTC", width: "12.5%" },
                    { year: "2024", reward: "3.125 BTC", width: "6.25%", active: true },
                  ].map((h) => (
                    <div key={h.year} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono-code text-base-content/40 w-10 flex-shrink-0">{h.year}</span>
                      <div className="flex-1 h-5 rounded-full bg-base-content/6 overflow-hidden relative">
                        <div className={`h-full rounded-full ${h.active ? "bg-warning" : "bg-primary/60"} transition-all`} style={{ width: h.width }} />
                      </div>
                      <span className={`text-[10px] font-mono-code font-bold w-20 text-right flex-shrink-0 ${h.active ? "text-warning" : "text-base-content/50"}`}>
                        {h.reward}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
