"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase";

interface UserProfile {
  id: string; name: string | null; role: string; created_at: string; email?: string;
}

type Tab = "overview" | "users" | "admins" | "konten" | "system";

const PURPLE = "#a78bfa";
const GOLD = "#f59e0b";

const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: "overview", icon: "▦", label: "Overview" },
  { key: "users",    icon: "◎", label: "Semua Users" },
  { key: "admins",   icon: "🛡", label: "Kelola Admin" },
  { key: "konten",   icon: "✎", label: "Konten Global" },
  { key: "system",   icon: "⚙", label: "System" },
];

function StatCard({ icon, label, value, color, sub }: { icon: string; label: string; value: number | string; color: string; sub?: string }) {
  return (
    <div style={{ padding: "22px", borderRadius: 16, background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 80, height: 80, borderRadius: "0 16px 0 80px", background: `${color}08` }} />
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 900, color, lineHeight: 1, letterSpacing: "-1px" }}>{value}</div>
      <div>
        <div style={{ fontSize: 11, color: "#f0f0f5", opacity: 0.4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color, opacity: 0.6, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function SuperAdminPage() {
  const { user, loading, role, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/login"); return; }
    if (role !== null && role !== "superadmin") { router.replace("/"); }
  }, [user, loading, role, router]);

  useEffect(() => {
    if (role !== "superadmin") return;
    loadAll();
  }, [role]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const loadAll = async () => {
    setDataLoading(true);
    const sb = createClient();
    const [{ data: profilesData }, { data: artsData }, { data: modsData }] = await Promise.all([
      sb.from("profiles").select("id,name,role,created_at").order("created_at", { ascending: false }),
      sb.from("articles").select("id,title,category,published,author,created_at").order("created_at", { ascending: false }),
      sb.from("modules").select("id,title,level,published,sort_order").order("sort_order", { ascending: true }),
    ]);
    setUsers(profilesData || []);
    setArticles(artsData || []);
    setModules(modsData || []);
    setDataLoading(false);
  };

  const changeRole = async (userId: string, newRole: string) => {
    if (!confirm(`Ubah role user ini menjadi "${newRole}"?`)) return;
    const sb = createClient();
    const { error } = await sb.from("profiles").update({ role: newRole }).eq("id", userId);
    if (error) { setActionMsg("❌ Gagal: " + error.message); }
    else { setActionMsg(`✅ Role berhasil diubah menjadi ${newRole}`); loadAll(); }
    setTimeout(() => setActionMsg(""), 4000);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Hapus user ini? Ini akan menghapus profile-nya dari sistem.")) return;
    const sb = createClient();
    const { error } = await sb.from("profiles").delete().eq("id", userId);
    if (error) setActionMsg("❌ Gagal hapus: " + error.message);
    else { setActionMsg("✅ User dihapus"); loadAll(); }
    setTimeout(() => setActionMsg(""), 4000);
  };

  const toggleArticle = async (id: number, published: boolean) => {
    const sb = createClient();
    await sb.from("articles").update({ published: !published }).eq("id", id);
    loadAll();
  };

  const toggleModule = async (id: number, published: boolean) => {
    const sb = createClient();
    await sb.from("modules").update({ published: !published }).eq("id", id);
    loadAll();
  };

  const deleteArticle = async (id: number) => {
    if (!confirm("Hapus artikel ini?")) return;
    await createClient().from("articles").delete().eq("id", id);
    loadAll();
  };

  const deleteModule = async (id: number) => {
    if (!confirm("Hapus modul dan semua pelajarannya?")) return;
    const sb = createClient();
    await sb.from("module_lessons").delete().eq("module_id", id);
    await sb.from("modules").delete().eq("id", id);
    loadAll();
  };

  const handleSignOut = async () => { await signOut(); router.replace("/"); };

  if (loading || role === null) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08090f" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", border: `3px solid ${PURPLE}20`, borderTop: `3px solid ${PURPLE}`, margin: "0 auto 16px", animation: "spin 0.7s linear infinite" }} />
        <p style={{ color: "#f0f0f5", opacity: 0.3, fontSize: 13 }}>Memverifikasi akses superadmin...</p>
      </div>
    </div>
  );
  if (role !== "superadmin") return null;

  const superadminProfile = users.find(u => u.id === user?.id);
  const adminUsers = users.filter(u => u.role === "admin");
  const regularUsers = users.filter(u => u.role === "user");
  const filteredUsers = users.filter(u =>
    !userSearch || (u.name || "").toLowerCase().includes(userSearch.toLowerCase())
  );

  const thS: React.CSSProperties = { padding: "12px 18px", fontSize: 10, fontWeight: 800, color: "#f0f0f5", opacity: 0.3, textAlign: "left", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.1em" };
  const tdS: React.CSSProperties = { padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.04)", color: "#f0f0f5", fontSize: 13 };

  const ROLE_COLORS: Record<string, string> = {
    superadmin: PURPLE,
    admin: GOLD,
    user: "#06b6d4",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0c0d14", color: "#f0f0f5", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
        .arow:hover { background: rgba(167,139,250,0.04) !important }
        .tab-anim { animation: fadeUp .2s ease both }
        * { box-sizing: border-box }
        input:focus, button:focus, textarea:focus, select:focus { outline: none }
        ::-webkit-scrollbar { width: 5px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px }
        select option { background: #1a1b2e; color: #f0f0f5 }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: 240, flexShrink: 0, minHeight: "100vh", background: "#08090f", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", position: "sticky", top: 0, maxHeight: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "28px 20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, ${PURPLE}, #7c3aed)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#fff", letterSpacing: "-0.5px" }}>LH</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16, color: "#f0f0f5", letterSpacing: "-0.3px" }}>Learn<span style={{ color: PURPLE }}>Hub</span></div>
              <div style={{ fontSize: 8, letterSpacing: "0.18em", opacity: 0.3, color: "#f0f0f5", fontFamily: "monospace", fontWeight: 700 }}>SUPERADMIN</div>
            </div>
          </div>
          {/* Crown badge */}
          <div style={{ marginTop: 14, padding: "6px 12px", borderRadius: 8, background: `${PURPLE}15`, border: `1px solid ${PURPLE}30`, fontSize: 11, color: PURPLE, fontWeight: 700 }}>
            👑 Akses Level Tertinggi
          </div>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 16px" }} />
        <nav style={{ flex: 1, padding: "18px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.15em", color: "#f0f0f5", opacity: 0.2, fontWeight: 800, padding: "0 10px", marginBottom: 8 }}>MENU</div>
          {TABS.map(t => {
            const isActive = activeTab === t.key;
            return (
              <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: isActive ? `rgba(167,139,250,0.12)` : "transparent", color: isActive ? PURPLE : "rgba(240,240,245,0.4)", fontWeight: isActive ? 700 : 500, fontSize: 13, textAlign: "left", transition: "all .15s", position: "relative" }}>
                {isActive && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: "0 3px 3px 0", background: PURPLE }} />}
                <span style={{ fontSize: 14, fontFamily: "monospace", opacity: isActive ? 1 : 0.6 }}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 4px" }} />
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, color: `rgba(245,158,11,0.7)`, fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.background = `${GOLD}10`; }}
            onMouseLeave={e => { e.currentTarget.style.color = `rgba(245,158,11,0.7)`; e.currentTarget.style.background = "transparent"; }}>
            <span style={{ fontSize: 14 }}>🛡</span> Admin Dashboard
          </Link>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, color: "rgba(240,240,245,0.35)", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(240,240,245,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(240,240,245,0.35)"; e.currentTarget.style.background = "transparent"; }}>
            <span style={{ fontSize: 14 }}>←</span> Kembali ke Site
          </Link>
        </nav>

        {/* User card bottom */}
        <div style={{ padding: "12px 12px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div ref={dropRef} style={{ position: "relative" }}>
            <button onClick={() => setDropOpen(v => !v)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", borderRadius: 12, border: `1px solid ${PURPLE}30`, background: dropOpen ? `${PURPLE}12` : `${PURPLE}08`, cursor: "pointer", transition: "background .15s" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${PURPLE}60, #7c3aed)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff" }}>{(superadminProfile?.name || "S")[0].toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{superadminProfile?.name || "Superadmin"}</div>
                <div style={{ fontSize: 10, color: PURPLE, fontWeight: 600 }}>👑 Superadmin</div>
              </div>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, transition: "transform .2s", transform: dropOpen ? "rotate(180deg)" : "none" }}>▾</span>
            </button>
            {dropOpen && (
              <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, background: "#111218", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden", zIndex: 50, boxShadow: "0 -16px 40px rgba(0,0,0,0.5)" }}>
                <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 10, opacity: 0.35, color: "#f0f0f5", marginBottom: 2 }}>Login sebagai</div>
                  <div style={{ fontSize: 11, color: "#f0f0f5", fontWeight: 600 }}>{user?.email}</div>
                </div>
                <button onClick={() => { setDropOpen(false); handleSignOut(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 13, fontWeight: 600, textAlign: "left" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.07)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                  <span>⏏</span> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, padding: "36px 32px 72px", overflowX: "hidden" }}>
        <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", opacity: 0.3, fontWeight: 800, marginBottom: 6 }}>
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase()}
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, margin: 0, letterSpacing: "-0.5px", lineHeight: 1 }}>
              👑 <span style={{ color: PURPLE }}>Superadmin</span> Panel
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ val: users.length, label: "Total User" }, { val: adminUsers.length, label: "Admin" }, { val: articles.length, label: "Artikel" }].map(s => (
              <div key={s.label} style={{ padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: PURPLE, letterSpacing: "-0.5px" }}>{s.val}</div>
                <div style={{ fontSize: 9, opacity: 0.35, fontWeight: 700, letterSpacing: "0.08em" }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {actionMsg && (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: actionMsg.startsWith("✅") ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${actionMsg.startsWith("✅") ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, color: actionMsg.startsWith("✅") ? "#22c55e" : "#f87171", fontSize: 13, marginBottom: 20 }}>
            {actionMsg}
          </div>
        )}

        {dataLoading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${PURPLE}20`, borderTop: `2px solid ${PURPLE}`, margin: "0 auto 14px", animation: "spin 0.7s linear infinite" }} />
            <p style={{ opacity: 0.3, fontSize: 13 }}>Memuat data...</p>
          </div>
        ) : (
          <div className="tab-anim" key={activeTab}>

            {/* ══ OVERVIEW ══ */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14 }}>
                  <StatCard icon="👑" label="Superadmin"  value={1}                   color={PURPLE} />
                  <StatCard icon="🛡" label="Admin"        value={adminUsers.length}   color={GOLD} />
                  <StatCard icon="👥" label="User Biasa"   value={regularUsers.length} color="#06b6d4" />
                  <StatCard icon="📝" label="Artikel"      value={articles.length}     color="#22c55e" />
                  <StatCard icon="📚" label="Modul"        value={modules.length}      color="#f97316" />
                </div>

                {/* Admin list */}
                <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ padding: "20px 22px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0f5", margin: 0 }}>🛡️ Daftar Admin</h2>
                      <p style={{ fontSize: 11, opacity: 0.35, margin: "4px 0 0" }}>{adminUsers.length} admin aktif</p>
                    </div>
                    <button onClick={() => setActiveTab("admins")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${GOLD}30`, background: `${GOLD}10`, color: GOLD, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Kelola Admin →</button>
                  </div>
                  {adminUsers.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", opacity: 0.25, fontSize: 13 }}>Belum ada admin. Promosikan user dari tab Kelola Admin.</div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr style={{ background: "rgba(255,255,255,0.02)" }}><th style={thS}>Admin</th><th style={thS}>ID</th><th style={thS}>Bergabung</th><th style={thS}>Aksi</th></tr></thead>
                      <tbody>
                        {adminUsers.map(u => (
                          <tr key={u.id} className="arow" style={{ transition: "background .15s" }}>
                            <td style={tdS}>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: GOLD, fontSize: 13 }}>{(u.name || "A")[0].toUpperCase()}</div>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{u.name || "(tanpa nama)"}</div>
                                  <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 99, background: `${GOLD}18`, color: GOLD, fontWeight: 700 }}>🛡 Admin</span>
                                </div>
                              </div>
                            </td>
                            <td style={tdS}><span style={{ opacity: 0.25, fontFamily: "monospace", fontSize: 11 }}>{u.id.slice(0, 12)}…</span></td>
                            <td style={tdS}><span style={{ opacity: 0.3, fontFamily: "monospace", fontSize: 11 }}>{new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}</span></td>
                            <td style={tdS}>
                              <button onClick={() => changeRole(u.id, "user")} style={{ padding: "5px 12px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer" }}>Turunkan ke User</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ══ SEMUA USERS ══ */}
            {activeTab === "users" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", maxWidth: 360 }}>
                  <span style={{ opacity: 0.25, fontSize: 14 }}>🔍</span>
                  <input type="text" placeholder="Cari nama user..." value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", padding: "11px 0", fontSize: 13, color: "#f0f0f5" }} />
                  {userSearch && <button onClick={() => setUserSearch("")} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.35, color: "#f0f0f5", fontSize: 13 }}>✕</button>}
                </div>
                <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr style={{ background: "rgba(255,255,255,0.02)" }}>{["#", "User", "Role", "Bergabung", "Aksi"].map(h => <th key={h} style={thS}>{h}</th>)}</tr></thead>
                      <tbody>
                        {filteredUsers.map((u, i) => (
                          <tr key={u.id} className="arow" style={{ transition: "background .15s" }}>
                            <td style={tdS}><span style={{ opacity: 0.2, fontFamily: "monospace", fontSize: 12 }}>{i + 1}</span></td>
                            <td style={tdS}>
                              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${ROLE_COLORS[u.role] || "#06b6d4"}20`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: ROLE_COLORS[u.role] || "#06b6d4", fontSize: 13, flexShrink: 0 }}>{(u.name || "?")[0].toUpperCase()}</div>
                                <div>
                                  <div style={{ fontWeight: 600 }}>{u.name || "(tanpa nama)"}</div>
                                  <div style={{ fontSize: 9, opacity: 0.2, fontFamily: "monospace", marginTop: 1 }}>{u.id.slice(0, 16)}…</div>
                                </div>
                              </div>
                            </td>
                            <td style={tdS}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: `${ROLE_COLORS[u.role] || "#06b6d4"}18`, color: ROLE_COLORS[u.role] || "#06b6d4" }}>
                                {u.role === "superadmin" ? "👑 Superadmin" : u.role === "admin" ? "🛡 Admin" : "👤 User"}
                              </span>
                            </td>
                            <td style={tdS}><span style={{ opacity: 0.3, fontFamily: "monospace", fontSize: 11 }}>{new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}</span></td>
                            <td style={tdS}>
                              {u.id !== user?.id && u.role !== "superadmin" && (
                                <div style={{ display: "flex", gap: 6 }}>
                                  {u.role === "user" && (
                                    <button onClick={() => changeRole(u.id, "admin")} style={{ padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: `1px solid ${GOLD}30`, background: `${GOLD}10`, color: GOLD, cursor: "pointer" }}>↑ Admin</button>
                                  )}
                                  {u.role === "admin" && (
                                    <button onClick={() => changeRole(u.id, "user")} style={{ padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer" }}>↓ User</button>
                                  )}
                                  <button onClick={() => deleteUser(u.id)} style={{ padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer" }}>🗑</button>
                                </div>
                              )}
                              {u.id === user?.id && <span style={{ fontSize: 10, opacity: 0.3 }}>(kamu)</span>}
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && <tr><td colSpan={5} style={{ padding: "48px", textAlign: "center", opacity: 0.25, fontSize: 13 }}>Tidak ada user ditemukan.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ══ KELOLA ADMIN ══ */}
            {activeTab === "admins" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ padding: "14px 18px", borderRadius: 12, background: `${PURPLE}08`, border: `1px solid ${PURPLE}20`, fontSize: 12 }}>
                  💡 Sebagai Superadmin, kamu bisa mempromosikan/menurunkan admin tanpa SQL. Perubahan langsung efektif.
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#f0f0f5", margin: "8px 0 4px" }}>Admin Aktif ({adminUsers.length})</h3>
                {adminUsers.length === 0 ? (
                  <div style={{ padding: "32px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)", opacity: 0.4 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🛡</div>
                    <p style={{ fontSize: 13 }}>Belum ada admin. Promosikan user di bawah.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {adminUsers.map(u => (
                      <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 12, background: `${GOLD}06`, border: `1px solid ${GOLD}20` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${GOLD}20`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: GOLD, fontSize: 14 }}>{(u.name || "A")[0].toUpperCase()}</div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#f0f0f5" }}>{u.name || "(tanpa nama)"}</div>
                            <div style={{ fontSize: 10, color: GOLD, fontWeight: 600 }}>🛡 Admin · Bergabung {new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}</div>
                          </div>
                        </div>
                        <button onClick={() => changeRole(u.id, "user")} style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer" }}>
                          Turunkan ke User
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#f0f0f5", margin: "16px 0 4px" }}>Promosikan User menjadi Admin</h3>
                <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr style={{ background: "rgba(255,255,255,0.02)" }}><th style={thS}>User</th><th style={thS}>Bergabung</th><th style={thS}>Aksi</th></tr></thead>
                    <tbody>
                      {regularUsers.map(u => (
                        <tr key={u.id} className="arow" style={{ transition: "background .15s" }}>
                          <td style={tdS}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(6,182,212,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#06b6d4", fontSize: 12 }}>{(u.name || "?")[0].toUpperCase()}</div>
                              <span style={{ fontWeight: 500 }}>{u.name || "(tanpa nama)"}</span>
                            </div>
                          </td>
                          <td style={tdS}><span style={{ opacity: 0.3, fontFamily: "monospace", fontSize: 11 }}>{new Date(u.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}</span></td>
                          <td style={tdS}>
                            <button onClick={() => changeRole(u.id, "admin")} style={{ padding: "5px 14px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: `1px solid ${GOLD}30`, background: `${GOLD}10`, color: GOLD, cursor: "pointer" }}>
                              ↑ Jadikan Admin
                            </button>
                          </td>
                        </tr>
                      ))}
                      {regularUsers.length === 0 && <tr><td colSpan={3} style={{ padding: "32px", textAlign: "center", opacity: 0.25, fontSize: 13 }}>Semua user sudah menjadi admin.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ══ KONTEN GLOBAL ══ */}
            {activeTab === "konten" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: `${PURPLE}08`, border: `1px solid ${PURPLE}20`, fontSize: 12, color: "#f0f0f5", opacity: 0.8 }}>
                  👑 Superadmin dapat mengaktifkan/menonaktifkan dan menghapus semua konten. Untuk membuat/edit detail, gunakan <Link href="/admin" style={{ color: PURPLE, textDecoration: "underline" }}>Admin Dashboard</Link>.
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#f0f0f5", margin: "4px 0" }}>Artikel ({articles.length})</h3>
                <div style={{ borderRadius: 16, overflow: "hidden", background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr style={{ background: "rgba(255,255,255,0.02)" }}><th style={thS}>#</th><th style={thS}>Judul</th><th style={thS}>Kategori</th><th style={thS}>Penulis</th><th style={thS}>Status</th><th style={thS}>Aksi</th></tr></thead>
                      <tbody>
                        {articles.map((a, i) => (
                          <tr key={a.id} className="arow" style={{ transition: "background .15s" }}>
                            <td style={tdS}><span style={{ opacity: 0.2, fontFamily: "monospace", fontSize: 12 }}>{i + 1}</span></td>
                            <td style={{ ...tdS, maxWidth: 260 }}><div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div></td>
                            <td style={tdS}><span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: "rgba(255,255,255,0.06)", color: "#f0f0f5", opacity: 0.7 }}>{a.category}</span></td>
                            <td style={tdS}><span style={{ opacity: 0.5, fontSize: 12 }}>{a.author}</span></td>
                            <td style={tdS}><span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: a.published ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)", color: a.published ? "#22c55e" : "#f87171" }}>{a.published ? "✓ Publik" : "Hidden"}</span></td>
                            <td style={tdS}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button onClick={() => toggleArticle(a.id, a.published)} style={{ padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: `1px solid ${a.published ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, background: a.published ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)", color: a.published ? "#f87171" : "#22c55e", cursor: "pointer" }}>
                                  {a.published ? "Hide" : "Show"}
                                </button>
                                <button onClick={() => deleteArticle(a.id)} style={{ padding: "5px 10px", borderRadius: 7, fontSize: 11, fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer" }}>🗑</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {articles.length === 0 && <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", opacity: 0.25, fontSize: 13 }}>Belum ada artikel.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#f0f0f5", margin: "8px 0 4px" }}>Modul ({modules.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {modules.map(m => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: "#f0f0f5", marginBottom: 3 }}>{m.title}</div>
                        <div style={{ display: "flex", gap: 10, fontSize: 11, opacity: 0.4 }}>
                          <span>{m.level}</span>
                          <span style={{ padding: "1px 8px", borderRadius: 6, background: m.published ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)", color: m.published ? "#22c55e" : "#f87171", opacity: 1 }}>{m.published ? "Publik" : "Hidden"}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => toggleModule(m.id, m.published)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: `1px solid ${m.published ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, background: m.published ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)", color: m.published ? "#f87171" : "#22c55e", cursor: "pointer" }}>
                          {m.published ? "Hide" : "Show"}
                        </button>
                        <button onClick={() => deleteModule(m.id)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)", color: "#f87171", cursor: "pointer" }}>🗑</button>
                      </div>
                    </div>
                  ))}
                  {modules.length === 0 && <div style={{ padding: "32px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px dashed rgba(255,255,255,0.1)", opacity: 0.4, fontSize: 13 }}>Belum ada modul.</div>}
                </div>
              </div>
            )}

            {/* ══ SYSTEM ══ */}
            {activeTab === "system" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ padding: "20px 22px", borderRadius: 16, background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h2 style={{ fontSize: 15, fontWeight: 800, color: "#f0f0f5", marginBottom: 16 }}>⚙️ Informasi System</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
                    {[
                      { label: "Total Users", value: users.length, desc: `${adminUsers.length} admin, ${regularUsers.length} user` },
                      { label: "Total Artikel", value: articles.length, desc: `${articles.filter(a=>a.published).length} publik, ${articles.filter(a=>!a.published).length} hidden` },
                      { label: "Total Modul", value: modules.length, desc: `${modules.filter(m=>m.published).length} publik, ${modules.filter(m=>!m.published).length} hidden` },
                    ].map(s => (
                      <div key={s.label} style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: PURPLE, letterSpacing: "-1px", marginBottom: 4 }}>{s.value}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#f0f0f5", opacity: 0.6 }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "#f0f0f5", opacity: 0.3, marginTop: 2 }}>{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "20px 22px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: "#f0f0f5", opacity: 0.5, marginBottom: 14, letterSpacing: "0.05em" }}>AKSES CEPAT</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {[
                      { label: "🛡 Admin Dashboard", href: "/admin", color: GOLD },
                      { label: "📝 Kelola Artikel", href: "/admin", color: "#22c55e" },
                      { label: "📚 Kelola Modul", href: "/admin", color: "#06b6d4" },
                      { label: "🏠 Kembali ke Site", href: "/", color: "#f0f0f5" },
                    ].map(b => (
                      <Link key={b.label} href={b.href} style={{ padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: `1px solid ${b.color}30`, background: `${b.color}10`, color: b.color, textDecoration: "none", transition: "all .15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${b.color}18`; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${b.color}10`; }}>
                        {b.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
