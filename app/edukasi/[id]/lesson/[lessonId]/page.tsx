"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";
import { useAuth } from "../../../../context/AuthContext";
import { createClient } from "../../../../lib/supabase";

interface LessonDetail {
  id: number; module_id: number; title: string; duration: string;
  sort_order: number; video_url: string | null; video_type: string | null;
  content: string | null; is_free: boolean;
}
interface ModuleBasic { id: number; title: string; accent: string; num: string; cover_image: string | null; }
interface QuizQuestion { question: string; options: string[]; answer: number; explanation: string; }

function getYouTubeId(url: string): string | null {
  const rs = [/youtu\.be\/([^?&]+)/, /youtube\.com\/watch\?v=([^&]+)/, /youtube\.com\/embed\/([^?]+)/];
  for (const r of rs) { const m = url.match(r); if (m) return m[1]; } return null;
}
function getVimeoId(url: string): string | null { const m = url.match(/vimeo\.com\/(\d+)/); return m ? m[1] : null; }

function VideoPlayer({ url, type }: { url: string; type: string | null }) {
  let embedUrl: string | null = null;
  if (type === "youtube" || (!type && url.includes("youtu"))) { const id = getYouTubeId(url); if (id) embedUrl = `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`; }
  else if (type === "vimeo" || (!type && url.includes("vimeo"))) { const id = getVimeoId(url); if (id) embedUrl = `https://player.vimeo.com/video/${id}?byline=0&portrait=0`; }
  else if (url.includes("drive.google.com")) { const fid = url.match(/\/d\/([^/]+)/)?.[1]; if (fid) embedUrl = `https://drive.google.com/file/d/${fid}/preview`; }
  if (embedUrl) return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 16, background: "#000", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
      <iframe src={embedUrl} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: 16 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </div>
  );
  return <div style={{ borderRadius: 16, overflow: "hidden", background: "#000" }}><video src={url} controls style={{ width: "100%", display: "block", maxHeight: 480 }} /></div>;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let last = 0; let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[2]) parts.push(<strong key={match.index} style={{ fontWeight: 800 }}>{match[2]}</strong>);
    else if (match[3]) parts.push(<em key={match.index}>{match[3]}</em>);
    else if (match[4]) parts.push(<code key={match.index} style={{ fontFamily: "monospace", background: "rgba(255,255,255,0.1)", padding: "2px 7px", borderRadius: 5, fontSize: "0.88em" }}>{match[4]}</code>);
    else if (match[5]) parts.push(<a key={match.index} href={match[6]} target="_blank" rel="noopener noreferrer" style={{ color: "var(--lesson-accent,#a78bfa)", textDecoration: "underline" }}>{match[5]}</a>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : <>{parts}</>;
}

