"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/reservation";
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
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
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success("Connexion réussie");
        router.push(redirect);
      } else {
        toast.error(result.error || "Échec de la connexion");
        setErrors({ general: result.error || "Email ou mot de passe incorrect" });
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error("Erreur lors de la connexion");
      setErrors({ general: "Erreur lors de la connexion au serveur" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row bg-white">
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
            <h2 className="text-xl font-bold uppercase mb-2">SE CONNECTER</h2>
            <div className="w-16 h-1 bg-white mx-auto mb-4"></div>
            {/* <p className="text-white/80 text-sm">Se connecter</p> */}
          </div>
        </div>
        
        {/* Right side with form */}
        <div className="md:w-3/5 p-8">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl font-bold text-amber-600">Se connecter</h1>
          </div>
          
          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {errors.general}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-amber-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 px-3 py-2.5 border-b-2 focus:outline-none focus:border-amber-400 transition-colors bg-transparent ${
                    errors.email ? "border-red-500" : "border-green-300"
                  }`}
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
                  <FaLock className="text-amber-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 px-3 py-2.5 border-b-2 focus:outline-none focus:border-amber-400 transition-colors bg-transparent ${
                    errors.password ? "border-red-500" : "border-green-300"
                  }`}
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
            
           
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
            >
              {loading ? "Connexion en cours..." : "connexion"}
            </button>
            
           
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Vous n'avez pas de compte ?{" "}
            <Link href="/auth/register" className="text-amber-600 hover:text-amber-700 font-medium">
              Inscrivez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
