'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function TarifsPage() {
  const [activeFilter, setActiveFilter] = useState('tous');
  
  const filterCategories = [
    { id: 'tous', label: 'Tous' },
    { id: 'hauts', label: 'Hauts' },
    { id: 'ensembles', label: 'Ensembles' },
    { id: 'enfants', label: 'Enfants' },
    { id: 'linge', label: 'Linge de maison' },
    { id: 'bas', label: 'Bas' },
    { id: 'divers', label: 'Divers' },
  ];
  
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };
  
  const showCategory = (categoryId) => {
    return activeFilter === 'tous' || activeFilter === categoryId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="container mt-15 mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Nos <span className="text-amber-300">Tarifs</span></h1>
          <p className="text-lg max-w-2xl">
            Des prix transparents et compétitifs pour tous vos besoins de pressing et de nettoyage.
          </p>
        </div>
      </section>
      
      <div className="container mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Océane & Pressing </h2>
          <p className="text-lg text-gray-700">Tél: (+237) 681220657 / 695841285</p>
          <p className="text-sm text-gray-600 mt-1">Nos tarifs minimums en FCFA.</p>
        </div>
        
        {/* Système de filtres */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {filterCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFilterChange(category.id)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === category.id 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* HAUTS */}
          {showCategory('hauts') && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white py-3 px-4">
                <h3 className="font-bold text-lg uppercase">HAUTS</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Blouson</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Chemise Haut 1pc</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Chemise</td>
                      <td className="py-2 text-right font-medium">900</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Chemise Délicate</td>
                      <td className="py-2 text-right font-medium">1 200</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Chemise Jean</td>
                      <td className="py-2 text-right font-medium">1 200</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Chemisier</td>
                      <td className="py-2 text-right font-medium">900</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Gandoura Haut 1pc</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Gilet Costume</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Haut Dentelle</td>
                      <td className="py-2 text-right font-medium">1 200</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Haut Plissé</td>
                      <td className="py-2 text-right font-medium">1 200</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Haut Perlé</td>
                      <td className="py-2 text-right font-medium">1 200</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Haut Simple</td>
                      <td className="py-2 text-right font-medium">900</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Maillot Sport</td>
                      <td className="py-2 text-right font-medium">700</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Polo / T-Shirt</td>
                      <td className="py-2 text-right font-medium">800</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Pull</td>
                      <td className="py-2 text-right font-medium">1 200</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Veste Costume</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                    <tr>
                      <td className="py-2">Veste Jean</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* ENSEMBLES */}
          {showCategory('ensembles') && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white py-3 px-4">
                <h3 className="font-bold text-lg uppercase">ENSEMBLES</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Blouse Blanche</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Blouse 2pc</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Combinaison 1pc</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Costume 2pc</td>
                      <td className="py-2 text-right font-medium">2 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Gandoura 3pc</td>
                      <td className="py-2 text-right font-medium">3 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Kimono 2pc</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Kimono 3pc</td>
                      <td className="py-2 text-right font-medium">3 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Pagne 2pc</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Pagne 3pc</td>
                      <td className="py-2 text-right font-medium">2 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Cocktail</td>
                      <td className="py-2 text-right font-medium">3 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Dentelle</td>
                      <td className="py-2 text-right font-medium">3 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Kaba</td>
                      <td className="py-2 text-right font-medium">1 800</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Mariage</td>
                      <td className="py-2 text-right font-medium">10 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Perlée</td>
                      <td className="py-2 text-right font-medium">4 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Plissée</td>
                      <td className="py-2 text-right font-medium">4 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Simple</td>
                      <td className="py-2 text-right font-medium">1 800</td>
                    </tr>
                    <tr>
                      <td className="py-2">Tailleur 2pc</td>
                      <td className="py-2 text-right font-medium">2 500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* ENFANTS MOINS DE 7 ANS */}
          {showCategory('enfants') && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white py-3 px-4">
                <h3 className="font-bold text-lg uppercase">ENFANTS MOINS DE 7 ANS</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Baskets</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Blouson 2pc</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Chemise</td>
                      <td className="py-2 text-right font-medium">500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Costume 2pc</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Couverture</td>
                      <td className="py-2 text-right font-medium">2 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Gandoura 3pc</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Gilet Costume</td>
                      <td className="py-2 text-right font-medium">500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Jupe Simple</td>
                      <td className="py-2 text-right font-medium">800</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Layette</td>
                      <td className="py-2 text-right font-medium">300</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Nounours</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Pantalon</td>
                      <td className="py-2 text-right font-medium">800</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Dentelle</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Perlée</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Plissée</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Robe Simple</td>
                      <td className="py-2 text-right font-medium">1 200</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">T-Shirt / Polo</td>
                      <td className="py-2 text-right font-medium">500</td>
                    </tr>
                    <tr>
                      <td className="py-2">Veste</td>
                      <td className="py-2 text-right font-medium">800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* LINGE DE MAISON */}
          {showCategory('linge') && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white py-3 px-4">
                <h3 className="font-bold text-lg uppercase">LINGE DE MAISON</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">2Draps + 2Taies</td>
                      <td className="py-2 text-right font-medium">2 400</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Couverture / Couette</td>
                      <td className="py-2 text-right font-medium">4 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Drap</td>
                      <td className="py-2 text-right font-medium">800</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Housse De Chaise</td>
                      <td className="py-2 text-right font-medium">800</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Housse De Couette</td>
                      <td className="py-2 text-right font-medium">1 600</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Housse De Matelas</td>
                      <td className="py-2 text-right font-medium">10 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Nappe De Table</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Rideau (Au M)</td>
                      <td className="py-2 text-right font-medium">1 600</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Serviette A Main</td>
                      <td className="py-2 text-right font-medium">800</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Serviette Grande</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Serviette Moyenne</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Taie D'oreiller</td>
                      <td className="py-2 text-right font-medium">400</td>
                    </tr>
                    <tr>
                      <td className="py-2">Tapis (Au m²)</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nouvelle rangée pour BAS et DIVERS */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* BAS */}
          {showCategory('bas') && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white py-3 px-4">
                <h3 className="font-bold text-lg uppercase">BAS</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Bermuda</td>
                      <td className="py-2 text-right font-medium">300</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Jeans</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Jupe Droite</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Jupe Longue</td>
                      <td className="py-2 text-right font-medium">1 200</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Jupe Plissée</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Pantalon</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Short</td>
                      <td className="py-2 text-right font-medium">900</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* DIVERS */}
          {showCategory('divers') && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-600 text-white py-3 px-4">
                <h3 className="font-bold text-lg uppercase">DIVERS</h3>
              </div>
              <div className="p-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Baskets</td>
                      <td className="py-2 text-right font-medium">2 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Casquette</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Chapeau</td>
                      <td className="py-2 text-right font-medium">1 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Chaussures</td>
                      <td className="py-2 text-right font-medium">2 500</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Écharpe</td>
                      <td className="py-2 text-right font-medium">1 000</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Sac</td>
                      <td className="py-2 text-right font-medium">2 000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-amber-500 text-white mt-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Un service de qualité à des prix compétitifs</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Chez Washtoo Pressing, nous nous engageons à offrir des services de nettoyage de haute qualité à des prix transparents et abordables. Notre expertise garantit des résultats impeccables pour tous vos vêtements et textiles.
          </p>
          
        </div>
      </section>
    </div>
  );
}
