"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const pathname = usePathname();
  
  const { user, logout, isAuthenticated } = useAuth();

  // Fermer les menus lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fermer le menu lorsqu'on change de page
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="Océane Pressing" 
              width={180} 
              height={120} 
              className="h-20 w-auto" 
            />
          </Link>

          {/* Menu de navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-10 ml-55">
            <Link
              href="/"
              className={`${pathname === "/" ? "text-bold text-green-600 font-bold" : "text-gray-800"} text-base px-3 py-2 rounded-md transition-colors`}
            >
              Accueil
            </Link>
            <Link
              href="/about"
              className={`${pathname === "/about" ? "text-bold text-green-600 font-semibold" : "text-gray-800"} text-base px-3 py-2 rounded-md transition-colors`}
            >
                À propos
            </Link>
            <Link
              href="/tarifs"
              className={`${pathname === "/tarifs" ? "text-bold text-green-600 font-semibold" : "text-gray-800"} text-base px-3 py-2 rounded-md transition-colors`}
            >
              Tarifs
            </Link>
          </div>

          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated() ? (
              <div className="relative" ref={profileRef}>
                <button 
                  className="flex items-center space-x-2 text-gray-800 focus:outline-none bg-white-100 px-4 py-2 rounded-md"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                    {user?.prenom ? user.prenom.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  <span className="font-medium">
                    {user?.prenom ? `${user.prenom}` : 'Se connecter'}
                  </span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        <span>Déconnexion</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Le bouton de connexion */}
                <Link 
                  href="/auth/login" 
                  className="text-gray-800 flex items-center px-4 py-2 rounded-md bg-gray-40"
                >
                  <FaUser className="mr-2" />
                  <span>Se connecter</span>
                </Link>
                
                {/* Afficher le bouton S'inscrire seulement si NON authentifié */}
                {!isAuthenticated && (
                  <Link
                    href="/auth/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    S'inscrire
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Menu hamburger - Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-50 border-t border-white-100"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className={`${pathname === "/" ? "text-green-600 font-semibold" : "text-gray-800"} py-3 border-b border-gray-100`}
              >
                Accueil
              </Link>
              <Link
                href="/about"
                className={`${pathname === "/about" ? "text-green-600 font-semibold" : "text-gray-800"} py-3 border-b border-gray-100`}
              >
                A propos
              </Link>
              <Link
                href="/tarifs"
                className={`${pathname === "/tarifs" ? "text-green-600 font-semibold" : "text-gray-800"} py-3 border-b border-gray-100`}
              >
                Tarifs
              </Link>
              
              {isAuthenticated() ? (
                <>
                  <Link
                    href="/reservation"
                    className="text-gray-800 py-3 border-b border-gray-100"
                  >
                    Réserver
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 py-3 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/register"
                    className="text-gray-800 py-3 border-b border-gray-100"
                  >
                    Se connecter
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;