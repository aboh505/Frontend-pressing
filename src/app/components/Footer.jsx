import React from 'react';
import Link from 'next/link';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-100 shadow-md text-gray-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div>
              <div className="flex items-center">
                <div className="relative h-10 w-10 mr-3">
                  {/* <div className="absolute inset-0 bg-amber-400 rounded-full transform rotate-55"></div>
                  <div className="absolute inset-1 bg-green-700 rounded-full flex items-center justify-center">
                    <span className="text-amber-400 font-bold text-sm">W & G</span>
                  </div> */}
                </div>
                <div>
                  <img src="/logo.svg" alt="" width={100} height={100} />
                  {/* <h2 className="text-green-700 text-2xl font-bold">Wash &<span className="text-amber-400">Go</span></h2> */}
                  <p className="text-sm mt-1">Votre pressing de qualité</p>
                </div>
              </div>
            </div>
          
            
          
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-amber-400 tracking-wider uppercase">
                  Navigation
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/" className="text-base text-gray-800 hover:text-amber-400">
                      Accueil
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-base text-gray-800 hover:text-amber-400">
                      À propos
                    </Link>
                  </li>
                  <li>
                    <Link href="/tarifs" className="text-base text-gray-800 hover:text-amber-400">
                      Nos tarifs
                    </Link>
                  </li>
                      <li>
                    <Link href="/faq" className="text-base text-gray-800 hover:text-amber-400">
                    FAQ
                </Link>
                  </li>
                 
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-amber-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-800 hover:text-black-500 transition duration-300">
                      Service express
                    </a>
                  </li>
                 
                  <li>
                    <a href="#" className="text-base text-gray-800 hover:text-black-500 transition duration-300">
                      Contactez-nous
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-800 hover:text-black-500 transition duration-300">
                      Guide d'utilisation
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-amber-400 tracking-wider uppercase">
                  Légal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-800 hover:text-black-400 transition duration-300">
                      Confidentialité
                    </a>
                  </li>
                     <li>
                    <a href="#" className="text-base text-gray-800 hover:text-black-500 transition duration-300">
                      Resultats impeccables
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-800 hover:text-black-400 transition duration-300">
                      Conditions d'utilisation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-800 hover:text-black-400 transition duration-300">
                      Mentions légales
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-amber-400 tracking-wider uppercase">
                  Contact
                </h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-800">681220657 / 695841285</span>
                  </li>
                
                  <li className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-800">La rue en face ecole publique de Deido, Douala</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-500 mb-4 md:mb-0">
              &copy; 2025 Océane Pressing. Tous droits réservés.
            </p>
            
            {/* Social Media Icons in Footer Bottom */}
        
          </div>
        </div>
      </div>
    </footer>
  );
}
