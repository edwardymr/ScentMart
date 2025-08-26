import React, { useMemo } from 'react';
import { Perfume } from '../types';
import { StarIcon, ShoppingCartIcon } from './icons';

// --- Internal StarRating Component ---
interface StarRatingProps {
    rating: number;
    reviewCount: number;
}
const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount }) => {
    return (
        <div className="flex items-center">
            <div className="flex">
                {[...Array(5)].map((_, index) => (
                    <StarIcon 
                        key={index} 
                        className={`h-5 w-5 ${rating > index ? 'text-[#DAB162]' : 'text-gray-600'}`}
                    />
                ))}
            </div>
            {reviewCount > 0 && <span className="ml-2 text-sm text-gray-400">({reviewCount})</span>}
        </div>
    );
};

// --- Internal BestSellerCard Component ---
interface BestSellerCardProps {
    perfume: Perfume;
    onViewDetails: (perfume: Perfume) => void;
}
const BestSellerCard: React.FC<BestSellerCardProps> = ({ perfume, onViewDetails }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="flex-shrink-0 w-2/3 sm:w-[45%] md:w-1/3 p-2 snap-start">
             <div 
                onClick={() => onViewDetails(perfume)}
                className="group relative overflow-hidden rounded-lg shadow-lg bg-[#2a556a] transition-transform transform hover:-translate-y-1 flex flex-col h-full border border-[#DAB162]/30 cursor-pointer"
             >
                <img src={perfume.imageUrl} alt={perfume.name} className="w-full h-56 object-cover" />
                <div className="p-4 flex flex-col flex-1">
                    <div className="flex-1 mb-3">
                        <h3 className="font-serif-display text-lg font-bold text-white leading-tight truncate" title={perfume.name}>{perfume.name}</h3>
                        <p className="text-xs text-[#DAB162] font-semibold mt-1">{perfume.brand}</p>
                        {perfume.rating && perfume.reviewCount && (
                             <div className="mt-2">
                                <StarRating rating={perfume.rating} reviewCount={perfume.reviewCount} />
                            </div>
                        )}
                    </div>
                    <div className="flex items-baseline justify-between mt-auto">
                        <div>
                            <p className="text-md font-semibold text-[#E86A33]">{formatCurrency(perfume.price)}</p>
                             {perfume.originalPrice && perfume.originalPrice > perfume.price && (
                                <p className="text-xs text-gray-400 line-through">{formatCurrency(perfume.originalPrice)}</p>
                            )}
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log(`${perfume.name} added to cart`);
                            }}
                            className="p-2 bg-[#E86A33] text-white rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform scale-0 group-hover:scale-100"
                            aria-label={`Añadir ${perfume.name} al carrito`}
                        >
                            <ShoppingCartIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main Exported BestSellers Component ---
interface BestSellersProps {
    perfumes: Perfume[];
    onViewDetails: (perfume: Perfume) => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({ perfumes, onViewDetails }) => {
    const bestSellers = useMemo(() => {
        const fallbackNames = ["D'orsay", "Nitro", "Vibranza", "You"];
        
        const sortedBySales = [...perfumes]
          .filter(p => p.sales && p.sales > 0)
          .sort((a, b) => (b.sales || 0) - (a.sales || 0));

        if (sortedBySales.length >= 4) {
            return sortedBySales.slice(0, 4);
        }
        
        // Fallback logic if not enough sales data
        const fallbackPerfumes = perfumes.filter(p => fallbackNames.includes(p.name));
        return fallbackPerfumes.slice(0, 4);

    }, [perfumes]);

    if (bestSellers.length === 0) {
        return null;
    }

    return (
        <section className="py-16 sm:py-24 bg-[#224859]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
                     <h2 className="text-3xl font-serif-display font-bold text-[#DAB162]">Las Joyas de la Corona</h2>
                     <p className="mt-2 text-lg text-gray-300 max-w-2xl mx-auto">
                        Descubre por qué estas fragancias han cautivado a miles de nuestros clientes.
                    </p>
                </div>
                <div className="flex overflow-x-auto snap-x snap-mandatory slider-container pl-4 sm:pl-6 lg:pl-8">
                    {bestSellers.map(perfume => (
                        <BestSellerCard key={perfume.id} perfume={perfume} onViewDetails={onViewDetails} />
                    ))}
                     <div className="flex-shrink-0 w-1 snap-start"></div>
                </div>
            </div>
        </section>
    );
};