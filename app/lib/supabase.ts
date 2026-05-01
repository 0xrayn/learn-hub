import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Pakai sessionStorage supaya sesi HILANG saat browser ditutup (bukan hanya tab)
        // localStorage = persist forever, sessionStorage = hilang saat browser close
        persistSession: true,
        storageKey: "learnhub-auth",
        storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
      },
    }
  );
}
