'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaFilter } from 'react-icons/fa';
import config from '../config/api';

export default function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    pages: 0
  });

  const API_URL = config.apiBaseUrl;

  useEffect(() => {
    fetchServiceTypes();
  }, [pagination.page, activeCategory]);

  // Fetch service types from API
  const fetchServiceTypes = async () => {
    setLoading(true);
    try {
      // Prepare query parameters
      let params = {
        page: pagination.page,
        limit: pagination.limit
      };

      // Add category filter if not showing all
      if (activeCategory !== 'tous') {
        params.categorie = activeCategory;
      }

      const response = await axios.get(`${API_URL}/admin/service-types`, { params });
      
      if (response.data.success) {
        setServices(response.data.data);
        setPagination(response.data.pagination || pagination);

        // Extract unique categories from services
        const allCategories = response.data.data
          .map(service => service.categorie)
          .filter((value, index, self) => self.indexOf(value) === index);
        
        setCategories(['tous', ...allCategories]);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Erreur lors de la récupération des services');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des services:', err);
      setError('Impossible de récupérer les types de services. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPagination({...pagination, page: 1}); // Reset to first page on category change
  };

  const filteredServices = services.filter(service => 
    service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="container mx-auto px-6 mt-15">
          <h1 className="text-4xl font-bold mb-4">Nos <span className="text-amber-300">Services</span></h1>
          <p className="text-lg max-w-2xl">
            Découvrez notre gamme de services de pressing et de nettoyage professionnels pour tous vos besoins.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Services Disponibles</h2>
          <p className="text-sm text-gray-600 mt-1">Tous nos services de nettoyage et d'entretien.</p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Search Box */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un service..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="mb-10">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeCategory === category 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'tous' ? 'Tous' : category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin h-8 w-8 text-green-600" />
            <span className="ml-2 text-gray-700">Chargement des services...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              <span className="font-medium">Erreur</span>
            </div>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && (
          <>
            {filteredServices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun service trouvé.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-green-600 text-white py-3 px-4">
                      <h3 className="font-bold text-lg uppercase">{service.nom}</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 mb-4">{service.description || 'Pas de description disponible.'}</p>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">Tarif de base:</h4>
                        <div className="text-xl font-bold text-green-600">{service.tarifBase} FCFA</div>
                      </div>

                      {service.tarifSpeciaux && service.tarifSpeciaux.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Tarifs spéciaux:</h4>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="py-2 text-left">Type</th>
                                <th className="py-2 text-right">Prix</th>
                              </tr>
                            </thead>
                            <tbody>
                              {service.tarifSpeciaux.map((tarif, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                  <td className="py-2">{tarif.nom}</td>
                                  <td className="py-2 text-right font-medium">{tarif.prix} FCFA</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination({...pagination, page: Math.max(1, pagination.page - 1)})}
                    disabled={pagination.page <= 1}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                      pagination.page <= 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Précédent
                  </button>
                  <span className="text-gray-700">
                    Page {pagination.page} sur {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination({...pagination, page: Math.min(pagination.pages, pagination.page + 1)})}
                    disabled={pagination.page >= pagination.pages}
                    className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                      pagination.page >= pagination.pages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-amber-500 text-white mt-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Des services professionnels pour tous vos besoins</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Chez Océane & Pressing, nous mettons notre expertise à votre service pour entretenir vos vêtements et textiles. 
            Notre équipe de professionnels utilise les meilleures techniques et produits pour des résultats impeccables.
          </p>
        </div>
      </section>
    </div>
  );
}
