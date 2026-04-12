"use client";
import { useState } from "react";
import { ArrowLeftRight, Zap } from "lucide-react";

const BTC_IDR = 83420 * 16250;

const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const fmtBTC = (n: number) => n.toFixed(8);

const QUICK_BTC = [0.001, 0.01, 0.1, 0.5, 1];
const QUICK_IDR = [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000];

export default function Calculator_() {
  const [btc, setBtc] = useState("");
  const [idr, setIdr] = useState("");
  const [mode, setMode] = useState<"btc"|"idr">("btc");

  const onBtc = (val: string) => {
    setBtc(val);
    const n = parseFloat(val);
    setIdr(isNaN(n) ? "" : Math.round(n * BTC_IDR).toString());
    setMode("btc");
  };
  const onIdr = (val: string) => {
    setIdr(val);
    const n = parseFloat(val.replace(/[^\d.]/g, ""));
    setBtc(isNaN(n) ? "" : fmtBTC(n / BTC_IDR));
    setMode("idr");
  };

  return (
    <section id="kalkulator" className="relative py-28 px-5 sm:px-8 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,0,45,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "rgba(232,0,45,0.1)", border: "1px solid rgba(232,0,45,0.25)", color: "#ff4d6d" }}>
            ⚡ Kalkulator
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Konversi <span className="gradient-text">BTC ↔ Rupiah</span>
          </h2>
          <p className="text-white/50">Hitung nilai Bitcoin kamu dalam Rupiah secara instan</p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Rate banner */}
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl mb-6"
            style={{ background: "rgba(232,0,45,0.08)", border: "1px solid rgba(232,0,45,0.2)" }}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white/60 text-sm">1 BTC</span>
              <span className="text-white/30">=</span>
            </div>
            <span className="font-black text-white font-mono">{fmtIDR(BTC_IDR)}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
              LIVE
            </span>
          </div>

          <div className="rounded-3xl p-6 sm:p-8 space-y-4"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}>

            {/* BTC field */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: mode === "btc" ? "#e8002d" : "rgba(255,255,255,0.35)" }}>
                <span className="text-base">₿</span> Bitcoin
              </label>
              <div className="relative">
                <input type="number" value={btc} onChange={e => onBtc(e.target.value)}
                  placeholder="0.00000000" step="0.00000001" min="0"
                  className="w-full px-4 py-3.5 pr-16 rounded-xl font-mono text-lg bg-transparent text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    border: mode === "btc" ? "1px solid rgba(232,0,45,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: mode === "btc" ? "0 0 20px rgba(232,0,45,0.15)" : "none",
                  }} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "#e8002d" }}>BTC</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_BTC.map(a => (
                  <button key={a} onClick={() => onBtc(a.toString())}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono text-white/50 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Swap */}
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: "rgba(232,0,45,0.15)", border: "1px solid rgba(232,0,45,0.3)" }}>
                <ArrowLeftRight size={16} style={{ color: "#e8002d" }} />
              </div>
            </div>

            {/* IDR field */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: mode === "idr" ? "#e8002d" : "rgba(255,255,255,0.35)" }}>
                <span className="text-base">🇮🇩</span> Rupiah
              </label>
              <div className="relative">
                <input type="number" value={idr} onChange={e => onIdr(e.target.value)}
                  placeholder="0" step="1000" min="0"
                  className="w-full px-4 py-3.5 pr-16 rounded-xl font-mono text-lg bg-transparent text-white placeholder-white/20 outline-none transition-all"
                  style={{
                    border: mode === "idr" ? "1px solid rgba(232,0,45,0.5)" : "1px solid rgba(255,255,255,0.1)",
                    boxShadow: mode === "idr" ? "0 0 20px rgba(232,0,45,0.15)" : "none",
                  }} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "#e8002d" }}>IDR</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {QUICK_IDR.map(a => (
                  <button key={a} onClick={() => onIdr(a.toString())}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono text-white/50 hover:text-white transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {a >= 1_000_000 ? `${a / 1_000_000}jt` : `${a / 1000}rb`}
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            {btc && idr && (
              <div className="rounded-2xl px-5 py-4 text-center mt-2"
                style={{ background: "rgba(232,0,45,0.08)", border: "1px solid rgba(232,0,45,0.2)" }}>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="font-bold text-white font-mono">{btc} BTC</span>
                  <Zap size={14} style={{ color: "#e8002d" }} />
                  <span className="font-bold text-white font-mono">{fmtIDR(parseFloat(idr))}</span>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-white/20 mt-5 font-mono">
            // Harga simulasi. Bukan saran investasi.
          </p>
        </div>
      </div>
    </section>
  );
}
