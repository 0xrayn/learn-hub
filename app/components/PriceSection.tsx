"use client";
import { useEffect, useState } from "react";

const IDR = 16450;

// Stable initial history - no Math.random() at module level
function makeHistory(): number[] {
  const arr: number[] = [];
  let v = 98000;
  for (let i = 0; i < 60; i++) {
    v += (Math.random() - 0.48) * 800;
    arr.push(Math.max(94000, Math.min(112000, v)));
  }
  return arr;
}

export default function PriceSection() {
  const [price, setPrice] = useState(103450.23);
  const [history, setHistory] = useState<number[]>([]);
  const [period, setPeriod] = useState("1D");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHistory(makeHistory());
    setMounted(true);
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
  const accentUp = "#22c55e";
  const accentDown = "#ef4444";

  const stats = [
    { label: "Harga USD",  val: `$${price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`, color:"var(--color-primary,#f59e0b)", icon:"₿" },
    { label: "Harga IDR",  val: `Rp ${(price*IDR).toLocaleString("id-ID",{maximumFractionDigits:0})}`,               color:"var(--color-secondary,#06b6d4)", icon:"🇮🇩" },
    { label: "24h High",   val: `$${(price*1.025).toLocaleString("en-US",{maximumFractionDigits:0})}`,               color:"#22c55e", icon:"⬆" },
    { label: "24h Low",    val: `$${(price*0.975).toLocaleString("en-US",{maximumFractionDigits:0})}`,               color:"#ef4444", icon:"⬇" },
    { label: "Volume 24h", val: "$38.7B",  color:"#a78bfa", icon:"📊" },
    { label: "Market Cap", val: "$2.04T",  color:"#fb923c", icon:"🌐" },
  ];

  return (
    <section id="harga" className="py-24 px-4 reveal">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold glass px-3 py-1 rounded-full border mb-3"
              style={{ color: "var(--color-primary,#f59e0b)", borderColor: "color-mix(in srgb, var(--color-primary,#f59e0b) 25%, transparent)" }}>
              📊 Harga Realtime
            </div>
            <h2 className="font-black text-3xl sm:text-4xl" style={{ color: "var(--text-main,#e8eaf0)" }}>
              Pantau Harga <span style={{ color: "var(--color-primary,#f59e0b)" }}>Bitcoin</span>
            </h2>
          </div>
          <div className="font-mono-styled text-sm font-bold px-4 py-2 rounded-xl glass"
            style={{
              color: isUp ? accentUp : accentDown,
              border: `1px solid ${isUp ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
            }}>
            {isUp ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}% hari ini
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {stats.map(s => (
            <div key={s.label} className="grad-border p-4 sm:p-5"
              style={{ transition: "transform .2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.01)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}>
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.4 }}>{s.label}</span>
              </div>
              <div className="font-black font-mono-styled text-base sm:text-xl" style={{ color: s.color }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="grad-border p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="font-bold" style={{ color: "var(--text-main,#e8eaf0)" }}>BTC / USDT</div>
              <div className="font-mono-styled text-xl sm:text-2xl font-black" style={{ color: "var(--color-primary,#f59e0b)" }}>
                ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {["1H","1D","1W","1M","1Y"].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                    fontFamily: "monospace", transition: "all .2s",
                    background: period === p ? "color-mix(in srgb, var(--color-primary,#f59e0b) 20%, transparent)" : "transparent",
                    color: period === p ? "var(--color-primary,#f59e0b)" : "var(--text-main,#e8eaf0)",
                    border: period === p ? "1px solid color-mix(in srgb, var(--color-primary,#f59e0b) 40%, transparent)" : "1px solid transparent",
                    opacity: period === p ? 1 : 0.4,
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {mounted && history.length > 0
            ? <LiveChart history={history} isUp={isUp} />
            : <div style={{ height: 180, background: "rgba(255,255,255,0.02)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.2, fontSize: 13 }}>Loading chart…</span>
              </div>
          }

          <div className="flex justify-between mt-2 font-mono-styled" style={{ fontSize: 10, color: "var(--text-main,#e8eaf0)", opacity: 0.25 }}>
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
  const color = isUp ? "#22c55e" : "#ef4444";

  const pts = history.map((v, i) => ({
    x: (i / (history.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 24) - 12,
  }));

  const smooth = pts.map((p, i) => {
    if (i === 0) return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    const prev = pts[i - 1];
    const cpx = ((prev.x + p.x) / 2).toFixed(2);
    return `C ${cpx} ${prev.y.toFixed(2)} ${cpx} ${p.y.toFixed(2)} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  }).join(" ");

  const fill = smooth + ` L ${W} ${H} L 0 ${H} Z`;
  const last = pts[pts.length - 1];

  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => ({
    y: H - (i / ySteps) * (H - 24) - 12,
    val: Math.round(min + (i / ySteps) * range).toLocaleString("en-US"),
  }));

  return (
    <div style={{ position: "relative", width: "100%", height: H, background: "rgba(255,255,255,0.02)", borderRadius: 12, overflow: "hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {yLabels.map((l, i) => (
          <line key={i} x1="0" y1={l.y.toFixed(2)} x2={W} y2={l.y.toFixed(2)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        <path d={fill} fill="url(#cg2)" />
        <path d={smooth} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Last price dot */}
        <circle cx={last.x.toFixed(2)} cy={last.y.toFixed(2)} r="4" fill={color} />
        <circle cx={last.x.toFixed(2)} cy={last.y.toFixed(2)} r="10" fill={color} opacity="0.15">
          <animate attributeName="r" values="4;14;4" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>
      {/* Y labels */}
      <div style={{ position: "absolute", top: 0, right: 8, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "8px 0", pointerEvents: "none" }}>
        {[...yLabels].reverse().map((l, i) => (
          <span key={i} style={{ fontSize: 10, fontFamily: "monospace", color: "var(--text-main,#e8eaf0)", opacity: 0.2 }}>
            ${l.val}
          </span>
        ))}
      </div>
    </div>
  );
}
