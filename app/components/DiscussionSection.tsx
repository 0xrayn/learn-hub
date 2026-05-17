"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

interface DiscussionPost {
  id: string;
  lesson_id: number;
  user_id: string;
  parent_id: string | null;
  body: string;
  edited: boolean;
  created_at: string;
  updated_at: string;
  profile?: { name: string | null; avatar_url: string | null };
  replies?: DiscussionPost[];
}

interface DiscussionSectionProps {
  lessonId: number;
  accent: string;
}

function timeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function Avatar({ name, avatarUrl, size = 32 }: { name?: string | null; avatarUrl?: string | null; size?: number }) {
  const initials = (name || "?")[0].toUpperCase();
  if (avatarUrl) return (
    <img src={avatarUrl} alt={name || "User"} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />
  );
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", flexShrink: 0, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4, fontWeight: 700, color: "#a78bfa" }}>{initials}</div>
  );
}

function CommentBox({ onSubmit, placeholder, initialValue = "", accent, onCancel }: {
  onSubmit: (body: string) => Promise<void>;
  placeholder?: string;
  initialValue?: string;
  accent: string;
  onCancel?: () => void;
}) {
  const [body, setBody] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const submit = async () => {
    if (!body.trim()) return;
    setSubmitting(true);
    try { await onSubmit(body.trim()); setBody(""); }
    finally { setSubmitting(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") submit();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <textarea
        ref={ref}
        value={body}
        onChange={e => setBody(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder || "Tulis pertanyaan atau komentar..."}
        rows={3}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "var(--text-main,#e8eaf0)", fontSize: 13, lineHeight: 1.6, resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const, transition: "border-color .2s" }}
        onFocus={e => (e.currentTarget.style.borderColor = `${accent}60`)}
        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Ctrl+Enter kirim</span>
        <div style={{ display: "flex", gap: 8 }}>
          {onCancel && (
            <button onClick={onCancel} style={{ padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "var(--text-main,#e8eaf0)", fontFamily: "inherit" }}>Batal</button>
          )}
          <button onClick={submit} disabled={submitting || !body.trim()} style={{ padding: "7px 16px", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: (submitting || !body.trim()) ? "not-allowed" : "pointer", border: "none", background: (submitting || !body.trim()) ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 60%, #06b6d4))`, color: (submitting || !body.trim()) ? "rgba(255,255,255,0.3)" : "#000", fontFamily: "inherit", transition: "all .2s" }}>
            {submitting ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PostItem({ post, accent, currentUserId, onDelete, onEdit, onReply, depth = 0 }: {
  post: DiscussionPost;
  accent: string;
  currentUserId?: string;
  onDelete: (id: string) => void;
  onEdit: (id: string, body: string) => Promise<void>;
  onReply: (parentId: string, body: string) => Promise<void>;
  depth?: number;
}) {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const isOwn = post.user_id === currentUserId;

  // Indent visual cuma 1 level — depth > 1 tetap pakai style yang sama dengan depth 1
  const indentStyle = depth > 0
    ? { marginLeft: 44, paddingLeft: 14, borderLeft: "2px solid rgba(255,255,255,0.07)" }
    : {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", gap: 10, ...indentStyle }}>
        <Avatar name={post.profile?.name} avatarUrl={post.profile?.avatar_url} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>{post.profile?.name || "Pengguna"}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{timeAgo(post.created_at)}</span>
            {post.edited && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>· diedit</span>}
          </div>

          {/* Body */}
          {editing ? (
            <CommentBox
              initialValue={post.body}
              accent={accent}
              onSubmit={async (body) => { await onEdit(post.id, body); setEditing(false); }}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.75, lineHeight: 1.7, margin: "0 0 6px", wordBreak: "break-word" }}>{post.body}</p>
          )}

          {/* Actions */}
          {!editing && (
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => setReplying(v => !v)} style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", padding: "2px 0", fontFamily: "inherit" }}>
                {replying ? "Batal" : "💬 Balas"}
              </button>
              {isOwn && (
                <>
                  <button onClick={() => setEditing(true)} style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.25)", background: "none", border: "none", cursor: "pointer", padding: "2px 0", fontFamily: "inherit" }}>Edit</button>
                  <button onClick={() => onDelete(post.id)} style={{ fontSize: 11, fontWeight: 600, color: "rgba(239,68,68,0.4)", background: "none", border: "none", cursor: "pointer", padding: "2px 0", fontFamily: "inherit" }}>Hapus</button>
                </>
              )}
            </div>
          )}

          {/* Reply box */}
          {replying && (
            <div style={{ marginTop: 10 }}>
              <CommentBox
                accent={accent}
                placeholder={`Balas ke ${post.profile?.name || "Pengguna"}...`}
                onSubmit={async (body) => { await onReply(post.id, body); setReplying(false); }}
                onCancel={() => setReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies — depth di-cap 1, indent tidak bertambah walau nested dalam */}
      {post.replies && post.replies.length > 0 && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {post.replies.map(reply => (
            <PostItem key={reply.id} post={reply} accent={accent} currentUserId={currentUserId} onDelete={onDelete} onEdit={onEdit} onReply={onReply} depth={1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiscussionSection({ lessonId, accent }: DiscussionSectionProps) {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const loaderRef = useRef<HTMLDivElement>(null);

  const load = async (currentPage = 1, append = false) => {
    if (currentPage === 1) setLoading(true); else setLoadingMore(true);
    setError(null);
    try {
      const sb = createClient();

      // Query 1: ambil diskusi tanpa join profiles
      const { data, count, error: fetchError } = await sb
        .from("lesson_discussions")
        .select("*", { count: "exact" })
        .eq("lesson_id", lessonId)
        .order("created_at", { ascending: true });

      if (fetchError) { setError(fetchError.message); setLoading(false); setLoadingMore(false); return; }
      if (!data || data.length === 0) { setPosts([]); setTotal(0); setLoading(false); setLoadingMore(false); return; }

      // Query 2: ambil profiles berdasarkan user_id yang ada
      const userIds = [...new Set(data.map((d: any) => d.user_id))];
      const { data: profiles } = await sb
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", userIds);

      const profileMap: Record<string, any> = {};
      (profiles || []).forEach((p: any) => { profileMap[p.id] = p; });

      setTotal(count || data.length);

      // Build 2-level flat structure: top-level + semua reply langsung ke parent top-level
      // Build flat 2-level structure:
      // - top-level: komentar tanpa parent
      // - semua reply (termasuk reply ke reply) → dikumpulkan di bawah komentar top-level
      const postMap: Record<string, DiscussionPost> = {};
      data.forEach((d: any) => {
        postMap[d.id] = {
          id: d.id, lesson_id: d.lesson_id, user_id: d.user_id,
          parent_id: d.parent_id, body: d.body, edited: d.edited,
          created_at: d.created_at, updated_at: d.updated_at,
          profile: profileMap[d.user_id] || null,
          replies: [],
        };
      });

      // Temukan top-level root dari sebuah post (iteratif, aman dari infinite loop)
      const getRoot = (id: string): string => {
        let current = id;
        const visited = new Set<string>();
        while (true) {
          const p = postMap[current];
          if (!p || !p.parent_id || visited.has(current)) return current;
          visited.add(current);
          current = p.parent_id;
        }
      };

      const topLevel: DiscussionPost[] = [];
      const repliesMap: Record<string, DiscussionPost[]> = {};

      // Pass 1: kumpulkan top-level
      data.forEach((d: any) => {
        if (!d.parent_id) topLevel.push(postMap[d.id]);
      });

      // Pass 2: semua reply → masuk ke replies root-nya
      data.forEach((d: any) => {
        if (!d.parent_id) return;
        const rootId = getRoot(d.id);
        // Kalau root adalah dirinya sendiri tapi dia punya parent_id
        // → parent sudah dihapus, tampilkan sebagai top-level orphan
        if (rootId === d.id || !postMap[rootId]) {
          postMap[d.id].parent_id = null; // perlakukan sebagai top-level
          topLevel.push(postMap[d.id]);
          return;
        }
        if (!repliesMap[rootId]) repliesMap[rootId] = [];
        repliesMap[rootId].push(postMap[d.id]);
      });

      // Assign replies ke masing-masing top-level (sorted by created_at)
      topLevel.forEach(p => {
        p.replies = (repliesMap[p.id] || []).sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      // Paginate top-level posts
      const paginated = topLevel.slice(0, currentPage * PAGE_SIZE);
      setTotal(count || data.length);
      if (append) setPosts(prev => {
        // Merge — keep existing, add new ones
        const existingIds = new Set(prev.map(p => p.id));
        const newOnes = paginated.filter(p => !existingIds.has(p.id));
        return [...prev, ...newOnes];
      });
      else setPosts(paginated);
    } catch (e: any) {
      setError(e.message || "Gagal memuat diskusi");
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => { load(1, false); }, [lessonId]);

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && posts.length < total && !loadingMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        load(nextPage, true);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [posts.length, total, loadingMore, page]);

  const lastPostRef = useRef<number>(0);
  const COOLDOWN_MS = 30000; // 30 detik

  const handlePost = async (body: string) => {
    if (!user) { setError("Kamu harus login dulu untuk berkomentar."); return; }
    const now = Date.now();
    if (now - lastPostRef.current < COOLDOWN_MS) {
      const sisa = Math.ceil((COOLDOWN_MS - (now - lastPostRef.current)) / 1000);
      setError(`Tunggu ${sisa} detik sebelum komentar lagi.`); return;
    }
    const sb = createClient();
    const { error: insertError } = await sb
      .from("lesson_discussions")
      .insert({ lesson_id: lessonId, user_id: user.id, body });
    if (insertError) { setError(`Gagal kirim: ${insertError.message}`); return; }
    lastPostRef.current = Date.now();
    setPage(1); await load(1, false);
  };

  const handleReply = async (parentId: string, body: string) => {
    if (!user) { setError("Kamu harus login dulu."); return; }
    const now = Date.now();
    if (now - lastPostRef.current < COOLDOWN_MS) {
      const sisa = Math.ceil((COOLDOWN_MS - (now - lastPostRef.current)) / 1000);
      setError(`Tunggu ${sisa} detik sebelum komentar lagi.`); return;
    }
    const sb = createClient();
    const { error: insertError } = await sb
      .from("lesson_discussions")
      .insert({ lesson_id: lessonId, user_id: user.id, parent_id: parentId, body });
    if (insertError) { setError(`Gagal kirim: ${insertError.message}`); return; }
    lastPostRef.current = Date.now();
    setPage(1); await load(1, false);
  };

  const handleEdit = async (id: string, body: string) => {
    const sb = createClient();
    const { error: editError } = await sb
      .from("lesson_discussions")
      .update({ body, edited: true, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (editError) { setError(`Gagal edit: ${editError.message}`); return; }
    setPage(1); await load(1, false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus komentar ini?")) return;
    const sb = createClient();
    const { error: delError } = await sb.from("lesson_discussions").delete().eq("id", id);
    if (delError) { setError(`Gagal hapus: ${delError.message}`); return; }
    setPage(1); await load(1, false);
  };

  return (
    <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.018)", overflow: "hidden", marginBottom: 24 }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${accent}15`, border: `1px solid ${accent}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>💬</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-main,#e8eaf0)" }}>Diskusi</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 1 }}>{loading ? "..." : `${total} komentar`}</div>
        </div>
      </div>

      {/* Error banner */}
        {error && (
          <div style={{ margin: "0 20px 12px", padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 12, color: "#f87171" }}>⚠️ {error}</span>
            <button onClick={() => setError(null)} style={{ fontSize: 11, background: "none", border: "none", color: "#f87171", cursor: "pointer", opacity: 0.6 }}>✕</button>
          </div>
        )}

      <div style={{ padding: "18px 20px" }}>
        {/* Input area */}
        {!authLoading && (user ? (
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            <Avatar name={user.user_metadata?.name} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <CommentBox accent={accent} onSubmit={handlePost} />
            </div>
          </div>
        ) : (
          <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 22, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.5, flex: 1 }}>Login untuk ikut diskusi</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Link href="/login" style={{ padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 700, background: `${accent}15`, border: `1px solid ${accent}30`, color: accent, textDecoration: "none" }}>Masuk</Link>
              <Link href="/register" style={{ padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 700, background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 60%, #06b6d4))`, color: "#000", textDecoration: "none" }}>Daftar Gratis</Link>
            </div>
          </div>
        ))}

        {/* Posts */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${accent}20`, borderTop: `2px solid ${accent}`, margin: "0 auto", animation: "spin .7s linear infinite" }} />
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}>💬</div>
            <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.3 }}>Belum ada diskusi. Jadilah yang pertama!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {posts.map(post => (
              <PostItem key={post.id} post={post} accent={accent} currentUserId={user?.id} onDelete={handleDelete} onEdit={handleEdit} onReply={handleReply} />
            ))}
            {/* Infinite scroll trigger */}
            {posts.length < total && (
              <div ref={loaderRef} style={{ textAlign: "center", padding: "16px 0" }}>
                {loadingMore && <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${accent}20`, borderTop: `2px solid ${accent}`, margin: "0 auto", animation: "spin 0.7s linear infinite" }} />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
