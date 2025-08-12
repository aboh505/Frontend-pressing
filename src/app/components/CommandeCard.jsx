import React from 'react';
import Link from 'next/link';

export default function CommandeCard({ commande, viewType = 'compact' }) {
  // commande doit contenir: id, statut, date, montant, client (optionnel), articles (optionnel)
  
  const getStatutClass = (statut) => {
    switch (statut) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En cours':
        return 'bg-amber-100 text-amber-800';
      case 'Terminée':
        return 'bg-green-100 text-green-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Vue compacte pour les listes
  if (viewType === 'compact') {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-600 truncate">
                Commande #{commande.id}
              </p>
              <p className="mt-1 flex items-center text-sm text-gray-500">
                {commande.client && (
                  <span className="truncate">{commande.client}</span>
                )}
              </p>
            </div>
            <div className="ml-2 flex-shrink-0 flex">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutClass(commande.statut)}`}>
                {commande.statut}
              </span>
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              {commande.articles && (
                <p className="flex items-center text-sm text-gray-500">
                  {commande.articles} article{commande.articles > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <span>{commande.montant} • {commande.date}</span>
            </div>
          </div>
          <div className="mt-3">
            <Link 
              href={`/commandes/${commande.id}`}
              className="text-sm text-amber-600 hover:text-amber-800 font-medium"
            >
              Voir les détails →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vue détaillée pour le tableau de bord
  if (viewType === 'detailed') {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Commande #{commande.id}
            </h3>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutClass(commande.statut)}`}>
              {commande.statut}
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Créée le {commande.date}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {commande.client && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Client</dt>
                <dd className="mt-1 text-sm text-gray-900">{commande.client}</dd>
              </div>
            )}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Montant</dt>
              <dd className="mt-1 text-sm text-gray-900">{commande.montant}</dd>
            </div>
            {commande.articles && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Articles</dt>
                <dd className="mt-1 text-sm text-gray-900">{commande.articles} article{commande.articles > 1 ? 's' : ''}</dd>
              </div>
            )}
            {commande.dateLivraison && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Livraison prévue</dt>
                <dd className="mt-1 text-sm text-gray-900">{commande.dateLivraison}</dd>
              </div>
            )}
          </dl>
          <div className="mt-6 flex justify-end">
            <Link 
              href={`/commandes/${commande.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600"
            >
              Voir les détails
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vue simple pour les listes compactes
  return (
    <Link 
      href={`/commandes/${commande.id}`}
      className="block hover:bg-gray-50"
    >
      <div className="px-4 py-4 flex items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-amber-600 truncate">
            Commande #{commande.id}
          </p>
          <p className="text-sm text-gray-500">
            {commande.date} • {commande.montant}
          </p>
        </div>
        <div>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutClass(commande.statut)}`}>
            {commande.statut}
          </span>
        </div>
      </div>
    </Link>
  );
}
