"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BitcoinCanvas = dynamic(() => import("./BitcoinCanvas"), { ssr: false });

// Stable seed chart — no Math.random() on server, generated client-side only
function generateHistory(): number[] {
  const arr: number[] = [];
  let v = 100000;
  for (let i = 0; i < 40; i++) {
    v += (Math.random() - 0.49) * 1200;
    arr.push(Math.max(94000, Math.min(110000, v)));
  }
  return arr;
}

export default function HeroSection() {
  const [btc, setBtc] = useState(103450.23);
  const [prev, setPrev] = useState(103450.23);
  const [flash, setFlash] = useState("");
  const [mounted, setMounted] = useState(false);
  const IDR = 16450;

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      setBtc(p => {
        const n = p * (1 + (Math.random() - 0.49) * 0.003);
        setPrev(p);
        setFlash(n > p ? "price-up" : "price-down");
        setTimeout(() => setFlash(""), 900);
        return n;
      });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const change = ((btc - 98200) / 98200 * 100);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ paddingTop: 56 }}>
      <div className="absolute inset-0 z-0">
        <BitcoinCanvas />
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none" style={{
        background: `radial-gradient(ellipse 50% 70% at 70% 50%, transparent 40%, var(--bg-page, #050810) 80%),
                     linear-gradient(to bottom, transparent 40%, var(--bg-page, #050810) 100%)`,
      }} />

      <div className="relative z-[2] flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-12">
          <div className="max-w-xl">

            {/* Badge */}
            <div className="anim-slide-right delay-100 inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full mb-6 text-xs font-semibold border"
              style={{ color: "var(--color-primary, #f59e0b)", borderColor: `${("var(--color-primary, #f59e0b)")}30` }}>
              <span className="relative flex h-2 w-2">
                <span style={{ position:"absolute", inset:0, borderRadius:"50%", background:"var(--color-primary,#f59e0b)", opacity:.75, animation:"ping 1.5s cubic-bezier(0,0,.2,1) infinite" }} />
                <span style={{ width:8, height:8, borderRadius:"50%", background:"var(--color-primary,#f59e0b)", display:"inline-block", position:"relative" }} />
              </span>
              Platform Edukasi Bitcoin #1 Indonesia
            </div>

            {/* Headline */}
            <h1 className="anim-slide-up delay-200 font-black leading-none mb-6"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)", color: "var(--text-main, #e8eaf0)" }}>
              <span>Kuasai</span><br />
              <span style={{
                background: "linear-gradient(135deg, var(--color-primary,#f59e0b) 0%, #fcd34d 40%, #f97316 80%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 24px color-mix(in srgb, var(--color-primary,#f59e0b) 40%, transparent))",
              }}>Bitcoin</span><br />
              <span style={{ opacity: 0.8 }}>dari Nol</span>
            </h1>

            <p className="anim-slide-up delay-300 text-lg leading-relaxed mb-8 max-w-md"
              style={{ color: "var(--text-main, #e8eaf0)", opacity: 0.55 }}>
              Harga realtime, artikel mendalam, modul belajar terstruktur &amp; tools konversi BTC↔IDR. Gratis untuk semua.
            </p>

            {/* Live price card */}
            <div className="anim-slide-up delay-400 glass-bright rounded-2xl p-5 mb-8 max-w-sm glow-amber">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs uppercase tracking-widest font-mono-styled"
                    style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4 }}>Bitcoin (BTC) Live</div>
                  <div className={`font-black mt-1 font-mono-styled ${flash}`}
                    style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--text-main,#f8fafc)" }}>
                    ${btc.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm font-mono-styled mt-1" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4 }}>
                    ≈ Rp {(btc * IDR).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-styled ${
                  change >= 0
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-red-400/10 text-red-400"
                }`} style={{ border: `1px solid ${change >= 0 ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}` }}>
                  {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                  <div className="text-[10px] opacity-50 text-center">24h</div>
                </div>
              </div>

              {/* Only render chart after mount to avoid hydration mismatch */}
              {mounted && <MiniSpark current={btc} prev={prev} />}
            </div>

            {/* CTA Buttons */}
            <div className="anim-slide-up delay-500 flex flex-wrap gap-3">
              <a href="#edukasi" className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)",
                  boxShadow: "0 8px 24px color-mix(in srgb, var(--color-primary,#f59e0b) 35%, transparent)",
                  transition: "transform .2s, box-shadow .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                🎓 Mulai Belajar
              </a>
              <a href="#konverter" className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm glass"
                style={{
                  color: "var(--color-secondary, #06b6d4)",
                  border: "1px solid color-mix(in srgb, var(--color-secondary,#06b6d4) 30%, transparent)",
                  transition: "transform .2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                💱 Konversi BTC
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 w-full pb-10">
        <div className="flex gap-8">
          {[{ v: "50+", l: "Artikel" }, { v: "12", l: "Modul" }, { v: "24/7", l: "Realtime" }].map(s => (
            <div key={s.l} className="text-center">
              <div className="font-black text-2xl font-mono-styled" style={{ color: "var(--color-primary,#f59e0b)" }}>{s.v}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 anim-fade delay-700">
        <span className="text-xs uppercase tracking-widest" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.2 }}>Scroll</span>
        <div className="w-px h-10 animate-pulse" style={{ background: "linear-gradient(to bottom, var(--color-primary,#f59e0b), transparent)" }} />
      </div>
    </section>
  );
}

function MiniSpark({ current, prev }: { current: number; prev: number }) {
  const [history, setHistory] = useState<number[]>(() => generateHistory());

  useEffect(() => {
    setHistory(h => [...h.slice(1), current]);
  }, [current]);

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const W = 280, H = 40;

  const pathD = history.map((v, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");
  const fillD = pathD + ` L ${W} ${H} L 0 ${H} Z`;
  const isUp = current >= prev;
  const color = isUp ? "#22c55e" : "#ef4444";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 40 }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#sg)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
