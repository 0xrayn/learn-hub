"use client";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MODULES } from "../lib/data";

const done = MODULES.filter(m => m.done).length;

export default function EdukasiPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>

        {/* Page header */}
        <div style={{ padding: "52px 20px 44px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "color-mix(in srgb, #a78bfa 4%, transparent)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, marginBottom: 18, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>
            🎓 {MODULES.length} Modul Belajar
          </div>
          <h1 className="font-black" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: "var(--text-main,#e8eaf0)", marginBottom: 10, lineHeight: 1.1 }}>
            Modul <span style={{ color: "#a78bfa" }}>Edukasi</span> Bitcoin
          </h1>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.45, maxWidth: 440, margin: "0 auto 28px", fontSize: 14 }}>
            Dari nol hingga mahir. Kurikulum disusun sistematis untuk pemula Indonesia.
          </p>

          {/* Progress */}
          <div style={{ maxWidth: 440, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
              <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.5 }}>Progress kamu</span>
              <span className="font-mono-styled" style={{ color: "#a78bfa", fontWeight: 700 }}>{done}/{MODULES.length} Selesai</span>
            </div>
            <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${(done / MODULES.length) * 100}%`, background: "linear-gradient(to right, #8b5cf6, #06b6d4)", boxShadow: "0 0 10px rgba(139,92,246,0.5)", transition: "width 1s ease" }} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
            {[
              { v: `${MODULES.length}`, l: "Modul", icon: "📚" },
              { v: `${MODULES.reduce((a, m) => a + m.lessons.length, 0)}`, l: "Pelajaran", icon: "📖" },
              { v: `${MODULES.reduce((a, m) => a + parseInt(m.dur), 0)}+`, l: "Menit", icon: "⏱" },
              { v: "Gratis", l: "Untuk Semua", icon: "🎁" },
            ].map(s => (
              <div key={s.l} className="grad-border" style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, flex: "1 1 120px" }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <div>
                  <div className="font-mono-styled" style={{ fontSize: 18, fontWeight: 900, color: "#a78bfa" }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.4 }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Module grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
            {MODULES.map(m => (
              <Link key={m.id} href={`/edukasi/${m.id}`} style={{ textDecoration: "none" }}>
                <div className="grad-border p-5" style={{ cursor: "pointer", transition: "transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s", height: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 18px 44px rgba(0,0,0,0.28), 0 0 0 1px ${m.accent}25`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>

                  {/* Top */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 13, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", background: m.done ? "rgba(34,197,94,0.12)" : `color-mix(in srgb, ${m.accent} 12%, transparent)`, border: `1px solid ${m.done ? "rgba(34,197,94,0.25)" : m.accent + "30"}` }}>
                      {m.done ? "✅" : m.icon}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: `color-mix(in srgb, ${m.levelColor} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${m.levelColor} 30%, transparent)`, color: m.levelColor }}>{m.level}</span>
                      <span className="font-mono-styled" style={{ fontSize: 9, opacity: 0.28, color: "var(--text-main,#e8eaf0)" }}>{m.num}</span>
                    </div>
                  </div>

                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "var(--text-main,#e8eaf0)", marginBottom: 7, lineHeight: 1.3 }}>{m.title}</h3>
                  <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.42, lineHeight: 1.6, marginBottom: 12 }}>{m.desc}</p>

                  <div className="font-mono-styled" style={{ display: "flex", gap: 14, fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.3, marginBottom: 14 }}>
                    <span>⏱ {m.dur}</span>
                    <span>📚 {m.lessons.length} pelajaran</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                    {m.lessons.slice(0, 3).map((l, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: l.done ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)", color: l.done ? "#22c55e" : "rgba(255,255,255,0.3)" }}>
                          {l.done ? "✓" : j + 1}
                        </div>
                        <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.52 }}>{l.title}</span>
                      </div>
                    ))}
                    {m.lessons.length > 3 && <div style={{ fontSize: 11, opacity: 0.25, color: "var(--text-main,#e8eaf0)", paddingLeft: 26 }}>+{m.lessons.length - 3} lagi...</div>}
                  </div>

                  <div style={{ padding: "9px 0", borderRadius: 9, textAlign: "center", fontSize: 12, fontWeight: 700, background: m.done ? "rgba(34,197,94,0.08)" : `color-mix(in srgb, ${m.accent} 10%, transparent)`, border: `1px solid ${m.done ? "rgba(34,197,94,0.25)" : m.accent + "30"}`, color: m.done ? "#22c55e" : m.accent }}>
                    {m.done ? "✓ Ulangi Modul" : "Mulai Belajar →"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
