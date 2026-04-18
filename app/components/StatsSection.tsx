"use client";
import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, dur = 1800, go = false) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!go) return;
    let cur = 0;
    const step = target / (dur / 16);
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setV(Math.round(cur));
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, dur, go]);
  return v;
}

const STATS = [
  { val: 50,    suf: "+",   label: "Artikel",        sub: "Konten berkualitas",   icon: "📝", color: "#f59e0b" },
  { val: 12,    suf: "",    label: "Modul Belajar",   sub: "Dari pemula ke ahli",  icon: "🎓", color: "#06b6d4" },
  { val: 10000, suf: "+",   label: "Pembaca Aktif",   sub: "Komunitas berkembang", icon: "👥", color: "#8b5cf6" },
  { val: 5,     suf: "+ Th",label: "Pengalaman",      sub: "Di industri kripto",   icon: "🏆", color: "#22c55e" },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="py-16 px-4 reveal">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(s => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const c = useCountUp(s.val, 1800, go);
          return (
            <div key={s.label} className="grad-border p-6 text-center group hover:scale-[1.03] transition-transform">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="font-black text-3xl font-mono-styled" style={{ color: s.color, textShadow: `0 0 20px ${s.color}50` }}>
                {c.toLocaleString("id-ID")}{s.suf}
              </div>
              <div className="font-semibold text-sm text-white/80 mt-1">{s.label}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
