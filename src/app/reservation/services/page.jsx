'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaShirtsinbulk, FaTshirt, FaCheck, FaClock, FaInfoCircle, FaShoppingBag, FaSpinner, FaSync, FaCoins, FaCalendarAlt } from 'react-icons/fa';
import serviceClient from '../../services/serviceClient';
import authService from '../../services/authService';
import axios from 'axios';
import config from '../../config/api';
import { toast } from 'react-toastify';

// URL de l'API backend
const API_URL = config.apiBaseUrl;

export default function Page() {
  // États pour le formulaire de réservation
  const [selectedService, setSelectedService] = useState('');
  const [quantite, setQuantite] = useState(1);
  const [description, setDescription] = useState('');
  const [adresse, setAdresse] = useState('');
  const [montant, setMontant] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [clientServices, setClientServices] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  
  // États pour les types de services
  const [serviceTypes, setServiceTypes] = useState([]);
  const [loadingServiceTypes, setLoadingServiceTypes] = useState(true);
  const [serviceTypeError, setServiceTypeError] = useState(null);
  
  // Map des icônes selon le type de service
  const serviceIcons = {
    'Lavage': <FaShirtsinbulk className="text-amber-500" />,
    'Repassage': <FaTshirt className="text-amber-500" />,
    'Nettoyage à sec': <FaShoppingBag className="text-amber-500" />,
    'Teinture': <FaShirtsinbulk className="text-amber-500" />,
    'Blanchisserie': <FaShirtsinbulk className="text-amber-500" />,
    'Lavage Pro': <FaShirtsinbulk className="text-amber-500" />,
    'Lavage au kg': <FaShoppingBag className="text-amber-500" />
  };
  
  // Helper pour obtenir l'icône appropriée selon le type de service
  const getServiceIcon = (categorie, nom) => {
    if (serviceIcons[categorie]) return serviceIcons[categorie];
    if (serviceIcons[nom]) return serviceIcons[nom];
    return <FaShoppingBag className="text-amber-500" />; // Icône par défaut
  };
  
  // Helper pour obtenir le délai formaté selon le type de service
  const getServiceDelai = (nom, uniteTemps) => {
    // Délais spécifiques pour certains types de service
    const delaisSpecifiques = {
      'Lavage au kg': '5 jours',
      'Blanchisserie': '72h',
      'Repassage': '24h',
      'Lavage Pro': '48h'
    };
    
    // Retourner le délai spécifique s'il existe, sinon un délai par défaut basé sur l'unité de temps
    return delaisSpecifiques[nom] || (uniteTemps === 'heures' ? '24h' : '2-3 jours');
  };
  // Vérifier si l'utilisateur est authentifié et charger ses services
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        loadClientServices();
      }
    };
    
    checkAuth();
    loadServiceTypes(); // Charger les types de services disponibles
  }, []);
  
  // Fonction pour charger les types de services depuis l'API
  const loadServiceTypes = async () => {
    setLoadingServiceTypes(true);
    setServiceTypeError(null);
    
    try {
      // Vérifier si un token est disponible pour l'authentification
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Utiliser le même endpoint que dans le dashboard admin
      // Note: L'API devrait idéalement avoir un endpoint public, mais nous utilisons
      // celui existant pour le moment
      const response = await axios.get(`${API_URL}/admin/service-types`, {
        params: {
          // Pas de pagination pour afficher tous les services disponibles
          limit: 100
        },
        headers
      });
      
      if (response.data && response.data.data) {
        // Transformer les données pour correspondre au format attendu
        const formattedServices = Array.isArray(response.data.data) 
          ? response.data.data.map(service => ({
            id: service._id || service.id,
            nom: service.nom,
            prix: service.prixBase || 0,
            delai: getServiceDelai(service.nom, service.uniteTemps),
            description: service.description,
            categorie: service.categorie,
            uniteTemps: service.uniteTemps || 'heures'
          }))
          : [];
          
        console.log('Types de services chargés:', formattedServices);
        setServiceTypes(formattedServices);
      } else {
        console.error('Format de réponse API inattendu:', response);
        setServiceTypeError('Format de réponse API inattendu');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des types de services:', error);
      setServiceTypeError('Impossible de charger les services. Veuillez réessayer plus tard.');
    } finally {
      setLoadingServiceTypes(false);
    }
  };
  
  // Charger les services du client
  const loadClientServices = async () => {
    setLoadingServices(true);
    try {
      const result = await serviceClient.getClientServices();
      if (result.success) {
        setClientServices(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
    } finally {
      setLoadingServices(false);
    }
  };
  
  // Fonctions de gestion du formulaire
  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);
    const selectedServiceItem = serviceTypes.find(s => s.id === serviceId);
    if (selectedServiceItem) {
      setMontant(selectedServiceItem.prix * quantite);
    }
  };
  
  const handleQuantiteChange = (value) => {
    const qty = parseInt(value) || 1;
    setQuantite(qty);
    if (selectedService) {
      const selectedServiceItem = serviceTypes.find(s => s.id === selectedService);
      if (selectedServiceItem) {
        setMontant(selectedServiceItem.prix * qty);
      }
    }
  };
  
  // Actualiser les types de services
  const refreshServiceTypes = () => {
    loadServiceTypes();
    toast.info('Liste des services actualisée');
  };
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour réserver un service');
      return;
    }
    
    if (!selectedService) {
      setError('Veuillez sélectionner un service');
      return;
    }
    
    if (!adresse) {
      setError('Veuillez fournir une adresse');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    // Récupérer les détails du service sélectionné
    const selectedServiceItem = serviceTypes.find(s => s.id === selectedService);
    
    const serviceData = {
      typeService: selectedServiceItem ? selectedServiceItem.nom : selectedService,
      date: new Date().toISOString(),
      quantite,
      adresse,
      montant,
      description,
      // Ajouter des informations supplémentaires du type de service
      serviceTypeId: selectedService,
      categorie: selectedServiceItem?.categorie,
      uniteTemps: selectedServiceItem?.uniteTemps || 'heures'
    };
    
    try {
      const result = await serviceClient.createService(serviceData);
      
      if (result.success) {
        setSuccess('Votre service a été enregistré avec succès!');
        toast.success('Service réservé avec succès! Redirection vers vos commandes...');
        // Réinitialiser le formulaire
        setSelectedService('');
        setQuantite(1);
        setDescription('');
        setAdresse('');
        setMontant(0);
        
        // Recharger les services du client
        loadClientServices();
        
        // Rediriger vers la page des commandes après 1.5 secondes
        setTimeout(() => {
          router.push('/reservation/commande/commandes');
        }, 1500);
      } else {
        setError(result.error || 'Une erreur est survenue lors de la création du service');
        toast.error(result.error || 'Échec de la réservation');
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la création du service');
      console.error('Exception:', error);
      toast.error('Une erreur est survenue lors de la réservation');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Avantages du service
  const avantages = [
    { titre: 'Rapidité', description: 'Service express disponible en 24h', icon: <FaClock className="text-amber-50" /> },
    { titre: 'Qualité', description: 'Processus professionnel de nettoyage', icon: <FaCheck className="text-amber-50" /> },
    { titre: 'Suivi', description: 'Suivez l\'état de votre commande en temps réel', icon: <FaInfoCircle className="text-amber-50" /> },
  ];
  return (
    <div className="mt-15 p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-700">Réservation de Services</h1>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-green-700">Oceane Pressing</h2>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Message de bienvenue */}
      <div className="bg-gradient-to-r from-green-700 to-green-400 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bienvenue chez Oceane Pressing</h2>
        <p className="text-lg mb-4">Nous prenons soin de vos vêtements avec le plus grand professionnalisme.</p>
        <div className="flex flex-wrap -mx-2">
          {avantages.map((avantage, index) => (
            <div key={index} className="px-2 w-full md:w-1/3 mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="mr-3 text-xl">{avantage.icon}</div>
                <div>
                  <h3 className="font-semibold">{avantage.titre}</h3>
                  <p className="text-sm text-amber-100">{avantage.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Zone principale avec les services à gauche et le formulaire à droite */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sélection des services - Colonne de gauche */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Sélectionner un service</h2>
              <button 
                onClick={refreshServiceTypes}
                className="flex items-center text-sm text-amber-600 hover:text-amber-700"
                disabled={loadingServiceTypes}
              >
                <FaSync className={`mr-1 ${loadingServiceTypes ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
            
            {loadingServiceTypes ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin text-amber-600 text-2xl" />
                <span className="ml-2 text-gray-600">Chargement des services disponibles...</span>
              </div>
            ) : serviceTypeError ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                <p>{serviceTypeError}</p>
                <button 
                  onClick={refreshServiceTypes}
                  className="mt-2 text-sm text-red-700 underline hover:no-underline"
                >
                  Réessayer
                </button>
              </div>
            ) : serviceTypes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun service disponible pour le moment.</p>
                <button 
                  onClick={refreshServiceTypes}
                  className="mt-2 text-sm text-amber-600 underline hover:no-underline"
                >
                  Rafraîchir
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceTypes.map(service => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceChange(service.id)}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${selectedService === service.id ? 'bg-amber-50 border-amber-500 shadow-md' : 'hover:bg-gray-50 border-gray-200'}`}
                  >
                    <div className="text-2xl mb-2">
                      {getServiceIcon(service.categorie, service.nom)}
                    </div>
                    <h3 className="font-medium">{service.nom}</h3>
                    <div className="mt-2 text-sm text-gray-600 flex items-center">
                      <FaCoins className="mr-1 text-amber-500" /> {service.prix.toLocaleString()} FCFA
                    </div>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <FaClock className="mr-1 text-amber-500" /> 
                      {service.uniteTemps === 'heures' ? 'Base horaire' : 'Base journalière'}
                    </div>
                    <div className="mt-1 flex items-center text-xs font-medium text-green-600">
                      <FaCalendarAlt className="mr-1" /> 
                      Délai: {service.delai}
                    </div>
                    {service.description && (
                      <div className="mt-1 px-2 py-1 bg-gray-50 rounded text-xs text-gray-600 text-center">
                        {service.description.substring(0, 40)}{service.description.length > 40 ? '...' : ''}
                      </div>
                    )}
                    {selectedService === service.id && (
                      <div className="mt-2">
                        <FaCheck className="text-amber-500" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Formulaire de réservation - Colonne de droite */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Réserver maintenant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedService && (
                <div className="p-3 bg-amber-50 rounded border border-amber-200">
                  <p className="font-medium">
                    {serviceTypes.find(s => s.id === selectedService)?.nom}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="flex items-center">
                      <FaCoins className="mr-1 text-amber-500" />
                      {serviceTypes.find(s => s.id === selectedService)?.prix} FCFA/pièce
                    </span>
                  </p>
                </div>
              )}
              
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
                <label className="block text-sm font-medium text-gray-700">Combien d'habits avez-vous?</label>
                <input 
                  type="number" 
                  min="1" 
                  value={quantite} 
                  onChange={(e) => handleQuantiteChange(e.target.value)} 
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse de livraison: </label>
                <textarea 
                  value={adresse} 
                  onChange={(e) => setAdresse(e.target.value)} 
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  rows="2"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description (optionnel)</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  rows="3"
                  placeholder="Précisez des détails sur vos vêtements ..."
                ></textarea>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Montant total:</span>
                  <span className="font-bold text-lg text-amber-600">{montant.toLocaleString()} FCFA</span>
                </div>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
                  disabled={isLoading || !selectedService}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    'Réserver le service'
                  )}
                </button>
              </div>
              
              {!isAuthenticated && (
                <div className="text-sm text-center text-red-600">
                  Vous devez être connecté pour réserver un service
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
