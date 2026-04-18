"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BitcoinCanvas = dynamic(() => import("./BitcoinCanvas"), { ssr: false });

export default function HeroSection() {
  const [btc, setBtc] = useState(103450.23);
  const [prev, setPrev] = useState(103450.23);
  const [flash, setFlash] = useState("");
  const IDR = 16450;

  useEffect(() => {
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
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ paddingTop: '96px' }}>
      {/* Full-bleed 3D canvas */}
      <div className="absolute inset-0 z-0">
        <BitcoinCanvas />
      </div>

      {/* Deep gradient overlay for readability */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 70% at 70% 50%, transparent 40%, rgba(5,8,16,0.85) 80%),
            linear-gradient(to bottom, transparent 40%, rgba(5,8,16,1) 100%)
          `
        }}
      />

      <div className="relative z-[2] flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-xl">

            {/* Badge */}
            <div className="anim-slide-right delay-100 inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full mb-6 text-xs font-semibold text-amber-400 border border-amber-400/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"/>
              </span>
              Platform Edukasi Bitcoin #1 Indonesia
            </div>

            {/* Headline */}
            <h1 className="anim-slide-up delay-200 font-black leading-[0.95] mb-6" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
              <span className="text-white">Kuasai</span><br/>
              <span style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 40%, #f97316 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 24px rgba(245,158,11,0.4))',
              }}>Bitcoin</span><br/>
              <span className="text-white/80">dari Nol</span>
            </h1>

            <p className="anim-slide-up delay-300 text-white/50 text-lg leading-relaxed mb-8 max-w-md">
              Harga realtime, artikel mendalam, modul belajar terstruktur & tools konversi BTC↔IDR. Gratis untuk semua.
            </p>

            {/* Live price card */}
            <div className="anim-slide-up delay-400 glass-bright rounded-2xl p-5 mb-8 max-w-sm glow-amber">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-white/40 font-mono-styled uppercase tracking-widest">Bitcoin (BTC) Live</div>
                  <div className={`font-black mt-1 font-mono-styled transition-all ${flash}`}
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                      color: '#f8fafc',
                      textShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
                    ${btc.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-white/40 mt-1 font-mono-styled">
                    ≈ Rp {(btc * IDR).toLocaleString("id-ID", { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono-styled ${
                  change >= 0
                    ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/20"
                    : "bg-red-400/15 text-red-400 border border-red-400/20"
                }`}>
                  {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%<br/>
                  <span className="text-[10px] opacity-60">24h</span>
                </div>
              </div>

              {/* Mini spark */}
              <MiniSpark current={btc} prev={prev} />
            </div>

            {/* CTA Buttons */}
            <div className="anim-slide-up delay-500 flex flex-wrap gap-3">
              <a href="#edukasi"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                  boxShadow: '0 8px 24px rgba(245,158,11,0.35)' }}>
                🎓 Mulai Belajar
              </a>
              <a href="#konverter"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-cyan-400 glass border border-cyan-400/30 hover:border-cyan-400/60 transition-all hover:scale-105">
                💱 Konversi BTC
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 w-full pb-10">
        <div className="grid grid-cols-3 gap-3 max-w-sm">
          {[
            { v: "50+", l: "Artikel" },
            { v: "12",  l: "Modul" },
            { v: "24/7",l: "Realtime" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="font-black text-2xl text-amber-400 font-mono-styled">{s.v}</div>
              <div className="text-xs text-white/30 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-2 anim-fade delay-700">
        <span className="text-xs text-white/20 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-amber-400/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function MiniSpark({ current, prev }: { current: number; prev: number }) {
  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: 40 }, (_, i) => 100000 + Math.sin(i * 0.5) * 5000 + Math.random() * 3000)
  );
  useEffect(() => {
    setHistory(h => [...h.slice(1), current]);
  }, [current]);

  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;
  const W = 280, H = 40;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  });
  const pathD = "M " + pts.join(" L ");
  const fillD = pathD + ` L ${W},${H} L 0,${H} Z`;
  const isUp = current >= prev;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 40 }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#sparkGrad)"/>
      <path d={pathD} fill="none" stroke={isUp ? "#22c55e" : "#ef4444"} strokeWidth="1.5"/>
    </svg>
  );
}
