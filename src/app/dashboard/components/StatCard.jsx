'use client';

import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const StatCard = ({ title, value, icon, change, trend }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg transition-transform hover:scale-105">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm text-gray-600 font-medium">{title}</h3>
        <div className="p-2 rounded-full bg-gray-100">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {trend === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                {change}
              </span>
              <span className="text-xs text-gray-500 ml-1">ce mois</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;