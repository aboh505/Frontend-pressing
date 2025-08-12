import React from 'react';
import Link from 'next/link';

export default function ServiceCard({ service, onClick, isSelectable = false, isSelected = false }) {
  // service doit contenir: id, nom, prix, description, tempsLivraison, image (optionnel)
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg 
        ${isSelectable ? 'cursor-pointer' : ''}
        ${isSelected ? 'ring-2 ring-amber-100' : ''}
      `}
      onClick={isSelectable ? () => onClick(service) : undefined}
    >
      {service.image && (
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={service.image} 
            alt={service.nom} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{service.nom}</h3>
          <span className="text-amber-600 font-bold">{typeof service.prix === 'number' ? service.prix.toFixed(2) : service.prix}€</span>
        </div>
        
        <p className="text-gray-600 mb-4 h-16 overflow-hidden">{service.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span>Délai: {service.tempsLivraison}h</span>
          </div>
          
          {!isSelectable && (
            <Link 
              href={`/dashboard/services/${service.id}`}
              className="px-4 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-sm font-medium"
            >
              Détails
            </Link>
          )}
          
          {isSelectable && isSelected && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
