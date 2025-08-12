'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaEdit, FaTrash, FaTimes, FaUserTie, 
  FaCheck, FaSpinner, FaCalendarAlt, FaExclamationTriangle,
  FaShoppingBag, FaClipboardList, FaMoneyBillWave, FaMapMarkerAlt,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../config/api';

export default function OrdersPage() {
  // États pour la gestion des données
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('Tous');
  
  // URL de base de l'API
  const API_URL = config.apiBaseUrl;
  
  // Statuts disponibles pour les commandes
  const orderStatuses = ['En attente', 'En cours', 'Terminé', 'Annulé'];
  
  // Fonction pour récupérer la liste des commandes
  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté pour accéder à cette page');
        return;
      }
      
      console.log(`Récupération des commandes - page ${page}`);
      
      // Préparer les paramètres, ajouter le filtre statut si nécessaire
      const params = { page };
      if (activeStatusFilter !== 'Tous') {
        params.statut = activeStatusFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Essayer différentes routes API pour récupérer les services/commandes
      let response;
      let success = false;

      try {
        // Essayer la première route API possible - services
        response = await axios.get(`${API_URL}/services`, {
          params,
          headers: { Authorization: `Bearer ${token}` }
        });
        success = true;
      } catch (initialError) {
        console.log('Première tentative échouée, essai de route alternative');
        try {
          // Essayer la deuxième route API possible - admin/services
          response = await axios.get(`${API_URL}/admin/services`, {
            params,
            headers: { Authorization: `Bearer ${token}` }
          });
          success = true;
        } catch (secondAttemptError) {
          console.error('Routes API de services échouées, essai de routes orders:', initialError, secondAttemptError);
          try {
            // Essayer la troisième route API possible - orders
            response = await axios.get(`${API_URL}/orders`, {
              params,
              headers: { Authorization: `Bearer ${token}` }
            });
            success = true;
          } catch (thirdAttemptError) {
            console.log('Troisième tentative échouée, essai de route alternative');
            try {
              // Essayer la quatrième route API possible - admin/orders
              response = await axios.get(`${API_URL}/admin/orders`, {
                params,
                headers: { Authorization: `Bearer ${token}` }
              });
              success = true;
            } catch (finalError) {
              console.error('Toutes les routes API ont échoué:', initialError, secondAttemptError, thirdAttemptError, finalError);
              throw initialError; // Re-throw pour être capturé par le catch externe
            }
          }
        }
      }
      
      if (success && response.data && response.data.success) {
        const ordersData = response.data.data || [];
        
        // Enrichir les données avec les informations complètes des employés
        if (employees.length > 0) {
          ordersData.forEach(order => {
            if (order.employeeId) {
              const matchedEmployee = employees.find(emp => 
                emp.id === order.employeeId || emp._id === order.employeeId
              );
              if (matchedEmployee) {
                order.employeeName = `${matchedEmployee.prenom || ''} ${matchedEmployee.nom || ''}`;
              }
            }
          });
        }
        
        setOrders(ordersData);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setError(null);
      } else {
        throw new Error(response.data?.message || 'Format de réponse invalide');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      setError('Impossible de charger les commandes');
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour actualiser automatiquement les commandes toutes les 10 secondes
  // Cela permet de voir rapidement les changements faits depuis la page clients
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (!loading) {
        console.log('Actualisation automatique des commandes pour refléter les changements depuis d\'autres pages');
        fetchOrders(currentPage);
        // Actualiser également la liste des employés pour avoir les données à jour
        fetchEmployees();
      }
    }, 10000); // 10 secondes pour une réactivité accrue
    
    return () => clearInterval(refreshInterval);
  }, [currentPage, loading]);
  
  // Ajouter un écouteur d'événement de stockage local pour détecter les changements de statut
  // faits depuis d'autres pages comme dashboard/clients
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'serviceStatusUpdated' || event.key === 'employeeAssigned') {
        console.log('Changement détecté depuis une autre page, actualisation des commandes');
        fetchOrders(currentPage);
      }
    };
    
    // Ajouter l'écouteur d'événement
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      // Nettoyer l'écouteur à la démontage du composant
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentPage]);
  
  // Observer les changements de searchTerm pour filtrer les commandes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (currentPage === 1) {
        fetchOrders(1);
      } else {
        setCurrentPage(1);
      }
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  
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
      
      // Utilisation du préfixe /admin/
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

  // Fonction pour assigner un employé à une commande
  const handleAssignEmployeeToOrder = async (orderId, employeeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur');
        return;
      }
      
      // Vérifier que l'ID de la commande est valide
      if (!orderId) {
        toast.error('ID de commande invalide');
        return;
      }
      
      console.log('Assignation d\'employé à la commande:', { orderId, employeeId });
      
      // Vérifier toutes les routes API possibles
      let response;
      let success = false;

      try {
        // Essayer la première route API possible
        response = await axios.put(
          `${API_URL}/services/${orderId}/assign`,
          { employeeId },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        success = true;
      } catch (initialError) {
        console.log('Première tentative échouée, essai de route alternative');
        try {
          // Essayer la deuxième route API possible
          response = await axios.put(
            `${API_URL}/admin/services/${orderId}/assign`,
            { employeeId },
            { headers: { Authorization: `Bearer ${token}` }}
          );
          success = true;
        } catch (secondAttemptError) {
          console.log('Deuxième tentative échouée, essai de route alternative');
          try {
            // Essayer la troisième route API possible
            response = await axios.put(
              `${API_URL}/services/${orderId}/employee`,
              { employeeId },
              { headers: { Authorization: `Bearer ${token}` }}
            );
            success = true;
          } catch (thirdAttemptError) {
            console.log('Troisième tentative échouée, essai de route alternative');
            try {
              // Essayer la quatrième route API possible
              response = await axios.put(
                `${API_URL}/admin/services/${orderId}/employee`,
                { employeeId },
                { headers: { Authorization: `Bearer ${token}` }}
              );
              success = true;
            } catch (finalError) {
              console.error('Toutes les routes API ont échoué:', initialError, secondAttemptError, thirdAttemptError, finalError);
              throw initialError; // Re-throw pour être capturé par le catch externe
            }
          }
        }
      }
      
      if (success) {
        // Mise à jour locale optimiste
        const selectedEmployee = employees.find(emp => emp._id === employeeId || emp.id === employeeId);
        const employeeName = selectedEmployee ? `${selectedEmployee.prenom} ${selectedEmployee.nom}` : 'Non assigné';
        
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId || order._id === orderId
              ? { ...order, employeeId, employeeName }
              : order
          )
        );
        
        toast.success(employeeId ? 'Employé assigné à la commande avec succès' : 'Employé désassigné de la commande avec succès');
      } else {
        throw new Error(response.data?.message || 'Erreur lors de l\'assignation de l\'employé');
      }
    } catch (error) {
      console.error('Erreur lors de l\'assignation de l\'employé:', error);
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de l\'assignation de l\'employé');
    }
  };
  
  // Fonction pour mettre à jour le statut d'une commande
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      if (!orderId) {
        toast.error('ID de commande invalide');
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Non authentifié');
        return;
      }
      
      console.log(`Mise à jour du statut pour la commande ${orderId} vers ${newStatus}`);
      
      // Vérifier toutes les routes API possibles
      let response;
      let success = false;

      try {
        // Essayer la première route API possible
        response = await axios.put(
          `${API_URL}/services/${orderId}/status`,
          { statut: newStatus }, // Le backend attend 'statut' (en français)
          { headers: { Authorization: `Bearer ${token}` }}
        );
        success = true;
      } catch (initialError) {
        console.log('Première tentative échouée, essai de route alternative');
        try {
          // Essayer la deuxième route API possible
          response = await axios.put(
            `${API_URL}/admin/services/${orderId}/status`,
            { statut: newStatus },
            { headers: { Authorization: `Bearer ${token}` }}
          );
          success = true;
        } catch (secondAttemptError) {
          console.log('Deuxième tentative échouée, essai de route alternative');
          try {
            // Essayer la troisième route API possible
            response = await axios.put(
              `${API_URL}/services/${orderId}/update-status`,
              { statut: newStatus },
              { headers: { Authorization: `Bearer ${token}` }}
            );
            success = true;
          } catch (thirdAttemptError) {
            console.log('Troisième tentative échouée, essai de route alternative');
            try {
              // Essayer la quatrième route API possible
              response = await axios.put(
                `${API_URL}/admin/services/${orderId}/update-status`,
                { statut: newStatus },
                { headers: { Authorization: `Bearer ${token}` }}
              );
              success = true;
            } catch (finalError) {
              console.error('Toutes les routes API ont échoué:', initialError, secondAttemptError, thirdAttemptError, finalError);
              throw initialError; // Re-throw pour être capturé par le catch externe
            }
          }
        }
      }
      
      if (success) {
        toast.success(`Statut mis à jour: ${newStatus}`);
        
        // Mise à jour locale
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId || order._id === orderId
              ? { ...order, statut: newStatus }
              : order
          )
        );
        
        // Créer automatiquement une notification pour le client
        try {
          const orderInfo = orders.find(o => o.id === orderId || o._id === orderId);
          const notificationMessage = `Votre commande de type "${orderInfo?.typeService || orderInfo?.type || 'Service'}" est maintenant ${newStatus}.`;
          
          // Tenter d'envoyer une notification (si l'API le supporte)
          await axios.post(
            `${API_URL}/admin/notifications`,
            {
              userId: orderInfo?.clientId || orderInfo?.client?.id || orderInfo?.client?._id,
              message: notificationMessage,
              type: newStatus === 'Terminé' ? 'success' : newStatus === 'Annulé' ? 'error' : 'info',
              orderId: orderId,
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
  
  // Fonction pour supprimer une commande (uniquement si elle est terminée)
  const handleDeleteOrder = async (orderId) => {
    try {
      // Vérifier que la commande existe et qu'elle est terminée
      const orderToDelete = orders.find(order => order.id === orderId || order._id === orderId);
      if (!orderToDelete) {
        toast.error('Commande introuvable');
        return;
      }
      
      // Vérifier que la commande est terminée
      if (orderToDelete.statut !== 'Terminé') {
        toast.warning('Seules les commandes terminées peuvent être supprimées');
        return;
      }
      
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Non authentifié');
        return;
      }
      
      console.log(`Suppression de la commande ${orderId}`);
      
      // Vérifier toutes les routes API possibles
      let response;
      let success = false;

      try {
        // Essayer la première route API possible - admin/services
        response = await axios.delete(
          `${API_URL}/admin/services/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        success = true;
      } catch (initialError) {
        console.log('Première tentative échouée, essai de route alternative');
        try {
          // Essayer la deuxième route API possible - admin/orders
          response = await axios.delete(
            `${API_URL}/admin/orders/${orderId}`,
            { headers: { Authorization: `Bearer ${token}` }}
          );
          success = true;
        } catch (secondError) {
          console.log('Deuxième tentative échouée, essai de route alternative');
          try {
            // Essayer la troisième route API possible - services
            response = await axios.delete(
              `${API_URL}/services/${orderId}`,
              { headers: { Authorization: `Bearer ${token}` }}
            );
            success = true;
          } catch (thirdError) {
            console.log('Troisième tentative échouée, essai de route alternative');
            try {
              // Essayer la quatrième route API possible - orders
              response = await axios.delete(
                `${API_URL}/orders/${orderId}`,
                { headers: { Authorization: `Bearer ${token}` }}
              );
              success = true;
            } catch (finalError) {
              console.error('Toutes les routes API ont échoué:', initialError, secondError, thirdError, finalError);
              throw initialError; // Re-throw pour être capturé par le catch externe
            }
          }
        }
      }
      
      if (success) {
        toast.success('Commande supprimée avec succès');
        
        // Mise à jour locale
        setOrders(prevOrders => prevOrders.filter(order => 
          order.id !== orderId && order._id !== orderId
        ));
        
        // Fermer le modal de confirmation s'il est ouvert
        setIsDeleteModalOpen(false);
        setSelectedOrder(null);
      } else {
        throw new Error(response?.data?.message || 'Erreur lors de la suppression de la commande');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de la commande:', err);
      toast.error(err.response?.data?.message || err.message || 'Erreur serveur');
    }
  };
  
  // Ouvrir le modal de confirmation de suppression
  const openDeleteModal = (orderId) => {
    const orderToDelete = orders.find(order => order.id === orderId || order._id === orderId);
    
    // Vérifier que la commande est terminée
    if (orderToDelete && orderToDelete.statut !== 'Terminé') {
      toast.error('Seules les commandes terminées peuvent être supprimées');
      return;
    }
    
    setSelectedOrder(orderId);
    setIsDeleteModalOpen(true);
  };
  
  // Fonction pour changer de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page);
  };
  
  // Fonction pour changer le filtre de statut
  const handleStatusFilterChange = (status) => {
    setActiveStatusFilter(status);
    setCurrentPage(1); // Réinitialiser à la première page
    fetchOrders(1);
  };
  
  // Calculer les statistiques pour le résumé
  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      enAttente: 0,
      enCours: 0,
      termine: 0,
      annule: 0,
      montantTotal: 0
    };
    
    orders.forEach(order => {
      const status = order.statut || 'En attente';
      const montant = order.montant || 0;
      
      // Incrémenter le compteur approprié
      if (status === 'En attente') stats.enAttente++;
      else if (status === 'En cours') stats.enCours++;
      else if (status === 'Terminé') stats.termine++;
      else if (status === 'Annulé') stats.annule++;
      
      // Ajouter le montant au total
      stats.montantTotal += montant;
    });
    
    return stats;
  };
  
  // Charger les commandes au chargement du composant
  useEffect(() => {
    fetchOrders(currentPage);
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
  
  // Formater le montant en FCFA
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'Non défini';
    return `${amount.toLocaleString()} FCFA`;
  };
  
  return (
    <div className="p-4 sm:p-6 w-full max-w-full">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-green-800">Gestion des Commandes</h1>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Rechercher une commande..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        {/* Résumé des commandes */}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
            {(() => {
              const stats = getOrderStats();
              return (
                <>
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-amber-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">Total Commandes</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                      </div>
                      <div className="p-2 bg-amber-100 rounded-full">
                        <FaShoppingBag className="text-amber-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">En Attente</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.enAttente}</p>
                      </div>
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <FaClock className="text-yellow-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">En Cours</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.enCours}</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FaSpinner className="text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">Terminées</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.termine}</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-full">
                        <FaCheckCircle className="text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-500 text-sm">Chiffre d'Affaires</p>
                        <p className="text-xl font-bold text-gray-800">{stats.montantTotal.toLocaleString()} FCFA</p>
                      </div>
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FaMoneyBillWave className="text-purple-600" />
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
        
        {/* Filtres par statut */}
        <div className="flex flex-wrap gap-2 mt-2">
          <button
            onClick={() => handleStatusFilterChange('Tous')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeStatusFilter === 'Tous'
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
            }`}
          >
            Tous
          </button>
          
          {orderStatuses.map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                activeStatusFilter === status
                  ? status === 'Terminé' ? 'bg-green-500 text-white' :
                    status === 'En cours' ? 'bg-blue-500 text-white' :
                    status === 'Annulé' ? 'bg-red-500 text-white' :
                    'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
              }`}
            >
              {status === 'Terminé' && <FaCheckCircle size={14} />}
              {status === 'En cours' && <FaSpinner size={14} />}
              {status === 'En attente' && <FaClock size={14} />}
              {status === 'Annulé' && <FaTimes size={14} />}
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="h-12 w-12 border-t-4 border-b-4 border-amber-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Chargement des commandes...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employé</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order.id || order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-amber-100 rounded-full">
                          <FaUserTie className="text-amber-500" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {order.client?.prenom || order.clientPrenom} {order.client?.nom || order.clientNom}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="inline-block mr-1 text-amber-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </span>
                            {order.client?.telephone || order.clientTelephone || "Pas de téléphone"}
                          </div>
                          <div className="text-xs text-amber-600 flex items-center">
                            <FaMapMarkerAlt className="inline mr-1" />
                            {order.client?.adresse || order.clientAdresse || order.adresseLivraison || "Adresse non spécifiée"}
                          </div>
                          {order.client?.dateInscription && (
                            <div className="text-xs text-green-600 mt-1">
                              <FaCalendarAlt className="inline mr-1" />
                              Client depuis: {new Date(order.client.dateInscription).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-green-100 rounded-full mr-3">
                          <FaShoppingBag className="text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.typeService || order.type || order.nomService || "Service standard"}
                          </div>
                          
                          {order.description || order.instructions ? (
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Description:</span> {order.description || order.instructions}
                            </div>
                          ) : null}
                          
                          {order.quantite && (
                            <div className="text-xs text-amber-600 mt-1">
                              <span className="font-medium">Quantité:</span> {order.quantite}
                            </div>
                          )}
                          
                          {order.items && order.items.length > 0 && (
                            <div className="text-xs text-gray-600 mt-1">
                              <div className="font-medium mb-1">Articles:</div>
                              <ul className="list-disc list-inside pl-2">
                                {order.items.slice(0, 3).map((item, idx) => (
                                  <li key={idx} className="text-xs">
                                    {item.nom || item.name || item.description || "Article"} 
                                    {item.quantite ? `(x${item.quantite})` : ''} 
                                    {item.prix ? `- ${item.prix} FCFA` : ''}
                                  </li>
                                ))}
                                {order.items.length > 3 && (
                                  <li className="text-xs font-medium text-amber-600">
                                    +{order.items.length - 3} autres articles
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                          
                          {order.categorie && (
                            <div className="mt-1">
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                {order.categorie}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <FaCalendarAlt className="inline mr-1 text-amber-500" /> Créée: {new Date(order.createdAt || order.date).toLocaleDateString('fr-FR')}
                      </div>
                      {order.dateLivraison && (
                        <div className="text-sm text-green-600">
                          <FaCalendarAlt className="inline mr-1" /> Livraison: {new Date(order.dateLivraison).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                      {order.client?.dateInscription && (
                        <div className="text-xs text-gray-500">
                          Client depuis: {new Date(order.client.dateInscription).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <FaMoneyBillWave className="inline mr-1 text-green-500" />
                        {formatCurrency(order.montant)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {(() => {
                          // Vérification complexe des différents formats possibles d'employé
                          const employeeId = order.employeeId || 
                                          order.employee_id ||
                                          (order.employee && (order.employee.id || order.employee._id));
                                          
                          // Déterminer le nom de l'employé à partir de diverses sources possibles
                          let employeeName = null;
                          
                          if (order.employeeName) {
                            employeeName = order.employeeName;
                          } else if (order.employee && order.employee.nom) {
                            employeeName = `${order.employee.prenom || ''} ${order.employee.nom}`;
                          } else if (employeeId) {
                            // Chercher l'employé dans la liste des employés disponibles
                            const foundEmployee = employees.find(emp => 
                              (emp.id === employeeId) || (emp._id === employeeId)
                            );
                            if (foundEmployee) {
                              employeeName = `${foundEmployee.prenom || ''} ${foundEmployee.nom}`;
                            }
                          }

                          if (employeeId || employeeName) {
                            return (
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {employeeName || "Employé assigné"}
                                </div>
                                {!employeeName && employeeId && (
                                  <div className="text-xs text-amber-600">
                                    ID: {employeeId}
                                  </div>
                                )}
                              </div>
                            );
                          } else {
                            return (
                              <div className="text-sm text-gray-500 italic">
                                Non assigné
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className={`rounded-full px-3 py-1 text-xs font-semibold w-full max-w-[140px] ${
                          order.statut === 'Terminé' ? 'bg-green-100 text-green-800' :
                          order.statut === 'En cours' ? 'bg-blue-100 text-blue-800' :
                          order.statut === 'Annulé' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'}`}
                        value={order.statut || 'En attente'}
                        onChange={(e) => handleUpdateOrderStatus(order.id || order._id, e.target.value)}
                      >
                        {orderStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openDeleteModal(order.id || order._id)}
                        disabled={order.statut !== 'Terminé'}
                        className={`p-2 ${order.statut !== 'Terminé' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                        title={order.statut !== 'Terminé' ? 'Seules les commandes terminées peuvent être supprimées' : 'Supprimer cette commande terminée'}
                      >
                        <FaTrash size={16} />
                      </button>
                      {order.statut !== 'Terminé' && (
                        <div className="text-xs text-gray-500 mt-1">
                          Suppression possible uniquement après statut "Terminé"
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Aucune commande trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {renderPagination()}
      
      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.</p>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedOrder(null);
                }}
              >
                Annuler
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
                onClick={() => handleDeleteOrder(selectedOrder)}
              >
                <FaTrash className="mr-2" /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}