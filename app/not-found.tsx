"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const SUGGESTIONS = [
  { href: "/edukasi", label: "📚 Modul Edukasi", desc: "Belajar Bitcoin dari nol" },
  { href: "/artikel", label: "📰 Artikel", desc: "Baca konten edukatif" },
  { href: "/leaderboard", label: "🏆 Leaderboard", desc: "Lihat ranking belajar" },
  { href: "/", label: "🏠 Beranda", desc: "Kembali ke halaman utama" },
];

export default function NotFound() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-main,#0f111a)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .sug-card { transition: background .15s, border-color .15s !important; }
        .sug-card:hover { background: rgba(167,139,250,0.06) !important; border-color: rgba(167,139,250,0.25) !important; }
      `}</style>

      <div style={{ textAlign: "center", maxWidth: 480, animation: "fadeUp .5s ease" }}>
        {/* 404 emoji */}
        <div style={{ fontSize: 80, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🔍</div>

        {/* Code */}
        <div style={{ fontSize: "clamp(4rem, 12vw, 6rem)", fontWeight: 900, color: "transparent", backgroundImage: "linear-gradient(135deg, #a78bfa, #06b6d4)", WebkitBackgroundClip: "text", backgroundClip: "text", lineHeight: 1, marginBottom: 8, letterSpacing: "-0.04em" }}>
          404
        </div>

        <h1 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Halaman Tidak Ditemukan
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.4, lineHeight: 1.7, marginBottom: 32 }}>
          Halaman yang kamu cari tidak ada, sudah dipindah, atau mungkin URL-nya salah ketik{dots}
        </p>

        {/* Suggestions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
          {SUGGESTIONS.map(s => (
            <Link key={s.href} href={s.href} className="sug-card" style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none", textAlign: "left", display: "block" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.35 }}>{s.desc}</div>
            </Link>
          ))}
        </div>

        {/* Back button */}
        <button onClick={() => window.history.back()} style={{ padding: "10px 22px", borderRadius: 11, fontSize: 13, fontWeight: 700, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-main,#e8eaf0)", cursor: "pointer", fontFamily: "inherit" }}>
          ← Kembali
        </button>
      </div>
    </main>
  );
}
