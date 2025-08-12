"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom) {
      newErrors.nom = "Le nom est requis";
    }
    
    if (!formData.prenom) {
      newErrors.prenom = "Le prénom est requis";
    }
    
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    if (!formData.telephone) {
      newErrors.telephone = "Le numéro de téléphone est requis";
    } else if (!/^6[0-9]{8}$/.test(formData.telephone)) {
      newErrors.telephone = "Le numéro doit contenir 9 chiffres et commencer par 6";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Créer l'objet à envoyer à l'API (sans confirmPassword)
    const userData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      password: formData.password,
    };
    
    try {
      const result = await register(userData);
      
      if (result.success) {
        toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        router.push("/auth/login");
      } else {
        // Gérer les erreurs spécifiques retournées par l'API
        if (result.error && typeof result.error === 'object') {
          setErrors(result.error);
        } else {
          setErrors({ general: result.error || "Échec de l'inscription" });
        }
        toast.error(result.error || "Échec de l'inscription");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast.error("Erreur lors de l'inscription");
      setErrors({ general: "Erreur lors de la connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row bg-white">
        {/* Left side with gradient */}
        <div className="md:w-2/5 bg-gradient-to-br from-amber-500 to-amber-300 p-8 flex flex-col justify-center relative overflow-hidden">
          {/* Design elements - diagonal stripes */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-400 rotate-45 transform opacity-50"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-400 rotate-45 transform opacity-30"></div>
          
          <div className="relative z-10 text-white text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 20 L50 50 L20 80 L50 50 L80 20 L50 50 L80 80 L50 50" stroke="white" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold uppercase mb-2">INSCRIPTION</h2>
            <div className="w-16 h-1 bg-white mx-auto mb-4"></div>
            <p className="text-white/80 text-sm">CRÉEZ VOTRE COMPTE</p>
          </div>
        </div>
        
        {/* Right side with form */}
        <div className="md:w-3/5 p-8">
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-amber-600">CRÉER UN COMPTE</h1>
            <p className="text-sm text-gray-500 mt-1">Rejoignez Océane Pressing dès aujourd'hui</p>
          </div>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-amber-400" />
                  </div>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full pl-10 px-3 py-2.5 border-b-2 focus:outline-none focus:border-amber-400 transition-colors bg-transparent ${errors.nom ? "border-red-500" : "border-green-300"}`}
                    placeholder="Nom"
                  />
                </div>
                {errors.nom && (
                  <p className="text-red-500 text-xs mt-1">{errors.nom}</p>
                )}
              </div>
              
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaUser className="text-amber-400" />
                  </div>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className={`w-full pl-10 px-3 py-2.5 border-b-2 focus:outline-none focus:border-amber-400 transition-colors bg-transparent ${errors.prenom ? "border-red-500" : "border-green-300"}`}
                    placeholder="Prénom"
                  />
                </div>
                {errors.prenom && (
                  <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>
                )}
              </div>
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-amber-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2.5 border-b-2 focus:outline-none focus:border-amber-400 transition-colors bg-transparent ${errors.email ? "border-red-500" : "border-green-300"}`}
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaPhone className="text-amber-400" />
                </div>
                <input
                  type="text"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2.5 border-b-2 focus:outline-none focus:border-amber-400 transition-colors bg-transparent ${errors.telephone ? "border-red-500" : "border-green-300"}`}
                  placeholder="Téléphone (6XXXXXXXX)"
                />
              </div>
              {errors.telephone && (
                <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>
              )}
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-amber-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2.5 border-b-2 focus:outline-none focus:border-amber-400 transition-colors bg-transparent ${errors.password ? "border-red-500" : "border-green-300"}`}
                  placeholder="Mot de passe"
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-amber-500 hover:text-amber-600" />
                  ) : (
                    <FaEye className="text-amber-500 hover:text-amber-600" />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-amber-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 px-3 py-2.5 border-b-2 focus:outline-none focus:border-amber-400 transition-colors bg-transparent ${errors.confirmPassword ? "border-red-500" : "border-green-300"}`}
                  placeholder="Confirmer mot de passe"
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-amber-500 hover:text-amber-600" />
                  ) : (
                    <FaEye className="text-amber-500 hover:text-amber-600" />
                  )}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 mt-4 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
            >
              {loading ? "Inscription en cours..." : "S'INSCRIRE"}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Vous avez déjà un compte ?{" "}
            <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Connectez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
