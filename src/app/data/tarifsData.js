"use client";

// Données des tarifs pour les différentes catégories de vêtements
export const tarifsData = {
  hauts: [
    { nom: "Blouson", prix: 1500 },
    { nom: "Chemise Haut 1pc", prix: 1000 },
    { nom: "Chemise", prix: 900 },
    { nom: "Chemise Délicate", prix: 1200 },
    { nom: "Chemise Jean", prix: 1200 },
    { nom: "Chemisier", prix: 900 },
    { nom: "Gandoura Haut 1pc", prix: 1500 },
    { nom: "Gilet Costume", prix: 1000 },
    { nom: "Haut Dentelle", prix: 1200 },
    { nom: "Haut Plissé", prix: 1200 },
    { nom: "Haut Perlé", prix: 1200 },
    { nom: "Haut Simple", prix: 900 },
    { nom: "Maillot Sport", prix: 700 },
    { nom: "Polo / T-Shirt", prix: 800 },
    { nom: "Pull", prix: 1200 },
    { nom: "Veste Costume", prix: 1500 },
    { nom: "Veste Jean", prix: 1500 }
  ],
  ensembles: [
    { nom: "Blouse Blanche", prix: 2000 },
    { nom: "Blouse 2pc", prix: 2000 },
    { nom: "Combinaison 1pc", prix: 2000 },
    { nom: "Costume 2pc", prix: 2500 },
    { nom: "Gandoura 3pc", prix: 3500 },
    { nom: "Kimono 2pc", prix: 2000 },
    { nom: "Kimono 3pc", prix: 3500 },
    { nom: "Pagne 2pc", prix: 2000 },
    { nom: "Pagne 3pc", prix: 2500 },
    { nom: "Robe Cocktail", prix: 3000 },
    { nom: "Robe Dentelle", prix: 3000 },
    { nom: "Robe Kaba", prix: 1800 },
    { nom: "Robe Mariage", prix: 10000 },
    { nom: "Robe Perlée", prix: 4000 },
    { nom: "Robe Plissée", prix: 4000 },
    { nom: "Robe Simple", prix: 1800 },
    { nom: "Tailleur 2pc", prix: 2500 }
  ],
  enfants: [
    { nom: "Baskets", prix: 1500 },
    { nom: "Blouson 2pc", prix: 1500 },
    { nom: "Chemise", prix: 500 },
    { nom: "Costume 2pc", prix: 1500 },
    { nom: "Couverture", prix: 2500 },
    { nom: "Gandoura 3pc", prix: 2000 },
    { nom: "Gilet Costume", prix: 500 },
    { nom: "Jupe Simple", prix: 800 },
    { nom: "Layette", prix: 300 },
    { nom: "Nounours", prix: 1000 },
    { nom: "Pantalon", prix: 800 },
    { nom: "Robe Dentelle", prix: 2000 },
    { nom: "Robe Perlée", prix: 2000 },
    { nom: "Robe Plissée", prix: 2000 },
    { nom: "Robe Simple", prix: 1200 },
    { nom: "T-Shirt / Polo", prix: 500 },
    { nom: "Veste", prix: 800 }
  ],
  linge: [
    { nom: "2Draps + 2Taies", prix: 2400 },
    { nom: "Couverture / Couette", prix: 4000 },
    { nom: "Drap", prix: 800 },
    { nom: "Housse De Chaise", prix: 800 },
    { nom: "Housse De Couette", prix: 1600 },
    { nom: "Housse De Matelas", prix: 10000 },
    { nom: "Nappe De Table", prix: 1000 },
    { nom: "Rideau (Au M)", prix: 1600 },
    { nom: "Serviette A Main", prix: 800 },
    { nom: "Serviette Grande", prix: 1500 },
    { nom: "Serviette Moyenne", prix: 1000 },
    { nom: "Taie D'oreiller", prix: 400 },
    { nom: "Tapis (Au m²)", prix: 2000 }
  ],
  bas: [
    { nom: "Bermuda", prix: 300 },
    { nom: "Jeans", prix: 1000 },
    { nom: "Jupe Droite", prix: 1000 },
    { nom: "Jupe Longue", prix: 1200 },
    { nom: "Jupe Plissée", prix: 1500 },
    { nom: "Pantalon", prix: 1000 },
    { nom: "Short", prix: 900 }
  ],
  divers: [
    { nom: "Baskets", prix: 2500 },
    { nom: "Casquette", prix: 1000 },
    { nom: "Chapeau", prix: 1500 },
    { nom: "Chaussures", prix: 2500 },
    { nom: "Écharpe", prix: 1000 },
    { nom: "Sac", prix: 2000 }
  ]
};

// Fonction pour obtenir tous les vêtements dans une liste plate
export const getAllVetements = () => {
  const allVetements = [];
  
  Object.keys(tarifsData).forEach(category => {
    tarifsData[category].forEach(item => {
      allVetements.push({
        ...item,
        categorie: category
      });
    });
  });
  
  return allVetements.sort((a, b) => a.nom.localeCompare(b.nom));
};

// Fonction pour trouver un vêtement par son nom
export const findVetementByName = (name) => {
  for (const category of Object.keys(tarifsData)) {
    const found = tarifsData[category].find(item => 
      item.nom.toLowerCase() === name.toLowerCase()
    );
    if (found) return found;
  }
  return null;
};
