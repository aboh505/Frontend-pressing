'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';
import DashboardNavbar from '@/app/dashboard/components/DashboardNavbar';

// URL de l'API backend
const API_URL = 'http://localhost:5000/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'administrateur est déjà connecté
    const verifyAdminAuth = () => {
      try {
        // Vérifier si l'utilisateur est un admin directement depuis le localStorage
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userStr && token) {
          const user = JSON.parse(userStr);
          if (user.role === 'admin') {
            console.log('Utilisateur admin déjà connecté, redirection vers le dashboard...');
            router.push('/admin/dashboard');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        // Nettoyer le localStorage en cas d'erreur
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };
    
    verifyAdminAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Tentative de connexion admin avec:', { email });
      
      // Connexion directe avec l'API en utilisant la route standard
      // Nous vérifierons le rôle après la connexion
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('Réponse de connexion:', response.data);
      
      // Vérifier si la connexion a réussi
      if (!response.data.success) {
        throw new Error(response.data.message || 'Erreur de connexion');
      }
      
      if (response.data.success) {
        // Vérifier que la structure de la réponse est correcte
        if (!response.data.data) {
          console.error('Structure de réponse inattendue:', response.data);
          toast.error('Erreur lors de la connexion: structure de réponse incorrecte');
          setLoading(false);
          return;
        }
        
        // Extraire les données utilisateur et le token
        const userData = response.data.data;
        const token = userData.token;
        
        console.log('Données utilisateur reçues:', userData);
        
        // Vérifier si l'utilisateur est un administrateur
        if (!userData.role || userData.role !== 'admin') {
          toast.error('Accès non autorisé. Vous devez être administrateur pour accéder au tableau de bord.');
          setLoading(false);
          return;
        }
        
        // Stocker le token et les informations utilisateur
        localStorage.setItem('token', token);
        
        // Créer un objet utilisateur sans le token pour le localStorage
        const userForStorage = {
          id: userData.id,
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          role: userData.role
        };
        
        localStorage.setItem('user', JSON.stringify(userForStorage));
        
        toast.success('Connexion réussie !');
        console.log('Redirection vers le dashboard après connexion...');
        
        // Redirection vers le dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        toast.error('Identifiants incorrects');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <DashboardNavbar/>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion Administrateur</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
          
          
          <div className="mt-4 text-center">
            <Link href="/admin/register" className="text-black-600 hover:underline">
              Pas encore de compte? Créer un compte administrateur
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
