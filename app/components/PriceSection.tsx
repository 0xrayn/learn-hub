"use client";
import { useEffect, useState } from "react";

const IDR = 16450;

export default function PriceSection() {
  const [price, setPrice] = useState(103450.23);
  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: 60 }, (_, i) =>
      98000 + Math.sin(i * 0.4) * 4000 + Math.cos(i * 0.15) * 2000 + Math.random() * 1500
    )
  );
  const [period, setPeriod] = useState("1D");

  useEffect(() => {
    const id = setInterval(() => {
      setPrice(p => {
        const n = p * (1 + (Math.random() - 0.49) * 0.002);
        setHistory(h => [...h.slice(1), n]);
        return n;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const change24h = ((price - 98200) / 98200) * 100;
  const isUp = change24h >= 0;

  const stats = [
    { label: "Harga USD",     val: `$${price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`, color: "text-amber-400",   icon: "₿" },
    { label: "Harga IDR",     val: `Rp ${(price*IDR).toLocaleString("id-ID",{maximumFractionDigits:0})}`,                color: "text-cyan-400",    icon: "🇮🇩" },
    { label: "24h High",      val: `$${(price*1.025).toLocaleString("en-US",{maximumFractionDigits:0})}`,                color: "text-emerald-400", icon: "⬆" },
    { label: "24h Low",       val: `$${(price*0.975).toLocaleString("en-US",{maximumFractionDigits:0})}`,                color: "text-red-400",     icon: "⬇" },
    { label: "Volume 24h",    val: "$38.7B",                                                                             color: "text-violet-400",  icon: "📊" },
    { label: "Market Cap",    val: "$2.04T",                                                                             color: "text-orange-400",  icon: "🌐" },
  ];

  return (
    <section id="harga" className="py-24 px-4 reveal">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 glass px-3 py-1 rounded-full border border-amber-400/20 mb-3">
              📊 Harga Realtime
            </div>
            <h2 className="font-black text-3xl sm:text-4xl text-white">
              Pantau Harga <span className="text-amber-400">Bitcoin</span>
            </h2>
          </div>
          <div className={`glass px-4 py-2 rounded-xl border font-mono-styled text-sm font-bold ${
            isUp ? "border-emerald-400/30 text-emerald-400" : "border-red-400/30 text-red-400"
          }`}>
            {isUp ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}% hari ini
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {stats.map(s => (
            <div key={s.label} className="grad-border p-5 hover:scale-[1.02] transition-transform cursor-default group">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{s.icon}</span>
                <span className="text-xs text-white/40 uppercase tracking-wider">{s.label}</span>
              </div>
              <div className={`font-black font-mono-styled text-lg sm:text-xl ${s.color} group-hover:brightness-110 transition-all`}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="grad-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-bold text-white text-lg">BTC / USDT</div>
              <div className="font-mono-styled text-2xl font-black text-amber-400">
                ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="flex gap-1">
              {["1H","1D","1W","1M","1Y"].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all font-mono-styled ${
                    period === p
                      ? "bg-amber-400/20 text-amber-400 border border-amber-400/40"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <LiveChart history={history} isUp={isUp} />

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-white/20 font-mono-styled">
            {["24h ago","18h","12h","6h","Now"].map(l => <span key={l}>{l}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveChart({ history, isUp }: { history: number[]; isUp: boolean }) {
  const W = 900, H = 180;
  const min = Math.min(...history);
  const max = Math.max(...history);
  const range = max - min || 1;

  const pts = history.map((v, i) => ({
    x: (i / (history.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 20) - 10,
  }));

  const smooth = pts.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `C ${cpx} ${prev.y} ${cpx} ${p.y} ${p.x} ${p.y}`;
  }).join(" ");

  const fill = smooth + ` L ${W} ${H} L 0 ${H} Z`;
  const color = isUp ? "#22c55e" : "#ef4444";

  // Y-axis labels
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => ({
    y: H - (i / ySteps) * (H - 20) - 10,
    val: (min + (i / ySteps) * range).toLocaleString("en-US", { maximumFractionDigits: 0 }),
  }));

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height: H, background: 'rgba(255,255,255,0.02)' }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
          {/* Grid lines */}
          {yLabels.map((l, i) => (
            <line key={i} x1="0" y1={l.y} x2={W} y2={l.y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" vectorEffect="non-scaling-stroke"/>
          ))}
        </defs>
        {/* Grid lines (rendered as paths for non-scaling-stroke) */}
        {yLabels.map((l, i) => (
          <line key={i} x1="0" y1={l.y} x2={W} y2={l.y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
        ))}
        <path d={fill} fill="url(#cg)"/>
        <path d={smooth} fill="none" stroke={color} strokeWidth="2"/>
        {/* Last point dot */}
        <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="4" fill={color}/>
        <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="8" fill={color} opacity="0.2">
          <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
      {/* Y labels overlay */}
      <div className="absolute top-0 right-2 h-full flex flex-col justify-between py-1 pointer-events-none">
        {[...yLabels].reverse().map((l, i) => (
          <span key={i} className="text-[10px] text-white/20 font-mono-styled">${l.val}</span>
        ))}
      </div>
    </div>
  );
}
