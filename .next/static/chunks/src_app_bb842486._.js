(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/services/authHelper.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
'use client';
/**
 * Service d'authentification sécurisé pour interagir avec l'API backend
 * Version simplifiée
 */ /**
 * Vérifie si le code s'exécute côté client (navigateur)
 * @returns {boolean} true si côté client, false si côté serveur
 */ const isClient = "object" !== 'undefined';
/**
 * Service d'authentification simplifié
 */ const authHelper = {
    /**
   * Récupère l'utilisateur depuis le localStorage
   */ getCurrentUser: ()=>{
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        try {
            const userStr = window.localStorage.getItem('user');
            if (!userStr) return null;
            return JSON.parse(userStr);
        } catch (error) {
            console.error('Erreur lors de la récupération utilisateur:', error);
            return null;
        }
    },
    /**
   * Récupère le token depuis le localStorage
   */ getToken: ()=>{
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        try {
            return window.localStorage.getItem('token');
        } catch (error) {
            console.error('Erreur lors de la récupération du token:', error);
            return null;
        }
    },
    /**
   * Vérifie si l'utilisateur est authentifié
   */ isAuthenticated: ()=>{
        return !!authHelper.getToken();
    },
    /**
   * Stocke les données utilisateur
   */ setUserData: (user, token)=>{
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        try {
            window.localStorage.setItem('token', token);
            window.localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
            console.error('Erreur lors du stockage des données utilisateur:', error);
        }
    },
    /**
   * Supprime les données utilisateur
   */ clearUserData: ()=>{
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        try {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('user');
        } catch (error) {
            console.error('Erreur lors de la suppression des données utilisateur:', error);
        }
    }
};
const __TURBOPACK__default__export__ = authHelper;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/services/authService.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// Import du helper d'authentification
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/authHelper.js [app-client] (ecmascript)");
'use client';
/**
 * Service d'authentification pour interagir avec l'API backend
 */ // URL de base de l'API
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api") || 'http://localhost:5000/api';
;
/**
 * Service d'authentification simplifié
 */ const authService = {
    /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} - Résultat de l'inscription
   */ register: async (userData)=>{
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Échec de l\'inscription'
                };
            }
            return {
                success: true,
                message: 'Inscription réussie'
            };
        } catch (error) {
            console.error('Erreur register:', error);
            return {
                success: false,
                error: 'Erreur lors de l\'inscription'
            };
        }
    },
    /**
   * Connexion d'un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise<Object>} - Résultat de la connexion
   */ login: async (email, password)=>{
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Échec de la connexion'
                };
            }
            // Stocker le token et les informations utilisateur
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].setUserData(data.user, data.token);
            return {
                success: true,
                user: data.user
            };
        } catch (error) {
            console.error('Erreur login:', error);
            return {
                success: false,
                error: 'Erreur lors de la connexion'
            };
        }
    },
    /**
   * Déconnexion de l'utilisateur
   */ logout: ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].clearUserData();
    },
    /**
   * Récupération de l'utilisateur actuel
   * @returns {Object|null} - Utilisateur connecté ou null
   */ getCurrentUser: ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getCurrentUser();
    },
    /**
   * Vérification si l'utilisateur est authentifié
   * @returns {boolean} - true si l'utilisateur est authentifié
   */ isAuthenticated: ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAuthenticated();
    },
    /**
   * Récupération du token d'authentification
   * @returns {string|null} - Token d'authentification
   */ getToken: ()=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authHelper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getToken();
    }
};
const __TURBOPACK__default__export__ = authService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/config/api.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use client";
// Configuration de l'API
const config = {
    // URL de base de l'API - utilise l'API locale en développement
    apiBaseUrl: "object" !== 'undefined' && window.location.hostname === 'localhost' ? "http://localhost:5000/api" : ("TURBOPACK compile-time value", "http://localhost:5000/api") || "https://pressing-api.onrender.com/api",
    // URL de secours en cas de besoin
    fallbackApiUrl: "https://pressing-api.onrender.com/api"
};
const __TURBOPACK__default__export__ = config;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/services/serviceClient.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
/**
 * Service pour gérer les services de pressing
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$config$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/config/api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/authService.js [app-client] (ecmascript)");
'use client';
;
;
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$config$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].apiBaseUrl;
/**
 * Service pour gérer les services de pressing
 */ const serviceClient = {
    /**
   * Créer un nouveau service
   * @param {Object} serviceData - Données du service
   * @returns {Promise<Object>} - Résultat de la création
   */ createService: async (serviceData)=>{
        try {
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getToken();
            const response = await fetch(`${API_URL}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(serviceData)
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Échec de la création du service',
                    details: data.error
                };
            }
            return {
                success: true,
                data: data.data,
                message: data.message
            };
        } catch (error) {
            console.error('Erreur createService:', error);
            return {
                success: false,
                error: 'Erreur lors de la création du service'
            };
        }
    },
    /**
   * Récupérer tous les services du client
   * @returns {Promise<Object>} - Liste des services
   */ getClientServices: async ()=>{
        try {
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getToken();
            const response = await fetch(`${API_URL}/services`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Échec de la récupération des services'
                };
            }
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Erreur getClientServices:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération des services'
            };
        }
    },
    /**
   * Récupérer un service spécifique
   * @param {string} serviceId - ID du service
   * @returns {Promise<Object>} - Détails du service
   */ getServiceById: async (serviceId)=>{
        try {
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getToken();
            const response = await fetch(`${API_URL}/services/${serviceId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Échec de la récupération du service'
                };
            }
            return {
                success: true,
                data: data.data
            };
        } catch (error) {
            console.error('Erreur getServiceById:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération du service'
            };
        }
    },
    /**
   * Récupérer tous les types de services disponibles
   * @param {Object} params - Paramètres optionnels (pagination, catégorie, etc.)
   * @returns {Promise<Object>} - Liste des types de services
   */ getServiceTypes: async (params = {})=>{
        try {
            // Construction de l'URL avec paramètres de requête
            let url = `${API_URL}/service-types`;
            const queryParams = new URLSearchParams();
            // Ajouter les paramètres s'ils sont fournis
            if (params.categorie) queryParams.append('categorie', params.categorie);
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.search) queryParams.append('search', params.search);
            // Ajouter les paramètres à l'URL si nécessaire
            const queryString = queryParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            // Les types de services sont publics, pas besoin de token
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Échec de la récupération des types de services',
                    details: data.error
                };
            }
            return {
                success: true,
                data: data.data || data,
                pagination: data.pagination
            };
        } catch (error) {
            console.error('Erreur getServiceById:', error);
            return {
                success: false,
                error: 'Erreur lors de la récupération du service'
            };
        }
    },
    /**
   * Mettre à jour un service
   * @param {string} serviceId - ID du service
   * @param {Object} serviceData - Nouvelles données du service
   * @returns {Promise<Object>} - Résultat de la mise à jour
   */ updateService: async (serviceId, serviceData)=>{
        try {
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getToken();
            const response = await fetch(`${API_URL}/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(serviceData)
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Échec de la mise à jour du service'
                };
            }
            return {
                success: true,
                data: data.data,
                message: data.message
            };
        } catch (error) {
            console.error('Erreur updateService:', error);
            return {
                success: false,
                error: 'Erreur lors de la mise à jour du service'
            };
        }
    },
    /**
   * Annuler un service
   * @param {string} serviceId - ID du service
   * @returns {Promise<Object>} - Résultat de l'annulation
   */ cancelService: async (serviceId)=>{
        try {
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getToken();
            const response = await fetch(`${API_URL}/services/${serviceId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Échec de l\'annulation du service'
                };
            }
            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            console.error('Erreur cancelService:', error);
            return {
                success: false,
                error: 'Erreur lors de l\'annulation du service'
            };
        }
    },
    /**
   * Mettre à jour les informations de sécurité du client
   * @param {Object} securityData - Données de sécurité
   * @returns {Promise<Object>} - Résultat de la mise à jour
   */ updateSecurity: async (securityData)=>{
        try {
            const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getToken();
            const response = await fetch(`${API_URL}/users/security`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(securityData)
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Échec de la mise à jour des informations de sécurité'
                };
            }
            return {
                success: true,
                message: data.message
            };
        } catch (error) {
            console.error('Erreur updateSecurity:', error);
            return {
                success: false,
                error: 'Erreur lors de la mise à jour des informations de sécurité'
            };
        }
    }
};
const __TURBOPACK__default__export__ = serviceClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/reservation/parametres/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Page)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/authService.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$serviceClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/services/serviceClient.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Page() {
    _s();
    // États pour les formulaires
    const [profileData, setProfileData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: ''
    });
    const [securite, setSecurite] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        motDePasse: '',
        nouveauMotDePasse: '',
        confirmationMotDePasse: ''
    });
    // États pour la visibilité des mots de passe
    const [showCurrentPassword, setShowCurrentPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNewPassword, setShowNewPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // États pour gérer les chargements et les erreurs
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Vérifier si l'utilisateur est authentifié et charger ses données
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Page.useEffect": ()=>{
            const checkAuth = {
                "Page.useEffect.checkAuth": ()=>{
                    const isAuth = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAuthenticated();
                    setIsAuthenticated(isAuth);
                    if (isAuth) {
                        const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$authService$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getCurrentUser();
                        if (user) {
                            setProfileData({
                                nom: user.nom || '',
                                prenom: user.prenom || '',
                                email: user.email || '',
                                telephone: user.telephone || '',
                                adresse: user.adresse || ''
                            });
                        }
                    }
                }
            }["Page.useEffect.checkAuth"];
            checkAuth();
        }
    }["Page.useEffect"], []);
    // Gestionnaires d'événements
    const handleProfileChange = (e)=>{
        const { name, value } = e.target;
        setProfileData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleSecuriteChange = (e)=>{
        const { name, value } = e.target;
        setSecurite((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleProfileSubmit = async (e)=>{
        e.preventDefault();
        if (!isAuthenticated) {
            setError('Vous devez être connecté pour modifier votre profil');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            // Note: Cette fonctionnalité n'est pas encore implémentée dans l'API
            // Simulons une mise à jour réussie pour le moment
            setTimeout(()=>{
                setSuccess('Profil mis à jour avec succès !');
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            setError('Une erreur est survenue lors de la mise à jour du profil');
            setIsLoading(false);
        }
    };
    const handleSecuriteSubmit = async (e)=>{
        e.preventDefault();
        if (!isAuthenticated) {
            setError('Vous devez être connecté pour modifier votre mot de passe');
            return;
        }
        // Validation des mots de passe
        if (!securite.motDePasse) {
            setError('Veuillez entrer votre mot de passe actuel');
            return;
        }
        if (!securite.nouveauMotDePasse) {
            setError('Veuillez entrer un nouveau mot de passe');
            return;
        }
        if (securite.nouveauMotDePasse !== securite.confirmationMotDePasse) {
            setError('Les mots de passe ne correspondent pas !');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$services$2f$serviceClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].updateSecurity({
                currentPassword: securite.motDePasse,
                newPassword: securite.nouveauMotDePasse
            });
            if (result.success) {
                setSuccess('Mot de passe modifié avec succès !');
                setSecurite({
                    motDePasse: '',
                    nouveauMotDePasse: '',
                    confirmationMotDePasse: ''
                });
            } else {
                setError(result.error || 'Une erreur est survenue lors de la modification du mot de passe');
            }
        } catch (error) {
            setError('Une erreur est survenue lors de la modification du mot de passe');
            console.error('Exception:', error);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-16 p-6 space-y-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lg:col-span-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-lg shadow",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold mb-4",
                                children: "Paramètres"
                            }, void 0, false, {
                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "#security",
                                            className: "flex items-center p-3 hover:bg-gray-50 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLock"], {
                                                    className: "mr-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                    lineNumber: 164,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Sécurité"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                    lineNumber: 165,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                            lineNumber: 163,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                        lineNumber: 162,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                    lineNumber: 154,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                        lineNumber: 151,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/reservation/parametres/page.jsx",
                    lineNumber: 150,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "lg:col-span-2 space-y-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "security",
                        className: "bg-white p-6 rounded-lg shadow",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold mb-4",
                                children: "Sécurité du Compte"
                            }, void 0, false, {
                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this),
                            !isAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 bg-amber-50 text-amber-700 rounded-md",
                                children: "Vous devez être connecté pour modifier vos paramètres de sécurité."
                            }, void 0, false, {
                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                lineNumber: 182,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: handleSecuriteSubmit,
                                className: "space-y-4",
                                children: [
                                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 bg-red-50 rounded border border-red-200 text-red-700",
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                        lineNumber: 188,
                                        columnNumber: 19
                                    }, this),
                                    success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 bg-green-50 rounded border border-green-200 text-green-700",
                                        children: success
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                        lineNumber: 194,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "Mot de passe actuel"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                lineNumber: 200,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: showCurrentPassword ? "text" : "password",
                                                        name: "motDePasse",
                                                        value: securite.motDePasse,
                                                        onChange: handleSecuriteChange,
                                                        className: "block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                        lineNumber: 202,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>setShowCurrentPassword(!showCurrentPassword),
                                                        className: "absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer",
                                                        children: showCurrentPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEyeSlash"], {
                                                            className: "text-gray-500 "
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                            lineNumber: 214,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEye"], {
                                                            className: "text-gray-500 "
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                            lineNumber: 216,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                        lineNumber: 209,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                lineNumber: 201,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                        lineNumber: 199,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "Nouveau mot de passe"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                lineNumber: 223,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: showNewPassword ? "text" : "password",
                                                        name: "nouveauMotDePasse",
                                                        value: securite.nouveauMotDePasse,
                                                        onChange: handleSecuriteChange,
                                                        className: "block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                        lineNumber: 225,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>setShowNewPassword(!showNewPassword),
                                                        className: "absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer",
                                                        children: showNewPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEyeSlash"], {
                                                            className: "text-gray-500 "
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                            lineNumber: 237,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEye"], {
                                                            className: "text-gray-500 "
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                            lineNumber: 239,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                        lineNumber: 232,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                lineNumber: 224,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                        lineNumber: 222,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-1",
                                                children: "Confirmer le nouveau mot de passe"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                lineNumber: 246,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: showConfirmPassword ? "text" : "password",
                                                        name: "confirmationMotDePasse",
                                                        value: securite.confirmationMotDePasse,
                                                        onChange: handleSecuriteChange,
                                                        className: "block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                        lineNumber: 248,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>setShowConfirmPassword(!showConfirmPassword),
                                                        className: "absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer",
                                                        children: showConfirmPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEyeSlash"], {
                                                            className: "text-gray-500 "
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                            lineNumber: 260,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaEye"], {
                                                            className: "text-gray-500 "
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                            lineNumber: 262,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                        lineNumber: 255,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                lineNumber: 247,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                        lineNumber: 245,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-end",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: isLoading,
                                            className: "flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed",
                                            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaSpinner"], {
                                                        className: "animate-spin mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                        lineNumber: 276,
                                                        columnNumber: 25
                                                    }, this),
                                                    "Traitement..."
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaLock"], {
                                                        className: "mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                                        lineNumber: 281,
                                                        columnNumber: 25
                                                    }, this),
                                                    "Modifier le mot de passe"
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                            lineNumber: 269,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                        lineNumber: 268,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/reservation/parametres/page.jsx",
                                lineNumber: 186,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/reservation/parametres/page.jsx",
                        lineNumber: 178,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/reservation/parametres/page.jsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/reservation/parametres/page.jsx",
            lineNumber: 148,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/reservation/parametres/page.jsx",
        lineNumber: 147,
        columnNumber: 5
    }, this);
}
_s(Page, "jUL75SYFPCVsCcjJ3kXviaK9PRY=");
_c = Page;
var _c;
__turbopack_context__.k.register(_c, "Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_app_bb842486._.js.map