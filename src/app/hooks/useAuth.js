import { useAuth as useAuthContext } from '../context/AuthContext';

// Ce hook est un wrapper autour du hook useAuth du contexte
// Il permet d'ajouter des fonctionnalités supplémentaires si nécessaire
export default function useAuth() {
  const auth = useAuthContext();
  
  // Fonctions supplémentaires spécifiques à l'authentification peuvent être ajoutées ici
  
  const checkAccess = (requiredRole) => {
    // Vérifier si l'utilisateur est connecté
    if (!auth.isAuthenticated()) {
      return false;
    }
    
    // Si aucun rôle n'est requis, l'accès est accordé
    if (!requiredRole) {
      return true;
    }
    
    // Vérifier si l'utilisateur a le rôle requis
    return auth.user.role === requiredRole;
  };
  
  // Fonction qui vérifie si l'utilisateur peut accéder à une page admin
  const canAccessAdmin = () => {
    return checkAccess('admin');
  };
  
  // Fonction qui vérifie si l'utilisateur peut accéder à une page client
  const canAccessClient = () => {
    return checkAccess('client');
  };
  
  // Fonction qui redirige vers la page appropriée en fonction du rôle
  const redirectToRoleDashboard = () => {
    if (auth.user && auth.user.role === 'admin') {
      return '/dashboard/admin';
    } else if (auth.user && auth.user.role === 'client') {
      return '/dashboard/client';
    } else {
      return '/login';
    }
  };
  
  return {
    ...auth, // Exposer toutes les fonctions et propriétés du contexte d'authentification
    checkAccess,
    canAccessAdmin,
    canAccessClient,
    redirectToRoleDashboard
  };
}
