"use client";
import { use } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { MODULES } from "../../lib/data";

export default function EdukasiDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const modul = MODULES.find(m => m.id === Number(id));
  if (!modul) return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.5 }}>Modul tidak ditemukan.</p>
          <Link href="/edukasi" style={{ color: "var(--color-primary,#f59e0b)", textDecoration: "none", marginTop: 16, display: "inline-block" }}>← Kembali ke Edukasi</Link>
        </div>
      </main>
      <Footer />
    </>
  );

  const prev = MODULES.find(m => m.id === modul.id - 1);
  const next = MODULES.find(m => m.id === modul.id + 1);
  const totalDone = modul.lessons.filter(l => l.done).length;

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>

        {/* Hero banner */}
        <div style={{ padding: "48px 20px 40px", background: `color-mix(in srgb, ${modul.accent} 6%, transparent)`, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 12, flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, textDecoration: "none" }}>Beranda</Link>
              <span style={{ opacity: 0.2, color: "var(--text-main,#e8eaf0)" }}>›</span>
              <Link href="/edukasi" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, textDecoration: "none" }}>Edukasi</Link>
              <span style={{ opacity: 0.2, color: "var(--text-main,#e8eaf0)" }}>›</span>
              <span style={{ color: modul.accent, fontWeight: 600 }}>{modul.title}</span>
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: 68, height: 68, borderRadius: 18, fontSize: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: modul.done ? "rgba(34,197,94,0.12)" : `color-mix(in srgb, ${modul.accent} 12%, transparent)`, border: `1px solid ${modul.done ? "rgba(34,197,94,0.3)" : modul.accent + "40"}` }}>
                {modul.done ? "✅" : modul.icon}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: `color-mix(in srgb, ${modul.levelColor} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${modul.levelColor} 30%, transparent)`, color: modul.levelColor }}>{modul.level}</span>
                  <span className="font-mono-styled" style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, opacity: 0.4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-main,#e8eaf0)" }}>Modul {modul.num}</span>
                </div>
                <h1 className="font-black" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "var(--text-main,#e8eaf0)", lineHeight: 1.2, marginBottom: 10 }}>{modul.title}</h1>
                <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.55, lineHeight: 1.7 }}>{modul.longDesc}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 28, marginTop: 28, flexWrap: "wrap" }}>
              {[{ icon: "⏱", v: modul.dur, l: "Durasi" }, { icon: "📚", v: `${modul.lessons.length}`, l: "Pelajaran" }, { icon: "✅", v: `${totalDone}/${modul.lessons.length}`, l: "Selesai" }].map(s => (
                <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div>
                    <div className="font-mono-styled" style={{ fontSize: 15, fontWeight: 800, color: modul.accent }}>{s.v}</div>
                    <div style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)" }}>{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Progress */}
          <div className="grad-border" style={{ padding: "18px 22px", marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.6, fontWeight: 600 }}>Progress Modul</span>
              <span className="font-mono-styled" style={{ color: modul.accent, fontWeight: 700 }}>{totalDone}/{modul.lessons.length} ({Math.round(totalDone / modul.lessons.length * 100)}%)</span>
            </div>
            <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${(totalDone / modul.lessons.length) * 100}%`, background: `linear-gradient(to right, ${modul.accent}, #06b6d4)`, transition: "width 0.8s ease" }} />
            </div>
          </div>

          {/* Lessons */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 14 }}>Daftar Pelajaran</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
            {modul.lessons.map((lesson, i) => (
              <div key={i} className="grad-border" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer", opacity: lesson.done || i === totalDone ? 1 : 0.55 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: lesson.done ? "rgba(34,197,94,0.15)" : i === totalDone ? `color-mix(in srgb, ${modul.accent} 15%, transparent)` : "rgba(255,255,255,0.05)", border: lesson.done ? "1px solid rgba(34,197,94,0.3)" : i === totalDone ? `1px solid ${modul.accent}40` : "1px solid rgba(255,255,255,0.06)", color: lesson.done ? "#22c55e" : i === totalDone ? modul.accent : "rgba(255,255,255,0.3)" }}>
                  {lesson.done ? "✓" : i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-main,#e8eaf0)" }}>{lesson.title}</div>
                  <div className="font-mono-styled" style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)", marginTop: 2 }}>⏱ {lesson.dur}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, flexShrink: 0, background: lesson.done ? "rgba(34,197,94,0.1)" : i === totalDone ? `color-mix(in srgb, ${modul.accent} 10%, transparent)` : "rgba(255,255,255,0.04)", color: lesson.done ? "#22c55e" : i === totalDone ? modul.accent : "rgba(255,255,255,0.25)" }}>
                  {lesson.done ? "Selesai" : i === totalDone ? "Mulai →" : "Terkunci"}
                </span>
              </div>
            ))}
          </div>

          {/* Start button */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <button style={{ padding: "13px 36px", borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: "pointer", background: modul.done ? "rgba(34,197,94,0.1)" : `linear-gradient(135deg, ${modul.accent}, color-mix(in srgb, ${modul.accent} 70%, #f97316))`, border: modul.done ? "1px solid rgba(34,197,94,0.3)" : "none", color: modul.done ? "#22c55e" : "#000", boxShadow: modul.done ? "none" : `0 8px 28px color-mix(in srgb, ${modul.accent} 35%, transparent)` }}>
              {modul.done ? "✓ Ulangi Modul" : `🚀 Mulai Modul ${modul.num}`}
            </button>
          </div>

          {/* Prev/Next */}
          <div style={{ display: "grid", gridTemplateColumns: prev && next ? "1fr 1fr" : "1fr", gap: 12 }}>
            {prev && (
              <Link href={`/edukasi/${prev.id}`} style={{ textDecoration: "none" }}>
                <div className="grad-border" style={{ padding: "14px 18px", cursor: "pointer" }}>
                  <div style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)", marginBottom: 5 }}>← Sebelumnya</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>{prev.title}</div>
                </div>
              </Link>
            )}
            {next && (
              <Link href={`/edukasi/${next.id}`} style={{ textDecoration: "none" }}>
                <div className="grad-border" style={{ padding: "14px 18px", cursor: "pointer", textAlign: prev ? "right" : "left" }}>
                  <div style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)", marginBottom: 5 }}>Berikutnya →</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>{next.title}</div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
