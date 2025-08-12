'use client';

;
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Navbar from '../components/Navbar';



export default function PrestationPage() {


   const faqCategories = [
    {
      id: "01",
      title: "Services de base",
      description: "Nos services de nettoyage standard pour vos vêtements quotidiens.",
      color: "#10B981"
    },
    {
      id: "02",
      title: "Services premium",
      description: "Traitements spéciaux pour vos vêtements délicats et précieux.",
      color: "#10B981"
    },
    {
      id: "03",
      title: "Linge de maison",
      description: "Solutions pour nettoyer vos draps, rideaux et autres textiles de maison.",
      color: "#10B981"
    },
    {
      id: "04",
      title: "Entreprises",
      description: "Nos offres spéciales pour les entreprises et institutions.",
      color: "#10B981"
    },
    {
      id: "05",
      title: "Tarification",
      description: "Informations sur nos prix et forfaits avantageux.",
      color: "#10B981"
    },
    {
      id: "06",
      title: "Délais & Livraison",
      description: "Tout savoir sur nos délais de traitement et options de livraison.",
      color: "#10B981"
    },
    {
      id: "07",
      title: "Écologie",
      description: "Nos engagements et pratiques pour préserver l'environnement.",
      color: "#10B981"
    },
    {
      id: "08",
      title: "Fidélité",
      description: "Découvrez notre programme de fidélité et ses avantages.",
      color: "#10B981"
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Header avec titre */}
     
        <section className="py-16">
        <div className="mt-15 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-700 mb-12">Nos catégories de services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {faqCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-green-700 flex items-center justify-center text-amber-400 font-bold text-xl mr-4">
                    {category.id}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                </div>
                <p className="text-gray-800">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Nos Prestations - inspirée de l'image */}
      <section className="py-16 bg-gradient-to-r from-green-200 to-amber-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-700 mb-2">Nos Prestations</h2>
            <p className="text-lg text-green-800">Choisissez celle qui vous convient.</p>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 - Pressing */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-4">Pressing</h3>
              <p className="text-gray-800 leading-relaxed">
                Vos vêtements sont nettoyés et repassés, même les plus délicats. Chemises, costumes, robes de mariée... Profitez d'un service soigné, professionnel et efficace.
              </p>
            </div>
            
            {/* Carte 2 - Blanchisserie */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-4">Blanchisserie</h3>
              <p className="text-gray-800 leading-relaxed">
                Nous prenons en charge le nettoyage du linge de maison (couvertures, nappes, serviettes de bain, draps...), pour les particuliers et les entreprises.
              </p>
            </div>
            
            {/* Carte 3 - Mobilier & Tapis */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-4">Mobilier & Tapis</h3>
              <p className="text-gray-800 leading-relaxed">
                Nous nettoyons en profondeur votre tapis, vos housses de canapés, vos housses de chaises... Profitez enfin d'un mobilier sain pour toute la famille !
              </p>
            </div>
          </div>
        </div>
      </section>
      
     
      {/* Section CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0 text-left">
                <h2 className="text-3xl font-bold mb-4">Un service sur mesure pour vous</h2>
                <p className="text-lg mb-4 md:pr-10">
                  Vous avez des besoins spécifiques? Contactez-nous pour obtenir un devis personnalisé.
                </p>
              </div>
              <div>
                <Link 
                  href="/contact" 
                  className="inline-block bg-amber-400 text-green-900 px-8 py-4 rounded-lg font-medium text-lg hover:bg-amber-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
