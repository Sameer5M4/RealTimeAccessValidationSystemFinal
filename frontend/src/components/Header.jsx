import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="text-center mb-8 sm:mb-12">
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
        <Sparkles className="w-6 h-7 sm:w-8 sm:h-8 text-yellow-400 animate-pulse" />
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white-400 to-pink-400">
         G.Pulla Reddy Engineering College 
        </h1>
        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      <p className="text-gray-300 text-lg sm:text-xl font-medium">
      Real-Time Access Validation System
      </p>
    </header>
  );
};

export default Header;