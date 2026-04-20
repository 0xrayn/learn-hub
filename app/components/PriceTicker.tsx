"use client";
import { useEffect, useState } from "react";

interface Coin { symbol: string; name: string; id: string; price: number; change: number; }

const FALLBACK: Coin[] = [
  { symbol:"BTC",  name:"Bitcoin",   id:"bitcoin",   price:103450, change: 2.34 },
  { symbol:"ETH",  name:"Ethereum",  id:"ethereum",  price:2891,   change:-0.87 },
  { symbol:"BNB",  name:"BNB",       id:"binancecoin",price:712,   change: 1.12 },
  { symbol:"SOL",  name:"Solana",    id:"solana",    price:185,    change: 3.45 },
  { symbol:"XRP",  name:"Ripple",    id:"ripple",    price:2.34,   change: 0.56 },
  { symbol:"ADA",  name:"Cardano",   id:"cardano",   price:0.82,   change:-1.23 },
  { symbol:"DOGE", name:"Dogecoin",  id:"dogecoin",  price:0.38,   change: 4.21 },
  { symbol:"AVAX", name:"Avalanche", id:"avalanche-2",price:43,    change:-2.11 },
];

export default function PriceTicker() {
  const [coins, setCoins] = useState(FALLBACK);

  const fetchPrices = async () => {
    try {
      const ids = FALLBACK.map(c => c.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const data = await res.json();
      setCoins(prev => prev.map(c => {
        const d = data[c.id];
        if (!d) return c;
        return { ...c, price: d.usd, change: d.usd_24h_change ?? c.change };
      }));
    } catch { /* keep current prices */ }
  };

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 60_000); // refresh every 60s
    return () => clearInterval(id);
  }, []);

  const items = [...coins, ...coins];

  return (
    <div className="reveal-left"
      style={{
        marginTop: 56,
        position: "relative",
        background: "var(--bg-card,rgba(12,17,32,0.8))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        zIndex: 40,
      }}>
      {/* Fade edges */}
      <div style={{ position:"absolute",left:0,top:0,bottom:0,width:80,zIndex:2,pointerEvents:"none",
        background:"linear-gradient(to right, var(--bg-page,#050810), transparent)" }}/>
      <div style={{ position:"absolute",right:0,top:0,bottom:0,width:80,zIndex:2,pointerEvents:"none",
        background:"linear-gradient(to left, var(--bg-page,#050810), transparent)" }}/>

      <div className="ticker-wrap" style={{ padding:"10px 0" }}>
        <div className="ticker-track ticker-running">
          {items.map((c,i) => (
            <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"0 20px",
              borderRight:"1px solid rgba(255,255,255,0.04)",flexShrink:0 }}>
              <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                <div style={{
                  width:22,height:22,borderRadius:"50%",
                  background:"color-mix(in srgb, var(--color-primary,#f59e0b) 15%, transparent)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,fontWeight:800,color:"var(--color-primary,#f59e0b)",
                }}>{c.symbol[0]}</div>
                <span style={{ fontSize:12,fontWeight:700,color:"var(--text-main,#e8eaf0)",opacity:.8 }}>{c.symbol}</span>
              </div>
              <span className="font-mono-styled" style={{ fontSize:12,color:"var(--text-main,#e8eaf0)",opacity:.9 }}>
                ${c.price < 10 ? c.price.toFixed(4) : c.price.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
              </span>
              <span className="font-mono-styled" style={{ fontSize:11,fontWeight:700,color:c.change>=0?"#22c55e":"#ef4444" }}>
                {c.change>=0?"▲":"▼"}{Math.abs(c.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
