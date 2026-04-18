"use client";

const MODULES = [
  {
    num: "01", icon: "₿", title: "Apa Itu Bitcoin?",
    desc: "Pengenalan dasar Bitcoin sebagai mata uang digital terdesentralisasi pertama di dunia.",
    lessons: ["Sejarah uang digital", "Satoshi Nakamoto & whitepaper", "Cara kerja BTC", "Kelebihan vs uang fiat"],
    dur: "30 mnt", level: "Pemula", done: true,
    accent: "var(--color-primary,#f59e0b)", levelColor: "#22c55e",
  },
  {
    num: "02", icon: "🔗", title: "Teknologi Blockchain",
    desc: "Memahami ledger terdesentralisasi yang menopang seluruh ekosistem Bitcoin.",
    lessons: ["Apa itu blockchain", "Blok dan rantai", "Konsensus Proof of Work", "Hash & kriptografi"],
    dur: "45 mnt", level: "Pemula", done: true,
    accent: "var(--color-secondary,#06b6d4)", levelColor: "#22c55e",
  },
  {
    num: "03", icon: "👜", title: "Wallet & Kunci Privat",
    desc: "Cara menyimpan, mengirim, dan menerima Bitcoin dengan aman dari ancaman.",
    lessons: ["Hot wallet vs cold wallet", "Public & private key", "Seed phrase & backup", "Keamanan wallet"],
    dur: "40 mnt", level: "Menengah", done: false,
    accent: "#a78bfa", levelColor: "#f59e0b",
  },
  {
    num: "04", icon: "⛏️", title: "Mining Bitcoin",
    desc: "Proses validasi transaksi dan penciptaan Bitcoin baru melalui komputasi.",
    lessons: ["Proof of Work detail", "Hash rate & difficulty", "Block reward & halving", "Mining pool strategi"],
    dur: "50 mnt", level: "Menengah", done: false,
    accent: "#fb923c", levelColor: "#f59e0b",
  },
  {
    num: "05", icon: "💱", title: "Beli & Jual Bitcoin",
    desc: "Panduan praktis membeli Bitcoin pertama kamu di Indonesia dengan aman.",
    lessons: ["CEX vs DEX", "Exchange terpercaya Indonesia", "KYC & verifikasi", "Cara deposit IDR"],
    dur: "35 mnt", level: "Pemula", done: false,
    accent: "#22c55e", levelColor: "#22c55e",
  },
  {
    num: "06", icon: "📊", title: "Analisis Teknikal",
    desc: "Membaca grafik harga dan indikator teknikal untuk keputusan lebih cerdas.",
    lessons: ["Candlestick chart", "Support & resistance", "Moving Average", "RSI & MACD"],
    dur: "90 mnt", level: "Lanjutan", done: false,
    accent: "#ec4899", levelColor: "#ef4444",
  },
];

const done = MODULES.filter(m => m.done).length;

export default function EdukasiSection() {
  return (
    <section id="edukasi" className="py-24 px-4 reveal"
      style={{ background: "color-mix(in srgb, var(--bg-page,#050810) 80%, transparent)" }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold glass px-3 py-1 rounded-full border mb-4"
            style={{ color: "#a78bfa", borderColor: "rgba(167,139,250,0.25)" }}>
            🎓 Kurikulum Bitcoin
          </div>
          <h2 className="font-black text-3xl sm:text-4xl mb-3" style={{ color: "var(--text-main,#e8eaf0)" }}>
            Modul <span style={{ color: "#a78bfa" }}>Edukasi</span> Terstruktur
          </h2>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.45, maxWidth: 440, margin: "0 auto" }}>
            Dari nol hingga mahir. Kurikulum disusun secara sistematis.
          </p>
        </div>

        {/* Progress */}
        <div style={{ maxWidth: 480, margin: "0 auto 48px" }}>
          <div className="flex justify-between text-sm mb-2">
            <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.6 }}>Progress Belajar</span>
            <span className="font-mono-styled" style={{ color: "#a78bfa" }}>{done}/{MODULES.length} Selesai</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: `${(done / MODULES.length) * 100}%`,
              background: "linear-gradient(to right, #8b5cf6, #06b6d4)",
              boxShadow: "0 0 10px rgba(139,92,246,0.5)",
              transition: "width 1s ease",
            }} />
          </div>
        </div>

        {/* Module grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((m, i) => (
            <ModuleCard key={i} m={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ m }: { m: typeof MODULES[0] }) {
  return (
    <div
      className="grad-border p-5"
      style={{
        transition: "transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.3), 0 0 0 1px ${m.accent.startsWith("var") ? "rgba(245,158,11,0.2)" : m.accent + "30"}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top */}
      <div className="flex items-start justify-between mb-4">
        <div style={{
          width: 48, height: 48, borderRadius: 12, fontSize: 22,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: m.done ? "rgba(34,197,94,0.12)" : `color-mix(in srgb, ${m.accent.startsWith("var") ? "#f59e0b" : m.accent} 12%, transparent)`,
          border: `1px solid ${m.done ? "rgba(34,197,94,0.25)" : (m.accent.startsWith("var") ? "rgba(245,158,11,0.25)" : m.accent + "30")}`,
        }}>
          {m.done ? "✅" : m.icon}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
            background: `color-mix(in srgb, ${m.levelColor} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${m.levelColor} 30%, transparent)`,
            color: m.levelColor,
          }}>{m.level}</span>
          <span className="font-mono-styled" style={{ fontSize: 10, opacity: 0.3, color: "var(--text-main,#e8eaf0)" }}>{m.num}</span>
        </div>
      </div>

      {/* Title + desc */}
      <h3 className="font-bold text-base leading-snug mb-1.5" style={{ color: "var(--text-main,#e8eaf0)" }}>
        {m.title}
      </h3>
      <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.45, lineHeight: 1.6, marginBottom: 14 }}>
        {m.desc}
      </p>

      {/* Meta */}
      <div className="font-mono-styled flex gap-3 mb-4" style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.3 }}>
        <span>⏱ {m.dur}</span>
        <span>📚 {m.lessons.length} pelajaran</span>
      </div>

      {/* Lessons list — always visible */}
      <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 7 }}>
        {m.lessons.map((l, j) => (
          <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700,
              background: m.done ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
              color: m.done ? "#22c55e" : "rgba(255,255,255,0.3)",
            }}>
              {m.done ? "✓" : j + 1}
            </div>
            <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.55 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* CTA button — standalone, no parent click conflict */}
      <a
        href="#"
        onClick={e => e.preventDefault()}
        style={{
          display: "block", width: "100%", padding: "10px 0", borderRadius: 10,
          textAlign: "center", fontSize: 13, fontWeight: 700, cursor: "pointer",
          textDecoration: "none",
          background: m.done
            ? "rgba(34,197,94,0.08)"
            : `color-mix(in srgb, ${m.accent.startsWith("var") ? "#f59e0b" : m.accent} 10%, transparent)`,
          border: `1px solid ${m.done ? "rgba(34,197,94,0.25)" : (m.accent.startsWith("var") ? "rgba(245,158,11,0.25)" : m.accent + "30")}`,
          color: m.done ? "#22c55e" : (m.accent.startsWith("var") ? "var(--color-primary,#f59e0b)" : m.accent),
          transition: "transform .15s, opacity .15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(0.99)"; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
      >
        {m.done ? "✓ Ulangi Modul" : "Mulai Belajar →"}
      </a>
    </div>
  );
}
