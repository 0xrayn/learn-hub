"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchArticleById, fetchArticles, type Article } from "../../lib/supabase-data";
import { useAuth } from "../../context/AuthContext";
import { createClient } from "../../lib/supabase";

export default function ArtikelDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Load artikel dari Supabase
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const art = await fetchArticleById(Number(id));
      if (!art) { setLoading(false); return; }
      setArticle(art);

      // Load artikel terkait
      const all = await fetchArticles();
      const rel = all.filter(a => a.id !== art.id && a.category === art.category).slice(0, 3);
      const others = rel.length < 3
        ? [...rel, ...all.filter(a => a.id !== art.id && a.category !== art.category).slice(0, 3 - rel.length)]
        : rel;
      setRelated(others);
      setLoading(false);
    };
    load();
  }, [id]);

  // Load bookmark status
  useEffect(() => {
    if (!user || !article) { setBookmarked(false); return; }
    const supabase = createClient();
    supabase
      .from("artikel_bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("artikel_id", article.id)
      .maybeSingle()
      .then(({ data }) => setBookmarked(!!data));
  }, [user, article]);

  const toggleBookmark = async () => {
    if (!user) { window.location.href = "/login"; return; }
    if (!article) return;
    setBookmarkLoading(true);
    const supabase = createClient();
    if (bookmarked) {
      await supabase.from("artikel_bookmarks").delete().eq("user_id", user.id).eq("artikel_id", article.id);
      setBookmarked(false);
    } else {
      await supabase.from("artikel_bookmarks").insert({ user_id: user.id, artikel_id: article.id });
      setBookmarked(true);
    }
    setBookmarkLoading(false);
  };

  // Parse inline formatting: **bold**, *italic*, `code`, [text](url)
  const parseInline = (text: string, catColor: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let last = 0, m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      const token = m[0];
      if (token.startsWith("**")) parts.push(<strong key={m.index} style={{ color: "var(--text-main,#e8eaf0)", fontWeight: 700 }}>{token.slice(2, -2)}</strong>);
      else if (token.startsWith("*")) parts.push(<em key={m.index} style={{ fontStyle: "italic", opacity: 0.85 }}>{token.slice(1, -1)}</em>);
      else if (token.startsWith("`")) parts.push(<code key={m.index} style={{ fontFamily: "monospace", fontSize: "0.88em", padding: "1px 6px", borderRadius: 5, background: "rgba(255,255,255,0.08)", color: catColor }}>{token.slice(1, -1)}</code>);
      else { const [label, href] = token.slice(1, -1).split("]("); parts.push(<a key={m.index} href={href} target="_blank" rel="noopener noreferrer" style={{ color: catColor, textDecoration: "underline", textUnderlineOffset: 3 }}>{label}</a>); }
      last = m.index + token.length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  };

  const renderContent = (text: string, catColor: string) => {
    const lines = text.split("\n");
    const blocks: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) { i++; continue; }

      // H2
      if (line.startsWith("## ")) {
        blocks.push(
          <div key={i} style={{ margin: "44px 0 16px" }}>
            <div style={{ width: 32, height: 3, borderRadius: 99, background: catColor, marginBottom: 10, opacity: 0.7 }} />
            <h2 style={{ fontSize: "clamp(1.15rem,2.2vw,1.4rem)", fontWeight: 900, color: "var(--text-main,#e8eaf0)", margin: 0, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
              {parseInline(line.slice(3), catColor)}
            </h2>
          </div>
        );
        i++; continue;
      }

      // H3
      if (line.startsWith("### ")) {
        blocks.push(
          <h3 key={i} style={{ fontSize: "clamp(1rem,1.8vw,1.15rem)", fontWeight: 800, color: "var(--text-main,#e8eaf0)", margin: "32px 0 10px", letterSpacing: "-0.01em" }}>
            {parseInline(line.slice(4), catColor)}
          </h3>
        );
        i++; continue;
      }

      // Blockquote
      if (line.startsWith("> ")) {
        const qLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("> ")) { qLines.push(lines[i].slice(2)); i++; }
        blocks.push(
          <blockquote key={i} style={{ margin: "24px 0", padding: "16px 20px", borderLeft: `4px solid ${catColor}`, borderRadius: "0 12px 12px 0", background: `color-mix(in srgb, ${catColor} 6%, rgba(255,255,255,0.02))` }}>
            {qLines.map((q, j) => <p key={j} style={{ margin: j < qLines.length - 1 ? "0 0 8px" : 0, fontSize: 15, fontStyle: "italic", color: "var(--text-main,#e8eaf0)", opacity: 0.75, lineHeight: 1.7 }}>{parseInline(q, catColor)}</p>)}
          </blockquote>
        );
        continue;
      }

      // Code block
      if (line.startsWith("```")) {
        const lang = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith("```")) { codeLines.push(lines[i]); i++; }
        i++;
        blocks.push(
          <div key={i} style={{ margin: "24px 0", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            {lang && <div style={{ padding: "6px 14px", background: "rgba(255,255,255,0.04)", fontSize: 11, fontWeight: 700, color: catColor, fontFamily: "monospace", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{lang}</div>}
            <pre style={{ margin: 0, padding: "16px", background: "rgba(0,0,0,0.3)", overflowX: "auto", fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.8)", fontFamily: "monospace" }}>{codeLines.join("\n")}</pre>
          </div>
        );
        continue;
      }

      // Unordered list
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const items: string[] = [];
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) { items.push(lines[i].slice(2)); i++; }
        blocks.push(
          <ul key={i} style={{ margin: "16px 0 20px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item, j) => (
              <li key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: catColor, flexShrink: 0, marginTop: 9 }} />
                <span style={{ fontSize: 15, color: "var(--text-main,#e8eaf0)", opacity: 0.78, lineHeight: 1.75 }}>{parseInline(item, catColor)}</span>
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Ordered list
      if (/^\d+\. /.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, "")); i++; }
        blocks.push(
          <ol key={i} style={{ margin: "16px 0 20px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((item, j) => (
              <li key={j} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ minWidth: 26, height: 26, borderRadius: 8, background: `color-mix(in srgb, ${catColor} 15%, transparent)`, border: `1px solid ${catColor}40`, color: catColor, fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{j + 1}</span>
                <span style={{ fontSize: 15, color: "var(--text-main,#e8eaf0)", opacity: 0.78, lineHeight: 1.75, paddingTop: 2 }}>{parseInline(item, catColor)}</span>
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Horizontal rule
      if (line.startsWith("---") || line.startsWith("***")) {
        blocks.push(<hr key={i} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "36px 0" }} />);
        i++; continue;
      }

      // Paragraph — collect consecutive non-special lines
      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith("#") && !lines[i].startsWith("> ") && !lines[i].startsWith("```") && !lines[i].startsWith("- ") && !lines[i].startsWith("* ") && !/^\d+\. /.test(lines[i]) && !lines[i].startsWith("---")) {
        paraLines.push(lines[i]);
        i++;
      }
      if (paraLines.length) {
        blocks.push(
          <p key={i} style={{ fontSize: 16, color: "var(--text-main,#e8eaf0)", opacity: 0.75, lineHeight: 1.9, margin: "0 0 20px", letterSpacing: "0.005em" }}>
            {parseInline(paraLines.join(" "), catColor)}
          </p>
        );
      }
    }

    return blocks;
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(6,182,212,0.2)", borderTop: "2px solid #06b6d4", margin: "0 auto 14px", animation: "spin 0.7s linear infinite" }} />
            <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.3, fontSize: 13 }}>Memuat artikel...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Not found
  if (!article) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>Artikel Tidak Ditemukan</h1>
            <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, marginBottom: 24 }}>Artikel ini mungkin sudah dihapus atau belum dipublish.</p>
            <Link href="/artikel" style={{ padding: "10px 24px", borderRadius: 10, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: "#06b6d4", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
              ← Kembali ke Artikel
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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

          {/* Badges + Bookmark */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 8, background: `color-mix(in srgb, ${article.catColor} 15%, rgba(0,0,0,0.4))`, border: `1px solid ${article.catColor}50`, color: article.catColor }}>{article.category}</span>
              <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 8, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>⏱ {article.readTime} baca</span>
            </div>
            <button
              onClick={toggleBookmark}
              disabled={bookmarkLoading}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 16px", borderRadius: 9, fontSize: 12, fontWeight: 700,
                cursor: bookmarkLoading ? "default" : "pointer",
                background: bookmarked ? `color-mix(in srgb, ${article.catColor} 15%, transparent)` : "rgba(255,255,255,0.06)",
                border: bookmarked ? `1px solid ${article.catColor}60` : "1px solid rgba(255,255,255,0.12)",
                color: bookmarked ? article.catColor : "rgba(255,255,255,0.5)",
                transition: "all .2s", opacity: bookmarkLoading ? 0.6 : 1,
              }}
            >
              {bookmarked ? "🔖 Disimpan" : "🔖 Simpan"}
            </button>
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
          <div style={{ marginBottom: 56, maxWidth: 680 }}>
            {/* Lead/excerpt */}
            <p style={{ fontSize: 18, fontWeight: 500, color: "var(--text-main,#e8eaf0)", opacity: 0.6, lineHeight: 1.75, marginBottom: 36, paddingBottom: 28, borderBottom: `2px solid ${article.catColor}20`, fontStyle: "italic" }}>
              {article.excerpt}
            </p>
            {renderContent(article.content, article.catColor)}
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: 12, opacity: 0.35, color: "var(--text-main,#e8eaf0)", alignSelf: "center" }}>Tags:</span>
            {[article.category, "Bitcoin", "Kripto", "Indonesia"].map(t => (
              <span key={t} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-main,#e8eaf0)", opacity: 0.6 }}>{t}</span>
            ))}
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 16 }}>Artikel Terkait</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {related.map(rel => (
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