function MarkdownContent({ content, accent }: { content: string; accent: string }) {
  const lines = content.split("\n"); const elements: React.ReactNode[] = []; let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("### ")) { elements.push(<h3 key={i} style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-main,#e8eaf0)", margin: "22px 0 8px" }}>{line.slice(4)}</h3>); }
    else if (line.startsWith("## ")) { elements.push(<h2 key={i} style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--text-main,#e8eaf0)", margin: "28px 0 10px", borderLeft: `3px solid ${accent}`, paddingLeft: 12 }}>{line.slice(3)}</h2>); }
    else if (line.startsWith("# ")) { elements.push(<h1 key={i} style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-main,#e8eaf0)", margin: "32px 0 14px" }}>{line.slice(2)}</h1>); }
    else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) { items.push(lines[i].slice(2)); i++; }
      elements.push(<ul key={`ul-${i}`} style={{ margin: "10px 0", paddingLeft: 0, display: "flex", flexDirection: "column", gap: 6, listStyle: "none" }}>{items.map((item, j) => <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.82, lineHeight: 1.7 }}><span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: accent, marginTop: 9, flexShrink: 0 }} /><span>{renderInline(item)}</span></li>)}</ul>); continue;
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, "")); i++; }
      elements.push(<ol key={`ol-${i}`} style={{ margin: "10px 0", paddingLeft: 0, display: "flex", flexDirection: "column", gap: 8, listStyle: "none" }}>{items.map((item, j) => <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: "var(--text-main,#e8eaf0)", lineHeight: 1.7 }}><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: `${accent}20`, border: `1px solid ${accent}40`, color: accent, fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{j + 1}</span><span style={{ opacity: 0.85 }}>{renderInline(item)}</span></li>)}</ol>); continue;
    } else if (line.startsWith("```")) {
      const lang = line.slice(3).trim(); const codeLines: string[] = []; i++;
      while (i < lines.length && !lines[i].startsWith("```")) { codeLines.push(lines[i]); i++; }
      elements.push(<div key={`code-${i}`} style={{ margin: "16px 0", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.35)" }}>{lang && <div style={{ padding: "6px 16px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" as const, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{lang}</div>}<pre style={{ margin: 0, padding: "16px 18px", overflowX: "auto", fontSize: 13, lineHeight: 1.65, color: "#e8eaf0", fontFamily: '"Fira Code",monospace' }}><code>{codeLines.join("\n")}</code></pre></div>);
    } else if (line.startsWith("> ")) { elements.push(<blockquote key={i} style={{ margin: "14px 0", padding: "14px 18px", borderLeft: `3px solid ${accent}`, background: `${accent}0d`, borderRadius: "0 12px 12px 0", fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.85, lineHeight: 1.75, fontStyle: "italic" }}>{renderInline(line.slice(2))}</blockquote>); }
    else if (line === "---") { elements.push(<hr key={i} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "22px 0" }} />); }
    else if (line.trim() === "") { elements.push(<div key={i} style={{ height: 6 }} />); }
    else if (line.trim()) { elements.push(<p key={i} style={{ fontSize: 14, color: "var(--text-main,#e8eaf0)", opacity: 0.82, lineHeight: 1.85, margin: "6px 0" }}>{renderInline(line)}</p>); }
    i++;
  }
  return <div>{elements}</div>;
}

