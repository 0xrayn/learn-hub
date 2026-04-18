"use client";
import dynamic from "next/dynamic";
import { Zap, Shield, Globe, ArrowRight, TrendingUp } from "lucide-react";

const BitcoinGlobe = dynamic(() => import("./BitcoinGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-primary/60 animate-spin" />
        <div className="absolute inset-5 rounded-full bg-primary/20" />
      </div>
    </div>
  ),
});

const STATS = [
  { value: "21M", label: "Max Supply", icon: Shield, color: "text-primary" },
  { value: "10+", label: "Modul Gratis", icon: Globe, color: "text-secondary" },
  { value: "Live", label: "Harga Real-time", icon: Zap, color: "text-accent" },
];

const TICKER_ITEMS = [
  "₿ Bitcoin", "⛓ Blockchain", "⚡ Lightning", "🔐 Cryptography",
  "📦 Mining", "🌐 DeFi", "💎 HODL", "🗝 Wallets", "📊 TA", "🏛 ETF",
  "₿ Bitcoin", "⛓ Blockchain", "⚡ Lightning", "🔐 Cryptography",
  "📦 Mining", "🌐 DeFi", "💎 HODL", "🗝 Wallets", "📊 TA", "🏛 ETF",
];

const FEATURED_POSTS = [
  { tag: "Pemula", title: "Apa itu Bitcoin?", time: "5 mnt" },
  { tag: "DeFi", title: "Cara Kerja Blockchain", time: "8 mnt" },
  { tag: "Mining", title: "Halving 2024", time: "6 mnt" },
];

export default function Hero() {
  return (
    <section id="beranda" className="relative min-h-screen flex flex-col items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Orbs */}
      <div className="absolute top-1/4 left-1/5 w-[600px] h-[600px] rounded-full pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle, oklch(var(--p)/0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-1/3 right-1/5 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, oklch(var(--s)/0.1) 0%, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, oklch(var(--a)/0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-20 flex-1 flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Text column */}
          <div className="space-y-7 text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex opacity-0 animate-fade-in-left justify-center lg:justify-start w-full"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              <span className="pill">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Web3 Education Platform
              </span>
            </div>

            {/* Heading */}
            <div className="opacity-0 animate-fade-in-left" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <h1 className="font-display" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.06, fontWeight: 900, letterSpacing: "-0.02em" }}>
                Kuasai{" "}
                <span className="text-gradient italic">Bitcoin</span>
                <br />
                <span className="text-base-content/75 font-semibold" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}>
                  dari Nol ke Pro
                </span>
              </h1>
              <p className="mt-5 text-base-content/55 text-base sm:text-lg leading-relaxed max-w-[500px] mx-auto lg:mx-0">
                Platform edukasi blockchain & kripto terlengkap dalam Bahasa Indonesia.{" "}
                <span className="text-base-content/80 font-semibold">Gratis selamanya.</span>
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start opacity-0 animate-fade-in-left"
              style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}>
              <a href="#artikel" className="btn btn-primary gap-2 font-semibold tracking-wide btn-glow rounded-xl px-6">
                <Zap size={15} />
                Mulai Belajar
              </a>
              <a href="#harga" className="btn btn-ghost gap-2 border border-base-content/12 hover:border-primary/30 hover:bg-primary/6 font-medium rounded-xl">
                Live Price
                <ArrowRight size={14} />
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start opacity-0 animate-fade-in-left"
              style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}>
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-base-content/6 flex items-center justify-center">
                    <s.icon size={15} className={s.color} />
                  </div>
                  <div>
                    <div className="font-display font-black text-xl text-base-content leading-none">{s.value}</div>
                    <div className="text-[11px] font-mono-code text-base-content/40 mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini blog preview */}
            <div className="opacity-0 animate-fade-in-left" style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}>
              <p className="text-[10px] font-mono-code uppercase tracking-[0.18em] text-base-content/30 mb-3 text-center lg:text-left">
                // Artikel Terbaru
              </p>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2">
                {FEATURED_POSTS.map((post, i) => (
                  <a key={i} href="#artikel"
                    className="flex items-center gap-3 glass-static px-3.5 py-2.5 hover:border-primary/30 hover:bg-base-content/5 transition-all duration-200 cursor-pointer flex-1">
                    <TrendingUp size={12} className="text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-base-content/75 truncate">{post.title}</div>
                      <div className="text-[10px] font-mono-code text-base-content/35">{post.tag} · {post.time}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Globe column */}
          <div className="relative flex items-center justify-center opacity-0 animate-scale-in order-1 lg:order-2"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
            {/* Rings */}
            <div className="absolute w-[400px] h-[400px] sm:w-[520px] sm:h-[520px] rounded-full border border-primary/8 animate-spin-slow pointer-events-none" />
            <div className="absolute w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] rounded-full border border-secondary/6 animate-counter-spin pointer-events-none" />
            <div className="absolute w-[460px] h-[460px] sm:w-[580px] sm:h-[580px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, oklch(var(--p)/0.06) 0%, transparent 65%)" }} />

            {/* Globe */}
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[460px] lg:h-[460px]">
              <BitcoinGlobe />
            </div>

            {/* Floating cards */}
            <div className="absolute top-4 right-0 sm:-right-4 glass-static px-4 py-3 animate-float shadow-xl">
              <div className="text-[9px] font-mono-code uppercase tracking-[0.15em] text-base-content/40 mb-1">BTC / USD</div>
              <div className="text-sm font-display font-bold text-success">+2.34% ↑</div>
              <div className="text-xs font-mono-code text-base-content/60">$83,420</div>
            </div>

            <div className="absolute bottom-12 left-0 sm:-left-6 glass-static px-4 py-3 animate-float-delay shadow-xl">
              <div className="text-[9px] font-mono-code uppercase tracking-[0.15em] text-base-content/40 mb-1">Block Height</div>
              <div className="text-sm font-display font-bold text-base-content">#895,241</div>
            </div>

            <div className="absolute bottom-0 right-4 glass-static px-4 py-3 shadow-xl" style={{ animation: "float 7s ease-in-out 4s infinite" }}>
              <div className="text-[9px] font-mono-code uppercase tracking-[0.15em] text-base-content/40 mb-1">Active Nodes</div>
              <div className="text-sm font-display font-bold text-primary">17,429</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="w-full border-t border-base-content/6 bg-base-content/3 backdrop-blur-sm overflow-hidden py-3.5 flex-shrink-0">
        <div className="flex animate-marquee">
          <div className="ticker-track flex-shrink-0">
            {TICKER_ITEMS.map((item, i) => (
              <span key={i} className="text-[11px] font-mono-code font-medium text-base-content/30 uppercase tracking-[0.12em]">
                {item}
                <span className="ml-14 text-primary/25">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
