"use client";
import { useState, useEffect } from "react";

const themes = [
  { name: "dark",   label: "Dark",   icon: "🌑", desc: "Luxury Dark" },
  { name: "light",  label: "Light",  icon: "☀️", desc: "Clean Light" },
  { name: "forest", label: "Forest", icon: "🌿", desc: "Deep Forest" },
  { name: "retro",  label: "Retro",  icon: "📻", desc: "Vintage Retro" },
];

const navLinks = [
  { href: "#harga",     label: "Harga BTC",   icon: "📊" },
  { href: "#artikel",   label: "Artikel",     icon: "📝" },
  { href: "#edukasi",   label: "Edukasi",     icon: "🎓" },
  { href: "#konverter", label: "Konverter",   icon: "💱" },
  { href: "#faq",       label: "FAQ",         icon: "❓" },
];

export default function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("learnhub-theme") || "dark";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const changeTheme = (t: string) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("learnhub-theme", t);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-white/5 py-2"
          : "bg-transparent py-4"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-sm group-hover:scale-110 transition-transform duration-300">
                LH
              </div>
              <div className="absolute inset-0 rounded-xl bg-amber-400/30 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="font-black text-lg leading-none">
                Learn<span className="text-amber-400">Hub</span>
              </span>
              <div className="text-[10px] text-white/30 font-mono-styled leading-none mt-0.5">Bitcoin Academy</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-amber-400 hover:bg-amber-400/8 transition-all duration-200 flex items-center gap-1.5"
              >
                <span className="text-xs">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs text-emerald-400 font-mono-styled">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"/>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"/>
              </span>
              LIVE
            </div>

            {/* Theme dropdown */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button"
                className="glass px-3 py-2 rounded-xl text-sm text-white/70 hover:text-amber-400 hover:border-amber-400/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                  <path strokeLinecap="round" strokeWidth="2" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
                <span className="hidden sm:inline text-xs">Tema</span>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[100] p-2 mt-2 w-48 glass rounded-xl border border-white/10 space-y-1 shadow-2xl">
                {themes.map((t) => (
                  <li key={t.name}>
                    <button
                      onClick={() => changeTheme(t.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        theme === t.name
                          ? "bg-amber-400/15 text-amber-400"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{t.icon}</span>
                      <div className="text-left">
                        <div className="font-semibold">{t.label}</div>
                        <div className="text-xs opacity-60">{t.desc}</div>
                      </div>
                      {theme === t.name && <span className="ml-auto text-amber-400">✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden glass p-2 rounded-xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 bg-white/80 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}/>
                <span className={`block h-0.5 bg-white/80 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}/>
                <span className={`block h-0.5 bg-white/80 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}/>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-400 ${menuOpen ? "max-h-80" : "max-h-0"}`}>
          <div className="glass border-t border-white/5 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-amber-400 hover:bg-amber-400/8 transition-all"
              >
                <span>{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
