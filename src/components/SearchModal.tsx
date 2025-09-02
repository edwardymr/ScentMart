
import React, { useState, useEffect, useMemo } from 'react';
import { type Perfume } from '../types';
import { XMarkIcon, SearchIcon } from './icons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onViewDetails: (perfume: Perfume) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, perfumes, onViewDetails }) => {
  const [query, setQuery] = useState('');

  // Reset query when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowercasedQuery = query.toLowerCase();
    return perfumes.filter(perfume => 
      perfume.name.toLowerCase().includes(lowercasedQuery) ||
      perfume.brand.toLowerCase().includes(lowercasedQuery) ||
      perfume.olfactoryFamily.toLowerCase().includes(lowercasedQuery) ||
      (perfume.details?.description && perfume.details.description.toLowerCase().includes(lowercasedQuery))
    ).slice(0, 10); // Limit to 10 results for performance and UI
  }, [query, perfumes]);

  const handleResultClick = (perfume: Perfume) => {
    onViewDetails(perfume);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center z-50 p-4 pt-[15vh] transition-opacity duration-300 animate-fade-in" 
      role="dialog" 
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-[#224859] w-full max-w-2xl h-fit rounded-2xl shadow-2xl relative transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 rounded-full bg-black/20 hover:bg-black/40">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-6">
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input 
              type="text"
              placeholder="Busca tu perfume por nombre, marca, familia..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full bg-[#1c3a4a] border border-[#3a6a82] text-white text-lg rounded-full py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-[#DAB162]"
            />
          </div>

          {/* Results */}
          <div className="mt-4 max-h-[50vh] overflow-y-auto">
            {query && searchResults.length > 0 && (
              <ul className="space-y-2">
                {searchResults.map(perfume => (
                  <li key={perfume.id}>
                    <button 
                      onClick={() => handleResultClick(perfume)}
                      className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-[#2a556a] transition-colors text-left"
                    >
                      <img src={perfume.imageUrl} alt={perfume.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                      <div className="flex-grow">
                        <h3 className="font-bold text-white">{perfume.name}</h3>
                        <p className="text-sm text-[#DAB162]">{perfume.brand}</p>
                      </div>
                      <p className="font-semibold text-[#E86A33]">{formatCurrency(perfume.price)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {query && searchResults.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p>No se encontraron resultados para "{query}".</p>
                <p className="text-sm">Intenta con otros términos de búsqueda.</p>
              </div>
            )}
            {!query && (
                 <div className="text-center py-10 text-gray-400">
                    <p>Encuentra tu fragancia ideal al instante.</p>
                </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
        @keyframes scale-in {
          from { transform: scale(0.95) translateY(-20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
