"use client";
import dynamic from "next/dynamic";
import { ArrowDown, Zap, Shield, TrendingUp, ChevronRight } from "lucide-react";

const BitcoinGlobe = dynamic(() => import("./BitcoinGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-red-500/30 border-t-red-500 animate-spin" />
    </div>
  ),
});

const STATS = [
  { icon: "₿", label: "Kripto #1", sub: "by market cap" },
  { icon: "🔗", label: "10+ Modul", sub: "materi gratis" },
  { icon: "⚡", label: "Real-time", sub: "harga live" },
];

export default function Hero() {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-100" />

      {/* Radial red glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(232,0,45,0.08) 0%, transparent 70%)" }} />

      {/* Top-right glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none animate-glow"
        style={{ background: "radial-gradient(circle, rgba(232,0,45,0.12) 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ---- TEXT SIDE ---- */}
          <div className="space-y-7 text-center lg:text-left animate-fadeInUp">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: "rgba(232,0,45,0.12)", border: "1px solid rgba(232,0,45,0.3)", color: "#ff4d6d" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Web3 Education Platform
            </div>

            {/* Heading */}
            <h1 style={{ fontFamily: "'Syne', sans-serif" }}
              className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight text-white">
              Kuasai{" "}
              <span className="gradient-text text-glow">Bitcoin</span>
              <br />
              <span className="text-white/90">dari Nol</span>{" "}
              <span className="text-white/40">sampai</span>{" "}
              <span className="text-white">Pro</span>
            </h1>

            {/* Sub */}
            <p className="text-base-content/60 text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
              Platform edukasi blockchain & kripto{" "}
              <span className="text-white/80 font-medium">terlengkap dalam Bahasa Indonesia</span>.
              Dari konsep dasar hingga analisis harga real-time.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <a href="#tentang"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm red-glow hover:scale-105 transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #e8002d, #ff4d6d)" }}>
                Mulai Belajar Sekarang
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#harga"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white/80 hover:text-white hover:bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-200">
                <TrendingUp size={16} style={{ color: "#e8002d" }} />
                Harga Live
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start pt-2">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-2.5">
                  <div className="text-xl">{s.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{s.label}</div>
                    <div className="text-xs text-white/40">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---- GLOBE SIDE ---- */}
          <div className="relative flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] rounded-full animate-glow"
              style={{ background: "radial-gradient(circle, rgba(232,0,45,0.12) 0%, transparent 65%)" }} />

            {/* Decorative circles */}
            <div className="absolute w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-red-500/10 animate-spin-slow" />
            <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-red-500/15 animate-counter-spin" />

            {/* Globe canvas container */}
            <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px]">
              <BitcoinGlobe />
            </div>

            {/* Floating info cards */}
            <div className="absolute top-6 -right-2 sm:right-4 glass-card px-3 py-2 rounded-xl animate-float"
              style={{ animationDelay: "0s" }}>
              <div className="text-xs text-white/50 font-mono">BTC/USD</div>
              <div className="text-sm font-bold" style={{ color: "#4ade80" }}>+2.34% ↑</div>
            </div>
            <div className="absolute bottom-12 -left-2 sm:left-4 glass-card px-3 py-2 rounded-xl animate-float"
              style={{ animationDelay: "1.5s" }}>
              <div className="text-xs text-white/50 font-mono">BLOCK HEIGHT</div>
              <div className="text-sm font-bold text-white/90">#893,241</div>
            </div>
            <div className="absolute bottom-4 right-4 sm:right-8 glass-card px-3 py-2 rounded-xl animate-float"
              style={{ animationDelay: "0.8s" }}>
              <div className="text-xs text-white/50">Nodes aktif</div>
              <div className="text-sm font-bold" style={{ color: "#e8002d" }}>17,429</div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 animate-bounce">
          <span className="text-xs font-mono tracking-widest uppercase">scroll</span>
          <ArrowDown size={14} />
        </div>
      </div>
    </section>
  );
}
