"use client";
import { useState } from "react";

const FAQS = [
  { q: "Apa itu Bitcoin dan mengapa nilainya bisa sangat tinggi?", a: "Bitcoin adalah mata uang digital pertama yang berjalan di jaringan terdesentralisasi tanpa bank atau pemerintah. Nilainya tinggi karena supply terbatas (hanya 21 juta BTC), permintaan global terus meningkat, dan kepercayaan komunitas sebagai 'digital gold' store of value." },
  { q: "Apakah Bitcoin legal di Indonesia?", a: "Bitcoin tidak diakui sebagai alat pembayaran di Indonesia, namun legal diperdagangkan sebagai aset komoditas digital. Bappebti mengawasi perdagangan kripto sejak 2019, dan banyak exchange terdaftar resmi seperti Indodax, Tokocrypto, dan Pintu." },
  { q: "Berapa modal minimal untuk beli Bitcoin di Indonesia?", a: "Di exchange Indonesia, kamu bisa mulai dengan modal minimal Rp 10.000 – Rp 50.000. Tidak perlu beli 1 BTC penuh — kamu bisa membeli satuan terkecilnya yaitu 1 Satoshi (0.00000001 BTC)." },
  { q: "Apa itu Bitcoin Halving dan dampaknya ke harga?", a: "Halving terjadi setiap ~4 tahun sekali: reward mining dipangkas 50%, mengurangi laju supply baru. Secara historis, selalu diikuti kenaikan harga signifikan dalam 12-18 bulan setelah event. Halving terakhir terjadi April 2024." },
  { q: "Bagaimana cara menyimpan Bitcoin dengan aman?", a: "Gunakan hardware wallet (cold storage) seperti Ledger atau Trezor untuk jumlah besar. Selalu backup seed phrase di tempat aman yang offline. Jangan pernah simpan seed phrase secara digital. Aktifkan 2FA di semua exchange." },
  { q: "Apakah Bitcoin bisa diretas atau dicuri?", a: "Jaringan Bitcoin sendiri belum pernah diretas karena keamanan kriptografinya. Namun BTC bisa dicuri jika kunci privat bocor, exchange diretas, atau korban phishing. Simpan di hardware wallet dan jaga seed phrase." },
  { q: "Apa bedanya Bitcoin dengan altcoin lainnya?", a: "Bitcoin adalah aset kripto tertua dan paling terpercaya, dengan dominasi pasar ~52%. Altcoin (ETH, BNB, SOL, dll) menawarkan fitur berbeda seperti smart contract, kecepatan transaksi lebih tinggi, atau biaya lebih murah. Bitcoin lebih fokus sebagai store of value." },
  { q: "Bagaimana cara kerja transaksi Bitcoin?", a: "Transaksi disiarkan ke seluruh node. Miner memvalidasi dan memasukkannya ke blok baru menggunakan Proof of Work. Setelah dikonfirmasi dalam 1-6 blok (~10-60 menit), transaksi bersifat final dan tidak bisa dibatalkan." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-4 reveal">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 glass px-3 py-1 rounded-full border border-emerald-400/20 mb-4">
            ❓ FAQ
          </div>
          <h2 className="font-black text-3xl sm:text-4xl text-white mb-3">
            Pertanyaan <span className="text-emerald-400">Umum</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto">
            Jawaban atas pertanyaan paling sering tentang Bitcoin dan kripto.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i}
              className={`grad-border transition-all duration-300 ${open === i ? "border border-emerald-400/30" : ""}`}>
              <button
                className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className={`font-semibold text-sm leading-snug transition-colors ${open === i ? "text-emerald-400" : "text-white/80"}`}>
                  {faq.q}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm transition-all duration-300 ${
                    open === i
                      ? "bg-emerald-400/20 text-emerald-400 rotate-180"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  ↓
                </div>
              </button>

              <div className={`faq-body ${open === i ? "open" : ""}`}>
                <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community CTA */}
        <div className="mt-10 p-8 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div className="text-4xl mb-3">💬</div>
          <h3 className="font-bold text-lg text-white mb-2">Masih ada pertanyaan?</h3>
          <p className="text-sm text-white/40 mb-5">Bergabung dengan komunitas LearnHub dan tanyakan ke member aktif kami.</p>
          <button className="px-6 py-3 rounded-xl text-sm font-bold text-emerald-400 transition-all hover:scale-105"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', boxShadow: '0 0 20px rgba(34,197,94,0.1)' }}>
            Gabung Komunitas →
          </button>
        </div>
      </div>
    </section>
  );
}
