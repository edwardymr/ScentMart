
import React from 'react';
import { Perfume } from '../types';

interface PerfumeCardProps {
  perfume: Perfume;
  onViewDetails: (perfume: Perfume) => void;
  isAdmin: boolean;
}

export const PerfumeCard: React.FC<PerfumeCardProps> = ({ perfume, onViewDetails, isAdmin }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div 
      className="group relative overflow-hidden rounded-lg shadow-lg bg-[#2a556a] transition-transform transform hover:-translate-y-2 flex flex-col border border-[#DAB162]/30"
    >
      <div 
        className="relative cursor-pointer"
        onClick={() => onViewDetails(perfume)}
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
                // Add to cart logic here
                console.log(`${perfume.name} added to cart`);
                }}
                className="px-6 py-2 bg-[#E86A33] text-white font-semibold rounded-full shadow-lg hover:bg-opacity-90"
            >
                Añadir al Carrito
            </button>
        )}
        {isAdmin && (
            <button 
                onClick={() => onViewDetails(perfume)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-500"
            >
                Editar Producto
            </button>
        )}
      </div>
    </div>
  );
};