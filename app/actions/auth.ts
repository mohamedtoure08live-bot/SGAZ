'use server';

import { VALID_CREDENTIALS, setSessionCookie, deleteSessionCookie, getServerSession, UserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export interface LoginResult {
  success: boolean;
  error?: string;
  role?: string;
}

/**
 * Action serveur de connexion sécurisée
 */
export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const totp = (formData.get('totp') as string)?.trim().replace(/\s+/g, '');

  if (!email || !password) {
    return { success: false, error: 'Veuillez saisir votre email et mot de passe.' };
  }

  // Trouver le compte correspondant
  const account = VALID_CREDENTIALS.find((u) => u.email.toLowerCase() === email);

  if (!account || account.password !== password) {
    return { success: false, error: 'Adresse email ou mot de passe incorrect.' };
  }

  // Vérification basique du 2FA pour le profil admin si fourni
  if (account.role === 'admin' && totp && totp.length < 6) {
    return { success: false, error: 'Code 2FA invalide (6 chiffres requis).' };
  }

  const session: UserSession = {
    email: account.email,
    role: account.role,
    name: account.name,
    createdAt: Date.now(),
    expiresAt: Date.now() + 1000 * 60 * 60 * 8, // 8 heures
  };

  await setSessionCookie(session);

  return { success: true, role: account.role };
}

/**
 * Action serveur de déconnexion
 */
export async function logoutAction() {
  await deleteSessionCookie();
  redirect('/admin/login');
}

/**
 * Action serveur pour récupérer la session active
 */
export async function getCurrentSessionAction(): Promise<UserSession | null> {
  return getServerSession();
}
