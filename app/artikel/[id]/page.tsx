"use client";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ARTICLES } from "../../lib/data";

export default function ArtikelDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const article = ARTICLES.find(a => a.id === Number(id));
  if (!article) notFound();

  const related = ARTICLES.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
  const others = related.length < 3
    ? [...related, ...ARTICLES.filter(a => a.id !== article.id && a.category !== article.category).slice(0, 3 - related.length)]
    : related;

  const renderContent = (text: string) => {
    return text.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} style={{
            fontSize: "clamp(1.1rem,2vw,1.35rem)", fontWeight: 800,
            color: "var(--text-main,#e8eaf0)", margin: "32px 0 12px",
            paddingLeft: 14, borderLeft: `3px solid ${article.catColor}`,
          }}>{block.replace("## ", "")}</h2>
        );
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter(l => l.startsWith("- "));
        return (
          <ul key={i} style={{ margin: "12px 0 16px", padding: 0, listStyle: "none" }}>
            {items.map((item, j) => (
              <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15, color: "var(--text-main,#e8eaf0)", opacity: 0.75, lineHeight: 1.7, marginBottom: 6 }}>
                <span style={{ color: article.catColor, flexShrink: 0, marginTop: 2 }}>▸</span>
                <span>{item.replace("- ", "")}</span>
              </li>
            ))}
          </ul>
        );
      }
      const withBold = block.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={j} style={{ color: "var(--text-main,#e8eaf0)", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return (
        <p key={i} style={{ fontSize: 15, color: "var(--text-main,#e8eaf0)", opacity: 0.72, lineHeight: 1.85, margin: "0 0 16px" }}>{withBold}</p>
      );
    });
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>

        {/* Hero image */}
        <div style={{ position: "relative", height: "clamp(220px,38vw,400px)", overflow: "hidden" }}>
          <img src={article.image} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--bg-page,#050810) 18%, rgba(0,0,0,0.45) 55%, transparent 100%)" }} />
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px 80px" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "20px 0 24px", fontSize: 12, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, textDecoration: "none" }}>Beranda</Link>
            <span style={{ opacity: 0.2, color: "var(--text-main,#e8eaf0)" }}>›</span>
            <Link href="/artikel" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, textDecoration: "none" }}>Artikel</Link>
            <span style={{ opacity: 0.2, color: "var(--text-main,#e8eaf0)" }}>›</span>
            <span style={{ color: article.catColor, fontWeight: 600 }}>{article.category}</span>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 8, background: `color-mix(in srgb, ${article.catColor} 15%, rgba(0,0,0,0.4))`, border: `1px solid ${article.catColor}50`, color: article.catColor }}>{article.category}</span>
            <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 8, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>⏱ {article.readTime} baca</span>
          </div>

          {/* Title */}
          <h1 className="font-black" style={{ fontSize: "clamp(1.55rem,3.8vw,2.3rem)", color: "var(--text-main,#e8eaf0)", lineHeight: 1.2, marginBottom: 20 }}>{article.title}</h1>

          {/* Author meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${article.catColor}60, rgba(6,182,212,0.3))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "white", flexShrink: 0 }}>{article.author[0]}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-main,#e8eaf0)" }}>{article.author}</div>
              <div className="font-mono-styled" style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)" }}>{article.date}</div>
            </div>
          </div>

          {/* Body */}
          <div style={{ marginBottom: 48 }}>{renderContent(article.content)}</div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: 12, opacity: 0.35, color: "var(--text-main,#e8eaf0)", alignSelf: "center" }}>Tags:</span>
            {[article.category, "Bitcoin", "Kripto", "Indonesia"].map(t => (
              <span key={t} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-main,#e8eaf0)", opacity: 0.6 }}>{t}</span>
            ))}
          </div>

          {/* Related articles */}
          {others.length > 0 && (
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 16 }}>Artikel Terkait</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {others.map(rel => (
                  <Link key={rel.id} href={`/artikel/${rel.id}`} style={{ textDecoration: "none" }}>
                    <div className="grad-border overflow-hidden" style={{ cursor: "pointer" }}>
                      <img src={rel.image} alt={rel.title} style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} loading="lazy" />
                      <div style={{ padding: "10px 12px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: rel.catColor, background: `color-mix(in srgb, ${rel.catColor} 12%, transparent)`, padding: "2px 8px", borderRadius: 5, marginBottom: 6, display: "inline-block" }}>{rel.category}</span>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main,#e8eaf0)", lineHeight: 1.4, margin: 0 }}>{rel.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
