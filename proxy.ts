import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requiresAuthentication } from './app/lib/navigation-config';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Debug logs (uniquement en développement)
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware - pathname:', pathname);
    console.log('Middleware - NODE_ENV:', process.env.NODE_ENV);
    console.log('Middleware - BACKEND_URL:', process.env.BACKEND_URL);
  }

  // Ne pas intercepter les requêtes API (gérées par next.config.ts rewrites)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Pages publiques (layout avec fond animé, sans sidebar/header)
  const publicPaths = ['/login', '/register', '/forgot-password'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Pages admin (layout admin indépendant)
  const isAdminPath = pathname.startsWith('/admin');

  // Vérifier l'authentification via cookies ou headers
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Redirection si non authentifié et page protégée
  if (!isPublicPath && !isAdminPath && requiresAuthentication(pathname) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirection si authentifié et page publique (sauf admin)
  if (isPublicPath && token && !isAdminPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Ajouter des headers pour la production
  const response = NextResponse.next();
  
  // En production, s'assurer que les headers sont correctement configurés
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('X-Forwarded-Proto', 'https');
    response.headers.set('X-Forwarded-Host', request.headers.get('host') || '');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};