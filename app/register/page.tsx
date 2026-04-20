"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  const strengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e", "#06b6d4"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm) { setError("Semua field wajib diisi."); return; }
    if (password !== confirm) { setError("Password tidak cocok."); return; }
    if (password.length < 8) { setError("Password minimal 8 karakter."); return; }
    if (!agree) { setError("Setujui syarat & ketentuan terlebih dahulu."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setSuccess(true);
  };

  if (success) return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 24px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🎉</div>
          <h2 className="font-black" style={{ fontSize: "2rem", color: "var(--text-main,#e8eaf0)", marginBottom: 10 }}>
            Selamat, <span style={{ color: "var(--color-primary,#f59e0b)" }}>{name.split(" ")[0]}!</span>
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.5, marginBottom: 28, lineHeight: 1.7 }}>
            Akun berhasil dibuat. Cek email untuk verifikasi, lalu mulai belajar Bitcoin!
          </p>
          <Link href="/login" style={{ display: "inline-block", padding: "13px 32px", borderRadius: 12, fontSize: 14, fontWeight: 800, background: "linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)", color: "#000", textDecoration: "none" }}>
            Masuk ke Akun →
          </Link>
        </div>
      </main>
    </>
  );

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", position: "relative", overflow: "hidden" }}>

        {/* Left panel — decorative */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px", borderRight: "1px solid rgba(255,255,255,0.05)", position: "relative" }} className="hidden lg:flex">
          <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 360 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, color: "#000" }}>LH</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 22, color: "var(--text-main,#e8eaf0)", lineHeight: 1 }}>Learn<span style={{ color: "var(--color-primary,#f59e0b)" }}>Hub</span></div>
                <div style={{ fontSize: 11, opacity: 0.35, fontFamily: "monospace", color: "var(--text-main,#e8eaf0)" }}>Bitcoin Academy</div>
              </div>
            </div>
            <h2 className="font-black" style={{ fontSize: "2.2rem", color: "var(--text-main,#e8eaf0)", lineHeight: 1.15, marginBottom: 16 }}>
              Mulai Perjalanan<br />Bitcoin-mu<br /><span style={{ color: "#a78bfa" }}>Hari Ini</span>
            </h2>
            <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.45, lineHeight: 1.75, marginBottom: 32 }}>
              Daftar gratis dan dapatkan akses penuh ke semua konten edukasi Bitcoin.
            </p>
            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                { n: "1", t: "Daftar Gratis", d: "Isi form dan verifikasi email" },
                { n: "2", t: "Mulai Belajar", d: "Akses 12 modul dan 50+ artikel" },
                { n: "3", t: "Kuasai Bitcoin", d: "Dari dasar hingga analisis lanjutan" },
              ].map(s => (
                <div key={s.n} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "color-mix(in srgb, #a78bfa 15%, transparent)", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#a78bfa", flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>{s.t}</div>
                    <div style={{ fontSize: 11, opacity: 0.38, color: "var(--text-main,#e8eaf0)" }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", maxWidth: "100%", minWidth: 0, overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 400 }}>

            {/* Mobile logo */}
            <div style={{ textAlign: "center", marginBottom: 28 }} className="lg:hidden">
              <div style={{ width: 46, height: 46, borderRadius: 12, margin: "0 auto 10px", background: "linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 17, color: "#000" }}>LH</div>
              <h1 className="font-black" style={{ fontSize: "1.5rem", color: "var(--text-main,#e8eaf0)" }}>Daftar <span style={{ color: "var(--color-primary,#f59e0b)" }}>Gratis</span></h1>
            </div>

            <h2 className="font-black hidden lg:block" style={{ fontSize: "1.8rem", color: "var(--text-main,#e8eaf0)", marginBottom: 6 }}>Buat Akun Baru</h2>
            <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.38, marginBottom: 24 }} className="hidden lg:block">Gratis selamanya. Tanpa kartu kredit.</p>

            {/* Benefit chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
              {["📝 50+ Artikel", "🎓 12 Modul", "💱 Konverter", "⚡ Live Price"].map(b => (
                <span key={b} style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: "color-mix(in srgb, var(--color-primary,#f59e0b) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary,#f59e0b) 18%, transparent)", color: "var(--color-primary,#f59e0b)" }}>{b}</span>
              ))}
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {[{ icon: "G", label: "Daftar via Google", c: "#ea4335" }, { icon: "𝕏", label: "via Twitter", c: "#1d9bf0" }].map(s => (
                <button key={s.label} style={{ flex: 1, padding: "10px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "var(--text-main,#e8eaf0)", transition: "background .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                  <span style={{ fontWeight: 900, color: s.c }}>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
              <span style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.3 }}>atau isi form</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {/* Name */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main,#e8eaf0)", opacity: 0.55, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>Nama Lengkap</label>
                <div className="converter-input" style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ paddingLeft: 14, fontSize: 14, opacity: 0.28, flexShrink: 0, color: "var(--text-main,#e8eaf0)" }}>👤</span>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu"
                    style={{ flex: 1, background: "transparent", border: "none", padding: "12px 14px", fontSize: 14, color: "var(--text-main,#e8eaf0)" }} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main,#e8eaf0)", opacity: 0.55, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>Email</label>
                <div className="converter-input" style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ paddingLeft: 14, fontSize: 14, opacity: 0.28, flexShrink: 0, color: "var(--text-main,#e8eaf0)" }}>✉</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@kamu.com"
                    style={{ flex: 1, background: "transparent", border: "none", padding: "12px 14px", fontSize: 14, color: "var(--text-main,#e8eaf0)" }} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main,#e8eaf0)", opacity: 0.55, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>Password</label>
                <div className="converter-input" style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ paddingLeft: 14, fontSize: 14, opacity: 0.28, flexShrink: 0, color: "var(--text-main,#e8eaf0)" }}>🔒</span>
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 karakter"
                    style={{ flex: 1, background: "transparent", border: "none", padding: "12px 14px", fontSize: 14, color: "var(--text-main,#e8eaf0)" }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ paddingRight: 14, background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: 0.3, color: "var(--text-main,#e8eaf0)" }}>{showPass ? "🙈" : "👁"}</button>
                </div>
                {password.length > 0 && (
                  <div style={{ marginTop: 7 }}>
                    <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                      {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColor : "rgba(255,255,255,0.08)", transition: "background .2s" }} />)}
                    </div>
                    <span style={{ fontSize: 10, color: strengthColor, fontWeight: 700 }}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main,#e8eaf0)", opacity: 0.55, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>Konfirmasi Password</label>
                <div className="converter-input" style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ paddingLeft: 14, fontSize: 14, opacity: 0.28, flexShrink: 0, color: confirm && confirm !== password ? "#ef4444" : "var(--text-main,#e8eaf0)" }}>🔑</span>
                  <input type={showPass ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Ulangi password"
                    style={{ flex: 1, background: "transparent", border: "none", padding: "12px 14px", fontSize: 14, color: "var(--text-main,#e8eaf0)" }} />
                  {confirm && <span style={{ paddingRight: 14, fontSize: 13 }}>{confirm === password ? "✅" : "❌"}</span>}
                </div>
              </div>

              {/* Agree */}
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 2 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1, background: agree ? "var(--color-primary,#f59e0b)" : "transparent", border: agree ? "none" : "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => setAgree(!agree)}>
                  {agree && <span style={{ fontSize: 11, color: "#000", fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.55 }}>
                  Saya setuju dengan{" "}
                  <Link href="#" style={{ color: "var(--color-primary,#f59e0b)", textDecoration: "none" }}>Syarat & Ketentuan</Link>
                  {" "}dan{" "}
                  <Link href="#" style={{ color: "var(--color-primary,#f59e0b)", textDecoration: "none" }}>Kebijakan Privasi</Link>
                </span>
              </label>

              {error && <div style={{ padding: "10px 14px", borderRadius: 9, fontSize: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)", color: "#f87171" }}>⚠ {error}</div>}

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "13px", borderRadius: 11, fontSize: 14, fontWeight: 800, border: "none", marginTop: 4,
                cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "rgba(245,158,11,0.28)" : "linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)",
                color: loading ? "rgba(0,0,0,0.4)" : "#000",
                boxShadow: loading ? "none" : "0 6px 20px color-mix(in srgb, var(--color-primary,#f59e0b) 28%, transparent)",
              }}>
                {loading ? "Mendaftarkan..." : "🎓 Daftar Gratis Sekarang"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.42 }}>
              Sudah punya akun?{" "}
              <Link href="/login" style={{ color: "var(--color-primary,#f59e0b)", fontWeight: 700, textDecoration: "none" }}>Masuk</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
