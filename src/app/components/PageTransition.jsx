'use client';

import React, { useState, useEffect } from 'react';
import Loader from './Loader';

export default function PageTransition({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un temps de chargement minimum pour voir le loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 secondes de chargement minimum
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? <Loader /> : children}
    </>
  );
}
