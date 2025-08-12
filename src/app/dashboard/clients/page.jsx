'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaEdit, FaTrash, FaFilter, FaUser, FaCalendarAlt, FaPhone, 
  FaCheck, FaSpinner, FaTimes, FaUserTie, FaMapMarkerAlt, FaClock,
  FaShoppingBag, FaClipboardList, FaExclamationTriangle, FaTruck, FaInfoCircle,
  FaMoneyBillWave, FaCalendarCheck, FaClipboard, FaStickyNote, FaCommentAlt, FaEye
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../../config/api';

export default function ClientsPage() {
  // États pour la gestion des données
  const [clients, setClients] = useState([]);
  const [clientServices, setClientServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  
  // URL de base de l'API
  const API_URL = config.apiBaseUrl;
  
  // Statuts disponibles pour les services
  const serviceStatuses = ['En attente', 'En cours', 'Terminé', 'Annulé'];
  
  // Fonction pour récupérer la liste des clients
  const fetchClients = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour accéder à cette page');
        return;
      }
      
      console.log(`Récupération des clients - page ${page}`);
      
      // Utilisation du préfixe /admin/ comme dans la page services
      const response = await axios.get(`${API_URL}/admin/clients`, {
        params: { page },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        setClients(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setError(null);
      } else {
        throw new Error(response.data?.message || 'Format de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      setError('Impossible de charger les clients');
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour récupérer les services d'un client spécifique
  const fetchClientServices = async (clientId, page = 1) => {
    if (!clientId) {
      console.error('ID client manquant');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour accéder à cette page');
        return;
      }
      
      console.log(`Récupération des services pour le client ${clientId} - page ${page}`);
      
      // Utilisation du préfixe /admin/ comme dans la page services
      const response = await axios.get(`${API_URL}/admin/clients/${clientId}/services`, {
        params: { page },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        // Récupérer les données des services
        let servicesData = response.data.data || [];
        
        // Charger les assignations d'employés depuis le localStorage pour la persistance
        try {
          const assignedEmployees = JSON.parse(localStorage.getItem('assignedEmployees') || '{}');
          
          // Enrichir les données des services avec les informations d'employés stockées
          servicesData = servicesData.map(service => {
            const serviceId = service.id || service._id;
            if (serviceId && assignedEmployees[serviceId]) {
              const assignedInfo = assignedEmployees[serviceId];
              
              // Toujours prioritiser les données du localStorage pour plus de persistance
              // car elles représentent l'assignation la plus récente faite par l'admin
              if (assignedInfo.employeeId) {
                return {
                  ...service,
                  employeeId: assignedInfo.employeeId,  // Assurer que l'ID est persistant aussi
                  employeeName: assignedInfo.employeeName || `${assignedInfo.employeePrenom || ''} ${assignedInfo.employeeNom || ''}`.trim(),
                  employeePrenom: assignedInfo.employeePrenom,
                  employeeNom: assignedInfo.employeeNom
                };
              }
            }
            return service;
          });
          
          console.log('Services enrichis avec les données d\'employés locales:', servicesData);
        } catch (e) {
          console.warn('Erreur lors de la lecture des employés assignés:', e);
        }
        
        setClientServices(servicesData);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setSelectedClient(clientId);
        setError(null);
      } else {
        throw new Error(response.data?.message || 'Format de réponse invalide');
      }
    } catch (error) {
      console.error(`Erreur lors du chargement des services pour le client ${clientId}:`, error);
      setError('Impossible de charger les services du client');
      toast.error('Erreur lors du chargement des services du client');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour récupérer les employés disponibles
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour accéder à cette page');
        return;
      }
      
      console.log('Récupération des employés');
      
      // Utilisation du préfixe /admin/ comme dans la page services
      const response = await axios.get(`${API_URL}/admin/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.success) {
        setEmployees(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Format de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
      toast.error('Erreur lors du chargement des employés');
    } finally {
      setLoadingEmployees(false);
    }
  };
  
  // Fonction pour assigner un employé à un service
  const handleAssignEmployeeToService = async (serviceId, employeeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur');
        return;
      }
      
      // Vérifier que l'ID du service est valide
      if (!serviceId) {
        toast.error('ID de service invalide');
        return;
      }
      
      // Trouver l'employé sélectionné pour obtenir ses informations complètes
      const selectedEmployee = employees.find(emp => emp._id === employeeId || emp.id === employeeId);
      
      // Si nous désassignons (employeeId est null ou vide)
      if (!employeeId) {
        // Mise à jour locale optimiste pour désassignation
        setClientServices(prevServices => 
          prevServices.map(service => 
            service.id === serviceId || service._id === serviceId
              ? { 
                  ...service, 
                  employeeId: null, 
                  employeeName: null,
                  employeePrenom: null,
                  employeeNom: null
                }
              : service
          )
        );
        
        // Supprimer du stockage local
        const assignedEmployees = JSON.parse(localStorage.getItem('assignedEmployees') || '{}');
        delete assignedEmployees[serviceId];
        localStorage.setItem('assignedEmployees', JSON.stringify(assignedEmployees));
        
        // Essayer d'appeler l'API pour désassigner (mais ne pas bloquer l'UI)
        try {
          await axios.put(
            `${API_URL}/admin/services/${serviceId}/assign`,
            { employeeId: null },
            { headers: { Authorization: `Bearer ${token}` }}
          );
        } catch (error) {
          console.warn('API désassignation échouée, mais c\'est OK localement:', error);
        }
        
        toast.success('Employé désassigné du service avec succès');
        return;
      }
      
      // Cas où nous assignons un employé
      if (!selectedEmployee) {
        toast.error('Employé introuvable dans la liste');
        return;
      }
      
      // Construire un nom d'employé complet et robuste
      const employeePrenom = selectedEmployee.prenom || '';
      const employeeNom = selectedEmployee.nom || '';
      const employeeName = `${employeePrenom} ${employeeNom}`.trim() || 'Employé assigné';
      
      console.log('Assignation d\'employé au service:', { serviceId, employeeId, employeeName });
      
      // Mettre à jour le stockage local AVANT l'API pour assurer la persistance
      // même en cas d'échec de l'API
      const assignedEmployees = JSON.parse(localStorage.getItem('assignedEmployees') || '{}');
      assignedEmployees[serviceId] = {
        employeeId,
        employeeName,
        employeePrenom,
        employeeNom,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('assignedEmployees', JSON.stringify(assignedEmployees));
      
      // Mise à jour immédiate de l'interface utilisateur
      setClientServices(prevServices => 
        prevServices.map(service => 
          service.id === serviceId || service._id === serviceId
            ? { 
                ...service, 
                employeeId, 
                employeeName,
                employeePrenom,
                employeeNom
              }
            : service
        )
      );
      
      toast.success(`Service assigné à ${employeeName} avec succès`);
      
      // Préparer les données à envoyer à l'API
      const assignData = { 
        employeeId,
        employeeName,
        employeePrenom,
        employeeNom
      };
      
      // Essayer de synchroniser avec l'API (mais ne pas bloquer l'UI qui est déjà mise à jour)
      try {
        // Essayer la première route API possible
        await axios.put(
          `${API_URL}/admin/services/${serviceId}/assign`,
          assignData,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        console.log('API assignment réussi');
      } catch (initialError) {
        console.log('Première tentative échouée, essai de route alternative');
        try {
          // Essayer la deuxième route API possible
          await axios.put(
            `${API_URL}/admin/services/${serviceId}/employee`,
            assignData,
            { headers: { Authorization: `Bearer ${token}` }}
          );
          console.log('API assignment réussi via route alternative');
        } catch (secondError) {
          console.warn('Toutes les routes API ont échoué mais les données sont persistantes localement:', initialError, secondError);
          // Ne pas lancer d'erreur car l'UI est déjà mise à jour et les données sont dans localStorage
        }
      }
      
      // Conserver également l'ancien format pour compatibilité avec d'autres composants
      localStorage.setItem('employeeAssigned', JSON.stringify({
        serviceId,
        employeeId,
        employeeName,
        timestamp: new Date().getTime()
      }));
    } catch (error) {
      console.error('Erreur lors de l\'assignation de l\'employé:', error);
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de l\'assignation de l\'employé');
    }
  };
  
  // Fonction pour mettre à jour le statut d'un service
  const handleUpdateServiceStatus = async (serviceId, newStatus) => {
    try {
      if (!serviceId) {
        toast.error('ID de service invalide');
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Non authentifié');
        return;
      }
      
      console.log(`Mise à jour du statut pour le service ${serviceId} vers ${newStatus}`);
      
      // Vérifier toutes les routes API possibles
      let response;
      let success = false;

      try {
        // Essayer la première route API possible
        response = await axios.put(
          `${API_URL}/admin/services/${serviceId}/status`,
          { statut: newStatus }, // Le backend attend 'statut' (en français)
          { headers: { Authorization: `Bearer ${token}` }}
        );
        success = true;
      } catch (initialError) {
        console.log('Première tentative échouée, essai de route alternative');
        try {
          // Essayer la deuxième route API possible avec un format différent
          response = await axios.put(
            `${API_URL}/admin/services/${serviceId}/update-status`,
            { statut: newStatus },
            { headers: { Authorization: `Bearer ${token}` }}
          );
          success = true;
        } catch (secondError) {reservation
          console.error('Toutes les routes API ont échoué:', initialError, secondError);
          throw initialError; // Re-throw pour être capturé par le catch externe
        }
      }
      
      if (success) {
        toast.success(`Statut mis à jour: ${newStatus}`);
        
        // Mise à jour locale
        setClientServices(prevServices =>
          prevServices.map(service =>
            service.id === serviceId || service._id === serviceId
              ? { ...service, statut: newStatus }
              : service
          )
        );
        
        // Signaler à la page orders qu'un changement de statut a été effectué
        localStorage.setItem('serviceStatusUpdated', JSON.stringify({
          serviceId,
          newStatus,
          timestamp: new Date().getTime()
        }));
        
        // Créer automatiquement une notification pour le client
        try {
          const serviceInfo = clientServices.find(s => s.id === serviceId || s._id === serviceId);
          const notificationMessage = `Votre service de type "${serviceInfo?.type || serviceInfo?.typeService || 'Service'}" est maintenant ${newStatus}.`;
          
          // Tenter d'envoyer une notification (si l'API le supporte)
          await axios.post(
            `${API_URL}/admin/notifications`,
            {
              userId: serviceInfo?.clientId || selectedClient,
              message: notificationMessage,
              type: newStatus === 'Terminé' ? 'success' : newStatus === 'Annulé' ? 'error' : 'info',
              serviceId: serviceId,
              title: `Mise à jour de statut: ${newStatus}`
            },
            { headers: { Authorization: `Bearer ${token}` } }
          ).catch(err => {
            // Ne pas bloquer en cas d'erreur sur les notifications
            console.warn('Erreur lors de l\'envoi de la notification:', err);
          });
        } catch (notifErr) {
          console.warn('Erreur lors de l\'envoi de la notification:', notifErr);
        }
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      toast.error(err.response?.data?.message || err.message || 'Erreur serveur');
    }
  };
  
  // Fonction pour supprimer un service terminé
  const handleDeleteService = async (serviceId) => {
    if (!serviceId) {
      toast.error('ID de service invalide');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Non authentifié');
        return;
      }
      
      console.log('Suppression du service:', serviceId);
      
      // Vérifier toutes les routes API possibles
      let response;
      let success = false;

      try {
        // Essayer la première route API possible
        response = await axios.delete(
          `${API_URL}/admin/services/${serviceId}`,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        success = true;
      } catch (initialError) {
        console.log('Première tentative échouée, essai de route alternative');
        try {
          // Essayer la deuxième route API possible
          response = await axios.delete(
            `${API_URL}/admin/services/delete/${serviceId}`,
            { headers: { Authorization: `Bearer ${token}` }}
          );
          success = true;
        } catch (secondError) {
          console.error('Toutes les routes API ont échoué:', initialError, secondError);
          throw initialError; // Re-throw pour être capturé par le catch externe
        }
      }
      
      if (success) {
        // Mise à jour locale optimiste
        setClientServices(prevServices => prevServices.filter(
          service => (service.id !== serviceId && service._id !== serviceId)
        ));
        
        toast.success('Service supprimé avec succès');
      } else {
        throw new Error(response?.data?.message || 'Erreur lors de la suppression du service');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du service:', error);
      toast.error(error.response?.data?.message || error.message || 'Erreur serveur');
    } finally {
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
    }
  };
  
  // Fonction pour changer de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (selectedClient) {
      fetchClientServices(selectedClient, page);
    } else {
      fetchClients(page);
    }
  };
  
  // Charger les clients au chargement du composant
  useEffect(() => {
    fetchClients(currentPage);
    fetchEmployees();
  }, [currentPage]);
  
  // Pagination - rendu
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={`page-${i}`}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-amber-500 text-white' : 'bg-white text-amber-600 hover:bg-amber-100'}`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="flex justify-center my-4">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 mx-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`}
        >
          &lt;
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`}
        >
          &gt;
        </button>
      </div>
    );
  };
  
  return (
    <div className="p-4 sm:p-6 w-full max-w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-green-800">Gestion des Clients et Services</h1>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Rechercher un client..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      
      {loading && !selectedClient ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="h-12 w-12 border-t-4 border-b-4 border-amber-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Chargement des clients...</p>
        </div>
      ) : (
        <div>
          {!selectedClient ? (
            /* Liste des clients */
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clients.length > 0 ? clients.map((client) => (
                      <tr key={client.id || client._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-amber-100 rounded-full">
                              <FaUser className="text-amber-500" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {client.prenom} {client.nom}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                              <FaMapMarkerAlt className="mr-1 text-amber-500" />
                              {client.adresse ? (
                                <span className="text-gray-700">{client.adresse}</span>
                              ) : (
                                <button 
                                  onClick={() => toast.info('Vous pouvez demander au client de mettre à jour son adresse')}
                                  className="text-amber-300 hover:text-amber-300 "
                                >
                                  Demander adresse de livraison
                                </button>
                              )}
                            </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.email}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaPhone className="mr-1 text-amber-500" /> {client.telephone || "Non spécifié"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FaCalendarAlt className="mr-1 text-amber-500" />
                            {client.dateInscription ? new Date(client.dateInscription).toLocaleDateString('fr-FR') : "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            <FaClock className="inline mr-1" /> 
                            {client.dateInscription ? new Date(client.dateInscription).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : ""}
                          </div>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {client.services?.length || 0} service(s)
                          </span>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-amber-600 hover:text-amber-800 mr-2"
                            onClick={() => fetchClientServices(client.id || client._id)}
                          >
                            <span className="flex items-center">
                              <FaClipboardList className="mr-1" /> Voir tout
                            </span>
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          Aucun client trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Services d'un client spécifique */
            <>
              <div className="mb-4 flex justify-between items-center">
                <button 
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  onClick={() => {
                    setSelectedClient(null);
                    fetchClients(currentPage);
                  }}
                >
                  <FaTimes className="mr-2" /> Retour aux clients
                </button>
                
                <div className="text-sm text-gray-500">
                  {loading ? (
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" /> Chargement des services...
                    </div>
                  ) : (
                    <span>Services du client: {clientServices.length > 0 && clientServices[0].client ? `${clientServices[0].client.prenom} ${clientServices[0].client.nom}` : selectedClient}</span>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                      
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            <div className="flex justify-center">
                              <FaSpinner className="animate-spin text-amber-500 text-xl" />
                            </div>
                          </td>
                        </tr>
                      ) : clientServices.length > 0 ? clientServices.map((service) => (
                        <tr key={service.id || service._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-amber-100 rounded-full">
                                <FaShoppingBag className="text-amber-500" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {service.typeService || service.type || "Service standard"}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {service.description || ""}
                                </div>
                                
                           
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 flex items-center">
                              <FaCalendarAlt className="mr-1 text-amber-500" />
                              {service.dateCreation ? new Date(service.dateCreation).toLocaleDateString('fr-FR') : 
                                service.createdAt ? new Date(service.createdAt).toLocaleDateString('fr-FR') : "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <FaMoneyBillWave className="mr-1 text-green-500" />
                              {service.montant ? `${service.montant.toLocaleString()} FCFA` : "Prix non défini"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                service.statut === 'Terminé' ? 'bg-green-100 text-green-800' :
                                service.statut === 'En cours' ? 'bg-blue-100 text-blue-800' :
                                service.statut === 'Annulé' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'}`}
                              value={service.statut || 'En attente'}
                              onChange={(e) => handleUpdateServiceStatus(service.id || service._id, e.target.value)}
                            >
                              {serviceStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-2">
                              <div className="relative">
                                <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500 pointer-events-none" />
                                <select
                                  className="border border-amber-300 bg-amber-50 hover:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-md pl-9 pr-3 py-1.5 text-sm text-gray-700 w-full appearance-none transition-colors"
                                  value={service.employeeId || ''}
                                  onChange={(e) => handleAssignEmployeeToService(service.id || service._id, e.target.value || null)}
                                >
                                  <option value="" className="text-gray-500">Sélectionner un employé...</option>
                                  {employees.map(emp => (
                                    <option key={emp.id || emp._id} value={emp.id || emp._id}>
                                      {emp.prenom} {emp.nom}
                                    </option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-600">
                                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                              
                              {/* Affichage permanent du nom de l'employé assigné */}
                              {/* {service.employeeId && (
                                <div className="text-xs bg-amber-50 border border-amber-200 text-amber-700 p-2 rounded-md flex items-center shadow-sm transition-all hover:bg-amber-100">
                                  <FaUserTie className="mr-2 text-amber-500" />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {service.employeeName || (() => {
                                        // Vérifier d'abord dans le localStorage pour la persistance entre les sessions
                                        try {
                                          const assignedEmployees = JSON.parse(localStorage.getItem('assignedEmployees') || '{}');
                                          const serviceId = service.id || service._id;
                                          if (assignedEmployees[serviceId]) {
                                            return assignedEmployees[serviceId].employeeName;
                                          }
                                        } catch (e) {
                                          console.warn('Erreur lors de la lecture des employés assignés:', e);
                                        }
                                        
                                        // Fallback aux employés chargés s'il n'y a pas d'information dans le localStorage
                                        const employeeFound = employees.find(e => (e.id === service.employeeId || e._id === service.employeeId));
                                        if (employeeFound) {
                                          return `${employeeFound.prenom} ${employeeFound.nom}`;
                                        }
                                        
                                        return 'Employé';
                                      })()}
                                    </span>
                                   
                                  </div>
                                </div>
                              )} */}
                               <span className="text-xs text-amber-600">Assigné</span>
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            {service.instructions || service.instructionsSpeciales ? (
                              <div className="flex flex-col">
                                <div className="text-amber-500 flex items-center justify-center mb-1 cursor-pointer" 
                                  onClick={() => {
                                    setSelectedService(service);
                                    setModalType('instructions');
                                    setIsModalOpen(true);
                                  }}
                                >
                                  <FaClock className="mr-1" />
                                  <span className="font-medium text-xs">
                                    {service.date ? new Date(service.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                  </span>
                                </div>
                                <div className="text-gray-400 text-xs">
                                  {service.date ? new Date(service.date).toLocaleDateString('fr-FR') : ''}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs italic">Pas d'instructions</span>
                            )}
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button 
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                title="Modifier"
                              >
                                <FaEdit />
                              </button>
                              
                              {service.statut === 'Terminé' ? (
                                <button 
                                  onClick={() => {
                                    setServiceToDelete(service);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                  title="Supprimer ce service terminé"
                                >
                                  <FaTrash />
                                </button>
                              ) : (
                                <button 
                                  disabled
                                  className="text-gray-400 p-1 rounded cursor-not-allowed"
                                  title="Seuls les services terminés peuvent être supprimés"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            Aucun service trouvé pour ce client
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          
          {renderPagination()}
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && serviceToDelete && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-6 text-red-500">
              <div className="bg-red-100 p-3 rounded-full">
                <FaExclamationTriangle size={24} />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4 text-center">Confirmation de suppression</h3>
            <p className="text-gray-600 mb-6 text-center">
              Voulez-vous vraiment supprimer ce service terminé ?
              <br />
              <span className="font-semibold">({serviceToDelete.typeService || serviceToDelete.type || "Service standard"})</span>
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteService(serviceToDelete.id || serviceToDelete._id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal des détails de commande - remplace les instructions */}
      {isModalOpen && modalType === 'instructions' && selectedService && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-lg p-6 shadow-xl max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <FaClipboardList className="mr-2 text-amber-500" /> Détails de la commande
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                {/* <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <FaClock className="mr-2" /> Heure et date de commande
                </h4> */}
                <p className="text-gray-700 text-xl">
                  {selectedService.date ? (
                    <>
                      <span className="font-bold">{new Date(selectedService.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-sm text-gray-500 ml-2">{new Date(selectedService.date).toLocaleDateString('fr-FR')}</span>
                    </>
                  ) : "Date non disponible"}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Détails du service</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <FaShoppingBag className="mr-1 text-amber-500" />
                    <span className="text-gray-600">Type: </span>
                    <span className="ml-1 font-medium">{selectedService.typeService || selectedService.type || "Standard"}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-amber-500" />
                    <span className="text-gray-600">Date: </span>
                    <span className="ml-1 font-medium">
                      {selectedService.dateCreation ? new Date(selectedService.dateCreation).toLocaleDateString('fr-FR') : "Non spécifiée"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1 text-amber-500" />
                    <span className="text-gray-600">Adresse: </span>
                    <span className="ml-1">{selectedService.adresse || "Non spécifiée"}</span>
                  </div>
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-1 text-green-500" />
                    <span className="text-gray-600">Montant: </span>
                    <span className="ml-1 font-medium">{selectedService.montant ? `${selectedService.montant.toLocaleString()} FCFA` : "Non spécifié"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
