"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BitcoinCanvas = dynamic(() => import("./BitcoinCanvas"), { ssr: false });

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
  const [btc, setBtc]   = useState(103450.23);
  const [prev, setPrev] = useState(103450.23);
  const [flash, setFlash] = useState("");
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme]     = useState("dark");
  const IDR = 16450;

  useEffect(() => {
    setMounted(true);
    const readTheme = () => setTheme(document.documentElement.getAttribute("data-theme") || "dark");
    readTheme();
    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Fetch real BTC price from CoinGecko
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = await res.json();
        const newPrice = data.bitcoin.usd;
        setBtc(p => {
          setPrev(p);
          setFlash(newPrice > p ? "price-up" : "price-down");
          setTimeout(() => setFlash(""), 900);
          return newPrice;
        });
      } catch { /* use last known price */ }
    };

    fetchPrice();
    const id = setInterval(fetchPrice, 30_000);
    return () => { clearInterval(id); mo.disconnect(); };
  }, []);

  const change = ((btc - 98200) / 98200) * 100;

  // Theme-aware colors
  const accent    = { dark:"#f59e0b", light:"#d97706", forest:"#22c55e", retro:"#fb923c" }[theme] ?? "#f59e0b";
  const secondary = { dark:"#06b6d4", light:"#0891b2", forest:"#86efac", retro:"#fbbf24" }[theme] ?? "#06b6d4";
  const cardBg    = { dark:"rgba(12,17,32,0.88)", light:"rgba(255,255,255,0.92)", forest:"rgba(10,28,14,0.90)", retro:"rgba(28,18,0,0.90)" }[theme] ?? "rgba(12,17,32,0.88)";
  const textMain  = { dark:"#e8eaf0", light:"#1e293b", forest:"#dcfce7", retro:"#fef3c7" }[theme] ?? "#e8eaf0";
  const statBg    = { dark:"rgba(12,17,32,0.82)", light:"rgba(255,255,255,0.82)", forest:"rgba(10,28,14,0.84)", retro:"rgba(28,18,0,0.84)" }[theme] ?? "rgba(12,17,32,0.82)";

  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", overflow:"hidden", paddingTop:56 }}>
      {/* 3D Canvas */}
      <div style={{ position:"absolute", inset:0, zIndex:0 }}>
        <BitcoinCanvas />
      </div>

      {/* Gradient overlay */}
      <div style={{
        position:"absolute", inset:0, zIndex:1, pointerEvents:"none",
        background:`linear-gradient(to bottom, transparent 40%, ${
          { dark:"#050810", light:"#f0f4ff", forest:"#0a1a0e", retro:"#1a0f00" }[theme] ?? "#050810"
        } 95%)`,
      }} />

      {/* ── Responsive styles ── */}
      <style>{`
        .hero-outer {
          position: relative; z-index: 2; flex: 1;
          display: flex; align-items: center; width: 100%;
        }
        .hero-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 40px 16px 24px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 28px;
          overflow: hidden;
        }
        /* Desktop: text fills left, price card floats bottom-right */
        @media (min-width: 1024px) {
          .hero-inner {
            flex-direction: row;
            align-items: flex-end;
            gap: 60px;
            padding: 80px 40px 48px;
          }
          .hero-text  { flex: 1; }
          .hero-card  { width: 340px; flex-shrink: 0; margin-bottom: 0; }
        }

        .hero-stat-bar {
          position: relative; z-index: 2;
          max-width: 1280px; margin: 0 auto;
          padding: 0 16px 28px;
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        @media (min-width: 1024px) {
          .hero-stat-bar { padding: 0 40px 40px; gap: 10px; }
        }
        @media (max-width: 1023px) {
          .hero-card { width: 100% !important; }
        }

        .stat-pill {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 18px; border-radius: 50px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: transform .2s ease, border-color .2s;
        }
        .stat-pill:hover { transform: translateY(-2px); }
      `}</style>

      {/* Content */}
      <div className="hero-outer">
        <div className="hero-inner">

          {/* ── Left / Top: Text ── */}
          <div className="hero-text">
            {/* Badge */}
            <div className="anim-slide-right delay-100" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"6px 14px", borderRadius:999, marginBottom:22,
              background:`color-mix(in srgb, ${accent} 10%, transparent)`,
              border:`1px solid color-mix(in srgb, ${accent} 25%, transparent)`,
              fontSize:11, fontWeight:700, color:accent,
            }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:accent, display:"inline-block" }}
                className="animate-ping" />
              Platform Edukasi Bitcoin #1 Indonesia
            </div>

            {/* Headline */}
            <h1 className="anim-slide-up delay-200 font-black" style={{
              fontSize:"clamp(2.6rem, 6vw, 5.5rem)", lineHeight:0.93,
              color:textMain, marginBottom:20,
            }}>
              Kuasai<br />
              <span className="gradient-text-bitcoin">Bitcoin</span><br />
              <span style={{ opacity:0.72 }}>dari Nol</span>
            </h1>

            <p className="anim-slide-up delay-300" style={{
              fontSize:"clamp(0.9rem, 1.8vw, 1.05rem)", lineHeight:1.75,
              color:textMain, opacity:0.55, marginBottom:28, maxWidth:460,
            }}>
              Harga realtime, artikel mendalam, modul belajar terstruktur &amp; konversi BTC↔IDR. Gratis untuk semua.
            </p>

            {/* CTA */}
            <div className="anim-slide-up delay-400" style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              <a href="/edukasi" style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"12px 22px", borderRadius:13, fontWeight:700,
                fontSize:"clamp(0.82rem,1.8vw,0.95rem)", color:"#000", textDecoration:"none",
                background:`linear-gradient(135deg, ${accent}, #f97316)`,
                boxShadow:`0 8px 28px color-mix(in srgb, ${accent} 30%, transparent)`,
                transition:"transform .2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)"}}>
                🎓 Mulai Belajar
              </a>
              <a href="/#konverter" style={{
                display:"flex", alignItems:"center", gap:8,
                padding:"12px 22px", borderRadius:13, fontWeight:700,
                fontSize:"clamp(0.82rem,1.8vw,0.95rem)", color:secondary, textDecoration:"none",
                background:`color-mix(in srgb, ${secondary} 8%, transparent)`,
                border:`1px solid color-mix(in srgb, ${secondary} 30%, transparent)`,
                backdropFilter:"blur(12px)", transition:"transform .2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.05)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)"}}>
                💱 Konversi BTC
              </a>
            </div>
          </div>

          {/* ── Right / Bottom: Price card — sits bottom-right on desktop ── */}
          <div className="hero-card anim-slide-up delay-500">
            <CompactPriceCard
              btc={btc} prev={prev} flash={flash} change={change} mounted={mounted}
              accent={accent} cardBg={cardBg} textMain={textMain}
            />
          </div>

        </div>
      </div>

      {/* ── Stats pills ── */}
      <div style={{ position:"relative", zIndex:2, width:"100%" }}>
        <div className="hero-stat-bar">
          {[
            { v:"50+",  l:"Artikel",  icon:"📝" },
            { v:"12",   l:"Modul",    icon:"🎓" },
            { v:"24/7", l:"Realtime", icon:"⚡" },
          ].map(s => (
            <div key={s.l} className="stat-pill" style={{
              background:statBg,
              border:`1px solid color-mix(in srgb, ${accent} 15%, rgba(255,255,255,0.06))`,
            }}>
              <span style={{ fontSize:15 }}>{s.icon}</span>
              <span className="font-mono-styled" style={{ fontWeight:900, fontSize:15, color:accent }}>{s.v}</span>
              <span style={{ fontSize:12, color:textMain, opacity:0.5 }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position:"absolute", bottom:18, left:"50%", transform:"translateX(-50%)",
        zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:5,
      }} className="anim-fade delay-700">
        <span style={{ fontSize:9, color:textMain, opacity:0.22, letterSpacing:"0.12em", textTransform:"uppercase" }}>Scroll</span>
        <div style={{ width:1, height:26, background:`linear-gradient(to bottom, ${accent}, transparent)` }} className="animate-pulse" />
      </div>
    </section>
  );
}

