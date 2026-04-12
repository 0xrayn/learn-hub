import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t px-5 sm:px-8 py-14"
      style={{ background: "#050508", borderColor: "rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #e8002d, #ff4d6d)" }}>
                <BookOpen size={18} className="text-white" />
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif" }}
                className="text-xl font-black text-white">
                Learn<span style={{ background: "linear-gradient(135deg,#e8002d,#ff4d6d)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Hub</span>
              </span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Platform edukasi Bitcoin & Blockchain terlengkap dalam Bahasa Indonesia. Gratis, transparan, selalu diperbarui.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Navigasi</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {["Beranda", "Apa itu Bitcoin?", "Harga Live", "Kalkulator", "FAQ"].map(l => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                    className="hover:text-white transition-colors hover:pl-1.5 transition-all duration-200 block">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Resource</h4>
            <ul className="space-y-2.5 text-sm text-white/50">
              {[
                { label: "Bitcoin Whitepaper", href: "https://bitcoin.org/bitcoin.pdf" },
                { label: "CoinGecko API", href: "https://coingecko.com" },
                { label: "Mempool Explorer", href: "https://mempool.space" },
                { label: "Indodax Exchange", href: "https://indodax.com" },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5 group">
                    {l.label}
                    <span className="text-[10px] text-white/20 group-hover:text-white/60 transition-colors">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <p className="text-xs text-white/25 font-mono">
            © 2025 LearnHub — Untuk tujuan edukasi. Bukan saran investasi.
          </p>
          <p className="text-xs text-white/20 font-mono">
            Next.js 15 · DaisyUI · Three.js · TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  );
}
