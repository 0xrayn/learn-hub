"use client";
import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, RefreshCw, Activity } from "lucide-react";

const BASE_PRICE = 83420;
const IDR_RATE = 16250;

function genData(days: number) {
  const pts = 60;
  const data = [];
  let price = BASE_PRICE * (0.88 + Math.random() * 0.08);
  const now = Date.now();
  for (let i = pts; i >= 0; i--) {
    price += (Math.random() - 0.469) * price * 0.022;
    price = Math.max(price, BASE_PRICE * 0.55);
    const ts = now - i * (days * 86400000 / pts);
    const d = new Date(ts);
    const label = days <= 1
      ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      : days <= 7
        ? d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" })
        : d.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
    data.push({ label, price: Math.round(price) });
  }
  return data;
}

const fmt$ = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const fmtIDR = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const RANGES = [
  { label: "1J", days: 0.04 },
  { label: "24J", days: 1 },
  { label: "7H", days: 7 },
  { label: "30H", days: 30 },
];

const STATS = [
  { label: "Harga USD", value: fmt$(BASE_PRICE), accent: true },
  { label: "Harga IDR", value: fmtIDR(BASE_PRICE * IDR_RATE) },
  { label: "Market Cap", value: "$1.64T" },
  { label: "Volume 24J", value: "$28.4B" },
];

export default function LivePrice() {
  const [range, setRange] = useState(RANGES[1]);
  const [data, setData] = useState<{ label: string; price: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setData(genData(range.days));
      setTick(t => t + 1);
      setLoading(false);
    }, 500);
  }, [range]);

  useEffect(() => { setData(genData(range.days)); }, [range]);
  useEffect(() => {
    const id = setInterval(() => setData(genData(range.days)), 30000);
    return () => clearInterval(id);
  }, [range]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl p-3 text-sm shadow-2xl"
        style={{ background: "rgba(10,10,15,0.95)", border: "1px solid rgba(232,0,45,0.3)" }}>
        <div className="font-bold text-white">{fmt$(payload[0].value)}</div>
        <div className="text-white/50 text-xs">{fmtIDR(payload[0].value * IDR_RATE)}</div>
        <div className="text-white/30 text-[10px] mt-1 font-mono">{payload[0].payload.label}</div>
      </div>
    );
  };

  return (
    <section id="harga" className="relative py-28 px-5 sm:px-8"
      style={{ background: "rgba(232,0,45,0.02)" }}>
      {/* bg glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,0,45,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "rgba(232,0,45,0.1)", border: "1px solid rgba(232,0,45,0.25)", color: "#ff4d6d" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live Data
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Harga Bitcoin <span className="gradient-text">Real-Time</span>
          </h2>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {STATS.map((s) => (
            <div key={s.label} className={`rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.02] ${s.accent ? "red-glow-sm" : ""}`}
              style={s.accent
                ? { background: "rgba(232,0,45,0.12)", border: "1px solid rgba(232,0,45,0.35)" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }
              }>
              <div className="text-[10px] uppercase tracking-widest font-bold mb-2"
                style={{ color: s.accent ? "#ff4d6d" : "rgba(255,255,255,0.35)" }}>
                {s.label}
              </div>
              <div className={`font-black text-base sm:text-xl font-mono ${s.accent ? "text-white" : "text-white/85"}`}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart card */}
        <div className="rounded-3xl p-5 sm:p-7"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Chart controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Activity size={18} style={{ color: "#e8002d" }} />
              <div>
                <div className="text-xl font-black text-white font-mono">{fmt$(BASE_PRICE)}</div>
                <div className="flex items-center gap-1 text-xs font-semibold text-green-400">
                  <TrendingUp size={11} /> +2.34% (24J)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                {RANGES.map((r) => (
                  <button key={r.label} onClick={() => setRange(r)}
                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                      range.label === r.label
                        ? "text-white"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    }`}
                    style={range.label === r.label ? { background: "rgba(232,0,45,0.7)" } : {}}>
                    {r.label}
                  </button>
                ))}
              </div>
              <button onClick={refresh}
                className={`p-2 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 transition-all text-white/50 hover:text-white ${loading ? "animate-spin" : ""}`}>
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e8002d" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#e8002d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}
                  tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono" }}
                  tickLine={false} axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  domain={["auto", "auto"]} width={42} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="price" stroke="#e8002d" strokeWidth={2}
                  fill="url(#btcGrad)" dot={false}
                  activeDot={{ r: 5, fill: "#e8002d", stroke: "#ff4d6d", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-4 font-mono">
          // Data simulasi — integrasikan CoinGecko API untuk harga nyata
        </p>
      </div>
    </section>
  );
}
