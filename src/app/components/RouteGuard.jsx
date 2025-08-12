'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

/**
 * Composant pour protéger les routes spécifiques qui nécessitent une authentification
 * UNIQUEMENT les routes "/orders" et "/profile" sont protégées conformément aux exigences
 * Les routes "/services", "/dashboard" et "/reservation" sont accessibles sans authentification
 */
export default function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  
  // Liste des routes protégées qui nécessitent une authentification
  // Selon la demande du client, UNIQUEMENT les routes "/orders" et "/profile" doivent être protégées
  // Les routes "/services", "/dashboard" et "/reservation" sont accessibles sans authentification
  const protectedPaths = [
    '/orders',
    '/profile'
  ];
  
  // Vérifie si le chemin actuel est une route protégée
  const isProtectedRoute = () => {
    return protectedPaths.some(path => pathname?.startsWith(path));
  };

  useEffect(() => {
    // Si on est toujours en train de charger l'état d'authentification, on ne fait rien
    if (loading) return;
    
    // Vérifie si on est sur une route protégée
    const isProtected = isProtectedRoute();
    
    // Si c'est une route protégée et que l'utilisateur n'est pas authentifié
    if (isProtected && !isAuthenticated) {
      // Vérifie qu'on n'est pas déjà sur la page de login pour éviter les redirections en boucle
      if (!pathname?.startsWith('/auth/login')) {
        // Redirection vers la page de connexion avec le chemin actuel comme redirection
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname || '/')}`);
        return; // Stop l'exécution
      }
    }
    
    // Si tout est OK, on indique que la vérification est terminée
    setIsChecking(false);
  }, [isAuthenticated, loading, pathname, router]);

  // Afficher un indicateur de chargement pendant la vérification
  if ((loading || isChecking) && isProtectedRoute()) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-green-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-green-600"></div>
          <p className="text-lg font-medium text-green-800">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si ce n'est pas une route protégée ou si l'utilisateur est authentifié, afficher le contenu
  return children;
}
