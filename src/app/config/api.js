"use client";

// Configuration de l'API
const config = {
  // URL de base de l'API - utilise l'API locale en développement
  apiBaseUrl: typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? "http://localhost:5000/api"
    : process.env.NEXT_PUBLIC_API_URL || "https://pressing-api.onrender.com/api",
  
  // URL de secours en cas de besoin
  fallbackApiUrl: "https://pressing-api.onrender.com/api"
};

export default config;
