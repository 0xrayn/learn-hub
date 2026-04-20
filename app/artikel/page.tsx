"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ARTICLES } from "../lib/data";

const CATS = ["Semua", "Pemula", "Teknologi", "Investasi", "Keamanan", "Sejarah", "Mining"];

export default function ArtikelPage() {
  const [cat, setCat] = useState("Semua");
  const [search, setSearch] = useState("");

  const filtered = ARTICLES.filter(a => {
    const matchCat = cat === "Semua" || a.category === cat;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>

        {/* Page header */}
        <div style={{ padding: "52px 20px 44px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "color-mix(in srgb, var(--color-secondary,#06b6d4) 3%, transparent)" }}>
          <div className="inline-flex items-center gap-2 text-xs font-semibold glass px-3 py-1 rounded-full border mb-4"
            style={{ color: "var(--color-secondary,#06b6d4)", borderColor: "color-mix(in srgb, var(--color-secondary,#06b6d4) 25%, transparent)" }}>
            📝 {ARTICLES.length} Artikel
          </div>
          <h1 className="font-black" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: "var(--text-main,#e8eaf0)", marginBottom: 10, lineHeight: 1.1 }}>
            Baca &amp; <span style={{ color: "var(--color-secondary,#06b6d4)" }}>Pelajari</span>
          </h1>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.45, maxWidth: 440, margin: "0 auto 28px", fontSize: 14 }}>
            Artikel mendalam tentang Bitcoin ditulis oleh pakar kripto Indonesia.
          </p>
          {/* Search */}
          <div style={{ maxWidth: 400, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ opacity: 0.35, color: "var(--text-main,#e8eaf0)", fontSize: 15 }}>🔍</span>
            <input type="text" placeholder="Cari artikel..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", padding: "12px 0", fontSize: 14, color: "var(--text-main,#e8eaf0)" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.35, fontSize: 13, color: "var(--text-main,#e8eaf0)" }}>✕</button>}
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Filter + count */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 32 }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: "7px 15px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: cat === c ? "color-mix(in srgb, var(--color-secondary,#06b6d4) 15%, transparent)" : "transparent",
                color: cat === c ? "var(--color-secondary,#06b6d4)" : "var(--text-main,#e8eaf0)",
                border: cat === c ? "1px solid color-mix(in srgb, var(--color-secondary,#06b6d4) 35%, transparent)" : "1px solid rgba(255,255,255,0.08)",
                opacity: cat === c ? 1 : 0.6, transition: "all .2s",
              }}>
                {c}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.3, fontFamily: "monospace" }}>
              {filtered.length} artikel
            </span>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🔍</div>
              <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, fontSize: 15 }}>Tidak ada artikel yang cocok.</p>
              <button onClick={() => { setCat("Semua"); setSearch(""); }} style={{ marginTop: 16, padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main,#e8eaf0)" }}>Reset filter</button>
            </div>
          )}

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
            {filtered.map(a => (
              <Link key={a.id} href={`/artikel/${a.id}`} style={{ textDecoration: "none" }}>
                <article className="grad-border overflow-hidden" style={{ cursor: "pointer", transition: "transform .3s ease, box-shadow .3s", display: "flex", flexDirection: "column", height: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 18px 44px rgba(0,0,0,0.28), 0 0 0 1px ${a.catColor}25`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div style={{ position: "relative", height: 170, overflow: "hidden", flexShrink: 0 }}>
                    <img src={a.image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s" }} loading="lazy"
                      onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg-card,#0c1120) 0%, transparent 60%)" }} />
                    <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 7, background: `color-mix(in srgb, ${a.catColor} 18%, rgba(0,0,0,0.5))`, border: `1px solid ${a.catColor}45`, color: a.catColor, backdropFilter: "blur(8px)" }}>{a.category}</span>
                    <span style={{ position: "absolute", top: 10, right: 10, fontSize: 10, padding: "3px 9px", borderRadius: 7, color: "rgba(255,255,255,0.65)", background: "rgba(0,0,0,0.42)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}>{a.readTime}</span>
                  </div>
                  <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h2 style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.45, color: "var(--text-main,#e8eaf0)", marginBottom: 7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</h2>
                    <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.42, lineHeight: 1.6, marginBottom: "auto", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.excerpt}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${a.catColor}45, rgba(6,182,212,0.3))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white" }}>{a.author[0]}</div>
                        <span style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.42 }}>{a.author}</span>
                      </div>
                      <span className="font-mono-styled" style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.28 }}>{a.date}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