interface QuizSectionProps {
  questions: QuizQuestion[]; accent: string;
  onQuizDone: (score: number, correct: number, total: number) => void;
  alreadyPassed: boolean; savedScore: number | null;
}
function QuizSection({ questions, accent, onQuizDone, alreadyPassed, savedScore }: QuizSectionProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [started, setStarted] = useState(false);
  if (!questions || questions.length === 0) return null;
  const q = questions[current];
  const isCorrect = selected !== null && selected === q.answer;
  const isAnswered = answered[current];
  const retry = () => { setCurrent(0); setSelected(null); setAnswered(new Array(questions.length).fill(false)); setUserAnswers(new Array(questions.length).fill(null)); setShowResult(false); };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    const na = [...answered]; na[current] = true; setAnswered(na);
    const nu = [...userAnswers]; nu[current] = idx; setUserAnswers(nu);
  };
  const handleNext = () => {
    if (current < questions.length - 1) { setCurrent(current + 1); setSelected(userAnswers[current + 1]); }
    else {
      const finalAnswers = [...userAnswers]; finalAnswers[current] = selected;
      const correct = finalAnswers.filter((a, i) => a === questions[i].answer).length;
      const score = Math.round((correct / questions.length) * 100);
      setShowResult(true);
      onQuizDone(score, correct, questions.length);
    }
  };

  if (alreadyPassed && !started) return (
    <div style={{ borderRadius: 18, border: "1px solid rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.04)", marginBottom: 24, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✅</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#22c55e" }}>Quiz Selesai{savedScore !== null ? ` — Skor ${savedScore}%` : ""}</div>
          <div style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.45, marginTop: 3 }}>Kamu sudah lulus quiz ini sebelumnya.</div>
        </div>
        <button onClick={() => { setStarted(true); retry(); }} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "var(--text-main,#e8eaf0)" }}>🔄 Ulangi</button>
      </div>
    </div>
  );

  if (!started) return (
    <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", marginBottom: 24 }}>
      <div style={{ padding: 26 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 13, background: `${accent}18`, border: `1px solid ${accent}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>🧠</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-main,#e8eaf0)", letterSpacing: "-0.02em" }}>Uji Pemahamanmu</div>
            <div style={{ fontSize: 12, opacity: 0.38, color: "var(--text-main,#e8eaf0)", marginTop: 2 }}>{questions.length} soal · minimal 60% untuk lanjut</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.7, marginBottom: 20 }}>Selesaikan quiz terlebih dahulu sebelum menandai pelajaran ini selesai.</p>
        <button onClick={() => setStarted(true)} style={{ padding: "11px 24px", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: "pointer", border: "none", background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 60%, #06b6d4))`, color: "#000" }}>Mulai Quiz →</button>
      </div>
    </div>
  );

  const totalCorrect = userAnswers.filter((a, i) => a === questions[i].answer).length;
  const scorePercent = Math.round((totalCorrect / questions.length) * 100);
  const isPassed = scorePercent >= 60;
  const isPerfect = totalCorrect === questions.length;

  if (showResult) return (
    <div style={{ borderRadius: 18, border: `1px solid ${isPassed ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, background: isPassed ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)", marginBottom: 24 }}>
      <div style={{ padding: 28, textAlign: "center" }}>
        <div style={{ fontSize: 50, marginBottom: 12 }}>{isPerfect ? "🏆" : isPassed ? "👍" : "📚"}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 6, letterSpacing: "-0.03em" }}>{isPerfect ? "Sempurna!" : isPassed ? "Lulus!" : "Belum Lulus"}</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: isPassed ? "#22c55e" : "#ef4444", marginBottom: 4 }}>{scorePercent}%</div>
        <div style={{ fontSize: 13, opacity: 0.4, color: "var(--text-main,#e8eaf0)", marginBottom: 16 }}>{totalCorrect} dari {questions.length} benar</div>
        {!isPassed && <div style={{ fontSize: 12, color: "#ef4444", marginBottom: 20, padding: "8px 16px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", display: "inline-block" }}>Minimal 60% untuk menandai selesai. Coba lagi!</div>}
        {isPassed && <div style={{ fontSize: 12, color: "#22c55e", marginBottom: 20, padding: "8px 16px", borderRadius: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", display: "inline-block" }}>✅ Skor tersimpan. Kamu bisa tandai pelajaran selesai!</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, textAlign: "left" }}>
          {questions.map((qq, i) => { const ua = userAnswers[i]; const ok = ua === qq.answer; return (<div key={i} style={{ padding: "10px 14px", borderRadius: 10, background: ok ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, display: "flex", alignItems: "flex-start", gap: 10 }}><span style={{ flexShrink: 0 }}>{ok ? "✅" : "❌"}</span><span style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.8, lineHeight: 1.5 }}>{qq.question}</span></div>); })}
        </div>
        <button onClick={retry} style={{ padding: "11px 24px", borderRadius: 11, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.05)", color: "var(--text-main,#e8eaf0)" }}>🔄 Ulangi Quiz</button>
      </div>
    </div>
  );

  return (
    <div style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", marginBottom: 24 }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}><span>🧠</span><span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)" }}>Quiz</span></div>
        <div style={{ display: "flex", gap: 5 }}>{questions.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: answered[i] ? (userAnswers[i] === questions[i].answer ? "#22c55e" : "#ef4444") : i === current ? accent : "rgba(255,255,255,0.13)", transition: "all .2s" }} />)}</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{current + 1} / {questions.length}</span>
      </div>
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-main,#e8eaf0)", lineHeight: 1.6, marginBottom: 16 }}>{q.question}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {q.options.map((opt, idx) => {
            const isSel = selected === idx; const isRight = idx === q.answer;
            let bg = "rgba(255,255,255,0.03)", border = "1px solid rgba(255,255,255,0.08)", col = "var(--text-main,#e8eaf0)"; let op: number | undefined = 0.72;
            if (isAnswered) { if (isRight) { bg = "rgba(34,197,94,0.1)"; border = "1px solid rgba(34,197,94,0.35)"; col = "#22c55e"; op = 1; } else if (isSel) { bg = "rgba(239,68,68,0.1)"; border = "1px solid rgba(239,68,68,0.35)"; col = "#ef4444"; op = 1; } else { op = 0.3; } }
            else if (isSel) { bg = `${accent}15`; border = `1px solid ${accent}50`; col = accent; op = 1; }
            return (<button key={idx} onClick={() => handleSelect(idx)} disabled={isAnswered} style={{ width: "100%", textAlign: "left", padding: "12px 16px", borderRadius: 11, cursor: isAnswered ? "default" : "pointer", background: bg, border, transition: "all .15s", display: "flex", alignItems: "center", gap: 12 }} onMouseEnter={e => { if (!isAnswered && !isSel) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }} onMouseLeave={e => { if (!isAnswered && !isSel) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, background: isAnswered && isRight ? "rgba(34,197,94,0.2)" : isAnswered && isSel && !isRight ? "rgba(239,68,68,0.2)" : isSel ? `${accent}25` : "rgba(255,255,255,0.07)", color: isAnswered && isRight ? "#22c55e" : isAnswered && isSel && !isRight ? "#ef4444" : isSel ? accent : "rgba(255,255,255,0.4)" }}>{String.fromCharCode(65 + idx)}</span>
              <span style={{ fontSize: 13, color: col, opacity: op, lineHeight: 1.5, fontWeight: isAnswered && isRight ? 700 : 500, flex: 1 }}>{opt}</span>
              {isAnswered && isRight && <span>✓</span>}{isAnswered && isSel && !isRight && <span>✗</span>}
            </button>);
          })}
        </div>
        {isAnswered && (<div style={{ marginTop: 14, padding: "13px 16px", borderRadius: 11, background: isCorrect ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)", border: `1px solid ${isCorrect ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}><div style={{ fontSize: 12, fontWeight: 800, color: isCorrect ? "#22c55e" : "#ef4444", marginBottom: 5 }}>{isCorrect ? "✅ Benar!" : "❌ Kurang tepat."}</div><p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.75, lineHeight: 1.65, margin: 0 }}>{q.explanation}</p></div>)}
      </div>
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <button onClick={() => { if (current > 0) { setCurrent(current - 1); setSelected(userAnswers[current - 1]); } }} disabled={current === 0} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: current === 0 ? "not-allowed" : "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "var(--text-main,#e8eaf0)", opacity: current === 0 ? 0.3 : 0.8 }}>← Prev</button>
        <button onClick={handleNext} disabled={!isAnswered} style={{ padding: "9px 22px", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: isAnswered ? "pointer" : "not-allowed", border: "none", background: isAnswered ? `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 60%, #06b6d4))` : "rgba(255,255,255,0.06)", color: isAnswered ? "#000" : "rgba(255,255,255,0.3)", transition: "all .2s" }}>{current === questions.length - 1 ? "Lihat Hasil →" : "Lanjut →"}</button>
      </div>
    </div>
  );
}

