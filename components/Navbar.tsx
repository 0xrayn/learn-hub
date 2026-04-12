"use client";
import { useState, useEffect } from "react";
import { BookOpen, Palette, Menu, X, Zap } from "lucide-react";

const THEMES = [
  { id: "black", label: "Web3 Dark", emoji: "🔴" },
  { id: "luxury", label: "Luxury", emoji: "✨" },
  { id: "dark", label: "Dark", emoji: "🌙" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "🤖" },
  { id: "synthwave", label: "Synthwave", emoji: "🎶" },
  { id: "halloween", label: "Halloween", emoji: "🎃" },
  { id: "forest", label: "Forest", emoji: "🌲" },
  { id: "dracula", label: "Dracula", emoji: "🧛" },
  { id: "night", label: "Night", emoji: "🌃" },
  { id: "dim", label: "Dim", emoji: "🔆" },
];

const NAV_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Bitcoin" },
  { href: "#harga", label: "Harga Live" },
  { href: "#kalkulator", label: "Kalkulator" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [theme, setTheme] = useState("black");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("learnnhub-theme") || "black";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeTheme = (t: string) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("learnnhub-theme", t);
  };

  return (
    <>
      {/* Top accent bar — uses DaisyUI primary */}
      <div
        className="fixed top-0 left-0 right-0 h-0.5 z-[60]"
        style={{ background: "linear-gradient(90deg, transparent, oklch(var(--p)), oklch(var(--pf)), oklch(var(--p)), transparent)" }}
      />

      <nav
        className={`fixed top-0.5 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-base-100/80 backdrop-blur-xl border-b border-base-content/5 shadow-2xl" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">

          {/* Logo */}
          <a href="#beranda" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center red-glow-sm"
                style={{ background: "linear-gradient(135deg, oklch(var(--p)), oklch(var(--pf)))" }}
              >
                <BookOpen size={18} className="text-primary-content" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse border-2 border-base-100" />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif" }} className="text-xl font-black tracking-tight text-base-content">
              Learn<span className="gradient-text">Hub</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-base-content/60 hover:text-base-content hover:bg-base-content/5 transition-all duration-200 relative group"
                >
                  {l.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-primary group-hover:w-4 transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* Theme switcher */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm gap-1.5 border border-base-content/10 hover:border-primary/30 hover:bg-primary/10 transition-all"
              >
                <Palette size={14} className="text-primary" />
                <span className="hidden sm:inline text-xs font-medium">Tema</span>
              </div>
              <div
                tabIndex={0}
                className="dropdown-content z-[100] p-3 mt-3 w-56 rounded-2xl border border-base-content/10 bg-base-200"
              >
                <p className="text-[10px] font-bold text-base-content/30 px-2 pb-2 uppercase tracking-[0.15em]">
                  Pilih Tema
                </p>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => changeTheme(t.id)}
                    className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                      theme === t.id ? "text-primary-content font-semibold" : "text-base-content/60 hover:text-base-content hover:bg-base-content/5"
                    }`}
                    style={
                      theme === t.id
                        ? { background: "oklch(var(--p)/0.2)", border: "1px solid oklch(var(--p)/0.3)" }
                        : {}
                    }
                  >
                    <span className="text-base">{t.emoji}</span>
                    <span>{t.label}</span>
                    {theme === t.id && <Zap size={12} className="ml-auto text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <a
              href="#tentang"
              className="hidden sm:flex btn btn-sm font-semibold text-primary-content border-0 red-glow-sm hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, oklch(var(--p)), oklch(var(--pf)))" }}
            >
              Mulai Belajar
            </a>

            {/* Mobile menu */}
            <button className="btn btn-ghost btn-sm md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-base-content/5 px-5 py-4 flex flex-col gap-1 bg-base-100/97 backdrop-blur-xl">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-content/5 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#tentang"
              onClick={() => setMenuOpen(false)}
              className="mt-2 btn btn-sm text-primary-content border-0"
              style={{ background: "linear-gradient(135deg, oklch(var(--p)), oklch(var(--pf)))" }}
            >
              Mulai Belajar
            </a>
          </div>
        )}
      </nav>
    </>
  );
}
