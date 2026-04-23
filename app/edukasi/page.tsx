"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MODULES } from "../lib/data";
import { useAuth } from "../context/AuthContext";

const done = MODULES.filter(m => m.done).length;
// Modul 1-2 gratis, 3-6 perlu login
const FREE_MODULES = [1, 2];

export default function EdukasiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleModuleClick = (moduleId: number) => {
    const isFree = FREE_MODULES.includes(moduleId);
    if (!isFree && !user) {
      router.push("/register");
      return;
    }
    router.push(`/edukasi/${moduleId}`);
  };

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>

        {/* Header */}
        <div style={{ padding: "52px 20px 44px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "color-mix(in srgb, #a78bfa 4%, transparent)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, marginBottom: 18, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>
            🎓 {MODULES.length} Modul Belajar
          </div>
          <h1 className="font-black" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", color: "var(--text-main,#e8eaf0)", marginBottom: 10, lineHeight: 1.1 }}>
            Modul <span style={{ color: "#a78bfa" }}>Edukasi</span> Bitcoin
          </h1>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.45, maxWidth: 440, margin: "0 auto 28px", fontSize: 14 }}>
            Dari nol hingga mahir. Modul 1-2 gratis, modul lanjutan perlu akun.
          </p>

          {/* Login banner if not logged in */}
          {!loading && !user && (
            <div style={{ maxWidth: 440, margin: "0 auto", padding: "14px 20px", borderRadius: 12, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.22)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.7 }}>🔒 Daftar gratis untuk unlock semua modul</span>
              <div style={{ display: "flex", gap: 8 }}>
                <Link href="/register" style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "#a78bfa", color: "#000", textDecoration: "none" }}>Daftar Gratis</Link>
                <Link href="/login" style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,0.08)", color: "var(--text-main,#e8eaf0)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>Masuk</Link>
              </div>
            </div>
          )}

          {user && (
            <div style={{ maxWidth: 440, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.5 }}>Progress kamu</span>
                <span className="font-mono-styled" style={{ color: "#a78bfa", fontWeight: 700 }}>{done}/{MODULES.length} Selesai</span>
              </div>
              <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, width: `${(done / MODULES.length) * 100}%`, background: "linear-gradient(to right, #8b5cf6, #06b6d4)", boxShadow: "0 0 10px rgba(139,92,246,0.5)", transition: "width 1s ease" }} />
              </div>
            </div>
          )}
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Stats */}
          <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
            {[
              { v: `${MODULES.length}`, l: "Modul", icon: "📚" },
              { v: `${MODULES.reduce((a, m) => a + m.lessons.length, 0)}`, l: "Pelajaran", icon: "📖" },
              { v: `${MODULES.reduce((a, m) => a + parseInt(m.dur), 0)}+`, l: "Menit", icon: "⏱" },
              { v: FREE_MODULES.length.toString(), l: "Modul Gratis", icon: "🎁" },
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
            {MODULES.map(m => {
              const isFree = FREE_MODULES.includes(m.id);
              const isLocked = !isFree && !user;

              return (
                <div key={m.id}
                  onClick={() => handleModuleClick(m.id)}
                  style={{ cursor: "pointer", position: "relative" }}
                >
                  <div className="grad-border p-5" style={{
                    transition: "transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s",
                    height: "100%", opacity: isLocked ? 0.65 : 1,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 18px 44px rgba(0,0,0,0.28), 0 0 0 1px ${isLocked ? "#a78bfa25" : m.accent + "25"}`; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    {/* Lock overlay badge */}
                    {isLocked && (
                      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", fontSize: 10, fontWeight: 700, color: "#a78bfa" }}>
                        🔒 Login dulu
                      </div>
                    )}
                    {isFree && (
                      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 20, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", fontSize: 10, fontWeight: 700, color: "#22c55e" }}>
                        🆓 Gratis
                      </div>
                    )}

                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ width: 50, height: 50, borderRadius: 13, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", background: isLocked ? "rgba(167,139,250,0.1)" : m.done ? "rgba(34,197,94,0.12)" : `color-mix(in srgb, ${m.accent} 12%, transparent)`, border: `1px solid ${isLocked ? "rgba(167,139,250,0.2)" : m.done ? "rgba(34,197,94,0.25)" : m.accent + "30"}` }}>
                        {isLocked ? "🔒" : m.done ? "✅" : m.icon}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: `color-mix(in srgb, ${m.levelColor} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${m.levelColor} 30%, transparent)`, color: m.levelColor, marginTop: 28 }}>{m.level}</span>
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
                          <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: isLocked ? "rgba(255,255,255,0.04)" : l.done ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)", color: isLocked ? "rgba(255,255,255,0.2)" : l.done ? "#22c55e" : "rgba(255,255,255,0.3)" }}>
                            {isLocked ? "–" : l.done ? "✓" : j + 1}
                          </div>
                          <span style={{ color: "var(--text-main,#e8eaf0)", opacity: isLocked ? 0.3 : 0.52 }}>{l.title}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: "9px 0", borderRadius: 9, textAlign: "center", fontSize: 12, fontWeight: 700, background: isLocked ? "rgba(167,139,250,0.1)" : m.done ? "rgba(34,197,94,0.08)" : `color-mix(in srgb, ${m.accent} 10%, transparent)`, border: `1px solid ${isLocked ? "rgba(167,139,250,0.25)" : m.done ? "rgba(34,197,94,0.25)" : m.accent + "30"}`, color: isLocked ? "#a78bfa" : m.done ? "#22c55e" : m.accent }}>
                      {isLocked ? "🔒 Daftar untuk Unlock" : m.done ? "✓ Ulangi Modul" : "Mulai Belajar →"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA banner if not logged in */}
          {!loading && !user && (
            <div style={{ marginTop: 40, padding: "36px 28px", borderRadius: 20, textAlign: "center", background: "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(6,182,212,0.04))", border: "1px solid rgba(167,139,250,0.2)" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
              <h3 style={{ fontWeight: 800, fontSize: 20, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>Unlock Semua Modul — Gratis!</h3>
              <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.45, marginBottom: 24 }}>Daftar sekarang dan akses penuh 12 modul + 50+ artikel tanpa biaya.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/register" style={{ padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #8b5cf6)", color: "#fff", textDecoration: "none" }}>Daftar Gratis Sekarang</Link>
                <Link href="/login" style={{ padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-main,#e8eaf0)", textDecoration: "none" }}>Sudah punya akun</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
