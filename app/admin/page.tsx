"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase";
import { fetchModules, fetchArticles, type Module, type Article } from "../lib/supabase-data";

interface UserProfile { id: string; name: string | null; role: string; created_at: string; }
interface ProgressRow { user_id: string; module_id: number; lesson_idx: number; completed: boolean; }
interface BookmarkRow { user_id: string; artikel_id: number; created_at: string; }

// DB article/module types
interface DbArticle { id: number; title: string; excerpt: string; content: string; category: string; cat_color: string; author: string; image_url: string; read_time: string; published: boolean; created_at: string; }
interface DbLesson { id?: number; title: string; duration: string; sort_order: number; video_url?: string; video_type?: string; content?: string; is_free?: boolean; }
interface DbQuizQuestion { id?: number; lesson_id?: number; sort_order: number; question: string; options: string[]; answer: number; explanation: string; }
interface DbModule { id: number; num: string; icon: string; title: string; description: string; long_desc: string; duration: string; level: string; accent: string; level_color: string; published: boolean; sort_order: number; lessons?: DbLesson[]; }

type Tab = "overview" | "users" | "progress" | "bookmarks" | "konten" | "diskusi";

const GOLD = "#f59e0b";
const CATS = ["Pemula", "Teknologi", "Investasi", "Keamanan", "Sejarah", "Mining", "Lainnya"];
const LEVELS = ["Pemula", "Menengah", "Lanjutan"];
const CAT_COLORS: Record<string, string> = { Pemula: "#22c55e", Teknologi: "#06b6d4", Investasi: "#f59e0b", Keamanan: "#a78bfa", Sejarah: "#fb923c", Mining: "#ef4444", Lainnya: "#8b5cf6" };

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: "overview",  icon: "▦",  label: "Overview"       },
  { key: "users",     icon: "◎",  label: "Users"          },
  { key: "progress",  icon: "◈",  label: "Progress Modul" },
  { key: "bookmarks", icon: "◉",  label: "Bookmarks"      },
  { key: "konten",    icon: "✎",  label: "Kelola Konten"  },
  { key: "diskusi",   icon: "💬",  label: "Diskusi"        },
];

