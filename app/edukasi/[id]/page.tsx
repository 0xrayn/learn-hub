"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchModuleById, fetchModules, type Module } from "../../lib/supabase-data";
import { useAuth } from "../../context/AuthContext";
import { createClient } from "../../lib/supabase";

export default function EdukasiDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [modul, setModul] = useState<Module | null>(null);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [progressLoading, setProgressLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load modul dari Supabase
  useEffect(() => {
    const load = async () => {
      setPageLoading(true);
      const [mod, all] = await Promise.all([
        fetchModuleById(Number(id)),
        fetchModules(),
      ]);
      setModul(mod);
      setAllModules(all);
      setPageLoading(false);
    };
    load();
  }, [id]);

  // Cek akses: modul ke-1 dan ke-2 gratis, sisanya perlu login
  // Cek berdasarkan sort order / posisi di list (index 0 dan 1)
  const modulIdx = allModules.findIndex(m => m.id === Number(id));
  const isFree = modulIdx === -1 ? true : modulIdx < 2; // fallback true saat loading
  const isLocked = !isFree && !user && !authLoading;

  useEffect(() => {
    if (!authLoading && isLocked) {
      router.replace(`/register?from=edukasi/${id}`);
    }
  }, [authLoading, isLocked, id, router]);

  // Load progress dari DB
  useEffect(() => {
    if (!user || !modul) { setProgressLoading(false); return; }
    setProgressLoading(true);
    const supabase = createClient();
    supabase
      .from("module_progress")
      .select("lesson_idx, completed")
      .eq("user_id", user.id)
      .eq("module_id", modul.id)
      .then(({ data }) => {
        if (data) {
          const done = new Set(data.filter(r => r.completed).map(r => r.lesson_idx));
          setCompletedLessons(done);
        }
        setProgressLoading(false);
      });
  }, [user, modul]);

  const toggleLesson = async (lessonIdx: number) => {
    if (!user || !modul) return;
    setSaving(true);
    const supabase = createClient();
    const isNowComplete = !completedLessons.has(lessonIdx);
    const { error } = await supabase
      .from("module_progress")
      .upsert({
        user_id: user.id,
        module_id: modul.id,
        lesson_idx: lessonIdx,
        completed: isNowComplete,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,module_id,lesson_idx" });
    if (!error) {
      setCompletedLessons(prev => {
        const next = new Set(prev);
        if (isNowComplete) next.add(lessonIdx);
        else next.delete(lessonIdx);
        return next;
      });
    }
    setSaving(false);
  };

  // Loading state
  if (pageLoading || authLoading) return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(167,139,250,0.2)", borderTop: "3px solid #a78bfa", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, fontSize: 14 }}>Memuat modul...</p>
        </div>
      </main>
    </>
  );

  // Not found
  if (!modul) return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📚</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>Modul Tidak Ditemukan</h1>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, marginBottom: 24 }}>Modul ini mungkin sudah dihapus atau belum dipublish.</p>
          <Link href="/edukasi" style={{ padding: "10px 24px", borderRadius: 10, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
            ← Kembali ke Edukasi
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );

  // Locked state
  if (isLocked) return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
          <h2 className="font-black" style={{ fontSize: "1.6rem", color: "var(--text-main,#e8eaf0)", marginBottom: 10 }}>Modul ini Perlu Akun</h2>
          <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.7, marginBottom: 24 }}>
            Daftar gratis untuk mengakses <strong style={{ color: "#a78bfa" }}>{modul.title}</strong> dan semua modul lanjutan.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Link href="/register" style={{ padding: "12px 24px", borderRadius: 11, fontSize: 14, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #8b5cf6)", color: "#fff", textDecoration: "none" }}>Daftar Gratis</Link>
            <Link href="/login" style={{ padding: "12px 24px", borderRadius: 11, fontSize: 14, fontWeight: 700, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main,#e8eaf0)", textDecoration: "none" }}>Masuk</Link>
          </div>
        </div>
      </main>
    </>
  );

  const totalDone = completedLessons.size;
  const totalLessons = modul.lessons.length;
  const pct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;
  const moduleDone = totalDone === totalLessons && totalLessons > 0;

  // Prev / Next dari allModules (berdasarkan posisi di list, bukan ID)
  const currentIdx = allModules.findIndex(m => m.id === modul.id);
  const prev = currentIdx > 0 ? allModules[currentIdx - 1] : null;
  const next = currentIdx < allModules.length - 1 ? allModules[currentIdx + 1] : null;

  return (
    <>
      <Navbar />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>

        {/* Hero banner */}
        <div style={{ padding: "48px 20px 40px", background: `color-mix(in srgb, ${modul.accent} 6%, transparent)`, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 12, flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, textDecoration: "none" }}>Beranda</Link>
              <span style={{ opacity: 0.2, color: "var(--text-main,#e8eaf0)" }}>›</span>
              <Link href="/edukasi" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, textDecoration: "none" }}>Edukasi</Link>
              <span style={{ opacity: 0.2, color: "var(--text-main,#e8eaf0)" }}>›</span>
              <span style={{ color: modul.accent, fontWeight: 600 }}>{modul.title}</span>
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: 68, height: 68, borderRadius: 18, fontSize: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: moduleDone ? "rgba(34,197,94,0.12)" : `color-mix(in srgb, ${modul.accent} 12%, transparent)`, border: `1px solid ${moduleDone ? "rgba(34,197,94,0.3)" : modul.accent + "40"}` }}>
                {moduleDone ? "✅" : modul.icon}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: `color-mix(in srgb, ${modul.levelColor} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${modul.levelColor} 30%, transparent)`, color: modul.levelColor }}>{modul.level}</span>
                  <span className="font-mono-styled" style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, opacity: 0.4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-main,#e8eaf0)" }}>Modul {modul.num}</span>
                  {!user && isFree && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>🆓 Gratis</span>}
                </div>
                <h1 className="font-black" style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "var(--text-main,#e8eaf0)", lineHeight: 1.2, marginBottom: 10 }}>{modul.title}</h1>
                <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.55, lineHeight: 1.7 }}>{modul.longDesc || modul.desc}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 28, marginTop: 28, flexWrap: "wrap" }}>
              {[{ icon: "⏱", v: modul.dur, l: "Durasi" }, { icon: "📚", v: `${totalLessons}`, l: "Pelajaran" }, { icon: "✅", v: `${totalDone}/${totalLessons}`, l: "Selesai" }].map(s => (
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

          {/* Progress bar */}
          <div className="grad-border" style={{ padding: "18px 22px", marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.6, fontWeight: 600 }}>
                Progress Modul {saving && <span style={{ fontSize: 11, opacity: 0.5 }}>· menyimpan...</span>}
              </span>
              <span className="font-mono-styled" style={{ color: modul.accent, fontWeight: 700 }}>{totalDone}/{totalLessons} ({pct}%)</span>
            </div>
            <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: `linear-gradient(to right, ${modul.accent}, #06b6d4)`, transition: "width 0.5s ease" }} />
            </div>
            {!user && <p style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.4, margin: "10px 0 0" }}>💡 <Link href="/login" style={{ color: modul.accent, textDecoration: "none" }}>Login</Link> untuk menyimpan progress kamu</p>}
          </div>

          {/* Lessons list */}
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 14 }}>Daftar Pelajaran</h2>
          {progressLoading ? (
            <div style={{ textAlign: "center", padding: "32px 0", opacity: 0.4 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${modul.accent}30`, borderTop: `2px solid ${modul.accent}`, margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
              {modul.lessons.map((lesson, i) => {
                const done = completedLessons.has(i);
                const isFree = lesson.isFree || i < 2;
                const canAccess = isFree || !!user;
                const hasContent = !!(lesson.videoUrl || lesson.content);

                const cardInner = (
                  <div
                    className="grad-border"
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: canAccess ? "pointer" : "default", transition: "all .15s" }}
                    onClick={!hasContent && canAccess ? () => toggleLesson(i) : undefined}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: done ? "rgba(34,197,94,0.15)" : `color-mix(in srgb, ${modul.accent} 15%, transparent)`, border: done ? "1px solid rgba(34,197,94,0.3)" : `1px solid ${modul.accent}40`, color: done ? "#22c55e" : modul.accent, transition: "all .2s" }}>
                      {!canAccess ? "🔒" : done ? "✓" : i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-main,#e8eaf0)" }}>{lesson.title}</span>
                        {lesson.videoUrl && <span style={{ fontSize: 10, background: `${modul.accent}20`, color: modul.accent, padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>▶ Video</span>}
                        {isFree && !user && <span style={{ fontSize: 10, background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>Gratis</span>}
                      </div>
                      <div className="font-mono-styled" style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)", marginTop: 2 }}>{"⏱"} {lesson.dur}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, flexShrink: 0, background: done ? "rgba(34,197,94,0.1)" : `color-mix(in srgb, ${modul.accent} 10%, transparent)`, color: done ? "#22c55e" : modul.accent, transition: "all .2s" }}>
                      {done ? "✅ Selesai" : hasContent && canAccess ? "Mulai →" : user && !hasContent ? "Tandai ✓" : "—"}
                    </span>
                  </div>
                );

                return (hasContent && canAccess && lesson.id) ? (
                  <Link key={i} href={`/edukasi/${modul.id}/lesson/${lesson.id}`} style={{ textDecoration: "none" }}>
                    {cardInner}
                  </Link>
                ) : (
                  <div key={i}>{cardInner}</div>
                );
              })}
            </div>
          )}

          {/* Complete all / reset */}
          {user && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
              {!moduleDone ? (
                <button
                  onClick={async () => {
                    setSaving(true);
                    const supabase = createClient();
                    const rows = modul.lessons.map((_, i) => ({
                      user_id: user.id, module_id: modul.id, lesson_idx: i,
                      completed: true, updated_at: new Date().toISOString(),
                    }));
                    await supabase.from("module_progress").upsert(rows, { onConflict: "user_id,module_id,lesson_idx" });
                    setCompletedLessons(new Set(modul.lessons.map((_, i) => i)));
                    setSaving(false);
                  }}
                  style={{ padding: "13px 36px", borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: "pointer", background: `linear-gradient(135deg, ${modul.accent}, color-mix(in srgb, ${modul.accent} 70%, #f97316))`, border: "none", color: "#000", boxShadow: `0 8px 28px color-mix(in srgb, ${modul.accent} 35%, transparent)` }}
                >
                  🚀 Tandai Semua Selesai
                </button>
              ) : (
                <button
                  onClick={async () => {
                    setSaving(true);
                    const supabase = createClient();
                    await supabase.from("module_progress").delete().eq("user_id", user.id).eq("module_id", modul.id);
                    setCompletedLessons(new Set());
                    setSaving(false);
                  }}
                  style={{ padding: "13px 36px", borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: "pointer", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}
                >
                  ✓ Modul Selesai — Ulangi?
                </button>
              )}
            </div>
          )}

          {/* Prev / Next */}
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
