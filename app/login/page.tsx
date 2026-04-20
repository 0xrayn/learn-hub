"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setError("Demo mode: belum terhubung ke backend.");
  };

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: "100vh", paddingTop: 56,
        display: "flex", position: "relative", overflow: "hidden",
      }}>
        {/* Left panel — decorative, hidden on mobile */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px", borderRight: "1px solid rgba(255,255,255,0.05)", position: "relative" }} className="hidden lg:flex">
          {/* Glow blob */}
          <div style={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 380 }}>
            {/* Logo big */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, color: "#000" }}>LH</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 22, color: "var(--text-main,#e8eaf0)", lineHeight: 1 }}>Learn<span style={{ color: "var(--color-primary,#f59e0b)" }}>Hub</span></div>
                <div style={{ fontSize: 11, opacity: 0.35, fontFamily: "monospace", color: "var(--text-main,#e8eaf0)" }}>Bitcoin Academy</div>
              </div>
            </div>
            <h2 className="font-black" style={{ fontSize: "2.4rem", color: "var(--text-main,#e8eaf0)", lineHeight: 1.1, marginBottom: 16 }}>
              Platform<br />Edukasi Bitcoin<br /><span style={{ color: "var(--color-primary,#f59e0b)" }}>Terlengkap</span>
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.45, lineHeight: 1.75, marginBottom: 36 }}>
              Bergabung dengan ribuan investor Indonesia yang belajar Bitcoin dari nol lewat konten berkualitas tinggi.
            </p>
            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "📝", title: "50+ Artikel", desc: "Konten mendalam setiap minggu" },
                { icon: "🎓", title: "12 Modul Belajar", desc: "Dari pemula ke mahir" },
                { icon: "💱", title: "Konverter Realtime", desc: "BTC ↔ IDR setiap saat" },
                { icon: "⚡", title: "Harga Live", desc: "Data langsung dari pasar" },
              ].map(f => (
                <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "color-mix(in srgb, var(--color-primary,#f59e0b) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary,#f59e0b) 20%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>{f.title}</div>
                    <div style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)" }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px", maxWidth: "100%", minWidth: 0 }}>
          <div style={{ width: "100%", maxWidth: 400 }}>

            {/* Mobile logo */}
            <div style={{ textAlign: "center", marginBottom: 32 }} className="lg:hidden">
              <div style={{ width: 48, height: 48, borderRadius: 13, margin: "0 auto 12px", background: "linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 18, color: "#000" }}>LH</div>
              <h1 className="font-black" style={{ fontSize: "1.6rem", color: "var(--text-main,#e8eaf0)" }}>Masuk ke <span style={{ color: "var(--color-primary,#f59e0b)" }}>LearnHub</span></h1>
            </div>

            <h2 className="font-black hidden lg:block" style={{ fontSize: "1.9rem", color: "var(--text-main,#e8eaf0)", marginBottom: 6 }}>Selamat Datang</h2>
            <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.4, marginBottom: 28 }} className="hidden lg:block">Masuk untuk lanjutkan belajar Bitcoin.</p>

            {/* Social */}
            <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
              {[{ icon: "G", label: "Google", c: "#ea4335" }, { icon: "𝕏", label: "Twitter", c: "#1d9bf0" }].map(s => (
                <button key={s.label} style={{ flex: 1, padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--text-main,#e8eaf0)", transition: "background .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                  <span style={{ fontWeight: 900, color: s.c }}>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.3 }}>atau email</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Email */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main,#e8eaf0)", opacity: 0.55, display: "block", marginBottom: 7, textTransform: "uppercase", letterSpacing: "0.07em" }}>Email</label>
                <div className="converter-input" style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ paddingLeft: 14, fontSize: 14, opacity: 0.3, flexShrink: 0, color: "var(--text-main,#e8eaf0)" }}>✉</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@kamu.com"
                    style={{ flex: 1, background: "transparent", border: "none", padding: "13px 14px", fontSize: 14, color: "var(--text-main,#e8eaf0)" }} />
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main,#e8eaf0)", opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.07em" }}>Password</label>
                  <Link href="#" style={{ fontSize: 11, color: "var(--color-primary,#f59e0b)", textDecoration: "none", opacity: 0.8 }}>Lupa?</Link>
                </div>
                <div className="converter-input" style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ paddingLeft: 14, fontSize: 14, opacity: 0.3, flexShrink: 0, color: "var(--text-main,#e8eaf0)" }}>🔒</span>
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                    style={{ flex: 1, background: "transparent", border: "none", padding: "13px 14px", fontSize: 14, color: "var(--text-main,#e8eaf0)" }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ paddingRight: 14, background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: 0.35, color: "var(--text-main,#e8eaf0)" }}>{showPass ? "🙈" : "👁"}</button>
                </div>
              </div>

              {error && (
                <div style={{ padding: "10px 14px", borderRadius: 9, fontSize: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171" }}>⚠ {error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "13px", borderRadius: 11, fontSize: 14, fontWeight: 800, border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "rgba(245,158,11,0.28)" : "linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)",
                color: loading ? "rgba(0,0,0,0.4)" : "#000",
                boxShadow: loading ? "none" : "0 6px 20px color-mix(in srgb, var(--color-primary,#f59e0b) 28%, transparent)",
                marginTop: 4,
              }}>
                {loading ? "Memproses..." : "Masuk Sekarang →"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.45 }}>
              Belum punya akun?{" "}
              <Link href="/register" style={{ color: "var(--color-primary,#f59e0b)", fontWeight: 700, textDecoration: "none" }}>Daftar Gratis</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
