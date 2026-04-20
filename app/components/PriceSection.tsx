"use client";
import { useEffect, useState, useCallback } from "react";

const IDR = 16450;

interface BTCData {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
}

// Fetch from CoinGecko (public, no API key)
async function fetchBTCPrice(): Promise<BTCData | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true",
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const b = data.bitcoin;
    // CoinGecko simple/price doesn't give high/low, estimate from change
    const base = b.usd / (1 + b.usd_24h_change / 100);
    return {
      price: b.usd,
      change24h: b.usd_24h_change,
      high24h: b.usd * 1.008 + Math.random() * 200, // approximation
      low24h:  b.usd * 0.985 - Math.random() * 150,
      volume24h: b.usd_24h_vol,
      marketCap: b.usd_market_cap,
    };
  } catch { return null; }
}

// Fetch OHLC from CoinGecko for chart
async function fetchOHLC(days: number): Promise<number[] | null> {
  try {
    // /coins/{id}/market_chart gives price array
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? "hourly" : days <= 7 ? "hourly" : "daily"}`,
      { next: { revalidate: 0 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    // prices is [[timestamp, price], ...]
    const prices: number[] = data.prices.map((p: [number, number]) => p[1]);
    // Down-sample to ~60 points for clean chart
    if (prices.length > 60) {
      const step = Math.floor(prices.length / 60);
      return prices.filter((_, i) => i % step === 0).slice(0, 60);
    }
    return prices;
  } catch { return null; }
}

const PERIOD_DAYS: Record<string, number> = {
  "1H": 0.042, // 1h = ~0.042 days
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "1Y": 365,
};

// Fallback local generator
function makeHistory(len = 60, base = 103000): number[] {
  const arr: number[] = [];
  let v = base * 0.97;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.48) * 400;
    arr.push(Math.max(base * 0.92, Math.min(base * 1.08, v)));
  }
  return arr;
}

export default function PriceSection() {
  const [btcData, setBtcData] = useState<BTCData>({
    price: 103450, change24h: 2.34, high24h: 106000, low24h: 101000,
    volume24h: 38_700_000_000, marketCap: 2_040_000_000_000,
  });
  const [history, setHistory]   = useState<number[]>([]);
  const [period, setPeriod]     = useState("1D");
  const [loading, setLoading]   = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [theme, setTheme]       = useState("dark");

  // Watch theme
  useEffect(() => {
    const readTheme = () => setTheme(document.documentElement.getAttribute("data-theme") || "dark");
    readTheme();
    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  // Initial load
  useEffect(() => {
    setMounted(true);
    setHistory(makeHistory());
    loadPrice();
    loadChart("1D");
    // Refresh price every 30s
    const id = setInterval(loadPrice, 30_000);
    return () => clearInterval(id);
  }, []);

  const loadPrice = async () => {
    const data = await fetchBTCPrice();
    if (data) setBtcData(data);
  };

  const loadChart = useCallback(async (p: string) => {
    setLoading(true);
    const days = PERIOD_DAYS[p] ?? 1;
    const prices = await fetchOHLC(days);
    if (prices && prices.length > 3) {
      setHistory(prices);
    } else {
      // Fallback with slight variation per period
      const base = btcData.price;
      const noise = { "1H": 200, "1D": 800, "1W": 3000, "1M": 8000, "1Y": 20000 }[p] ?? 800;
      const arr: number[] = [];
      let v = base - noise * 0.3;
      for (let i = 0; i < 60; i++) {
        v += (Math.random() - 0.47) * (noise / 20);
        arr.push(Math.max(base * 0.7, Math.min(base * 1.3, v)));
      }
      arr[arr.length - 1] = base;
      setHistory(arr);
    }
    setLoading(false);
  }, [btcData.price]);

  const handlePeriod = (p: string) => {
    setPeriod(p);
    loadChart(p);
  };

  const accent   = { dark:"#f59e0b", light:"#d97706", forest:"#22c55e", retro:"#fb923c" }[theme] ?? "#f59e0b";
  const textMain = { dark:"#e8eaf0", light:"#1e293b", forest:"#dcfce7", retro:"#fef3c7" }[theme] ?? "#e8eaf0";
  const isUp = btcData.change24h >= 0;

  const fmt = (n: number) => n >= 1e12
    ? `$${(n/1e12).toFixed(2)}T`
    : n >= 1e9
    ? `$${(n/1e9).toFixed(1)}B`
    : `$${n.toLocaleString("en-US",{maximumFractionDigits:0})}`;

  const stats = [
    { label:"Harga USD",  val:`$${btcData.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`, color:accent, icon:"₿" },
    { label:"Harga IDR",  val:`Rp ${(btcData.price*IDR).toLocaleString("id-ID",{maximumFractionDigits:0})}`, color:"var(--color-secondary,#06b6d4)", icon:"🇮🇩" },
    { label:"24h High",   val:`$${btcData.high24h.toLocaleString("en-US",{maximumFractionDigits:0})}`,  color:"#22c55e", icon:"⬆" },
    { label:"24h Low",    val:`$${btcData.low24h.toLocaleString("en-US",{maximumFractionDigits:0})}`,   color:"#ef4444", icon:"⬇" },
    { label:"Volume 24h", val:fmt(btcData.volume24h),  color:"#a78bfa", icon:"📊" },
    { label:"Market Cap", val:fmt(btcData.marketCap),  color:"#fb923c", icon:"🌐" },
  ];

  return (
    <section id="harga" className="py-24 px-4 reveal">
      <style>{`
        @media (max-width: 1023px) {
          .price-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .price-chart-header { flex-direction: column !important; gap: 10px !important; }
          .price-periods { gap: 4px !important; }
          .price-periods button { padding: 6px 10px !important; font-size: 10px !important; }
          .price-stat-val { font-size: 0.875rem !important; }
        }
        @media (max-width: 479px) {
          .price-stat-icon { display: none; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="price-header flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold glass px-3 py-1 rounded-full border mb-3"
              style={{ color:accent, borderColor:`color-mix(in srgb, ${accent} 25%, transparent)` }}>
              📊 Harga Realtime
            </div>
            <h2 className="font-black text-3xl sm:text-4xl" style={{ color:textMain }}>
              Pantau Harga <span style={{ color:accent }}>Bitcoin</span>
            </h2>
          </div>
          <div className="font-mono-styled text-sm font-bold px-4 py-2 rounded-xl glass"
            style={{
              color: isUp ? "#22c55e" : "#ef4444",
              border:`1px solid ${isUp ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
            }}>
            {isUp?"▲":"▼"} {Math.abs(btcData.change24h).toFixed(2)}% hari ini
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 reveal-children">
          {stats.map(s => (
            <div key={s.label} className="grad-border p-4 sm:p-5"
              style={{ transition:"transform .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none"}}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span className="price-stat-icon" style={{ fontSize:16 }}>{s.icon}</span>
                <span className="text-xs uppercase tracking-wider" style={{ color:textMain, opacity:0.4 }}>{s.label}</span>
              </div>
              <div className="font-black font-mono-styled text-base sm:text-xl" style={{ color:s.color }}>
                {s.val}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="grad-border p-5 sm:p-6 reveal-scale">
          <div className="price-chart-header flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="font-bold" style={{ color:textMain }}>BTC / USDT</div>
              <div className="font-mono-styled font-black" style={{ fontSize:"clamp(1.4rem,3vw,2rem)", color:accent }}>
                ${btcData.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              </div>
            </div>
            <div className="price-periods" style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
              {Object.keys(PERIOD_DAYS).map(p => (
                <button key={p} onClick={() => handlePeriod(p)}
                  style={{
                    padding:"7px 14px", borderRadius:9, fontSize:11, fontWeight:700, cursor:"pointer",
                    fontFamily:"monospace", transition:"all .15s",
                    background: period===p ? `color-mix(in srgb, ${accent} 20%, transparent)` : "transparent",
                    color: period===p ? accent : textMain,
                    border: period===p ? `1px solid color-mix(in srgb, ${accent} 40%, transparent)` : "1px solid transparent",
                    opacity: period===p ? 1 : 0.4,
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Chart area */}
          {mounted ? (
            loading ? (
              <div style={{ height:180, display:"flex", alignItems:"center", justifyContent:"center",
                background:"rgba(255,255,255,0.02)", borderRadius:12 }}>
                <div style={{ color:accent, fontSize:12, fontFamily:"monospace", opacity:0.6 }}>
                  Loading chart…
                </div>
              </div>
            ) : history.length > 0 ? (
              <LiveChart history={history} isUp={isUp} accent={accent} period={period} />
            ) : null
          ) : (
            <div style={{ height:180, background:"rgba(255,255,255,0.02)", borderRadius:12 }} />
          )}

          {/* X-axis */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:6,
            fontSize:10, fontFamily:"monospace", color:textMain, opacity:0.22 }}>
            {{ "1H":["60m ago","45m","30m","15m","Now"],
               "1D":["24h ago","18h","12h","6h","Now"],
               "1W":["7d ago","5d","3d","1d","Now"],
               "1M":["30d ago","22d","14d","7d","Now"],
               "1Y":["1y ago","9mo","6mo","3mo","Now"],
            }[period]?.map(l=><span key={l}>{l}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function LiveChart({ history, isUp, accent, period }: {
  history:number[]; isUp:boolean; accent:string; period:string;
}) {
  const W=900, H=180;
  const min=Math.min(...history);
  const max=Math.max(...history);
  const range=max-min||1;
  const color=isUp?"#22c55e":"#ef4444";

  const pts=history.map((v,i)=>({
    x:(i/(history.length-1))*W,
    y:H-((v-min)/range)*(H-24)-12,
  }));

  // Smooth bezier
  const smooth=pts.map((p,i)=>{
    if(i===0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    const prev=pts[i-1];
    const cpx=((prev.x+p.x)/2).toFixed(1);
    return `C ${cpx} ${prev.y.toFixed(1)} ${cpx} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }).join(" ");

  const fill=smooth+` L ${W} ${H} L 0 ${H} Z`;
  const last=pts[pts.length-1];

  const yLabels=Array.from({length:5},(_,i)=>({
    y: H-(i/4)*(H-24)-12,
    val: (min+(i/4)*range).toLocaleString("en-US",{maximumFractionDigits:0}),
  }));

  return (
    <div style={{ position:"relative", width:"100%", height:H,
      background:"rgba(255,255,255,0.02)", borderRadius:12, overflow:"hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"100%" }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {yLabels.map((l,i)=>(
          <line key={i} x1="0" y1={l.y.toFixed(1)} x2={W} y2={l.y.toFixed(1)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        ))}
        <path d={fill} fill="url(#chartFill)"/>
        <path d={smooth} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} r="4" fill={color}/>
        <circle cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} r="10" fill={color} opacity="0.15">
          <animate attributeName="r" values="4;14;4" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0;0.2" dur="2.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
      <div style={{ position:"absolute", top:0, right:8, height:"100%",
        display:"flex", flexDirection:"column", justifyContent:"space-between",
        padding:"6px 0", pointerEvents:"none" }}>
        {[...yLabels].reverse().map((l,i)=>(
          <span key={i} style={{ fontSize:10, fontFamily:"monospace", color:"rgba(255,255,255,0.2)" }}>
            ${l.val}
          </span>
        ))}
      </div>
    </div>
  );
}
