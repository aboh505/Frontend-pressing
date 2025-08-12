'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminCheck({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        // Vérifier si l'utilisateur est connecté et est un administrateur
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userStr || !token) {
          // Rediriger vers la page de connexion admin si pas connecté
          router.push('/admin/login');
          return;
        }
        
        const user = JSON.parse(userStr);
        
        if (user.role !== 'admin') {
          // Rediriger vers la page de connexion admin si pas administrateur
          router.push('/admin/login');
          return;
        }
        
        // L'utilisateur est un administrateur
        setIsAdmin(true);
      } catch (error) {
        console.error('Erreur lors de la vérification du statut admin:', error);
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [router]);

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-green-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-green-600"></div>
          <p className="text-lg font-medium text-green-800">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est un administrateur, afficher le contenu du dashboard
  return isAdmin ? children : null;
}
