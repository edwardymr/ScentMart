
import React from 'react';
import { AdminIcon } from './icons';

interface FooterProps {
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isAdmin, onToggleAdmin }) => {
  return (
    <footer className="bg-[#1c3a4a]">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-gray-400">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} ScentMart Perfumes. Todos los derechos reservados.</p>
            <p className="text-sm mt-1">Una experiencia olfativa única.</p>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="font-semibold hover:text-[#DAB162] transition-colors">Nosotros</a>
            <button 
              onClick={onToggleAdmin} 
              className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isAdmin ? 'text-red-500' : ''}`}
              title="Modo Administrador"
            >
              <AdminIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