export default function LessonPage({ params }: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id, lessonId } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [module, setModule] = useState<ModuleBasic | null>(null);
  const [allLessons, setAllLessons] = useState<LessonDetail[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [lessonQuizMap, setLessonQuizMap] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [quizPassed, setQuizPassed] = useState(false);
  const [savedScore, setSavedScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [moduleJustCompleted, setModuleJustCompleted] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const sb = createClient();
      const [{ data: ld }, { data: ald }, { data: md }] = await Promise.all([
        sb.from("module_lessons").select("*").eq("id", lessonId).single(),
        sb.from("module_lessons").select("*").eq("module_id", id).order("sort_order", { ascending: true }),
        sb.from("modules").select("id,title,accent,num,cover_image").eq("id", id).single(),
      ]);
      if (!ld) { setLoading(false); return; }
      setLesson(ld); setAllLessons(ald || []); setModule(md);
      const { data: qd } = await sb.from("lesson_quizzes").select("question,options,answer,explanation").eq("lesson_id", lessonId).order("sort_order", { ascending: true });
      setQuizQuestions((qd || []).map((q: any) => ({ question: q.question, options: Array.isArray(q.options) ? q.options : JSON.parse(q.options), answer: q.answer, explanation: q.explanation })));
      if (ald && ald.length > 0) {
        const lids = ald.map((l: LessonDetail) => l.id);
        const { data: aqd } = await sb.from("lesson_quizzes").select("lesson_id").in("lesson_id", lids);
        const map: Record<number, boolean> = {};
        (aqd || []).forEach((q: any) => { map[q.lesson_id] = true; });
        setLessonQuizMap(map);
      }
      setLoading(false);
    };
    load();
  }, [id, lessonId]);

  useEffect(() => {
    if (!user || !allLessons.length) return;
    const sb = createClient();
    sb.from("module_progress").select("lesson_idx,completed").eq("user_id", user.id).eq("module_id", id)
      .then(({ data }) => { if (data) { const done = new Set(data.filter((r: any) => r.completed).map((r: any) => r.lesson_idx as number)); setCompletedLessons(done); } });
    sb.from("quiz_results").select("score,passed").eq("user_id", user.id).eq("lesson_id", lessonId).single()
      .then(({ data }) => { if (data?.passed) { setQuizPassed(true); setSavedScore(data.score); } });
  }, [user, allLessons, id, lessonId]);

  const lessonIdx = allLessons.findIndex(l => l.id === Number(lessonId));
  const prevLesson = lessonIdx > 0 ? allLessons[lessonIdx - 1] : null;
  const nextLesson = lessonIdx < allLessons.length - 1 ? allLessons[lessonIdx + 1] : null;
  const isFree = lesson?.is_free || lessonIdx < 2;
  const isLocked = !isFree && !user && !authLoading;
  const isSeqLocked = !!(user && lessonIdx > 0 && !completedLessons.has(lessonIdx - 1) && !isFree);
  const currentDone = completedLessons.has(lessonIdx);
  const hasQuiz = quizQuestions.length > 0;
  const canMarkComplete = !hasQuiz || quizPassed;
  const accent = module?.accent || "#a78bfa";
  const progressPct = allLessons.length > 0 ? Math.round((completedLessons.size / allLessons.length) * 100) : 0;
  const allDone = allLessons.length > 0 && completedLessons.size === allLessons.length;

  useEffect(() => { if (!authLoading && isLocked && lesson) router.replace(`/register?from=edukasi/${id}/lesson/${lessonId}`); }, [authLoading, isLocked, id, lessonId, lesson, router]);

  const handleQuizDone = async (score: number, correct: number, total: number) => {
    if (!user) return;
    const passed = score >= 60;
    const sb = createClient();
    const { data: ex } = await sb.from("quiz_results").select("attempts").eq("user_id", user.id).eq("lesson_id", lessonId).single();
    await sb.from("quiz_results").upsert({ user_id: user.id, lesson_id: Number(lessonId), score, total_q: total, correct_q: correct, passed, attempts: (ex?.attempts || 0) + 1, updated_at: new Date().toISOString() }, { onConflict: "user_id,lesson_id" });
    if (passed) { setQuizPassed(true); setSavedScore(score); }
  };

  const toggleComplete = async () => {
    if (!user || !lesson || lessonIdx < 0 || !canMarkComplete) return;
    setSaving(true);
    const sb = createClient();
    const newDone = !currentDone;
    await sb.from("module_progress").upsert({ user_id: user.id, module_id: Number(id), lesson_idx: lessonIdx, completed: newDone, updated_at: new Date().toISOString() }, { onConflict: "user_id,module_id,lesson_idx" });
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (newDone) next.add(lessonIdx); else next.delete(lessonIdx);
      if (newDone && next.size === allLessons.length) setModuleJustCompleted(true);
      return next;
    });
    setSaving(false);
  };

  if (loading || authLoading) return (<><Navbar /><main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ textAlign: "center" }}><div style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${accent}20`, borderTop: `3px solid ${accent}`, margin: "0 auto 14px", animation: "spin 0.8s linear infinite" }} /><p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.35, fontSize: 13 }}>Memuat pelajaran...</p></div></main></>);
  if (!lesson) return (<><Navbar /><main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 52, marginBottom: 14 }}>📖</div><h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>Pelajaran Tidak Ditemukan</h1><Link href={`/edukasi/${id}`} style={{ color: accent, textDecoration: "none", fontSize: 13 }}>← Kembali ke modul</Link></div></main></>);
  if (isLocked) return (<><Navbar /><main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}><div style={{ textAlign: "center", maxWidth: 360 }}><div style={{ fontSize: 52, marginBottom: 14 }}>🔒</div><h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>Perlu Akun</h2><p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.7, marginBottom: 22 }}>Daftar gratis untuk akses <strong style={{ color: accent }}>{lesson.title}</strong></p><div style={{ display: "flex", gap: 10, justifyContent: "center" }}><Link href="/register" style={{ padding: "11px 22px", borderRadius: 11, fontSize: 13, fontWeight: 800, background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 70%, #06b6d4))`, color: "#000", textDecoration: "none" }}>Daftar Gratis</Link><Link href="/login" style={{ padding: "11px 22px", borderRadius: 11, fontSize: 13, fontWeight: 700, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main,#e8eaf0)", textDecoration: "none" }}>Masuk</Link></div></div></main></>);
  if (isSeqLocked) return (<><Navbar /><main style={{ minHeight: "100vh", paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}><div style={{ textAlign: "center", maxWidth: 380 }}><div style={{ fontSize: 52, marginBottom: 14 }}>🔒</div><h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-main,#e8eaf0)", marginBottom: 8 }}>Selesaikan Pelajaran Sebelumnya Dulu</h2><p style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.7, marginBottom: 22 }}>Tandai pelajaran sebelumnya sebagai selesai untuk membuka <strong style={{ color: accent }}>{lesson.title}</strong>.</p>{prevLesson && <Link href={`/edukasi/${id}/lesson/${prevLesson.id}`} style={{ padding: "11px 22px", borderRadius: 11, fontSize: 13, fontWeight: 800, background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 70%, #06b6d4))`, color: "#000", textDecoration: "none" }}>← Kembali ke {prevLesson.title}</Link>}</div></main></>);

  return (
    <>
      <Navbar />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}} :root{--lesson-accent:${accent};} .lnc:hover{border-color:${accent}50!important;background:rgba(255,255,255,0.04)!important;} .sll:hover>div{background:rgba(255,255,255,0.04)!important;}`}</style>
      <main style={{ minHeight: "100vh", paddingTop: 56 }}>
        {/* Top progress */}
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.05)", zIndex: 50 }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg,${accent},color-mix(in srgb,${accent} 55%,#06b6d4))`, transition: "width .5s ease", borderRadius: "0 2px 2px 0" }} />
        </div>
        {/* Breadcrumb */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.18)", backdropFilter: "blur(12px)" }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", display: "flex", alignItems: "center", gap: 5, fontSize: 12, flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.28, textDecoration: "none" }}>Beranda</Link><span style={{ opacity: 0.18, color: "var(--text-main,#e8eaf0)" }}>›</span>
            <Link href="/edukasi" style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.28, textDecoration: "none" }}>Edukasi</Link><span style={{ opacity: 0.18, color: "var(--text-main,#e8eaf0)" }}>›</span>
            <Link href={`/edukasi/${id}`} style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.28, textDecoration: "none", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{module?.title || "Modul"}</Link><span style={{ opacity: 0.18, color: "var(--text-main,#e8eaf0)" }}>›</span>
            <span style={{ color: accent, fontWeight: 600, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{lesson.title}</span>
          </div>
        </div>

        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "32px 20px 80px", display: "grid", gridTemplateColumns: "1fr 290px", gap: 28, alignItems: "start" }}>
          {/* Content */}
          <div style={{ animation: "fadeUp .45s ease" }}>
            {/* Module complete banner */}
            {(allDone || moduleJustCompleted) && module && (
              <div style={{ marginBottom: 22, borderRadius: 18, border: `1px solid ${accent}40`, background: `linear-gradient(135deg,${accent}10,color-mix(in srgb,${accent} 5%,transparent))`, padding: "24px 26px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 40 }}>🎉</div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "var(--text-main,#e8eaf0)", letterSpacing: "-0.02em", marginBottom: 4 }}>Modul Selesai!</div>
                    <div style={{ fontSize: 13, color: "var(--text-main,#e8eaf0)", opacity: 0.55 }}>Kamu telah menyelesaikan semua pelajaran di <strong style={{ color: accent }}>{module.title}</strong></div>
                  </div>
                  <Link href={`/edukasi/${id}?completed=true`} style={{ padding: "10px 20px", borderRadius: 11, fontSize: 13, fontWeight: 800, background: `linear-gradient(135deg,${accent},color-mix(in srgb,${accent} 70%,#06b6d4))`, color: "#000", textDecoration: "none", whiteSpace: "nowrap" as const }}>Lihat Sertifikat →</Link>
                </div>
              </div>
            )}
            {/* Title */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 13, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 20, background: `${accent}15`, border: `1px solid ${accent}28`, color: accent }}>Pelajaran {lessonIdx + 1} dari {allLessons.length}</span>
                {isFree && !user && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.22)", color: "#22c55e" }}>🆓 Gratis</span>}
                {currentDone && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.22)", color: "#22c55e" }}>✅ Selesai</span>}
                {hasQuiz && !quizPassed && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(255,180,0,0.08)", border: "1px solid rgba(255,180,0,0.2)", color: "#fbbf24" }}>🧠 Ada Quiz</span>}
                {hasQuiz && quizPassed && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e" }}>🧠 Quiz ✓</span>}
              </div>
              <h1 style={{ fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontWeight: 900, color: "var(--text-main,#e8eaf0)", lineHeight: 1.2, margin: "0 0 10px", letterSpacing: "-0.03em" }}>{lesson.title}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.38 }}>⏱ {lesson.duration}</span>
                {lesson.video_url && <span style={{ fontSize: 12, color: accent, opacity: 0.65 }}>▶ Video</span>}
              </div>
            </div>
            {lesson.video_url && <div style={{ marginBottom: 30 }}><VideoPlayer url={lesson.video_url} type={lesson.video_type} /></div>}
            {lesson.content && <div style={{ padding: "26px 28px", borderRadius: 18, background: "rgba(255,255,255,0.018)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 24 }}><MarkdownContent content={lesson.content} accent={accent} /></div>}
            {!lesson.video_url && !lesson.content && <div style={{ padding: "48px 20px", borderRadius: 18, border: "1px dashed rgba(255,255,255,0.08)", textAlign: "center", marginBottom: 24 }}><div style={{ fontSize: 36, marginBottom: 10, opacity: 0.3 }}>📝</div><p style={{ color: "var(--text-main,#e8eaf0)", opacity: 0.28, fontSize: 13 }}>Konten belum tersedia</p></div>}
            <QuizSection questions={quizQuestions} accent={accent} onQuizDone={handleQuizDone} alreadyPassed={quizPassed} savedScore={savedScore} />
            {/* Mark complete */}
            <div style={{ padding: "18px 22px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-main,#e8eaf0)", fontSize: 14 }}>{currentDone ? "✅ Sudah selesai!" : "Sudah selesai belajar?"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.32, marginTop: 3 }}>{!user ? "Login untuk simpan progress." : !canMarkComplete ? "Selesaikan quiz terlebih dahulu (min. 60%)." : "Progress tersimpan otomatis."}</div>
                </div>
                {user ? (
                  <button onClick={toggleComplete} disabled={saving || !canMarkComplete} style={{ padding: "10px 20px", borderRadius: 11, fontSize: 13, fontWeight: 800, cursor: (saving || !canMarkComplete) ? "not-allowed" : "pointer", border: currentDone ? "1px solid rgba(34,197,94,0.25)" : "none", transition: "all .2s", background: currentDone ? "rgba(34,197,94,0.1)" : !canMarkComplete ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg,${accent},color-mix(in srgb,${accent} 70%,#06b6d4))`, color: currentDone ? "#22c55e" : !canMarkComplete ? "rgba(255,255,255,0.25)" : "#000" }}>
                    {saving ? "Menyimpan..." : currentDone ? "↩ Tandai Belum" : !canMarkComplete ? "🔒 Kerjakan Quiz Dulu" : "✓ Tandai Selesai"}
                  </button>
                ) : <Link href="/login" style={{ padding: "10px 20px", borderRadius: 11, fontSize: 13, fontWeight: 700, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-main,#e8eaf0)", textDecoration: "none" }}>Login untuk Simpan</Link>}
              </div>
            </div>
            {/* Prev / Next nav */}
            <div style={{ display: "grid", gridTemplateColumns: prevLesson && nextLesson ? "1fr 1fr" : "1fr", gap: 11 }}>
              {prevLesson && (<Link href={`/edukasi/${id}/lesson/${prevLesson.id}`} style={{ textDecoration: "none" }}><div className="lnc" style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", transition: "all .18s" }}><div style={{ fontSize: 11, opacity: 0.32, color: "var(--text-main,#e8eaf0)", marginBottom: 5 }}>← Sebelumnya</div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)", lineHeight: 1.4 }}>{prevLesson.title}</div></div></Link>)}
              {nextLesson && (<Link href={currentDone ? `/edukasi/${id}/lesson/${nextLesson.id}` : "#"} onClick={e => { if (!currentDone) e.preventDefault(); }} style={{ textDecoration: "none", opacity: currentDone ? 1 : 0.5 }}><div className="lnc" style={{ padding: "14px 18px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", cursor: currentDone ? "pointer" : "default", transition: "all .18s", textAlign: prevLesson ? "right" : "left" as any }}><div style={{ fontSize: 11, opacity: 0.32, color: "var(--text-main,#e8eaf0)", marginBottom: 5 }}>{currentDone ? "Berikutnya →" : "🔒 Selesaikan dulu"}</div><div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main,#e8eaf0)", lineHeight: 1.4 }}>{nextLesson.title}</div></div></Link>)}
            </div>
            <div style={{ marginTop: 14, textAlign: "center" }}><Link href={`/edukasi/${id}`} style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.28, textDecoration: "none" }}>← Kembali ke Daftar Pelajaran</Link></div>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 12 }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: `${accent}16`, border: `1px solid ${accent}28`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📚</div>
                <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-main,#e8eaf0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{module?.title}</div><div style={{ fontSize: 10, opacity: 0.32, color: "var(--text-main,#e8eaf0)", marginTop: 1 }}>{allLessons.length} pelajaran</div></div>
              </div>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}><div style={{ height: "100%", width: `${progressPct}%`, background: `linear-gradient(90deg,${accent},color-mix(in srgb,${accent} 55%,#06b6d4))`, borderRadius: 2, transition: "width .5s" }} /></div>
                <span style={{ fontSize: 10, fontWeight: 700, color: accent, minWidth: 28, textAlign: "right" }}>{progressPct}%</span>
              </div>
              <div style={{ maxHeight: 400, overflowY: "auto" }}>
                {allLessons.map((l, idx) => {
                  const isActive = l.id === Number(lessonId);
                  const isDone = completedLessons.has(idx);
                  const seqLock = !!(user && idx > 0 && !completedLessons.has(idx - 1) && !(l.is_free || idx < 2));
                  return (
                    <Link key={l.id} href={seqLock ? "#" : `/edukasi/${id}/lesson/${l.id}`} onClick={e => { if (seqLock) e.preventDefault(); }} className="sll" style={{ textDecoration: "none" }}>
                      <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, background: isActive ? `${accent}0d` : "transparent", borderLeft: isActive ? `2px solid ${accent}` : "2px solid transparent", transition: "all .15s", opacity: seqLock ? 0.4 : 1 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, background: isDone ? "rgba(34,197,94,0.15)" : isActive ? `${accent}22` : "rgba(255,255,255,0.05)", color: isDone ? "#22c55e" : isActive ? accent : "rgba(255,255,255,0.22)", border: isDone ? "1px solid rgba(34,197,94,0.3)" : isActive ? `1px solid ${accent}40` : "1px solid rgba(255,255,255,0.07)" }}>{isDone ? "✓" : seqLock ? "🔒" : idx + 1}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? "var(--text-main,#e8eaf0)" : "rgba(255,255,255,0.42)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{l.title}</div>
                          <div style={{ fontSize: 10, opacity: 0.28, color: "var(--text-main,#e8eaf0)", marginTop: 2 }}>{l.duration}</div>
                        </div>
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>{l.video_url && <span style={{ fontSize: 10, opacity: 0.38 }}>▶</span>}{lessonQuizMap[l.id] && <span style={{ fontSize: 10, opacity: 0.5 }}>🧠</span>}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div style={{ padding: "14px 16px", borderRadius: 14, background: `${accent}08`, border: `1px solid ${accent}18` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: accent, marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>💡 Tips</div>
              <p style={{ fontSize: 12, color: "var(--text-main,#e8eaf0)", opacity: 0.5, lineHeight: 1.65, margin: 0 }}>{hasQuiz ? "Kerjakan quiz (min. 60%) dulu sebelum tandai selesai. 🧠 = ada quiz." : "Tandai selesai untuk lanjut ke pelajaran berikutnya."}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
