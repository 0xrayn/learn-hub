import { createBrowserClient } from "@supabase/ssr";

// Singleton supaya tidak buat instance baru setiap render
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storageKey: "learnhub-auth",
        // Pakai localStorage (default) — kompatibel dengan lock mechanism supabase/ssr
        // sessionStorage menyebabkan lock conflict antar tab/instance
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
    }
  );

  return client;
}
