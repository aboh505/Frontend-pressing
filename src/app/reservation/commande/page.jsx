'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tarifsData, getAllVetements } from '../../data/tarifsData';
import serviceClient from '../../services/serviceClient';
import authService from '../../services/authService';
import { FaShoppingCart, FaPlus, FaTrash, FaInfoCircle, FaTruck, FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt } from 'react-icons/fa';

export default function CommandePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [panier, setPanier] = useState([]);
  const [totalCommande, setTotalCommande] = useState(0);
  const [fraisLivraison] = useState(1000); // Frais de livraison fixes à 3000 FCFA
  const [dateCommande, setDateCommande] = useState('');
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // État pour un nouvel article
  const [nouvelArticle, setNouvelArticle] = useState({
    typeVetement: '',
    couleur: '',
    quantite: 1,
    prixUnitaire: 0,
    prixTotal: 0,
    instructions: ''
  });
  
  // Liste plate de tous les vêtements
  const tousLesVetements = getAllVetements();
  
  // Couleurs disponibles
  const couleurs = [
  { nom: 'Rouge', classe: 'bg-red-500' },
  { nom: 'Vert', classe: 'bg-green-500' },
  { nom: 'Bleu', classe: 'bg-blue-500' },
  { nom: 'Jaune', classe: 'bg-yellow-500' },
  { nom: 'Orange', classe: 'bg-orange-500' },
  { nom: 'Violet', classe: 'bg-purple-500' },
  { nom: 'Rose', classe: 'bg-pink-500' },
  { nom: 'Cyan', classe: 'bg-cyan-500' },
  { nom: 'Turquoise', classe: 'bg-teal-500' },
  { nom: 'Lime', classe: 'bg-lime-500' },
  { nom: 'Indigo', classe: 'bg-indigo-500' },
  { nom: 'Blanc', classe: 'bg-white border border-gray-300' },
  { nom: 'Noir', classe: 'bg-black' },
  { nom: 'Gris', classe: 'bg-gray-500' },
  { nom: 'Ambre', classe: 'bg-amber-500' },
  { nom: 'Émeraude', classe: 'bg-emerald-500' },
  { nom: 'Fuchsia', classe: 'bg-fuchsia-500' },
  { nom: 'Slate', classe: 'bg-slate-500' },
  { nom: 'Zinc', classe: 'bg-zinc-500' },
  { nom: 'Stone', classe: 'bg-stone-500' }
];


  // Vérifier si l'utilisateur est connecté
  useEffect(() => { // { name: 'Services', path: '/dashboard/services', icon: <FaUsers /> },
    const isAuth = authService.isAuthenticated();
    setIsLoggedIn(isAuth);
    
    if (isAuth) {
      // Récupérer les informations de l'utilisateur
      const fetchUserData = async () => {
        try {
          const userData = await authService.getCurrentUser();
          if (userData.success) {
            setUser(userData.data);
            // Pré-remplir l'adresse si disponible
            if (userData.data.adresse) {
              setAdresseLivraison(userData.data.adresse);
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      };
      fetchUserData();
    } // { name: 'Services', path: '/dashboard/services', icon: <FaUsers /> },
    
    // Initialiser la date à aujourd'hui
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDateCommande(formattedDate);
  }, []);

  // Mettre à jour le prix unitaire lorsque le type de vêtement change
  useEffect(() => {
    if (nouvelArticle.typeVetement) {
      const vetementSelectionne = tousLesVetements.find(v => v.nom === nouvelArticle.typeVetement);
      if (vetementSelectionne) {
        setNouvelArticle(prev => ({
          ...prev,
          prixUnitaire: vetementSelectionne.prix,
          prixTotal: vetementSelectionne.prix * prev.quantite
        }));
      }
    }
  }, [nouvelArticle.typeVetement]);
 // { name: 'Services', path: '/dashboard/services', icon: <FaUsers /> },
  // Mettre à jour le prix total lorsque la quantité change
  useEffect(() => {
    setNouvelArticle(prev => ({
      ...prev,
      prixTotal: prev.prixUnitaire * prev.quantite
    }));
  }, [nouvelArticle.quantite]);

  // Calculer le total de la commande
  useEffect(() => {
    const total = panier.reduce((sum, item) => sum + item.prixTotal, 0);
    setTotalCommande(total);
  }, [panier]);

  // Gérer le changement de type de vêtement
  const handleTypeVetementChange = (e) => {
    const typeVetement = e.target.value;
    setNouvelArticle(prev => ({ ...prev, typeVetement }));
  };

  // Gérer le changement de couleur
  const handleCouleurChange = (couleur) => {
    setNouvelArticle(prev => ({ ...prev, couleur }));
  };

  // Gérer le changement de quantité
  const handleQuantiteChange = (e) => {
    const quantite = parseInt(e.target.value) || 1;
    setNouvelArticle(prev => ({ ...prev, quantite }));
  };

  // Ajouter un article au panier
  const ajouterAuPanier = () => {
    if (!nouvelArticle.typeVetement || !nouvelArticle.couleur) {
      alert('Veuillez sélectionner un type de vêtement et une couleur');
      return;
    }
    
    setPanier([...panier, { ...nouvelArticle, id: Date.now() }]);
    
    // Réinitialiser le formulaire
    setNouvelArticle({
      typeVetement: '',
      couleur: '',
      quantite: 1,
      prixUnitaire: 0,
      prixTotal: 0,
      instructions: ''
    });
  };

  // Supprimer un article du panier
  const supprimerDuPanier = (id) => {
    setPanier(panier.filter(item => item.id !== id));
  };

  // Valider la commande
  const validerCommande = async () => {
    if (!isLoggedIn) {
      setErrorMessage('Veuillez vous connecter pour passer une commande');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return;
    }

    if (panier.length === 0) {
      setErrorMessage('Votre panier est vide');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Préparer les données de la commande selon le modèle de service
      // Vérifier si l'utilisateur est bien défini
      if (!user) {
        setErrorMessage('');
        // On continue le processus sans rediriger vers login
        // On utilisera un ID temporaire si nécessaire
      }
      
      // Préparer les données du service avec ou sans utilisateur connecté
      const serviceData = {
        typeService: 'Pressing Standard',
        date: dateCommande,
        quantite: panier.reduce((sum, item) => sum + item.quantite, 0),
        montant: totalCommande + fraisLivraison,
        statut: 'En attente',
        adresse: adresseLivraison || (user?.adresse || 'À renseigner'),
        // Si l'utilisateur n'est pas disponible, on utilise 'client_temporaire' pour permettre
        // au backend de créer une commande anonyme ou temporaire
        client: user ? (user.id || user._id) : 'client_temporaire',
        articles: panier.map(item => ({
          type: item.typeVetement,
          couleur: item.couleur,
          quantite: item.quantite,
          prixUnitaire: item.prixUnitaire,
          prixTotal: item.prixTotal,
          instructions: item.instructions || ''
        }))
      };

      // Envoyer la commande au backend en utilisant le serviceClient
      const result = await serviceClient.createService(serviceData);

      if (result.success) {
        setSuccessMessage('Votre commande a été passée avec succès!');
        setPanier([]);
        
        // Rediriger vers la page des commandes après 2 secondes
        setTimeout(() => {
          router.push('/reservation/commande/commandes');
        }, 2000);
      } else {
        setErrorMessage(result.error || 'Une erreur est survenue lors de la validation de votre commande');
      }
    } catch (error) {
      console.error('Erreur lors de la validation de la commande:', error);
      setErrorMessage('Une erreur est survenue lors de la validation de votre commande');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 flex items-center">
          {/* <FaShoppingCart className="mr-3 text-green-600" />  */}
          Passer une commande
        </h1>
        
        {/* Messages de succès et d'erreur */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-md flex items-center">
            <FaInfoCircle className="mr-2" />
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-md flex items-center">
            <FaInfoCircle className="mr-2" />
            {errorMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire d'ajout d'article */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaPlus className="mr-2 text-blue-500" /> 
              Ajouter un Article
            </h2>
            
            <div className="space-y-4">
              {/* Type de vêtement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de Vêtement</label>
                <select 
                  value={nouvelArticle.typeVetement} 
                  onChange={handleTypeVetementChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Sélectionnez un type de vêtement</option>
                  <optgroup label="Hauts">
                    {tarifsData.hauts.map((v, index) => (
                      <option key={`haut-${index}`} value={v.nom}>{v.nom}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Ensembles">
                    {tarifsData.ensembles.map((v, index) => (
                      <option key={`ensemble-${index}`} value={v.nom}>{v.nom}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Bas">
                    {tarifsData.bas.map((v, index) => (
                      <option key={`bas-${index}`} value={v.nom}>{v.nom}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Divers">
                    {tarifsData.divers.map((v, index) => (
                      <option key={`divers-${index}`} value={v.nom}>{v.nom}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              {/* Couleur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Couleurs</label>
                <div className="flex flex-wrap gap-2">
                  {couleurs.map((couleur, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCouleurChange(couleur.nom)}
                      className={`w-8 h-8 rounded-full ${couleur.classe} ${nouvelArticle.couleur === couleur.nom ? 'ring-2 ring-offset-2 ring-green-500' : ''}`}
                      title={couleur.nom}
                    />
                  ))}
                </div>
                {nouvelArticle.couleur && (
                  <p className="mt-1 text-bold text-gray-600">Couleur sélectionnée: {nouvelArticle.couleur}</p>
                )}
              </div>
              
              {/* Quantité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <input
                  type="number"
                  min="1"
                  value={nouvelArticle.quantite}
                  onChange={handleQuantiteChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              {/* Prix Unitaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix Unitaire</label>
                <input
                  type="text"
                  value={`${nouvelArticle.prixUnitaire.toLocaleString()} FCFA`}
                  readOnly
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                />
              </div>
              
              {/* Prix Total */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix Total</label>
                <input
                  type="text"
                  value={`${nouvelArticle.prixTotal.toLocaleString()} FCFA`}
                  readOnly
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md"
                />
              </div> */}
              
              {/* Date de commande */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaCalendarAlt className="mr-1 text-amber-500" /> Date
                </label>
                <input
                  type="date"
                  value={dateCommande}
                  onChange={(e) => setDateCommande(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Adresse de livraison */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaMapMarkerAlt className="mr-1 text-amber-500" /> Adresse de livraison
                </label>
                <textarea
                  value={adresseLivraison}
                  onChange={(e) => setAdresseLivraison(e.target.value)}
                  placeholder="Veuillez saisir l'adresse de livraison exacte"
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              {/* Instructions spéciales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaInfoCircle className="mr-1 text-amber-500" /> Instructions spéciales
                </label>
                <textarea
                  value={nouvelArticle.instructions}
                  onChange={(e) => setNouvelArticle({...nouvelArticle, instructions: e.target.value})}
                  placeholder="Ex: Attention particulière aux taches, repassage léger, etc."
                  rows="2"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              {/* Bouton Ajouter au Panier */}
              <div>
                <button
                  onClick={ajouterAuPanier}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center justify-center"
                >
                  <FaPlus className="mr-2" /> Ajouter au Panier
                </button>
              </div>
            </div>
          </div>
          
          {/* Récapitulatif de la Commande */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              {/* <FaShoppingCart className="mr-2 text-green-500" /> */}
              Récapitulatif de la Commande
            </h2>
            
            {panier.length > 0 ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE DE VÊTEMENT</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COULEUR</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUANTITÉ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INSTRUCTIONS</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRIX TOTAL</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {panier.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap">{item.typeVetement}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.couleur}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.quantite}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.instructions ? (
                              <div className="max-w-xs truncate text-xs">{item.instructions}</div>
                            ) : (
                              <span className="text-gray-400 text-xs italic">Aucune</span>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{item.prixTotal.toLocaleString()} FCFA</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => supprimerDuPanier(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Total Commande</span>
                    <span className="font-medium">{totalCommande.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 flex items-center">
                      <FaTruck className="mr-2 text-gray-500" /> Frais de livraison
                    </span>
                    <span className="font-medium">{fraisLivraison.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span className="flex items-center">
                      <FaMoneyBillWave className="mr-2 text-green-600" /> Total Général
                    </span>
                    <span>{(totalCommande + fraisLivraison).toLocaleString()} FCFA</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={validerCommande}
                    disabled={isLoading}
                    className={`w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Traitement en cours...
                      </>
                    ) : (
                      'Valider le Panier'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Votre panier est vide</p>
                <p className="text-sm text-gray-400 mt-2">Ajoutez des articles pour passer une commande</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}