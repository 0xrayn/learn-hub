"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

function notifIcon(type: string): string {
  switch (type) {
    case "lesson_new": return "📚";
    case "module_update": return "🔄";
    case "badge_earned": return "🏆";
    case "quiz_passed": return "✅";
    default: return "🔔";
  }
}

export default function NotificationBell({ accent = "#a78bfa" }: { accent?: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.is_read).length;

  const fetchNotifs = async () => {
    if (!user) return;
    setLoading(true);
    const sb = createClient();
    const { data } = await sb
      .from("notifications")
      .select("id,type,title,body,link,is_read,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setNotifs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchNotifs();
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markAllRead = async () => {
    if (!user) return;
    const sb = createClient();
    await sb.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (id: string) => {
    const sb = createClient();
    await sb.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  if (!user) return null;

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        onClick={() => { setOpen(o => !o); if (!open) fetchNotifs(); }}
        style={{
          position: "relative", width: 36, height: 36, borderRadius: 10,
          background: open ? `${accent}18` : "rgba(255,255,255,0.05)",
          border: `1px solid ${open ? accent + "40" : "rgba(255,255,255,0.08)"}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, transition: "all .18s", color: "var(--text-main,#e8eaf0)"
        }}
        title="Notifikasi"
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4, width: 18, height: 18,
            borderRadius: "50%", background: accent, color: "#000",
            fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--bg-main,#0f111a)"
          }}>{unread > 9 ? "9+" : unread}</span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0, width: 340,
          background: "var(--bg-card,#181a24)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16, boxShadow: "0 24px 60px rgba(0,0,0,0.6)", zIndex: 999,
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-main,#e8eaf0)" }}>
              Notifikasi {unread > 0 && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: `${accent}18`, color: accent, marginLeft: 6 }}>{unread} baru</span>}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ fontSize: 11, fontWeight: 700, color: accent, background: "none", border: "none", cursor: "pointer", opacity: 0.8 }}>
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: 32, textAlign: "center", color: "var(--text-main,#e8eaf0)", opacity: 0.3, fontSize: 13 }}>Memuat...</div>
            ) : notifs.length === 0 ? (
              <div style={{ padding: 36, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔕</div>
                <div style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.35 }}>Belum ada notifikasi</div>
              </div>
            ) : notifs.map(n => (
              <div
                key={n.id}
                onClick={() => { markRead(n.id); if (n.link) window.location.href = n.link; setOpen(false); }}
                style={{
                  padding: "13px 18px", display: "flex", gap: 12, alignItems: "flex-start",
                  cursor: n.link ? "pointer" : "default",
                  background: n.is_read ? "transparent" : `${accent}07`,
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transition: "background .15s"
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = n.is_read ? "transparent" : `${accent}07`)}
              >
                <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{notifIcon(n.type)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: n.is_read ? 600 : 800, color: "var(--text-main,#e8eaf0)", lineHeight: 1.4, marginBottom: 3 }}>{n.title}</div>
                  {n.body && <div style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.45, lineHeight: 1.5, marginBottom: 4 }}>{n.body}</div>}
                  <div style={{ fontSize: 11, color: "var(--text-main,#e8eaf0)", opacity: 0.28 }}>{timeAgo(n.created_at)}</div>
                </div>
                {!n.is_read && (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0, marginTop: 6 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
