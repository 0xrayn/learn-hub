"use client";
import { useState } from "react";
import Image from "next/image";

const ARTICLES = [
  {
    id: 1, category: "Pemula", readTime: "5 mnt",
    title: "Apa Itu Bitcoin? Panduan Lengkap untuk Pemula",
    excerpt: "Bitcoin adalah mata uang digital pertama yang beroperasi tanpa bank sentral. Pelajari dasar-dasarnya di sini.",
    author: "Rizal Hakim", date: "18 Apr 2025",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600&q=80",
    catColor: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
  },
  {
    id: 2, category: "Teknologi", readTime: "8 mnt",
    title: "Memahami Blockchain: Teknologi di Balik Bitcoin",
    excerpt: "Blockchain adalah buku besar digital terdesentralisasi. Inilah cara kerja teknologi revolusioner ini.",
    author: "Sari Dewi", date: "16 Apr 2025",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
    catColor: "bg-cyan-400/15 text-cyan-400 border-cyan-400/20",
  },
  {
    id: 3, category: "Investasi", readTime: "6 mnt",
    title: "Dollar Cost Averaging (DCA) Bitcoin: Strategi Terbaik?",
    excerpt: "DCA adalah strategi investasi populer di kalangan HODLer Bitcoin. Cara menerapkannya dengan benar.",
    author: "Dimas Pratama", date: "14 Apr 2025",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
    catColor: "bg-amber-400/15 text-amber-400 border-amber-400/20",
  },
  {
    id: 4, category: "Keamanan", readTime: "7 mnt",
    title: "Cara Menyimpan Bitcoin dengan Aman: Hardware Wallet",
    excerpt: "Tidak semua wallet Bitcoin sama amannya. Pelajari cara terbaik melindungi aset kripto Anda.",
    author: "Andi Wijaya", date: "12 Apr 2025",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80",
    catColor: "bg-violet-400/15 text-violet-400 border-violet-400/20",
  },
  {
    id: 5, category: "Sejarah", readTime: "10 mnt",
    title: "Sejarah Bitcoin: Dari Whitepaper Satoshi ke $100K",
    excerpt: "Perjalanan Bitcoin dari anonimitas Satoshi Nakamoto hingga menjadi aset senilai triliunan dolar.",
    author: "Maya Santoso", date: "10 Apr 2025",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&q=80",
    catColor: "bg-orange-400/15 text-orange-400 border-orange-400/20",
  },
  {
    id: 6, category: "Mining", readTime: "9 mnt",
    title: "Bitcoin Mining: Cara Kerja dan Masih Menguntungkan?",
    excerpt: "Mining Bitcoin adalah proses validasi transaksi. Ketahui cara kerjanya dan apakah masih worth it di 2025.",
    author: "Fajar Nugroho", date: "8 Apr 2025",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=600&q=80",
    catColor: "bg-red-400/15 text-red-400 border-red-400/20",
  },
];

const CATS = ["Semua", "Pemula", "Teknologi", "Investasi", "Keamanan", "Sejarah", "Mining"];

export default function ArtikelSection() {
  const [cat, setCat] = useState("Semua");

  const filtered = cat === "Semua" ? ARTICLES : ARTICLES.filter(a => a.category === cat);

  return (
    <section id="artikel" className="py-24 px-4 reveal">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 glass px-3 py-1 rounded-full border border-cyan-400/20 mb-4">
            📝 Artikel Terbaru
          </div>
          <h2 className="font-black text-3xl sm:text-4xl text-white mb-3">
            Baca & <span className="text-cyan-400">Pelajari</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto">
            Artikel mendalam ditulis oleh pakar kripto Indonesia.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                cat === c
                  ? "bg-cyan-400/20 text-cyan-400 border border-cyan-400/40"
                  : "glass text-white/50 border border-transparent hover:border-white/10 hover:text-white/80"
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a, i) => (
            <article key={a.id}
              className="article-card grad-border overflow-hidden cursor-pointer group"
              style={{ animationDelay: `${i * 0.05}s` }}>

              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1120] via-[#0c1120]/30 to-transparent"/>
                {/* Category badge on image */}
                <div className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-lg border backdrop-blur-sm ${a.catColor}`}>
                  {a.category}
                </div>
                <div className="absolute top-3 right-3 text-xs text-white/60 glass px-2 py-1 rounded-lg">
                  {a.readTime} baca
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {a.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed line-clamp-2 mb-4">
                  {a.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400/40 to-cyan-400/40 flex items-center justify-center text-xs font-bold text-white">
                      {a.author[0]}
                    </div>
                    <span className="text-xs text-white/40">{a.author}</span>
                  </div>
                  <span className="text-xs text-white/30 font-mono-styled">{a.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="glass px-6 py-3 rounded-xl text-sm font-bold text-cyan-400 border border-cyan-400/30 hover:border-cyan-400/60 hover:bg-cyan-400/5 transition-all">
            Lihat Semua Artikel →
          </button>
        </div>
      </div>
    </section>
  );
}
