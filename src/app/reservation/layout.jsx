'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FaTshirt, FaClipboardList, FaUserCog, FaHome, FaCog, FaInfoCircle, FaUser, FaBars, FaTimes, FaBell, FaSignOutAlt, FaWaveSquare } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function ReservationLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Client');
  
  const menuItems = [
    { name: 'Accueil', path: '/reservation', icon: <FaHome /> },
    { name: 'Commander', path: '/reservation/commande', icon: <FaClipboardList /> },
    { name: 'Nos Services', path: '/reservation/services', icon: <FaTshirt /> },
    { name: 'Paramètres', path: '/reservation/parametres', icon: <FaCog /> },
   
    
    
  ];

  // Mettre à jour le nom d'utilisateur lorsque l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setUserName(`${user.prenom} ${user.nom}`);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <Navbar/>
      
      <div className="flex flex-col md:flex-row min-h-screen bg-green-50 pt-14">
        {/* Mobile Menu Button */}
        <div className="md:hidden bg-gradient-to-r from-green-700 to-green-800 p-4 flex justify-between items-center">
          <div className="text-white text-xl font-bold">Espace Client</div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="text-white p-2 focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-green-700 to-green-800 text-white p-4 overflow-y-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-amber-400 flex items-center justify-center mb-2">
              <span className="text-2xl font-bold"><FaUser /></span>
            </div>
            <div className="text-center">
              <div className="font-semibold">Espace Client</div>
              <div className="text-xs text-green-300">{userName}</div>
            </div>
          </div>
          
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}
                    className={`flex items-center px-2 py-3 rounded-lg ${
                      pathname === item.path
                        ? 'bg-green-600 text-white'
                        : 'text-green-200 hover:bg-green-600/50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="ml-4">{item.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact"
                  className="flex items-center px-4 py-3 text-green-200 hover:bg-green-600/50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl"><FaInfoCircle /></span>
                  <span className="ml-4">Aide & Contact</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/30"
                >
                  <span className="text-xl"><FaSignOutAlt /></span>
                  <span className="ml-4">Déconnexion</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      
      {/* Desktop Sidebar */}j
      <div 
        className={`hidden md:flex ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-gradient-to-b from-green-700 to-green-800 text-white p-4 flex-col sticky top-0 h-screen`}
      >
        {/* <div className="flex items-center justify-between mt-20">
          {!collapsed && (
            <div className="text-xl font-bold">Oceane Pressing</div>
          )}
        
        </div> */}
        
        {/* User profile */}
        <div className="mt-20  flex flex-col items-center ">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-amber-400 flex items-center justify-center mb-2">
            <span className="text-2xl font-bold">
              <FaUser />
            </span>
          </div>
          {!collapsed && (
            <div className="text-center">
              <div className="font-semibold">Espace Client</div>
              <div className="text-xs text-green-300">{userName}</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="mt-20 space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}
                  className={`flex items-center ${
                    collapsed ? 'justify-center' : 'px-4'
                  } py-3 rounded-lg ${
                    pathname === item.path
                      ? 'bg-green-600 text-white'
                      : 'text-green-200 hover:bg-green-600/50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && <span className="ml-4">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-green-600 space-y-2">
          <Link href="/contact"
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'px-4'
            } py-3 text-green-200 hover:bg-green-600/50 rounded-lg`}
          >
            <span className="text-xl"><FaInfoCircle /></span>
            {!collapsed && <span className="ml-4">Aide & Contact</span>}
          </Link>
          
          <button
            onClick={handleLogout}
            className={`flex items-center w-full ${
              collapsed ? 'justify-center' : 'px-4'
            } py-3 text-red-300 hover:bg-red-500/30 rounded-lg`}
          >
            <span className="text-xl"><FaSignOutAlt /></span>
            {!collapsed && <span className="ml-4">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
    </>
  );
}
