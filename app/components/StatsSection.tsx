"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { val: 50,    suf: "+",    label: "Artikel",       sub: "Konten berkualitas",   icon: "📝" },
  { val: 12,    suf: "",     label: "Modul Belajar",  sub: "Dari pemula ke ahli",  icon: "🎓" },
  { val: 10000, suf: "+",    label: "Pembaca Aktif",  sub: "Komunitas berkembang", icon: "👥" },
  { val: 5,     suf: "+ Th", label: "Pengalaman",     sub: "Di industri kripto",   icon: "🏆" },
];

function StatCard({ val, suf, label, sub, icon, go }: typeof STATS[0] & { go: boolean }) {
  const [count, setCount] = useState(0);
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
    <div className="grad-border p-5 sm:p-6 text-center"
      style={{ transition: "transform .25s ease" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
      <div className="font-black font-mono-styled" style={{
        fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
        color: "var(--color-primary,#f59e0b)",
        textShadow: "0 0 20px color-mix(in srgb, var(--color-primary,#f59e0b) 40%, transparent)",
      }}>
        {count.toLocaleString("id-ID")}{suf}
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-main,#e8eaf0)", marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.35, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="py-14 px-4 reveal">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => <StatCard key={s.label} {...s} go={go} />)}
      </div>
    </div>
  );
}
