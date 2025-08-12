'use client';

/**
 * Service d'authentification administrateur pour interagir avec l'API backend
 */

// Import de la configuration API
import config from '../config/api';

/**
 * Service d'authentification administrateur
 */
const adminAuthService = {
  /**
   * Connexion d'un administrateur
   * @param {string} email - Email de l'administrateur
   * @param {string} password - Mot de passe de l'administrateur
   * @returns {Promise<Object>} - Résultat de la connexion
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de la connexion administrateur' };
      }
      
      // Stocker le token et les informations administrateur
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      localStorage.setItem('userRole', 'admin');
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erreur login admin:', error);
      return { success: false, error: 'Erreur lors de la connexion administrateur' };
    }
  },
  
  /**
   * Déconnexion de l'administrateur
   */
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('userRole');
  },
  
  /**
   * Récupération de l'administrateur actuel
   * @returns {Object|null} - Administrateur connecté ou null
   */
  getCurrentAdmin: () => {
    try {
      const adminUser = localStorage.getItem('adminUser');
      return adminUser ? JSON.parse(adminUser) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données admin:', error);
      return null;
    }
  },
  
  /**
   * Vérification si l'administrateur est authentifié
   * @returns {boolean} - true si l'administrateur est authentifié
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  /**
   * Récupération du token d'authentification administrateur
   * @returns {string|null} - Token d'authentification
   */
  getToken: () => {
    return localStorage.getItem('adminToken');
  }
};

export default adminAuthService;
