"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => useContext(AuthContext);

// Provider d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifier si l'utilisateur est connecté au chargement de l'application
  useEffect(() => {
    // Vérifier si nous sommes dans le navigateur (côté client)
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
      
      setLoading(false);
    }
  }, []);

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/login`,
        { email, password },
        { 
          headers: { "Content-Type": "application/json" }
        }
      );

      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.data._id,
            nom: data.data.nom,
            prenom: data.data.prenom,
            email: data.data.email,
            role: data.data.role,
          })
        );

        setUser({
          id: data.data._id,
          nom: data.data.nom,
          prenom: data.data.prenom,
          email: data.data.email,
          role: data.data.role,
        });

        return { success: true };
      } else {
        return { success: false, error: data.error || "Échec de connexion" };
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return {
        success: false,
        error: "Erreur lors de la connexion au serveur",
      };
    }
  };

  // Fonction d'inscription
  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/register`,
        userData,
        { 
          headers: { "Content-Type": "application/json" }
        }
      );

      const data = response.data;

      if (data.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || "Échec de l'inscription",
        };
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      return {
        success: false,
        error: "Erreur lors de la connexion au serveur",
      };
    }
  };

  // Fonction de déconnexion
  const logout = async () => {
    try {
      // Appel à l'API pour effacer le cookie côté serveur
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/logout`
      );
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      // Nettoyage côté client même si l'API échoue
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Vous êtes déconnecté");
      router.push("/");
    }
  };

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
