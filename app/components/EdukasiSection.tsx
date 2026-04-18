"use client";
import { useState } from "react";

const MODULES = [
  {
    num: "01", icon: "₿", title: "Apa Itu Bitcoin?",
    desc: "Pengenalan dasar Bitcoin sebagai mata uang digital terdesentralisasi pertama di dunia.",
    lessons: ["Sejarah uang digital", "Satoshi Nakamoto & whitepaper", "Cara kerja BTC", "Kelebihan vs uang fiat"],
    dur: "30 mnt", level: "Pemula", done: true,
    color: "from-amber-400/20 to-orange-400/10", accent: "#f59e0b", border: "border-amber-400/30",
  },
  {
    num: "02", icon: "🔗", title: "Teknologi Blockchain",
    desc: "Memahami ledger terdesentralisasi yang menopang seluruh ekosistem Bitcoin.",
    lessons: ["Apa itu blockchain", "Blok dan rantai", "Konsensus Proof of Work", "Hash & kriptografi"],
    dur: "45 mnt", level: "Pemula", done: true,
    color: "from-cyan-400/20 to-blue-400/10", accent: "#06b6d4", border: "border-cyan-400/30",
  },
  {
    num: "03", icon: "👜", title: "Wallet & Kunci Privat",
    desc: "Cara menyimpan, mengirim, dan menerima Bitcoin dengan aman dari ancaman.",
    lessons: ["Hot wallet vs cold wallet", "Public & private key", "Seed phrase & backup", "Keamanan wallet"],
    dur: "40 mnt", level: "Menengah", done: false,
    color: "from-violet-400/20 to-purple-400/10", accent: "#8b5cf6", border: "border-violet-400/30",
  },
  {
    num: "04", icon: "⛏️", title: "Mining Bitcoin",
    desc: "Proses validasi transaksi dan penciptaan Bitcoin baru melalui komputasi.",
    lessons: ["Proof of Work detail", "Hash rate & difficulty", "Block reward & halving", "Mining pool strategi"],
    dur: "50 mnt", level: "Menengah", done: false,
    color: "from-orange-400/20 to-red-400/10", accent: "#f97316", border: "border-orange-400/30",
  },
  {
    num: "05", icon: "💱", title: "Beli & Jual Bitcoin",
    desc: "Panduan praktis membeli Bitcoin pertama kamu di Indonesia dengan aman.",
    lessons: ["CEX vs DEX", "Exchange terpercaya Indonesia", "KYC & verifikasi", "Cara deposit IDR"],
    dur: "35 mnt", level: "Pemula", done: false,
    color: "from-emerald-400/20 to-green-400/10", accent: "#22c55e", border: "border-emerald-400/30",
  },
  {
    num: "06", icon: "📊", title: "Analisis Teknikal",
    desc: "Membaca grafik harga dan indikator teknikal untuk keputusan lebih cerdas.",
    lessons: ["Candlestick chart", "Support & resistance", "Moving Average", "RSI & MACD"],
    dur: "90 mnt", level: "Lanjutan", done: false,
    color: "from-pink-400/20 to-rose-400/10", accent: "#ec4899", border: "border-pink-400/30",
  },
];

const levelBadge: Record<string, string> = {
  "Pemula":   "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
  "Menengah": "bg-amber-400/15 text-amber-400 border-amber-400/30",
  "Lanjutan": "bg-red-400/15 text-red-400 border-red-400/30",
};

export default function EdukasiSection() {
  const [active, setActive] = useState<number | null>(null);
  const done = MODULES.filter(m => m.done).length;

  return (
    <section id="edukasi" className="py-24 px-4 reveal" style={{ background: 'rgba(5,8,16,0.6)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-400 glass px-3 py-1 rounded-full border border-violet-400/20 mb-4">
            🎓 Kurikulum Bitcoin
          </div>
          <h2 className="font-black text-3xl sm:text-4xl text-white mb-3">
            Modul <span className="text-violet-400">Edukasi</span> Terstruktur
          </h2>
          <p className="text-white/40 max-w-md mx-auto">Dari nol hingga mahir. Kurikulum disusun secara sistematis.</p>
        </div>

        {/* Progress */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/60">Progress Belajar</span>
            <span className="font-mono-styled text-violet-400">{done}/{MODULES.length} Selesai</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(done / MODULES.length) * 100}%`,
                background: 'linear-gradient(to right, #8b5cf6, #06b6d4)',
                boxShadow: '0 0 12px rgba(139,92,246,0.5)',
              }}
            />
          </div>
        </div>

        {/* Modules grid — card layout (no accordion collapse) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m, i) => (
            <div key={i}
              className={`module-card grad-border p-5 cursor-pointer select-none ${m.border}`}
              onClick={() => setActive(active === i ? null : i)}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-2xl border ${m.border}`}>
                  {m.done ? "✅" : m.icon}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${levelBadge[m.level]}`}>
                    {m.level}
                  </span>
                  <span className="text-[10px] text-white/30 font-mono-styled">{m.num}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-white text-base mb-1.5 leading-snug" style={{ color: active === i ? m.accent : undefined }}>
                {m.title}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">{m.desc}</p>

              {/* Meta */}
              <div className="flex gap-3 text-xs text-white/30 font-mono-styled mb-4">
                <span>⏱ {m.dur}</span>
                <span>📚 {m.lessons.length} pelajaran</span>
              </div>

              {/* Lessons list — always visible, no hide */}
              <div className="space-y-1.5 mb-4">
                {m.lessons.map((l, j) => (
                  <div key={j} className="flex items-center gap-2.5 text-xs text-white/50">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: m.done ? `${m.accent}30` : 'rgba(255,255,255,0.05)', color: m.done ? m.accent : 'rgba(255,255,255,0.3)' }}
                    >
                      {m.done ? "✓" : j + 1}
                    </div>
                    {l}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                className="w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: m.done ? 'rgba(34,197,94,0.1)' : `${m.accent}20`,
                  color: m.done ? '#22c55e' : m.accent,
                  border: `1px solid ${m.done ? 'rgba(34,197,94,0.3)' : `${m.accent}40`}`,
                }}
                onClick={e => e.stopPropagation()}
              >
                {m.done ? "✓ Ulangi Modul" : "Mulai Belajar →"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
