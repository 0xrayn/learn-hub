"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase";

interface LeaderboardEntry {
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  lessons_done: number;
  modules_active: number;
  last_active: string | null;
  rank: number;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "Hari ini";
  if (d < 7) return `${d} hari lalu`;
  const w = Math.floor(d / 7);
  if (w < 4) return `${w} minggu lalu`;
  return `${Math.floor(d / 30)} bln lalu`;
}

function rankBadge(rank: number): { icon: string; color: string } {
  if (rank === 1) return { icon: "🥇", color: "#fbbf24" };
  if (rank === 2) return { icon: "🥈", color: "#9ca3af" };
  if (rank === 3) return { icon: "🥉", color: "#d97706" };
  return { icon: `#${rank}`, color: "rgba(255,255,255,0.25)" };
}

const ACCENT = "#a78bfa";

export default function LeaderboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch role user
  useEffect(() => {
    if (!user) return;
    const sb = createClient();
    sb.from("profiles").select("role").eq("id", user.id).single()
      .then(({ data }) => setUserRole(data?.role || "user"));
  }, [user]);

  useEffect(() => {
    if (!user) return; // harus login dulu
    const fetch = async () => {
      const sb = createClient();
      // Ambil semua profiles untuk filter role admin/superadmin
      const { data: profileRoles } = await sb.from("profiles").select("id,role");
      const adminIds = new Set((profileRoles || []).filter(p => ["admin","superadmin"].includes(p.role)).map(p => p.id));

      const { data } = await sb
        .from("leaderboard")
        .select("user_id,name,avatar_url,lessons_done,modules_active,last_active,rank")
        .order("rank", { ascending: true })
        .limit(100);

      // Filter keluar admin & superadmin
      const filtered = ((data || []) as LeaderboardEntry[]).filter(e => !adminIds.has(e.user_id));

      // Re-rank setelah filter
      const list = filtered.map((e, i) => ({ ...e, rank: i + 1 }));
      setEntries(list);
      const mine = list.find(e => e.user_id === user.id);
      setMyRank(mine || null);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  // Gate: harus login — hide halaman, redirect ke home
  if (!authLoading && !user) {
    if (typeof window !== "undefined") window.location.replace("/");
    return null;
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 72, paddingBottom: 80, background: "var(--bg-main,#0f111a)" }}>
        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
          .lb-row { transition: background .15s; }
          .lb-row:hover { background: rgba(167,139,250,0.06) !important; }
        `}</style>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 44, animation: "fadeUp .5s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🏆</div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text-main,#e8eaf0)", letterSpacing: "-0.03em", margin: "0 0 8px" }}>Leaderboard</h1>
            <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.4, lineHeight: 1.6, margin: 0 }}>Ranking user berdasarkan total lesson yang diselesaikan</p>
          </div>

          {/* My rank strip */}
          {user && myRank && (
            <div style={{ marginBottom: 28, padding: "14px 20px", borderRadius: 14, background: `${ACCENT}12`, border: `1px solid ${ACCENT}30`, display: "flex", alignItems: "center", gap: 14, animation: "fadeUp .5s ease .1s both" }}>
              <div style={{ fontSize: 22, minWidth: 32, textAlign: "center" }}>
                {rankBadge(myRank.rank).icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-main,#e8eaf0)" }}>Posisimu saat ini</div>
                <div style={{ fontSize: 12, opacity: 0.45, color: "var(--text-main,#e8eaf0)" }}>Rank #{myRank.rank} · {myRank.lessons_done} lesson selesai</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: `${ACCENT}20`, color: ACCENT }}>Kamu</div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${ACCENT}20`, borderTop: `3px solid ${ACCENT}`, margin: "0 auto 14px", animation: "spin 0.8s linear infinite" }} />
              <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.3, fontSize: 13 }}>Memuat leaderboard...</p>
            </div>
          ) : entries.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
              <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.35, fontSize: 14 }}>Belum ada data leaderboard.</p>
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              {top3.length >= 3 && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", gap: 12, marginBottom: 32, animation: "fadeUp .5s ease .15s both" }}>
                  {/* 2nd */}
                  <div style={{ padding: "24px 16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", alignSelf: "flex-end" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🥈</div>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.06)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, overflow: "hidden" }}>
                      {top3[1].avatar_url ? <img src={top3[1].avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{top3[1].name || "User"}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#9ca3af" }}>{top3[1].lessons_done}</div>
                    <div style={{ fontSize: 10, opacity: 0.35, color: "var(--text-main,#e8eaf0)" }}>lesson</div>
                  </div>
                  {/* 1st */}
                  <div style={{ padding: "28px 16px 22px", borderRadius: 18, background: `${ACCENT}10`, border: `1px solid ${ACCENT}30`, textAlign: "center" }}>
                    <div style={{ fontSize: 34, marginBottom: 8 }}>🥇</div>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${ACCENT}20`, border: `2px solid ${ACCENT}40`, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, overflow: "hidden" }}>
                      {top3[0].avatar_url ? <img src={top3[0].avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{top3[0].name || "User"}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: ACCENT }}>{top3[0].lessons_done}</div>
                    <div style={{ fontSize: 10, opacity: 0.45, color: "var(--text-main,#e8eaf0)" }}>lesson</div>
                  </div>
                  {/* 3rd */}
                  <div style={{ padding: "24px 16px 20px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center", alignSelf: "flex-end" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🥉</div>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.06)", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, overflow: "hidden" }}>
                      {top3[2].avatar_url ? <img src={top3[2].avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{top3[2].name || "User"}</div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#d97706" }}>{top3[2].lessons_done}</div>
                    <div style={{ fontSize: 10, opacity: 0.35, color: "var(--text-main,#e8eaf0)" }}>lesson</div>
                  </div>
                </div>
              )}

              {/* Rest of list */}
              <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", animation: "fadeUp .5s ease .2s both" }}>
                {/* Header row */}
                <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 80px 80px 80px", padding: "10px 18px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["#", "User", "Lesson", "Modul", "Aktif"].map((h, i) => (
                    <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main,#e8eaf0)", opacity: 0.3, textAlign: i > 1 ? "center" : "left" }}>{h}</div>
                  ))}
                </div>
                {(top3.length < 3 ? entries : rest).map((entry, i) => {
                  const isMe = user?.id === entry.user_id;
                  const badge = rankBadge(entry.rank);
                  return (
                    <div
                      key={entry.user_id}
                      className="lb-row"
                      style={{
                        display: "grid", gridTemplateColumns: "48px 1fr 80px 80px 80px",
                        padding: "12px 18px", alignItems: "center",
                        borderBottom: i < (top3.length < 3 ? entries : rest).length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        background: isMe ? `${ACCENT}08` : "transparent"
                      }}
                    >
                      <div style={{ fontSize: entry.rank <= 3 ? 18 : 13, fontWeight: 800, color: badge.color, textAlign: "left" }}>{badge.icon}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, overflow: "hidden", border: isMe ? `2px solid ${ACCENT}50` : "none" }}>
                          {entry.avatar_url ? <img src={entry.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "👤"}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: isMe ? 800 : 600, color: "var(--text-main,#e8eaf0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {entry.name || "User"}
                            {isMe && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20, background: `${ACCENT}20`, color: ACCENT, marginLeft: 7 }}>Kamu</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-main,#e8eaf0)", textAlign: "center" }}>{entry.lessons_done}</div>
                      <div style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.55, textAlign: "center" }}>{entry.modules_active}</div>
                      <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.3, textAlign: "center" }}>{timeAgo(entry.last_active)}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
