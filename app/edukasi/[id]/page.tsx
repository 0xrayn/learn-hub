"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { fetchModuleById, fetchModules, type Module } from "../../lib/supabase-data";
import { useAuth } from "../../context/AuthContext";
import { createClient } from "../../lib/supabase";

// ─── Certificate — opens in a new tab (no modal) ─────────────────
function openCertificateTab(modul: Module, userName: string) {
  const certId = `LH-${modul.id}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const accent = modul.accent || "#f59e0b";
  // Derive a darker shade for the left sidebar
  const accentDark = "#b8860b";

  const tab = window.open("", "_blank");
  if (!tab) return;
  tab.document.write(`<!DOCTYPE html>
<html lang="id"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Sertifikat — ${userName} | LearnHub</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

/* ── Screen layout ── */
body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #1c1c1e;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Toolbar ── */
.toolbar {
  position: sticky;
  top: 0;
  z-index: 99;
  height: 48px;
  background: #111;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 12px;
  flex-shrink: 0;
}
.toolbar-left { display:flex; align-items:center; gap:10px; }
.tb-dot { width:10px;height:10px;border-radius:50%; }
.tb-dot.red{background:#ff5f57;} .tb-dot.yellow{background:#febc2e;} .tb-dot.green{background:#28c840;}
.toolbar-title { font-size:12px; color:rgba(255,255,255,0.45); margin-left:4px; }
.toolbar-title strong { color:rgba(255,255,255,0.75); font-weight:600; }
.toolbar-right { display:flex; align-items:center; gap:8px; }
.hint { font-size:11px; color:rgba(255,255,255,0.25); white-space:nowrap; }
.btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  border: none;
  transition: opacity 0.15s;
}
.btn:hover { opacity: 0.8; }
.btn-ghost {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.1);
}
.btn-primary {
  background: ${accent};
  color: #000;
  font-weight: 700;
}

/* ── Canvas area ── */
.canvas {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  background: #2a2a2c;
  background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  /* negative margin compensates transform collapse so no scroll */
  overflow: hidden;
}

/* ── The certificate — A4 landscape in mm, works the same on screen and print ── */
.cert {
  width: 297mm;
  height: 210mm;
  /* scale down for screen: 0.72 * 210mm ~= 151mm height, fits viewport */
  transform: scale(0.72);
  transform-origin: center center;
  /* compensate layout space lost by transform */
  margin-top: calc((210mm * 0.72 - 210mm) / 2);
  margin-bottom: calc((210mm * 0.72 - 210mm) / 2);
  margin-left: calc((297mm * 0.72 - 297mm) / 2);
  margin-right: calc((297mm * 0.72 - 297mm) / 2);
  position: relative;
  background: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.15),
    0 24px 80px rgba(0,0,0,0.5),
    0 4px 20px rgba(0,0,0,0.3);
}

/* ── Top gold band ── */
.cert-top-band {
  height: 10px;
  background: linear-gradient(90deg, #8b6914 0%, ${accent} 20%, #e8c97a 50%, ${accent} 80%, #8b6914 100%);
  flex-shrink: 0;
}

/* ── Body split: left content + right panel ── */
.cert-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── Left content area ── */
.cert-left {
  flex: 1;
  padding: 38px 44px 32px 52px;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* subtle guilloché-like bg */
.cert-left::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(201,168,76,0.05) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(201,168,76,0.04) 40px);
  pointer-events: none;
}

/* ── Org header ── */
.org-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  position: relative;
  z-index: 1;
}
.org-emblem {
  width: 42px; height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, ${accent}, #c9a84c);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 900; color: #1a1612;
  letter-spacing: -0.5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  flex-shrink: 0;
}
.org-text { line-height: 1.3; }
.org-name {
  font-size: 11px; font-weight: 800;
  letter-spacing: 0.22em;
  color: #1a1612;
  text-transform: uppercase;
}
.org-sub {
  font-size: 9px; color: #999;
  letter-spacing: 0.06em;
}

