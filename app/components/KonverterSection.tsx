"use client";
import { useState, useEffect } from "react";

type Mode = "btcToIdr" | "idrToBtc" | "usdToIdr";

export default function KonverterSection() {
  const [mode, setMode] = useState<Mode>("btcToIdr");
  const [input, setInput] = useState("1");
  const [result, setResult] = useState("");
  const [btc, setBtc] = useState(103450.23);
  const IDR = 16450;

  useEffect(() => {
    const id = setInterval(() => setBtc(p => p * (1 + (Math.random() - 0.49) * 0.002)), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const v = parseFloat(input.replace(/,/g, "")) || 0;
    if (mode === "btcToIdr") setResult(`Rp ${(v * btc * IDR).toLocaleString("id-ID",{maximumFractionDigits:0})}`);
    else if (mode === "idrToBtc") setResult(`₿ ${(v / (btc * IDR)).toFixed(8)} BTC`);
    else setResult(`Rp ${(v * IDR).toLocaleString("id-ID",{maximumFractionDigits:0})}`);
  }, [input, mode, btc]);

  const presets: Record<Mode, string[]> = {
    btcToIdr:  ["0.001","0.01","0.1","0.5","1","5"],
    idrToBtc:  ["100000","500000","1000000","5000000","10000000","50000000"],
    usdToIdr:  ["1","10","100","500","1000","5000"],
  };
  const fmtP = (p: string) => mode === "btcToIdr" ? `₿ ${p}` : mode === "idrToBtc" ? `Rp ${parseInt(p).toLocaleString("id-ID")}` : `$ ${p}`;
  const fromLabel = mode === "btcToIdr" ? "Bitcoin (BTC)" : mode === "idrToBtc" ? "Rupiah (IDR)" : "USD ($)";
  const toLabel   = mode === "btcToIdr" ? "Rupiah (IDR)" : mode === "idrToBtc" ? "Bitcoin (BTC)" : "Rupiah (IDR)";
  const prefix    = mode === "btcToIdr" ? "₿" : mode === "idrToBtc" ? "Rp" : "$";

  return (
    <section id="konverter" className="py-24 px-4 reveal">
      <style>{`
        @media (max-width: 1023px) {
          .konverter-rate-bar {
            flex-direction: column !important;
            gap: 8px !important;
            align-items: flex-start !important;
          }
          .konverter-rate-bar > div {
            display: flex; gap: 8px; flex-wrap: wrap;
          }
        }
        @media (max-width: 479px) {
          .konverter-mode-tab span { font-size: 10px !important; }
          .konverter-preset-btn { font-size: 10px !important; padding: 5px 8px !important; }
        }
      `}</style>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold glass px-3 py-1 rounded-full border mb-4"
            style={{ color: "var(--color-primary,#f59e0b)", borderColor: "color-mix(in srgb, var(--color-primary,#f59e0b) 25%, transparent)" }}>
            💱 Konverter Harga
          </div>
          <h2 className="font-black text-3xl sm:text-4xl mb-3" style={{ color: "var(--text-main,#e8eaf0)" }}>
            Konversi <span style={{ color: "var(--color-primary,#f59e0b)" }}>BTC</span> ke IDR
          </h2>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.45 }}>Kurs realtime diupdate otomatis.</p>
        </div>

        <div className="grad-border p-5 sm:p-8 reveal-scale">
          {/* Rate bar */}
          <div className="konverter-rate-bar" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", borderRadius:12, marginBottom:24,
            background:"color-mix(in srgb, var(--color-primary,#f59e0b) 6%, transparent)",
            border:"1px solid color-mix(in srgb, var(--color-primary,#f59e0b) 15%, transparent)" }}>
            <span style={{ fontSize:12, color:"var(--text-main,#e8eaf0)", opacity:.7 }}>
              1 BTC = <strong style={{ color:"var(--color-primary,#f59e0b)" }}>${btc.toLocaleString("en-US",{maximumFractionDigits:2})}</strong>
            </span>
            <span style={{ fontSize:12, color:"var(--text-main,#e8eaf0)", opacity:.7 }}>
              1 USD = <strong style={{ color:"var(--color-secondary,#06b6d4)" }}>Rp {IDR.toLocaleString("id-ID")}</strong>
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontFamily:"monospace", color:"#22c55e" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#22c55e", display:"inline-block" }} />
              LIVE
            </div>
          </div>

          {/* Mode tabs */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:3, padding:4, borderRadius:12,
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)", marginBottom:24 }}>
            {(["btcToIdr","idrToBtc","usdToIdr"] as Mode[]).map(m => (
              <button key={m} className="konverter-mode-tab" onClick={() => { setMode(m); setInput(""); }}
                style={{ padding:"10px 4px", borderRadius:9, fontSize:12, fontWeight:700, cursor:"pointer",
                  background: mode===m ? "color-mix(in srgb, var(--color-primary,#f59e0b) 15%, transparent)" : "transparent",
                  color: mode===m ? "var(--color-primary,#f59e0b)" : "var(--text-main,#e8eaf0)",
                  border:"none", opacity: mode===m ? 1 : 0.5, transition:"all .2s" }}>
                <span>{m==="btcToIdr" ? "BTC → IDR" : m==="idrToBtc" ? "IDR → BTC" : "USD → IDR"}</span>
              </button>
            ))}
          </div>

          {/* From */}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, color:"var(--text-main,#e8eaf0)", opacity:.4, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:8 }}>
              Dari ({fromLabel})
            </label>
            <div className="converter-input" style={{ display:"flex", alignItems:"center" }}>
              <span style={{ paddingLeft:16, color:"var(--color-primary,#f59e0b)", fontWeight:700, fontSize:14, flexShrink:0 }}>{prefix}</span>
              <input type="number" value={input} onChange={e => setInput(e.target.value)} placeholder="0"
                style={{ flex:1, background:"transparent", border:"none", padding:"14px 12px", fontSize:18, fontWeight:700,
                  color:"var(--text-main,#e8eaf0)", fontFamily:"monospace", minWidth:0 }} />
              {input && <button onClick={() => setInput("")} style={{ paddingRight:14, color:"rgba(200,200,200,0.3)", cursor:"pointer", fontSize:13, background:"none", border:"none" }}>✕</button>}
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display:"flex", justifyContent:"center", margin:"12px 0" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
              background:"color-mix(in srgb, var(--color-primary,#f59e0b) 10%, transparent)",
              border:"1px solid color-mix(in srgb, var(--color-primary,#f59e0b) 20%, transparent)",
              color:"var(--color-primary,#f59e0b)" }}>↕</div>
          </div>

          {/* Result */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, color:"var(--text-main,#e8eaf0)", opacity:.4, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:8 }}>
              Ke ({toLabel})
            </label>
            <div style={{ padding:"16px 18px", borderRadius:12, minHeight:64, display:"flex", alignItems:"center",
              background:"color-mix(in srgb, var(--color-primary,#f59e0b) 5%, transparent)",
              border:"1px solid color-mix(in srgb, var(--color-primary,#f59e0b) 15%, transparent)" }}>
              {result
                ? <span className="font-mono-styled font-black" style={{ fontSize:"clamp(1.1rem,4vw,1.8rem)", color:"var(--color-primary,#f59e0b)", wordBreak:"break-all" }}>{result}</span>
                : <span style={{ color:"var(--text-main,#e8eaf0)", opacity:.25, fontSize:14 }}>Masukkan nilai di atas…</span>
              }
            </div>
          </div>

          {/* Presets */}
          <div>
            <p style={{ fontSize:11, color:"var(--text-main,#e8eaf0)", opacity:.3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Nilai Cepat</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {presets[mode].map(p => (
                <button key={p} className="konverter-preset-btn" onClick={() => setInput(p)}
                  style={{ padding:"6px 12px", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"monospace",
                    background: input===p ? "color-mix(in srgb, var(--color-primary,#f59e0b) 15%, transparent)" : "transparent",
                    color: input===p ? "var(--color-primary,#f59e0b)" : "var(--text-main,#e8eaf0)",
                    border: input===p ? "1px solid color-mix(in srgb, var(--color-primary,#f59e0b) 30%, transparent)" : "1px solid rgba(255,255,255,0.07)",
                    opacity: input===p ? 1 : 0.55, transition:"all .15s" }}>
                  {fmtP(p)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p style={{ textAlign:"center", fontSize:11, color:"var(--text-main,#e8eaf0)", opacity:.25, marginTop:12, fontFamily:"monospace" }}>
          * Estimasi berdasarkan kurs pasar. Bukan rekomendasi investasi.
        </p>
      </div>
    </section>
  );
}
