"use client";
import { BookOpen, Clock, ArrowRight, TrendingUp, Star, Flame, ChevronRight } from "lucide-react";

const CATEGORIES = ["Semua", "Pemula", "Blockchain", "Mining", "DeFi", "Trading", "Security"];

const ARTICLES = [
  {
    category: "Pemula",
    tag: "Populer",
    title: "Apa itu Bitcoin? Panduan Lengkap untuk Pemula",
    excerpt: "Pelajari dasar-dasar Bitcoin: sejarah, cara kerja, mengapa ia berharga, dan bagaimana mulai memilikinya dengan aman.",
    readTime: "7 mnt",
    level: "Pemula",
    featured: true,
    gradient: "from-primary/20 via-primary/5 to-transparent",
    icon: "₿",
  },
  {
    category: "Blockchain",
    tag: "Baru",
    title: "Cara Kerja Blockchain: Panduan Visual",
    excerpt: "Memahami mekanisme di balik teknologi yang mengubah industri keuangan global.",
    readTime: "9 mnt",
    level: "Menengah",
    featured: true,
    gradient: "from-secondary/20 via-secondary/5 to-transparent",
    icon: "⛓",
  },
  {
    category: "Mining",
    tag: "Trending",
    title: "Bitcoin Halving 2024: Apa yang Terjadi?",
    excerpt: "Analisis mendalam tentang event halving, dampaknya pada harga, dan prediksi ke depan.",
    readTime: "8 mnt",
    level: "Menengah",
    featured: true,
    gradient: "from-accent/20 via-accent/5 to-transparent",
    icon: "⛏",
  },
  {
    category: "Security",
    tag: "Penting",
    title: "Cara Menyimpan Bitcoin dengan Aman",
    excerpt: "Hot wallet vs cold wallet, hardware wallet terbaik, dan tips keamanan kripto.",
    readTime: "6 mnt",
    level: "Pemula",
    featured: false,
    gradient: "from-success/20 via-success/5 to-transparent",
    icon: "🔐",
  },
  {
    category: "DeFi",
    tag: "Lanjutan",
    title: "Mengenal Lightning Network Bitcoin",
    excerpt: "Solusi layer-2 yang membuat Bitcoin bisa digunakan untuk pembayaran sehari-hari.",
    readTime: "10 mnt",
    level: "Lanjutan",
    featured: false,
    gradient: "from-warning/20 via-warning/5 to-transparent",
    icon: "⚡",
  },
  {
    category: "Trading",
    tag: "Populer",
    title: "Beli Bitcoin Pertama Kali di Indonesia",
    excerpt: "Panduan step-by-step: pilih exchange, verifikasi KYC, deposit, dan beli BTC dengan aman.",
    readTime: "5 mnt",
    level: "Pemula",
    featured: false,
    gradient: "from-info/20 via-info/5 to-transparent",
    icon: "🏦",
  },
];

const LEVEL_COLOR: Record<string, string> = {
  Pemula: "text-success",
  Menengah: "text-warning",
  Lanjutan: "text-error",
};

export default function BlogSection() {
  const featured = ARTICLES.filter((a) => a.featured);
  const grid = ARTICLES.filter((a) => !a.featured);

  return (
    <section id="artikel" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Bg decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{ background: "radial-gradient(circle, oklch(var(--s)/0.08) 0%, transparent 70%)", filter: "blur(100px)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, oklch(var(--p)/0.1) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="pill mb-5 inline-flex">
            <BookOpen size={10} />
            Blog & Edukasi
          </span>
          <h2 className="font-display font-black text-base-content mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}>
            Artikel <span className="text-gradient">Terpilih</span>
          </h2>
          <p className="text-base-content/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Konten berkualitas tinggi, ditulis dengan bahasa sederhana untuk semua level.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 justify-center flex-wrap mb-12">
          {CATEGORIES.map((cat, i) => (
            <button key={cat}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-mono-code uppercase tracking-wide transition-all duration-200 ${
                i === 0
                  ? "bg-primary text-primary-content shadow-lg"
                  : "bg-base-content/6 text-base-content/55 hover:bg-base-content/12 hover:text-base-content"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured 3-column */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {featured.map((article, i) => (
            <a key={i} href="#" className="blog-card card-shimmer group cursor-pointer block">
              {/* Top gradient strip */}
              <div className={`h-1.5 bg-gradient-to-r ${article.gradient} from-primary/60 to-secondary/40`} />

              <div className="p-6">
                {/* Icon + badge row */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: "oklch(var(--b3)/0.8)" }}>
                    {article.icon}
                  </div>
                  <div className="flex gap-2 items-center">
                    {article.tag === "Trending" && <Flame size={11} className="text-warning" />}
                    {article.tag === "Populer" && <Star size={11} className="text-primary" />}
                    {article.tag === "Baru" && <TrendingUp size={11} className="text-secondary" />}
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-base-content/40">
                      {article.tag}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className={`text-[10px] font-mono-code font-bold uppercase tracking-wider ${LEVEL_COLOR[article.level] || "text-primary"}`}>
                    {article.category}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base-content text-lg leading-snug mb-3 group-hover:text-primary transition-colors" style={{ letterSpacing: "-0.01em" }}>
                  {article.title}
                </h3>
                <p className="text-base-content/50 text-sm leading-relaxed mb-5 line-clamp-2">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-base-content/35">
                    <Clock size={11} />
                    <span className="text-[11px] font-mono-code">{article.readTime}</span>
                    <span className="mx-1 text-base-content/20">·</span>
                    <span className={`text-[11px] font-mono-code font-bold ${LEVEL_COLOR[article.level]}`}>{article.level}</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-base-content/6 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
                    <ArrowRight size={13} className="text-base-content/40 group-hover:text-primary" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* List-style grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {grid.map((article, i) => (
            <a key={i} href="#" className="flex items-start gap-4 glass-static p-4 hover:border-primary/25 hover:bg-base-content/4 transition-all duration-300 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: "oklch(var(--b3)/0.8)" }}>
                {article.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[9px] font-mono-code font-bold uppercase tracking-wider ${LEVEL_COLOR[article.level] || "text-primary"}`}>
                    {article.category}
                  </span>
                  <span className="text-base-content/20 text-[10px]">·</span>
                  <span className="text-[9px] font-mono-code text-base-content/35">{article.readTime}</span>
                </div>
                <h4 className="font-semibold text-sm text-base-content/80 leading-snug group-hover:text-base-content transition-colors mb-1">
                  {article.title}
                </h4>
                <p className="text-xs text-base-content/40 line-clamp-1">{article.excerpt}</p>
              </div>
              <ChevronRight size={14} className="text-base-content/20 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="#" className="inline-flex items-center gap-2.5 btn btn-outline btn-primary rounded-xl px-8 hover:btn-glow font-semibold">
            Lihat Semua Artikel
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
