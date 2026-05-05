"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { fetchModules, type Module } from "../lib/supabase-data";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase";

const FREE_MODULE_INDICES = [0, 1];

// Unsplash fallback images per level keyword
const FALLBACK_COVERS: Record<string, string> = {
  default: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=70",
};

export default function EdukasiPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const [progressLoading, setProgressLoading] = useState(true);

  // Search & filter
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("Semua");

  useEffect(() => {
    fetchModules().then((data) => { setModules(data); setModulesLoading(false); });
  }, []);

  useEffect(() => {
    if (!user) { setProgressLoading(false); return; }
    const supabase = createClient();
    supabase.from("module_progress").select("module_id, lesson_idx, completed").eq("user_id", user.id).eq("completed", true)
      .then(({ data }) => {
        if (data) {
          const map: Record<number, number> = {};
          data.forEach((r) => { map[r.module_id] = (map[r.module_id] || 0) + 1; });
          setProgressMap(map);
        }
        setProgressLoading(false);
      });
  }, [user]);

  const levels = useMemo(() => ["Semua", ...Array.from(new Set(modules.map(m => m.level).filter(Boolean)))], [modules]);

  const filtered = useMemo(() => {
    return modules.filter(m => {
      const matchSearch = search === "" || m.title.toLowerCase().includes(search.toLowerCase()) || m.desc.toLowerCase().includes(search.toLowerCase());
      const matchLevel = levelFilter === "Semua" || m.level === levelFilter;
      return matchSearch && matchLevel;
    });
  }, [modules, search, levelFilter]);

  const [paywallModule, setPaywallModule] = useState<Module | null>(null);

  const modulesCompleted = modules.filter((m) => (progressMap[m.id] || 0) >= m.lessons.length && m.lessons.length > 0).length;
  const totalLessonsCompleted = Object.values(progressMap).reduce((a, b) => a + b, 0);
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);

  const handleModuleClick = (module: Module, idx: number) => {
    const isFree = FREE_MODULE_INDICES.includes(idx);
    if (!isFree && !user) { setPaywallModule(module); return; }
    router.push(`/edukasi/${module.id}`);
  };

  return (
    <>
      <Navbar />
      {/* Paywall Modal */}
      {paywallModule && (
        <div onClick={() => setPaywallModule(null)} style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 400, borderRadius: 22, background: "var(--bg-card,#13141a)", border: "1px solid rgba(167,139,250,0.2)", padding: "32px 28px", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 18px" }}>🔒</div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 8, letterSpacing: "-0.02em" }}>Modul Premium</h2>
            <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.7, marginBottom: 6 }}>
              <strong style={{ color: "#a78bfa" }}>{paywallModule.title}</strong> hanya tersedia untuk member.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.4, lineHeight: 1.6, marginBottom: 24 }}>
              Daftar gratis untuk akses semua modul, quiz, progress tracking, dan sertifikat.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/register" style={{ display: "block", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #06b6d4)", color: "#000", textDecoration: "none" }}>
                🚀 Daftar Gratis Sekarang
              </Link>
              <Link href="/login" style={{ display: "block", padding: "11px 24px", borderRadius: 12, fontSize: 13, fontWeight: 700, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main,#e8eaf0)", textDecoration: "none" }}>
                Sudah punya akun? Masuk
              </Link>
              <button onClick={() => setPaywallModule(null)} style={{ padding: "9px", borderRadius: 10, fontSize: 12, border: "none", background: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit" }}>Batal</button>
            </div>
            <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 11, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 700, marginBottom: 4 }}>✅ 2 Modul Pertama Gratis</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>Coba dulu tanpa perlu daftar. Modul 01 & 02 bebas akses.</div>
            </div>
          </div>
        </div>
      )}
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>
        {/* ── Hero ── */}
        <div style={{ padding: "52px 20px 44px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "color-mix(in srgb, #a78bfa 4%, transparent)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, marginBottom: 18, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", fontSize: 11, fontWeight: 700, color: "#a78bfa" }}>
            🎓 {modulesLoading ? "..." : modules.length} Modul Belajar
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem,4.5vw,3.2rem)", fontWeight: 900, color: "var(--text-main,#e8eaf0)", letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 14 }}>
            Kuasai <span style={{ color: "#a78bfa" }}>Crypto</span> dari Dasar
          </h1>
          <p style={{ fontSize: "clamp(13px,2vw,15px)", color: "var(--text-main,#e8eaf0)", opacity: 0.5, maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Belajar terstruktur dari nol hingga mahir. Modul lengkap dengan video, quiz, dan sertifikat.
          </p>

          {/* Stats */}
          {user && !progressLoading && (
            <div style={{ display: "inline-flex", gap: 28, padding: "14px 28px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { v: modulesCompleted, l: "Modul Selesai", c: "#a78bfa" },
                { v: totalLessonsCompleted, l: "Lesson Selesai", c: "#22c55e" },
                { v: `${totalLessons > 0 ? Math.round((totalLessonsCompleted / totalLessons) * 100) : 0}%`, l: "Progress Total", c: "#06b6d4" },
              ].map(s => (
                <div key={s.l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.c, fontFamily: "monospace" }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.35, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Search + Filter */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", maxWidth: 620, margin: "0 auto" }}>
            <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 15, opacity: 0.35 }}>🔍</span>
              <input
                type="text"
                placeholder="Cari modul..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "var(--text-main,#e8eaf0)", fontSize: 14, outline: "none", boxSizing: "border-box" as const }}
              />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
              {levels.map(lv => (
                <button key={lv} onClick={() => setLevelFilter(lv)} style={{ padding: "10px 16px", borderRadius: 11, fontSize: 12, fontWeight: 700, cursor: "pointer", border: levelFilter === lv ? "1px solid #a78bfa50" : "1px solid rgba(255,255,255,0.1)", background: levelFilter === lv ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)", color: levelFilter === lv ? "#a78bfa" : "var(--text-main,#e8eaf0)", transition: "all .15s" }}>
                  {lv}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Module Cards ── */}
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 20px 80px" }}>
          {modulesLoading ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(167,139,250,0.2)", borderTop: "3px solid #a78bfa", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
              <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.35, fontSize: 13 }}>Memuat modul...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.3 }}>🔍</div>
              <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, fontSize: 14 }}>Tidak ada modul yang cocok dengan pencarian.</p>
              <button onClick={() => { setSearch(""); setLevelFilter("Semua"); }} style={{ marginTop: 14, padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "var(--text-main,#e8eaf0)" }}>Reset Filter</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: 22 }}>
              {filtered.map((module, idx) => {
                const globalIdx = modules.findIndex(m => m.id === module.id);
                const isFree = FREE_MODULE_INDICES.includes(globalIdx);
                const isAccessible = isFree || !!user;
                const doneCount = progressMap[module.id] || 0;
                const pct = module.lessons.length > 0 ? Math.round((doneCount / module.lessons.length) * 100) : 0;
                const isDone = doneCount >= module.lessons.length && module.lessons.length > 0;
                const coverImg = module.coverImage || FALLBACK_COVERS.default;

                return (
                  <div
                    key={module.id}
                    onClick={() => handleModuleClick(module, globalIdx)}
                    style={{ borderRadius: 18, overflow: "hidden", border: `1px solid rgba(255,255,255,0.07)`, background: "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all .22s", position: "relative" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.borderColor = module.accent + "50"; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px ${module.accent}20`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}
                  >
                    {/* Cover image */}
                    <div style={{ position: "relative", height: 160, overflow: "hidden" }}>
                      <img
                        src={coverImg}
                        alt={module.title}
                        loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "saturate(0.8) brightness(0.75)", transition: "transform .4s ease" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = ""; }}
                      />
                      {/* Gradient overlay */}
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(8,8,18,0.7) 100%)` }} />
                      {/* Badges on image */}
                      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20, background: `color-mix(in srgb, ${module.levelColor} 15%, rgba(0,0,0,0.5))`, border: `1px solid ${module.levelColor}40`, color: module.levelColor, backdropFilter: "blur(8px)" }}>{module.level}</span>
                        {isFree && !user && <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", backdropFilter: "blur(8px)" }}>🆓 Gratis</span>}
                        {!isAccessible && <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}>🔒</span>}
                        {isDone && <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20, background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", color: "#22c55e", backdropFilter: "blur(8px)" }}>🏆 Selesai</span>}
                      </div>
                      {/* Module number on image */}
                      <div style={{ position: "absolute", bottom: 12, right: 12, fontFamily: "monospace", fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>Modul {module.num}</div>
                      {/* Icon */}
                      <div style={{ position: "absolute", bottom: -18, left: 18, width: 48, height: 48, borderRadius: 14, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", background: `color-mix(in srgb, ${module.accent} 18%, rgba(8,8,18,0.9))`, border: `2px solid ${module.accent}40`, boxShadow: `0 4px 16px rgba(0,0,0,0.4)` }}>{module.icon}</div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: "28px 18px 18px" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main,#e8eaf0)", lineHeight: 1.3, marginBottom: 7, letterSpacing: "-0.02em" }}>{module.title}</h3>
                      <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.45, lineHeight: 1.65, marginBottom: 16 }}>{module.desc}</p>

                      {/* Stats row */}
                      <div style={{ display: "flex", gap: 14, marginBottom: user ? 14 : 0, flexWrap: "wrap" }}>
                        {[{ icon: "⏱", v: module.dur }, { icon: "📚", v: `${module.lessons.length} lesson` }].map(s => (
                          <span key={s.v} style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.4, display: "flex", alignItems: "center", gap: 4 }}>{s.icon} {s.v}</span>
                        ))}
                      </div>

                      {/* Progress */}
                      {user && module.lessons.length > 0 && (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11 }}>
                            <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.35 }}>{doneCount}/{module.lessons.length} selesai</span>
                            <span style={{ color: module.accent, fontWeight: 700, fontFamily: "monospace" }}>{pct}%</span>
                          </div>
                          <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: isDone ? "linear-gradient(90deg, #22c55e, #16a34a)" : `linear-gradient(90deg, ${module.accent}, color-mix(in srgb, ${module.accent} 60%, #06b6d4))`, transition: "width .5s ease" }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Login CTA */}
          {!loading && !user && (
            <div style={{ marginTop: 48, padding: "28px 32px", borderRadius: 20, background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.15)", textAlign: "center", maxWidth: 540, margin: "48px auto 0" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔐</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>Akses Semua Modul Gratis</div>
              <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.65, marginBottom: 20 }}>Daftar sekarang dan dapatkan akses ke semua modul, quiz, dan sertifikat.</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <Link href="/register" style={{ padding: "11px 24px", borderRadius: 11, fontSize: 14, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #8b5cf6)", color: "#fff", textDecoration: "none" }}>Daftar Gratis</Link>
                <Link href="/login" style={{ padding: "11px 24px", borderRadius: 11, fontSize: 14, fontWeight: 700, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main,#e8eaf0)", textDecoration: "none" }}>Masuk</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
