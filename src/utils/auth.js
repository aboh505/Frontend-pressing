import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://pressing-api.onrender.com/api';

// Fonction pour se connecter (utilisable par admin et client)
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.success) {
      const { token, user } = response.data.data;
      
      // Stocker le token et les informations utilisateur dans localStorage et cookies
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Cookies pour le middleware Next.js (7 jours d'expiration)
      Cookies.set('token', token, { expires: 7 });
      Cookies.set('user', JSON.stringify(user), { expires: 7 });
      
      return { success: true, data: { user, token } };
    }
    
    return { success: false, message: 'Échec de la connexion' };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Erreur lors de la connexion'
    };
  }
};

// Fonction pour vérifier si l'utilisateur est authentifié
export const isAuthenticated = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const token = localStorage.getItem('token');
  return !!token;
};

// Fonction pour vérifier si l'utilisateur est un administrateur
export const isAdmin = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;
  
  try {
    const user = JSON.parse(userStr);
    return user.role === 'admin';
  } catch (error) {
    return false;
  }
};

// Fonction pour vérifier si l'utilisateur est un client
export const isClient = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return false;
  
  try {
    const user = JSON.parse(userStr);
    return user.role === 'client';
  } catch (error) {
    return false;
  }
};

// Fonction pour se déconnecter
export const logout = () => {
  if (typeof window === 'undefined') {
    return;
  }
  
  // Supprimer les données du localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Supprimer les cookies
  Cookies.remove('token');
  Cookies.remove('user');
};

// Fonction pour obtenir le token d'authentification
export const getAuthToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('token');
};

// Fonction pour obtenir l'utilisateur actuel
export const getCurrentUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
};

// Fonction pour vérifier l'authentification admin avec l'API
export const checkAdminAuth = async () => {
  try {
    const token = getAuthToken();
    if (!token) return { success: false };
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.get(`${API_URL}/dashboard/check-auth`, config);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error };
  }
};

// Créer un intercepteur Axios pour ajouter automatiquement le token d'authentification
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Si l'erreur est 401 (non autorisé), déconnecter l'utilisateur
      if (error.response && error.response.status === 401) {
        logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
      return Promise.reject(error);
    }
  );
};
