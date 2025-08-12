'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function AboutPage() {
  return (
    <main className="pt-18 pb-16">
      <Navbar/>
      <section className="bg-gradient-to-r from-green-400 to-amber-200 py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4 text-green-800">
            Qui sommes-nous <span className="text-amber-500">?</span>
          </h1>
          <p className="text-lg max-w-2xl text-green-800">
            Océane & Pressing vous débarrasse de la corvée de lessive. Grâce à notre personnel qualifié et notre matériel moderne, nous vous offrons un service pressing de qualité.
          </p>
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-green-700 mb-6">Notre service pressing de qualité</h2>
              
              <p className="text-gray-700 mb-5 leading-relaxed">
                Ne craignez plus de tacher votre chemise ou votre robe préférée, nos programmes de lavage sont optimisés pour le nettoyage de toutes les matières et fibres.              
              </p>
              
              <p className="text-gray-700 mb-5 leading-relaxed">
                Océane & Pressing œuvre pour une activité plus responsable en utilisant des produits écologiques, des emballages recyclables, et des machines économes en eau et électricité.
              </p>
              
              <div className="mt-8 bg-amber-50 p-5 rounded-lg border-l-4 border-green-600">
                <h3 className="font-bold text-green-700 text-lg mb-2">Notre engagement écologique</h3>
                <p className="text-gray-700">Nous rachetons vos cintres afin de limiter les déchets et vous permettre dans le même temps de réaliser des économies.</p>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/l3.png"
                  alt="Nos machines de pressing modernes"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="p-5 bg-green-50">
                  <h3 className="font-bold text-green-700 mb-2">Équipement moderne & écologique</h3>
                  <p className="text-gray-600">Notre matériel de dernière génération assure un nettoyage optimal tout en réduisant notre consommation d'énergie de 40%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Pourquoi nous choisir - Version moderne */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">POURQUOI NOUS CHOISIR</h2>
            <div className="w-32 h-1 bg-green-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Des services sur mesure et de qualité pour satisfaire tous vos besoins</p>
          </div>
          
          {/* Grid des avantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
            
            {/* Personnalisez votre commande */}
            <div className="flex items-start">
              <div className="mr-4">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Personnalisez votre commande</h3>
                <p className="text-gray-600 leading-relaxed">
                  En accédant à notre formulaire d'inscription, vous définissez les délais de livraison et estimez vous-même votre service.
                </p>
              </div>
            </div>
            
            {/* Nos prix sont imbattables */}
            <div className="flex items-start">
              <div className="mr-4">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Nos prix sont imbattables</h3>
                <p className="text-gray-600 leading-relaxed">
                  Selon votre besoin et votre bourse, vous avez accès à 3 types de tarifications adaptées à tous les budgets.
                </p>
              </div>
            </div>
            
            {/* Commodité */}
            <div className="flex items-start">
              <div className="mr-4">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Commodité</h3>
                <p className="text-gray-600 leading-relaxed">
                  En cliquant juste sur un bouton, votre linge est récupéré et lavé pour vous sans déplacement.
                </p>
              </div>
            </div>
            
            {/* Qualité */}
            <div className="flex items-start">
              <div className="mr-4">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Qualité</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nos blanchisseries utilisent les meilleurs produits d'entretien pour vos linges, garantissant un résultat impeccable.
                </p>
              </div>
            </div>
            
            {/* Livraison express */}
            <div className="flex items-start">
              <div className="mr-4">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Livraison express</h3>
                <p className="text-gray-600 leading-relaxed">
                  Avec notre service livraison express, vous aurez votre linge repassé en moins de 8 heures pour vos urgences.
                </p>
              </div>
            </div>
            
            {/* Mise à jour de votre commande */}
            <div className="flex items-start">
              <div className="mr-4">
                <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Mise à jour de votre commande</h3>
                <p className="text-gray-600 leading-relaxed">
                  Mises à jour régulières de votre compte et interaction avec notre plateforme pour garder un œil sur votre linge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    
      
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0 text-left">
                {/* <h2 className="text-3xl font-bold mb-4">Appelez-nous : <span className="text-amber-300">678 269 637/694 264 005 </span></h2> */}
                <p className="text-lg mb-4 md:pr-10">
                  Découvrez notre service pressing de qualité et confiez-nous vos vêtements dès aujourd'hui. Notre équipe est impatiente de vous servir !                  
                </p>
                <div className="flex items-center space-x-2 text-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Lundi - Samedi : 8h00 - 19h00</span>
                </div>
              </div>
              <div>
                <Link 
                  href="/prestation" 
                  className="inline-block bg-amber-400 text-green-900 px-8 py-4 rounded-lg font-medium text-lg hover:bg-amber-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                Voir Plus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
