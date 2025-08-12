import React from 'react';

export default function StatsAdmin({ stats }) {
  // Si stats n'est pas fourni, utiliser des données par défaut
  const defaultStats = {
    commandes: {
      total: 148,
      tendance: '+12%',
      tendancePositive: true,
      periode: 'cette semaine'
    },
    clients: {
      total: 892,
      tendance: '+3.5%',
      tendancePositive: true,
      periode: 'ce mois'
    },
    revenu: {
      total: '5,120.43 €',
      tendance: '+8.2%',
      tendancePositive: true,
      periode: 'ce mois'
    },
    tauxSatisfaction: {
      total: '98%',
      tendance: '+2%',
      tendancePositive: true,
      periode: 'cette année'
    }
  };

  const statsData = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Carte statistique - Commandes */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total des commandes
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {statsData.commandes.total}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span
              className={`font-medium ${
                statsData.commandes.tendancePositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {statsData.commandes.tendance}
            </span>{' '}
            <span className="text-gray-500">{statsData.commandes.periode}</span>
          </div>
        </div>
      </div>

      {/* Carte statistique - Clients */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-600 rounded-md p-3">
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Clients actifs
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {statsData.clients.total}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span
              className={`font-medium ${
                statsData.clients.tendancePositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {statsData.clients.tendance}
            </span>{' '}
            <span className="text-gray-500">{statsData.clients.periode}</span>
          </div>
        </div>
      </div>

      {/* Carte statistique - Revenu */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Chiffre d'affaires
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {statsData.revenu.total}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span
              className={`font-medium ${
                statsData.revenu.tendancePositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {statsData.revenu.tendance}
            </span>{' '}
            <span className="text-gray-500">{statsData.revenu.periode}</span>
          </div>
        </div>
      </div>

      {/* Carte statistique - Satisfaction */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Taux de satisfaction
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {statsData.tauxSatisfaction.total}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span
              className={`font-medium ${
                statsData.tauxSatisfaction.tendancePositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {statsData.tauxSatisfaction.tendance}
            </span>{' '}
            <span className="text-gray-500">{statsData.tauxSatisfaction.periode}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
