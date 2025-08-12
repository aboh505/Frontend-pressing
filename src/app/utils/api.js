// Utilitaire pour les appels API
// Cette classe centralise tous les appels API de l'application

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.washgo.fr/api/v1';

class Api {
  constructor() {
    this.baseUrl = API_URL;
  }

  // Méthode pour récupérer le token d'authentification stocké
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('washgo_token');
    }
    return null;
  }

  // Préparation des en-têtes avec authentification si un token est disponible
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Méthode générique pour effectuer des requêtes
  async fetchApi(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // Fusionner les en-têtes par défaut avec ceux fournis dans les options
      const headers = {
        ...this.getHeaders(),
        ...(options.headers || {}),
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Pour les réponses 204 No Content
      if (response.status === 204) {
        return { success: true };
      }

      // Extraire les données JSON
      const data = await response.json();

      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new Error(data.message || 'Une erreur s\'est produite');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Méthodes pour les différents types de requêtes
  async get(endpoint, queryParams = {}) {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.fetchApi(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.fetchApi(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.fetchApi(endpoint, {
      method: 'DELETE',
    });
  }

  // ========== API d'authentification ==========
  async login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  async updateProfile(userData) {
    return this.put('/auth/profile', userData);
  }

  // ========== API des services ==========
  async getServices(params = {}) {
    return this.get('/services', params);
  }

  async getServiceById(id) {
    return this.get(`/services/${id}`);
  }

  async createService(serviceData) {
    return this.post('/services', serviceData);
  }

  async updateService(id, serviceData) {
    return this.put(`/services/${id}`, serviceData);
  }

  async deleteService(id) {
    return this.delete(`/services/${id}`);
  }

  // ========== API des commandes ==========
  async getCommandes(params = {}) {
    return this.get('/commandes', params);
  }

  async getCommandeById(id) {
    return this.get(`/commandes/${id}`);
  }

  async createCommande(commandeData) {
    return this.post('/commandes', commandeData);
  }

  async updateCommande(id, commandeData) {
    return this.put(`/commandes/${id}`, commandeData);
  }

  async updateCommandeStatus(id, status) {
    return this.put(`/commandes/${id}/status`, { status });
  }

  async deleteCommande(id) {
    return this.delete(`/commandes/${id}`);
  }

  // ========== API des clients ==========
  async getClients(params = {}) {
    return this.get('/clients', params);
  }

  async getClientById(id) {
    return this.get(`/clients/${id}`);
  }

  async createClient(clientData) {
    return this.post('/clients', clientData);
  }

  async updateClient(id, clientData) {
    return this.put(`/clients/${id}`, clientData);
  }

  async deleteClient(id) {
    return this.delete(`/clients/${id}`);
  }

  // ========== API des statistiques ==========
  async getStatistiques(periode = 'mois') {
    return this.get('/stats', { periode });
  }

  async getStatistiquesChiffreAffaires(params = {}) {
    return this.get('/stats/chiffre-affaires', params);
  }

  async getStatistiquesCommandes(params = {}) {
    return this.get('/stats/commandes', params);
  }

  async getStatistiquesClients(params = {}) {
    return this.get('/stats/clients', params);
  }
}

// Exporter une instance unique de la classe Api
export default new Api();
