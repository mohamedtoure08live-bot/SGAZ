import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

const ADMIN_ONLY_ROUTES = [
  '/admin/prix',
  '/admin/zones',
  '/admin/rapports',
  '/admin/journal',
  '/admin/parametres',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Filtrer uniquement les routes d'administration
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;

    // Si on est sur la page de connexion
    if (pathname === '/admin/login') {
      // Si déjà authentifié, rediriger directement vers le tableau de bord
      if (session) {
        return NextResponse.redirect(new URL('/admin/tableau-de-bord', request.url));
      }
      return NextResponse.next();
    }

    // Si non authentifié pour toute autre route /admin/*
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Si le profil est opérateur et tente d'accéder à une route strictement réservée aux administrateurs
    if (session.role === 'operateur') {
      const isRestricted = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));
      if (isRestricted) {
        return NextResponse.redirect(new URL('/admin/tableau-de-bord', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
