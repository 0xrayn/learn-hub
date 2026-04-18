"use client";
import { useEffect, useState } from "react";

interface Coin { symbol: string; name: string; price: number; change: number; }

const INIT: Coin[] = [
  { symbol: "BTC",  name: "Bitcoin",   price: 103450.23, change:  2.34 },
  { symbol: "ETH",  name: "Ethereum",  price:   2891.45, change: -0.87 },
  { symbol: "BNB",  name: "BNB",       price:    712.33, change:  1.12 },
  { symbol: "SOL",  name: "Solana",    price:    185.67, change:  3.45 },
  { symbol: "ADA",  name: "Cardano",   price:      0.82, change: -1.23 },
  { symbol: "XRP",  name: "Ripple",    price:      2.34, change:  0.56 },
  { symbol: "DOGE", name: "Dogecoin",  price:      0.38, change:  4.21 },
  { symbol: "AVAX", name: "Avalanche", price:     43.12, change: -2.11 },
  { symbol: "DOT",  name: "Polkadot",  price:      8.91, change:  1.88 },
  { symbol: "MATIC",name: "Polygon",   price:      0.55, change: -0.44 },
];

export default function PriceTicker() {
  const [coins, setCoins] = useState(INIT);

  useEffect(() => {
    const id = setInterval(() => {
      setCoins(prev => prev.map(c => ({
        ...c,
        price:  c.price  * (1 + (Math.random() - 0.495) * 0.003),
        change: c.change + (Math.random() - 0.5) * 0.15,
      })));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const items = [...coins, ...coins];

  return (
    <div className="relative glass border-b border-white/5 overflow-hidden" style={{ marginTop: '56px' }}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #050810, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #050810, transparent)' }} />

      <div className="ticker-wrap py-2.5">
        <div className="ticker-track ticker-running">
          {items.map((c, i) => (
            <div key={i} className="flex items-center gap-4 px-6 border-r border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-400/15 flex items-center justify-center text-[10px] font-bold text-amber-400">
                  {c.symbol[0]}
                </div>
                <span className="text-xs font-bold text-white/80">{c.symbol}</span>
              </div>
              <span className="font-mono-styled text-xs text-white/90 font-medium">
                ${c.price < 10 ? c.price.toFixed(4) : c.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold font-mono-styled ${c.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {c.change >= 0 ? "▲" : "▼"}{Math.abs(c.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
