'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaBell, FaLock, FaMapMarkerAlt, FaMobile, 
  FaEnvelope, FaSave, FaToggleOn, FaToggleOff, FaSpinner,
  FaEye, FaEyeSlash
} from 'react-icons/fa';
import authService from '../../services/authService';
import serviceClient from '../../services/serviceClient';

export default function Page() {
  // États pour les formulaires
  const [profileData, setProfileData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: ''
  });

  const [securite, setSecurite] = useState({
    motDePasse: '',
    nouveauMotDePasse: '',
    confirmationMotDePasse: ''
  });
  
  // États pour la visibilité des mots de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // États pour gérer les chargements et les erreurs
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Vérifier si l'utilisateur est authentifié et charger ses données
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const user = authService.getCurrentUser();
        if (user) {
          setProfileData({
            nom: user.nom || '',
            prenom: user.prenom || '',
            email: user.email || '',
            telephone: user.telephone || '',
            adresse: user.adresse || ''
          });
        }
      }
    };
    
    checkAuth();
  }, []);

  // Gestionnaires d'événements
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecuriteChange = (e) => {
    const { name, value } = e.target;
    setSecurite(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour modifier votre profil');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Note: Cette fonctionnalité n'est pas encore implémentée dans l'API
      // Simulons une mise à jour réussie pour le moment
      setTimeout(() => {
        setSuccess('Profil mis à jour avec succès !');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setError('Une erreur est survenue lors de la mise à jour du profil');
      setIsLoading(false);
    }
  };

  const handleSecuriteSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour modifier votre mot de passe');
      return;
    }
    
    // Validation des mots de passe
    if (!securite.motDePasse) {
      setError('Veuillez entrer votre mot de passe actuel');
      return;
    }
    
    if (!securite.nouveauMotDePasse) {
      setError('Veuillez entrer un nouveau mot de passe');
      return;
    }
    
    if (securite.nouveauMotDePasse !== securite.confirmationMotDePasse) {
      setError('Les mots de passe ne correspondent pas !');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await serviceClient.updateSecurity({
        currentPassword: securite.motDePasse,
        newPassword: securite.nouveauMotDePasse
      });
      
      if (result.success) {
        setSuccess('Mot de passe modifié avec succès !');
        setSecurite({ motDePasse: '', nouveauMotDePasse: '', confirmationMotDePasse: '' });
      } else {
        setError(result.error || 'Une erreur est survenue lors de la modification du mot de passe');
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la modification du mot de passe');
      console.error('Exception:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-16 p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panneau de navigation des paramètres */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Paramètres</h2>
            <nav>
              <ul className="space-y-2">
                {/* <li>
                  <a href="#profile" className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg">
                    <FaUser className="mr-3" />
                    <span>Profil Personnel</span>
                  </a>
                </li> */}
            
                <li>
                  <a href="#security" className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                    <FaLock className="mr-3" />
                    <span>Sécurité</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Contenu principal des paramètres */}
        <div className="lg:col-span-2 space-y-6">
       

          {/* Section Sécurité */}
          <div id="security" className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Sécurité du Compte</h2>
            
            {!isAuthenticated ? (
              <div className="p-4 bg-amber-50 text-amber-700 rounded-md">
                Vous devez être connecté pour modifier vos paramètres de sécurité.
              </div>
            ) : (
              <form onSubmit={handleSecuriteSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 rounded border border-red-200 text-red-700">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="p-3 bg-green-50 rounded border border-green-200 text-green-700">
                    {success}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="motDePasse"
                      value={securite.motDePasse}
                      onChange={handleSecuriteChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                    <div 
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    >
                      {showCurrentPassword ? (
                        <FaEyeSlash className="text-gray-500 " />
                      ) : (
                        <FaEye className="text-gray-500 " />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="nouveauMotDePasse"
                      value={securite.nouveauMotDePasse}
                      onChange={handleSecuriteChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                    <div 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    >
                      {showNewPassword ? (
                        <FaEyeSlash className="text-gray-500 " />
                      ) : (
                        <FaEye className="text-gray-500 " />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmationMotDePasse"
                      value={securite.confirmationMotDePasse}
                      onChange={handleSecuriteChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                    />
                    <div 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-gray-500 " />
                      ) : (
                        <FaEye className="text-gray-500 " />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        <FaLock className="mr-2" />
                        Modifier le mot de passe
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