/* ── Compact Price Card ── */
function CompactPriceCard({ btc, prev, flash, change, mounted, accent, cardBg, textMain }: {
  btc:number; prev:number; flash:string; change:number; mounted:boolean;
  accent:string; cardBg:string; textMain:string;
}) {
  const IDR = 16450;
  return (
    <div style={{
      borderRadius:18, padding:"18px 20px 14px",
      background:cardBg,
      border:`1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
      backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
      boxShadow:`0 8px 40px rgba(0,0,0,0.28), 0 0 0 1px color-mix(in srgb, ${accent} 12%, transparent)`,
      width:"100%",
    }}>
      {/* Price row */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:10 }}>
        <div>
          <div className="font-mono-styled" style={{ fontSize:9, color:textMain, opacity:0.4, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>
            Bitcoin (BTC) Live
          </div>
          <div className={`font-mono-styled font-black ${flash}`} style={{
            fontSize:"clamp(1.25rem, 2.5vw, 1.75rem)", color:textMain, lineHeight:1.1,
          }}>
            ${btc.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}
          </div>
          <div className="font-mono-styled" style={{ fontSize:11, color:textMain, opacity:0.38, marginTop:2 }}>
            ≈ Rp {(btc*IDR).toLocaleString("id-ID",{maximumFractionDigits:0})}
          </div>
        </div>
        <div style={{
          padding:"5px 10px", borderRadius:9, textAlign:"center", flexShrink:0,
          background: change>=0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          border:`1px solid ${change>=0 ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
          color: change>=0 ? "#22c55e" : "#ef4444",
        }}>
          <div className="font-mono-styled" style={{ fontSize:12, fontWeight:700 }}>
            {change>=0?"▲":"▼"} {Math.abs(change).toFixed(2)}%
          </div>
          <div style={{ fontSize:9, opacity:0.5 }}>24h</div>
        </div>
      </div>

      {/* Spark */}
      {mounted && <MiniSpark current={btc} prev={prev} />}

      {/* Mini stats */}
      <div style={{ display:"flex", gap:6, marginTop:12, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.06)", flexWrap:"wrap" }}>
        {[{l:"Vol 24h",v:"$38.7B"},{l:"Mkt Cap",v:"$2.04T"},{l:"Dom",v:"52.4%"}].map(s=>(
          <div key={s.l} style={{
            flex:"1 1 60px", minWidth:60, textAlign:"center", padding:"5px 4px", borderRadius:8,
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)",
          }}>
            <div className="font-mono-styled" style={{ fontSize:12, fontWeight:700, color:accent }}>{s.v}</div>
            <div style={{ fontSize:9, color:textMain, opacity:0.38, marginTop:1 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniSpark({ current, prev }: { current:number; prev:number }) {
  const [history, setHistory] = useState<number[]>(() => generateHistory());
  useEffect(()=>{ setHistory(h=>[...h.slice(1), current]); },[current]);

  const min=Math.min(...history), max=Math.max(...history), range=max-min||1;
  const W=300, H=42;
  const pathD = history.map((v,i)=>{
    const x=(i/(history.length-1))*W;
    const y=H-((v-min)/range)*(H-6)-3;
    return `${i===0?"M":"L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const fillD = pathD+` L ${W} ${H} L 0 ${H} Z`;
  const isUp = current>=prev;
  const color = isUp ? "#22c55e" : "#ef4444";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:42, display:"block" }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#sg4)"/>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
