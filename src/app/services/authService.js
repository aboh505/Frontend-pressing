'use client';

/**
 * Service d'authentification pour interagir avec l'API backend
 */

// URL de base de l'API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Import du helper d'authentification
import authHelper from './authHelper';

/**
 * Service d'authentification simplifié
 */
const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} - Résultat de l'inscription
   */
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de l\'inscription' };
      }
      
      return { success: true, message: 'Inscription réussie' };
    } catch (error) {
      console.error('Erreur register:', error);
      return { success: false, error: 'Erreur lors de l\'inscription' };
    }
  },
  
  /**
   * Connexion d'un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise<Object>} - Résultat de la connexion
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de la connexion' };
      }
      
      // Stocker le token et les informations utilisateur
      authHelper.setUserData(data.user, data.token);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erreur login:', error);
      return { success: false, error: 'Erreur lors de la connexion' };
    }
  },
  
  /**
   * Déconnexion de l'utilisateur
   */
  logout: () => {
    authHelper.clearUserData();
  },
  
  /**
   * Récupération de l'utilisateur actuel
   * @returns {Object|null} - Utilisateur connecté ou null
   */
  getCurrentUser: () => {
    return authHelper.getCurrentUser();
  },
  
  /**
   * Vérification si l'utilisateur est authentifié
   * @returns {boolean} - true si l'utilisateur est authentifié
   */
  isAuthenticated: () => {
    return authHelper.isAuthenticated();
  },
  
  /**
   * Récupération du token d'authentification
   * @returns {string|null} - Token d'authentification
   */
  getToken: () => {
    return authHelper.getToken();
  }
};

export default authService;
