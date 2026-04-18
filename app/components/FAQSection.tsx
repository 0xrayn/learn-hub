"use client";
import { useState } from "react";

const FAQS = [
  { q: "Apa itu Bitcoin dan mengapa nilainya bisa sangat tinggi?", a: "Bitcoin adalah mata uang digital pertama yang berjalan di jaringan terdesentralisasi tanpa bank atau pemerintah. Nilainya tinggi karena supply terbatas (hanya 21 juta BTC), permintaan global terus meningkat, dan kepercayaan komunitas sebagai store of value 'digital gold'." },
  { q: "Apakah Bitcoin legal di Indonesia?", a: "Bitcoin tidak diakui sebagai alat pembayaran di Indonesia, namun legal diperdagangkan sebagai aset komoditas digital. Bappebti mengawasi perdagangan kripto sejak 2019, dan banyak exchange terdaftar resmi seperti Indodax, Tokocrypto, dan Pintu." },
  { q: "Berapa modal minimal untuk beli Bitcoin di Indonesia?", a: "Di exchange Indonesia, kamu bisa mulai dengan modal minimal Rp 10.000–50.000. Tidak perlu beli 1 BTC penuh — kamu bisa membeli satuan terkecilnya yaitu 1 Satoshi (0.00000001 BTC)." },
  { q: "Apa itu Bitcoin Halving dan dampaknya ke harga?", a: "Halving terjadi setiap ~4 tahun: reward mining dipangkas 50%, mengurangi laju supply baru. Secara historis selalu diikuti kenaikan harga signifikan dalam 12–18 bulan. Halving terakhir terjadi April 2024." },
  { q: "Bagaimana cara menyimpan Bitcoin dengan aman?", a: "Gunakan hardware wallet (cold storage) untuk jumlah besar. Backup seed phrase secara offline di tempat aman. Jangan simpan seed phrase digital. Aktifkan 2FA di semua exchange." },
  { q: "Apakah Bitcoin bisa diretas atau dicuri?", a: "Jaringan Bitcoin belum pernah diretas karena keamanan kriptografinya. Namun BTC bisa dicuri jika kunci privat bocor, exchange diretas, atau korban phishing. Simpan di hardware wallet dan jaga seed phrase." },
  { q: "Apa bedanya Bitcoin dengan altcoin lainnya?", a: "Bitcoin adalah aset kripto tertua dengan dominasi ~52%. Altcoin (ETH, BNB, SOL) menawarkan fitur berbeda seperti smart contract dan kecepatan lebih tinggi. Bitcoin lebih fokus sebagai store of value." },
  { q: "Bagaimana cara kerja transaksi Bitcoin?", a: "Transaksi disiarkan ke seluruh node, miner memvalidasi dan memasukkannya ke blok baru via Proof of Work. Setelah 1–6 konfirmasi (~10–60 menit), transaksi bersifat final dan tidak bisa dibatalkan." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 reveal">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold glass px-3 py-1 rounded-full border mb-4"
            style={{ color: "#22c55e", borderColor: "rgba(34,197,94,0.25)" }}>
            ❓ FAQ
          </div>
          <h2 className="font-black text-3xl sm:text-4xl mb-3" style={{ color: "var(--text-main,#e8eaf0)" }}>
            Pertanyaan <span style={{ color: "#22c55e" }}>Umum</span>
          </h2>
          <p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.45, maxWidth: 420, margin: "0 auto" }}>
            Jawaban atas pertanyaan paling sering tentang Bitcoin dan kripto.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQS.map((faq, i) => (
            <div key={i} className="grad-border" style={{
              border: open === i ? "1px solid rgba(34,197,94,0.25)" : undefined,
              transition: "border-color .2s",
            }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width:"100%", textAlign:"left", padding:"16px 20px", display:"flex", alignItems:"flex-start",
                  justifyContent:"space-between", gap:14, background:"none", border:"none", cursor:"pointer" }}
              >
                <span style={{ fontWeight:600, fontSize:14, lineHeight:1.5, color: open===i ? "#22c55e" : "var(--text-main,#e8eaf0)", opacity: open===i ? 1 : 0.85, transition:"color .2s" }}>
                  {faq.q}
                </span>
                <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13,
                  background: open===i ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                  color: open===i ? "#22c55e" : "var(--text-main,#e8eaf0)",
                  opacity: open===i ? 1 : 0.4,
                  transform: open===i ? "rotate(180deg)" : "none", transition:"all .3s" }}>↓</div>
              </button>

              <div className={`faq-body ${open === i ? "open" : ""}`}>
                <div style={{ padding:"0 20px 18px", fontSize:13, color:"var(--text-main,#e8eaf0)", opacity:.55, lineHeight:1.7,
                  borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:14 }}>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community CTA */}
        <div style={{ marginTop:40, padding:"32px 24px", borderRadius:20, textAlign:"center",
          background:"linear-gradient(135deg, rgba(34,197,94,0.07), rgba(6,182,212,0.04))",
          border:"1px solid rgba(34,197,94,0.18)" }}>
          <div style={{ fontSize:36, marginBottom:12 }}>💬</div>
          <h3 style={{ fontWeight:700, fontSize:18, color:"var(--text-main,#e8eaf0)", marginBottom:8 }}>Masih ada pertanyaan?</h3>
          <p style={{ fontSize:13, color:"var(--text-main,#e8eaf0)", opacity:.45, marginBottom:20 }}>
            Bergabung dengan komunitas LearnHub dan tanyakan ke member aktif kami.
          </p>
          <button style={{ padding:"12px 28px", borderRadius:12, fontSize:13, fontWeight:700, cursor:"pointer",
            background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.28)", color:"#22c55e",
            transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.05)"; e.currentTarget.style.background="rgba(34,197,94,0.18)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.background="rgba(34,197,94,0.1)"; }}>
            Gabung Komunitas →
          </button>
        </div>
      </div>
    </section>
  );
}
