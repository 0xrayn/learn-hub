"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchArticles, type Article } from "../lib/supabase-data";

const CATS = ["Semua", "Pemula", "Teknologi", "Investasi", "Keamanan", "Sejarah", "Mining"];
const PER_PAGE = 9;

export default function ArtikelPage() {
  const [cat, setCat] = useState("Semua");
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchArticles().then((data) => { setArticles(data); setLoading(false); });
  }, []);

  // Reset page saat filter/search berubah
  useEffect(() => { setPage(1); }, [cat, search]);

  const filtered = articles.filter((a) => {
    const matchCat = cat === "Semua" || a.category === cat;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const visible = filtered.slice(0, page * PER_PAGE);
  const hasMore = visible.length < filtered.length;

  // Infinite scroll via IntersectionObserver
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasMore) setPage(p => p + 1);
  }, [hasMore]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>
        {/* Page header */}
        <div style={{ padding: "52px 20px 44px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "color-mix(in srgb, var(--color-secondary,#06b6d4) 3%, transparent)" }}>
          <div className="inline-flex items-center gap-2 text-xs font-semibold glass px-3 py-1 rounded-full border mb-4"
            style={{ color: "var(--color-secondary,#06b6d4)", borderColor: "color-mix(in srgb, var(--color-secondary,#06b6d4) 25%, transparent)" }}>
            📝 {loading ? "..." : articles.length} Artikel
          </div>
          <h1 className="font-black" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: "var(--text-main,#e8eaf0)", marginBottom: 10, lineHeight: 1.1 }}>
            Baca &amp; <span style={{ color: "var(--color-secondary,#06b6d4)" }}>Pelajari</span>
          </h1>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.45, maxWidth: 440, margin: "0 auto 28px", fontSize: 14 }}>
            Artikel mendalam tentang Bitcoin ditulis oleh pakar kripto Indonesia.
          </p>
          <div style={{ maxWidth: 400, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ opacity: 0.35, color: "var(--text-main,#e8eaf0)", fontSize: 15 }}>🔍</span>
            <input type="text" placeholder="Cari artikel..." value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", padding: "12px 0", fontSize: 14, color: "var(--text-main,#e8eaf0)" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.35, fontSize: 13, color: "var(--text-main,#e8eaf0)" }}>✕</button>}
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 20px 80px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 32 }}>
            {CATS.map((c) => (
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
            <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.35, color: "var(--text-main,#e8eaf0)" }}>
              {filtered.length} artikel
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(6,182,212,0.15)", borderTop: "2px solid #06b6d4", margin: "0 auto 14px", animation: "spin 0.7s linear infinite" }} />
              <p style={{ opacity: 0.3, fontSize: 13, color: "var(--text-main,#e8eaf0)" }}>Memuat artikel...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", opacity: 0.3 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ color: "var(--text-main,#e8eaf0)" }}>Tidak ada artikel yang cocok.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
              {visible.map((a) => (
                <Link key={a.id} href={`/artikel/${a.id}`} style={{ textDecoration: "none" }}>
                  <div className="grad-border" style={{ overflow: "hidden", transition: "transform .2s", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
                    <div style={{ height: 180, background: "#111", overflow: "hidden" }}>
                      <img src={a.image} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                    </div>
                    <div style={{ padding: "18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: `${a.catColor}18`, color: a.catColor, border: `1px solid ${a.catColor}30` }}>{a.category}</span>
                        <span style={{ fontSize: 11, opacity: 0.35, color: "var(--text-main,#e8eaf0)", marginLeft: "auto" }}>⏱ {a.readTime}</span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 8, lineHeight: 1.4 }}>{a.title}</h3>
                      <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.6, marginBottom: 14 }}>{a.excerpt}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, opacity: 0.35, color: "var(--text-main,#e8eaf0)" }}>{a.author} · {a.date}</span>
                        <span style={{ fontSize: 11, color: "var(--color-secondary,#06b6d4)", fontWeight: 600 }}>Baca →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loaderRef} style={{ textAlign: "center", padding: "32px 0" }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: "2px solid rgba(6,182,212,0.15)", borderTop: "2px solid #06b6d4", margin: "0 auto", animation: "spin 0.7s linear infinite" }} />
            </div>
          )}

          {!hasMore && filtered.length > PER_PAGE && (
            <div style={{ textAlign: "center", padding: "24px 0", fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.3 }}>
              Semua {filtered.length} artikel sudah ditampilkan
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
