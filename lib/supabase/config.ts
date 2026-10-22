/**
 * Vérifie si les variables d'environnement Supabase sont configurées.
 * Permet à l'application de fonctionner de manière fluide avec Supabase
 * ou en mode développement / démonstration hors ligne si les clés ne sont pas encore renseignées.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    isSupabaseConfigured() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
