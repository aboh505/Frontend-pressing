'use client';

import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setupAxiosInterceptors } from '../utils/auth';

export function Providers({ children }) {
  useEffect(() => {
    // Configurer les intercepteurs Axios pour l'authentification
    setupAxiosInterceptors();
  }, []);

  return (
    <>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
