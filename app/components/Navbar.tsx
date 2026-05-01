"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const themes = [
  { name: "dark",   label: "Dark",   icon: "🌑", desc: "Luxury Dark" },
  { name: "light",  label: "Light",  icon: "☀️", desc: "Clean Light" },
  { name: "forest", label: "Forest", icon: "🌿", desc: "Deep Forest" },
  { name: "retro",  label: "Retro",  icon: "📻", desc: "Vintage Retro" },
];

// Link definitions — href berubah tergantung halaman
// isAnchor: true → pakai href anchor saat di homepage, route saat di luar
const NAV_ITEMS = [
  { label: "Harga BTC",  anchorHref: "#harga",     routeHref: "/#harga"     },
  { label: "Artikel",    anchorHref: "#artikel",   routeHref: "/artikel"    },
  { label: "Edukasi",    anchorHref: "#edukasi",   routeHref: "/edukasi"    },
  { label: "Konverter",  anchorHref: "#konverter", routeHref: "/#konverter" },
  { label: "FAQ",        anchorHref: "#faq",       routeHref: "/#faq"       },
];

export default function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, role, signOut } = useAuth();

  // Apakah sedang di homepage
  const isHome = pathname === "/";

  useEffect(() => {
    const stored = localStorage.getItem("learnhub-theme") || "dark";
    setTheme(stored);
    document.documentElement.setAttribute("data-theme", stored);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest("[data-dropdown]")) setDropOpen(false);
      if (!target.closest("[data-user-dropdown]")) setUserDropOpen(false);
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

  const handleSignOut = async () => {
    await signOut();
    setUserDropOpen(false);
    router.push("/");
  };

  const accent = { dark: "#f59e0b", light: "#d97706", forest: "#22c55e", retro: "#fb923c" }[theme] ?? "#f59e0b";
  const navBg = scrolled ? `color-mix(in srgb, var(--bg-page,#050810) 88%, transparent)` : "transparent";

  // Resolve href per item berdasarkan pathname
  const getHref = (item: typeof NAV_ITEMS[0]) => {
    // Di homepage: SEMUA pakai anchor (#artikel, #edukasi, #harga, dll)
    // Di halaman lain: pakai route (kecuali Artikel & Edukasi tetap ke page-nya)
    if (isHome) return item.anchorHref;
    return item.routeHref;
  };

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

        {/* Logo */}
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

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {NAV_ITEMS.map(item => {
              const href = getHref(item);
              const isActive = !isHome && (
                (item.label === "Artikel" && pathname.startsWith("/artikel")) ||
                (item.label === "Edukasi" && pathname.startsWith("/edukasi"))
              );
              return (
                <Link key={item.label} href={href} style={{
                  padding: "7px 13px", borderRadius: 9, fontSize: 13, fontWeight: isActive ? 700 : 500,
                  color: isActive ? accent : "var(--text-main,#e8eaf0)",
                  opacity: isActive ? 1 : 0.6,
                  textDecoration: "none", transition: "all .2s", whiteSpace: "nowrap",
                  background: isActive ? `color-mix(in srgb, ${accent} 10%, transparent)` : "transparent",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.background = `color-mix(in srgb, ${accent} 12%, transparent)`;
                    e.currentTarget.style.color = accent;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.opacity = "0.6";
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-main,#e8eaf0)";
                  }
                }}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

          {/* Live badge */}
          {!isMobile && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999,
              background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
              fontSize: 11, color: "#22c55e", fontFamily: "monospace",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              LIVE
            </div>
          )}

          {/* Auth area */}
          {!isMobile && !loading && (
            user ? (
              /* User logged in — avatar + dropdown */
              <div style={{ position: "relative" }} data-user-dropdown>
                <button onClick={() => setUserDropOpen(!userDropOpen)} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 6px",
                  borderRadius: 10, cursor: "pointer", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", transition: "background .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${accent}, #f97316)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: "#000",
                  }}>
                    {(user.user_metadata?.name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-main,#e8eaf0)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.user_metadata?.name || user.email?.split("@")[0]}
                  </span>
                  <span style={{ fontSize: 9, opacity: 0.4, color: "var(--text-main,#e8eaf0)" }}>▼</span>
                </button>

                {userDropOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0, width: 200,
                    background: `color-mix(in srgb, var(--bg-page,#050810) 96%, transparent)`,
                    backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 13,
                    padding: 6, zIndex: 100, boxShadow: "0 20px 48px rgba(0,0,0,0.5)",
                  }}>
                    <div style={{ padding: "8px 12px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>
                        {user.user_metadata?.name || "Member"}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.38, color: "var(--text-main,#e8eaf0)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                    </div>
                    {[
                      ...(role === "superadmin" ? [{ label: "👑 Superadmin Panel", href: "/superadmin" }] : []),
                      ...(role === "admin" || role === "superadmin" ? [{ label: "🛡️ Admin Dashboard", href: "/admin" }] : []),
                      { label: "📚 Progress Belajar", href: "/edukasi" },
                      { label: "🔖 Bookmark Artikel", href: "/artikel" },
                      { label: "⚙️ Pengaturan Akun", href: "/akun" },
                    ].map(item => (
                      <Link key={item.label} href={item.href} onClick={() => setUserDropOpen(false)} style={{
                        display: "block", padding: "8px 12px", borderRadius: 8, fontSize: 13,
                        color: item.label.startsWith("👑") ? "#a78bfa" : item.label.startsWith("🛡️") ? accent : "var(--text-main,#e8eaf0)",
                        textDecoration: "none", opacity: 0.65,
                        fontWeight: (item.label.startsWith("🛡️") || item.label.startsWith("👑")) ? 700 : 400,
                        transition: "all .15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = item.label.startsWith("👑") ? "rgba(167,139,250,0.12)" : item.label.startsWith("🛡️") ? `${accent}12` : "rgba(255,255,255,0.06)"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "0.65"; e.currentTarget.style.background = "transparent"; }}>
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4, paddingTop: 4 }}>
                      <button onClick={handleSignOut} style={{
                        display: "block", width: "100%", textAlign: "left", padding: "8px 12px",
                        borderRadius: 8, fontSize: 13, cursor: "pointer", border: "none",
                        background: "transparent", color: "#ef4444", opacity: 0.8, transition: "all .15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.background = "transparent"; }}>
                        🚪 Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in */
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Link href="/login" style={{
                  padding: "6px 14px", borderRadius: 9, fontSize: 12, fontWeight: 700,
                  color: "var(--text-main,#e8eaf0)", textDecoration: "none",
                  border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                  opacity: 0.7, transition: "all .2s",
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
            )
          )}

          {/* Theme dropdown */}
          <div style={{ position: "relative" }} data-dropdown>
            <button onClick={() => setDropOpen(!dropOpen)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: 9,
              background: "transparent", border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`,
              color: accent, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "background .15s",
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

          {/* Hamburger mobile */}
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

      {/* Mobile menu */}
      {isMobile && (
        <div style={{
          maxHeight: menuOpen ? 460 : 0, overflow: "hidden",
          transition: "max-height .35s cubic-bezier(.16,1,.3,1)",
          background: `color-mix(in srgb, var(--bg-page,#050810) 97%, transparent)`,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: menuOpen ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}>
          <div style={{ padding: "8px 16px 16px" }}>
            {NAV_ITEMS.map(item => (
              <Link key={item.label} href={getHref(item)} onClick={() => setMenuOpen(false)} style={{
                display: "block", padding: "12px 14px", borderRadius: 10,
                color: "var(--text-main,#e8eaf0)", opacity: 0.7, fontSize: 14, fontWeight: 500,
                textDecoration: "none", transition: "all .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = `color-mix(in srgb, ${accent} 10%, transparent)`; e.currentTarget.style.color = accent; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-main,#e8eaf0)"; }}>
                {item.label}
              </Link>
            ))}

            {/* Mobile auth */}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {user ? (
                <div>
                  <div style={{ padding: "10px 14px", fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.5, marginBottom: 6 }}>
                    👋 Halo, {user.user_metadata?.name || user.email?.split("@")[0]}
                  </div>
                  <button onClick={() => { handleSignOut(); setMenuOpen(false); }} style={{
                    width: "100%", padding: "11px", borderRadius: 10, fontSize: 13, fontWeight: 700,
                    cursor: "pointer", border: "1px solid rgba(239,68,68,0.25)",
                    background: "rgba(239,68,68,0.08)", color: "#ef4444",
                  }}>Keluar</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
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
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
