'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import { FaStar, FaStarHalf, FaGlobe, FaDirections, FaCommentAlt, FaBookmark, FaShare, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlinePhone } from 'react-icons/hi';

export default function ContactPage() {
  return (
    <main className="pt-28 pb-16 bg-gray-100">
      <Navbar/>
      
      {/* Business Header Section - Similar to Google Maps Business Card */}
      <div className="container max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side with logo */}
            <div className="md:w-1/3 bg-blue-50 flex items-center justify-center py-10 px-8" style={{ minHeight: '350px' }}>
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="/logo.jpg" 
                  alt="Océane Pressing" 
                  className="w-auto h-auto max-w-full max-h-full object-contain shadow-md rounded-lg"
                  style={{ maxHeight: '300px' }}
                  onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Océane+Pressing'}
                />
              </div>
            </div>
            
            {/* Right side with info */}
            <div className="md:w-2/3 p-6">
              <h1 className="text-3xl font-bold text-gray-800">Océane Pressing Douala</h1>
              
              {/* Rating section */}
              <div className="flex items-center mt-2">
                <div className="flex text-amber-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalf />
                </div>
                <span className="ml-2 text-gray-600">4.5 • 86 avis Google</span>
              </div>
              
              <p className="text-gray-600 mt-1">Pressing à Douala, Cameroun</p>
              
              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#" className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                  <FaGlobe className="mr-2" /> Site Web
                </a>
                <a href="#" className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                  <FaDirections className="mr-2" /> Itinéraire
                </a>
                <a href="#" className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                  <FaCommentAlt className="mr-2" /> Avis
                </a>
                <a href="#" className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                  <FaBookmark className="mr-2" /> Enregistrer
                </a>
                <a href="#" className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50">
                  <FaShare className="mr-2" /> Partager
                </a>
              </div>
              
              {/* Contact information */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <HiOutlineLocationMarker className="text-gray-500 text-xl flex-shrink-0 mt-1" />
                  <div className="ml-3">
                    <p className="text-black-600 font-medium">Galerie Océane</p>
                    <p className="text-gray-700">La rue en face ecole publique de Deido, Douala</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <HiOutlineClock className="text-gray-500 text-xl flex-shrink-0 mt-1" />
                  <div className="ml-3">
                    <p className="text-gray-700 font-medium">Ouvert · Ferme à 19:00</p>
                    <div className="text-gray-600">
                      <p>Lundi - Vendredi: 8h00 - 19h00</p>
                      <p>Samedi: 9h00 - 17h00</p>
                      <p>Dimanche: Fermé</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <HiOutlinePhone className="text-gray-500 text-xl flex-shrink-0 mt-1" />
                  <div className="ml-3">
                    <a href="tel:+237681220657" className="text-blue-600 hover:underline">+237 681 220 657</a>
                    <p className="text-blue-600">/ +237 695 841 285</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-amber-400 tracking-wider uppercase mb-3">
                    Suivez-nous
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://wa.me/237681220657"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 transition-colors"
                      aria-label="WhatsApp"
                    >
                      <FaWhatsapp className="h-8 w-8" />
                    </a>
                  </div>
                </div>
                
             
              </div>
            </div>
          </div>
        </div>
        
        {/* Google Maps Embed */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-black-600 mb-4">📍 Nous localiser à Douala</h2>
          <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-lg border border-blue-100">
            <iframe
              title="Carte de Deido, Douala, Cameroun"
              src="https://www.google.com/maps?q=Ecole+Publique+de+Deido+Douala+Cameroun&output=embed"
              className="w-full h-full"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  );
}
