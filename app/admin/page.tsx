"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase";
import { MODULES, ARTICLES } from "../lib/data";

interface UserProfile {
  id: string;
  name: string | null;
  role: string;
  created_at: string;
}
interface ProgressRow { user_id: string; module_id: number; lesson_idx: number; completed: boolean; }
interface BookmarkRow { user_id: string; artikel_id: number; created_at: string; }

type Tab = "overview" | "users" | "progress" | "bookmarks";

export default function AdminPage() {
  // Gunakan role langsung dari AuthContext — tidak perlu fetch ulang
  const { user, loading, role } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [userSearch, setUserSearch] = useState("");

  // Guard: tunggu sampai auth selesai loading, lalu cek role
  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (role !== null && role !== "admin") { router.replace("/"); }
  }, [user, loading, role, router]);

  // Fetch data hanya jika sudah confirmed admin
  useEffect(() => {
    if (role !== "admin") return;
    const sb = createClient();
    Promise.all([
      sb.from("profiles").select("id,name,role,created_at").order("created_at", { ascending: false }),
      sb.from("module_progress").select("user_id,module_id,lesson_idx,completed"),
      sb.from("artikel_bookmarks").select("user_id,artikel_id,created_at").order("created_at", { ascending: false }),
    ]).then(([p, prog, bm]) => {
      setUsers(p.data || []);
      setProgress(prog.data || []);
      setBookmarks(bm.data || []);
      setDataLoading(false);
    });
  }, [role]);

  // Tampilkan loading spinner selama auth/role masih dicek
  if (loading || role === null) return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid rgba(245,158,11,0.15)", borderTop: "3px solid #f59e0b", margin: "0 auto 16px", animation: "spin 0.7s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, fontSize: 13 }}>Memverifikasi akses admin...</p>
        </div>
      </main>
    </>
  );
  if (role !== "admin") return null;
  const regularUsers = users.filter(u => u.role === "user");
  const completedProgress = progress.filter(p => p.completed);
  const activeUserIds = new Set([...progress.map(p => p.user_id), ...bookmarks.map(b => b.user_id)]);

  const userProgressCount: Record<string, number> = {};
  completedProgress.forEach(p => { userProgressCount[p.user_id] = (userProgressCount[p.user_id] || 0) + 1; });

  const userBookmarkCount: Record<string, number> = {};
  bookmarks.forEach(b => { userBookmarkCount[b.user_id] = (userBookmarkCount[b.user_id] || 0) + 1; });

  const moduleLessonsDone: Record<number, number> = {};
  completedProgress.forEach(p => { moduleLessonsDone[p.module_id] = (moduleLessonsDone[p.module_id] || 0) + 1; });

  const articleBmCount: Record<number, number> = {};
  bookmarks.forEach(b => { articleBmCount[b.artikel_id] = (articleBmCount[b.artikel_id] || 0) + 1; });

  const totalLessons = MODULES.reduce((a, m) => a + m.lessons.length, 0);

  const filteredUsers = users.filter(u =>
    !userSearch || (u.name || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  // ── Styles ──
  const A = "#f59e0b";
  const card = { padding: "20px 22px", marginBottom: 0 } as const;

  const tabBtn = (t: Tab) => ({
    padding: "9px 20px", borderRadius: 10, fontSize: 12, fontWeight: 700,
    cursor: "pointer" as const, border: "none", transition: "all .2s",
    background: activeTab === t ? A : "rgba(255,255,255,0.05)",
    color: activeTab === t ? "#000" : "rgba(255,255,255,0.45)",
    boxShadow: activeTab === t ? `0 4px 16px ${A}40` : "none",
  });

  const statCard = (icon: string, label: string, value: number | string, color: string) => (
    <div className="grad-border" style={{ padding: "22px 20px", display: "flex", flexDirection: "column" as const, gap: 6 }}>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div className="font-mono-styled" style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.4, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );

  const sectionHeader = (title: string, sub?: string) => (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-main,#e8eaf0)", margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.4, margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );

  return (
    <>
      <Navbar />
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .admin-row:hover{background:rgba(245,158,11,0.04)!important;}
        .tab-content{animation:fadeUp .25s ease both;}
      `}</style>

      <main style={{ minHeight: "100vh", paddingTop: 56, background: "var(--bg-page,#050810)" }}>

        {/* ── Header ── */}
        <div style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(135deg, rgba(245,158,11,0.05) 0%, rgba(6,182,212,0.02) 100%)",
          padding: "36px 20px 28px",
        }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `linear-gradient(135deg, ${A}22, rgba(6,182,212,0.1))`,
                  border: `1px solid ${A}30`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>🛡️</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h1 className="font-black" style={{ fontSize: "1.5rem", color: "var(--text-main,#e8eaf0)", margin: 0, lineHeight: 1 }}>Admin Dashboard</h1>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: `${A}20`, border: `1px solid ${A}40`, color: A }}>ADMIN</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.4, margin: "4px 0 0" }}>
                    LearnHub · {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <Link href="/" style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text-main,#e8eaf0)", textDecoration: "none", opacity: 0.6,
              }}>← Kembali ke Site</Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "28px 20px 80px" }}>

          {/* ── Tabs ── */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {([
              ["overview", "📊", "Overview"],
              ["users", "👥", "Users"],
              ["progress", "📚", "Progress Modul"],
              ["bookmarks", "🔖", "Bookmarks"],
            ] as [Tab, string, string][]).map(([t, icon, label]) => (
              <button key={t} onClick={() => setActiveTab(t)} style={tabBtn(t)}>
                {icon} {label}
              </button>
            ))}
          </div>

          {/* ── Loading ── */}
          {dataLoading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${A}20`, borderTop: `2px solid ${A}`, margin: "0 auto 14px", animation: "spin 0.7s linear infinite" }} />
              <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.35, fontSize: 13 }}>Memuat data...</p>
            </div>
          ) : (

            <div className="tab-content" key={activeTab}>

              {/* ═══════════ OVERVIEW ═══════════ */}
              {activeTab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                  {/* Stat cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
                    {statCard("👥", "Total User", regularUsers.length, "#06b6d4")}
                    {statCard("⚡", "User Aktif", activeUserIds.size, "#a78bfa")}
                    {statCard("✅", "Lesson Selesai", completedProgress.length, "#22c55e")}
                    {statCard("🔖", "Bookmark", bookmarks.length, A)}
                    {statCard("📊", "Total Lesson", totalLessons, "#f97316")}
                  </div>

                  {/* Two column */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                    {/* Module popularity */}
                    <div className="grad-border" style={card}>
                      <div style={{ marginBottom: 18 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-main,#e8eaf0)", margin: 0 }}>📚 Popularitas Modul</h3>
                        <p style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.35, margin: "4px 0 0" }}>Total lesson yang diselesaikan per modul</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {MODULES.map(m => {
                          const done = moduleLessonsDone[m.id] || 0;
                          const maxPossible = m.lessons.length * Math.max(regularUsers.length, 1);
                          const pct = maxPossible > 0 ? Math.min(100, Math.round((done / maxPossible) * 100)) : 0;
                          return (
                            <div key={m.id}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                                <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.65 }}>{m.icon} {m.title}</span>
                                <span className="font-mono-styled" style={{ color: m.accent, fontWeight: 700 }}>{done}</span>
                              </div>
                              <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: `linear-gradient(to right, ${m.accent}, ${m.accent}80)`, transition: "width 1.2s ease" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Top bookmarked */}
                    <div className="grad-border" style={card}>
                      <div style={{ marginBottom: 18 }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-main,#e8eaf0)", margin: 0 }}>🔥 Artikel Terpopuler</h3>
                        <p style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.35, margin: "4px 0 0" }}>Berdasarkan jumlah bookmark</p>
                      </div>
                      {Object.entries(articleBmCount).length === 0 ? (
                        <div style={{ textAlign: "center", padding: "32px 0", opacity: 0.3 }}>
                          <div style={{ fontSize: 28, marginBottom: 8 }}>🔖</div>
                          <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)" }}>Belum ada bookmark</p>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {Object.entries(articleBmCount)
                            .sort((a, b) => b[1] - a[1]).slice(0, 6)
                            .map(([aid, count], i) => {
                              const art = ARTICLES.find(a => a.id === Number(aid));
                              return (
                                <div key={aid} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <span className="font-mono-styled" style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.25, width: 16, flexShrink: 0 }}>#{i + 1}</span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-main,#e8eaf0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art?.title || `Artikel #${aid}`}</div>
                                    {art && <span style={{ fontSize: 10, color: art.catColor }}>{art.category}</span>}
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 800, color: A, background: `${A}15`, padding: "2px 8px", borderRadius: 6, flexShrink: 0 }}>🔖 {count}</span>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent registrations */}
                  <div className="grad-border" style={card}>
                    <div style={{ marginBottom: 16 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-main,#e8eaf0)", margin: 0 }}>🆕 Registrasi Terbaru</h3>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {users.slice(0, 5).map((u, i) => (
                        <div key={u.id} className="admin-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none", transition: "background .15s" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${A}30, rgba(6,182,212,0.2))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: A, flexShrink: 0 }}>
                            {(u.name || "?")[0].toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main,#e8eaf0)" }}>{u.name || "(tanpa nama)"}</div>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: u.role === "admin" ? `${A}20` : "rgba(6,182,212,0.1)", border: `1px solid ${u.role === "admin" ? A + "40" : "rgba(6,182,212,0.25)"}`, color: u.role === "admin" ? A : "#06b6d4" }}>
                            {u.role === "admin" ? "🛡️ Admin" : "👤 User"}
                          </span>
                          <span className="font-mono-styled" style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.35, flexShrink: 0 }}>
                            {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════ USERS ═══════════ */}
              {activeTab === "users" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {sectionHeader(`Semua User (${users.length})`, "Data dari tabel profiles Supabase")}

                  {/* Search */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", maxWidth: 360 }}>
                    <span style={{ opacity: 0.3, fontSize: 14 }}>🔍</span>
                    <input
                      type="text" placeholder="Cari nama user..." value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      style={{ flex: 1, background: "transparent", border: "none", padding: "10px 0", fontSize: 13, color: "var(--text-main,#e8eaf0)" }}
                    />
                    {userSearch && <button onClick={() => setUserSearch("")} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.4, fontSize: 12, color: "var(--text-main,#e8eaf0)" }}>✕</button>}
                  </div>

                  <div className="grad-border" style={{ overflow: "hidden" }}>
                    {/* Info banner */}
                    <div style={{ padding: "12px 20px", background: `${A}08`, borderBottom: `1px solid ${A}15`, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13 }}>💡</span>
                      <span style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.55 }}>
                        Untuk set admin: Supabase → SQL Editor →{" "}
                        <code style={{ background: "rgba(245,158,11,0.12)", padding: "1px 6px", borderRadius: 4, color: A }}>UPDATE profiles SET role='admin' WHERE id='...'</code>
                      </span>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "rgba(255,255,255,0.025)" }}>
                            {["#", "User", "Role", "Progress", "Bookmark", "Bergabung"].map(h => (
                              <th key={h} style={{ padding: "12px 16px", fontSize: 10, fontWeight: 800, color: "var(--text-main,#e8eaf0)", opacity: 0.35, textAlign: "left", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u, i) => (
                            <tr key={u.id} className="admin-row" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", transition: "background .15s" }}>
                              <td style={{ padding: "13px 16px" }}>
                                <span className="font-mono-styled" style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.25 }}>{i + 1}</span>
                              </td>
                              <td style={{ padding: "13px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${A}25, rgba(6,182,212,0.15))`, border: `1px solid ${A}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: A, flexShrink: 0 }}>
                                    {(u.name || "?")[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-main,#e8eaf0)" }}>{u.name || "(tanpa nama)"}</div>
                                    <div className="font-mono-styled" style={{ fontSize: 9, opacity: 0.25, color: "var(--text-main,#e8eaf0)" }}>{u.id.slice(0, 16)}…</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: "13px 16px" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: u.role === "admin" ? `${A}18` : "rgba(6,182,212,0.1)", border: `1px solid ${u.role === "admin" ? A + "40" : "rgba(6,182,212,0.25)"}`, color: u.role === "admin" ? A : "#06b6d4" }}>
                                  {u.role === "admin" ? "🛡️ Admin" : "👤 User"}
                                </span>
                              </td>
                              <td style={{ padding: "13px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span className="font-mono-styled" style={{ fontSize: 13, fontWeight: 800, color: "#22c55e" }}>{userProgressCount[u.id] || 0}</span>
                                  <span style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.35 }}>/ {totalLessons} lesson</span>
                                </div>
                                <div style={{ marginTop: 4, height: 3, borderRadius: 99, width: 80, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                                  <div style={{ height: "100%", borderRadius: 99, width: `${Math.min(100, ((userProgressCount[u.id] || 0) / totalLessons) * 100)}%`, background: "linear-gradient(to right, #22c55e, #06b6d4)" }} />
                                </div>
                              </td>
                              <td style={{ padding: "13px 16px" }}>
                                <span className="font-mono-styled" style={{ fontSize: 13, fontWeight: 800, color: A }}>{userBookmarkCount[u.id] || 0}</span>
                              </td>
                              <td style={{ padding: "13px 16px" }}>
                                <span className="font-mono-styled" style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.35, whiteSpace: "nowrap" }}>
                                  {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {filteredUsers.length === 0 && (
                            <tr>
                              <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--text-main,#e8eaf0)", opacity: 0.3, fontSize: 13 }}>
                                {userSearch ? `Tidak ada user dengan nama "${userSearch}"` : "Belum ada user terdaftar."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════ PROGRESS ═══════════ */}
              {activeTab === "progress" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {sectionHeader("Progress Modul", "Statistik penyelesaian lesson per modul")}
                  {MODULES.map(m => {
                    const moduleProgress = completedProgress.filter(p => p.module_id === m.id);
                    const uniqueStarted = new Set(moduleProgress.map(p => p.user_id)).size;
                    const fullyDone = regularUsers.filter(u => {
                      const done = completedProgress.filter(p => p.user_id === u.id && p.module_id === m.id).length;
                      return done >= m.lessons.length;
                    }).length;
                    const completionRate = regularUsers.length > 0 ? Math.round((fullyDone / regularUsers.length) * 100) : 0;

                    return (
                      <div key={m.id} className="grad-border" style={{ padding: "22px" }}>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", background: `color-mix(in srgb, ${m.accent} 12%, transparent)`, border: `1px solid ${m.accent}35` }}>
                              {m.icon}
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-main,#e8eaf0)" }}>{m.title}</div>
                              <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.4, marginTop: 2 }}>{m.lessons.length} pelajaran · {m.level} · {m.dur}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 20 }}>
                            {[
                              { label: "Mulai", val: uniqueStarted, color: m.accent },
                              { label: "Selesai", val: fullyDone, color: "#22c55e" },
                              { label: "Rate", val: `${completionRate}%`, color: "#06b6d4" },
                            ].map(s => (
                              <div key={s.label} style={{ textAlign: "center" }}>
                                <div className="font-mono-styled" style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</div>
                                <div style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Overall progress bar */}
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 99, width: `${completionRate}%`, background: `linear-gradient(to right, ${m.accent}, #06b6d4)`, transition: "width 1.2s ease" }} />
                          </div>
                        </div>

                        {/* Per-lesson breakdown */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                          {m.lessons.map((lesson, idx) => {
                            const doneCount = completedProgress.filter(p => p.module_id === m.id && p.lesson_idx === idx).length;
                            const lessonPct = regularUsers.length > 0 ? Math.round((doneCount / regularUsers.length) * 100) : 0;
                            return (
                              <div key={idx} style={{ padding: "10px 12px", borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <div style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.5, marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {idx + 1}. {lesson.title}
                                </div>
                                <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: 5 }}>
                                  <div style={{ height: "100%", borderRadius: 99, width: `${lessonPct}%`, background: m.accent }} />
                                </div>
                                <span className="font-mono-styled" style={{ fontSize: 12, fontWeight: 800, color: m.accent }}>{doneCount}</span>
                                <span style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.3 }}> user</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ═══════════ BOOKMARKS ═══════════ */}
              {activeTab === "bookmarks" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {sectionHeader(`Semua Bookmark (${bookmarks.length})`, "Artikel yang disimpan oleh user")}

                  {/* Artikel summary cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 8 }}>
                    {Object.entries(articleBmCount).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([aid, count]) => {
                      const art = ARTICLES.find(a => a.id === Number(aid));
                      return (
                        <div key={aid} className="grad-border" style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: art?.catColor || A, marginBottom: 6 }}>{art?.category || "—"}</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main,#e8eaf0)", lineHeight: 1.4, marginBottom: 10 }}>{art?.title || `Artikel #${aid}`}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 16 }}>🔖</span>
                            <span className="font-mono-styled" style={{ fontSize: 18, fontWeight: 900, color: A }}>{count}</span>
                            <span style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.4 }}>bookmark</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detail table */}
                  <div className="grad-border" style={{ overflow: "hidden" }}>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "rgba(255,255,255,0.025)" }}>
                            {["#", "User", "Artikel", "Kategori", "Waktu"].map(h => (
                              <th key={h} style={{ padding: "12px 16px", fontSize: 10, fontWeight: 800, color: "var(--text-main,#e8eaf0)", opacity: 0.35, textAlign: "left", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bookmarks.map((b, i) => {
                            const u = users.find(u => u.id === b.user_id);
                            const art = ARTICLES.find(a => a.id === b.artikel_id);
                            return (
                              <tr key={i} className="admin-row" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", transition: "background .15s" }}>
                                <td style={{ padding: "11px 16px" }}>
                                  <span className="font-mono-styled" style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.25 }}>{i + 1}</span>
                                </td>
                                <td style={{ padding: "11px 16px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${A}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: A, flexShrink: 0 }}>
                                      {(u?.name || "?")[0].toUpperCase()}
                                    </div>
                                    <span style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)" }}>{u?.name || "(tanpa nama)"}</span>
                                  </div>
                                </td>
                                <td style={{ padding: "11px 16px", fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.75, maxWidth: 280 }}>
                                  <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{art?.title || `Artikel #${b.artikel_id}`}</div>
                                </td>
                                <td style={{ padding: "11px 16px" }}>
                                  {art && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: `color-mix(in srgb, ${art.catColor} 12%, transparent)`, border: `1px solid ${art.catColor}40`, color: art.catColor, whiteSpace: "nowrap" }}>{art.category}</span>}
                                </td>
                                <td style={{ padding: "11px 16px" }}>
                                  <span className="font-mono-styled" style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.35, whiteSpace: "nowrap" }}>
                                    {new Date(b.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {bookmarks.length === 0 && (
                            <tr>
                              <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text-main,#e8eaf0)", opacity: 0.3, fontSize: 13 }}>
                                <div style={{ fontSize: 28, marginBottom: 8 }}>🔖</div>
                                Belum ada bookmark.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
    </>
  );
}
