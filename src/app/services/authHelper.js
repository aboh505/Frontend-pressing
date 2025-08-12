'use client';

/**
 * Service d'authentification sécurisé pour interagir avec l'API backend
 * Version simplifiée
 */

/**
 * Vérifie si le code s'exécute côté client (navigateur)
 * @returns {boolean} true si côté client, false si côté serveur
 */
const isClient = typeof window !== 'undefined';

/**
 * Service d'authentification simplifié
 */
const authHelper = {
  /**
   * Récupère l'utilisateur depuis le localStorage
   */
  getCurrentUser: () => {
    if (!isClient) return null;
    
    try {
      const userStr = window.localStorage.getItem('user');
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erreur lors de la récupération utilisateur:', error);
      return null;
    }
  },
  
  /**
   * Récupère le token depuis le localStorage
   */
  getToken: () => {
    if (!isClient) return null;
    
    try {
      return window.localStorage.getItem('token');
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  },
  
  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated: () => {
    return !!authHelper.getToken();
  },
  
  /**
   * Stocke les données utilisateur
   */
  setUserData: (user, token) => {
    if (!isClient) return;
    
    try {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Erreur lors du stockage des données utilisateur:', error);
    }
  },
  
  /**
   * Supprime les données utilisateur
   */
  clearUserData: () => {
    if (!isClient) return;
    
    try {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la suppression des données utilisateur:', error);
    }
  }
};

export default authHelper;
