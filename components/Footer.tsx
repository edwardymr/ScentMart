
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1c3a4a]">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} ScentMart Perfumes. Todos los derechos reservados.</p>
        <p className="text-sm mt-1">Una experiencia olfativa única.</p>
      </div>
    </footer>
  );
};
