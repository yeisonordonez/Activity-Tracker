import React from 'react';
import { Clock } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8 px-4 shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 header-bg-pattern opacity-30" />
      
      <div className="container mx-auto flex items-center relative z-10">
        <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm mr-4">
          <Clock className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-clip-text">Activity Time Tracker</h1>
          <p className="text-white/80 text-lg">Track your work with precision and style</p>
        </div>
      </div>
    </header>
  );
};

export default Header;