/* ── Certificate type ── */
.cert-type {
  position: relative;
  z-index: 1;
  margin-bottom: 6px;
}
.cert-type-eyebrow {
  font-size: 8px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #bbb;
  font-weight: 600;
  margin-bottom: 4px;
}
.cert-type-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 38px;
  font-weight: 600;
  color: #1a1612;
  line-height: 1.1;
  letter-spacing: -0.5px;
}
.cert-type-title span { color: ${accent}; }

/* ── Decorative rule ── */
.rule {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 20px;
  position: relative;
  z-index: 1;
}
.rule-line { flex: 1; height: 1px; background: linear-gradient(90deg, ${accent}80, transparent); }
.rule-diamond {
  width: 6px; height: 6px;
  background: ${accent};
  transform: rotate(45deg);
  flex-shrink: 0;
}

/* ── Recipient block ── */
.recipient-block { position: relative; z-index: 1; margin-bottom: 14px; }
.given-to {
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #aaa;
  font-weight: 500;
  margin-bottom: 6px;
}
.recipient-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 40px;
  font-weight: 700;
  color: #111;
  line-height: 1.05;
  letter-spacing: -0.5px;
}
.name-rule {
  width: 80px; height: 2px;
  margin-top: 8px;
  background: linear-gradient(90deg, ${accent}, #c9a84c, transparent);
}

/* ── Completion statement ── */
.completion {
  font-size: 10.5px;
  color: #555;
  line-height: 1.75;
  max-width: 320px;
  position: relative;
  z-index: 1;
  margin-bottom: auto;
}
.completion strong { color: #222; font-weight: 700; }

/* ── Signatures row ── */
.sigs {
  display: flex;
  gap: 32px;
  margin-top: 24px;
  position: relative;
  z-index: 1;
}
.sig { text-align: left; }
.sig-name-script {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px;
  font-style: italic;
  font-weight: 600;
  color: #333;
  line-height: 1;
  margin-bottom: 6px;
}
.sig-line {
  width: 90px; height: 1px;
  background: #ccc;
  margin-bottom: 5px;
}
.sig-label { font-size: 8.5px; font-weight: 700; color: #444; letter-spacing: 0.04em; }
.sig-role { font-size: 8px; color: #999; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 1px; }

/* ── Right panel ── */
.cert-right {
  width: 260px;
  flex-shrink: 0;
  background: #f7f4ee;
  border-left: 1px solid #e8e0d0;
  display: flex;
  flex-direction: column;
  padding: 38px 26px 28px;
  gap: 16px;
  position: relative;
}
/* vertical accent stripe */
.cert-right::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, ${accent}, #c9a84c 50%, transparent);
}

/* ── Module panel ── */
.module-panel {
  background: #fff;
  border: 1px solid #e0d8c8;
  border-radius: 8px;
  padding: 14px 16px;
}
.module-label {
  font-size: 7.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${accent};
  font-weight: 800;
  margin-bottom: 6px;
}
.module-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 17px;
  font-weight: 700;
  color: #1a1612;
  line-height: 1.3;
  margin-bottom: 4px;
}
.module-sub { font-size: 9px; color: #aaa; }

/* ── Stats ── */
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.stat-box {
  background: #fff;
  border: 1px solid #e0d8c8;
  border-radius: 6px;
  padding: 10px 10px 8px;
  text-align: center;
}
.stat-val { font-size: 11px; font-weight: 800; color: #1a1612; margin-bottom: 2px; }
.stat-lbl { font-size: 7px; letter-spacing: 0.15em; text-transform: uppercase; color: #aaa; font-weight: 600; }

/* ── Cert ID ── */
.certid-box {
  background: #fff;
  border: 1px solid #e0d8c8;
  border-radius: 6px;
  padding: 10px 14px;
}
.certid-label { font-size: 7px; letter-spacing: 0.2em; text-transform: uppercase; color: #bbb; font-weight: 700; margin-bottom: 4px; }
.certid-val { font-family: 'Courier New', monospace; font-size: 11px; color: #333; font-weight: 600; letter-spacing: 0.04em; }

/* ── Seal ── */
.seal-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.seal {
  width: 72px; height: 72px;
  border-radius: 50%;
  border: 2px solid ${accent};
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 1px;
  position: relative;
  background: radial-gradient(circle, rgba(201,168,76,0.08), transparent);
}
.seal::before {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  border: 1px dashed rgba(201,168,76,0.4);
}
.seal-icon { font-size: 20px; line-height: 1; }
.seal-text { font-size: 6px; letter-spacing: 0.15em; text-transform: uppercase; color: ${accent}; font-weight: 800; text-align: center; }

/* ── Bottom gold band ── */
.cert-bottom-band {
  height: 6px;
  background: linear-gradient(90deg, #8b6914 0%, ${accent} 20%, #e8c97a 50%, ${accent} 80%, #8b6914 100%);
  flex-shrink: 0;
}

/* ═══ PRINT ═══ */
@page { size: A4 landscape; margin: 0; }
@media print {
  html, body {
    width: 297mm; height: 210mm;
    margin: 0 !important; padding: 0 !important;
    background: white !important; overflow: hidden !important;
  }
  .toolbar { display: none !important; }
  .canvas {
    width: 297mm !important; height: 210mm !important;
    padding: 0 !important; margin: 0 !important;
    background: white !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
  }
  .cert {
    width: 297mm !important; height: 210mm !important;
    transform: none !important; margin: 0 !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>

</head><body>

<!-- Toolbar -->
<div class="toolbar">
  <div class="toolbar-left">
    <div class="tb-dot red"></div>
    <div class="tb-dot yellow"></div>
    <div class="tb-dot green"></div>
    <span class="toolbar-title">Sertifikat — <strong>${userName}</strong> &middot; ${modul.title}</span>
  </div>
  <div class="toolbar-right">
    <span class="hint">Simpan sebagai PDF: Print → Save as PDF</span>
    <button class="btn btn-ghost" onclick="window.close()">Tutup</button>
    <button class="btn btn-primary" onclick="window.print()">🖨 Print / PDF</button>
  </div>
</div>

<!-- Canvas -->
<div class="canvas">
<div class="cert-scaler">
<div class="cert">

  <!-- Top band -->
  <div class="cert-top-band"></div>

  <!-- Body -->
  <div class="cert-body">

    <!-- LEFT -->
    <div class="cert-left">

      <!-- Org header -->
      <div class="org-header">
        <div class="org-emblem">LH</div>
        <div class="org-text">
          <div class="org-name">LearnHub</div>
          <div class="org-sub">Bitcoin &amp; Blockchain Education Platform</div>
        </div>
      </div>

      <!-- Cert type -->
      <div class="cert-type">
        <div class="cert-type-eyebrow">Dokumen Resmi · Official Document</div>
        <div class="cert-type-title">Sertifikat<br/><span>Penyelesaian</span></div>
      </div>

      <!-- Rule -->
      <div class="rule">
        <div class="rule-diamond"></div>
        <div class="rule-line"></div>
      </div>

      <!-- Recipient -->
      <div class="recipient-block">
        <div class="given-to">Dengan bangga diberikan kepada</div>
        <div class="recipient-name">${userName}</div>
        <div class="name-rule"></div>
      </div>

      <!-- Completion text -->
      <div class="completion">
        Telah berhasil menyelesaikan seluruh materi pembelajaran dalam kurikulum
        <strong>${modul.title}</strong> — Modul ${modul.num} dari program
        <strong>Kurikulum Bitcoin &amp; Blockchain</strong> yang diselenggarakan oleh LearnHub.
      </div>

      <!-- Signatures -->
      <div class="sigs">
        <div class="sig">
          <div class="sig-name-script">LearnHub</div>
          <div class="sig-line"></div>
          <div class="sig-label">Platform LearnHub</div>
          <div class="sig-role">Penyelenggara</div>
        </div>
        <div class="sig">
          <div class="sig-name-script">Instruktur</div>
          <div class="sig-line"></div>
          <div class="sig-label">Tim Instruktur</div>
          <div class="sig-role">Pengajar</div>
        </div>
      </div>

    </div><!-- /cert-left -->

    <!-- RIGHT PANEL -->
    <div class="cert-right">

      <div class="module-panel">
        <div class="module-label">Modul ${modul.num} · Kurikulum</div>
        <div class="module-title">${modul.title}</div>
        <div class="module-sub">Level ${modul.level} &nbsp;·&nbsp; ${modul.lessons.length} Sesi</div>
      </div>

      <div class="stats">
        <div class="stat-box" style="grid-column:1/-1">
          <div class="stat-val">${dateStr}</div>
          <div class="stat-lbl">Tanggal Kelulusan</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">${modul.level}</div>
          <div class="stat-lbl">Level</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">${modul.lessons.length} Sesi</div>
          <div class="stat-lbl">Pelajaran</div>
        </div>
      </div>

      <div class="certid-box">
        <div class="certid-label">Nomor Sertifikat</div>
        <div class="certid-val">${certId}</div>
      </div>

      <div class="seal-area">
        <div class="seal">
          <div class="seal-icon">🎓</div>
          <div class="seal-text">Verified<br/>LearnHub</div>
        </div>
      </div>

    </div><!-- /cert-right -->

  </div><!-- /cert-body -->

  <!-- Bottom band -->
  <div class="cert-bottom-band"></div>

</div><!-- /cert -->
</div><!-- /cert-scaler -->
</div><!-- /canvas -->

</body></html>`);
  tab.document.close();
}

export default function EdukasiDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;

  const [modul, setModul] = useState<Module | null>(null);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [progressLoading, setProgressLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [coverLoaded, setCoverLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setPageLoading(true);
      const [mod, all] = await Promise.all([fetchModuleById(Number(id)), fetchModules()]);
      setModul(mod); setAllModules(all); setPageLoading(false);
    };
    load();
  }, [id]);

  // Auto-show certificate if ?completed=true
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("completed=true") && user && modul) {
      openCertificateTab(modul, (user as any)?.user_metadata?.full_name || (user as any)?.email?.split("@")[0] || "Pengguna");
    }
  }, [user, modul]);

  const modulIdx = allModules.findIndex(m => m.id === Number(id));
  const isFree = modulIdx === -1 ? true : modulIdx < 2;
  const isLocked = !isFree && !user && !authLoading;

  useEffect(() => { if (!authLoading && isLocked) router.replace(`/register?from=edukasi/${id}`); }, [authLoading, isLocked, id, router]);

  useEffect(() => {
    if (!user || !modul) { setProgressLoading(false); return; }
    setProgressLoading(true);
    const supabase = createClient();
    supabase.from("module_progress").select("lesson_idx, completed").eq("user_id", user.id).eq("module_id", modul.id)
      .then(({ data }) => {
        if (data) { const done = new Set(data.filter(r => r.completed).map(r => r.lesson_idx as number)); setCompletedLessons(done); }
        setProgressLoading(false);
      });
  }, [user, modul]);

  const toggleLesson = async (lessonIdx: number) => {
    if (!user || !modul) return;
    setSaving(true);
    const supabase = createClient();
    const isNowComplete = !completedLessons.has(lessonIdx);
    await supabase.from("module_progress").upsert({ user_id: user.id, module_id: modul.id, lesson_idx: lessonIdx, completed: isNowComplete, updated_at: new Date().toISOString() }, { onConflict: "user_id,module_id,lesson_idx" });
    if (!saving) {
      setCompletedLessons(prev => { const next = new Set(prev); if (isNowComplete) next.add(lessonIdx); else next.delete(lessonIdx); return next; });
    }
    setSaving(false);
  };

  if (pageLoading || authLoading) return (<><Navbar /><main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style><div style={{ textAlign: "center" }}><div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(167,139,250,0.2)", borderTop: "3px solid #a78bfa", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} /><p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, fontSize: 14 }}>Memuat modul...</p></div></main></>);
  if (!modul) return (<><Navbar /><main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 64, marginBottom: 16 }}>📚</div><h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>Modul Tidak Ditemukan</h1><Link href="/edukasi" style={{ padding: "10px 24px", borderRadius: 10, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "#a78bfa", textDecoration: "none", fontWeight: 700, fontSize: 14 }}>← Kembali ke Edukasi</Link></div></main><Footer /></>);
  if (isLocked) return (<><Navbar /><main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}><div style={{ textAlign: "center", maxWidth: 380 }}><div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div><h2 style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 10 }}>Modul ini Perlu Akun</h2><p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.7, marginBottom: 24 }}>Daftar gratis untuk mengakses <strong style={{ color: "#a78bfa" }}>{modul.title}</strong></p><div style={{ display: "flex", gap: 10, justifyContent: "center" }}><Link href="/register" style={{ padding: "12px 24px", borderRadius: 11, fontSize: 14, fontWeight: 800, background: "linear-gradient(135deg, #a78bfa, #8b5cf6)", color: "#fff", textDecoration: "none" }}>Daftar Gratis</Link><Link href="/login" style={{ padding: "12px 24px", borderRadius: 11, fontSize: 14, fontWeight: 700, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main,#e8eaf0)", textDecoration: "none" }}>Masuk</Link></div></div></main></>);

  const totalDone = completedLessons.size;
  const totalLessons = modul.lessons.length;
  const pct = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0;
  const moduleDone = totalDone === totalLessons && totalLessons > 0;
  const currentIdx = allModules.findIndex(m => m.id === modul.id);
  const prev = currentIdx > 0 ? allModules[currentIdx - 1] : null;
  const next = currentIdx < allModules.length - 1 ? allModules[currentIdx + 1] : null;
  const userName = (user as any)?.user_metadata?.full_name || (user as any)?.email?.split("@")[0] || "Pengguna";

  return (
    <>
      <Navbar />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
      

      <main style={{ minHeight: "100vh", paddingTop: 56 }}>

        {/* ── Hero with cover image ── */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Cover image */}
          {modul.coverImage && (
            <div style={{ position: "absolute", inset: 0 }}>
              <img
                src={modul.coverImage}
                alt={modul.title}
                onLoad={() => setCoverLoaded(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: coverLoaded ? 0.18 : 0, transition: "opacity .6s ease", filter: "saturate(0.7)" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(8,8,18,0.55) 0%, rgba(8,8,18,0.85) 60%, rgba(8,8,18,1) 100%)" }} />
            </div>
          )}
          {/* Fallback gradient if no image */}
          {!modul.coverImage && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% -10%, ${modul.accent}10, transparent 65%)` }} />}

          <div style={{ position: "relative", padding: "48px 20px 40px" }}>
            <div style={{ maxWidth: 820, margin: "0 auto" }}>
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontSize: 12, flexWrap: "wrap" }}>
                <Link href="/" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, textDecoration: "none" }}>Beranda</Link>
                <span style={{ opacity: 0.2, color: "var(--text-main,#e8eaf0)" }}>›</span>
                <Link href="/edukasi" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4, textDecoration: "none" }}>Edukasi</Link>
                <span style={{ opacity: 0.2, color: "var(--text-main,#e8eaf0)" }}>›</span>
                <span style={{ color: modul.accent, fontWeight: 600 }}>{modul.title}</span>
              </div>

              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ width: 68, height: 68, borderRadius: 18, fontSize: 32, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: moduleDone ? "rgba(34,197,94,0.12)" : `color-mix(in srgb, ${modul.accent} 12%, transparent)`, border: `1px solid ${moduleDone ? "rgba(34,197,94,0.3)" : modul.accent + "40"}`, boxShadow: `0 8px 24px ${modul.accent}20` }}>
                  {moduleDone ? "✅" : modul.icon}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: `color-mix(in srgb, ${modul.levelColor} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${modul.levelColor} 30%, transparent)`, color: modul.levelColor }}>{modul.level}</span>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, opacity: 0.4, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-main,#e8eaf0)", fontFamily: "monospace" }}>Modul {modul.num}</span>
                    {!user && isFree && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>🆓 Gratis</span>}
                    {moduleDone && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>🏆 Selesai</span>}
                  </div>
                  <h1 style={{ fontSize: "clamp(1.5rem,3vw,2.2rem)", color: "var(--text-main,#e8eaf0)", lineHeight: 1.2, marginBottom: 10, fontWeight: 900, letterSpacing: "-0.03em", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>{modul.title}</h1>
                  <p style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.55, lineHeight: 1.7 }}>{modul.longDesc || modul.desc}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 28, marginTop: 28, flexWrap: "wrap", alignItems: "center" }}>
                {[{ icon: "⏱", v: modul.dur, l: "Durasi" }, { icon: "📚", v: `${totalLessons}`, l: "Pelajaran" }, { icon: "✅", v: `${totalDone}/${totalLessons}`, l: "Selesai" }].map(s => (
                  <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: modul.accent, fontFamily: "monospace" }}>{s.v}</div>
                      <div style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)" }}>{s.l}</div>
                    </div>
                  </div>
                ))}
                {/* Sertifikat button */}
                {moduleDone && user && (
                  <button onClick={() => openCertificateTab(modul, (user as any)?.user_metadata?.full_name || (user as any)?.email?.split("@")[0] || "Pengguna")} style={{ marginLeft: "auto", padding: "9px 20px", borderRadius: 11, fontSize: 13, fontWeight: 800, cursor: "pointer", border: `1px solid ${modul.accent}40`, background: `${modul.accent}12`, color: modul.accent }}>
                    🎓 Lihat Sertifikat
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 20px 80px" }}>

          {/* Progress bar */}
          <div style={{ padding: "18px 22px", marginBottom: 28, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
              <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.6, fontWeight: 600 }}>
                Progress Modul {saving && <span style={{ fontSize: 11, opacity: 0.5 }}>· menyimpan...</span>}
              </span>
              <span style={{ color: modul.accent, fontWeight: 700, fontFamily: "monospace" }}>{totalDone}/{totalLessons} ({pct}%)</span>
            </div>
            <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: `linear-gradient(to right, ${modul.accent}, #06b6d4)`, transition: "width 0.5s ease" }} />
            </div>
            {!user && <p style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.4, margin: "10px 0 0" }}>💡 <Link href="/login" style={{ color: modul.accent, textDecoration: "none" }}>Login</Link> untuk menyimpan progress kamu</p>}
          </div>

          {/* Completion CTA */}
          {moduleDone && user && (
            <div style={{ marginBottom: 28, padding: "20px 24px", borderRadius: 16, background: `linear-gradient(135deg, ${modul.accent}10, color-mix(in srgb, ${modul.accent} 5%, transparent))`, border: `1px solid ${modul.accent}30`, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ fontSize: 32 }}>🏆</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 900, color: "var(--text-main,#e8eaf0)", fontSize: 15, marginBottom: 4 }}>Selamat! Kamu telah menyelesaikan modul ini.</div>
                <div style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.5 }}>Download sertifikat sebagai bukti pencapaianmu.</div>
              </div>
              <button onClick={() => openCertificateTab(modul, (user as any)?.user_metadata?.full_name || (user as any)?.email?.split("@")[0] || "Pengguna")} style={{ padding: "10px 22px", borderRadius: 11, fontSize: 13, fontWeight: 800, cursor: "pointer", border: "none", background: `linear-gradient(135deg, ${modul.accent}, color-mix(in srgb, ${modul.accent} 70%, #06b6d4))`, color: "#000" }}>
                🎓 Ambil Sertifikat
              </button>
            </div>
          )}

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
                const isFreeLesson = lesson.isFree || i < 2;
                const canAccess = isFreeLesson || !!user;
                const hasContent = !!(lesson.videoUrl || lesson.content);
                // Sequential lock
                const seqLocked = user && i > 0 && !completedLessons.has(i - 1) && !isFreeLesson;

                const cardInner = (
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: canAccess && !seqLocked ? "pointer" : "default", transition: "all .15s", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.07)`, opacity: seqLocked ? 0.5 : 1 }}
                    onClick={!hasContent && canAccess && !seqLocked ? () => toggleLesson(i) : undefined}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: done ? "rgba(34,197,94,0.15)" : `color-mix(in srgb, ${modul.accent} 15%, transparent)`, border: done ? "1px solid rgba(34,197,94,0.3)" : `1px solid ${modul.accent}40`, color: done ? "#22c55e" : modul.accent, transition: "all .2s" }}>
                      {!canAccess ? "🔒" : seqLocked ? "🔒" : done ? "✓" : i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-main,#e8eaf0)" }}>{lesson.title}</span>
                        {lesson.videoUrl && <span style={{ fontSize: 10, background: `${modul.accent}20`, color: modul.accent, padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>▶ Video</span>}
                        {isFreeLesson && !user && <span style={{ fontSize: 10, background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "1px 7px", borderRadius: 20, fontWeight: 700 }}>Gratis</span>}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)", marginTop: 2, fontFamily: "monospace" }}>⏱ {lesson.dur}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, flexShrink: 0, background: done ? "rgba(34,197,94,0.1)" : `color-mix(in srgb, ${modul.accent} 10%, transparent)`, color: done ? "#22c55e" : modul.accent, transition: "all .2s" }}>
                      {done ? "✅ Selesai" : seqLocked ? "🔒" : hasContent && canAccess ? "Mulai →" : user && !hasContent ? "Tandai ✓" : "—"}
                    </span>
                  </div>
                );

                return (hasContent && canAccess && !seqLocked && lesson.id) ? (
                  <Link key={i} href={`/edukasi/${modul.id}/lesson/${lesson.id}`} style={{ textDecoration: "none" }}>
                    {cardInner}
                  </Link>
                ) : (<div key={i}>{cardInner}</div>);
              })}
            </div>
          )}

          {/* Complete all / reset */}
          {user && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 48, flexWrap: "wrap" }}>
              {!moduleDone ? (
                <button onClick={async () => {
                  setSaving(true);
                  const supabase = createClient();
                  const rows = modul.lessons.map((_, i) => ({ user_id: user.id, module_id: modul.id, lesson_idx: i, completed: true, updated_at: new Date().toISOString() }));
                  await supabase.from("module_progress").upsert(rows, { onConflict: "user_id,module_id,lesson_idx" });
                  setCompletedLessons(new Set(modul.lessons.map((_, i) => i))); setSaving(false);
                }} style={{ padding: "13px 36px", borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: "pointer", background: `linear-gradient(135deg, ${modul.accent}, color-mix(in srgb, ${modul.accent} 70%, #f97316))`, border: "none", color: "#000", boxShadow: `0 8px 28px color-mix(in srgb, ${modul.accent} 35%, transparent)` }}>
                  🚀 Tandai Semua Selesai
                </button>
              ) : (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                  <button onClick={() => openCertificateTab(modul, (user as any)?.user_metadata?.full_name || (user as any)?.email?.split("@")[0] || "Pengguna")} style={{ padding: "13px 28px", borderRadius: 13, fontSize: 14, fontWeight: 800, cursor: "pointer", background: `linear-gradient(135deg, ${modul.accent}, color-mix(in srgb, ${modul.accent} 70%, #06b6d4))`, border: "none", color: "#000" }}>🎓 Ambil Sertifikat</button>
                  <button onClick={async () => {
                    setSaving(true);
                    const supabase = createClient();
                    await supabase.from("module_progress").delete().eq("user_id", user.id).eq("module_id", modul.id);
                    setCompletedLessons(new Set()); setSaving(false);
                  }} style={{ padding: "13px 28px", borderRadius: 13, fontSize: 14, fontWeight: 800, cursor: "pointer", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e" }}>
                    ↺ Ulangi Modul
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Prev / Next */}
          <div style={{ display: "grid", gridTemplateColumns: prev && next ? "1fr 1fr" : "1fr", gap: 12 }}>
            {prev && (<Link href={`/edukasi/${prev.id}`} style={{ textDecoration: "none" }}><div style={{ padding: "14px 18px", cursor: "pointer", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}><div style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)", marginBottom: 5 }}>← Sebelumnya</div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>{prev.title}</div></div></Link>)}
            {next && (<Link href={`/edukasi/${next.id}`} style={{ textDecoration: "none" }}><div style={{ padding: "14px 18px", cursor: "pointer", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", textAlign: prev ? "right" : "left" }}><div style={{ fontSize: 11, opacity: 0.4, color: "var(--text-main,#e8eaf0)", marginBottom: 5 }}>Berikutnya →</div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>{next.title}</div></div></Link>)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
