"use client";
import { useState } from "react";

const ARTICLES = [
  {
    id: 1, category: "Pemula", readTime: "5 mnt",
    title: "Apa Itu Bitcoin? Panduan Lengkap untuk Pemula",
    excerpt: "Bitcoin adalah mata uang digital pertama yang beroperasi tanpa bank sentral. Pelajari dasar-dasarnya di sini.",
    author: "Rizal Hakim", date: "18 Apr 2025",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&q=80",
    catColor: "#22c55e",
  },
  {
    id: 2, category: "Teknologi", readTime: "8 mnt",
    title: "Memahami Blockchain: Teknologi di Balik Bitcoin",
    excerpt: "Blockchain adalah buku besar digital terdesentralisasi. Inilah cara kerja teknologi revolusioner ini.",
    author: "Sari Dewi", date: "16 Apr 2025",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
    catColor: "#06b6d4",
  },
  {
    id: 3, category: "Investasi", readTime: "6 mnt",
    title: "Dollar Cost Averaging (DCA) Bitcoin: Strategi Terbaik?",
    excerpt: "DCA adalah strategi populer di kalangan HODLer Bitcoin. Cara menerapkannya dengan benar.",
    author: "Dimas Pratama", date: "14 Apr 2025",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    catColor: "#f59e0b",
  },
  {
    id: 4, category: "Keamanan", readTime: "7 mnt",
    title: "Cara Menyimpan Bitcoin dengan Aman: Hardware Wallet",
    excerpt: "Tidak semua wallet Bitcoin sama amannya. Pelajari cara terbaik melindungi aset kripto Anda.",
    author: "Andi Wijaya", date: "12 Apr 2025",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80",
    catColor: "#a78bfa",
  },
  {
    id: 5, category: "Sejarah", readTime: "10 mnt",
    title: "Sejarah Bitcoin: Dari Whitepaper Satoshi ke $100K",
    excerpt: "Perjalanan Bitcoin dari anonimitas Satoshi Nakamoto hingga menjadi aset senilai triliunan dolar.",
    author: "Maya Santoso", date: "10 Apr 2025",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&q=80",
    catColor: "#fb923c",
  },
  {
    id: 6, category: "Mining", readTime: "9 mnt",
    title: "Bitcoin Mining: Cara Kerja dan Masih Menguntungkan?",
    excerpt: "Mining Bitcoin adalah proses validasi transaksi. Ketahui cara kerjanya dan apakah masih worth it di 2025.",
    author: "Fajar Nugroho", date: "8 Apr 2025",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=600&q=80",
    catColor: "#ef4444",
  },
];

const CATS = ["Semua", "Pemula", "Teknologi", "Investasi", "Keamanan", "Sejarah", "Mining"];

export default function ArtikelSection() {
  const [cat, setCat] = useState("Semua");

  const filtered = cat === "Semua" ? ARTICLES : ARTICLES.filter(a => a.category === cat);

  return (
    <section id="artikel" className="py-24 px-4 reveal">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold glass px-3 py-1 rounded-full border mb-4"
            style={{ color: "var(--color-secondary,#06b6d4)", borderColor: "color-mix(in srgb, var(--color-secondary,#06b6d4) 25%, transparent)" }}>
            📝 Artikel Terbaru
          </div>
          <h2 className="font-black text-3xl sm:text-4xl mb-3" style={{ color: "var(--text-main,#e8eaf0)" }}>
            Baca &amp; <span style={{ color: "var(--color-secondary,#06b6d4)" }}>Pelajari</span>
          </h2>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.45, maxWidth: 420, margin: "0 auto" }}>
            Artikel mendalam ditulis oleh pakar kripto Indonesia.
          </p>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 40 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{
                padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: cat === c ? "color-mix(in srgb, var(--color-secondary,#06b6d4) 15%, transparent)" : "transparent",
                color: cat === c ? "var(--color-secondary,#06b6d4)" : "var(--text-main,#e8eaf0)",
                border: cat === c
                  ? "1px solid color-mix(in srgb, var(--color-secondary,#06b6d4) 35%, transparent)"
                  : "1px solid rgba(255,255,255,0.08)",
                opacity: cat === c ? 1 : 0.6,
                transition: "all .2s",
              }}
              onMouseEnter={e => { if (cat !== c) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; } }}
              onMouseLeave={e => { if (cat !== c) { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; } }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <article key={a.id} className="grad-border overflow-hidden"
              style={{
                cursor: "pointer", transition: "transform .3s ease, box-shadow .3s ease",
                display: "flex", flexDirection: "column",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.3), 0 0 0 1px ${a.catColor}30`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Image */}
              <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                <img
                  src={a.image}
                  alt={a.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s ease" }}
                  loading="lazy"
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg-card,#0c1120) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
                {/* Badges */}
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8,
                    background: `color-mix(in srgb, ${a.catColor} 15%, rgba(0,0,0,0.5))`,
                    border: `1px solid ${a.catColor}40`,
                    color: a.catColor,
                    backdropFilter: "blur(8px)",
                  }}>{a.category}</span>
                </div>
                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <span style={{
                    fontSize: 11, padding: "4px 10px", borderRadius: 8, color: "rgba(255,255,255,0.7)",
                    background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>{a.readTime} baca</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{
                  fontWeight: 700, fontSize: 15, lineHeight: 1.45,
                  color: "var(--text-main,#e8eaf0)", marginBottom: 8,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {a.title}
                </h3>
                <p style={{
                  fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.45, lineHeight: 1.6,
                  marginBottom: "auto",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {a.excerpt}
                </p>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: `linear-gradient(135deg, ${a.catColor}40, rgba(6,182,212,0.3))`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "white",
                    }}>{a.author[0]}</div>
                    <span style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.45 }}>{a.author}</span>
                  </div>
                  <span className="font-mono-styled" style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.3 }}>{a.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Lihat semua - working button */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button
            onClick={() => setCat("Semua")}
            style={{
              padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer",
              background: "color-mix(in srgb, var(--color-secondary,#06b6d4) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-secondary,#06b6d4) 30%, transparent)",
              color: "var(--color-secondary,#06b6d4)",
              transition: "all .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-secondary,#06b6d4) 18%, transparent)"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-secondary,#06b6d4) 10%, transparent)"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            Lihat Semua Artikel →
          </button>
        </div>
      </div>
    </section>
  );
}
