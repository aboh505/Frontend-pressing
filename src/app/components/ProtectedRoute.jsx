'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Si l'utilisateur n'est pas authentifié, il est redirigé vers la page de connexion
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification côté client
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      } else {
        setIsChecking(false);
      }
    }
  }, [isAuthenticated, loading, router]);

  // Afficher un indicateur de chargement pendant la vérification
  if (loading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-green-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-green-600"></div>
          <p className="text-lg font-medium text-green-800">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si authentifié, afficher le contenu de la page
  return children;
}
