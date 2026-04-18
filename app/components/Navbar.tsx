"use client";
import { useState, useEffect } from "react";

const themes = [
  { name: "dark",   label: "Dark",   icon: "🌑", desc: "Luxury Dark" },
  { name: "light",  label: "Light",  icon: "☀️", desc: "Clean Light" },
  { name: "forest", label: "Forest", icon: "🌿", desc: "Deep Forest" },
  { name: "retro",  label: "Retro",  icon: "📻", desc: "Vintage Retro" },
];

const navLinks = [
  { href: "#harga",     label: "Harga BTC" },
  { href: "#artikel",   label: "Artikel" },
  { href: "#edukasi",   label: "Edukasi" },
  { href: "#konverter", label: "Konverter" },
  { href: "#faq",       label: "FAQ" },
];

export default function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest("[data-dropdown]")) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const changeTheme = (t: string) => {
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("learnhub-theme", t);
    setDropOpen(false);
    setMenuOpen(false);
  };

  const accentColor = {
    dark: "#f59e0b", light: "#d97706", forest: "#22c55e", retro: "#fb923c",
  }[theme] ?? "#f59e0b";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "var(--bg-card, rgba(5,8,16,0.85))" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        boxShadow: "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

        {/* Logo */}
        <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${accentColor}, #f97316)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 13, color: "#000",
          }}>LH</div>
          <div>
            <span style={{ fontWeight: 900, fontSize: 18, color: "var(--text-main, #e8eaf0)" }}>
              Learn<span style={{ color: accentColor }}>Hub</span>
            </span>
            <div style={{ fontSize: 10, color: "rgba(200,200,200,0.35)", fontFamily: "monospace", lineHeight: 1.2 }}>
              Bitcoin Academy
            </div>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} style={{
              padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 500,
              color: "var(--text-main, #e8eaf0)", opacity: 0.65,
              textDecoration: "none", transition: "opacity .2s, background .2s",
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.background = `${accentColor}12`; (e.target as HTMLElement).style.color = accentColor; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "0.65"; (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "var(--text-main, #e8eaf0)"; }}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Live badge */}
          <div className="hidden sm:flex items-center gap-2"
            style={{ padding: "4px 10px", borderRadius: 999, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontSize: 11, color: "#22c55e", fontFamily: "monospace" }}>
            <span style={{ position: "relative", display: "inline-flex" }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#22c55e", opacity: 0.7, animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", position: "relative" }} />
            </span>
            LIVE
          </div>

          {/* Theme switcher */}
          <div style={{ position: "relative" }} data-dropdown>
            <button
              onClick={() => setDropOpen(!dropOpen)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                borderRadius: 10, background: "transparent",
                border: `1px solid ${accentColor}30`,
                color: accentColor, fontSize: 12, fontWeight: 600, cursor: "pointer",
                transition: "background .2s, border-color .2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${accentColor}10`)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span>{themes.find(t => t.name === theme)?.icon}</span>
              <span className="hidden sm:inline">Tema</span>
              <span style={{ fontSize: 8, opacity: 0.6 }}>▼</span>
            </button>

            {dropOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0, width: 200,
                background: "var(--bg-card, rgba(12,17,32,0.97))", backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14,
                padding: 6, zIndex: 100, boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}>
                {themes.map(t => (
                  <button key={t.name} onClick={() => changeTheme(t.name)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%",
                      padding: "8px 10px", borderRadius: 10, cursor: "pointer",
                      background: theme === t.name ? `${accentColor}15` : "transparent",
                      border: "none", color: theme === t.name ? accentColor : "var(--text-main, #e8eaf0)",
                      opacity: theme === t.name ? 1 : 0.6, fontSize: 13, fontWeight: 600,
                      transition: "all .15s",
                    }}
                    onMouseEnter={e => { if (theme !== t.name) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.opacity = "1"; } }}
                    onMouseLeave={e => { if (theme !== t.name) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.opacity = "0.6"; } }}
                  >
                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div>{t.label}</div>
                      <div style={{ fontSize: 10, opacity: 0.5, fontWeight: 400 }}>{t.desc}</div>
                    </div>
                    {theme === t.name && <span style={{ marginLeft: "auto", fontSize: 12 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              width: 32, height: 32, padding: "7px 6px", borderRadius: 8,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer",
            }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", height: 2, background: "var(--text-main, #e8eaf0)", borderRadius: 2,
                transition: "all .3s",
                transform: menuOpen
                  ? i === 0 ? "rotate(45deg) translate(4px, 4px)" : i === 2 ? "rotate(-45deg) translate(4px, -4px)" : "none"
                  : "none",
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div style={{
        maxHeight: menuOpen ? 320 : 0, overflow: "hidden",
        transition: "max-height .35s cubic-bezier(.16,1,.3,1)",
        background: "var(--bg-card, rgba(5,8,16,0.97))",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}>
        <div style={{ padding: "8px 16px 16px" }}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              style={{
                display: "block", padding: "12px 14px", borderRadius: 10,
                color: "var(--text-main, #e8eaf0)", opacity: 0.7, fontSize: 14, fontWeight: 500,
                textDecoration: "none", transition: "all .2s",
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.opacity = "1"; (e.target as HTMLElement).style.background = `${accentColor}10`; (e.target as HTMLElement).style.color = accentColor; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.opacity = "0.7"; (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "var(--text-main, #e8eaf0)"; }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ping keyframe — injected once
if (typeof document !== "undefined") {
  const styleId = "ping-keyframe";
  if (!document.getElementById(styleId)) {
    const s = document.createElement("style");
    s.id = styleId;
    s.textContent = "@keyframes ping { 75%,100%{transform:scale(2);opacity:0} }";
    document.head.appendChild(s);
  }
}
