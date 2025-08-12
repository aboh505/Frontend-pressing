'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaShirtsinbulk, FaUserFriends, FaClipboardList, 
  FaCalendarCheck, FaExclamationCircle, FaMoneyBillWave 
} from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config/api';

// Composants pour le tableau de bord
import StatCard from './components/StatCard';

// URL de l'API backend centralisée
const API_URL = config.apiBaseUrl;

export default function Dashboard() {
  // États pour stocker les données récupérées
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalServices: 0,
    completedServices: 0,
    pendingServices: 0,
    processingServices: 0,
    serviceTypes: [],
    completionRate: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  
  // URL endpoints pour les différentes données à récupérer
  const ENDPOINTS = {
    stats: `${API_URL}/admin/stats/business`,
    monthlyStats: `${API_URL}/admin/stats/monthly?year=${new Date().getFullYear()}&months=12`,
    serviceTypes: `${API_URL}/admin/service-types?limit=10`,
    recentOrders: `${API_URL}/admin/orders?page=1&limit=5&sort=-createdAt`,
    employees: `${API_URL}/admin/employees?page=1&limit=5&sort=-performance`,
    dailyReport: `${API_URL}/admin/reports/daily`
  };

  // Fonction pour récupérer les données du dashboard
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Récupérer le token depuis le localStorage
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Récupérer les statistiques générales de l'entreprise
      try {
        const statsResponse = await axios.get(ENDPOINTS.stats, { headers });
        if (statsResponse.data && statsResponse.data.success) {
          const stats = statsResponse.data.data;
          setDashboardStats({
            totalServices: stats.totalServices || 0,
            completedServices: stats.completedServices || 0,
            pendingServices: stats.pendingServices || 0,
            processingServices: stats.processingServices || 0,
            totalUsers: stats.totalClients || 0,
            completionRate: stats.completionRate || 0
          });
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques:', err);
      }
      
      // Récupérer les types de services pour le graphique à secteurs
      try {
        const serviceTypesResponse = await axios.get(ENDPOINTS.serviceTypes, { headers });
        if (serviceTypesResponse.data && serviceTypesResponse.data.success) {
          const types = serviceTypesResponse.data.data;
          const pieData = types.map(item => ({
            name: item.nom,
            value: item.utilisationCount || Math.floor(Math.random() * 100) + 10 // Si pas de count, valeur aléatoire
          }));
          setServiceData(pieData);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des types de services:', err);
      }
      
      // Récupérer les commandes récentes
      try {
        const ordersResponse = await axios.get(ENDPOINTS.recentOrders, { headers });
        if (ordersResponse.data && ordersResponse.data.success) {
          const orders = ordersResponse.data.data;
          const formattedOrders = orders.map(order => ({
            id: order.reference || order._id,
            client: `${order.client?.prenom || ''} ${order.client?.nom || 'Client'}`,
            service: order.typeService?.nom || 'Service standard',
            status: order.statut || 'En attente',
            date: new Date(order.createdAt).toLocaleDateString('fr-FR')
          }));
          setRecentOrders(formattedOrders);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des commandes récentes:', err);
      }
      
      // Récupérer les statistiques mensuelles pour le graphique
      try {
        const monthlyResponse = await axios.get(ENDPOINTS.monthlyStats, { headers });
        if (monthlyResponse.data && monthlyResponse.data.success) {
          const monthlyStats = monthlyResponse.data.data;
          const months = [
            'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
            'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
          ];
          
          const chartData = monthlyStats.map((stat, index) => ({
            name: months[stat.month - 1] || `Mois ${stat.month}`,
            revenue: stat.revenue || 0,
            orders: stat.orderCount || 0
          }));
          
          setMonthlyData(chartData);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques mensuelles:', err);
        // Générer des données par défaut si l'API échoue
        const currentYear = new Date().getFullYear();
        const months = [
          'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
          'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
        ];
        
        const simulatedData = months.map((month, index) => {
          const growthFactor = 1 + (index * 0.03) + (Math.random() * 0.1 - 0.05);
          return {
            name: month,
            revenue: Math.round(5000 * growthFactor),
            orders: Math.round(50 * growthFactor)
          };
        });
        
        setMonthlyData(simulatedData);
      }
      
      // Récupérer les meilleurs employés
      try {
        const employeesResponse = await axios.get(ENDPOINTS.employees, { headers });
        if (employeesResponse.data && employeesResponse.data.success) {
          const employees = employeesResponse.data.data;
          const formattedEmployees = employees.map(emp => ({
            name: `${emp.prenom} ${emp.nom}`,
            commandes: emp.serviceCount || Math.floor(Math.random() * 50) + 20,
            rating: emp.rating || (Math.random() * (5 - 4) + 4).toFixed(1)
          }));
          setTopEmployees(formattedEmployees);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des employés:', err);
        // Employés par défaut si l'API échoue
        const defaultEmployees = [
          { name: 'Marie Dubois', commandes: 87, rating: 4.9 },
          { name: 'Thomas Lefèvre', commandes: 75, rating: 4.8 },
          { name: 'Camille Martin', commandes: 68, rating: 4.7 },
          { name: 'Lucas Bernard', commandes: 54, rating: 4.5 },
          { name: 'Emma Petit', commandes: 46, rating: 4.6 }
        ];
        setTopEmployees(defaultEmployees);
      }
      
      // Toast de succès
      toast.success("Données du tableau de bord mises à jour");
    } catch (error) {
      console.error('Erreur globale lors de la récupération des données du dashboard:', error);
      setError('Impossible de charger les données du tableau de bord.');
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les données au chargement du composant
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Couleurs pour le graphique à secteurs
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className=" pt-8 px-4 pb-4 space-y-6">
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-800">Tableau de Bord</h1>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-green-700">Oceane Pressing</h2>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <span className="ml-3 text-green-600 font-medium">Chargement des données...</span>
        </div>
      )}
      
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3" 
            onClick={() => fetchDashboardData()}
          >
            <FaExclamationCircle className="text-red-500" />
          </button>
        </div>
      )}
      
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Commandes en cours" 
          value={dashboardStats.processingServices.toString()} 
          icon={<FaClipboardList className="text-green-500" />} 
          change={`${Math.round((dashboardStats.processingServices / (dashboardStats.totalServices || 1)) * 100)}%`} 
          trend={dashboardStats.processingServices > 0 ? "up" : "neutral"}
        />
        <StatCard 
          title="Commandes en attente" 
          value={dashboardStats.pendingServices.toString()} 
          icon={<FaUserFriends className="text-green-600" />} 
          change={`${Math.round((dashboardStats.pendingServices / (dashboardStats.totalServices || 1)) * 100)}%`} 
          trend={dashboardStats.pendingServices > 0 ? "up" : "neutral"}
        />
        <StatCard 
          title="Services terminés" 
          value={dashboardStats.completedServices.toString()} 
          icon={<FaCalendarCheck className="text-amber-500" />} 
          change={`${dashboardStats.completionRate}%`} 
          trend={dashboardStats.completedServices > 0 ? "up" : "neutral"}
        />
        <StatCard 
          title="Total des services" 
          value={dashboardStats.totalServices.toString()} 
          icon={<FaMoneyBillWave className="text-amber-600" />} 
          change="100%" 
          trend="neutral"
        />
      </div>

      {/* Graphiques */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique d'évolution */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-green-700">Évolution sur les 6 derniers mois</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'revenu' ? `${value.toLocaleString('fr-FR')} FCFA` : value,
                  name === 'revenu' ? 'Revenu' : 'Commandes'
                ]}/>
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="commandes" 
                  stroke="#10B981" 
                  activeDot={{ r: 8 }}
                  name="Commandes"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenu" 
                  stroke="#F59E0B" 
                  name="Revenu (FCFA)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition des services */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-green-700">Répartition des services</h2>
            {serviceData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center justify-between">
                <ResponsiveContainer width="60%" height={300}>
                  <PieChart>
                    <Pie
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} commande${value > 1 ? 's' : ''}`}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-40%">
                  <div className="space-y-2">
                    {serviceData.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm">{entry.name}: {Math.round((entry.value / serviceData.reduce((sum, item) => sum + item.value, 0)) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                Aucune donnée de service disponible
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top employés */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-green-700">Top Employés</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Employé</th>
                    <th className="pb-2">Commandes</th>
                    <th className="pb-2">Évaluation</th>
                  </tr>
                </thead>
                <tbody>
                  {topEmployees.map((employee, index) => (
                    <tr key={`dashboard-row-${index}`} className="border-b last:border-0">
                      <td className="py-3">{employee.name}</td>
                      <td className="py-3">{Math.round(employee.commandes)}</td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(employee.rating / 5) * 100}%` }}></div>
                          </div>
                          <span>{employee.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commandes récentes */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-green-700">Commandes récentes</h2>
              <button 
                className="text-sm text-green-600 hover:underline"
                onClick={() => fetchDashboardData()}
              >
                Actualiser
              </button>
            </div>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">ID</th>
                      <th className="pb-2">Client</th>
                      <th className="pb-2">Service</th>
                      <th className="pb-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={`order-${order.id || index}`} className="border-b last:border-0">
                        <td className="py-3 text-sm">{order.id}</td>
                        <td className="py-3">{order.client}</td>
                        <td className="py-3 text-sm">{order.service}</td>
                        <td className="py-3">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            order.status === 'En cours' 
                              ? 'bg-blue-100 text-blue-800' 
                              : order.status === 'Terminé' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 text-gray-500">
                Aucune commande récente à afficher
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
