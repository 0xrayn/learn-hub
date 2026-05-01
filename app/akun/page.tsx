"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase";
import { fetchModules, type Module } from "../lib/supabase-data";

type Tab = "profil" | "pembelajaran" | "password" | "bahaya";

export default function AkunPage() {
  const { user, loading, role, signOut } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<Tab>("profil");

  // Profil
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Stats
  const [stats, setStats] = useState({ lessons: 0, bookmarks: 0 });
  const [modules, setModules] = useState<Module[]>([]);
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const sb = createClient();
    // Load profile from Supabase
    sb.from("profiles").select("name,bio,avatar_url").eq("id", user.id).single().then(({ data }) => {
      if (data) {
        setName(data.name || user.user_metadata?.name || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || null);
      } else {
        setName(user.user_metadata?.name || "");
      }
    });
    // Stats
    Promise.all([
      sb.from("module_progress").select("id", { count: "exact" }).eq("user_id", user.id).eq("completed", true),
      sb.from("artikel_bookmarks").select("id", { count: "exact" }).eq("user_id", user.id),
    ]).then(([p, b]) => setStats({ lessons: p.count || 0, bookmarks: b.count || 0 }));

    // Load modules + progress for learning tab
    fetchModules().then(setModules);
    sb.from("module_progress")
      .select("module_id, lesson_idx, completed")
      .eq("user_id", user.id)
      .eq("completed", true)
      .then(({ data }) => {
        if (data) {
          const map: Record<number, number> = {};
          data.forEach((r: any) => { map[r.module_id] = (map[r.module_id] || 0) + 1; });
          setProgressMap(map);
        }
      });
  }, [user]);

  if (loading || !user) return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid rgba(245,158,11,0.15)", borderTop: "3px solid #f59e0b", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </main>
    </>
  );

  // Handle avatar selection (base64 preview, no storage bucket needed)
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setProfileMsg({ type: "err", text: "Ukuran foto max 2MB." });
      return;
    }
    setUploadingAvatar(true);
    setProfileMsg(null);
    // Convert to base64 data URL
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setAvatarPreview(dataUrl);
      // Save to profile as base64 (or use Supabase Storage if configured)
      const sb = createClient();
      await sb.from("profiles").update({ avatar_url: dataUrl }).eq("id", user.id);
      setAvatarUrl(dataUrl);
      setUploadingAvatar(false);
      setProfileMsg({ type: "ok", text: "Foto profil diperbarui! ✓" });
    };
    reader.onerror = () => {
      setUploadingAvatar(false);
      setProfileMsg({ type: "err", text: "Gagal membaca file." });
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!name.trim()) { setProfileMsg({ type: "err", text: "Nama tidak boleh kosong." }); return; }
    setSavingProfile(true); setProfileMsg(null);
    const sb = createClient();
    const [r1, r2] = await Promise.all([
      sb.auth.updateUser({ data: { name: name.trim() } }),
      sb.from("profiles").update({ name: name.trim(), bio: bio.trim() }).eq("id", user.id),
    ]);
    setSavingProfile(false);
    if (r1.error || r2.error) setProfileMsg({ type: "err", text: "Gagal menyimpan. Coba lagi." });
    else setProfileMsg({ type: "ok", text: "Profil berhasil diperbarui! ✓" });
  };

  const savePassword = async () => {
    setPassMsg(null);
    if (!newPass || !confirmPass) { setPassMsg({ type: "err", text: "Semua field wajib diisi." }); return; }
    if (newPass.length < 8) { setPassMsg({ type: "err", text: "Password minimal 8 karakter." }); return; }
    if (newPass !== confirmPass) { setPassMsg({ type: "err", text: "Konfirmasi password tidak cocok." }); return; }
    setSavingPass(true);
    const sb = createClient();
    const { error } = await sb.auth.updateUser({ password: newPass });
    setSavingPass(false);
    if (error) setPassMsg({ type: "err", text: error.message });
    else { setPassMsg({ type: "ok", text: "Password berhasil diperbarui! ✓" }); setNewPass(""); setConfirmPass(""); }
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== "HAPUS AKUN") { setDeleteMsg({ type: "err", text: 'Ketik "HAPUS AKUN" untuk konfirmasi.' }); return; }
    setDeleting(true); setDeleteMsg(null);
    const sb = createClient();
    await Promise.all([
      sb.from("module_progress").delete().eq("user_id", user.id),
      sb.from("artikel_bookmarks").delete().eq("user_id", user.id),
      sb.from("profiles").delete().eq("id", user.id),
    ]);
    await signOut();
    router.push("/");
  };

  const A = "#f59e0b";
  const tabBtn = (t: Tab, label: string) => (
    <button onClick={() => setTab(t)} style={{
      padding: "9px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
      cursor: "pointer", border: "none", transition: "all .2s",
      background: tab === t ? A : "rgba(255,255,255,0.05)",
      color: tab === t ? "#000" : "rgba(255,255,255,0.45)",
      boxShadow: tab === t ? `0 4px 16px ${A}40` : "none",
    }}>{label}</button>
  );

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 14,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    color: "var(--text-main,#e8eaf0)", boxSizing: "border-box" as const,
  };
  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: "var(--text-main,#e8eaf0)", opacity: 0.5,
    display: "block", marginBottom: 7, textTransform: "uppercase" as const, letterSpacing: "0.07em",
  };
  const msgEl = (m: { type: "ok" | "err"; text: string }) => (
    <div style={{ padding: "10px 14px", borderRadius: 9, fontSize: 13, background: m.type === "ok" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${m.type === "ok" ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.22)"}`, color: m.type === "ok" ? "#4ade80" : "#f87171" }}>
      {m.text}
    </div>
  );

  const displayAvatar = avatarPreview || avatarUrl;
  const initials = (name || user.email || "U").slice(0, 2).toUpperCase();
  const joined = new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <Navbar />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>

        {/* Header */}
        <div style={{ padding: "40px 20px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: `linear-gradient(135deg, ${A}06, rgba(6,182,212,0.02))` }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
              {/* Avatar with upload button */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", border: `2px solid ${A}40`, overflow: "hidden", background: `linear-gradient(135deg, ${A}40, rgba(6,182,212,0.3))`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {displayAvatar ? (
                    <img src={displayAvatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 28, fontWeight: 900, color: "var(--text-main,#e8eaf0)" }}>{initials}</span>
                  )}
                </div>
                {/* Upload overlay */}
                <button onClick={() => fileInputRef.current?.click()}
                  title="Ganti foto profil"
                  style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: A, border: "2px solid #0c0d14", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>
                  {uploadingAvatar ? "⏳" : "📷"}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <h1 className="font-black" style={{ fontSize: "1.4rem", color: "var(--text-main,#e8eaf0)", margin: 0 }}>{name || "(tanpa nama)"}</h1>
                  {role === "admin" && <span style={{ fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 6, background: `${A}20`, border: `1px solid ${A}40`, color: A }}>ADMIN</span>}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.45 }}>{user.email}</div>
                {bio && <div style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.55, marginTop: 4, fontStyle: "italic" }}>"{bio}"</div>}
                <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.3, marginTop: 3 }}>Bergabung {joined}</div>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { icon: "✅", val: stats.lessons, label: "Lesson" },
                  { icon: "🔖", val: stats.bookmarks, label: "Bookmark" },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
                    <div className="font-mono-styled" style={{ fontSize: 20, fontWeight: 900, color: A }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px 80px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
            {tabBtn("profil", "👤 Profil")}
            {tabBtn("pembelajaran", "📚 Pembelajaran")}
            {tabBtn("password", "🔒 Password")}
            {tabBtn("bahaya", "⚠️ Zona Bahaya")}
          </div>

          <div style={{ animation: "fadeUp .2s ease both" }} key={tab}>

            {/* ── PEMBELAJARAN ── */}
            {tab === "pembelajaran" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 3 }}>Progres Belajarmu</h2>
                    <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.4 }}>
                      {Object.keys(progressMap).length > 0
                        ? `${modules.filter(m => (progressMap[m.id] || 0) >= m.lessons.length && m.lessons.length > 0).length} modul selesai`
                        : "Mulai belajar dan progress-mu akan tampil di sini"}
                    </p>
                  </div>
                  <Link href="/edukasi" style={{ padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 700, background: `${A}12`, border: `1px solid ${A}30`, color: A, textDecoration: "none" }}>
                    📚 Lanjut Belajar →
                  </Link>
                </div>

                {modules.length === 0 && (
                  <div style={{ textAlign: "center", padding: "48px 20px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>📚</div>
                    <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, fontSize: 13 }}>Belum ada modul tersedia.</p>
                  </div>
                )}

                {modules.map(m => {
                  const done = progressMap[m.id] || 0;
                  const total = m.lessons.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  const isComplete = done >= total && total > 0;
                  const hasStarted = done > 0;

                  return (
                    <Link key={m.id} href={`/edukasi/${m.id}`} style={{ textDecoration: "none" }}>
                      <div className="grad-border" style={{ padding: "18px 20px", transition: "all .2s", cursor: "pointer" }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, background: isComplete ? "rgba(34,197,94,0.12)" : `${m.accent}15`, border: `1px solid ${isComplete ? "rgba(34,197,94,0.3)" : m.accent + "30"}` }}>
                            {isComplete ? "✅" : m.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>{m.title}</div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: isComplete ? "#22c55e" : hasStarted ? m.accent : "rgba(255,255,255,0.3)" }}>
                                {isComplete ? "✓ Selesai" : hasStarted ? `${done}/${total}` : "Belum mulai"}
                              </div>
                            </div>
                            <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                              <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: isComplete ? "#22c55e" : `linear-gradient(to right, ${m.accent}, #06b6d4)`, transition: "width 0.5s ease" }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                              <span style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.35 }}>{m.level} · ⏱ {m.dur} · {total} pelajaran</span>
                              <span style={{ fontSize: 10, color: isComplete ? "#22c55e" : m.accent, fontWeight: 700 }}>{pct}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Lesson list preview */}
                        {hasStarted && total > 0 && (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {m.lessons.slice(0, 8).map((l, idx) => {
                              const lessonDone = idx < done; // simplified progress check
                              return (
                                <div key={idx} style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, background: lessonDone ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${lessonDone ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`, color: lessonDone ? "#22c55e" : "rgba(255,255,255,0.25)", flexShrink: 0 }}>
                                  {lessonDone ? "✓" : idx + 1}
                                </div>
                              );
                            })}
                            {total > 8 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", alignSelf: "center" }}>+{total - 8}</div>}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ── PROFIL ── */}
            {tab === "profil" && (
              <div className="grad-border" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 4 }}>Edit Profil</h2>
                <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.4, marginBottom: 24 }}>Perbarui informasi profil akunmu.</p>

                {/* Avatar section */}
                <div style={{ marginBottom: 22, padding: "16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 60, height: 60, borderRadius: "50%", border: `2px solid ${A}40`, overflow: "hidden", background: `linear-gradient(135deg, ${A}40, rgba(6,182,212,0.3))`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {displayAvatar ? (
                      <img src={displayAvatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 22, fontWeight: 900, color: "var(--text-main,#e8eaf0)" }}>{initials}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)", marginBottom: 4 }}>Foto Profil</div>
                    <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.4, marginBottom: 10 }}>Format JPG, PNG atau GIF. Maksimal 2MB.</div>
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}
                      style={{ padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: `1px solid ${A}40`, cursor: "pointer", background: `${A}12`, color: A }}>
                      {uploadingAvatar ? "⏳ Mengupload..." : "📷 Ganti Foto"}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <label style={labelStyle}>Nama Lengkap</label>
                    <input value={name} onChange={(e) => { setName(e.target.value); setProfileMsg(null); }} placeholder="Nama kamu" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Bio / Deskripsi Singkat</label>
                    <textarea value={bio} onChange={(e) => { setBio(e.target.value); setProfileMsg(null); }} placeholder="Ceritakan sedikit tentang dirimu..." rows={3}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 80, fontFamily: "inherit", lineHeight: 1.6 }} />
                    <div style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.3, marginTop: 4 }}>{bio.length}/200 karakter</div>
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input value={user.email || ""} disabled style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }} />
                    <p style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.35, marginTop: 6 }}>Email tidak bisa diubah langsung. Hubungi admin jika diperlukan.</p>
                  </div>
                  <div>
                    <label style={labelStyle}>Role</label>
                    <input value={role === "admin" ? "🛡️ Admin" : "👤 User"} disabled style={{ ...inputStyle, opacity: 0.4, cursor: "not-allowed" }} />
                  </div>
                  {profileMsg && msgEl(profileMsg)}
                  <button onClick={saveProfile} disabled={savingProfile}
                    style={{ padding: "12px 28px", borderRadius: 11, fontSize: 14, fontWeight: 800, border: "none", cursor: savingProfile ? "not-allowed" : "pointer", background: savingProfile ? "rgba(245,158,11,0.3)" : `linear-gradient(135deg, ${A}, #f97316)`, color: "#000", alignSelf: "flex-start", opacity: savingProfile ? 0.7 : 1 }}>
                    {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </div>
            )}

            {/* ── PASSWORD ── */}
            {tab === "password" && (
              <div className="grad-border" style={{ padding: "28px" }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 4 }}>Ganti Password</h2>
                <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.4, marginBottom: 24 }}>Gunakan password yang kuat dan unik.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Password Baru</label>
                    <div style={{ position: "relative" }}>
                      <input type={showNew ? "text" : "password"} value={newPass} onChange={(e) => { setNewPass(e.target.value); setPassMsg(null); }} placeholder="Min. 8 karakter" style={{ ...inputStyle, paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: 0.4, color: "var(--text-main,#e8eaf0)" }}>{showNew ? "🙈" : "👁"}</button>
                    </div>
                    {newPass && (() => {
                      const s = newPass.length < 6 ? 1 : newPass.length < 10 ? 2 : /[A-Z]/.test(newPass) && /[0-9]/.test(newPass) ? 4 : 3;
                      const colors = ["", "#ef4444", "#f59e0b", "#22c55e", "#06b6d4"];
                      const labels = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
                      return (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${s * 25}%`, background: colors[s], borderRadius: 99, transition: "all .3s" }} />
                          </div>
                          <span style={{ fontSize: 10, color: colors[s], fontWeight: 700, marginTop: 4, display: "block" }}>{labels[s]}</span>
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <label style={labelStyle}>Konfirmasi Password Baru</label>
                    <div style={{ position: "relative" }}>
                      <input type={showConfirm ? "text" : "password"} value={confirmPass} onChange={(e) => { setConfirmPass(e.target.value); setPassMsg(null); }} placeholder="Ulangi password baru" style={{ ...inputStyle, paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: 0.4, color: "var(--text-main,#e8eaf0)" }}>{showConfirm ? "🙈" : "👁"}</button>
                    </div>
                    {confirmPass && newPass && (
                      <span style={{ fontSize: 10, color: newPass === confirmPass ? "#22c55e" : "#ef4444", fontWeight: 700, marginTop: 4, display: "block" }}>
                        {newPass === confirmPass ? "✓ Password cocok" : "✗ Password tidak cocok"}
                      </span>
                    )}
                  </div>
                  {passMsg && msgEl(passMsg)}
                  <button onClick={savePassword} disabled={savingPass}
                    style={{ padding: "12px 28px", borderRadius: 11, fontSize: 14, fontWeight: 800, border: "none", cursor: savingPass ? "not-allowed" : "pointer", background: savingPass ? "rgba(245,158,11,0.3)" : `linear-gradient(135deg, ${A}, #f97316)`, color: "#000", alignSelf: "flex-start", opacity: savingPass ? 0.7 : 1 }}>
                    {savingPass ? "Menyimpan..." : "Ganti Password"}
                  </button>
                </div>
              </div>
            )}

            {/* ── BAHAYA ── */}
            {tab === "bahaya" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="grad-border" style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-main,#e8eaf0)", marginBottom: 4 }}>🚪 Keluar dari Semua Perangkat</h3>
                  <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.5, marginBottom: 16, lineHeight: 1.7 }}>Logout dari semua sesi aktif. Kamu perlu login ulang di semua perangkat.</p>
                  <button onClick={async () => { await signOut(); router.push("/login"); }}
                    style={{ padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "var(--text-main,#e8eaf0)" }}>
                    🚪 Keluar Semua Sesi
                  </button>
                </div>

                <div className="grad-border" style={{ padding: "24px", borderColor: "rgba(239,68,68,0.25)" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#f87171", marginBottom: 4 }}>🗑️ Hapus Akun</h3>
                  <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.5, marginBottom: 16, lineHeight: 1.7 }}>
                    Tindakan ini <strong style={{ color: "#f87171" }}>tidak bisa dibatalkan</strong>. Semua data progress dan bookmark akan dihapus permanen.
                  </p>
                  <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", marginBottom: 16 }}>
                    <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.55, lineHeight: 1.8 }}>
                      <li>Progress belajar ({stats.lessons} lesson selesai)</li>
                      <li>Bookmark artikel ({stats.bookmarks} artikel)</li>
                      <li>Profil & foto akun</li>
                    </ul>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ ...labelStyle, color: "#f87171" }}>Ketik "HAPUS AKUN" untuk konfirmasi</label>
                    <input value={deleteConfirm} onChange={(e) => { setDeleteConfirm(e.target.value); setDeleteMsg(null); }} placeholder="HAPUS AKUN" style={{ ...inputStyle, borderColor: "rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.04)" }} />
                  </div>
                  {deleteMsg && msgEl(deleteMsg)}
                  <button onClick={deleteAccount} disabled={deleting || deleteConfirm !== "HAPUS AKUN"}
                    style={{ padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: (deleting || deleteConfirm !== "HAPUS AKUN") ? "not-allowed" : "pointer", background: deleteConfirm === "HAPUS AKUN" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${deleteConfirm === "HAPUS AKUN" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`, color: deleteConfirm === "HAPUS AKUN" ? "#f87171" : "rgba(255,255,255,0.3)", opacity: deleting ? 0.6 : 1 }}>
                    {deleting ? "Menghapus..." : "🗑️ Hapus Akun Permanen"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
