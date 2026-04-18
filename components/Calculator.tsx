"use client";
import { useState } from "react";
import { Calculator, ArrowLeftRight, TrendingUp } from "lucide-react";

const BTC_PRICE = 83420;

export default function CalculatorSection() {
  const [idrInput, setIdrInput] = useState("");
  const [btcInput, setBtcInput] = useState("");
  const [mode, setMode] = useState<"idr2btc" | "btc2idr">("idr2btc");

  const IDR_RATE = 16250;
  const btcUsd = BTC_PRICE;
  const btcIdr = btcUsd * IDR_RATE;

  const handleIdr = (val: string) => {
    setIdrInput(val);
    const n = parseFloat(val.replace(/\./g, "").replace(",", "."));
    if (!isNaN(n)) setBtcInput((n / btcIdr).toFixed(8));
    else setBtcInput("");
  };

  const handleBtc = (val: string) => {
    setBtcInput(val);
    const n = parseFloat(val);
    if (!isNaN(n)) setIdrInput(Math.round(n * btcIdr).toLocaleString("id-ID"));
    else setIdrInput("");
  };

  const SCENARIOS = [
    { label: "Rp 100.000", idr: 100000 },
    { label: "Rp 500.000", idr: 500000 },
    { label: "Rp 1.000.000", idr: 1000000 },
    { label: "Rp 5.000.000", idr: 5000000 },
  ];

  return (
    <section id="kalkulator" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-base-content/8 to-transparent" />
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="pill mb-5 inline-flex">
            <Calculator size={10} />
            Konverter
          </span>
          <h2 className="font-display font-black text-base-content mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}>
            Kalkulator <span className="text-gradient">Bitcoin</span>
          </h2>
          <p className="text-base-content/50 max-w-md mx-auto text-base">
            Konversi IDR ke BTC dan sebaliknya secara real-time.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-static p-6 sm:p-8 mb-5">
            {/* Mode toggle */}
            <div className="flex gap-2 bg-base-content/5 p-1 rounded-xl mb-7">
              <button onClick={() => setMode("idr2btc")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "idr2btc" ? "bg-primary text-primary-content" : "text-base-content/50 hover:text-base-content"}`}>
                IDR → BTC
              </button>
              <button onClick={() => setMode("btc2idr")}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "btc2idr" ? "bg-primary text-primary-content" : "text-base-content/50 hover:text-base-content"}`}>
                BTC → IDR
              </button>
            </div>

            <div className="space-y-4">
              {/* IDR input */}
              <div>
                <label className="text-[10px] font-mono-code uppercase tracking-[0.18em] text-base-content/40 block mb-2">
                  {mode === "idr2btc" ? "Jumlah IDR (Rupiah)" : "Hasil IDR"}
                </label>
                <div className="flex items-center gap-3 input-glass p-3.5">
                  <span className="text-base-content/35 font-mono-code text-sm font-bold flex-shrink-0">Rp</span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent outline-none text-base-content font-mono-code text-base font-bold placeholder:text-base-content/20"
                    placeholder="0"
                    value={mode === "idr2btc" ? idrInput : (btcInput ? Math.round(parseFloat(btcInput) * btcIdr).toLocaleString("id-ID") : "")}
                    onChange={mode === "idr2btc" ? (e) => handleIdr(e.target.value) : undefined}
                    readOnly={mode === "btc2idr"}
                  />
                </div>
              </div>

              {/* Swap icon */}
              <div className="flex justify-center">
                <button onClick={() => setMode(mode === "idr2btc" ? "btc2idr" : "idr2btc")}
                  className="w-9 h-9 rounded-xl bg-base-content/8 hover:bg-primary/20 hover:text-primary flex items-center justify-center text-base-content/40 transition-all duration-200">
                  <ArrowLeftRight size={15} />
                </button>
              </div>

              {/* BTC input */}
              <div>
                <label className="text-[10px] font-mono-code uppercase tracking-[0.18em] text-base-content/40 block mb-2">
                  {mode === "btc2idr" ? "Jumlah BTC" : "Hasil BTC"}
                </label>
                <div className="flex items-center gap-3 input-glass p-3.5">
                  <span className="text-base-content/35 font-mono-code text-sm font-bold flex-shrink-0">₿</span>
                  <input
                    type="number"
                    step="0.00000001"
                    className="flex-1 bg-transparent outline-none text-base-content font-mono-code text-base font-bold placeholder:text-base-content/20"
                    placeholder="0.00000000"
                    value={mode === "btc2idr" ? btcInput : btcInput}
                    onChange={mode === "btc2idr" ? (e) => handleBtc(e.target.value) : undefined}
                    readOnly={mode === "idr2btc"}
                  />
                </div>
              </div>
            </div>

            {/* Rate info */}
            <div className="mt-5 p-3.5 rounded-xl bg-base-content/4 border border-base-content/6 flex flex-wrap gap-3 justify-between text-xs font-mono-code text-base-content/40">
              <span>1 BTC = ${btcUsd.toLocaleString()}</span>
              <span>1 USD ≈ Rp {IDR_RATE.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Quick scenarios */}
          <div className="glass-static p-5">
            <p className="text-[9px] font-mono-code uppercase tracking-[0.18em] text-base-content/30 mb-4 flex items-center gap-2">
              <TrendingUp size={10} />
              Simulasi Cepat
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SCENARIOS.map((s) => (
                <button key={s.label}
                  onClick={() => handleIdr(s.idr.toString())}
                  className="p-3 rounded-xl border border-base-content/8 hover:border-primary/30 hover:bg-primary/6 transition-all text-left group">
                  <div className="text-xs font-semibold text-base-content/60 group-hover:text-base-content mb-1">{s.label}</div>
                  <div className="text-[10px] font-mono-code text-primary">
                    ≈ {(s.idr / btcIdr).toFixed(6)} BTC
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
