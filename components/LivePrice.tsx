"use client";
import { useEffect, useState, useCallback } from "react";
import { TrendingUp, TrendingDown, RefreshCw, Activity } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const RANGES = ["1H", "24H", "7D", "30D", "1Y"];

type PriceData = {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
};

function generateChartData(range: string) {
  const points = range === "1H" ? 60 : range === "24H" ? 96 : range === "7D" ? 84 : range === "30D" ? 60 : 52;
  const base = 83000;
  const data = [];
  let val = base - Math.random() * 3000;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.475) * (range === "1H" ? 200 : range === "24H" ? 500 : 800);
    val = Math.max(val, 60000);
    data.push({ t: i, price: Math.round(val) });
  }
  return data;
}

const fmt = (n: number, dec = 2) =>
  n.toLocaleString("id-ID", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export default function LivePrice() {
  const [range, setRange] = useState("24H");
  const [chartData, setChartData] = useState(generateChartData("24H"));
  const [priceData] = useState<PriceData>({
    price: 83420,
    change24h: 2.34,
    high24h: 85240,
    low24h: 81100,
    volume24h: 38.2,
    marketCap: 1640,
  });
  const [live, setLive] = useState(83420);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLive((p) => {
        const change = (Math.random() - 0.5) * 200;
        return Math.round(p + change);
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const changeRange = useCallback((r: string) => {
    setLoading(true);
    setRange(r);
    setTimeout(() => {
      setChartData(generateChartData(r));
      setLoading(false);
    }, 400);
  }, []);

  const isPositive = priceData.change24h > 0;

  return (
    <section id="harga" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-base-content/8 to-transparent" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="pill mb-5 inline-flex">
            <Activity size={10} />
            Live Market Data
          </span>
          <h2 className="font-display font-black text-base-content mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}>
            Harga <span className="text-gradient">Real-time</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Chart panel */}
          <div className="lg:col-span-2 glass-static p-5 sm:p-7">
            {/* Price header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-[10px] font-mono-code uppercase tracking-[0.18em] text-base-content/35 mb-2">Bitcoin / USD</div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-display font-black text-base-content" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
                    ${fmt(live, 0)}
                  </span>
                  <span className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-lg ${isPositive ? "bg-success/12 text-success" : "bg-error/12 text-error"}`}>
                    {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    {isPositive ? "+" : ""}{priceData.change24h}%
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] font-mono-code text-base-content/35">Live · diperbarui setiap 3 detik</span>
                </div>
              </div>

              {/* Range buttons */}
              <div className="flex gap-1 bg-base-content/5 p-1 rounded-xl self-start sm:self-auto">
                {RANGES.map((r) => (
                  <button key={r} onClick={() => changeRange(r)} className={`range-btn ${range === r ? "active" : ""}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className={`h-52 sm:h-64 transition-opacity duration-300 ${loading ? "opacity-40" : "opacity-100"}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(var(--p))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="oklch(var(--p))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" hide />
                  <YAxis domain={["auto", "auto"]} hide />
                  <Tooltip
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <div className="glass-static px-3 py-2 text-xs">
                          <span className="font-mono-code font-bold text-base-content">${fmt(payload[0].value as number, 0)}</span>
                        </div>
                      ) : null
                    }
                  />
                  <Area type="monotone" dataKey="price" stroke="oklch(var(--p))" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats panel */}
          <div className="flex flex-col gap-4">
            {[
              { label: "24H High", value: `$${fmt(priceData.high24h, 0)}`, color: "text-success", icon: TrendingUp },
              { label: "24H Low", value: `$${fmt(priceData.low24h, 0)}`, color: "text-error", icon: TrendingDown },
              { label: "Volume 24H", value: `$${priceData.volume24h}B`, color: "text-primary", icon: Activity },
              { label: "Market Cap", value: `$${priceData.marketCap}B`, color: "text-secondary", icon: Activity },
            ].map((stat, i) => (
              <div key={i} className="glass-static p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-base-content/6 flex items-center justify-center flex-shrink-0">
                  <stat.icon size={16} className={stat.color} />
                </div>
                <div>
                  <div className="text-[10px] font-mono-code uppercase tracking-wider text-base-content/35 mb-0.5">{stat.label}</div>
                  <div className={`font-display font-bold text-lg ${stat.color}`}>{stat.value}</div>
                </div>
              </div>
            ))}

            <div className="glass-static p-4 text-center">
              <div className="text-[9px] font-mono-code uppercase tracking-[0.18em] text-base-content/30 mb-2">Data Source</div>
              <div className="text-xs font-semibold text-base-content/55">CoinGecko API</div>
              <div className="text-[10px] font-mono-code text-base-content/30 mt-1">Diperbarui otomatis</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
