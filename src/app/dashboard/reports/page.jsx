'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaDownload, FaCalendarAlt, FaChartBar, FaChartLine, FaFileInvoiceDollar, FaUsers, FaTshirt, FaPieChart, FaSpinner
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../config/api';
import { ChartAreaIcon, PieChart } from 'lucide-react';

export default function ReportsPage() {
  // État pour la période sélectionnée
  const [period, setPeriod] = useState('month');
  
  // États pour les données réelles
  const [salesData, setSalesData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [stats, setStats] = useState([]);
  const [clientsStats, setClientsStats] = useState({
    totalClients: 0,
    activeClients: 0,
    newClients: 0,
    clientsEvolution: 0
  });
  const [ordersStats, setOrdersStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    ordersChange: 0
  });
  const [serviceDistribution, setServiceDistribution] = useState([]);
  
  // États pour le chargement
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingDistribution, setLoadingDistribution] = useState(false);

  // Sélecteurs de période pour les rapports
  const periodOptions = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' },
  ];
  
  // Récupérer le token JWT pour l'authentification
  const getToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Token d\'authentification non trouvé');
      }
      return token;
    }
    return null;
  };
  
  // Charger les données au chargement du composant et au changement de période
  useEffect(() => {
    fetchReportData();
    fetchBusinessStats();
  }, [period]);

  
  // Récupérer les données des rapports d'activité selon la période
  const fetchReportData = async () => {
    setLoadingSales(true);
    setLoadingServices(true);
    setLoadingCustomers(true);
    
    try {
      let endpoint;
      let params = {};
      let reportData;
      const token = getToken();
      
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur');
        setLoadingSales(false);
        setLoadingServices(false);
        setLoadingCustomers(false);
        return;
      }
      
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      console.log('Chargement des rapports pour la période:', period);
      
      // Déterminer le bon endpoint et les bons paramètres selon la période
      switch(period) {
        case 'week':
          endpoint = `${config.apiBaseUrl}/admin/reports/weekly`;
          params = { endDate: new Date().toISOString() };
          console.log('Endpoint rapport hebdomadaire:', endpoint, params);
          break;
          
        case 'month':
          const currentDate = new Date();
          endpoint = `${config.apiBaseUrl}/admin/reports/monthly`;
          params = { 
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1
          };
          console.log('Endpoint rapport mensuel:', endpoint, params);
          break;
          
        case 'quarter':
          endpoint = `${config.apiBaseUrl}/admin/reports/custom`;
          const today = new Date();
          const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
          const quarterEnd = new Date();
          
          // Pour le rapport personnalisé on utilise une requête POST
          try {
            const postData = {
              startDate: quarterStart.toISOString().split('T')[0],
              endDate: quarterEnd.toISOString().split('T')[0],
              groupBy: 'month'
            };
            
            console.log('Endpoint rapport trimestriel:', endpoint, postData);
            
            const response = await axios.post(endpoint, postData, { headers });
            console.log('Réponse API rapport trimestriel:', response.data);
            
            if (response.data && response.data.success) {
              reportData = response.data.data;
            } else {
              console.warn('Données de rapport trimestriel invalides:', response.data);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du rapport trimestriel:', error);
            console.error('Détails:', error.response?.data || 'Pas de détails disponibles');
            toast.error('Impossible de charger le rapport trimestriel');
          }
          break;
          
        case 'year':
          endpoint = `${config.apiBaseUrl}/admin/reports/custom`;
          const currentYear = new Date().getFullYear();
          
          // Pour le rapport annuel on utilise aussi une requête POST
          try {
            const postData = {
              startDate: `${currentYear}-01-01`,
              endDate: `${currentYear}-12-31`,
              groupBy: 'month'
            };
            
            console.log('Endpoint rapport annuel:', endpoint, postData);
            
            const response = await axios.post(endpoint, postData, { headers });
            console.log('Réponse API rapport annuel:', response.data);
            
            if (response.data && response.data.success) {
              reportData = response.data.data;
            } else {
              console.warn('Données de rapport annuel invalides:', response.data);
            }
          } catch (error) {
            console.error('Erreur lors de la récupération du rapport annuel:', error);
            console.error('Détails:', error.response?.data || 'Pas de détails disponibles');
            toast.error('Impossible de charger le rapport annuel');
          }
          break;
          
        default:
          endpoint = `${config.apiBaseUrl}/admin/reports/daily`;
          params = { date: new Date().toISOString().split('T')[0] };
          console.log('Endpoint rapport journalier (par défaut):', endpoint, params);
      }
      
      // Si ce n'est pas un rapport trimestriel ou annuel, faire une requête GET
      if (!reportData && (period === 'week' || period === 'month' || period === 'day')) {
        console.log('Exécution requête GET:', endpoint);
        try {
          const response = await axios.get(endpoint, { params, headers });
          console.log('Réponse API rapport:', response.data);
          
          if (response.data && response.data.success) {
            reportData = response.data.data;
          } else {
            console.warn('Données de rapport invalides:', response.data);
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération du rapport ${period}:`, error);
          console.error('Détails:', error.response?.data || 'Pas de détails disponibles');
          toast.error(`Impossible de charger le rapport ${period}`);
        }
      }
      
      // Traiter les données si elles existent
      if (reportData) {
        // Traitement des données de ventes
        if (reportData.salesByPeriod && Array.isArray(reportData.salesByPeriod)) {
          setSalesData(reportData.salesByPeriod.map(item => ({
            month: item.period,
            amount: item.totalAmount || 0
          })));
        } else {
          // Données par défaut si l'API ne renvoie pas la structure attendue
          setSalesData([{ month: 'Actuel', amount: reportData.totalSales || 0 }]);
        }
        
        // Traitement des données de services
        if (reportData.serviceDistribution && Array.isArray(reportData.serviceDistribution)) {
          setServicesData(reportData.serviceDistribution.map(item => ({
            name: item.serviceName || item.name,
            value: item.percentage || item.value || 0,
            orders: item.orders || 0,
            revenue: item.revenue || 0
          })));
        }
        
        // Traitement des données clients
        if (reportData.customerData && Array.isArray(reportData.customerData)) {
          setCustomerData(reportData.customerData.map(item => ({
            month: item.period,
            nouveaux: item.newCustomers || 0,
            actifs: item.activeCustomers || 0
          })));
        } else if (reportData.newCustomers !== undefined && reportData.activeCustomers !== undefined) {
          // Format alternatif si l'API ne renvoie pas la structure attendue
          setCustomerData([{
            month: 'Actuel',
            nouveaux: reportData.newCustomers || 0,
            actifs: reportData.activeCustomers || 0
          }]);
        }
      } else {
        // Utiliser des données par défaut en cas d'absence de données
        setSalesData([{ month: 'Jan', amount: 0 }]);
        setServicesData([{ name: 'Aucune donnée', value: 100 }]);
        setCustomerData([{ month: 'Jan', nouveaux: 0, actifs: 0 }]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      toast.error('Impossible de charger les données des rapports');
      
      // Utiliser des données par défaut en cas d'erreur
      setSalesData([{ month: 'Jan', amount: 0 }]);
      setServicesData([{ name: 'Erreur de chargement', value: 100 }]);
      setCustomerData([{ month: 'Jan', nouveaux: 0, actifs: 0 }]);
    } finally {
      setLoadingSales(false);
      setLoadingServices(false);
      setLoadingCustomers(false);
    }
  };
  
  // Récupérer les statistiques générales de l'entreprise
  const fetchBusinessStats = async () => {
    setLoadingStats(true);
    setLoadingDistribution(true);
    try {
      const token = getToken();
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur');
        setLoadingStats(false);
        setLoadingDistribution(false);
        return;
      }
      
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      console.log('Chargement des statistiques d\'entreprise');
      console.log('URL API:', `${config.apiBaseUrl}/admin/stats/business`);
      
      const response = await axios.get(`${config.apiBaseUrl}/admin/stats/business`, { headers });
      console.log('Réponse API stats:', response.data);
      
      if (response.data && response.data.success) {
        const data = response.data.data;
        
        // Vérification des données reçues
        if (!data) {
          console.error('Données manquantes dans la réponse');
          toast.error('Format de données statistiques incorrect');
          return;
        }
        
        // Mise à jour des statistiques clients
        setClientsStats({
          totalClients: data.totalClients || 0,
          activeClients: data.activeCustomers || 0,
          newClients: data.newClients || 0,
          clientsEvolution: data.customersChange || 0
        });
        
        // Mise à jour des statistiques commandes
        setOrdersStats({
          totalOrders: data.totalOrders || 0,
          completedOrders: data.completedOrders || 0,
          pendingOrders: data.pendingOrders || 0,
          ordersChange: data.ordersChange || 0
        });
        
        // Mise à jour des statistiques de répartition des services
        if (data.serviceTypes && Array.isArray(data.serviceTypes)) {
          setServiceDistribution(data.serviceTypes.map(type => ({
            name: type.type || 'Non spécifié',
            orders: type.count || 0,
            revenue: type.revenue || 0,
            value: type.percentage || 0
          })));
        }
        
        // Créer des statistiques à partir des données réelles avec valeurs par défaut si manquantes
        const newStats = [
          { 
            title: 'Chiffre d\'affaires', 
            value: data.totalRevenue ? `${(data.totalRevenue / 1000000).toFixed(1)}M FCFA` : '0 FCFA', 
            icon: <FaFileInvoiceDollar className="text-green-500" />, 
            change: data.revenueChange ? (data.revenueChange > 0 ? `+${data.revenueChange}%` : `${data.revenueChange}%`) : '0%', 
            period: 'depuis la période précédente' 
          },
          { 
            title: 'Total commandes', 
            value: data.totalOrders ? data.totalOrders.toString() : '0', 
            icon: <FaTshirt className="text-amber-500" />, 
            change: data.ordersChange ? (data.ordersChange > 0 ? `+${data.ordersChange}%` : `${data.ordersChange}%`) : '0%', 
            period: 'depuis la période précédente' 
          },
          { 
            title: 'Clients actifs', 
            value: data.activeCustomers ? data.activeCustomers.toString() : '0', 
            icon: <FaUsers className="text-blue-500" />, 
            change: data.customersChange ? (data.customersChange > 0 ? `+${data.customersChange}%` : `${data.customersChange}%`) : '0%', 
            period: 'depuis la période précédente' 
          },
          { 
            title: 'Valeur moyenne', 
            value: data.averageOrderValue ? `${data.averageOrderValue.toLocaleString()} FCFA` : '0 FCFA', 
            icon: <FaChartLine className="text-purple-500" />, 
            change: data.aovChange ? (data.aovChange > 0 ? `+${data.aovChange}%` : `${data.aovChange}%`) : '0%', 
            period: 'depuis la période précédente' 
          },
        ];
        
        setStats(newStats);
        
        // Mise à jour des données clients pour le graphique d'évolution
        // Ces données seront étendues via la fonction fetchReportData
        const newCustomerData = [];
        if (data.activeCustomers || data.newClients) {
          newCustomerData.push({
            month: 'Actuel',
            actifs: data.activeCustomers || 0,
            nouveaux: data.newClients || 0
          });
          setCustomerData(newCustomerData);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      toast.error('Impossible de charger les statistiques');
      
      // Statistiques par défaut en cas d'erreur
      setStats([
        { title: 'Chiffre d\'affaires', value: '0 FCFA', icon: <FaFileInvoiceDollar className="text-green-500" />, change: '0%', period: 'aucune donnée' },
        { title: 'Total commandes', value: '0', icon: <FaTshirt className="text-amber-500" />, change: '0%', period: 'aucune donnée' },
        { title: 'Clients actifs', value: '0', icon: <FaUsers className="text-blue-500" />, change: '0%', period: 'aucune donnée' },
        { title: 'Valeur moyenne', value: '0 FCFA', icon: <FaChartLine className="text-purple-500" />, change: '0%', period: 'aucune donnée' },
      ]);
      
      // Valeurs par défaut pour les autres états en cas d'erreur
      setClientsStats({
        totalClients: 0,
        activeClients: 0,
        newClients: 0,
        clientsEvolution: 0
      });
      
      setOrdersStats({
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        ordersChange: 0
      });
      
      setServiceDistribution([]);
    } finally {
      setLoadingStats(false);
      setLoadingDistribution(false);
    }
  };
  
  // Téléchargement du rapport
  const downloadReport = async (format) => {
    setLoading(true);
    try {
      const token = getToken();
      
      if (!token) {
        toast.error('Vous devez être connecté en tant qu\'administrateur pour télécharger des rapports');
        setLoading(false);
        return;
      }
      
      const headers = { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json'
      };
      
      // Préparer les données pour l'export
      const requestData = { format, period };
      
      console.log('Téléchargement du rapport - URL:', `${config.apiBaseUrl}/admin/reports/export`);
      console.log('Données envoyées:', requestData);
      
      // Endpoint pour télécharger un rapport
      const response = await axios.post(
        `${config.apiBaseUrl}/admin/reports/export`, 
        requestData,
        { 
          headers,
          responseType: 'blob' // Important pour le téléchargement de fichiers
        }
      );
      
      // Vérifier que la réponse est bien un blob et non une erreur
      const contentType = response.headers['content-type'];
      if (contentType && contentType.indexOf('application/json') !== -1) {
        // C'est probablement une erreur au format JSON et non un blob
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorResponse = JSON.parse(reader.result);
            console.error('Erreur API lors du téléchargement:', errorResponse);
            toast.error(errorResponse.message || `Erreur lors du téléchargement du rapport`);
          } catch (e) {
            console.error('Erreur lors de l\'analyse de la réponse:', e);
            toast.error(`Erreur lors du téléchargement du rapport au format ${format.toUpperCase()}`);
          }
        };
        reader.readAsText(response.data);
        return;
      }
      
      // Créer un lien pour télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_${period}_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage
      window.URL.revokeObjectURL(url);
      link.remove();
      
      toast.success(`Le rapport au format ${format.toUpperCase()} a été téléchargé avec succès.`);
    } catch (error) {
      console.error('Erreur lors du téléchargement du rapport:', error);
      console.error('Détails de l\'erreur:', error.response || 'Pas de détails disponibles');
      toast.error(`Erreur lors du téléchargement du rapport au format ${format.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Composant pour afficher un état de chargement
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center h-64">
      <FaSpinner className="animate-spin text-green-600 text-4xl" />
    </div>
  );

  return (
    <div className="p-6 mt-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Rapports & Statistiques</h1>
        <div className="flex items-center space-x-2">
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        
        </div>
      </div>

      {/* Statistiques récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {loadingStats ? (
          // Afficher des placeholders pendant le chargement
          Array(4).fill().map((_, index) => (
            <div key={`report-section-${index}`} className="bg-white p-4 rounded-lg shadow">
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              </div>
            </div>
          ))
        ) : (
          // Afficher les statistiques réelles
          stats.map((stat, index) => (
            <div key={`report-section-${index}`} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-100">
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className={`text-sm ${!stat.change.includes('-') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-2">{stat.period}</span>
              </div>
            </div>
          ))
        )}
      </div>

     

      {/* Tableau des meilleures ventes */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Top Services les plus vendus</h2>
        </div>
        <div className="overflow-x-auto">
          {loadingServices ? (
            // Afficher un indicateur de chargement pendant le chargement
            <LoadingIndicator />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chiffre d'affaires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% du total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {servicesData.length > 0 ? (
                  servicesData.map((service, index) => (
                    <tr key={`service-row-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.orders?.toLocaleString() || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.revenue?.toLocaleString() || '-'} FCFA</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{service.value}%</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      Aucune donnée de service disponible pour cette période
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Évolution de la clientèle - Version améliorée */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Statistiques clients */}
        <div className="bg-white p-4 rounded-lg shadow col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Statistiques Clientèle</h2>
            <FaUsers className="text-gray-400" />
          </div>
          
          {loadingCustomers ? (
            <LoadingIndicator />
          ) : (
            <div className="space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total des clients</h3>
                <p className="text-2xl font-bold">{clientsStats.totalClients.toLocaleString()}</p>
              </div>
              
              <div className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500">Clients actifs</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${clientsStats.clientsEvolution >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {clientsStats.clientsEvolution >= 0 ? `+${clientsStats.clientsEvolution}%` : `${clientsStats.clientsEvolution}%`}
                  </span>
                </div>
                <p className="text-xl font-bold mt-1">{clientsStats.activeClients.toLocaleString()}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${clientsStats.totalClients > 0 ? (clientsStats.activeClients / clientsStats.totalClients) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Nouveaux clients (30j)</h3>
                <p className="text-xl font-bold">{clientsStats.newClients.toLocaleString()}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${clientsStats.totalClients > 0 ? (clientsStats.newClients / clientsStats.totalClients) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {clientsStats.totalClients > 0 ? Math.round((clientsStats.newClients / clientsStats.totalClients) * 100) : 0}% du total des clients
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Évolution graphique de la clientèle */}
        <div className="bg-white p-4 rounded-lg shadow col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Évolution de la clientèle</h2>
            <FaChartLine className="text-gray-400" />
          </div>
          
          {loadingCustomers ? (
            <LoadingIndicator />
          ) : (
            <>
              {/* Graphique d'évolution des clients */}
              <div className="h-64 flex items-end justify-between space-x-2 border-b border-l">
                {customerData.length > 0 ? (
                  customerData.map((item, index) => {
                    // Calculer les maximums pour l'échelle
                    const maxNew = Math.max(...customerData.map(d => d.nouveaux)) || 30;
                    const maxActive = Math.max(...customerData.map(d => d.actifs)) || 100;
                    
                    return (
                      <div key={`client-stat-${index}`} className="flex flex-col items-center flex-1">
                        <div className="w-full flex flex-col items-center">
                          <div 
                            className="w-full bg-amber-500 rounded-t" 
                            style={{ height: `${(item.nouveaux / maxNew) * 100}px` }}
                          ></div>
                          <div 
                            className="w-full bg-green-500" 
                            style={{ height: `${(item.actifs / maxActive) * 100}px` }}
                          ></div>
                        </div>
                        <p className="text-xs mt-1">{item.month}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full text-center text-gray-500 py-10">
                    Aucune donnée client disponible pour cette période
                  </div>
                )}
              </div>
              <div className="flex mt-4 justify-center space-x-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 mr-2"></div>
                  <span className="text-sm">Clients actifs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-amber-500 mr-2"></div>
                  <span className="text-sm">Nouveaux clients</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Répartition des services */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Répartition des services</h2>
          <ChartAreaIcon className="text-gray-400" />
        </div>
        
        {loadingDistribution ? (
          <LoadingIndicator />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graphique de répartition */}
            <div className="col-span-1">
              <div className="flex items-center justify-center relative h-64">
                {serviceDistribution.length > 0 ? (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden">
                    {/* Segments du camembert */}
                    {serviceDistribution.map((service, index) => {
                      const colors = [
                        'bg-blue-500', 'bg-green-500', 'bg-amber-500', 
                        'bg-purple-500', 'bg-red-500', 'bg-indigo-500',
                        'bg-pink-500', 'bg-teal-500', 'bg-orange-500'
                      ];
                      const offset = serviceDistribution
                        .slice(0, index)
                        .reduce((acc, s) => acc + s.value, 0);
                      
                      return (
                        <div 
                          key={`service-${index}`}
                          className={`absolute top-0 left-0 w-full h-full ${colors[index % colors.length]}`}
                          style={{
                            clipPath: `conic-gradient(from 0deg, transparent 0% ${offset}%, currentColor ${offset}% ${offset + service.value}%, transparent ${offset + service.value}% 100%)`,
                            color: 'currentColor'
                          }}
                        />
                      );
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center">
                        <span className="text-lg font-bold">{serviceDistribution.length} types</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Aucune donnée disponible</p>
                )}
              </div>
            </div>
            
            {/* Tableau de répartition */}
            <div className="col-span-2">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type de service</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commandes</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chiffre d'affaires</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serviceDistribution.length > 0 ? (
                      serviceDistribution.map((service, index) => {
                        const colors = [
                          'bg-blue-500', 'bg-green-500', 'bg-amber-500', 
                          'bg-purple-500', 'bg-red-500', 'bg-indigo-500'
                        ];
                        
                        return (
                          <tr key={`dist-${index}`}>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}></div>
                                <div className="text-sm font-medium text-gray-900">{service.name}</div>
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {service.orders.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {service.revenue.toLocaleString()} FCFA
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-900 mr-2">{service.value}%</span>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${colors[index % colors.length]}`}
                                    style={{ width: `${service.value}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-3 py-2 text-center text-gray-500">
                          Aucune donnée de service disponible
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}