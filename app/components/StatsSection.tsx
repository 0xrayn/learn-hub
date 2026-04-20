"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { val: 50,    suf: "+",    label: "Artikel",       sub: "Konten berkualitas",   icon: "📝" },
  { val: 12,    suf: "",     label: "Modul Belajar",  sub: "Dari pemula ke ahli",  icon: "🎓" },
  { val: 10000, suf: "+",    label: "Pembaca Aktif",  sub: "Komunitas berkembang", icon: "👥" },
  { val: 5,     suf: "+ Th", label: "Pengalaman",     sub: "Di industri kripto",   icon: "🏆" },
];

const T = {
  dark:   { bg:"rgba(12,17,32,0.93)",   border:"rgba(245,158,11,0.18)", accent:"#f59e0b", grad:"linear-gradient(135deg,rgba(245,158,11,0.15),rgba(6,182,212,0.06))", text:"#e8eaf0" },
  light:  { bg:"rgba(255,255,255,0.93)",border:"rgba(217,119,6,0.22)",  accent:"#d97706", grad:"linear-gradient(135deg,rgba(217,119,6,0.12),rgba(8,145,178,0.05))",  text:"#1e293b" },
  forest: { bg:"rgba(10,28,14,0.93)",   border:"rgba(34,197,94,0.22)",  accent:"#22c55e", grad:"linear-gradient(135deg,rgba(34,197,94,0.18),rgba(134,239,172,0.06))", text:"#dcfce7" },
  retro:  { bg:"rgba(28,18,0,0.93)",    border:"rgba(251,146,60,0.22)", accent:"#fb923c", grad:"linear-gradient(135deg,rgba(251,146,60,0.18),rgba(251,191,36,0.06))", text:"#fef3c7" },
} as const;
type ThemeKey = keyof typeof T;

function StatCard({ val, suf, label, sub, icon, go, theme }: typeof STATS[0] & { go: boolean; theme: ThemeKey }) {
  const [count, setCount] = useState(0);
  const [hov, setHov] = useState(false);
  const tk = T[theme] ?? T.dark;

  useEffect(() => {
    if (!go) return;
    let cur = 0;
    const step = val / (1800 / 16);
    const id = setInterval(() => {
      cur = Math.min(cur + step, val);
      setCount(Math.round(cur));
      if (cur >= val) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [go, val]);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "28px 16px 22px",
        borderRadius: 18,
        textAlign: "center",
        background: tk.bg,
        border: `1px solid ${hov ? tk.accent + "50" : tk.border}`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "relative",
        overflow: "hidden",
        transform: hov ? "translateY(-6px) scale(1.02)" : "none",
        boxShadow: hov ? `0 20px 48px rgba(0,0,0,0.25), 0 0 0 1px ${tk.accent}28` : "0 4px 16px rgba(0,0,0,0.12)",
        transition: "transform .32s cubic-bezier(.34,1.56,.64,1), box-shadow .3s, border-color .2s",
        cursor: "default",
      }}
    >
      {/* Gradient fill */}
      <div style={{ position:"absolute", inset:0, borderRadius:18, background:tk.grad, opacity: hov ? 1 : 0.6, transition:"opacity .3s", pointerEvents:"none" }} />

      <div style={{ fontSize:28, marginBottom:8, position:"relative", lineHeight:1 }}>{icon}</div>

      <div className="font-mono-styled" style={{
        fontWeight:900, fontSize:"clamp(1.5rem,3vw,2.1rem)",
        color:tk.accent, position:"relative",
        textShadow:`0 0 20px ${tk.accent}55`, lineHeight:1.1,
      }}>
        {count.toLocaleString("id-ID")}{suf}
      </div>

      <div style={{ fontWeight:700, fontSize:13, color:tk.text, marginTop:6, position:"relative" }}>{label}</div>
      <div style={{ fontSize:11, color:tk.text, opacity:0.45, marginTop:2, position:"relative" }}>{sub}</div>

      {/* Bottom glow line */}
      <div style={{
        position:"absolute", bottom:0, left:"20%", right:"20%", height:2,
        background:`linear-gradient(to right, transparent, ${tk.accent}, transparent)`,
        borderRadius:99, opacity: hov ? 0.75 : 0.25, transition:"opacity .3s",
      }} />
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo]     = useState(false);
  const [theme, setTheme] = useState<ThemeKey>("dark");
  const [cols, setCols]   = useState(2); // 2 on mobile, 4 on desktop

  useEffect(() => {
    const readTheme = () => {
      const t = (document.documentElement.getAttribute("data-theme") || "dark") as ThemeKey;
      setTheme(Object.keys(T).includes(t) ? t : "dark");
    };
    readTheme();
    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.15 });
    if (ref.current) io.observe(ref.current);

    const checkCols = () => setCols(window.innerWidth >= 768 ? 4 : 2);
    checkCols();
    window.addEventListener("resize", checkCols, { passive: true });

    return () => { mo.disconnect(); io.disconnect(); window.removeEventListener("resize", checkCols); };
  }, []);

  const tk = T[theme] ?? T.dark;

  return (
    <div ref={ref} className="reveal" style={{ padding:"56px 20px" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <span style={{
          fontSize:11, fontWeight:700, letterSpacing:"0.12em",
          textTransform:"uppercase", color:tk.accent, opacity:0.65,
        }}>Angka yang Bicara</span>
      </div>

      <div style={{
        maxWidth:1280, margin:"0 auto",
        display:"grid",
        gridTemplateColumns:`repeat(${cols}, 1fr)`,
        gap:14,
      }}>
        {STATS.map(s => <StatCard key={s.label} {...s} go={go} theme={theme} />)}
      </div>
    </div>
  );
}
