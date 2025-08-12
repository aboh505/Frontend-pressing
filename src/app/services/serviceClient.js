'use client';

/**
 * Service pour gérer les services de pressing
 */

import config from '../config/api';
import authService from './authService';

const API_URL = config.apiBaseUrl;

/**
 * Service pour gérer les services de pressing
 */
const serviceClient = {
  /**
   * Créer un nouveau service
   * @param {Object} serviceData - Données du service
   * @returns {Promise<Object>} - Résultat de la création
   */
  createService: async (serviceData) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || 'Échec de la création du service',
          details: data.error 
        };
      }
      
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      console.error('Erreur createService:', error);
      return { success: false, error: 'Erreur lors de la création du service' };
    }
  },
  
  /**
   * Récupérer tous les services du client
   * @returns {Promise<Object>} - Liste des services
   */
  getClientServices: async () => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/services`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de la récupération des services' };
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Erreur getClientServices:', error);
      return { success: false, error: 'Erreur lors de la récupération des services' };
    }
  },
  
  /**
   * Récupérer un service spécifique
   * @param {string} serviceId - ID du service
   * @returns {Promise<Object>} - Détails du service
   */
  getServiceById: async (serviceId) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/services/${serviceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de la récupération du service' };
      }
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Erreur getServiceById:', error);
      return { success: false, error: 'Erreur lors de la récupération du service' };
    }
  },

  /**
   * Récupérer tous les types de services disponibles
   * @param {Object} params - Paramètres optionnels (pagination, catégorie, etc.)
   * @returns {Promise<Object>} - Liste des types de services
   */
  getServiceTypes: async (params = {}) => {
    try {
      // Construction de l'URL avec paramètres de requête
      let url = `${API_URL}/service-types`;
      const queryParams = new URLSearchParams();
      
      // Ajouter les paramètres s'ils sont fournis
      if (params.categorie) queryParams.append('categorie', params.categorie);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      
      // Ajouter les paramètres à l'URL si nécessaire
      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      
      // Les types de services sont publics, pas besoin de token
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.message || 'Échec de la récupération des types de services',
          details: data.error 
        };
      }
      
      return { success: true, data: data.data || data, pagination: data.pagination };
    } catch (error) {
      console.error('Erreur getServiceById:', error);
      return { success: false, error: 'Erreur lors de la récupération du service' };
    }
  },
  
  /**
   * Mettre à jour un service
   * @param {string} serviceId - ID du service
   * @param {Object} serviceData - Nouvelles données du service
   * @returns {Promise<Object>} - Résultat de la mise à jour
   */
  updateService: async (serviceId, serviceData) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de la mise à jour du service' };
      }
      
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      console.error('Erreur updateService:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du service' };
    }
  },
  
  /**
   * Annuler un service
   * @param {string} serviceId - ID du service
   * @returns {Promise<Object>} - Résultat de l'annulation
   */
  cancelService: async (serviceId) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/services/${serviceId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de l\'annulation du service' };
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Erreur cancelService:', error);
      return { success: false, error: 'Erreur lors de l\'annulation du service' };
    }
  },
  
  /**
   * Mettre à jour les informations de sécurité du client
   * @param {Object} securityData - Données de sécurité
   * @returns {Promise<Object>} - Résultat de la mise à jour
   */
  updateSecurity: async (securityData) => {
    try {
      const token = authService.getToken();
      
      const response = await fetch(`${API_URL}/users/security`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(securityData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.message || 'Échec de la mise à jour des informations de sécurité' };
      }
      
      return { success: true, message: data.message };
    } catch (error) {
      console.error('Erreur updateSecurity:', error);
      return { success: false, error: 'Erreur lors de la mise à jour des informations de sécurité' };
    }
  }
};

export default serviceClient;
