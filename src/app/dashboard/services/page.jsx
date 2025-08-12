'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaFilter, FaEdit, FaTrash, FaPlus, 
  FaCheckCircle, FaSpinner, FaExclamationTriangle, FaEye
} from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import config from '../../config/api';

// URL de l'API backend centralisée
const API_URL = config.apiBaseUrl;

export default function ServicesPage() {
  // États pour stocker les données et l'état de l'interface
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  
  // États pour les catégories disponibles
  const [categories, setCategories] = useState([
    'Tous', 'Lavage', 'Repassage', 'Nettoyage à sec', 'Teinture', 'Autre'
  ]);
  const [activeCategory, setActiveCategory] = useState('Tous');
  
  // État pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour la gestion des services
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Service vide par défaut avec structure simplifiée selon notre nouveau schema
  const defaultServiceState = {
    nom: '',
    description: '',
    prixBase: 0,
    uniteTemps: 'heures',
    categorie: 'Autre'
  };
  
  // États pour les formulaires d'ajout et d'édition
  const [newService, setNewService] = useState({...defaultServiceState});
  const [selectedService, setSelectedService] = useState(null);
  
  // État pour les erreurs de validation
  const [formErrors, setFormErrors] = useState({});
  
  // Validation du formulaire avant soumission selon le schema simplifié
  const validateServiceForm = (service) => {
    const errors = {};
    
    // Validations obligatoires
    if (!service.nom) errors.nom = 'Le nom du service est obligatoire';
    if (!service.description) errors.description = 'La description est obligatoire';
    if (!service.prixBase && service.prixBase !== 0) errors.prixBase = 'Le prix de base est obligatoire';
    if (service.prixBase < 0) errors.prixBase = 'Le prix ne peut pas être négatif';
    if (!service.categorie) errors.categorie = 'La catégorie est obligatoire';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Fonction pour gérer les changements dans le formulaire principal
  const handleServiceChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;
    
    setNewService(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };
  
  // Fonction pour gérer les changements dans le service sélectionné
  const handleSelectedServiceChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;
    
    setSelectedService(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };
  
  // Fonctions CRUD pour l'API
  const fetchServices = async () => {
    setLoading(true);
    try {
      // Préparer les paramètres de requête
      let params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (activeCategory !== 'Tous') {
        params.categorie = activeCategory;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Vérifier si un token est disponible pour l'authentification
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_URL}/admin/service-types`, { 
        params,
        headers
      });
      
      if (response.data && Array.isArray(response.data.data)) {
        setServices(response.data.data);
        
        // Mettre à jour la pagination si elle est fournie
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
        
        // Extraire toutes les catégories uniques des services
        const uniqueCategories = ['Tous', ...new Set(response.data.data
          .map(s => s.categorie)
          .filter(Boolean))];
        setCategories(uniqueCategories);
        
        setError(null);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des services:', err);
      setError('Impossible de charger les services');
      toast.error('Erreur lors du chargement des services');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour ajouter un nouveau service
  const addService = async () => {
    // Validation du formulaire
    if (!validateServiceForm(newService)) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Vérifier si un token est disponible pour l'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur pour ajouter un service');
        return;
      }
      
      // S'assurer que l'unité de temps est bien définie
      const serviceData = {
        ...newService,
        uniteTemps: newService.uniteTemps || 'heures' // Valeur par défaut si non définie
      };
      
      const response = await axios.post(`${API_URL}/admin/service-types`, serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        toast.success('Service ajouté avec succès');
        setShowAddModal(false);
        setNewService({...defaultServiceState});
        fetchServices();
      } else {
        throw new Error(response.data?.message || 'Erreur lors de l\'ajout du service');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout du service:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'ajout du service';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour mettre à jour un service existant
  const updateService = async () => {
    if (!selectedService) return;
    
    // Validation du formulaire
    if (!validateServiceForm(selectedService)) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Vérifier si un token est disponible pour l'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur pour modifier un service');
        setIsSubmitting(false);
        return;
      }
      
      // S'assurer que nous avons un ID valide
      const serviceId = selectedService._id || selectedService.id;
      if (!serviceId) {
        throw new Error('ID du service manquant');
      }
      
      console.log('Mise à jour du service avec ID:', serviceId);
      console.log('Données envoyées:', selectedService);
      
      // S'assurer que l'unité de temps est bien définie
      const serviceData = {
        ...selectedService,
        uniteTemps: selectedService.uniteTemps || 'heures' // Valeur par défaut si non définie
      };
      
      const response = await axios.put(`${API_URL}/admin/service-types/${serviceId}`, serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        toast.success('Service mis à jour avec succès');
        setShowEditModal(false);
        setSelectedService(null);
        fetchServices();
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la mise à jour du service');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du service:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la mise à jour du service';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour supprimer un service
  const deleteService = async () => {
    if (!selectedService) return;
    
    setIsSubmitting(true);
    try {
      // Vérifier si un token est disponible pour l'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur pour supprimer un service');
        setIsSubmitting(false);
        return;
      }
      
      // S'assurer que nous avons un ID valide
      const serviceId = selectedService._id || selectedService.id;
      if (!serviceId) {
        throw new Error('ID du service manquant');
      }
      
      console.log('Suppression du service avec ID:', serviceId);
      
      const response = await axios.delete(`${API_URL}/admin/service-types/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        toast.success('Service supprimé avec succès');
        setShowDeleteModal(false);
        setSelectedService(null);
        fetchServices();
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la suppression du service');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression du service:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la suppression du service';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonctions d'initialisation des modaux
  const initAddService = () => {
    setNewService({...defaultServiceState});
    setFormErrors({});
    setShowAddModal(true);
  };
  
  const initEditService = (service) => {
    setSelectedService({...service});
    setFormErrors({});
    setShowEditModal(true);
  };
  
  const initDeleteService = (service) => {
    setSelectedService({...service});
    setShowDeleteModal(true);
  };
  
  // Fonction pour changer de page
  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  // Fonction pour changer la catégorie active
  const changeCategory = (category) => {
    setActiveCategory(category);
  };
  
  // Fonction pour effectuer une recherche
  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices();
  };
  
  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.info('Vous n\'\u00eates pas connecté en tant qu\'administrateur. Certaines fonctionnalités sont limitées.');
      }
    };
    
    checkAuth();
  }, []);
  
  // Charger les services au chargement et quand les filtres changent
  useEffect(() => {
    fetchServices();
  }, [pagination.page, pagination.limit, activeCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Entête avec titre et bouton d'ajout */}
      <div className="mt-10 flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Services</h1>
        <button
          onClick={initAddService}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
          disabled={isSubmitting}
        >
          <FaPlus className="mr-2" /> Ajouter un Service
        </button>
      </div>
      
      {/* Section de recherche et filtres */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un service..."
                className="w-full p-3 pl-10 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-1 rounded"
              >
                <FaSearch />
              </button>
            </div>
          </form>
          
          {/* Filtres */}
          <div className="flex items-center gap-3">
            <FaFilter className="text-gray-500" />
            <span className="text-gray-700">Catégories:</span>
            <select
              className="p-2 border rounded-md"
              value={activeCategory}
              onChange={(e) => changeCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={`category-${category}`} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Affichage des services */}
      <div className="bg-white p-4 rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="text-blue-500 text-4xl animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">
            <FaExclamationTriangle className="text-6xl mx-auto mb-4" />
            <p>{error}</p>
            <button 
              onClick={fetchServices}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Réessayer
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p>Aucun service trouvé. Ajoutez votre premier service!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Nom</th>
                    <th className="p-3 text-left">Catégorie</th>
                    <th className="p-3 text-left">Prix</th>
                    <th className="p-3 text-left">Unité de temps</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service._id || `service-${index}-${service.nom}`} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-semibold">{service.nom}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                      </td>
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          {service.categorie}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{service.prixBase.toLocaleString()} Cfa</div>
                        <div className="text-xs text-gray-500">par {service.uniteTemps === 'heures' ? 'heure' : service.uniteTemps === 'jours' ? 'jour' : service.uniteTemps}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium flex items-center justify-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {service.uniteTemps === 'heures' ? 'Heures' : service.uniteTemps === 'jours' ? 'Jours' : service.uniteTemps}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => initEditService(service)}
                            className="p-1 text-green-500 hover:bg-green-100 rounded"
                            title="Éditer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => initDeleteService(service)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                            title="Supprimer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => changePage(Math.max(1, pagination.page - 1))}
                    disabled={pagination.page === 1}
                    className={`px-3 py-1 rounded ${pagination.page === 1 ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-100'}`}
                  >
                    Précédent
                  </button>
                  
                  {[...Array(pagination.pages)].map((_, index) => (
                    <button
                      key={`page-${index + 1}`}
                      onClick={() => changePage(index + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded ${pagination.page === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => changePage(Math.min(pagination.pages, pagination.page + 1))}
                    disabled={pagination.page === pagination.pages}
                    className={`px-3 py-1 rounded ${pagination.page === pagination.pages ? 'text-gray-400' : 'text-blue-500 hover:bg-blue-100'}`}
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal d'ajout de service */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">Ajouter un nouveau service</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="nom"
                value={newService.nom}
                onChange={handleServiceChange}
                className={`w-full p-2 border rounded ${formErrors.nom ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nom du service"
              />
              {formErrors.nom && <p className="text-red-500 text-xs mt-1">{formErrors.nom}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={newService.description}
                onChange={handleServiceChange}
                className={`w-full p-2 border rounded ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                rows="3"
                placeholder="Description du service"
              />
              {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base</label>
                <input
                  type="number"
                  name="prixBase"
                  value={newService.prixBase}
                  onChange={handleServiceChange}
                  className={`w-full p-2 border rounded ${formErrors.prixBase ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0"
                  min="0"
                />
                {formErrors.prixBase && <p className="text-red-500 text-xs mt-1">{formErrors.prixBase}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unité de temps</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <select
                    name="uniteTemps"
                    value={newService.uniteTemps || 'heures'}
                    onChange={handleServiceChange}
                    className="w-full p-2 pl-10 border border-gray-300 rounded bg-amber-50 border-amber-300 font-medium"
                  >
                    <option key="add-heures" value="heures">Heures</option>
                    <option key="add-jours" value="jours">Jours</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-amber-600">Cette unité détermine la base de facturation du service</p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="categorie"
                value={newService.categorie}
                onChange={handleServiceChange}
                className={`w-full p-2 border rounded ${formErrors.categorie ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option key="add-cat-default" value="">Sélectionner une catégorie</option>
                <option key="add-cat-lavage" value="Lavage">Lavage</option>
                <option key="add-cat-repassage" value="Repassage">Repassage</option>
                <option key="add-cat-nettoyage" value="Nettoyage à sec">Nettoyage à sec</option>
                <option key="add-cat-teinture" value="Teinture">Teinture</option>
                <option key="add-cat-autre" value="Autre">Autre</option>
              </select>
              {formErrors.categorie && <p className="text-red-500 text-xs mt-1">{formErrors.categorie}</p>}
            </div>
            
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={addService}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal d'édition de service */}
      {showEditModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">Modifier le service</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="nom"
                value={selectedService.nom}
                onChange={handleSelectedServiceChange}
                className={`w-full p-2 border rounded ${formErrors.nom ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nom du service"
              />
              {formErrors.nom && <p className="text-red-500 text-xs mt-1">{formErrors.nom}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={selectedService.description}
                onChange={handleSelectedServiceChange}
                className={`w-full p-2 border rounded ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                rows="3"
                placeholder="Description du service"
              />
              {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix de base</label>
                <input
                  type="number"
                  name="prixBase"
                  value={selectedService.prixBase}
                  onChange={handleSelectedServiceChange}
                  className={`w-full p-2 border rounded ${formErrors.prixBase ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0"
                  min="0"
                />
                {formErrors.prixBase && <p className="text-red-500 text-xs mt-1">{formErrors.prixBase}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unité de temps</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <select
                    name="uniteTemps"
                    value={selectedService.uniteTemps || 'heures'}
                    onChange={handleSelectedServiceChange}
                    className="w-full p-2 pl-10 border border-gray-300 rounded bg-amber-50 border-amber-300 font-medium"
                  >
                    <option key="edit-heures" value="heures">Heures</option>
                    <option key="edit-jours" value="jours">Jours</option>
                  </select>
                </div>
                <p className="mt-1 text-xs text-amber-600">Cette unité détermine la base de facturation du service</p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                name="categorie"
                value={selectedService.categorie}
                onChange={handleSelectedServiceChange}
                className={`w-full p-2 border rounded ${formErrors.categorie ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option key="edit-cat-default" value="">Sélectionner une catégorie</option>
                <option key="edit-cat-lavage" value="Lavage">Lavage</option>
                <option key="edit-cat-repassage" value="Repassage">Repassage</option>
                <option key="edit-cat-nettoyage" value="Nettoyage à sec">Nettoyage à sec</option>
                <option key="edit-cat-teinture" value="Teinture">Teinture</option>
                <option key="edit-cat-autre" value="Autre">Autre</option>
              </select>
              {formErrors.categorie && <p className="text-red-500 text-xs mt-1">{formErrors.categorie}</p>}
            </div>
            
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={updateService}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mise à jour en cours...' : 'Mettre à jour'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
            
            <p className="mb-6 text-gray-700">
              Êtes-vous sûr de vouloir supprimer le service "{selectedService.nom}" ? Cette action est irréversible.
            </p>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={deleteService}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}