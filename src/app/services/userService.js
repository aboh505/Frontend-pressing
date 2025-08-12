'use client';

/**
 * Service pour gérer les utilisateurs
 */

import config from '../config/api';
import authService from './authService';

const API_URL = config.apiBaseUrl;

/**
 * Service pour gérer les utilisateurs
 */
const userService = {
  /**
   * Récupérer le profil de l'utilisateur
   * @returns {Promise<Object>} - Profil de l'utilisateur
   */
  getUserProfile: async () => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de la récupération du profil' };
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Erreur getUserProfile:', error);
      return { success: false, error: 'Erreur lors de la récupération du profil' };
    }
  },
  
  /**
   * Mettre à jour le profil de l'utilisateur
   * @param {Object} profileData - Nouvelles données du profil
   * @returns {Promise<Object>} - Résultat de la mise à jour
   */
  updateUserProfile: async (profileData) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de la mise à jour du profil' };
      }
      
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      console.error('Erreur updateUserProfile:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du profil' };
    }
  }
};

export default userService;
