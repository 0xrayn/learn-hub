"use client";
import { useState } from "react";

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
    a: "Halving adalah event dimana reward miner dipotong 50% setiap ~4 tahun. Halving April 2024 mengurangi reward dari 6.25 BTC menjadi 3.125 BTC/blok. Secara historis, setiap halving selalu diikuti bull run besar dalam 12-18 bulan karena pasokan baru makin berkurang.",
  },
  {
    q: "Apakah Bitcoin aman untuk investasi?",
    a: "Teknologi blockchain Bitcoin sangat aman. Risiko terbesar bukan dari teknologinya, tapi dari: exchange yang tidak aman, phishing/hacking, kehilangan private key, atau scam. Gunakan exchange terpercaya, aktifkan 2FA, dan simpan aset di hardware wallet untuk keamanan optimal.",
  },
  {
    q: "Apa bedanya Bitcoin dengan altcoin?",
    a: "Bitcoin (BTC) adalah kripto pertama dan paling terdesentralisasi — sering disebut 'digital gold'. Altcoin adalah semua kripto selain Bitcoin (ETH, BNB, SOL, dll). Bitcoin punya supply paling terbatas dan keamanan paling teruji, tapi altcoin sering menawarkan fitur tambahan seperti smart contract.",
  },
  {
    q: "Bagaimana cara menyimpan Bitcoin dengan aman?",
    a: "Ada 3 cara utama: (1) Hot Wallet — di exchange atau apps, mudah tapi berisiko; (2) Software Wallet — Electrum / Trust Wallet, lebih aman; (3) Hardware Wallet — Ledger / Trezor, paling aman untuk jangka panjang. Prinsip utama: 'Not your keys, not your coins'.",
  },
  {
    q: "Bagaimana cara mulai beli Bitcoin?",
    a: "Langkah mudah: (1) Daftar di exchange resmi Indonesia seperti Indodax atau Tokocrypto; (2) Verifikasi KYC dengan KTP; (3) Deposit Rupiah via transfer bank; (4) Beli Bitcoin sesuai budget. Mulai kecil dulu, pelajari dulu sebelum invest besar.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-28 px-5 sm:px-8"
      style={{ background: "rgba(232,0,45,0.02)" }}>
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(232,0,45,0.06) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
            style={{ background: "rgba(232,0,45,0.1)", border: "1px solid rgba(232,0,45,0.25)", color: "#ff4d6d" }}>
            ❓ FAQ
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
            Pertanyaan yang Sering
            <span className="gradient-text"> Ditanya</span>
          </h2>
          <p className="text-white/50">Jawaban atas kebingungan paling umum tentang Bitcoin</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-2.5">
          {FAQS.map((faq, i) => (
            <div key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: open === i ? "rgba(232,0,45,0.07)" : "rgba(255,255,255,0.03)",
                border: open === i ? "1px solid rgba(232,0,45,0.3)" : "1px solid rgba(255,255,255,0.07)",
              }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-xs font-black font-mono w-5 text-center flex-shrink-0"
                    style={{ color: open === i ? "#e8002d" : "rgba(255,255,255,0.2)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`font-semibold text-sm sm:text-base transition-colors ${
                    open === i ? "text-white" : "text-white/70"
                  }`}>{faq.q}</span>
                </div>
                <span className={`text-xl font-bold flex-shrink-0 transition-all duration-300 ${
                  open === i ? "rotate-45" : ""
                }`} style={{ color: open === i ? "#e8002d" : "rgba(255,255,255,0.3)" }}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 sm:px-6 pb-5 pl-16 sm:pl-[4.5rem]">
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
