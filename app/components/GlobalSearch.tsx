"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";

interface SearchResult {
  type: "modul" | "lesson" | "artikel";
  id: number;
  parentId?: number;
  title: string;
  subtitle: string;
  url: string;
  accent?: string;
}

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const sb = createClient();
    const ilike = `%${q}%`;

    const [{ data: articles }, { data: modules }, { data: lessons }] = await Promise.all([
      sb.from("articles").select("id,title,category,cat_color").ilike("title", ilike).eq("published", true).limit(4),
      sb.from("modules").select("id,title,description,accent,num").ilike("title", ilike).eq("published", true).limit(4),
      sb.from("module_lessons").select("id,title,duration,module_id").ilike("title", ilike).limit(4),
    ]);

    const res: SearchResult[] = [];

    (modules || []).forEach((m: any) => res.push({
      type: "modul", id: m.id, title: m.title,
      subtitle: m.description || `Modul ${m.num}`,
      url: `/edukasi/${m.id}`, accent: m.accent || "#a78bfa",
    }));

    (lessons || []).forEach((l: any) => res.push({
      type: "lesson", id: l.id, parentId: l.module_id,
      title: l.title, subtitle: `Lesson · ${l.duration}`,
      url: `/edukasi/${l.module_id}/lesson/${l.id}`,
    }));

    (articles || []).forEach((a: any) => res.push({
      type: "artikel", id: a.id, title: a.title,
      subtitle: a.category || "Artikel",
      url: `/artikel/${a.id}`, accent: a.cat_color || "#22c55e",
    }));

    setResults(res);
    setSelected(0);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  const navigate = (url: string) => { router.push(url); onClose(); };

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && results[selected]) navigate(results[selected].url);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, selected]);

  if (!open) return null;

  const typeIcon: Record<string, string> = { modul: "📚", lesson: "▶", artikel: "📰" };
  const typeLabel: Record<string, string> = { modul: "Modul", lesson: "Lesson", artikel: "Artikel" };
  const typeColor: Record<string, string> = { modul: "#a78bfa", lesson: "#06b6d4", artikel: "#22c55e" };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "80px 16px 16px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: "100%", maxWidth: 580, borderRadius: 18, background: "var(--bg-card,#13141a)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", overflow: "hidden" }}>
        {/* Input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 18, opacity: 0.4 }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari modul, lesson, artikel..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 15, color: "var(--text-main,#e8eaf0)", fontFamily: "inherit" }}
          />
          {loading && (
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(167,139,250,0.2)", borderTop: "2px solid #a78bfa", animation: "spin .7s linear infinite" }} />
          )}
          <button onClick={onClose} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontFamily: "inherit" }}>ESC</button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {query.length >= 2 && !loading && results.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-main,#e8eaf0)", opacity: 0.3, fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
              Tidak ada hasil untuk &ldquo;{query}&rdquo;
            </div>
          )}
          {results.length > 0 && (
            <div style={{ padding: 8 }}>
              {results.map((r, i) => (
                <button
                  key={`${r.type}-${r.id}`}
                  onClick={() => navigate(r.url)}
                  onMouseEnter={() => setSelected(i)}
                  style={{
                    width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 11, border: "none", cursor: "pointer",
                    background: i === selected ? "rgba(255,255,255,0.06)" : "transparent",
                    transition: "background .1s",
                  }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: `${typeColor[r.type]}15`, border: `1px solid ${typeColor[r.type]}25` }}>
                    {typeIcon[r.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main,#e8eaf0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.38, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.subtitle}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: `${typeColor[r.type]}15`, color: typeColor[r.type], flexShrink: 0 }}>{typeLabel[r.type]}</span>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div style={{ padding: "24px 20px" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)", fontWeight: 700, marginBottom: 12 }}>PINTASAN</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[{ icon: "📚", label: "Semua Modul", url: "/edukasi" }, { icon: "📰", label: "Semua Artikel", url: "/artikel" }, { icon: "👤", label: "Profil Akun", url: "/akun" }].map(s => (
                  <button key={s.url} onClick={() => navigate(s.url)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "left", color: "var(--text-main,#e8eaf0)", fontSize: 13, opacity: 0.65, transition: "opacity .15s" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.65")}>
                    <span>{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{ padding: "10px 18px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 14, justifyContent: "flex-end" }}>
          {[["↑↓", "navigasi"], ["↵", "buka"], ["ESC", "tutup"]].map(([k, l]) => (
            <span key={k} style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 5 }}>
              <kbd style={{ padding: "1px 5px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", fontFamily: "monospace", fontSize: 10 }}>{k}</kbd> {l}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
