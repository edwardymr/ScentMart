import React from 'react';
import { type Perfume } from '../types';

interface PerfumeCardProps {
  perfume: Perfume;
  onViewDetails: (perfume: Perfume) => void;
  isAdmin: boolean;
  onAddToCart: (perfume: Perfume) => void;
}

export const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume, onViewDetails, isAdmin, onAddToCart }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div 
      onClick={() => onViewDetails(perfume)}
      className="group relative overflow-hidden rounded-lg shadow-lg bg-[#2a556a] transition-transform transform hover:-translate-y-2 flex flex-col border border-[#DAB162]/30 cursor-pointer"
    >
      <div 
        className="relative"
      >
        <img src={perfume.imageUrl} alt={perfume.name} className="w-full h-72 object-cover" />
        {perfume.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-lg font-bold border-2 border-white rounded-md px-4 py-2 uppercase tracking-wider">Agotado</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
            <h3 className="font-serif-display text-xl font-bold text-white leading-tight" title={perfume.name}>{perfume.name}</h3>
            <p className="text-sm text-[#DAB162] font-semibold mt-1">{perfume.brand}</p>
            <span className="mt-2 inline-block bg-[#1c3a4a] text-[#DAB162] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{perfume.olfactoryFamily}</span>
        </div>
        <div className="flex items-baseline mt-2">
          <p className="text-lg font-semibold text-[#E86A33]">{formatCurrency(perfume.price)}</p>
          {perfume.originalPrice && perfume.originalPrice > perfume.price && (
            <p className="ml-2 text-sm text-gray-400 line-through">{formatCurrency(perfume.originalPrice)}</p>
          )}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {perfume.stock > 0 && !isAdmin && (
            <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(perfume);
                }}
                className="px-6 py-2 bg-[#E86A33] text-white font-semibold rounded-full shadow-lg hover:bg-opacity-90"
            >
                Añadir al Carrito
            </button>
        )}
        {isAdmin && (
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(perfume);
                }}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-500"
            >
                Editar Producto
            </button>
        )}
      </div>
    </div>
  );
};
