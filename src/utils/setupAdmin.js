/**
 * Script pour créer un utilisateur administrateur dans la base de données
 * 
 * Ce script peut être exécuté manuellement pour créer un utilisateur administrateur
 * si nécessaire. Il utilise l'API backend hébergée en ligne.
 */

const axios = require('axios');

const API_URL = 'https://pressing-api.onrender.com/api';
const DEBUG = true; // Activer les logs de débogage

// Données de l'administrateur à créer
const adminData = {
  nom: 'Admin',
  prenom: 'User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

async function createAdmin() {
  try {
    console.log('Tentative de création de l\'administrateur...');
    
    // Vérifier si l'utilisateur existe déjà
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: adminData.email,
        password: adminData.password
      });
      
      if (loginResponse.data.success) {
        console.log('L\'administrateur existe déjà et les identifiants sont valides.');
        return;
      }
    } catch (error) {
      // Si l'erreur est 401, l'utilisateur n'existe pas ou le mot de passe est incorrect
      console.log('L\'administrateur n\'existe pas ou les identifiants sont incorrects.');
    }
    
    // Créer l'utilisateur administrateur
    const response = await axios.post(`${API_URL}/auth/register`, adminData);
    
    if (response.data.success) {
      console.log('Administrateur créé avec succès!');
      console.log('Email:', adminData.email);
      console.log('Mot de passe:', adminData.password);
    } else {
      console.error('Erreur lors de la création de l\'administrateur:', response.data.message);
    }
  } catch (error) {
    console.error('Erreur:', error.response?.data?.message || error.message);
  }
}

// Exécuter la fonction
createAdmin();
