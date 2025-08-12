'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaClipboardList, FaUsers, FaTshirt, FaUserTie, FaChartLine, FaTachometerAlt, FaSignOutAlt, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import AdminCheck from './AdminCheck';
import DashboardNavbar from './components/DashboardNavbar';




export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    }
  }, []);
  
  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Clients/services', path: '/dashboard/clients', icon: <FaTshirt /> },
    { name: 'Types de Services', path: '/dashboard/services', icon: <FaUsers /> },
    { name: 'Employés', path: '/dashboard/employees', icon: <FaUserTie /> },
    { name: 'Rapports', path: '/dashboard/reports', icon: <FaChartLine /> },
   
  ];

  return (
    <>
      {/* Dashboard Navbar - nouvelle navbar spécifique au dashboard */}
      <DashboardNavbar/>
      
      <div className="flex flex-col md:flex-row min-h-screen bg-green-50 pt-14">
        {/* Mobile Menu Button */}
        <div className=" md:hidden bg-gradient-to-r from-green-700 to-green-800 p-4 flex justify-between items-center">
          {/* <div className="text-white text-xl font-bold">Admin Panel</div> */}
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
              <span className="text-2xl font-bold">OP</span>
            </div>
            <div className="text-center">
              <div className="font-semibold">Admin User</div>
              {/* <div className="text-xs text-green-300">admin@oceanepressing.com</div> */}
            </div>
          </div>
          
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link href={item.path}
                    className={`mt-30 flex items-center px-4 py-3 rounded-lg ${
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
                <Link href="/"
                  className="flex items-center px-4 py-3 text-green-200 hover:bg-green-600/50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl"><FaSignOutAlt /></span>
                  <span className="ml-4">Retour à l'accueil</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={`hidden md:flex ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-gradient-to-b from-green-700 to-green-800 text-white p-4 flex-col h-screen sticky top-0`}
      >
        <div className="flex items-center justify-between mt-4">
          {/* {!collapsed && (
            <div className="text-xl font-bold">Admin Panel</div>
          )} */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 bg-green-600 rounded"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        
        {/* User profile */}
        <div className="mt-5 flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-amber-400 flex items-center justify-center mb-2">
            <span className="text-2xl font-bold">OP</span>
          </div>
          {!collapsed && (
            <div className="text-center">
             
              <div className="text-xs text-green-300">admin@oceanepressing.com</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
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

        {/* Logout */}
        <div className="pt-4 mt-auto border-t border-green-600">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              collapsed ? 'justify-center' : 'px-4'
            } py-3 text-green-200 hover:bg-green-600/50 rounded-lg w-full text-left`}
          >
            <span className="text-xl text-red-200"><FaSignOutAlt /></span>
            {!collapsed && <span className="text-red-200 ml-4">Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto flex flex-col">
        <main className="flex-grow">
          <AdminCheck>
            {children}
          </AdminCheck>
        </main>
      </div>
    </div>
  </>
  );
}
