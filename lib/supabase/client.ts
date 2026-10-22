import { createBrowserClient } from '@supabase/ssr';

let browserClient: ReturnType<typeof createBrowserClient<any>> | null = null;

/**
 * Crée ou réutilise le client Supabase pour les composants côté navigateur (Client Components)
 */
export function getSupabaseBrowserClient() {
  if (typeof window === 'undefined') {
    return null;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient<any>(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}
