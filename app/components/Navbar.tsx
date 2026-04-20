"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const themes = [
  { name: "dark",   label: "Dark",   icon: "🌑", desc: "Luxury Dark" },
  { name: "light",  label: "Light",  icon: "☀️", desc: "Clean Light" },
  { name: "forest", label: "Forest", icon: "🌿", desc: "Deep Forest" },
  { name: "retro",  label: "Retro",  icon: "📻", desc: "Vintage Retro" },
];

const navLinks = [
  { href: "/#harga",     label: "Harga BTC" },
  { href: "/artikel",    label: "Artikel" },
  { href: "/edukasi",    label: "Edukasi" },
  { href: "/#konverter", label: "Konverter" },
  { href: "/#faq",       label: "FAQ" },
];

export default function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("learnhub-theme") || "dark";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);

    // Detect mobile/tablet
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const accent = { dark: "#f59e0b", light: "#d97706", forest: "#22c55e", retro: "#fb923c" }[theme] ?? "#f59e0b";

  const navBg = scrolled
    ? `color-mix(in srgb, var(--bg-page,#050810) 88%, transparent)`
    : "transparent";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: navBg,
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
      transition: "background .4s, backdrop-filter .4s, border-color .4s",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto", padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 56,
      }}>

        {/* ── Logo ── */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: `linear-gradient(135deg, ${accent}, #f97316)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: 13, color: "#000", flexShrink: 0,
          }}>LH</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 17, color: "var(--text-main,#e8eaf0)", lineHeight: 1.1 }}>
              Learn<span style={{ color: accent }}>Hub</span>
            </div>
            <div style={{ fontSize: 9, color: "var(--text-main,#e8eaf0)", opacity: 0.3, fontFamily: "monospace", lineHeight: 1 }}>
              Bitcoin Academy
            </div>
          </div>
        </Link>

        {/* ── Desktop nav links — only render when NOT mobile ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: "7px 13px", borderRadius: 9, fontSize: 13, fontWeight: 500,
                color: "var(--text-main,#e8eaf0)", opacity: 0.6,
                textDecoration: "none", transition: "all .2s", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.opacity = "1";
                el.style.background = `color-mix(in srgb, ${accent} 12%, transparent)`;
                el.style.color = accent;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.opacity = "0.6";
                el.style.background = "transparent";
                el.style.color = "var(--text-main,#e8eaf0)";
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* ── Right controls ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

          {/* Live badge — desktop only */}
          {!isMobile && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 999,
              background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
              fontSize: 11, color: "#22c55e", fontFamily: "monospace",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              LIVE
            </div>
          )}

          {/* Auth buttons — desktop only */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link href="/login" style={{
                padding: "6px 14px", borderRadius: 9, fontSize: 12, fontWeight: 700,
                color: "var(--text-main,#e8eaf0)", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", opacity: 0.7, transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = `color-mix(in srgb, ${accent} 40%, transparent)`; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                Masuk
              </Link>
              <Link href="/register" style={{
                padding: "6px 14px", borderRadius: 9, fontSize: 12, fontWeight: 700,
                color: "#000", textDecoration: "none",
                background: `linear-gradient(135deg, ${accent}, #f97316)`,
                transition: "opacity .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
                Daftar
              </Link>
            </div>
          )}

          {/* Theme dropdown */}
          <div style={{ position: "relative" }} data-dropdown>
            <button onClick={() => setDropOpen(!dropOpen)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 11px", borderRadius: 9,
              background: "transparent",
              border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`,
              color: accent, fontSize: 12, fontWeight: 600, cursor: "pointer",
              transition: "background .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = `color-mix(in srgb, ${accent} 10%, transparent)`; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              <span style={{ fontSize: 14 }}>{themes.find(t => t.name === theme)?.icon}</span>
              {!isMobile && <span style={{ whiteSpace: "nowrap" }}>Tema</span>}
              <span style={{ fontSize: 8, opacity: 0.5 }}>▼</span>
            </button>

            {dropOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0, width: 190,
                background: `color-mix(in srgb, var(--bg-page,#050810) 95%, transparent)`,
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 13,
                padding: 5, zIndex: 100, boxShadow: "0 24px 56px rgba(0,0,0,0.55)",
              }}>
                {themes.map(t => (
                  <button key={t.name} onClick={() => changeTheme(t.name)} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "8px 10px", borderRadius: 9, cursor: "pointer",
                    background: theme === t.name ? `color-mix(in srgb, ${accent} 13%, transparent)` : "transparent",
                    border: "none", color: theme === t.name ? accent : "var(--text-main,#e8eaf0)",
                    opacity: theme === t.name ? 1 : 0.6, fontSize: 13, fontWeight: 600,
                    transition: "all .15s", textAlign: "left",
                  }}
                  onMouseEnter={e => { if (theme !== t.name) { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}}
                  onMouseLeave={e => { if (theme !== t.name) { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.background = "transparent"; }}}>
                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                    <div>
                      <div>{t.label}</div>
                      <div style={{ fontSize: 10, opacity: 0.45, fontWeight: 400 }}>{t.desc}</div>
                    </div>
                    {theme === t.name && <span style={{ marginLeft: "auto", fontSize: 11 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hamburger — ONLY on mobile/tablet */}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              width: 34, height: 34, padding: "8px 7px", borderRadius: 8,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer", flexShrink: 0,
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block", height: 2, background: "var(--text-main,#e8eaf0)",
                  borderRadius: 2, transition: "all .3s",
                  transform: menuOpen
                    ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                    : i === 2 ? "rotate(-45deg) translate(4px, -4px)"
                    : "none"
                    : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          )}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMobile && (
        <div style={{
          maxHeight: menuOpen ? 420 : 0, overflow: "hidden",
          transition: "max-height .35s cubic-bezier(.16,1,.3,1)",
          background: `color-mix(in srgb, var(--bg-page,#050810) 97%, transparent)`,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}>
          <div style={{ padding: "8px 16px 16px" }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                display: "block", padding: "12px 14px", borderRadius: 10,
                color: "var(--text-main,#e8eaf0)", opacity: 0.7, fontSize: 14, fontWeight: 500,
                textDecoration: "none", transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = `color-mix(in srgb, ${accent} 10%, transparent)`; e.currentTarget.style.color = accent; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-main,#e8eaf0)"; }}>
                {link.label}
              </Link>
            ))}
            {/* Auth in mobile menu */}
            <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                flex: 1, padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                textAlign: "center", textDecoration: "none",
                color: "var(--text-main,#e8eaf0)", border: "1px solid rgba(255,255,255,0.1)",
              }}>Masuk</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} style={{
                flex: 1, padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                textAlign: "center", textDecoration: "none",
                color: "#000", background: `linear-gradient(135deg, ${accent}, #f97316)`,
              }}>Daftar Gratis</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
