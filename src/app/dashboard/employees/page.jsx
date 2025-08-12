'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaFilter, FaEdit, FaTrash, FaPlus, 
  FaCheckCircle, FaSpinner, FaExclamationTriangle, FaEye,
  FaBell, FaClipboardCheck, FaBriefcase
} from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '@/app/config/api';

export default function EmployeesPage() {
  // États pour stocker les données et l'état de l'interface
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employesAvecServices, setEmployesAvecServices] = useState({});
  
  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });
  
  // États pour les filtres
  const [statuts, setStatuts] = useState([
    'Tous', 'Actif', 'En congé', 'Inactif'
  ]);
  const [activeStatut, setActiveStatut] = useState('Tous');
  
  // État pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour la gestion des employés
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Employé vide par défaut selon notre schéma modernisé
  const defaultEmployeState = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    poste: '',
    salaire: 0,
    statut: 'Actif',
    specialites: [],
    password: '',
    role: 'employe'
  };
  
  // États pour les formulaires d'ajout et d'édition
  const [newEmploye, setNewEmploye] = useState({...defaultEmployeState});
  const [selectedEmploye, setSelectedEmploye] = useState({...defaultEmployeState});
  
  // État pour les erreurs de validation
  const [formErrors, setFormErrors] = useState({});

  // État pour les spécialités disponibles
  const [specialitesDisponibles, setSpecialitesDisponibles] = useState([
    'Lavage', 'Repassage', 'Nettoyage à sec', 'Teinture', 'Livraison', 'Réception'
  ]);
  
  // État pour gérer les spécialités sélectionnées
  const [specialiteTemp, setSpecialiteTemp] = useState('');
  
  // États pour le système de notification d'assignation
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newAssignmentCount, setNewAssignmentCount] = useState(0);

  // Validation du formulaire avant soumission
  const validateEmployeForm = (employe) => {
    const errors = {};
    
    // Validations obligatoires
    if (!employe.nom) errors.nom = 'Le nom est obligatoire';
    if (!employe.prenom) errors.prenom = 'Le prénom est obligatoire';
    
    // Validation email
    if (!employe.email) {
      errors.email = 'L\'email est obligatoire';
    } else if (!/^\S+@\S+\.\S+$/.test(employe.email)) {
      errors.email = 'Le format de l\'email est invalide';
    }
    
    if (!employe.telephone) errors.telephone = 'Le numéro de téléphone est obligatoire';
    if (!employe.poste) errors.poste = 'Le poste est obligatoire';
    
    // Validation du salaire
    if (!employe.salaire && employe.salaire !== 0) {
      errors.salaire = 'Le salaire est obligatoire';
    } else if (Number(employe.salaire) < 0) {
      errors.salaire = 'Le salaire doit être un nombre positif';
    }
    
    // Validation du mot de passe pour les nouveaux employés
    if (!employe._id && !employe.password) {
      errors.password = 'Le mot de passe est obligatoire pour un nouvel employé';
    } else if (employe.password && employe.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Fonction pour gérer les changements dans le formulaire principal
  const handleEmployeChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;
    
    setNewEmploye(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };
  
  // Fonction pour gérer les changements dans l'employé sélectionné
  const handleSelectedEmployeChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;
    
    setSelectedEmploye(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };
  
  // Gestion des spécialités
  const addSpecialite = (employe, setEmploye) => {
    if (!specialiteTemp || employe.specialites.includes(specialiteTemp)) return;
    
    setEmploye(prev => ({
      ...prev,
      specialites: [...prev.specialites, specialiteTemp]
    }));
    
    setSpecialiteTemp('');
  };
  
  const removeSpecialite = (specialite, employe, setEmploye) => {
    setEmploye(prev => ({
      ...prev,
      specialites: prev.specialites.filter(s => s !== specialite)
    }));
  };
  
  // Fonctions CRUD pour l'API
  const fetchEmployes = async () => {
    setLoading(true);
    try {
      // Préparer les paramètres de requête
      let params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (activeStatut !== 'Tous') {
        params.statut = activeStatut;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      // Vérifier si un token est disponible pour l'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur pour accéder à cette page');
        setError('Authentification requise');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${config.apiBaseUrl}/admin/employees`, { 
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && Array.isArray(response.data.data)) {
        setEmployes(response.data.data);
        
        // Mettre à jour la pagination si elle est fournie
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
        
        // Collecter toutes les spécialités uniques des employés
        const allSpecialites = response.data.data
          .flatMap(emp => emp.specialites || [])
          .filter((value, index, self) => self.indexOf(value) === index);
          
        if (allSpecialites.length > 0) {
          setSpecialitesDisponibles([...new Set([...specialitesDisponibles, ...allSpecialites])]);
        }
        
        setError(null);
      } else {
        throw new Error('Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des employés:', err);
      setError('Impossible de charger les employés');
      toast.error('Erreur lors du chargement des employés');
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour ajouter un nouvel employé
  const addEmploye = async () => {
    // Validation du formulaire
    if (!validateEmployeForm(newEmploye)) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Vérifier si un token est disponible pour l'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur pour ajouter un employé');
        return;
      }
      
      // S'assurer que le salaire est bien un nombre
      const employeData = {
        ...newEmploye,
        salaire: Number(newEmploye.salaire || 0)
      };
      
      const response = await axios.post(`${config.apiBaseUrl}/admin/employees`, employeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        toast.success('Employé ajouté avec succès');
        setShowAddModal(false);
        setNewEmploye({...defaultEmployeState});
        fetchEmployes();
      } else {
        throw new Error(response.data?.message || 'Erreur lors de l\'ajout de l\'employé');
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'employé:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'ajout de l\'employé';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour mettre à jour un employé existant
  const updateEmploye = async () => {
    if (!selectedEmploye) return;
    
    // Validation du formulaire
    if (!validateEmployeForm(selectedEmploye)) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Vérifier si un token est disponible pour l'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur pour modifier un employé');
        setIsSubmitting(false);
        return;
      }
      
      // S'assurer que nous avons un ID valide
      const employeId = selectedEmploye._id || selectedEmploye.id;
      if (!employeId) {
        throw new Error('ID de l\'employé manquant');
      }
      
      console.log('Mise à jour de l\'employé avec ID:', employeId);
      
      // Si le mot de passe est vide, on l'enlève de la requête (pour ne pas écraser le mot de passe existant)
      // S'assurer que le salaire est bien un nombre
      const employeData = {
        nom: selectedEmploye.nom,
        prenom: selectedEmploye.prenom,
        email: selectedEmploye.email,
        telephone: selectedEmploye.telephone,
        adresse: selectedEmploye.adresse,
        poste: selectedEmploye.poste,
        salaire: Number(selectedEmploye.salaire || 0), // Conversion explicite en nombre
        statut: selectedEmploye.statut,
        role: selectedEmploye.role,
        specialites: selectedEmploye.specialites
      };
      
      if (selectedEmploye.password) {
        employeData.password = selectedEmploye.password;
      }
      
      console.log('Données envoyées:', employeData);
      
      const response = await axios.put(`${config.apiBaseUrl}/admin/employees/${employeId}`, employeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.success) {
        toast.success('Employé mis à jour avec succès');
        setShowEditModal(false);
        setSelectedEmploye(null);
        fetchEmployes();
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la mise à jour de l\'employé');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'employé:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la mise à jour de l\'employé';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour supprimer un employé
  const deleteEmploye = async () => {
    if (!selectedEmploye) return;
    
    setIsSubmitting(true);
    try {
      // Vérifier si un token est disponible pour l'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur pour supprimer un employé');
        setIsSubmitting(false);
        return;
      }
      
      // S'assurer que nous avons un ID valide
      const employeId = selectedEmploye._id || selectedEmploye.id;
      if (!employeId) {
        throw new Error('ID de l\'employé manquant');
      }
      
      console.log('Suppression de l\'employé avec ID:', employeId);
      
      const response = await axios.delete(`${config.apiBaseUrl}/admin/employees/${employeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data && response.data.success) {
        toast.success('Employé supprimé avec succès');
        setShowDeleteModal(false);
        setSelectedEmploye(null);
        fetchEmployes();
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la suppression de l\'employé');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'employé:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la suppression de l\'employé';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonctions d'initialisation des modaux
  const initAddEmploye = () => {
    setNewEmploye({...defaultEmployeState});
    setFormErrors({});
    setSpecialiteTemp('');
    setShowAddModal(true);
  };
  
  const initEditEmploye = (employe) => {
    // S'assurer que toutes les propriétés ont des valeurs par défaut définies
    setSelectedEmploye({
      ...defaultEmployeState,
      ...employe,
      password: employe.password || '',
      adresse: employe.adresse || '',
      specialites: employe.specialites || []
    });
    setFormErrors({});
    setSpecialiteTemp('');
    setShowEditModal(true);
  };
  
  const initDeleteEmploye = (employe) => {
    setSelectedEmploye({...employe});
    setShowDeleteModal(true);
  };
  
  const initDetailsEmploye = (employe) => {
    setSelectedEmploye({...employe});
    setShowDetailsModal(true);
  };
  
  // Fonction pour changer de page
  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  // Fonction pour changer le statut actif
  const changeStatut = (statut) => {
    setActiveStatut(statut);
  };
  
  // Fonction pour effectuer une recherche
  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployes();
  };
  
  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur pour accéder à cette page');
      }
    };
    
    checkAuth();
    fetchEmployes();
    // Récupérer les services assignés aux employés
    fetchEmployeesWithServices();
    
    // Vérifie périodiquement les nouvelles assignations
    const checkInterval = setInterval(checkNewAssignments, 30000); // Vérifie toutes les 30 secondes
    
    // Vérifie immédiatement si nous avons une assignation récente
    checkNewAssignments();
    
    // Pour l'animation des notifications
    const style = document.createElement('style');
    style.textContent = `
      .animated-toast {
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(237, 137, 54, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(237, 137, 54, 0); }
        100% { box-shadow: 0 0 0 0 rgba(237, 137, 54, 0); }
      }
      .amber-progress {
        background: linear-gradient(to right, #f6ad55, #ed8936) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      clearInterval(checkInterval);
      document.head.removeChild(style);
    };
  }, []);
  
  // Fonction pour vérifier les nouvelles assignations
  const checkNewAssignments = () => {
    try {
      // Récupère les dernières assignations du localStorage
      const lastAssignmentStr = localStorage.getItem('employeeAssigned');
      if (!lastAssignmentStr) return;
      
      const lastAssignment = JSON.parse(lastAssignmentStr);
      const now = new Date().getTime();
      const assignmentTime = lastAssignment.timestamp || 0;
      
      // Si l'assignation est récente (moins de 5 minutes)
      if (now - assignmentTime < 5 * 60 * 1000) {
        // Vérifie si nous avons déjà cette notification
        const notifExists = notifications.some(n => 
          n.serviceId === lastAssignment.serviceId && 
          n.employeeId === lastAssignment.employeeId
        );
        
        if (!notifExists) {
          // Récupère le type de service pour une notification plus détaillée
          let serviceType = "";
          try {
            // Essaie de récupérer les informations complètes sur le service
            const assignedEmployees = JSON.parse(localStorage.getItem('assignedEmployees') || '{}');
            const serviceInfo = assignedEmployees[lastAssignment.serviceId];
            if (serviceInfo && serviceInfo.serviceType) {
              serviceType = ` de type "${serviceInfo.serviceType}"`;
            }
          } catch (e) {
            console.log('Pas d\'information sur le type de service');
          }
          
          // Ajoute la nouvelle notification
          const newNotification = {
            id: `assign-${Date.now()}`,
            type: 'assignment',
            serviceId: lastAssignment.serviceId,
            employeeId: lastAssignment.employeeId,
            employeeName: lastAssignment.employeeName,
            message: `Un service${serviceType} a été assigné à ${lastAssignment.employeeName}`,
            timestamp: lastAssignment.timestamp,
            read: false,
            icon: <FaClipboardCheck className="text-green-500" />
          };
          
          setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Garde les 10 plus récentes
          setNewAssignmentCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des nouvelles assignations:', error);
    }
  };
  
  // Fonction pour récupérer les services assignés à chaque employé
  const fetchEmployeesWithServices = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token manquant pour récupérer les services');
        return;
      }
      
      console.log('Récupération des services assignés aux employés...');
      
      // Récupérer tous les services depuis le backend
      // Vérifier toutes les routes API possibles comme dans la page clients
      let servicesResponse;
      let success = false;
      
      // Récupérer les clients avec leurs services
      try {
        // Essayer d'abord la route clients avec leurs services
        servicesResponse = await axios.get(`${config.apiBaseUrl}/admin/clients-with-services`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        success = true;
      } catch (firstAttemptError) {
        try {
          // Essayer ensuite la route clients
          servicesResponse = await axios.get(`${config.apiBaseUrl}/admin/clients`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          success = true;
        } catch (secondAttemptError) {
          try {
            // Ensuite essayer la route services
            servicesResponse = await axios.get(`${config.apiBaseUrl}/admin/services`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            success = true;
          } catch (thirdAttemptError) {
            try {
              // Essayer la route services sans préfixe admin
              servicesResponse = await axios.get(`${config.apiBaseUrl}/services`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              success = true;
            } catch (fourthAttemptError) {
              try {
                // Essayer la route orders
                servicesResponse = await axios.get(`${config.apiBaseUrl}/admin/orders`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                success = true;
              } catch (fifthAttemptError) {
                try {
                  // Dernier essai avec la route orders sans préfixe
                  servicesResponse = await axios.get(`${config.apiBaseUrl}/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  success = true;
                } catch (finalAttemptError) {
                  console.error('Impossible de récupérer les services depuis le backend:', finalAttemptError);
                  return;
                }
              }
            }
          }
        }
      }
      
      if (!success) {
        console.error('Aucune route API n\'a fonctionné');
        return;
      }
      
      // Traiter les données des services
      let allServices = [];
      
      if (servicesResponse.data && servicesResponse.data.success) {
        // Format standard API
        if (Array.isArray(servicesResponse.data.data)) {
          // Si c'est un tableau de services direct
          allServices = servicesResponse.data.data;
        } else if (servicesResponse.data.data && Array.isArray(servicesResponse.data.data.clients)) {
          // Si c'est un tableau de clients avec des services
          allServices = servicesResponse.data.data.clients.flatMap(client => 
            client.services || []
          );
        }
      } else if (servicesResponse.data && Array.isArray(servicesResponse.data)) {
        // Format API alternatif
        allServices = servicesResponse.data;
      } else if (servicesResponse.data && Array.isArray(servicesResponse.data.clients)) {
        // Format avec liste de clients directement
        allServices = servicesResponse.data.clients.flatMap(client => 
          client.services || []
        );
      } else {
        console.error('Format de réponse API non reconnu:', servicesResponse.data);
        return;
      }
      
      console.log(`${allServices.length} services trouvés pour vérifier les assignations`);
      
      // Construire le dictionnaire des employés avec services assignés
      const avecServices = {};
      
      allServices.forEach(service => {
        // Vérifier si un employé est assigné à ce service
        const employeeId = service.employeeId || service.employee_id || 
                         (service.employee && (service.employee._id || service.employee.id));
        
        if (employeeId) {
          avecServices[employeeId] = (avecServices[employeeId] || 0) + 1;
        }
      });
      
      console.log('Services assignés trouvés pour employés:', avecServices);
      setEmployesAvecServices(avecServices);
    } catch (error) {
      console.error('Erreur lors de la récupération des services assignés:', error);
    }
  };

  // Charger les employés au chargement et quand les filtres changent
  useEffect(() => {
    fetchEmployes();
    fetchEmployeesWithServices();
  }, [pagination.page, pagination.limit, activeStatut]);
  
  // Rafraîchir la liste des services assignés à intervalles réguliers
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEmployeesWithServices();
    }, 30000); // Vérifier toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Gestion des Employés</h1>
        
        {/* Centre de notifications */}
        <div className="relative">
          <button 
            className="flex items-center bg-white text-amber-500 px-3 py-2 rounded-lg border border-amber-200 hover:bg-amber-50 transition-all"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (showNotifications) {
                // Marquer toutes les notifications comme lues
                setNotifications(prev => 
                  prev.map(n => ({...n, read: true}))
                );
                setNewAssignmentCount(0);
              }
            }}
          >
            <FaBell className="mr-2" />
            <span>Notifications</span>
            {newAssignmentCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {newAssignmentCount}
              </span>
            )}
          </button>
          
          {/* Panneau de notifications */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
              <div className="p-3 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
                <h3 className="font-semibold text-amber-700">Notifications</h3>
                <button 
                  className="text-xs text-amber-600 hover:text-amber-800"
                  onClick={() => {
                    setNotifications([]);
                    setNewAssignmentCount(0);
                  }}
                >
                  Tout effacer
                </button>
              </div>
              
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`p-3 border-b border-gray-100 flex items-start ${!notif.read ? 'bg-amber-50' : ''}`}
                        onClick={() => {
                          // Marquer comme lu
                          setNotifications(prev => 
                            prev.map(n => n.id === notif.id ? {...n, read: true} : n)
                          );
                          if (!notif.read) setNewAssignmentCount(prev => Math.max(0, prev - 1));
                        }}
                      >
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {notif.icon || <FaClipboardCheck className="text-green-500" />}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <p className="font-medium text-sm">
                              {notif.type === 'assignment' ? 'Nouvelle assignation' : 'Notification'}
                            </p>
                            <span className="text-xs text-gray-500">
                              {notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{notif.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p>Aucune notification récente</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={initAddEmploye}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
          disabled={isSubmitting}
        >
          <FaPlus className="mr-2" /> Ajouter un Employé
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
                placeholder="Rechercher un employé..."
                className="w-full p-3 pl-10 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {/* <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-1 rounded"
              >
                <FaSearch />
              </button> */}
            </div>
          </form>
          
          {/* Filtres par statut */}
          <div className="flex items-center gap-3">
            <FaFilter className="text-gray-500" />
            <span className="text-gray-700">Statut:</span>
            <select
              className="p-2 border rounded-md"
              value={activeStatut}
              onChange={(e) => changeStatut(e.target.value)}
            >
              {statuts.map((statut) => (
                <option key={`statut-${statut}`} value={statut}>{statut}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Affichage des employés */}
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
              onClick={fetchEmployes}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Réessayer
            </button>
          </div>
        ) : employes.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <p>Aucun employé trouvé. Ajoutez votre premier employé!</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Nom</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Téléphone</th>
                    <th className="p-3 text-left">Poste</th>
                    <th className="p-3 text-left">Salaire</th>
                    <th className="p-3 text-left">Statut</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employes.map((employe, index) => (
                    <tr key={employe._id || `employee-${index}-${employe.email || ''}`} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-semibold">
                          {employe.prenom} {employe.nom}
                          {(() => {
                            // Vérifier tous les identifiants possibles de l'employé
                            const empId = employe._id || employe.id;
                            const hasAssignedServices = employesAvecServices[empId] > 0;
                            
                            if (hasAssignedServices) {
                              return (
                                <span 
                                  className="text-amber-500 ml-2 text-lg animate-pulse" 
                                  title={`${employesAvecServices[empId]} service(s) assigné(s)`}
                                >
                                  ⚡
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        {employe.specialites?.length > 0 && (
                          <div className="text-xs mt-1 flex gap-1 flex-wrap">
                            {employe.specialites.map((specialite) => (
                              <span 
                                key={`${employe._id}-specialite-${specialite}`}
                                className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-xs"
                              >
                                {specialite}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{employe.email}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{employe.telephone}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{employe.poste}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-600 rounded-full mr-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </span>
                          <div>
                            <div className="font-medium text-gray-900">{Number(employe.salaire || '').toLocaleString()} CFA</div>
                            <div className="text-xs text-gray-500">Salaire mensuel</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${employe.statut === 'Actif' ? 'bg-green-100 text-green-800' : employe.statut === 'En congé' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {employe.statut}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => initDetailsEmploye(employe)}
                            className="p-1 text-blue-500 hover:bg-blue-100 rounded"
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => initEditEmploye(employe)}
                            className="p-1 text-green-500 hover:bg-green-100 rounded"
                            title="Éditer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => initDeleteEmploye(employe)}
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
                      key={`pagination-page-${index + 1}`}
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
      
      {/* Modal d'ajout d'employé */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Ajouter un nouvel employé</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informations personnelles */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="prenom"
                  value={newEmploye.prenom}
                  onChange={handleEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.prenom ? 'border-red-500' : ''}`}
                />
                {formErrors.prenom && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.prenom}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nom"
                  value={newEmploye.nom}
                  onChange={handleEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.nom ? 'border-red-500' : ''}`}
                />
                {formErrors.nom && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.nom}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={newEmploye.email}
                  onChange={handleEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="telephone"
                  value={newEmploye.telephone}
                  onChange={handleEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.telephone ? 'border-red-500' : ''}`}
                />
                {formErrors.telephone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.telephone}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={newEmploye.adresse}
                  onChange={handleEmployeChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              {/* Informations professionnelles */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Poste <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="poste"
                  value={newEmploye.poste}
                  onChange={handleEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.poste ? 'border-red-500' : ''}`}
                />
                {formErrors.poste && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.poste}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Salaire <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="number"
                    name="salaire"
                    value={newEmploye.salaire || ''}
                    onChange={handleEmployeChange}
                    className={`w-full p-2 pl-10 border rounded-lg bg-amber-50 border-amber-300 font-medium ${formErrors.salaire ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    CFA
                  </div>
                </div>
                {formErrors.salaire ? (
                  <p className="text-red-500 text-xs mt-1">{formErrors.salaire}</p>
                ) : (
                  <p className="text-xs text-amber-600 mt-1">Salaire mensuel en Francs CFA</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Statut</label>
                <select
                  name="statut"
                  value={newEmploye.statut}
                  onChange={handleEmployeChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option key="statut-actif" value="Actif">Actif</option>
                  <option key="statut-en-conge" value="En congé">En congé</option>
                  <option key="statut-inactif" value="Inactif">Inactif</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Rôle</label>
                <select
                  name="role"
                  value={newEmploye.role}
                  onChange={handleEmployeChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option key="role-employe" value="employe">Employé</option>
                  <option key="role-admin" value="admin">Administrateur</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Mot de passe <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  name="password"
                  value={newEmploye.password}
                  onChange={handleEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.password ? 'border-red-500' : ''}`}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>
            </div>
            
            {/* Spécialités */}
            <div className="mt-4 mb-6">
              <label className="block text-gray-700 mb-2">Spécialités</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newEmploye.specialites.map((specialite) => (
                  <span 
                    key={`specialite-new-${specialite}`}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    {specialite}
                    <button
                      type="button"
                      onClick={() => removeSpecialite(specialite, newEmploye, setNewEmploye)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={specialiteTemp}
                  onChange={(e) => setSpecialiteTemp(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                >
                  <option key="specialite-default" value="">Sélectionnez une spécialité</option>
                  {specialitesDisponibles.map((specialite, index) => (
                    <option key={`specialite-option-${specialite}`} value={specialite}>{specialite}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addSpecialite(newEmploye, setNewEmploye)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Ajouter
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={addEmploye}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de modification d'employé */}
      {showEditModal && selectedEmploye && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Modifier l'employé</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Informations personnelles */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="prenom"
                  value={selectedEmploye.prenom}
                  onChange={handleSelectedEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.prenom ? 'border-red-500' : ''}`}
                />
                {formErrors.prenom && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.prenom}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="nom"
                  value={selectedEmploye.nom}
                  onChange={handleSelectedEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.nom ? 'border-red-500' : ''}`}
                />
                {formErrors.nom && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.nom}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={selectedEmploye.email}
                  onChange={handleSelectedEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.email ? 'border-red-500' : ''}`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="telephone"
                  value={selectedEmploye.telephone}
                  onChange={handleSelectedEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.telephone ? 'border-red-500' : ''}`}
                />
                {formErrors.telephone && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.telephone}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={selectedEmploye.adresse}
                  onChange={handleSelectedEmployeChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              
              {/* Informations professionnelles */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Poste <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="poste"
                  value={selectedEmploye.poste}
                  onChange={handleSelectedEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.poste ? 'border-red-500' : ''}`}
                />
                {formErrors.poste && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.poste}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Salaire <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <input
                    type="number"
                    name="salaire"
                    value={selectedEmploye.salaire || ''}
                    onChange={handleSelectedEmployeChange}
                    className={`w-full p-2 pl-10 border rounded-lg bg-amber-50 border-amber-300 font-medium ${formErrors.salaire ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    CFA
                  </div>
                </div>
                {formErrors.salaire ? (
                  <p className="text-red-500 text-xs mt-1">{formErrors.salaire}</p>
                ) : (
                  <p className="text-xs text-amber-600 mt-1">Salaire mensuel en Francs CFA</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Statut</label>
                <select
                  name="statut"
                  value={selectedEmploye.statut}
                  onChange={handleSelectedEmployeChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option key="edit-statut-actif" value="Actif">Actif</option>
                  <option key="edit-statut-en-conge" value="En congé">En congé</option>
                  <option key="edit-statut-inactif" value="Inactif">Inactif</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Rôle</label>
                <select
                  name="role"
                  value={selectedEmploye.role}
                  onChange={handleSelectedEmployeChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option key="edit-role-employe" value="employe">Employé</option>
                  <option key="edit-role-admin" value="admin">Administrateur</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Nouveau mot de passe (laisser vide pour conserver l'actuel)</label>
                <input
                  type="password"
                  name="password"
                  value={selectedEmploye.password || ''}
                  onChange={handleSelectedEmployeChange}
                  className={`w-full p-2 border rounded-lg ${formErrors.password ? 'border-red-500' : ''}`}
                  placeholder="Laissez vide pour conserver le mot de passe actuel"
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>
            </div>
            
            {/* Spécialités */}
            <div className="mt-4 mb-6">
              <label className="block text-gray-700 mb-2">Spécialités</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedEmploye.specialites.map((specialite, index) => (
                  <span 
                    key={`edit-specialite-${specialite}`}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1"
                  >
                    {specialite}
                    <button
                      type="button"
                      onClick={() => removeSpecialite(specialite, selectedEmploye, setSelectedEmploye)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={specialiteTemp}
                  onChange={(e) => setSpecialiteTemp(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                >
                  <option key="specialite-default" value="">Sélectionnez une spécialité</option>
                  {specialitesDisponibles.map((specialite, index) => (
                    <option key={`specialite-option-${specialite}`} value={specialite}>{specialite}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => addSpecialite(selectedEmploye, setSelectedEmploye)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Ajouter
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={updateEmploye}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Mise à jour...
                  </>
                ) : (
                  'Mettre à jour'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de suppression d'employé */}
      {showDeleteModal && selectedEmploye && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-red-600">Confirmation de suppression</h2>
            
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer l'employé <strong>{selectedEmploye.prenom} {selectedEmploye.nom}</strong> ?
              Cette action est irréversible.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={deleteEmploye}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de détails d'employé */}
      {showDetailsModal && selectedEmploye && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Détails de l'employé</h2>
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p>{selectedEmploye.prenom} {selectedEmploye.nom}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{selectedEmploye.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p>{selectedEmploye.telephone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p>{selectedEmploye.adresse || '-'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">Informations professionnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Poste</p>
                  <p>{selectedEmploye.poste}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Salaire</p>
                  <p>{(selectedEmploye.salaire !== undefined && selectedEmploye.salaire !== null) ? Number(selectedEmploye.salaire).toLocaleString() : ''} CFA</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p>
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${selectedEmploye.statut === 'Actif' ? 'bg-green-100 text-green-800' : selectedEmploye.statut === 'En congé' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {selectedEmploye.statut}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Rôle</p>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedEmploye.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                      {selectedEmploye.role === 'admin' ? 'Administrateur' : 'Employé'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-2">Spécialités</h3>
              {selectedEmploye.specialites && selectedEmploye.specialites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedEmploye.specialites.map((specialite, index) => (
                    <span 
                      key={`details-specialite-${specialite}`}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      {specialite}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucune spécialité</p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowDetailsModal(false);
                  initEditEmploye(selectedEmploye);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaEdit className="mr-2" /> Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
