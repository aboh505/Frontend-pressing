'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState(null);
  
  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };
 

  const commonQuestions = [
     {
      question: "Proposez-vous un service de ramassage et livraison ?",
      answer: "Oui, nous offrons un service de collecte et livraison à domicile pour tous nos clients dans la région de Douala."
    },
    {
      question: "Quel est le délai standard pour le nettoyage de mes vêtements ?",
      answer: "Notre délai standard est de 72 heures pour la plupart des vêtements. Pour les articles délicats ou nécessitant un traitement spécial, le délai peut être de 4jours."
    },
    {
      question: "Comment fonctionne votre service de livraison ?",
      answer: "Notre service de livraison est disponible dans un rayon de 10 km autour de notre pressing. La livraison est gratuite pour toute commande supérieure à 5000 FCFA, et coûte 1000 FCFA pour les commandes inférieures."
    },
    {
      question: "Quelles méthodes de paiement acceptez-vous ?",
      answer: "Nous acceptons les paiements en espèces, par carte bancaire, et via les services de paiement mobile comme Orange Money, MTN Mobile Money "
    },
    {
      question: "Comment fonctionne le service de pressing ?",
      answer: "Déposez vos vêtements dans l'un de nos points de collecte, ou utilisez notre service de collecte à domicile. Nous les nettoyons selon vos instructions et vous les retournons dans le délai indiqué."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      {/* Section Titre */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="container mt-15 mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Questions <span className="text-amber-300">fréquentes</span></h1>
          <p className="text-lg max-w-2xl">
            Retrouvez ici les réponses à toutes vos interrogations concernant nos services de pressing.
          </p>
        </div>
      </section>

      {/* Section Catégories FAQ */}
    

      {/* Section Avantages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nos Avantages</h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-800 mb-8 text-lg leading-relaxed">
              Chez Oceane Pressing, nous nous engageons à vous offrir un service de pressing de qualité supérieure. 
              Notre expertise et notre souci du détail garantissent des résultats impeccables pour tous vos vêtements et textiles.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-amber-400 flex-shrink-0 flex items-center justify-center text-green-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-800">Nettoyage écologique respectueux de l'environnement et de vos tissus</p>
              </div>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-amber-400 flex-shrink-0 flex items-center justify-center text-green-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-800">Service rapide avec des délais respectés et une qualité garantie</p>
              </div>
              
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-amber-400 flex-shrink-0 flex items-center justify-center text-green-800 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-800">Personnel professionnel formé aux techniques les plus récentes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Questions fréquentes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Questions fréquemment posées</h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {commonQuestions.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full bg-white hover:bg-gray-50 transition-colors duration-200 text-left"
                >
                  <div className="bg-green-600 text-white py-4 px-5 flex justify-between items-center cursor-pointer">
                    <h3 className="font-medium text-lg">{item.question}</h3>
                    <div className="text-white transition-transform duration-300" style={{ transform: openQuestion === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                <div 
                  className="transition-all duration-300 overflow-hidden"
                  style={{
                    maxHeight: openQuestion === index ? '500px' : '0px',
                    opacity: openQuestion === index ? 1 : 0,
                    padding: openQuestion === index ? '16px' : '0px 16px'
                  }}
                >
                  <p className="text-gray-800">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Section CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-amber-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Vous avez d'autres questions ?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions et vous aider à trouver la solution adaptée à vos besoins.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/contact" className="bg-white text-green-700 hover:bg-green-100 px-6 py-3 rounded-lg font-medium transition-all duration-300">
              Nous contacter
            </Link>
  
          </div>
        </div>
      </section>

      
    </div>
  );
}