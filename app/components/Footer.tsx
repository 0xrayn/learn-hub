export default function Footer() {
  const y = new Date().getFullYear();
  const cols = {
    "Belajar":  ["Apa itu Bitcoin?","Blockchain 101","Cara Beli BTC","Wallet Aman","Analisis Chart"],
    "Tools":    ["Konverter BTC/IDR","Harga Realtime","Kalkulator Mining","Fear & Greed"],
    "LearnHub": ["Tentang Kami","Tim Penulis","Privasi","Syarat & Ketentuan"],
  };
  const socials = [
    { n: "X", i: "𝕏" }, { n: "TG", i: "✈" }, { n: "IG", i: "◉" }, { n: "YT", i: "▶" },
  ];

  return (
    <footer style={{ background: 'rgba(5,8,16,0.95)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Newsletter */}
      <div style={{ borderBottom: '1px solid rgba(245,158,11,0.1)', background: 'linear-gradient(135deg, rgba(245,158,11,0.04), transparent)' }}>
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-black text-lg text-white">📬 Newsletter Mingguan</h3>
            <p className="text-sm text-white/40 mt-1">Ringkasan berita Bitcoin terbaik setiap Senin pagi.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input type="email" placeholder="email@kamu.com"
              className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-amber-400/40" />
            <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-black"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>LH</div>
              <span className="font-black text-lg">Learn<span className="text-amber-400">Hub</span></span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-5">Platform edukasi Bitcoin terpercaya untuk investor pemula hingga mahir Indonesia.</p>
            <div className="flex gap-2">
              {socials.map(s => (
                <a key={s.n} href="#" title={s.n}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-sm text-white/40 hover:text-amber-400 hover:border-amber-400/30 transition-all border border-transparent">
                  {s.i}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(cols).map(([g, items]) => (
            <div key={g}>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white/60 mb-4">{g}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/30 hover:text-amber-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/25 font-mono-styled">
          <span>© {y} LearnHub. Untuk komunitas Bitcoin Indonesia.</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"/>
            </span>
            <span className="text-emerald-400">Semua sistem aktif</span>
          </div>
          <span>⚠️ Bukan saran investasi. DYOR.</span>
        </div>
      </div>
    </footer>
  );
}
