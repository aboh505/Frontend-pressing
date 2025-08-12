'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/Navbar';

export default function HomePage() {
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    { 
      id: 1, 
      title: 'Pressing Standard', 
      description: 'Nettoyage professionnel pour vos vêtements quotidiens avec un soin particulier pour chaque tissu.', 
      icon: '/icons/standard.svg' 
    },
    { 
      id: 2, 
      title: 'Pressing Express', 
      description: 'Service rapide en 24h pour vos besoins urgents, sans compromis sur la qualité.', 
      icon: '/icons/express.svg' 
    },
    { 
      id: 3, 
      title: 'Traitement Spécial', 
      description: 'Solutions spécifiques pour les taches difficiles et textiles délicats nécessitant une attention particulière.', 
      icon: '/icons/special.svg' 
    }
  ];

  return (
    <main className="min-h-screen">
      <Navbar/>
      {/* Section Hero */}
      <section className="relative bg-gradient-to-r from-green-700/90 to-green-400/90 text-white py-16">
        {/* Cercle transparent en arrière-plan */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-1/3 right-20 w-96 h-96 rounded-full bg-amber-100/10 backdrop-blur-sm"></div>
          {/* <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-green-200/10 backdrop-blur-sm"></div> */}
        </div>
        
        <div className=" mt-25 container mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="inline-block bg-amber-400 text-green-900 font-bold px-4 py-2 rounded-full mb-4 shadow-lg transform hover:scale-105 transition-transform">
              Bienvenue chez nous!
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-2 drop-shadow-md">
              {/* <span className="block text-amber-300 text-3xl md:text-4xl font-bold italic">Océane Pressing</span> */}
              <span className="block text-2xl mt-2">Lavage-Séchage-Repassage!!</span>
            </h1>
            <p className="text-lg mb-8 text-white/100">
              Votre nouveau pressing de confiance. Redonnez l'éclat à vos vêtements sans stress ni attente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/prestation" className="bg-amber-400 text-green-900 px-6 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-amber-500 transition-all duration-300 shadow-lg transform hover:scale-105">
                Voir nos services
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
              <Link href="/reservation" className="border-2 border-white text-white px-6 py-3 rounded-full font-medium flex items-center justify-center hover:bg-white/20 backdrop-blur-sm transition-all duration-300 shadow-lg transform hover:scale-105">
              Reservation
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="bg-amber-400/80 backdrop-blur-sm rounded-full h-64 w-64 md:h-80 md:w-80 absolute -z-10 top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 shadow-xl"></div>
            <div className="relative z-10">
              {/* Image principale */}
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl">
                <Image 
                  src="/logo.svg" 
                  alt="Pressing Professionnel" 
                  width={320} 
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <Link href="/faq" className="absolute -bottom-4 right-16 bg-white text-green-800 font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
              Service Premium
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-2">Nos Services</h2>
            <p className="text-amber-500 text-xl font-semibold">Nous Proposons</p>
            <div className="flex justify-center mt-4">
              <Link href="/prestation" className="flex items-center text-green-700 hover:text-green-600">
                <span>Voir tous les services</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">·
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-green-700 flex items-center justify-center text-white">
                      {/* Image des services */}
                      <Image 
                        src={'/l1.png'} 
                        alt={service.title}
                        width={50}
                        height={24}
                        className="h-6 w-6"
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2 text-center">{service.title}</h3>
                <p className="text-gray-600 text-center mb-4">{service.description}</p>
                <div className="text-center">
                  <Link href={'/faq'} className="text-amber-500 hover:text-amber-600 font-medium inline-flex items-center">
                    En savoir plus
                    <svg className={`w-4 h-4 ml-1 transition-transform duration-300 ${hoveredService === service.id ? 'transform translate-x-1' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Tarifs Populaires */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          {/* <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Nos Tarifs Populaires</h2>
            <p className="text-amber-500 text-xl font-semibold">Des prix transparents et compétitifs</p>
            <div className="w-24 h-1 bg-amber-400 mx-auto mt-4"></div>
          </div>
           */}
            <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">NOS PRIX TRÈS ABORDABLES</h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto"></div>
            <p className="text-lg text-gray-600 mt-4">Des tarifs compétitifs pour un service de qualité</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {/* Chemise */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-4 flex flex-col items-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center">
                  <Image 
                    src="/t0.jpg" 
                    alt="Chemise" 
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-center font-medium text-gray-800">Chemise</h3>
                <p className="text-green-600 font-bold mt-2">900 FCFA</p>
              </div>
            </div>
            
            {/* Pantalon */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-4 flex flex-col items-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center">
                  <Image 
                    src="/t2.jpg" 
                    alt="Pantalon" 
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-center font-medium text-gray-800">Pantalon</h3>
                <p className="text-green-600 font-bold mt-2">1000 FCFA</p>
              </div>
            </div>
            
            {/* Robe */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-4 flex flex-col items-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center">
                  <Image 
                    src="/t7.jpg" 
                    alt="Robe" 
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-center font-medium text-gray-800">Robe</h3>
                <p className="text-green-600 font-bold mt-2">1800 FCFA</p>
              </div>
            </div>
            
            {/* Costume */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-4 flex flex-col items-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center">
                  <Image 
                    src="/t4.jpg" 
                    alt="Costume" 
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-center font-medium text-gray-800">Costume</h3>
                <p className="text-green-600 font-bold mt-2">2500 FCFA</p>
              </div>
            </div>
            
            {/* Lavage au Kg */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-4 flex flex-col items-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center">
                  <Image 
                    src="/t5.jpg" 
                    alt="Lavage au Kg" 
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-center font-medium text-gray-800">Lavage au Kg</h3>
                <p className="text-green-600 font-bold mt-2">1000 FCFA</p>
              </div>
            </div>
            
            {/* Couverture */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="p-4 flex flex-col items-center">
                <div className="w-24 h-24 mb-3 flex items-center justify-center">
                  <Image 
                    src="/t6.jpg" 
                    alt="Couverture" 
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-center font-medium text-gray-800">Couverture</h3>
                <p className="text-green-600 font-bold mt-2">4000 FCFA</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/tarifs" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">
              Voir tous les tarifs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
       <section className="py-16 bg-gradient-to-r from-amber-50 to-green-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-4">Votre linge tout beau, tout propre !</h2>
          <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto">Nos services combinent expertise professionnelle, technologies modernes et conscience environnementale pour prendre soin de vos vêtements.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-green-700 mb-3">Personnel qualifié</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Notre équipe d'experts traite chaque vêtement avec une attention particulière adaptée à sa matière et ses besoins spécifiques.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg flex items-center justify-center mx-auto mb-6 transform rotate-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-green-700 mb-3">Matériel moderne</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Nos machines de dernière génération garantissent un nettoyage en profondeur tout en préservant vos textiles les plus délicats.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-amber-300 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-green-700 mb-3">Démarche éco-responsable</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Produits écologiques, économie d'énergie et recyclage : nous nous engageons pour une prestation de service respectueuse de l'environnement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section NOS PRIX TRÈS ABORDABLES */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">NOS PRIX TRÈS ABORDABLES</h2>
            <div className="w-24 h-1 bg-amber-400 mx-auto"></div>
            <p className="text-lg text-gray-600 mt-4">Des tarifs compétitifs pour un service de qualité</p>
          </div>
          
          <div className="flex justify-center">
            <Link href="/tarifs" className="bg-green-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
              Voir nos tarifs
            </Link>
          </div>
        </div>
      </section> */}
      
      {/* About Me Section */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="relative">
                <div className="bg-amber-400 rounded-full h-64 w-64 md:h-80 md:w-80 absolute -z-10 bottom-0 left-0 transform translate-x-6 translate-y-6"></div>
                <div className="relative z-10 bg-green-800 h-64 w-64 md:h-80 md:w-80 rounded-lg overflow-hidden">
                  <Image 
                    src="/l4.png" 
                    alt="Notre équipe" 
                    width={320}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6"> L’aqua-nettoyage</h2>
              {/* <h3 className="text-2xl font-light mb-4">Qui est <span className="text-amber-400 font-bold">Wash & Go</span> ?</h3>
              <p className="mb-6">
                Depuis plus de 5 ans, notre équipe de professionnels passionnés s'engage à offrir un service de pressing de qualité supérieure. 
                Nous utilisons des techniques modernes et des produits respectueux de l'environnement pour prendre soin de vos vêtements précieux.
              </p> */}
              <p className="mb-8 text-1xl ">
              Chez Océane & Pressing, nous avons à coeur de toujours innover afin d’apporter les meilleurs soins à vos vêtements. Dans notre logique d’éco pressing, nous utilisons le procédé aqua-nettoyage en remplacement du nettoyage à sec (solvants nocifs). Ce nouveau procédé à base d’eau et de produits lessives écologiques offre une propreté impeccable, ravive les couleurs et donne à votre linge un parfum frais et naturel qui dure longtemps. L’aqua assure un nettoyage en profondeur de tous les types de textiles, y compris les plus fragiles, tout en préservant l’environnement, votre santé et celle de notre équipe.
              </p>
              <Link href="/about" className="bg-white text-green-800 px-6 py-3 rounded-full font-bold inline-flex items-center hover:bg-amber-400 transition-colors duration-300">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}