/* ── Sidebar ─────────────────────────────────────────────────── */
function Sidebar({ active, setActive, onSignOut, adminName, adminEmail }: {
  active: Tab; setActive: (t: Tab) => void;
  onSignOut: () => void; adminName: string; adminEmail: string;
}) {
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <aside style={{ width: 240, flexShrink: 0, minHeight: "100vh", background: "#08090f", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "sticky", top: 0, maxHeight: "100vh", overflowY: "auto" }}>
      <div style={{ padding: "28px 20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, ${GOLD}, #f97316)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#000", letterSpacing: "-0.5px" }}>LH</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: "#f0f0f5", letterSpacing: "-0.3px" }}>Learn<span style={{ color: GOLD }}>Hub</span></div>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", opacity: 0.3, color: "#f0f0f5", fontFamily: "monospace", fontWeight: 700 }}>ADMIN PANEL</div>
          </div>
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 16px" }} />
      <nav style={{ flex: 1, padding: "18px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#f0f0f5", opacity: 0.2, fontWeight: 800, padding: "0 10px", marginBottom: 8 }}>MENU</div>
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button key={t.key} onClick={() => setActive(t.key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: isActive ? `rgba(245,158,11,0.12)` : "transparent", color: isActive ? GOLD : "rgba(240,240,245,0.4)", fontWeight: isActive ? 700 : 500, fontSize: 13, textAlign: "left", transition: "all .15s", position: "relative" }}>
              {isActive && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: "0 3px 3px 0", background: GOLD }} />}
              <span style={{ fontSize: 14, fontFamily: "monospace", opacity: isActive ? 1 : 0.6 }}>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "12px 12px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div ref={dropRef} style={{ position: "relative" }}>
          <button onClick={() => setDropOpen((v) => !v)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: dropOpen ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)", cursor: "pointer", transition: "background .15s" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${GOLD}40, #f97316 40)`, border: `2px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: GOLD }}>{(adminName || "A")[0].toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminName || "Administrator"}</div>
              <div style={{ fontSize: 10, color: GOLD, fontWeight: 600 }}>🛡 Admin</div>
            </div>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, transition: "transform .2s", transform: dropOpen ? "rotate(180deg)" : "none" }}>▾</span>
          </button>
          {dropOpen && (
            <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, background: "#111218", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", zIndex: 50, boxShadow: "0 -16px 40px rgba(0,0,0,0.5)", animation: "fadeUp .15s ease" }}>
              <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10, opacity: 0.35, color: "#f0f0f5", marginBottom: 2 }}>Login sebagai</div>
                <div style={{ fontSize: 11, color: "#f0f0f5", fontWeight: 600, wordBreak: "break-all" }}>{adminEmail}</div>
              </div>
              <Link href="/" onClick={() => setDropOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", color: "rgba(240,240,245,0.6)", textDecoration: "none", fontSize: 13, fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background .12s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <span style={{ opacity: 0.5 }}>←</span> Kembali ke Site
              </Link>
              <button onClick={() => { setDropOpen(false); onSignOut(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 13, fontWeight: 600, textAlign: "left", transition: "background .12s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <span>⏏</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function StatCard({ icon, label, value, color, sub }: { icon: string; label: string; value: number | string; color: string; sub?: string; }) {
  return (
    <div style={{ padding: "22px", borderRadius: 16, background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "0 16px 0 80px", background: `${color}08` }} />
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1, letterSpacing: "-1px" }}>{value}</div>
      <div>
        <div style={{ fontSize: 11, color: "#f0f0f5", opacity: 0.4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color, opacity: 0.6, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0f5", margin: 0, letterSpacing: "-0.2px" }}>{children}</h2>
      {sub && <p style={{ fontSize: 11, opacity: 0.35, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.07)", ...style }}>
      {children}
    </div>
  );
}

/* ── Artikel Form Modal ────────────────────────────────────────── */
function ArticleModal({ article, onClose, onSaved }: { article: DbArticle | null; onClose: () => void; onSaved: () => void; }) {
  const isNew = !article;
  const [form, setForm] = useState<Partial<DbArticle>>(article || { title: "", excerpt: "", content: "", category: "Pemula", cat_color: "#22c55e", author: "Admin", image_url: "", read_time: "5 mnt", published: true });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imgMode, setImgMode] = useState<"url" | "upload">("url");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof DbArticle, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErr("Ukuran file max 5MB."); return; }
    setUploading(true); setErr("");
    const sb = createClient();
    const ext = file.name.split(".").pop();
    const filename = `artikel-${Date.now()}.${ext}`;
    const { data, error } = await sb.storage.from("artikel-images").upload(filename, file, { cacheControl: "3600", upsert: false });
    if (error) { setErr("Upload gagal: " + error.message); setUploading(false); return; }
    const { data: urlData } = sb.storage.from("artikel-images").getPublicUrl(filename);
    set("image_url", urlData.publicUrl);
    setUploading(false);
  };

  const save = async () => {
    if (!form.title?.trim()) { setErr("Judul wajib diisi."); return; }
    setSaving(true); setErr("");
    const sb = createClient();
    const payload = { title: form.title, excerpt: form.excerpt || "", content: form.content || "", category: form.category || "Pemula", cat_color: CAT_COLORS[form.category || "Pemula"] || "#22c55e", author: form.author || "Admin", image_url: form.image_url || "", read_time: form.read_time || "5 mnt", published: form.published ?? true, updated_at: new Date().toISOString() };
    const { error } = isNew
      ? await sb.from("articles").insert(payload)
      : await sb.from("articles").update(payload).eq("id", article!.id);
    setSaving(false);
    if (error) setErr(error.message);
    else { onSaved(); onClose(); }
  };

  const inp: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: 9, fontSize: 13, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: "#f0f0f5", opacity: 0.4, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0e0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 680, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: "#f0f0f5", margin: 0 }}>{isNew ? "✎ Buat Artikel Baru" : "✎ Edit Artikel"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div><label style={lbl}>Judul *</label><input value={form.title || ""} onChange={(e) => set("title", e.target.value)} style={inp} placeholder="Judul artikel..." /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>Kategori</label>
              <select value={form.category || "Pemula"} onChange={(e) => set("category", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Waktu Baca</label><input value={form.read_time || ""} onChange={(e) => set("read_time", e.target.value)} style={inp} placeholder="5 mnt" /></div>
          </div>
          <div><label style={lbl}>Penulis</label><input value={form.author || ""} onChange={(e) => set("author", e.target.value)} style={inp} placeholder="Nama penulis" /></div>

          {/* Image field with upload + URL option */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={lbl}>Gambar Artikel</label>
              <div style={{ display: "flex", gap: 4 }}>
                {(["url", "upload"] as const).map(m => (
                  <button key={m} onClick={() => setImgMode(m)} style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", border: `1px solid ${imgMode === m ? GOLD + "60" : "rgba(255,255,255,0.1)"}`, background: imgMode === m ? GOLD + "15" : "transparent", color: imgMode === m ? GOLD : "rgba(255,255,255,0.4)" }}>
                    {m === "url" ? "🔗 URL" : "📁 Upload"}
                  </button>
                ))}
              </div>
            </div>
            {imgMode === "url" ? (
              <input value={form.image_url || ""} onChange={(e) => set("image_url", e.target.value)} style={inp} placeholder="https://images.unsplash.com/..." />
            ) : (
              <div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
                  width: "100%", padding: "14px", borderRadius: 9, border: "1px dashed rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.03)", color: uploading ? GOLD : "rgba(255,255,255,0.4)",
                  fontSize: 13, cursor: uploading ? "not-allowed" : "pointer", transition: "all .2s",
                }}>
                  {uploading ? "⏳ Mengupload..." : "📁 Klik untuk pilih file (max 5MB)"}
                </button>
                {form.image_url && imgMode === "upload" && (
                  <div style={{ marginTop: 8, fontSize: 11, color: "#22c55e" }}>✓ Gambar berhasil diupload</div>
                )}
              </div>
            )}
            {form.image_url && (
              <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", height: 100 }}>
                <img src={form.image_url} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.currentTarget.style.display = "none"; }} />
              </div>
            )}
          </div>

          <div><label style={lbl}>Excerpt / Ringkasan</label><textarea value={form.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} style={{ ...inp, minHeight: 70, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} placeholder="Ringkasan singkat..." /></div>
          <div><label style={lbl}>Konten (Markdown)</label><textarea value={form.content || ""} onChange={(e) => set("content", e.target.value)} style={{ ...inp, minHeight: 200, resize: "vertical", fontFamily: "monospace", fontSize: 12, lineHeight: 1.7 }} placeholder="# Judul&#10;&#10;Tulis konten artikel di sini dengan format Markdown..." /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="pub" checked={form.published ?? true} onChange={(e) => set("published", e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer" }} />
            <label htmlFor="pub" style={{ ...lbl, marginBottom: 0, cursor: "pointer" }}>Tampilkan (Published)</label>
          </div>
          {err && <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171", fontSize: 13 }}>{err}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" }}>Batal</button>
            <button onClick={save} disabled={saving || uploading} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: (saving || uploading) ? `${GOLD}50` : `linear-gradient(135deg, ${GOLD}, #f97316)`, color: "#000", fontSize: 13, fontWeight: 800, cursor: (saving || uploading) ? "not-allowed" : "pointer" }}>
              {saving ? "Menyimpan..." : isNew ? "Buat Artikel" : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Modul Form Modal ─────────────────────────────────────────── */
/* ── Markdown WYSIWYG Editor ─────────────────────────────────────── */
function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const GOLD2 = "#f59e0b";

  const insertAt = (before: string, after: string = "", placeholder: string = "") => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end) || placeholder;
    const newVal = value.slice(0, start) + before + sel + after + value.slice(end);
    onChange(newVal);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + sel.length);
    }, 0);
  };

  const tools = [
    { icon: "H1", title: "Heading 1", action: () => insertAt("# ", "", "Judul") },
    { icon: "H2", title: "Heading 2", action: () => insertAt("## ", "", "Sub Judul") },
    { icon: "B", title: "Bold", action: () => insertAt("**", "**", "teks tebal"), style: { fontWeight: 900 } },
    { icon: "I", title: "Italic", action: () => insertAt("*", "*", "teks miring"), style: { fontStyle: "italic" } },
    { icon: "`", title: "Code", action: () => insertAt("`", "`", "kode") },
    { icon: "≡", title: "Bullet List", action: () => insertAt("- ", "", "item") },
    { icon: "1.", title: "Numbered List", action: () => insertAt("1. ", "", "item") },
    { icon: "❝", title: "Blockquote", action: () => insertAt("> ", "", "kutipan") },
    { icon: "⊟", title: "Code Block", action: () => insertAt("```\n", "\n```", "kode di sini") },
    { icon: "⊞", title: "Tabel", action: () => insertAt("| Kolom 1 | Kolom 2 | Kolom 3 |\n|---------|---------|----------|\n| ", " | data | data |", "data") },
    { icon: "—", title: "Divider", action: () => { onChange(value + "\n---\n"); } },
  ];

  // Simple markdown preview
  const renderPreview = (md: string) => {
    const lines = md.split("\n");
    const els: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith("### ")) els.push(<h3 key={i} style={{ color: "#f0f0f5", margin: "16px 0 6px", fontSize: 13 }}>{line.slice(4)}</h3>);
      else if (line.startsWith("## ")) els.push(<h2 key={i} style={{ color: "#f0f0f5", margin: "20px 0 8px", fontSize: 15, borderLeft: `3px solid ${GOLD2}`, paddingLeft: 10 }}>{line.slice(3)}</h2>);
      else if (line.startsWith("# ")) els.push(<h1 key={i} style={{ color: "#f0f0f5", margin: "22px 0 10px", fontSize: 18 }}>{line.slice(2)}</h1>);
      else if (line.startsWith("> ")) els.push(<blockquote key={i} style={{ margin: "10px 0", padding: "10px 14px", borderLeft: `3px solid ${GOLD2}`, background: `${GOLD2}10`, borderRadius: "0 8px 8px 0", color: "#f0f0f5", opacity: 0.75, fontSize: 13 }}>{line.slice(2)}</blockquote>);
      else if (line.startsWith("- ") || line.startsWith("* ")) {
        const items: string[] = [];
        while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) { items.push(lines[i].slice(2)); i++; }
        els.push(<ul key={`ul${i}`} style={{ margin: "8px 0", paddingLeft: 18 }}>{items.map((it, j) => <li key={j} style={{ color: "#f0f0f5", fontSize: 13, opacity: 0.8, marginBottom: 3 }}>{it}</li>)}</ul>);
        continue;
      } else if (line.startsWith("|") && line.endsWith("|")) {
        const tls: string[] = [];
        while (i < lines.length && lines[i].startsWith("|") && lines[i].endsWith("|")) { tls.push(lines[i]); i++; }
        const rows = tls.filter(r => !/^\|[\s\-:|]+\|$/.test(r));
        const pr = (r: string) => r.split("|").slice(1,-1).map(c => c.trim());
        if (rows.length > 0) {
          const hd = pr(rows[0]); const bd = rows.slice(1);
          els.push(<div key={`t${i}`} style={{ margin:"12px 0", overflowX:"auto", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)" }}><table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}><thead><tr style={{ background:`${GOLD2}18` }}>{hd.map((h,hi) => <th key={hi} style={{ padding:"8px 12px", textAlign:"left", color:GOLD2, fontWeight:700, borderBottom:"1px solid rgba(255,255,255,0.1)" }}>{h}</th>)}</tr></thead><tbody>{bd.map((r,ri) => <tr key={ri} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>{pr(r).map((c,ci) => <td key={ci} style={{ padding:"7px 12px", color:"#f0f0f5", opacity:0.75 }}>{c}</td>)}</tr>)}</tbody></table></div>);
        }
        continue;
      } else if (line.startsWith("```")) {
        const cls: string[] = []; i++;
        while (i < lines.length && !lines[i].startsWith("```")) { cls.push(lines[i]); i++; }
        els.push(<pre key={`cd${i}`} style={{ margin:"12px 0", padding:"12px 14px", borderRadius:8, background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.08)", fontSize:12, color:"#e8eaf0", overflowX:"auto", fontFamily:"monospace", lineHeight:1.6 }}>{cls.join("\n")}</pre>);
      } else if (line === "---") els.push(<hr key={i} style={{ border:"none", borderTop:"1px solid rgba(255,255,255,0.1)", margin:"16px 0" }} />);
      else if (line.trim() === "") els.push(<div key={i} style={{ height:6 }} />);
      else if (line.trim()) {
        const bold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`(.+?)`/g, "<code style='background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:4px;font-family:monospace'>$1</code>");
        els.push(<p key={i} style={{ color:"#f0f0f5", fontSize:13, opacity:0.8, lineHeight:1.8, margin:"4px 0" }} dangerouslySetInnerHTML={{ __html: bold }} />);
      }
      i++;
    }
    return els;
  };

  const inp2: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: 9, fontSize: 13, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5", boxSizing: "border-box" };

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, overflow: "hidden", background: "rgba(0,0,0,0.25)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 1, padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", flexWrap: "wrap" }}>
        {tools.map((t, ti) => (
          <button key={ti} title={t.title} onClick={t.action} type="button"
            style={{ padding: "5px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none", background: "transparent", color: "rgba(255,255,255,0.5)", transition: "all .12s", ...(t.style || {}) }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${GOLD2}18`; (e.currentTarget as HTMLButtonElement).style.color = GOLD2; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"; }}>
            {t.icon}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", borderRadius: 7, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
          {(["write", "preview"] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} type="button"
              style={{ padding: "4px 12px", fontSize: 10, fontWeight: 700, cursor: "pointer", border: "none", background: mode === m ? `${GOLD2}20` : "transparent", color: mode === m ? GOLD2 : "rgba(255,255,255,0.35)", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>
              {m === "write" ? "✏ Tulis" : "👁 Preview"}
            </button>
          ))}
        </div>
      </div>
      {/* Editor / Preview */}
      {mode === "write" ? (
        <textarea ref={taRef} value={value} onChange={e => onChange(e.target.value)}
          style={{ ...inp2, minHeight: 180, resize: "vertical", fontFamily: "\"Fira Code\", \"Cascadia Code\", monospace", fontSize: 12.5, lineHeight: 1.75, borderRadius: 0, border: "none", background: "transparent", display: "block" }}
          placeholder={"## Judul Materi\n\nTulis penjelasan di sini...\n\n- Poin 1\n- Poin 2\n\n| Kolom A | Kolom B |\n|---------|----------|\n| data    | data    |\n\n**Tebal** dan *miring* didukung."} />
      ) : (
        <div style={{ minHeight: 180, padding: "14px 16px", overflowY: "auto", maxHeight: 400 }}>
          {value.trim() ? renderPreview(value) : <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, fontStyle: "italic" }}>Belum ada konten...</p>}
        </div>
      )}
      {/* Footer */}
      <div style={{ padding: "4px 10px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>MARKDOWN EDITOR</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{value.length} karakter · {value.split("\n").length} baris</span>
      </div>
    </div>
  );
}

function ModuleModal({ mod, onClose, onSaved }: { mod: DbModule | null; onClose: () => void; onSaved: () => void; }) {
  const isNew = !mod;
  const [form, setForm] = useState<Partial<DbModule>>(mod || { num: "01", icon: "₿", title: "", description: "", long_desc: "", duration: "30 mnt", level: "Pemula", accent: "#f59e0b", level_color: "#22c55e", published: true, sort_order: 0 });
  const [lessons, setLessons] = useState<DbLesson[]>(mod?.lessons || [{ title: "", duration: "5 mnt", sort_order: 0, video_url: "", video_type: "youtube", content: "", is_free: false }]);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [lessonTab, setLessonTab] = useState<Record<number, "konten" | "quiz">>({});
  // quizzes per lesson index
  const [quizzes, setQuizzes] = useState<Record<number, DbQuizQuestion[]>>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const setF = (k: keyof DbModule, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const setLesson = (i: number, k: string, v: string | boolean) => setLessons((ls) => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l));
  const addLesson = () => setLessons((ls) => [...ls, { title: "", duration: "5 mnt", sort_order: ls.length, video_url: "", video_type: "youtube", content: "", is_free: false }]);
  const removeLesson = (i: number) => { setLessons((ls) => ls.filter((_, idx) => idx !== i)); setExpandedLesson(null); };

  // Quiz helpers
  const getQuizzes = (i: number): DbQuizQuestion[] => quizzes[i] || [];
  const addQuiz = (i: number) => setQuizzes(q => ({ ...q, [i]: [...getQuizzes(i), { sort_order: getQuizzes(i).length, question: "", options: ["", "", "", ""], answer: 0, explanation: "" }] }));
  const removeQuiz = (lessonIdx: number, qIdx: number) => setQuizzes(q => ({ ...q, [lessonIdx]: getQuizzes(lessonIdx).filter((_, j) => j !== qIdx) }));
  const setQuiz = (lessonIdx: number, qIdx: number, k: string, v: any) => setQuizzes(q => ({ ...q, [lessonIdx]: getQuizzes(lessonIdx).map((item, j) => j === qIdx ? { ...item, [k]: v } : item) }));
  const setQuizOption = (lessonIdx: number, qIdx: number, optIdx: number, v: string) => setQuizzes(q => ({ ...q, [lessonIdx]: getQuizzes(lessonIdx).map((item, j) => j === qIdx ? { ...item, options: item.options.map((o, oi) => oi === optIdx ? v : o) } : item) }));

  // Load existing quizzes for edit mode
  useEffect(() => {
    if (!mod?.lessons) return;
    const sb = createClient();
    const lessonIds = (mod.lessons as any[]).filter(l => l.id).map(l => l.id);
    if (!lessonIds.length) return;
    sb.from("lesson_quizzes").select("*").in("lesson_id", lessonIds).order("sort_order", { ascending: true }).then(({ data }) => {
      if (!data) return;
      const byLesson: Record<number, DbQuizQuestion[]> = {};
      data.forEach((q: any) => {
        const idx = (mod.lessons as any[]).findIndex(l => l.id === q.lesson_id);
        if (idx < 0) return;
        if (!byLesson[idx]) byLesson[idx] = [];
        byLesson[idx].push({ id: q.id, lesson_id: q.lesson_id, sort_order: q.sort_order, question: q.question, options: q.options, answer: q.answer, explanation: q.explanation });
      });
      setQuizzes(byLesson);
    });
  }, []);

  const save = async () => {
    if (!form.title?.trim()) { setErr("Judul modul wajib diisi."); return; }
    const validLessons = lessons.filter((l) => l.title.trim());
    if (validLessons.length === 0) { setErr("Tambahkan minimal 1 pelajaran."); return; }
    setSaving(true); setErr("");
    const sb = createClient();
    const payload = { num: form.num || "01", icon: form.icon || "₿", title: form.title, description: form.description || "", long_desc: form.long_desc || "", duration: form.duration || "30 mnt", level: form.level || "Pemula", accent: form.accent || "#f59e0b", level_color: form.level_color || "#22c55e", published: form.published ?? true, sort_order: form.sort_order || 0, updated_at: new Date().toISOString() };

    let savedLessonIds: number[] = [];

    if (isNew) {
      const { data, error } = await sb.from("modules").insert(payload).select("id").single();
      if (error || !data) { setSaving(false); setErr(error?.message || "Gagal membuat modul."); return; }
      const moduleId = data.id;
      const lessonsPayload = validLessons.map((l, idx) => ({ module_id: moduleId, title: l.title, duration: l.duration || "5 mnt", sort_order: idx, video_url: l.video_url || null, video_type: l.video_type || "youtube", content: l.content || null, is_free: l.is_free || false }));
      const { data: insertedLessons } = await sb.from("module_lessons").insert(lessonsPayload).select("id");
      savedLessonIds = (insertedLessons || []).map((l: any) => l.id);
    } else {
      const { error } = await sb.from("modules").update(payload).eq("id", mod!.id);
      if (error) { setSaving(false); setErr(error.message); return; }
      await sb.from("module_lessons").delete().eq("module_id", mod!.id);
      const lessonsPayload = validLessons.map((l, idx) => ({ module_id: mod!.id, title: l.title, duration: l.duration || "5 mnt", sort_order: idx, video_url: l.video_url || null, video_type: l.video_type || "youtube", content: l.content || null, is_free: l.is_free || false }));
      if (lessonsPayload.length > 0) {
        const { data: insertedLessons } = await sb.from("module_lessons").insert(lessonsPayload).select("id");
        savedLessonIds = (insertedLessons || []).map((l: any) => l.id);
      }
    }

    // Save quizzes for each lesson
    for (let i = 0; i < validLessons.length; i++) {
      const lessonId = savedLessonIds[i];
      if (!lessonId) continue;
      const lessonQuizzes = getQuizzes(i).filter(q => q.question.trim());
      if (lessonQuizzes.length === 0) continue;
      // Delete old quizzes for this lesson then insert new
      await sb.from("lesson_quizzes").delete().eq("lesson_id", lessonId);
      const quizPayload = lessonQuizzes.map((q, qi) => ({ lesson_id: lessonId, sort_order: qi, question: q.question, options: q.options, answer: q.answer, explanation: q.explanation || "" }));
      await sb.from("lesson_quizzes").insert(quizPayload);
    }

    setSaving(false);
    onSaved();
    onClose();
  };

  const inp: React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: 9, fontSize: 13, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#f0f0f5", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: "#f0f0f5", opacity: 0.4, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#0e0f1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 900, color: "#f0f0f5", margin: 0 }}>{isNew ? "✎ Buat Modul Baru" : "✎ Edit Modul"}</h2>
            <p style={{ fontSize: 11, opacity: 0.35, margin: "4px 0 0" }}>Isi info modul, tambah pelajaran, lalu tambah quiz per pelajaran</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {/* Step pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {["1. Info Modul", "2. Pelajaran & Konten", "3. Quiz per Pelajaran"].map((s, i) => (
            <div key={i} style={{ padding: "4px 12px", borderRadius: 99, fontSize: 10, fontWeight: 700, background: `${GOLD}12`, border: `1px solid ${GOLD}25`, color: GOLD }}>{s}</div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* ── STEP 1: Info Modul ── */}
          <div style={{ padding: "16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, marginBottom: 12, letterSpacing: "0.05em" }}>① INFO MODUL</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 60px 1fr", gap: 12 }}>
                <div><label style={lbl}>Nomor</label><input value={form.num || ""} onChange={(e) => setF("num", e.target.value)} style={inp} placeholder="01" /></div>
                <div><label style={lbl}>Icon</label><input value={form.icon || ""} onChange={(e) => setF("icon", e.target.value)} style={{ ...inp, textAlign: "center", fontSize: 18 }} /></div>
                <div><label style={lbl}>Judul Modul *</label><input value={form.title || ""} onChange={(e) => setF("title", e.target.value)} style={inp} placeholder="Nama modul..." /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label style={lbl}>Level</label>
                  <select value={form.level || "Pemula"} onChange={(e) => setF("level", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                    {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Durasi Total</label><input value={form.duration || ""} onChange={(e) => setF("duration", e.target.value)} style={inp} placeholder="30 mnt" /></div>
                <div><label style={lbl}>Urutan Tampil</label><input type="number" value={form.sort_order ?? 0} onChange={(e) => setF("sort_order", parseInt(e.target.value) || 0)} style={inp} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><label style={lbl}>Warna Aksen</label><div style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="color" value={form.accent || "#f59e0b"} onChange={(e) => setF("accent", e.target.value)} style={{ width: 40, height: 36, borderRadius: 8, border: "none", cursor: "pointer", background: "transparent" }} /><input value={form.accent || ""} onChange={(e) => setF("accent", e.target.value)} style={{ ...inp, flex: 1 }} /></div></div>
                <div><label style={lbl}>Warna Level</label><div style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="color" value={form.level_color || "#22c55e"} onChange={(e) => setF("level_color", e.target.value)} style={{ width: 40, height: 36, borderRadius: 8, border: "none", cursor: "pointer", background: "transparent" }} /><input value={form.level_color || ""} onChange={(e) => setF("level_color", e.target.value)} style={{ ...inp, flex: 1 }} /></div></div>
              </div>
              <div><label style={lbl}>Deskripsi Singkat</label><textarea value={form.description || ""} onChange={(e) => setF("description", e.target.value)} style={{ ...inp, minHeight: 55, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} placeholder="Deskripsi singkat modul..." /></div>
              <div><label style={lbl}>Deskripsi Panjang</label><textarea value={form.long_desc || ""} onChange={(e) => setF("long_desc", e.target.value)} style={{ ...inp, minHeight: 70, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} placeholder="Penjelasan lebih lengkap..." /></div>
            </div>
          </div>

          {/* ── STEP 2 & 3: Pelajaran + Quiz ── */}
          <div style={{ padding: "16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: GOLD, letterSpacing: "0.05em" }}>② PELAJARAN & QUIZ</div>
              <button onClick={addLesson} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: `1px solid ${GOLD}40`, background: `${GOLD}12`, color: GOLD, cursor: "pointer" }}>+ Tambah Pelajaran</button>
            </div>
            <div style={{ fontSize: 11, opacity: 0.35, marginBottom: 12, color: "#f0f0f5" }}>Klik pelajaran untuk expand, lalu pilih tab Konten (materi/video) atau Quiz (soal pilihan ganda)</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {lessons.map((l, i) => {
                const qList = getQuizzes(i);
                const tab = lessonTab[i] || "konten";
                const isExpanded = expandedLesson === i;
                return (
                  <div key={i} style={{ borderRadius: 12, border: `1px solid ${isExpanded ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.09)"}`, background: isExpanded ? "rgba(245,158,11,0.03)" : "rgba(255,255,255,0.02)", overflow: "hidden", transition: "border-color .2s" }}>
                    {/* Header row */}
                    <div style={{ display: "flex", gap: 8, padding: "10px 12px", alignItems: "center" }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: isExpanded ? `${GOLD}20` : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: isExpanded ? GOLD : "rgba(255,255,255,0.3)", flexShrink: 0 }}>{i + 1}</div>
                      <input value={l.title} onChange={(e) => setLesson(i, "title", e.target.value)} style={{ ...inp, flex: 1, padding: "8px 12px" }} placeholder={`Judul pelajaran ${i + 1}...`} onClick={e => e.stopPropagation()} />
                      <input value={l.duration} onChange={(e) => setLesson(i, "duration", e.target.value)} style={{ ...inp, width: 85, padding: "8px 12px", flexShrink: 0 }} placeholder="8 mnt" onClick={e => e.stopPropagation()} />
                      {qList.length > 0 && <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 99, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa", fontWeight: 700, flexShrink: 0 }}>📝 {qList.length} quiz</div>}
                      <button onClick={() => setExpandedLesson(isExpanded ? null : i)} style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid rgba(245,158,11,0.3)`, background: isExpanded ? `${GOLD}20` : `${GOLD}08`, color: GOLD, cursor: "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
                        {isExpanded ? "▲ Tutup" : "▼ Edit"}
                      </button>
                      <button onClick={() => removeLesson(i)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer", fontSize: 13, flexShrink: 0 }}>✕</button>
                    </div>

                    {/* Expandable */}
                    {isExpanded && (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        {/* Sub-tab switcher */}
                        <div style={{ display: "flex", gap: 0, padding: "10px 12px 0" }}>
                          {(["konten", "quiz"] as const).map(t => (
                            <button key={t} onClick={() => setLessonTab(lt => ({ ...lt, [i]: t }))} style={{ padding: "7px 16px", fontSize: 11, fontWeight: 700, cursor: "pointer", border: "none", borderBottom: tab === t ? `2px solid ${GOLD}` : "2px solid transparent", background: "transparent", color: tab === t ? GOLD : "rgba(255,255,255,0.35)", transition: "all .15s" }}>
                              {t === "konten" ? "🎬 Konten & Video" : `📝 Quiz (${getQuizzes(i).length})`}
                            </button>
                          ))}
                        </div>

                        {/* Tab: Konten */}
                        {tab === "konten" && (
                          <div style={{ padding: "12px 12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                            <div>
                              <label style={lbl}>Tipe Video</label>
                              <select value={l.video_type || "youtube"} onChange={(e) => setLesson(i, "video_type", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                                <option value="youtube">▶ YouTube</option>
                                <option value="vimeo">▶ Vimeo</option>
                                <option value="url">▶ URL Langsung (MP4, dll)</option>
                                <option value="drive">▶ Google Drive</option>
                              </select>
                            </div>
                            <div>
                              <label style={lbl}>URL Video</label>
                              <input value={l.video_url || ""} onChange={(e) => setLesson(i, "video_url", e.target.value)} style={inp} placeholder="https://youtu.be/abc123 atau https://vimeo.com/123456" />
                              <div style={{ fontSize: 10, opacity: 0.3, marginTop: 4, color: "#f0f0f5" }}>Kosongkan jika belum ada video — konten tetap bisa ditambah di bawah</div>
                            </div>
                            <div>
                              <label style={lbl}>Materi Teks (Editor Markdown)</label>
                              <MarkdownEditor value={l.content || ""} onChange={(v) => setLesson(i, "content", v)} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <input type="checkbox" id={`free-${i}`} checked={l.is_free || false} onChange={(e) => setLesson(i, "is_free", e.target.checked)} style={{ width: 14, height: 14, cursor: "pointer" }} />
                              <label htmlFor={`free-${i}`} style={{ ...lbl, marginBottom: 0, cursor: "pointer", opacity: 0.5 }}>🎁 Gratis (bisa diakses tanpa login)</label>
                            </div>
                          </div>
                        )}

                        {/* Tab: Quiz Builder */}
                        {tab === "quiz" && (
                          <div style={{ padding: "12px 12px 14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>Quiz untuk: <span style={{ color: "#a78bfa" }}>{l.title || `Pelajaran ${i + 1}`}</span></div>
                                <div style={{ fontSize: 10, opacity: 0.35, marginTop: 2 }}>Pilihan ganda 4 opsi. Klik ● untuk set jawaban benar.</div>
                              </div>
                              <button onClick={() => addQuiz(i)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "1px solid rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.08)", color: "#a78bfa", cursor: "pointer" }}>+ Soal</button>
                            </div>

                            {getQuizzes(i).length === 0 ? (
                              <div style={{ padding: "28px 20px", textAlign: "center", border: "1px dashed rgba(167,139,250,0.2)", borderRadius: 10 }}>
                                <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
                                <div style={{ fontSize: 12, opacity: 0.4, color: "#f0f0f5" }}>Belum ada soal. Klik "+ Soal" untuk tambah.</div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {getQuizzes(i).map((q, qi) => (
                                  <div key={qi} style={{ padding: "14px", borderRadius: 10, border: "1px solid rgba(167,139,250,0.15)", background: "rgba(167,139,250,0.04)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                      <div style={{ fontSize: 10, fontWeight: 800, color: "#a78bfa", opacity: 0.7 }}>SOAL {qi + 1}</div>
                                      <button onClick={() => removeQuiz(i, qi)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 13, opacity: 0.6, padding: 0 }}>✕</button>
                                    </div>
                                    <input
                                      value={q.question}
                                      onChange={e => setQuiz(i, qi, "question", e.target.value)}
                                      style={{ ...inp, marginBottom: 10 }}
                                      placeholder="Tulis pertanyaan di sini..."
                                    />
                                    <div style={{ fontSize: 9, fontWeight: 700, color: "#f0f0f5", opacity: 0.3, letterSpacing: "0.08em", marginBottom: 7 }}>PILIHAN JAWABAN — Klik ● untuk tandai yang benar</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                      {q.options.map((opt, oi) => (
                                        <div key={oi} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                          <button
                                            onClick={() => setQuiz(i, qi, "answer", oi)}
                                            title="Tandai sebagai jawaban benar"
                                            style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${q.answer === oi ? "#22c55e" : "rgba(255,255,255,0.15)"}`, background: q.answer === oi ? "#22c55e" : "transparent", color: q.answer === oi ? "#000" : "rgba(255,255,255,0.25)", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, flexShrink: 0 }}>
                                            {q.answer === oi ? "✓" : String.fromCharCode(65 + oi)}
                                          </button>
                                          <input
                                            value={opt}
                                            onChange={e => setQuizOption(i, qi, oi, e.target.value)}
                                            style={{ ...inp, flex: 1, padding: "8px 12px", border: `1px solid ${q.answer === oi ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`, background: q.answer === oi ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.04)" }}
                                            placeholder={`Pilihan ${String.fromCharCode(65 + oi)}...`}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                      <label style={lbl}>Penjelasan Jawaban (ditampilkan setelah user menjawab)</label>
                                      <input
                                        value={q.explanation}
                                        onChange={e => setQuiz(i, qi, "explanation", e.target.value)}
                                        style={inp}
                                        placeholder="Contoh: Jawaban B benar karena..."
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="pubm" checked={form.published ?? true} onChange={(e) => setF("published", e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer" }} />
            <label htmlFor="pubm" style={{ ...lbl, marginBottom: 0, cursor: "pointer" }}>Tampilkan (Published)</label>
          </div>

          {err && <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171", fontSize: 13 }}>{err}</div>}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button onClick={onClose} style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" }}>Batal</button>
            <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: saving ? `${GOLD}50` : `linear-gradient(135deg, ${GOLD}, #f97316)`, color: "#000", fontSize: 13, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Menyimpan..." : isNew ? "Buat Modul" : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
export default function AdminPage() {
  const { user, loading, role, signOut } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [discLoading, setDiscLoading] = useState(false);
  const [discSearch, setDiscSearch] = useState("");

  const loadDiscussions = async () => {
    setDiscLoading(true);
    const sb = createClient();
    const { data } = await sb
      .from("lesson_discussions")
      .select("*, lesson:module_lessons(title, module_id)")
      .order("created_at", { ascending: false })
      .limit(200);

    if (data && data.length > 0) {
      const userIds = [...new Set(data.map((d: any) => d.user_id))];
      const { data: profiles } = await sb.from("profiles").select("id, name, avatar_url").in("id", userIds);
      const profileMap: Record<string, any> = {};
      (profiles || []).forEach((p: any) => { profileMap[p.id] = p; });
      setDiscussions(data.map((d: any) => ({ ...d, profile: profileMap[d.user_id] || null })));
    } else {
      setDiscussions(data || []);
    }
    setDiscLoading(false);
  };

  const deleteDiscussion = async (id: string) => {
    if (!confirm("Hapus komentar ini?")) return;
    const sb = createClient();
    await sb.from("lesson_discussions").delete().eq("id", id);
    setDiscussions(prev => prev.filter(d => d.id !== id));
  };

  // Live data from Supabase (with dummy fallback) — used in Overview/Progress/Bookmarks
  const [liveModules, setLiveModules] = useState<Module[]>([]);
  const [liveArticles, setLiveArticles] = useState<Article[]>([]);

  // Konten state (for Kelola Konten tab)
  const [dbArticles, setDbArticles] = useState<DbArticle[]>([]);
  const [dbModules, setDbModules] = useState<DbModule[]>([]);
  const [kontenLoading, setKontenLoading] = useState(false);
  const [kontenSub, setKontenSub] = useState<"artikel" | "modul">("artikel");
  const [articleModal, setArticleModal] = useState<{ open: boolean; data: DbArticle | null }>({ open: false, data: null });
  const [moduleModal, setModuleModal] = useState<{ open: boolean; data: DbModule | null }>({ open: false, data: null });

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (role !== null && role !== "admin") { router.replace("/"); }
  }, [user, loading, role, router]);

  // Load live modules & articles (with dummy fallback) for Overview/Progress/Bookmarks
  useEffect(() => {
    if (role !== "admin") return;
    fetchModules().then(setLiveModules);
    fetchArticles().then(setLiveArticles);
  }, [role]);

  useEffect(() => {
    if (role !== "admin") return;
    const sb = createClient();
    setDataLoading(true);
    setErrors([]);
    Promise.all([
      sb.from("profiles").select("id,name,role,created_at").order("created_at", { ascending: false }),
      sb.from("module_progress").select("user_id,module_id,lesson_idx,completed"),
      sb.from("artikel_bookmarks").select("user_id,artikel_id,created_at").order("created_at", { ascending: false }),
    ]).then(([p, prog, bm]) => {
      const errs: string[] = [];
      if (p.error) errs.push(`profiles: ${p.error.message}`);
      if (prog.error) errs.push(`module_progress: ${prog.error.message}`);
      if (bm.error) errs.push(`artikel_bookmarks: ${bm.error.message}`);
      if (errs.length) setErrors(errs);
      setUsers(p.data || []);
      setProgress(prog.data || []);
      setBookmarks(bm.data || []);
      setDataLoading(false);
    });
  }, [role]);

  const loadKonten = async () => {
    if (role !== "admin") return;
    setKontenLoading(true);
    const sb = createClient();
    const [{ data: arts }, { data: mods }, { data: lessons }] = await Promise.all([
      sb.from("articles").select("*").order("created_at", { ascending: false }),
      sb.from("modules").select("*").order("sort_order", { ascending: true }),
      sb.from("module_lessons").select("*").order("sort_order", { ascending: true }),
    ]);
    setDbArticles(arts || []);
    const modsWithLessons = (mods || []).map((m: any) => ({
      ...m,
      lessons: (lessons || []).filter((l: any) => l.module_id === m.id),
    }));
    setDbModules(modsWithLessons);
    setKontenLoading(false);
  };

  useEffect(() => { if (activeTab === "konten" && role === "admin") loadKonten(); }, [activeTab, role]);
  useEffect(() => { if (activeTab === "diskusi") loadDiscussions(); }, [activeTab]);

  const deleteArticle = async (id: number) => {
    if (!confirm("Hapus artikel ini?")) return;
    await createClient().from("articles").delete().eq("id", id);
    loadKonten();
  };

  const deleteModule = async (id: number) => {
    if (!confirm("Hapus modul dan semua pelajarannya?")) return;
    const sb = createClient();
    await sb.from("module_lessons").delete().eq("module_id", id);
    await sb.from("modules").delete().eq("id", id);
    loadKonten();
  };

  const handleSignOut = async () => { await signOut(); router.replace("/"); };

  if (loading || role === null) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08090f" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", border: `3px solid ${GOLD}20`, borderTop: `3px solid ${GOLD}`, margin: "0 auto 16px", animation: "spin 0.7s linear infinite" }} />
        <p style={{ color: "#f0f0f5", opacity: 0.3, fontSize: 13 }}>Memverifikasi akses...</p>
      </div>
    </div>
  );
  if (role !== "admin") return null;

  const regularUsers = users.filter((u) => u.role === "user");
  const completedProgress = progress.filter((p) => p.completed);
  const activeUserIds = new Set([...progress.map((p) => p.user_id), ...bookmarks.map((b) => b.user_id)]);
  const userProgressCount: Record<string, number> = {};
  completedProgress.forEach((p) => { userProgressCount[p.user_id] = (userProgressCount[p.user_id] || 0) + 1; });
  const userBookmarkCount: Record<string, number> = {};
  bookmarks.forEach((b) => { userBookmarkCount[b.user_id] = (userBookmarkCount[b.user_id] || 0) + 1; });
  const moduleLessonsDone: Record<number, number> = {};
  completedProgress.forEach((p) => { moduleLessonsDone[p.module_id] = (moduleLessonsDone[p.module_id] || 0) + 1; });
  const articleBmCount: Record<number, number> = {};
  bookmarks.forEach((b) => { articleBmCount[b.artikel_id] = (articleBmCount[b.artikel_id] || 0) + 1; });
  const totalLessons = liveModules.reduce((a, m) => a + m.lessons.length, 0);
  const filteredUsers = users.filter((u) => !userSearch || (u.name || "").toLowerCase().includes(userSearch.toLowerCase()));
  const adminUser = users.find((u) => u.id === user?.id);
  const adminName = adminUser?.name || "Administrator";
  const adminEmail = user?.email || "";

  const thS: React.CSSProperties = { padding: "12px 18px", fontSize: 10, fontWeight: 800, color: "#f0f0f5", opacity: 0.3, textAlign: "left", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.1em" };
  const tdS: React.CSSProperties = { padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.04)", color: "#f0f0f5", fontSize: 13 };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0c0d14", color: "#f0f0f5", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @keyframes spin   { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
        .arow:hover { background: rgba(245,158,11,0.04) !important }
        .tab-anim   { animation: fadeUp .2s ease both }
        * { box-sizing: border-box }
        input:focus, button:focus, textarea:focus, select:focus { outline: none }
        ::-webkit-scrollbar { width: 5px; height: 5px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px }
        select option { background: #1a1b2e; color: #f0f0f5 }
      `}</style>

      <Sidebar active={activeTab} setActive={setActiveTab} onSignOut={handleSignOut} adminName={adminName} adminEmail={adminEmail} />

      <main style={{ flex: 1, minWidth: 0, padding: "36px 32px 72px", overflowX: "hidden" }}>
        <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", opacity: 0.3, fontWeight: 800, marginBottom: 6 }}>
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, margin: 0, letterSpacing: "-0.5px", lineHeight: 1 }}>
              {activeTab === "overview"  && <>📊 <span style={{ color: GOLD }}>Overview</span></>}
              {activeTab === "users"     && <>👥 <span style={{ color: GOLD }}>Users</span></>}
              {activeTab === "progress"  && <>📚 <span style={{ color: GOLD }}>Progress</span> Modul</>}
              {activeTab === "bookmarks" && <>🔖 <span style={{ color: GOLD }}>Bookmarks</span></>}
              {activeTab === "konten"    && <>✎ <span style={{ color: GOLD }}>Kelola</span> Konten</>}
              {activeTab === "diskusi"   && <>💬 <span style={{ color: GOLD }}>Diskusi</span> & Komentar</>}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ val: regularUsers.length, label: "Users" }, { val: completedProgress.length, label: "Lessons Done" }, { val: bookmarks.length, label: "Bookmarks" }].map((s) => (
              <div key={s.label} style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: GOLD, letterSpacing: "-0.5px" }}>{s.val}</div>
                <div style={{ fontSize: 9, opacity: 0.35, fontWeight: 700, letterSpacing: "0.08em" }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {errors.length > 0 && (
          <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: 12, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>⚠ Gagal memuat data — kemungkinan masalah RLS Supabase:</div>
            {errors.map((e, i) => <div key={i} style={{ opacity: 0.8, fontFamily: "monospace" }}>• {e}</div>)}
          </div>
        )}

        {dataLoading && activeTab !== "konten" ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${GOLD}20`, borderTop: `2px solid ${GOLD}`, margin: "0 auto 14px", animation: "spin 0.7s linear infinite" }} />
            <p style={{ opacity: 0.3, fontSize: 13 }}>Memuat data dari Supabase...</p>
          </div>
        ) : (
          <div className="tab-anim" key={activeTab}>

            {/* ══ OVERVIEW ══════════════════════════════════════════ */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14 }}>
                  <StatCard icon="👥" label="Total User"     value={regularUsers.length}     color="#06b6d4" sub={`${activeUserIds.size} aktif`} />
                  <StatCard icon="✅" label="Lesson Selesai" value={completedProgress.length} color="#22c55e" />
                  <StatCard icon="🔖" label="Bookmark"       value={bookmarks.length}         color={GOLD}   />
                  <StatCard icon="📖" label="Total Lesson"   value={totalLessons}             color="#a78bfa" />
                  <StatCard icon="⚡" label="User Aktif"     value={activeUserIds.size}        color="#f97316" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <Card style={{ padding: "22px" }}>
                    <SectionTitle sub="Lesson diselesaikan per modul">📚 Popularitas Modul</SectionTitle>
                    {liveModules.map((m) => {
                      const done = moduleLessonsDone[m.id] || 0;
                      const max = m.lessons.length * Math.max(regularUsers.length, 1);
                      const pct = max > 0 ? Math.min(100, Math.round((done / max) * 100)) : 0;
                      return (
                        <div key={m.id} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginBottom: 6 }}>
                            <span style={{ opacity: 0.6 }}>{m.icon} {m.title}</span>
                            <span style={{ color: m.accent, fontWeight: 800, fontFamily: "monospace", fontSize: 13 }}>{done}</span>
                          </div>
                          <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: `linear-gradient(to right, ${m.accent}, ${m.accent}88)`, transition: "width 1s ease" }} />
                          </div>
                        </div>
                      );
                    })}
                  </Card>
                  <Card style={{ padding: "22px" }}>
                    <SectionTitle sub="Berdasarkan jumlah bookmark">🔥 Artikel Terpopuler</SectionTitle>
                    {Object.entries(articleBmCount).length === 0 ? (
                      <div style={{ textAlign: "center", padding: "32px 0", opacity: 0.25 }}><div style={{ fontSize: 32, marginBottom: 8 }}>🔖</div><p style={{ fontSize: 12 }}>Belum ada bookmark</p></div>
                    ) : Object.entries(articleBmCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([aid, count], i) => {
                      const art = liveArticles.find((a) => a.id === Number(aid));
                      return (
                        <div key={aid} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 13 }}>
                          <span style={{ fontSize: 10, opacity: 0.2, width: 18, fontFamily: "monospace", fontWeight: 800 }}>#{i + 1}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art?.title || `Artikel #${aid}`}</div>
                            {art && <span style={{ fontSize: 10, color: art.catColor, fontWeight: 600 }}>{art.category}</span>}
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: GOLD, background: `${GOLD}15`, padding: "3px 9px", borderRadius: 99, flexShrink: 0 }}>🔖 {count}</span>
                        </div>
                      );
                    })}
                  </Card>
                </div>
                <Card>
                  <div style={{ padding: "20px 22px 16px" }}><SectionTitle sub="5 user terbaru yang bergabung">🆕 Registrasi Terbaru</SectionTitle></div>
                  {users.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", opacity: 0.25, fontSize: 13 }}>Belum ada user terdaftar.</div>
                  ) : users.slice(0, 5).map((u) => (
                    <div key={u.id} className="arow" style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 22px", borderTop: "1px solid rgba(255,255,255,0.04)", transition: "background .15s" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}30, #f97316 50)`, border: `2px solid ${GOLD}30`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: GOLD, fontSize: 14, flexShrink: 0 }}>{(u.name || "?")[0].toUpperCase()}</div>
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{u.name || "(tanpa nama)"}</div></div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: u.role === "admin" ? `${GOLD}20` : "rgba(6,182,212,0.12)", color: u.role === "admin" ? GOLD : "#06b6d4" }}>{u.role === "admin" ? "🛡 Admin" : "User"}</span>
                      <span style={{ fontSize: 11, opacity: 0.25, fontFamily: "monospace", flexShrink: 0 }}>{new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* ══ USERS ══════════════════════════════════════════════ */}
            {activeTab === "users" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", maxWidth: 360 }}>
                  <span style={{ opacity: 0.25, fontSize: 14 }}>🔍</span>
                  <input type="text" placeholder="Cari nama user..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", padding: "11px 0", fontSize: 13, color: "#f0f0f5" }} />
                  {userSearch && <button onClick={() => setUserSearch("")} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.35, color: "#f0f0f5", fontSize: 13 }}>✕</button>}
                </div>
                <div style={{ padding: "10px 16px", borderRadius: 10, background: `${GOLD}08`, border: `1px solid ${GOLD}15`, fontSize: 11, opacity: 0.7 }}>
                  💡 Set admin via SQL: <code style={{ background: `${GOLD}15`, padding: "1px 7px", borderRadius: 5, color: GOLD, fontSize: 11 }}>UPDATE profiles SET role='admin' WHERE id='uuid'</code>
                </div>
                <Card>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr style={{ background: "rgba(255,255,255,0.02)" }}>{["#", "User", "Role", "Progress", "Bookmark", "Bergabung"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                      <tbody>
                        {filteredUsers.map((u, i) => (
                          <tr key={u.id} className="arow" style={{ transition: "background .15s" }}>
                            <td style={tdS}><span style={{ opacity: 0.2, fontFamily: "monospace", fontSize: 12 }}>{i + 1}</span></td>
                            <td style={tdS}>
                              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${GOLD}25, #f9731620)`, border: `1.5px solid ${GOLD}30`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: GOLD, fontSize: 13, flexShrink: 0 }}>{(u.name || "?")[0].toUpperCase()}</div>
                                <div><div style={{ fontWeight: 600 }}>{u.name || "(tanpa nama)"}</div><div style={{ fontSize: 9, opacity: 0.2, fontFamily: "monospace", marginTop: 1 }}>{u.id.slice(0, 16)}…</div></div>
                              </div>
                            </td>
                            <td style={tdS}><span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: u.role === "admin" ? `${GOLD}18` : "rgba(6,182,212,0.1)", color: u.role === "admin" ? GOLD : "#06b6d4" }}>{u.role === "admin" ? "🛡 Admin" : "👤 User"}</span></td>
                            <td style={tdS}>
                              <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span style={{ fontWeight: 800, color: "#22c55e", fontFamily: "monospace" }}>{userProgressCount[u.id] || 0}</span><span style={{ fontSize: 10, opacity: 0.3 }}>/ {totalLessons}</span></div>
                              <div style={{ marginTop: 5, height: 3, borderRadius: 99, width: 90, background: "rgba(255,255,255,0.06)" }}><div style={{ height: "100%", borderRadius: 99, width: `${Math.min(100, ((userProgressCount[u.id] || 0) / totalLessons) * 100)}%`, background: "linear-gradient(to right,#22c55e,#06b6d4)" }} /></div>
                            </td>
                            <td style={tdS}><span style={{ fontWeight: 800, color: GOLD, fontFamily: "monospace" }}>{userBookmarkCount[u.id] || 0}</span></td>
                            <td style={tdS}><span style={{ opacity: 0.3, fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>{new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}</span></td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && <tr><td colSpan={6} style={{ padding: "48px", textAlign: "center", opacity: 0.25, fontSize: 13 }}>{userSearch ? `Tidak ada user "${userSearch}"` : "Belum ada user."}</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* ══ PROGRESS ══════════════════════════════════════════ */}
            {activeTab === "progress" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {liveModules.map((m) => {
                  const mp = completedProgress.filter((p) => p.module_id === m.id);
                  const uniqueStarted = new Set(mp.map((p) => p.user_id)).size;
                  const fullyDone = regularUsers.filter((u) => completedProgress.filter((p) => p.user_id === u.id && p.module_id === m.id).length >= m.lessons.length).length;
                  const rate = regularUsers.length > 0 ? Math.round((fullyDone / regularUsers.length) * 100) : 0;
                  return (
                    <Card key={m.id} style={{ padding: "24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 14, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", background: `${m.accent}15`, border: `1px solid ${m.accent}30` }}>{m.icon}</div>
                          <div><div style={{ fontWeight: 800, fontSize: 15 }}>{m.title}</div><div style={{ fontSize: 11, opacity: 0.4, marginTop: 3 }}>{m.lessons.length} pelajaran · {m.level} · {m.dur}</div></div>
                        </div>
                        <div style={{ display: "flex", gap: 24 }}>
                          {[{ label: "Mulai", val: uniqueStarted, color: m.accent }, { label: "Selesai", val: fullyDone, color: "#22c55e" }, { label: "Rate", val: `${rate}%`, color: "#06b6d4" }].map((s) => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: "monospace", letterSpacing: "-0.5px" }}>{s.val}</div>
                              <div style={{ fontSize: 9, opacity: 0.35, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 18 }}>
                        <div style={{ height: "100%", borderRadius: 99, width: `${rate}%`, background: `linear-gradient(to right,${m.accent},#06b6d4)`, transition: "width 1s ease" }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(145px,1fr))", gap: 8 }}>
                        {m.lessons.map((lesson, idx) => {
                          const done = completedProgress.filter((p) => p.module_id === m.id && p.lesson_idx === idx).length;
                          const pct = regularUsers.length > 0 ? Math.round((done / regularUsers.length) * 100) : 0;
                          return (
                            <div key={idx} style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                              <div style={{ fontSize: 10, opacity: 0.45, marginBottom: 7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{idx + 1}. {lesson.title}</div>
                              <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)", marginBottom: 5 }}><div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: m.accent }} /></div>
                              <span style={{ fontSize: 13, fontWeight: 900, color: m.accent, fontFamily: "monospace" }}>{done}</span><span style={{ fontSize: 10, opacity: 0.3 }}> user</span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ══ BOOKMARKS ═════════════════════════════════════════ */}
            {activeTab === "bookmarks" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Object.entries(articleBmCount).length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 12 }}>
                    {Object.entries(articleBmCount).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([aid, count]) => {
                      const art = liveArticles.find((a) => a.id === Number(aid));
                      return (
                        <Card key={aid} style={{ padding: "18px" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: art?.catColor || GOLD, marginBottom: 7 }}>{art?.category || "—"}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.45, marginBottom: 14 }}>{art?.title || `Artikel #${aid}`}</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}><span style={{ fontSize: 24, fontWeight: 900, color: GOLD, fontFamily: "monospace" }}>{count}</span><span style={{ fontSize: 11, opacity: 0.4 }}>bookmark</span></div>
                        </Card>
                      );
                    })}
                  </div>
                )}
                <Card>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr style={{ background: "rgba(255,255,255,0.02)" }}>{["#", "User", "Artikel", "Kategori", "Waktu"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                      <tbody>
                        {bookmarks.map((b, i) => {
                          const u = users.find((u) => u.id === b.user_id);
                          const art = liveArticles.find((a) => a.id === b.artikel_id);
                          return (
                            <tr key={i} className="arow" style={{ transition: "background .15s" }}>
                              <td style={tdS}><span style={{ opacity: 0.2, fontFamily: "monospace", fontSize: 12 }}>{i + 1}</span></td>
                              <td style={tdS}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: `${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: GOLD, fontSize: 12, flexShrink: 0 }}>{(u?.name || "?")[0].toUpperCase()}</div><span style={{ fontWeight: 500 }}>{u?.name || "(tanpa nama)"}</span></div></td>
                              <td style={{ ...tdS, maxWidth: 280 }}><div style={{ opacity: 0.75, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art?.title || `Artikel #${b.artikel_id}`}</div></td>
                              <td style={tdS}>{art && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: `${art.catColor}18`, color: art.catColor }}>{art.category}</span>}</td>
                              <td style={tdS}><span style={{ opacity: 0.3, fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>{new Date(b.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}</span></td>
                            </tr>
                          );
                        })}
                        {bookmarks.length === 0 && <tr><td colSpan={5} style={{ padding: "48px", textAlign: "center", opacity: 0.25, fontSize: 13 }}><div style={{ fontSize: 32, marginBottom: 8 }}>🔖</div>Belum ada bookmark.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* ══ KONTEN ════════════════════════════════════════════ */}
            {activeTab === "konten" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Sub-tabs */}
                <div style={{ display: "flex", gap: 8 }}>
                  {(["artikel", "modul"] as const).map((s) => (
                    <button key={s} onClick={() => setKontenSub(s)} style={{ padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "none", transition: "all .2s", background: kontenSub === s ? GOLD : "rgba(255,255,255,0.05)", color: kontenSub === s ? "#000" : "rgba(255,255,255,0.45)", boxShadow: kontenSub === s ? `0 4px 16px ${GOLD}40` : "none" }}>
                      {s === "artikel" ? "📝 Artikel" : "📚 Modul"}
                    </button>
                  ))}
                </div>

                {kontenLoading ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", border: `2px solid ${GOLD}20`, borderTop: `2px solid ${GOLD}`, margin: "0 auto 12px", animation: "spin 0.7s linear infinite" }} />
                    <p style={{ opacity: 0.3, fontSize: 13 }}>Memuat konten...</p>
                  </div>
                ) : kontenSub === "artikel" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#f0f0f5" }}>Artikel ({dbArticles.length})</div>
                        <div style={{ fontSize: 11, opacity: 0.35, marginTop: 2 }}>Artikel yang muncul di halaman /artikel dan dashboard</div>
                      </div>
                      <button onClick={() => setArticleModal({ open: true, data: null })}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${GOLD}, #f97316)`, color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                        + Buat Artikel
                      </button>
                    </div>
                    {dbArticles.length === 0 ? (
                      <div style={{ padding: "48px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
                        <div style={{ fontWeight: 700, color: "#f0f0f5", marginBottom: 8 }}>Belum ada artikel di database</div>
                        <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 16 }}>Artikel dummy masih ditampilkan. Buat artikel pertama untuk menggantinya.</div>
                        <button onClick={() => setArticleModal({ open: true, data: null })} style={{ padding: "10px 20px", borderRadius: 10, background: `${GOLD}18`, border: `1px solid ${GOLD}40`, color: GOLD, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Buat Artikel Pertama</button>
                      </div>
                    ) : (
                      <Card>
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead><tr style={{ background: "rgba(255,255,255,0.02)" }}>{["#", "Judul", "Kategori", "Penulis", "Status", "Aksi"].map((h) => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                            <tbody>
                              {dbArticles.map((a, i) => (
                                <tr key={a.id} className="arow" style={{ transition: "background .15s" }}>
                                  <td style={tdS}><span style={{ opacity: 0.25, fontFamily: "monospace", fontSize: 12 }}>{i + 1}</span></td>
                                  <td style={{ ...tdS, maxWidth: 280 }}>
                                    <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                                    <div style={{ fontSize: 10, opacity: 0.35, marginTop: 2 }}>⏱ {a.read_time}</div>
                                  </td>
                                  <td style={tdS}><span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: `${a.cat_color}18`, color: a.cat_color }}>{a.category}</span></td>
                                  <td style={tdS}><span style={{ opacity: 0.6, fontSize: 12 }}>{a.author}</span></td>
                                  <td style={tdS}><span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: a.published ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)", color: a.published ? "#22c55e" : "#f87171" }}>{a.published ? "✓ Publik" : "Disembunyikan"}</span></td>
                                  <td style={tdS}>
                                    <div style={{ display: "flex", gap: 6 }}>
                                      <button onClick={() => setArticleModal({ open: true, data: a })} style={{ padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: `1px solid ${GOLD}30`, background: `${GOLD}10`, color: GOLD, cursor: "pointer" }}>✎ Edit</button>
                                      <button onClick={() => deleteArticle(a.id)} style={{ padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer" }}>🗑</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    )}
                  </div>
                ) : (
                  // Modul tab
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#f0f0f5" }}>Modul ({dbModules.length})</div>
                        <div style={{ fontSize: 11, opacity: 0.35, marginTop: 2 }}>Modul yang muncul di halaman /edukasi</div>
                      </div>
                      <button onClick={() => setModuleModal({ open: true, data: null })}
                        style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${GOLD}, #f97316)`, color: "#000", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                        + Buat Modul
                      </button>
                    </div>
                    {dbModules.length === 0 ? (
                      <div style={{ padding: "48px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)" }}>
                        <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
                        <div style={{ fontWeight: 700, color: "#f0f0f5", marginBottom: 8 }}>Belum ada modul di database</div>
                        <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 16 }}>Modul dummy masih ditampilkan. Buat modul pertama untuk menggantinya.</div>
                        <button onClick={() => setModuleModal({ open: true, data: null })} style={{ padding: "10px 20px", borderRadius: 10, background: `${GOLD}18`, border: `1px solid ${GOLD}40`, color: GOLD, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Buat Modul Pertama</button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {dbModules.map((m, i) => (
                          <Card key={m.id} style={{ padding: "18px 22px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                              <div style={{ width: 44, height: 44, borderRadius: 12, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", background: `${m.accent}15`, border: `1px solid ${m.accent}30`, flexShrink: 0 }}>{m.icon}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                                  <span style={{ fontWeight: 800, fontSize: 14, color: "#f0f0f5" }}>{m.num}. {m.title}</span>
                                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: `${m.level_color}15`, color: m.level_color }}>{m.level}</span>
                                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: m.published ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)", color: m.published ? "#22c55e" : "#f87171" }}>{m.published ? "✓ Publik" : "Hidden"}</span>
                                </div>
                                <div style={{ fontSize: 11, opacity: 0.4, display: "flex", gap: 12 }}>
                                  <span>⏱ {m.duration}</span>
                                  <span>📖 {m.lessons?.length || 0} pelajaran</span>
                                </div>
                                {m.lessons && m.lessons.length > 0 && (
                                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {m.lessons.slice(0, 4).map((l: any, li: number) => (
                                      <span key={li} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", opacity: 0.6 }}>{l.title}</span>
                                    ))}
                                    {m.lessons.length > 4 && <span style={{ fontSize: 9, opacity: 0.3 }}>+{m.lessons.length - 4} lagi</span>}
                                  </div>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                <button onClick={() => setModuleModal({ open: true, data: m })} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: `1px solid ${GOLD}30`, background: `${GOLD}10`, color: GOLD, cursor: "pointer" }}>✎ Edit</button>
                                <button onClick={() => deleteModule(m.id)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer" }}>🗑</button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Tab Diskusi ── */}
            {activeTab === "diskusi" && (
              <div style={{ padding: "0 4px" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="Cari komentar atau nama user..."
                    value={discSearch}
                    onChange={e => setDiscSearch(e.target.value)}
                    style={{ flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f0f0f5", fontSize: 13, outline: "none", fontFamily: "inherit" }}
                  />
                  <button onClick={loadDiscussions} style={{ padding: "9px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, border: `1px solid ${GOLD}30`, background: `${GOLD}10`, color: GOLD, cursor: "pointer", fontFamily: "inherit" }}>↻ Refresh</button>
                </div>
                {discLoading ? (
                  <div style={{ textAlign: "center", padding: "40px 0", opacity: 0.4, color: "#f0f0f5" }}>Memuat diskusi...</div>
                ) : discussions.filter(d => { if (!discSearch) return true; const q = discSearch.toLowerCase(); return d.body?.toLowerCase().includes(q) || d.profile?.name?.toLowerCase().includes(q); }).length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", opacity: 0.3, color: "#f0f0f5" }}>Belum ada diskusi</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {discussions
                      .filter(d => { if (!discSearch) return true; const q = discSearch.toLowerCase(); return d.body?.toLowerCase().includes(q) || d.profile?.name?.toLowerCase().includes(q); })
                      .map((d: any) => (
                        <div key={d.id} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: `${GOLD}18`, border: `1px solid ${GOLD}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: GOLD }}>
                            {(d.profile?.name || "?")?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5" }}>{d.profile?.name || "Pengguna"}</span>
                              {d.parent_id && <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 5, background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>Reply</span>}
                              <span style={{ fontSize: 11, opacity: 0.35, color: "#f0f0f5" }}>{new Date(d.created_at).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                              {d.lesson?.title && <span style={{ fontSize: 10, opacity: 0.4, color: "#f0f0f5" }}>· {d.lesson.title}</span>}
                            </div>
                            <p style={{ fontSize: 13, color: "#f0f0f5", opacity: 0.7, lineHeight: 1.6, margin: 0, wordBreak: "break-word" }}>{d.body}</p>
                          </div>
                          <button onClick={() => deleteDiscussion(d.id)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer", flexShrink: 0, fontFamily: "inherit" }}>🗑 Hapus</button>
                        </div>
                      ))}
                  </div>
                )}
                {!discLoading && discussions.length > 0 && (
                  <div style={{ marginTop: 14, fontSize: 12, opacity: 0.35, color: "#f0f0f5", textAlign: "right" }}>Total {discussions.length} komentar</div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Article Modal */}
      {articleModal.open && (
        <ArticleModal article={articleModal.data} onClose={() => setArticleModal({ open: false, data: null })} onSaved={loadKonten} />
      )}

      {/* Module Modal */}
      {moduleModal.open && (
        <ModuleModal mod={moduleModal.data} onClose={() => setModuleModal({ open: false, data: null })} onSaved={loadKonten} />
      )}
    </div>
  );
}
