"use client";
import { useEffect, useState } from "react";

interface Coin { symbol: string; price: number; change: number; }

const INIT: Coin[] = [
  { symbol: "BTC",   price: 103450.23, change:  2.34 },
  { symbol: "ETH",   price:   2891.45, change: -0.87 },
  { symbol: "BNB",   price:    712.33, change:  1.12 },
  { symbol: "SOL",   price:    185.67, change:  3.45 },
  { symbol: "ADA",   price:      0.82, change: -1.23 },
  { symbol: "XRP",   price:      2.34, change:  0.56 },
  { symbol: "DOGE",  price:      0.38, change:  4.21 },
  { symbol: "AVAX",  price:     43.12, change: -2.11 },
  { symbol: "DOT",   price:      8.91, change:  1.88 },
  { symbol: "MATIC", price:      0.55, change: -0.44 },
];

export default function PriceTicker() {
  const [coins, setCoins] = useState(INIT);

  useEffect(() => {
    const id = setInterval(() => {
      setCoins(prev => prev.map(c => ({
        ...c,
        price:  Math.max(0.001, c.price  * (1 + (Math.random() - 0.495) * 0.003)),
        change: c.change + (Math.random() - 0.5) * 0.15,
      })));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const items = [...coins, ...coins];

  return (
    <div
      style={{
        marginTop: 56, /* exact navbar height */
        position: "relative",
        background: "var(--bg-card,rgba(12,17,32,0.8))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        zIndex: 40,
      }}
    >
      {/* Fade edges */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, zIndex:2, pointerEvents:"none",
        background: "linear-gradient(to right, var(--bg-page,#050810), transparent)" }} />
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, zIndex:2, pointerEvents:"none",
        background: "linear-gradient(to left, var(--bg-page,#050810), transparent)" }} />

      <div className="ticker-wrap" style={{ padding: "10px 0" }}>
        <div className="ticker-track ticker-running">
          {items.map((c, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"0 20px",
              borderRight:"1px solid rgba(255,255,255,0.04)", flexShrink:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{
                  width:22, height:22, borderRadius:"50%",
                  background: "color-mix(in srgb, var(--color-primary,#f59e0b) 15%, transparent)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:9, fontWeight:800, color:"var(--color-primary,#f59e0b)",
                }}>{c.symbol[0]}</div>
                <span style={{ fontSize:12, fontWeight:700, color:"var(--text-main,#e8eaf0)", opacity:.8 }}>{c.symbol}</span>
              </div>
              <span className="font-mono-styled" style={{ fontSize:12, color:"var(--text-main,#e8eaf0)", opacity:.9 }}>
                ${c.price < 10 ? c.price.toFixed(4) : c.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              </span>
              <span className="font-mono-styled" style={{ fontSize:11, fontWeight:700, color: c.change>=0 ? "#22c55e" : "#ef4444" }}>
                {c.change>=0 ? "▲" : "▼"}{Math.abs(c.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
