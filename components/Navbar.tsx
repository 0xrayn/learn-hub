"use client";
import { useState, useEffect } from "react";
import { BookOpen, Menu, X, Palette, Check } from "lucide-react";

const THEMES = [
  { id: "night", label: "Night", desc: "Dark Indigo", dot: "#818cf8", bg: "#1e1e2e" },
  { id: "dim",   label: "Dim",   desc: "Soft Slate",  dot: "#6c8ebf", bg: "#2a323c" },
  { id: "forest",label: "Forest",desc: "Deep Green",  dot: "#1eb854", bg: "#1a1a1a" },
  { id: "lofi",  label: "Lo-Fi", desc: "Clean Minimal",dot: "#0d0d0d", bg: "#f8f4ed" },
];

const NAV_LINKS = [
  { href: "#beranda",    label: "Beranda" },
  { href: "#tentang",    label: "Bitcoin" },
  { href: "#artikel",    label: "Artikel" },
  { href: "#harga",      label: "Live Price" },
  { href: "#kalkulator", label: "Kalkulator" },
  { href: "#faq",        label: "FAQ" },
];

export default function Navbar() {
  const [theme, setTheme] = useState("night");
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lh-theme") || "night";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const changeTheme = (t: string) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("lh-theme", t);
    setThemeOpen(false);
  };

  const active = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "navbar-glass" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#beranda" className="flex items-center gap-2.5 select-none">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden glow-sm" style={{background: "linear-gradient(135deg, oklch(var(--p)), oklch(var(--s)))"}}>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen size={16} className="text-primary-content" />
              </div>
            </div>
            <span className="font-display font-bold text-lg text-base-content">
              Learn<span className="text-gradient-static">Hub</span>
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="px-3.5 py-2 rounded-lg text-sm font-medium text-base-content/55 hover:text-base-content hover:bg-base-content/6 transition-all">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button onClick={() => setThemeOpen(!themeOpen)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-base-content/10 bg-base-content/5 hover:bg-base-content/10 transition-all">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: active.dot }} />
                <span className="text-xs font-mono-code font-bold text-base-content/55 hidden sm:block">{active.label}</span>
                <Palette size={11} className="text-base-content/35 hidden sm:block" />
              </button>
              {themeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setThemeOpen(false)} />
                  <div className="absolute right-0 top-full mt-2.5 z-50 animate-slide-down">
                    <div className="glass-static p-2.5 w-56 shadow-2xl">
                      <p className="text-[9px] font-mono-code font-bold uppercase tracking-[0.18em] text-base-content/30 px-2.5 py-1.5">Pilih Tema</p>
                      <div className="space-y-1">
                        {THEMES.map((t) => (
                          <button key={t.id} onClick={() => changeTheme(t.id)}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all text-left ${theme === t.id ? "glass-active" : "hover:bg-base-content/6"}`}>
                            <div className="w-4 h-4 rounded-full flex-shrink-0 border border-base-content/10 overflow-hidden" style={{ background: t.bg }}>
                              <div className="w-2 h-2 rounded-full m-[3px]" style={{ background: t.dot }} />
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold text-sm ${theme === t.id ? "text-base-content" : "text-base-content/70"}`}>{t.label}</div>
                              <div className="text-[10px] font-mono-code text-base-content/35">{t.desc}</div>
                            </div>
                            {theme === t.id && <Check size={13} className="text-primary flex-shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <a href="#artikel" className="hidden md:flex btn btn-primary btn-sm btn-glow font-semibold rounded-xl">Mulai Belajar</a>
            <button className="btn btn-ghost btn-sm lg:hidden text-base-content/60" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden navbar-glass border-t border-base-content/8 px-4 py-4 flex flex-col gap-1 animate-slide-down">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-base-content/70 hover:text-base-content hover:bg-base-content/7 transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#artikel" onClick={() => setMenuOpen(false)} className="mt-2 btn btn-primary btn-sm font-semibold rounded-xl">Mulai Belajar</a>
          </div>
        )}
      </nav>
    </>
  );
}
