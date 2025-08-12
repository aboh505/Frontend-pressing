'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';

// URL de l'API backend
const API_URL = 'http://localhost:5000/api';

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    // Validation du numéro de téléphone (doit commencer par 6 et avoir 9 chiffres)
    const phoneRegex = /^6[0-9]{8}$/;
    if (!phoneRegex.test(formData.telephone)) {
      toast.error('Le numéro de téléphone doit commencer par 6 et contenir 9 chiffres');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Tentative d\'enregistrement admin avec:', { 
        email: formData.email,
        nom: formData.nom,
        prenom: formData.prenom
      });
      
      // Envoyer les données au backend
      const response = await axios.post(`${API_URL}/admin/register`, {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password
      });
      
      console.log('Réponse d\'enregistrement:', response.data);
      
      if (response.data.success) {
        // Récupérer le token et les données utilisateur
        const token = response.data.token;
        const user = response.data.user;
        
        // Stocker le token et les informations utilisateur
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role
        }));
        
        toast.success('Compte administrateur créé avec succès!');
        
        // Redirection vers le dashboard
        setTimeout(() => {
          router.push('/admin/login');
        }, 500);
      } else {
        toast.error('Erreur lors de la création du compte');
      }
    } catch (error) {
      console.error('Erreur d\'enregistrement:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Créer un compte administrateur</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="nom" className="block text-gray-700 font-medium mb-2">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="prenom" className="block text-gray-700 font-medium mb-2">
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="telephone" className="block text-gray-700 font-medium mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.telephone}
              onChange={handleChange}
              required
              placeholder=""
            />
            <p className="text-xs text-gray-500 mt-1">Doit commencer par 6 et contenir 9 chiffres</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Créer le compte'}
          </button>
          
          <div className="mt-4 text-center">
            <Link href="/admin/login" className="text-black-600 hover:underline">
              Déjà un compte? Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
