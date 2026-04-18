"use client";
export default function Footer() {
  const y = new Date().getFullYear();
  const cols = {
    "Belajar":  ["Apa itu Bitcoin?","Blockchain 101","Cara Beli BTC","Wallet Aman","Analisis Chart"],
    "Tools":    ["Konverter BTC/IDR","Harga Realtime","Kalkulator Mining","Fear & Greed"],
    "LearnHub": ["Tentang Kami","Tim Penulis","Privasi","Syarat & Ketentuan"],
  };

  return (
    <footer style={{ background:"color-mix(in srgb, var(--bg-page,#050810) 95%, transparent)", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
      {/* Newsletter */}
      <div style={{ borderBottom:"1px solid color-mix(in srgb, var(--color-primary,#f59e0b) 10%, transparent)",
        background:"color-mix(in srgb, var(--color-primary,#f59e0b) 4%, transparent)" }}>
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 style={{ fontWeight:800, fontSize:18, color:"var(--text-main,#e8eaf0)" }}>📬 Newsletter Mingguan</h3>
            <p style={{ fontSize:13, color:"var(--text-main,#e8eaf0)", opacity:.4, marginTop:4 }}>Ringkasan berita Bitcoin terbaik setiap Senin pagi.</p>
          </div>
          <div style={{ display:"flex", gap:8, width:"100%", maxWidth:380 }}>
            <input type="email" placeholder="email@kamu.com"
              style={{ flex:1, padding:"10px 14px", borderRadius:10, fontSize:13, background:"rgba(255,255,255,0.05)",
                border:"1px solid rgba(255,255,255,0.1)", color:"var(--text-main,#e8eaf0)" }} />
            <button style={{ padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", color:"#000",
              background:"linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)", whiteSpace:"nowrap" }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg, var(--color-primary,#f59e0b), #f97316)",
                display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, color:"#000" }}>LH</div>
              <span style={{ fontWeight:900, fontSize:18, color:"var(--text-main,#e8eaf0)" }}>
                Learn<span style={{ color:"var(--color-primary,#f59e0b)" }}>Hub</span>
              </span>
            </div>
            <p style={{ fontSize:13, color:"var(--text-main,#e8eaf0)", opacity:.4, lineHeight:1.6, marginBottom:20 }}>
              Platform edukasi Bitcoin terpercaya untuk investor pemula hingga mahir Indonesia.
            </p>
            <div style={{ display:"flex", gap:8 }}>
              {["𝕏","✈","◉","▶"].map(s => (
                <a key={s} href="#" style={{ width:34, height:34, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:13, color:"var(--text-main,#e8eaf0)", opacity:.4, background:"rgba(255,255,255,0.05)",
                  border:"1px solid rgba(255,255,255,0.07)", textDecoration:"none", transition:"all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.color="var(--color-primary,#f59e0b)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity="0.4"; e.currentTarget.style.color="var(--text-main,#e8eaf0)"; }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(cols).map(([g, items]) => (
            <div key={g}>
              <h4 style={{ fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text-main,#e8eaf0)", opacity:.5, marginBottom:16 }}>{g}</h4>
              <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:9 }}>
                {items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ fontSize:13, color:"var(--text-main,#e8eaf0)", opacity:.35, textDecoration:"none", transition:"opacity .15s, color .15s" }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.opacity="1"; (e.target as HTMLElement).style.color="var(--color-primary,#f59e0b)"; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.opacity="0.35"; (e.target as HTMLElement).style.color="var(--text-main,#e8eaf0)"; }}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)", padding:"16px 0" }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono-styled"
          style={{ fontSize:11, color:"var(--text-main,#e8eaf0)", opacity:.3 }}>
          <span>© {y} LearnHub. Untuk komunitas Bitcoin Indonesia.</span>
          <div style={{ display:"flex", alignItems:"center", gap:6, opacity:.8, color:"#22c55e" }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#22c55e", display:"inline-block", animation:"ping 2s infinite" }} />
            Semua sistem aktif
          </div>
          <span>⚠️ Bukan saran investasi. DYOR.</span>
        </div>
      </div>
    </footer>
  );
}
