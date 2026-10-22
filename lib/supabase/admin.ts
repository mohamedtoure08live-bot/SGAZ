import { createClient } from '@supabase/supabase-js';

let adminClient: ReturnType<typeof createClient<any>> | null = null;

/**
 * Client Supabase doté des privilèges de service (Service Role).
 * Utilisé UNIQUEMENT côté serveur pour exécuter des opérations système sécurisées.
 */
export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient<any>(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}
