// Helper fetch artikel & modul dari Supabase
// Menggunakan fetch langsung ke REST API — aman di server & client
// Tidak bergantung pada window/sessionStorage

export type Article = {
  id: number;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  catColor: string;
};

export type Lesson = {
  title: string;
  dur: string;
  done: boolean;
};

export type Module = {
  id: number;
  num: string;
  icon: string;
  title: string;
  desc: string;
  longDesc: string;
  lessons: Lesson[];
  dur: string;
  level: string;
  done: boolean;
  accent: string;
  levelColor: string;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing");
  return { url, key };
}

async function supabaseFetch(table: string, params: string = ""): Promise<any[]> {
  try {
    const { url, key } = getSupabaseConfig();
    const res = await fetch(
      `${url}/rest/v1/${table}?${params}`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        // Jangan cache di server — selalu fresh
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/** Fetch semua artikel dari Supabase. Return [] kalau kosong/gagal. */
export async function fetchArticles(): Promise<Article[]> {
  const data = await supabaseFetch(
    "articles",
    "published=eq.true&order=created_at.desc"
  );
  return data.map(mapArticle);
}

/** Fetch satu artikel berdasarkan id */
export async function fetchArticleById(id: number): Promise<Article | null> {
  const data = await supabaseFetch(
    "articles",
    `id=eq.${id}&published=eq.true&limit=1`
  );
  if (!data.length) return null;
  return mapArticle(data[0]);
}

function mapArticle(a: any): Article {
  return {
    id: a.id,
    category: a.category || "Pemula",
    readTime: a.read_time || "5 mnt",
    title: a.title,
    excerpt: a.excerpt || "",
    content: a.content || "",
    author: a.author || "Admin",
    date: new Date(a.created_at).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    }),
    image: a.image_url || "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&q=80",
    catColor: a.cat_color || "#22c55e",
  };
}

/** Fetch semua modul + lesson dari Supabase. Return [] kalau kosong/gagal. */
export async function fetchModules(): Promise<Module[]> {
  const modulesData = await supabaseFetch(
    "modules",
    "published=eq.true&order=sort_order.asc"
  );
  if (!modulesData.length) return [];

  const ids = modulesData.map((m: any) => m.id).join(",");
  const lessonsData = await supabaseFetch(
    "module_lessons",
    `module_id=in.(${ids})&order=sort_order.asc`
  );

  const lessonsByModule: Record<number, any[]> = {};
  lessonsData.forEach((l: any) => {
    if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
    lessonsByModule[l.module_id].push(l);
  });

  return modulesData.map((m: any) => mapModule(m, lessonsByModule[m.id] || []));
}

/** Fetch satu modul berdasarkan id */
export async function fetchModuleById(id: number): Promise<Module | null> {
  const [mods, lessons] = await Promise.all([
    supabaseFetch("modules", `id=eq.${id}&published=eq.true&limit=1`),
    supabaseFetch("module_lessons", `module_id=eq.${id}&order=sort_order.asc`),
  ]);
  if (!mods.length) return null;
  return mapModule(mods[0], lessons);
}

function mapModule(m: any, lessons: any[]): Module {
  return {
    id: m.id,
    num: m.num || "01",
    icon: m.icon || "₿",
    title: m.title,
    desc: m.description || "",
    longDesc: m.long_desc || "",
    lessons: lessons.map((l: any) => ({
      title: l.title,
      dur: l.duration || "5 mnt",
      done: false,
    })),
    dur: m.duration || "30 mnt",
    level: m.level || "Pemula",
    done: false,
    accent: m.accent || "#f59e0b",
    levelColor: m.level_color || "#22c55e",
  };
}
