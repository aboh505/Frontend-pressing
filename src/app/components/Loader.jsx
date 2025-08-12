'use client';

import React, { useEffect, useState } from 'react';

export default function Loader() {
  const [dots, setDots] = useState('.');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '.';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white-600 z-50">
      <div className="text-center">
        <img 
          src="/logo.svg" 
          alt="Océane Pressing"
          width={'600'} height={'500'}
          className="w-100 h-40 object-contain mb-4"
        />
      
        <div className="text-green text-xl mt-4">
          Chargement.<span className="dots-animation">{dots}</span>
        </div>
      </div>
      <style jsx>{`
        .dots-animation {
          display: inline-block;
          min-width: 30px;
          text-align: left;
        }
      `}</style>
    </div>
  );
}
