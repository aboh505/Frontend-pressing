import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Middleware exécuté pour:', request.nextUrl.pathname);
  
  // Selon les souhaits du client, les routes "/services" et "/dashboard" doivent être accessibles sans authentification
  // Seules les routes "/orders" et "/profile" doivent être protégées
  // Cependant, le tableau de bord administrateur doit être réservé aux administrateurs
  
  // Vérifier si l'URL demandée commence par /dashboard/admin
  // Cette route sera réservée aux administrateurs
  if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
    // Vérifier l'authentification via les cookies ou localStorage
    const token = request.cookies.get('token')?.value || 
                 request.headers.get('authorization')?.split(' ')[1];
    
    // Si pas de token, rediriger vers la page de connexion admin
    if (!token) {
      console.log('Pas de token, redirection vers /admin/login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Vérifier le rôle via les cookies
    const userCookie = request.cookies.get('user')?.value;
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        if (userData.role !== 'admin') {
          console.log('Utilisateur non admin, redirection vers /admin/login');
          return NextResponse.redirect(new URL('/admin/login', request.url));
        }
      } catch (error) {
        console.log('Erreur parsing user cookie, redirection vers /admin/login');
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }
  
  // Vérifier si l'URL demandée commence par /orders ou /profile
  // Ces routes sont protégées pour tous les utilisateurs connectés
  if (request.nextUrl.pathname.startsWith('/orders') || request.nextUrl.pathname.startsWith('/profile')) {
    const token = request.cookies.get('token')?.value || 
                 request.headers.get('authorization')?.split(' ')[1];
    
    // Si pas de token, rediriger vers la page de connexion
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  // Continuer la requête normalement pour toutes les autres routes
  return NextResponse.next();
}

// Configurer le middleware pour s'exécuter uniquement sur les routes spécifiées
export const config = {
  matcher: ['/dashboard/admin/:path*', '/orders/:path*', '/profile/:path*']
};
