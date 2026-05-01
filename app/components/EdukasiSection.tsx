"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchModules, type Module } from "../lib/supabase-data";

export default function EdukasiSection() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchModules().then((data) => {
      setModules(data);
      setLoading(false);
      setTimeout(() => setVisible(true), 50);
    });
  }, []);

  return (
    <section id="edukasi" style={{ padding: "96px 16px", background: "color-mix(in srgb, var(--bg-page,#050810) 80%, transparent)" }}>
      <style>{`
        @keyframes fadeUpMod {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: none; }
        }
        .modul-card-wrap { animation: fadeUpMod .55s cubic-bezier(.16,1,.3,1) both; }
        .modul-card-wrap:nth-child(1) { animation-delay: .05s }
        .modul-card-wrap:nth-child(2) { animation-delay: .13s }
        .modul-card-wrap:nth-child(3) { animation-delay: .21s }
        .modul-card-wrap:nth-child(4) { animation-delay: .29s }
        .modul-card-wrap:nth-child(5) { animation-delay: .35s }
        .modul-card-wrap:nth-child(6) { animation-delay: .41s }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
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

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(167,139,250,0.2)", borderTop: "2px solid #a78bfa", margin: "0 auto 12px", animation: "spin 0.7s linear infinite" }} />
            <p style={{ color: "var(--text-main,#e8eaf0)", fontSize: 13 }}>Memuat modul...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && modules.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.4 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <p style={{ color: "var(--text-main,#e8eaf0)", fontSize: 14 }}>Belum ada modul. Admin dapat menambahkan lewat dashboard.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && modules.length > 0 && visible && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
            {modules.slice(0, 6).map((m) => (
              <div key={m.id} className="modul-card-wrap">
                <Link href={`/edukasi/${m.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                  <ModuleCard m={m} />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Lihat Semua */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/edukasi" style={{
            display: "inline-block", padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700,
            background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.28)",
            color: "#a78bfa", textDecoration: "none", transition: "all .2s",
          }}>
            Lihat Semua Modul →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ModuleCard({ m }: { m: Module }) {
  const accent = m.accent || "#f59e0b";
  return (
    <div
      className="grad-border p-5"
      style={{ transition: "transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease", height: "100%", display: "flex", flexDirection: "column" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.3), 0 0 0 1px ${accent}30`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", background: `color-mix(in srgb, ${accent} 12%, transparent)`, border: `1px solid ${accent}30`, flexShrink: 0 }}>
          {m.icon}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: `color-mix(in srgb, ${m.levelColor} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${m.levelColor} 30%, transparent)`, color: m.levelColor }}>{m.level}</span>
          <span style={{ fontFamily: "monospace", fontSize: 10, opacity: 0.3, color: "var(--text-main,#e8eaf0)" }}>{m.num}</span>
        </div>
      </div>

      <h3 style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>{m.title}</h3>
      <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.45, lineHeight: 1.6, marginBottom: 12, flex: 1 }}>{m.desc}</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 14, fontFamily: "monospace", fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.3 }}>
        <span>⏱ {m.dur}</span>
        <span>📚 {m.lessons.length} pelajaran</span>
      </div>

      {m.lessons.slice(0, 3).map((l, j) => (
        <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, marginBottom: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{j + 1}</div>
          <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.55 }}>{l.title}</span>
        </div>
      ))}
      {m.lessons.length > 3 && <div style={{ fontSize: 11, opacity: 0.25, paddingLeft: 28, marginBottom: 6 }}>+{m.lessons.length - 3} pelajaran lagi</div>}

      <div style={{ marginTop: 14, padding: "10px 0", borderRadius: 10, textAlign: "center", fontSize: 13, fontWeight: 700, background: `color-mix(in srgb, ${accent} 10%, transparent)`, border: `1px solid ${accent}30`, color: accent }}>
        Mulai Belajar →
      </div>
    </div>
  );
}
