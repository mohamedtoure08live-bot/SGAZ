import { cookies } from 'next/headers';
import { UserRole } from '@/types';

export const SESSION_COOKIE_NAME = 'sgz_session';

const AUTH_SECRET = process.env.AUTH_SECRET || 'sosgaz-super-secret-auth-key-abidjan-2026-ci-secure';

export interface UserSession {
  email: string;
  role: UserRole;
  name: string;
  createdAt: number;
  expiresAt: number;
}

export const VALID_CREDENTIALS = [
  {
    email: 'sylla.admin@sosgaz.ci',
    password: process.env.ADMIN_PASSWORD || 'SosGaz@2026!Admin',
    role: 'admin' as UserRole,
    name: 'M. Sylla (Administrateur)',
  },
  {
    email: 'aline.op@sosgaz.ci',
    password: process.env.OPERATEUR_PASSWORD || 'SosGaz@2026!Op',
    role: 'operateur' as UserRole,
    name: 'Aline K. (Opératrice)',
  },
];

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlToBytes(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Signe un jeton de session avec l'API standard Web Crypto
 */
export async function signSession(session: UserSession): Promise<string> {
  const jsonStr = JSON.stringify(session);
  const payloadBase64 = bytesToBase64Url(encoder.encode(jsonStr));
  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payloadBase64) as unknown as BufferSource
  );
  const signatureBase64 = bytesToBase64Url(new Uint8Array(signatureBuffer));
  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Vérifie et décode un jeton de session
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const [payloadBase64, signatureBase64] = token.split('.');
    if (!payloadBase64 || !signatureBase64) return null;

    const key = await getHmacKey();
    const signatureBytes = base64UrlToBytes(signatureBase64);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      encoder.encode(payloadBase64) as unknown as BufferSource
    );

    if (!isValid) return null;

    const jsonStr = decoder.decode(base64UrlToBytes(payloadBase64));
    const session: UserSession = JSON.parse(jsonStr);

    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Récupère la session depuis les cookies côté serveur
 */
export async function getServerSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Définit le cookie de session sécurisé
 */
export async function setSessionCookie(session: UserSession) {
  const token = await signSession(session);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 heures
  });
}

/**
 * Supprime le cookie de session
 */
export async function deleteSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
