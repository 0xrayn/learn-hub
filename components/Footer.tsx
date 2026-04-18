import { BookOpen, Github, Twitter, ExternalLink, Heart } from "lucide-react";

const NAV = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Bitcoin" },
  { href: "#artikel", label: "Artikel" },
  { href: "#harga", label: "Live Price" },
  { href: "#kalkulator", label: "Kalkulator" },
  { href: "#faq", label: "FAQ" },
];

const RESOURCES = [
  { label: "Bitcoin Whitepaper", href: "https://bitcoin.org/bitcoin.pdf" },
  { label: "CoinGecko API", href: "https://coingecko.com" },
  { label: "Mempool Explorer", href: "https://mempool.space" },
  { label: "Indodax Exchange", href: "https://indodax.com" },
  { label: "Tokocrypto", href: "https://tokocrypto.com" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-base-content/8 overflow-hidden">
      <div className="absolute inset-0 bg-base-200/50 pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, oklch(var(--p)/0.35), transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#beranda" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center glow-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg, oklch(var(--p)), oklch(var(--s)))" }}>
                <BookOpen size={15} className="text-primary-content" />
              </div>
              <span className="font-display font-bold text-lg text-base-content">
                Learn<span className="text-gradient-static">Hub</span>
              </span>
            </a>
            <p className="text-sm text-base-content/40 leading-relaxed mb-5 max-w-xs">
              Platform edukasi Bitcoin & Blockchain terlengkap dalam Bahasa Indonesia. Gratis, transparan, selalu diperbarui.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-base-content/7 flex items-center justify-center text-base-content/40 hover:text-base-content hover:bg-base-content/12 transition-all">
                <Github size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-base-content/7 flex items-center justify-center text-base-content/40 hover:text-base-content hover:bg-base-content/12 transition-all">
                <Twitter size={14} />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-[10px] font-mono-code font-bold uppercase tracking-[0.2em] text-base-content/25 mb-4">
              // Navigasi
            </h4>
            <ul className="space-y-2.5">
              {NAV.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-base-content/45 hover:text-base-content transition-colors font-medium">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-mono-code font-bold uppercase tracking-[0.2em] text-base-content/25 mb-4">
              // Resources
            </h4>
            <ul className="space-y-2.5">
              {RESOURCES.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-base-content/45 hover:text-base-content transition-colors font-medium flex items-center gap-1.5 group">
                    {l.label}
                    <ExternalLink size={10} className="text-base-content/20 group-hover:text-base-content/50 transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Join */}
          <div>
            <h4 className="text-[10px] font-mono-code font-bold uppercase tracking-[0.2em] text-base-content/25 mb-4">
              // Komunitas
            </h4>
            <p className="text-sm text-base-content/40 mb-4 leading-relaxed">
              Gabung ribuan pelajar Bitcoin Indonesia.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email kamu"
                className="input-glass px-4 py-2.5 text-sm text-base-content placeholder:text-base-content/25 w-full"
              />
              <button className="btn btn-primary btn-sm font-semibold rounded-xl w-full btn-glow">
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-base-content/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-mono-code text-base-content/22 tracking-wider flex items-center gap-1.5">
            © 2025 LearnHub — Dibuat dengan <Heart size={9} className="text-error inline" /> untuk edukasi. Bukan saran investasi.
          </p>
          <p className="text-[11px] font-mono-code text-base-content/18 tracking-wider">
            Next.js 15 · DaisyUI v5 · Three.js · TailwindCSS v4
          </p>
        </div>
      </div>
    </footer>
  );
}
