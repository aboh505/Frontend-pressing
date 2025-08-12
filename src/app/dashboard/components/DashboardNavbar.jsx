'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUser, FaBell, FaSignOutAlt, FaBars, FaSearch } from 'react-icons/fa';

export default function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10 px-4 py-2.5 sm:px-6">
      <div className="flex justify-between items-center">
         <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="Océane Pressing" 
              width={120} 
              height={80} 
              className="h-12 w-auto" 
            />
          </Link>
        {/* Logo et titre mobile */}
        <div className="flex items-center md:hidden">
          <FaBars className="text-gray-500 hover:text-green-600 cursor-pointer" />
          <span className="text-xl font-semibold ml-2 text-green-700">Dashboard</span>
        </div>
        
        {/* Titre pour desktop */}
        <div className="hidden md:flex">
          <span className="text-xl font-semibold text-green-700">
            {pathname === '/dashboard' && 'Tableau de bord'}
            {pathname === '/dashboard/orders' && 'Gestion des Commandes'}
            {pathname === '/dashboard/clients' && 'Gestion des Clients'}
            {pathname === '/dashboard/employees' && 'Gestion des Employés'}
            {pathname === '/dashboard/services' && 'Types de Services'}
            {pathname === '/dashboard/reports' && 'Rapports'}
            {pathname === '/dashboard/settings' && 'Paramètres'}
          </span>
        </div>
        
        {/* Recherche et actions */}
        <div className="flex items-center space-x-4">
          {/* <div className="hidden md:flex relative">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-10 pr-4 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div> */}
          
          {/* <Link href="/dashboard/notifications" className="text-gray-600 hover:text-green-600 relative">
            <FaBell size={20} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </Link> */}
          
          <div className="relative">
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center cursor-pointer"
            >
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                <FaUser size={14} />
              </div>
              <span className="ml-2 font-medium text-sm hidden md:inline">Admin</span>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-20">
              
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
