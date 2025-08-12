'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaEye, FaEdit, FaTrash, FaSpinner, FaFilter, 
  FaSort, FaSearch, FaExclamationTriangle, FaCheckCircle,
  FaShoppingBag, FaCalendarAlt, FaBoxOpen, FaTruck, FaClipboardList,
  FaTag, FaPalette, FaMoneyBillWave, FaMapMarkerAlt, FaPlus, 
  FaTimesCircle, FaFilePdf, FaFileInvoice, FaUserClock, FaCalendarCheck,
  FaInfoCircle, FaCommentAlt, FaClock
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import serviceClient from '../../../services/serviceClient';
import authService from '../../../services/authService';
import axios from 'axios';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function CommandesPage() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'view', 'edit', 'delete'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'type', 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        loadServices();
      } else {
        setIsLoading(false);
        setError('Vous devez être connecté pour accéder à vos commandes');
      }
    };
    
    checkAuth();
  }, []);
  
  // Fonction pour calculer le nombre de jours de délai en fonction du type de service
  const calculerDelaiJours = (typeService) => {
    // Délais spécifiques pour chaque type de service (en jours)
    const delaisParTypeService = {
      'Lavage au kg': 5,
      'Blanchisserie': 3,  // 72h = 3 jours
      'Repassage': 1,      // 24h = 1 jour
      'Lavage Pro': 2,     // 48h = 2 jours
      'Pressing Standard': 2,
      'Pressing Express': 1,
      'Pressing Délicat': 3,
      'Tapis et Moquettes': 4,
      'Couette et Édredons': 3
    };
    
    // Retourner le délai spécifique ou la valeur par défaut (2 jours)
    return delaisParTypeService[typeService] || 2;
  };
  
  // Charger les services du client et les informations utilisateur
  const loadServices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await serviceClient.getClientServices();
      const userResult = await authService.getCurrentUser();
      
      // Récupérer les types de services pour leurs délais
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      // Récupérer tous les types de services
      const serviceTypesResponse = await axios.get(`${apiUrl}/admin/service-types`, {
        params: { limit: 100 },
        headers
      });
      
      // Créer une map des types de services avec leurs détails
      const serviceTypesMap = {};
      if (serviceTypesResponse.data && serviceTypesResponse.data.data) {
        serviceTypesResponse.data.data.forEach(type => {
          serviceTypesMap[type.nom] = {
            uniteTemps: type.uniteTemps || 'heures',
            delai: type.delai || (type.uniteTemps === 'heures' ? '24h' : '2 jours'),
            categorie: type.categorie
          };
        });
      }
      
      if (result.success) {
        // Calculer les dates de livraison pour chaque service avec les délais appropriés
        const servicesWithDeliveryDates = (result.data || []).map(service => {
          const typeService = service.typeService || '';
          
          // Calculer le délai en jours pour ce type de service spécifique
          const delaiService = calculerDelaiJours(typeService);
          
          // Calculer la date de livraison prévue
          const dateCommande = new Date(service.date);
          const dateLivraison = new Date(dateCommande);
          dateLivraison.setDate(dateCommande.getDate() + delaiService);
          
          return {
            ...service,
            delaiTraitement: delaiService,
            dateLivraisonPrevue: dateLivraison
          };
        });
        
        setServices(servicesWithDeliveryDates);
      } else {
        setError(result.error || 'Erreur lors du chargement des commandes');
      }
      
      if (userResult.success) {
        setUserData(userResult.data);
      }
    } catch (error) {
      console.error('Exception lors du chargement des commandes:', error);
      setError('Une erreur est survenue lors du chargement des commandes');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewService = (service) => {
    setSelectedService(service);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditService = (service) => {
    // Rediriger vers la page de modification avec les données du service
    router.push(`/reservation/commande?id=${service._id}`);
  };

  const handleCancelService = async () => {
    if (!serviceToDelete) return;
    
    try {
      setIsLoading(true);
      await serviceClient.cancelService(serviceToDelete._id);
      
      // Fermer la modal de confirmation
      setDeleteConfirmation(false);
      setServiceToDelete(null);
      
      // Afficher le message de succès
      setSuccessMessage('Votre commande a été annulée avec succès');
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Recharger les services après annulation
      await loadServices();
    } catch (error) {
      setError('Erreur lors de l\'annulation de la commande.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const closeDeleteConfirmation = () => {
    setDeleteConfirmation(false);
    setServiceToDelete(null);
  };
  
  // Filtrer les services
  const filteredServices = services
    .filter((service) => {
      // Filtre par statut
      if (filterStatus !== 'all' && service.statut !== filterStatus) {
        return false;
      }
      
      // Filtre par recherche
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          service.typeService.toLowerCase().includes(searchLower) ||
          service.adresse.toLowerCase().includes(searchLower) ||
          (service.description && service.description.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Tri
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'type') {
        return sortOrder === 'asc'
          ? a.typeService.localeCompare(b.typeService)
          : b.typeService.localeCompare(a.typeService);
      } else if (sortBy === 'status') {
        return sortOrder === 'asc'
          ? a.statut.localeCompare(b.statut)
          : b.statut.localeCompare(a.statut);
      }
      return 0;
    });
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour obtenir la classe de couleur en fonction du statut
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
     
    }
  };
  
  // Fonction pour obtenir l'icône en fonction du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case 'En attente':
        return <FaSpinner className="mr-1 animate-spin" />;
      case 'En cours':
        return <FaTruck className="mr-1" />;
      case 'Annulé':
        return <FaTimesCircle className="mr-1" />;
      default:
        return null;
    }
  };
  
  // Gérer le changement de tri
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Inverser l'ordre si on clique sur le même champ
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouveau champ de tri
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Fonction pour générer une facture PDF incluant uniquement les commandes terminées du client
  const generateInvoicePDF = () => {
    setGeneratingPdf(true);
    
    try {
      // Filtrer les commandes en cours et terminées
      const servicesToInclude = filteredServices.filter(service => service.statut === 'En attente' || service.statut === 'En cours' || service.statut === 'Terminé');
      
      // Si aucune commande terminée, afficher un message d'erreur
      if (servicesToInclude.length === 0) {
        setError('Vous n\'avez aucune commande en cours pour générer une facture');
        setTimeout(() => setError(null), 5000);
        return;
      }
      
      // Créer un nouveau document PDF
      const doc = new jsPDF();
      
      // Titre de la facture
      doc.setFontSize(22);
      doc.setTextColor(40, 120, 80);
      doc.text('FACTURE', 105, 30, { align: 'center' });
      
      // Logo et informations de l'entreprise
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text('OCÉANE PRESSING', 20, 20);
      doc.text('Service de pressing professionnel', 20, 25);
    
      // Date et numéro de facture
      const today = new Date();
      const formattedDate = today.toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      doc.setFontSize(10);
      doc.text(`Date: ${formattedDate}`, 150, 20);
      doc.text(`N° Facture: FCT-${Date.now().toString().substring(0, 8).toUpperCase()}`, 150, 25);
      
      // Informations du client
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('INFORMATIONS CLIENT', 20, 50);
      
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const userData = authService.getCurrentUser();
      if (userData) {
        doc.text(`Nom: ${userData.nom || ''} ${userData.prenom || ''}`, 20, 55);
        // doc.text(`Téléphone: ${userData.telephone || ''}`, 20, 60);
        doc.text(`Email: ${userData.email || ''}`, 20, 65);
      }
      
      // Adresse de livraison
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('ADRESSE DE LIVRAISON', 110, 50);
      
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      // Utiliser l'adresse de la dernière commande comme référence
      const lastService = servicesToInclude[0];
      
      // Découper l'adresse en lignes de 40 caractères maximum
      const addressLines = [];
      let remainingAddress = lastService.adresse;
      
      while (remainingAddress.length > 0) {
        let cutPoint = Math.min(40, remainingAddress.length);
        if (cutPoint < remainingAddress.length) {
          // Chercher un espace pour couper proprement
          while (cutPoint > 0 && remainingAddress[cutPoint] !== ' ') {
            cutPoint--;
          }
          if (cutPoint === 0) cutPoint = Math.min(40, remainingAddress.length);
        }
        addressLines.push(remainingAddress.substring(0, cutPoint).trim());
        remainingAddress = remainingAddress.substring(cutPoint).trim();
      }
      
      addressLines.forEach((line, index) => {
        doc.text(line, 110, 55 + (index * 5));
      });
      
      // Détails des commandes
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('DÉTAILS DES COMMANDES', 20, 80);
      
      // Tableau des détails des commandes terminées
      const tableHeaders = ['Service', 'Date', 'Quantité', 'Montant'];
      const tableData = servicesToInclude.map(service => [
        service.typeService,
        formatDate(service.date),
        service.quantite.toString(),
        `${service.montant.toLocaleString()} FCFA`
      ]);
      
      // Calculer le montant total de toutes les commandes
      const montantTotal = servicesToInclude.reduce((sum, service) => sum + service.montant, 0);
      
      // Générer le tableau
      const startY = 85;
      autoTable(doc, {
        startY,
        head: [tableHeaders],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [221, 153, 51], // Ambre
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        // Pas de pied de page ici car nous allons mettre le total séparément
        margin: { bottom: 15 } // Ajouter une marge en bas pour éviter que le contenu suivant soit trop près
      });
      
      // Ajouter les totaux avec une meilleure mise en évidence
      // Positionner après la fin du tableau
      let finalY = doc.lastAutoTable.finalY + 10; // Position après le tableau avec espace
      
      // Boîte rectangulaire pour le montant total avec dégradé ambre
      doc.setFillColor(221, 153, 51); // Couleur ambre assortie au thème
      doc.rect(105, finalY, 85, 15, 'F');
      
      // Ombre légère pour donner un effet 3D
      doc.setDrawColor(180, 120, 40);
      doc.setLineWidth(0.5);
      doc.line(105, finalY + 15, 190, finalY + 15);
      doc.line(190, finalY, 190, finalY + 15);
      
      // Texte du montant total en blanc et gras
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('MONTANT TOTAL:', 110, finalY + 10);
      doc.text(`${montantTotal.toLocaleString()} FCFA`, 175, finalY + 10, { align: 'right' });
      
      // Ligne de séparation sous le montant total
      doc.setDrawColor(221, 153, 51);
      doc.setLineWidth(0.5);
      doc.line(20, finalY + 25, 190, finalY + 25);
      
      // Aucune note n'est nécessaire car seules les commandes terminées sont incluses
      
      // Calculer la position du pied de page basée sur la position finale du montant total
      let footerY = finalY + 30; // Position après la boîte du montant total avec de l'espace
      
      // Pied de page
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text('OCÉANE PRESSING - Service de pressing professionnel', 105, footerY + 10, { align: 'center' });
      doc.text('Merci pour votre confiance !', 105, footerY + 15, { align: 'center' });

      // Enregistrer le PDF
      doc.save(`facture_pressing_${Date.now()}.pdf`);
      
      // Message de succès
      const messageSucces = 'La facture de vos commandes a été générée avec succès';
      
      setSuccessMessage(messageSucces);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      setError('Une erreur est survenue lors de la génération de la facture');
      setTimeout(() => setError(null), 5000);
    } finally {
      setGeneratingPdf(false);
    }
  };
  
  return (
    <div className="mt-10 p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaShoppingBag className="mr-3 text-green-600" />
          Liste de mes Commandes
        </h1>
       
      </div>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md flex items-center mb-4">
          <FaCheckCircle className="mr-2" />
          {successMessage}
        </div>
      )}
      
      {!isAuthenticated && !isLoading ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
          <div className="flex items-center">
            <FaExclamationTriangle className="mr-2" />reservation
            <p>Vous devez être connecté pour accéder à vos commandes.</p>
          </div>
          <button 
            onClick={() => router.push('/auth/login')}
            className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md"
          >
            Se connecter
          </button>
        </div>
      ) : (
        <>
          {/* Filtres et recherche */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher "
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filtre par statut */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="En attente">En attente</option>
                  <option value="En cours">En cours</option>
                  <option value="Terminé">Terminé</option>
                  <option value="Annulé">Annulé</option>
                </select>
              </div>
              
              {/* Tri */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSort className="text-gray-400" />
                </div>
                <select
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                >
                  <option value="date-desc">Date (récent → ancien)</option>

                  <option value="type-asc">Type de service (A → Z)</option>

                  <option value="status-desc">Statut (Z → A)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Liste des commandes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <FaSpinner className="animate-spin text-green-600 text-2xl" />
                <span className="ml-2">Chargement des commandes...</span>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-600">
                <FaExclamationTriangle className="mx-auto mb-2 text-3xl" />
                <p>{error}</p>
                <button
                  onClick={loadServices}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Réessayer
                </button>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                <p>Aucune commande trouvée</p>
                {searchTerm || filterStatus !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                    }}
                    className="mt-2 text-green-600 hover:underline"
                  >
                    Effacer les filtres
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/reservation/services')}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Créer une commande
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-6 py-3 cursor-pointer" onClick={() => handleSortChange('type')}>
                        <div className="flex items-center">
                          <FaTag className="mr-2 text-gray-500" />
                          Type de service
                          {sortBy === 'type' && (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3">
                        <div className="flex items-center">
                          <FaBoxOpen className="mr-2 text-gray-500" />
                          Détails
                        </div>
                      </th>
                      <th className="px-6 py-3 cursor-pointer" onClick={() => handleSortChange('status')}>
                        <div className="flex items-center">
                          <FaClipboardList className="mr-2 text-gray-500" />
                          Statut
                          {sortBy === 'status' && (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 cursor-pointer" onClick={() => handleSortChange('date')}>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-500" />
                          Date
                          {sortBy === 'date' && (
                            <FaSort className="ml-1 text-gray-400" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="mr-2 text-gray-500" />
                          Montant
                        </div>
                      </th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr key={service._id} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{service.typeService}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div><span className="font-medium">Quantité:</span> {service.quantite}</div>
                            {service.description && (
                              <div className="truncate max-w-xs" title={service.description}>
                                <span className="font-medium">Détails:</span> {service.description.substring(0, 50)}{service.description.length > 50 ? '...' : ''}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColorClass(service.statut)}`}>
                            {service.statut === 'En attente'}
                            {service.statut === 'En cours'  }                     
                            {service.statut === 'Annulé'  }
                            {service.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center">
                              <FaCalendarAlt className="text-amber-500 mr-1 text-xs" />
                              <span>{formatDate(service.date)}</span>
                            </div>
                            {service.dateLivraisonPrevue && (
                              <div className="mt-1">
                                <FaCalendarAlt className="inline-block text-green-600 mr-1" />
                                <span>Livraison prévue: {formatDate(service.dateLivraisonPrevue)}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{service.montant.toLocaleString()} FCFA</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleViewService(service)}
                              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                              title="Voir les détails"
                            >
                              <FaEye />
                            </button>
                            {service.statut === 'En attente' && (
                              <>
                                {/* <button
                                  onClick={() => handleEditService(service)}
                                  className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-md transition-colors"
                                  title="Modifier"
                                >
                                  <FaEdit />
                                </button> */}
                                <button
                                  disabled
                                  className="p-1.5 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
                                  title="L'annulation de commande n'est plus disponible. Veuillez contacter le service client."
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Bouton de génération de facture */}
          {filteredServices.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => generateInvoicePDF()}
                disabled={generatingPdf}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md flex items-center shadow-md"
              >
                {generatingPdf ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Génération de la facture...
                  </>
                ) : (
                  <>
                    <FaFileInvoice className="mr-2" /> Générer la facture
                  </>
                )}
              </button>
              {/* <div className="absolute mt-16 text-xs text-gray-500 text-center max-w-sm">
                Note: Génère une facture uniquement pour les commandes terminées
              </div> */}
            </div>
          )}
          
          {/* Modal de détails */}
          {showModal && selectedService && modalType === 'view' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <FaClipboardList className="mr-2 text-green-600" />
                    Détails de la commande
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    &times;
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium flex items-center"><FaTag className="mr-2 text-gray-600" /> Type de service:</span>
                    <span className="font-semibold">{selectedService.typeService}</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium flex items-center"><FaBoxOpen className="mr-2 text-gray-600" /> Quantité:</span>
                    <span className="font-semibold">{selectedService.quantite}</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium flex items-center"><FaCalendarAlt className="mr-2 text-amber-500" /> Date de commande:</span>
                    <span className="font-semibold">{formatDate(selectedService.date)}</span>
                  </div>
                  
                  {selectedService.dateLivraisonPrevue && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium flex items-center"><FaCalendarCheck className="mr-2 text-gray-600" /> Livraison prévue:</span>
                      <span className="font-semibold text-green-700">
                        {formatDate(selectedService.dateLivraisonPrevue)}
                      </span>
                    </div>
                  )}
                  
                  {userData && userData.dateInscription && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium flex items-center"><FaUserClock className="mr-2 text-gray-600" /> Date d'inscription:</span>
                      <span className="font-semibold">{new Date(userData.dateInscription).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium flex items-center"><FaTruck className="mr-2 text-amber-600" /> Délai:</span>
                    <span className="font-semibold">{selectedService.delaiTraitement || 2} jour(s)</span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium flex items-center"><FaClipboardList className="mr-2 text-gray-600" /> Statut:</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColorClass(selectedService.statut)}`}>
                      {getStatusIcon(selectedService.statut)}
                      {selectedService.statut}
                    </span>
                  </div>
                  
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium flex items-center"><FaMoneyBillWave className="mr-2 text-gray-600" /> Montant:</span>
                    <span className="font-semibold">{selectedService.montant.toLocaleString()} FCFA</span>
                  </div>
                  
                  <div className="border-b pb-2">
                    <span className="font-medium flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-600" /> Adresse:</span>
                    <p className="mt-1 pl-6">{selectedService.adresse}</p>
                  </div>
                  
                  {selectedService.description && (
                    <div>
                      <span className="font-medium flex items-center"><FaPalette className="mr-2 text-gray-600" /> Instructions:</span>
                      <p className="mt-1 pl-6">{selectedService.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  {selectedService.statut === 'En attente' && (
                    <button
                      onClick={() => {
                        setShowModal(false);
                        handleEditService(selectedService);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
                      <FaEdit className="mr-2" /> Modifier
                    </button>
                  )}
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Modal de confirmation de suppression */}
          {deleteConfirmation && serviceToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-center mb-4 text-red-600">
                  <FaExclamationTriangle className="text-3xl" />
                </div>
                
                <h2 className="text-xl font-bold text-center mb-4">Confirmer l'annulation</h2>
                
                <p className="text-center mb-6">
                  Êtes-vous sûr de vouloir annuler cette commande de <span className="font-semibold">{serviceToDelete.typeService}</span> ?
                  <br />
                  Cette action est irréversible.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={closeDeleteConfirmation}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md flex items-center"
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCancelService}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" /> Traitement...
                      </>
                    ) : (
                      <>
                        <FaTrash className="mr-2" /> Confirmer l'annulation
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}