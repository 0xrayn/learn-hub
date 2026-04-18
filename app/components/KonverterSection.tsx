"use client";
import { useState, useEffect } from "react";

type Mode = "btcToIdr" | "idrToBtc" | "usdToIdr";

const BTC_USD = 103450.23;
const IDR_RATE = 16450;

export default function KonverterSection() {
  const [mode, setMode] = useState<Mode>("btcToIdr");
  const [input, setInput] = useState("1");
  const [result, setResult] = useState("");
  const [btc, setBtc] = useState(BTC_USD);

  useEffect(() => {
    const id = setInterval(() => setBtc(p => p * (1 + (Math.random() - 0.49) * 0.002)), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const v = parseFloat(input.replace(/,/g, "")) || 0;
    if (mode === "btcToIdr")  setResult(`Rp ${(v * btc * IDR_RATE).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`);
    else if (mode === "idrToBtc") setResult(`₿ ${(v / (btc * IDR_RATE)).toFixed(8)} BTC`);
    else setResult(`Rp ${(v * IDR_RATE).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`);
  }, [input, mode, btc]);

  const presets: Record<Mode, string[]> = {
    btcToIdr:  ["0.001","0.01","0.1","0.5","1","5"],
    idrToBtc:  ["100000","500000","1000000","5000000","10000000","50000000"],
    usdToIdr:  ["1","10","100","500","1000","5000"],
  };
  const labels: Record<Mode, { from: string; to: string; prefix: string }> = {
    btcToIdr:  { from: "Bitcoin (BTC)", to: "Rupiah (IDR)", prefix: "₿" },
    idrToBtc:  { from: "Rupiah (IDR)", to: "Bitcoin (BTC)", prefix: "Rp" },
    usdToIdr:  { from: "USD ($)", to: "Rupiah (IDR)", prefix: "$" },
  };
  const L = labels[mode];

  const fmtPreset = (p: string) => {
    if (mode === "btcToIdr") return `₿ ${p}`;
    if (mode === "idrToBtc") return `Rp ${parseInt(p).toLocaleString("id-ID")}`;
    return `$ ${p}`;
  };

  return (
    <section id="konverter" className="py-24 px-4 reveal">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 glass px-3 py-1 rounded-full border border-amber-400/20 mb-4">
            💱 Konverter Harga
          </div>
          <h2 className="font-black text-3xl sm:text-4xl text-white mb-3">
            Konversi <span className="text-amber-400">BTC</span> ke IDR
          </h2>
          <p className="text-white/40">Kurs realtime diupdate otomatis setiap beberapa detik.</p>
        </div>

        <div className="grad-border p-6 sm:p-8">
          {/* Live rate strip */}
          <div className="flex items-center justify-between p-3 rounded-xl mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="text-xs">
              <span className="text-white/40">1 BTC = </span>
              <span className="text-amber-400 font-bold font-mono-styled">${btc.toLocaleString("en-US",{maximumFractionDigits:2})}</span>
            </div>
            <div className="text-xs">
              <span className="text-white/40">1 USD = </span>
              <span className="text-cyan-400 font-bold font-mono-styled">Rp {IDR_RATE.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono-styled">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"/>
              </span>
              LIVE
            </div>
          </div>

          {/* Mode selector */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            {(["btcToIdr","idrToBtc","usdToIdr"] as Mode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setInput(""); }}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  mode === m
                    ? "bg-amber-400/20 text-amber-400"
                    : "text-white/40 hover:text-white/70"
                }`}>
                {m === "btcToIdr" ? "BTC → IDR" : m === "idrToBtc" ? "IDR → BTC" : "USD → IDR"}
              </button>
            ))}
          </div>

          {/* From */}
          <div className="mb-4">
            <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">{L.from}</label>
            <div className="converter-input flex items-center">
              <span className="pl-4 text-amber-400 font-bold font-mono-styled text-sm flex-shrink-0">{L.prefix}</span>
              <input
                type="number" value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 bg-transparent px-3 py-4 text-lg font-bold text-white outline-none font-mono-styled"
                placeholder="0"
              />
              {input && (
                <button onClick={() => setInput("")} className="pr-4 text-white/20 hover:text-white/60 transition-colors text-sm">✕</button>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-amber-400"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              ↕
            </div>
          </div>

          {/* Result */}
          <div className="mb-6">
            <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block">{L.to}</label>
            <div className="p-5 rounded-xl min-h-[4rem] flex items-center"
              style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
              {result
                ? <span className="font-black text-2xl sm:text-3xl text-amber-400 font-mono-styled" style={{ textShadow: '0 0 20px rgba(245,158,11,0.3)' }}>{result}</span>
                : <span className="text-white/20 text-sm">Masukkan nilai di atas…</span>
              }
            </div>
          </div>

          {/* Presets */}
          <div>
            <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Nilai Cepat</p>
            <div className="flex flex-wrap gap-2">
              {presets[mode].map(p => (
                <button key={p} onClick={() => setInput(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-styled transition-all ${
                    input === p
                      ? "bg-amber-400/20 text-amber-400 border border-amber-400/40"
                      : "glass text-white/40 border border-transparent hover:border-white/10 hover:text-white/70"
                  }`}>
                  {fmtPreset(p)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-4 font-mono-styled">
          * Estimasi berdasarkan kurs pasar. Bukan rekomendasi investasi.
        </p>
      </div>
    </section>
  );
}
