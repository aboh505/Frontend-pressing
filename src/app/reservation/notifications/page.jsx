'use client';

import React, { useState, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaSpinner, FaClock, FaExclamationTriangle } from 'react-icons/fa';

// Composant pour une notification individuelle
const NotificationItem = ({ title, message, timestamp, status, serviceType }) => {
  const statusColors = {
    'en cours': 'text-amber-500',
    'prêt': 'text-green-500',
    'urgent': 'text-red-500',
    'bientôt prêt': 'text-blue-500'
  };
  
  const statusIcons = {
    'en cours': <FaSpinner className="animate-spin" />,
    'prêt': <FaCheckCircle />,
    'urgent': <FaExclamationTriangle />,
    'bientôt prêt': <FaClock />
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className={`text-sm font-medium ${statusColors[status] || 'text-gray-500'} flex items-center`}>
          <span className="mr-1">{statusIcons[status]}</span> {status}
        </span>
      </div>
      <p className="text-gray-600 my-2">{message}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
        <span>{serviceType}</span>
        <span>{timestamp}</span>
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calcul du délai en fonction du service
  const calculateReadyTime = (serviceType, orderDate) => {
    const date = new Date(orderDate);
    switch(serviceType) {
      case 'Express':
        return new Date(date.getTime() + 3 * 60 * 60 * 1000); // 3 heures
      case 'Standard':
        return new Date(date.getTime() + 24 * 60 * 60 * 1000); // 24 heures
      case 'Économique':
        return new Date(date.getTime() + 48 * 60 * 60 * 1000); // 48 heures
      default:
        return new Date(date.getTime() + 24 * 60 * 60 * 1000); // 24 heures par défaut
    }
  };

  // Fonction pour déterminer le statut d'une commande
  const getOrderStatus = (readyTime) => {
    const now = new Date();
    const timeDiff = readyTime - now;
    
    if (timeDiff <= 0) {
      return 'prêt';
    } else if (timeDiff < 60 * 60 * 1000) { // Moins d'1 heure
      return 'bientôt prêt';
    } else {
      return 'en cours';
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Générer un message en fonction du statut
  const generateMessage = (status, readyTime, serviceType) => {
    if (status === 'prêt') {
      return `Votre commande ${serviceType} est prête à être récupérée à notre boutique.`;
    } else if (status === 'bientôt prêt') {
      return `Votre commande sera prête dans moins d'une heure. Préparez-vous à venir la récupérer.`;
    } else {
      return `Votre commande est en cours de traitement. Elle sera prête le ${formatDate(readyTime)}.`;
    }
  };

  // Simulation de données pour les commandes et notifications
  useEffect(() => {
    // Simuler un délai de chargement
    setTimeout(() => {
      const now = new Date();
      
      // Commandes fictives avec différents délais
      const mockOrders = [
        {
          id: '1',
          title: 'Nettoyage Costume',
          serviceType: 'Express',
          timestamp: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString(),
          items: ['Veste', 'Pantalon']
        },
        {
          id: '2',
          title: 'Pressing Chemises',
          serviceType: 'Standard',
          timestamp: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString(),
          items: ['Chemise blanche', 'Chemise bleue', 'Chemise rayée']
        },
        {
          id: '3',
          title: 'Couette et Draps',
          serviceType: 'Économique',
          timestamp: new Date(now.getTime() - 47 * 60 * 60 * 1000).toISOString(),
          items: ['Couette 2 personnes', 'Drap housse', 'Taie d\'oreiller']
        },
        {
          id: '4',
          title: 'Vêtements Enfants',
          serviceType: 'Express',
          timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
          items: ['T-shirt', 'Pantalon', 'Pull']
        },
        {
          id: '5',
          title: 'Manteau Hiver',
          serviceType: 'Standard',
          timestamp: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString(),
          items: ['Manteau laine']
        }
      ];

      // Générer les notifications à partir des commandes
      const generatedNotifications = mockOrders.map(order => {
        const readyTime = calculateReadyTime(order.serviceType, order.timestamp);
        const status = getOrderStatus(readyTime);
        return {
          id: order.id,
          title: order.title,
          serviceType: order.serviceType,
          status,
          timestamp: formatDate(new Date(order.timestamp)),
          readyTime,
          message: generateMessage(status, readyTime, order.serviceType)
        };
      });

      setNotifications(generatedNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="mt-16 p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaBell className="mr-2 text-amber-500" /> Notifications
        </h1>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {notifications.filter(n => n.status === 'prêt').length} prêt(s)
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <p className="text-gray-700">
          Cette page affiche l'état de vos commandes en fonction du temps estimé pour chaque service.
          <br />
          <span className="text-sm text-gray-500">
            Les services Express sont généralement prêts en 3h, Standard en 24h et Économique en 48h.
          </span>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-3xl text-green-600" />
          <span className="ml-2 text-gray-600">Chargement des notifications...</span>
        </div>
      ) : (
        <>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {/* Commandes prêtes */}
              {notifications.filter(n => n.status === 'prêt').length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-3">Prêt à récupérer</h2>
                  {notifications
                    .filter(n => n.status === 'prêt')
                    .map(notification => (
                      <NotificationItem key={notification.id} {...notification} />
                    ))}
                </div>
              )}

              {/* Commandes bientôt prêtes */}
              {notifications.filter(n => n.status === 'bientôt prêt').length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-3">Bientôt prêt</h2>
                  {notifications
                    .filter(n => n.status === 'bientôt prêt')
                    .map(notification => (
                      <NotificationItem key={notification.id} {...notification} />
                    ))}
                </div>
              )}

              {/* Commandes en cours */}
              {notifications.filter(n => n.status === 'en cours').length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-3">En cours de traitement</h2>
                  {notifications
                    .filter(n => n.status === 'en cours')
                    .map(notification => (
                      <NotificationItem key={notification.id} {...notification} />
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <FaBell className="mx-auto text-4xl text-gray-300 mb-3" />
              <h3 className="text-xl font-medium text-gray-700">Aucune notification</h3>
              <p className="text-gray-500 mt-2">Vous n'avez pas encore de commandes en cours.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
