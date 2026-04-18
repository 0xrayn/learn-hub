"use client";
import { useState } from "react";
import { HelpCircle, Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Apakah Bitcoin legal di Indonesia?",
    a: "Bitcoin tidak diakui sebagai alat pembayaran sah di Indonesia, namun diakui sebagai komoditas dan boleh diperdagangkan di platform yang terdaftar di Bappebti. Kamu boleh beli, jual, dan investasi Bitcoin melalui exchange resmi seperti Indodax, Tokocrypto, atau Pintu.",
  },
  {
    q: "Berapa minimal beli Bitcoin di Indonesia?",
    a: "Di exchange lokal seperti Indodax atau Tokocrypto, kamu bisa mulai membeli Bitcoin mulai dari Rp 50.000 saja. Kamu tidak perlu membeli 1 Bitcoin penuh — bisa beli satuan Satoshi (1 BTC = 100 juta Satoshi).",
  },
  {
    q: "Apa itu Bitcoin Halving dan kenapa penting?",
    a: "Halving adalah event dimana reward miner dipotong 50% setiap ~4 tahun. Halving April 2024 mengurangi reward dari 6.25 BTC menjadi 3.125 BTC/blok. Secara historis, setiap halving selalu diikuti bull run besar dalam 12-18 bulan.",
  },
  {
    q: "Apakah Bitcoin aman untuk investasi?",
    a: "Teknologi blockchain Bitcoin sangat aman. Risiko terbesar bukan dari teknologinya, tapi dari: exchange yang tidak aman, phishing/hacking, kehilangan private key, atau scam. Gunakan exchange terpercaya, aktifkan 2FA, dan simpan aset di hardware wallet.",
  },
  {
    q: "Apa bedanya Bitcoin dengan altcoin?",
    a: "Bitcoin (BTC) adalah kripto pertama dan paling terdesentralisasi — sering disebut 'digital gold'. Altcoin adalah semua kripto selain Bitcoin (ETH, BNB, SOL, dll). Bitcoin punya supply paling terbatas dan keamanan paling teruji.",
  },
  {
    q: "Bagaimana cara menyimpan Bitcoin dengan aman?",
    a: "Ada 3 cara: (1) Hot Wallet — di exchange, mudah tapi berisiko; (2) Software Wallet — Electrum/Trust Wallet, lebih aman; (3) Hardware Wallet — Ledger/Trezor, paling aman. Prinsip: 'Not your keys, not your coins'.",
  },
  {
    q: "Bagaimana cara mulai beli Bitcoin?",
    a: "Langkah: (1) Daftar di exchange resmi Indonesia seperti Indodax atau Tokocrypto; (2) Verifikasi KYC dengan KTP; (3) Deposit Rupiah via transfer bank; (4) Beli Bitcoin sesuai budget. Mulai kecil dulu.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-base-content/8 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, oklch(var(--p)/0.1) 0%, transparent 70%)", filter: "blur(100px)" }} />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="pill mb-5 inline-flex">
            <HelpCircle size={10} />
            FAQ
          </span>
          <h2 className="font-display font-black text-base-content mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}>
            Pertanyaan yang Sering{" "}
            <span className="text-gradient">Ditanya</span>
          </h2>
          <p className="text-base-content/50 max-w-md mx-auto text-base">
            Jawaban lengkap untuk pertanyaan umum seputar Bitcoin dan kripto.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-2.5">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <span className="text-[10px] font-mono-code font-bold text-base-content/25 pt-0.5 flex-shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-semibold text-sm sm:text-base text-base-content/80 leading-snug">
                    {faq.q}
                  </span>
                </div>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 mt-0.5 ${
                  open === i ? "bg-primary text-primary-content rotate-0" : "bg-base-content/8 text-base-content/40"
                }`}>
                  {open === i ? <Minus size={13} /> : <Plus size={13} />}
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-350 ease-in-out ${open === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-5 sm:px-6 pb-5 pt-0 flex gap-4">
                  <div className="w-6 flex-shrink-0" />
                  <p className="text-base-content/60 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="text-center mt-12">
          <div className="glass-static inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 max-w-lg mx-auto w-full">
            <div className="text-3xl">🤔</div>
            <div className="text-center sm:text-left">
              <div className="font-semibold text-base-content text-sm mb-1">Masih ada pertanyaan?</div>
              <div className="text-xs text-base-content/45">Baca artikel lengkap atau hubungi komunitas kami.</div>
            </div>
            <a href="#artikel" className="btn btn-primary btn-sm btn-glow rounded-xl font-semibold flex-shrink-0">
              Baca Artikel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
