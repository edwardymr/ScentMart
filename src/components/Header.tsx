
import React from 'react';
import { SearchIcon, UserIcon, ShoppingCartIcon } from './icons';

interface HeaderProps {
    isSticky: boolean;
    cartItemCount: number;
    onCartClick: () => void;
    logoUrl: string;
    onSearchClick: () => void;
    onNavigateToHome: () => void;
    onNavigateToShop: () => void;
    onNavigateToQuiz: () => void;
    onNavigateToBestSellers: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  isSticky, 
  cartItemCount, 
  onCartClick, 
  logoUrl, 
  onSearchClick,
  onNavigateToHome,
  onNavigateToShop,
  onNavigateToQuiz,
  onNavigateToBestSellers 
}) => {
  return (
    <header className={`z-30 sticky top-0 transition-all duration-300 ${isSticky ? 'bg-[#1c3a4a] shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 md:h-28">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={onNavigateToHome} aria-label="Ir al inicio">
              <img className="h-24 w-auto" src={logoUrl} alt="ScentMart Logo" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={onNavigateToHome} className="text-sm font-semibold hover:text-[#DAB162] transition-colors">Inicio</button>
            <button onClick={onNavigateToShop} className="text-sm font-semibold hover:text-[#DAB162] transition-colors">Tienda</button>
            <button onClick={onNavigateToQuiz} className="text-sm font-semibold hover:text-[#DAB162] transition-colors">Descubre tu Aroma</button>
            <button onClick={onNavigateToBestSellers} className="text-sm font-semibold hover:text-[#DAB162] transition-colors">Más Vendidos</button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button onClick={onSearchClick} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Abrir búsqueda">
              <SearchIcon className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Perfil de usuario">
              <UserIcon className="h-6 w-6" />
            </button>
            <button onClick={onCartClick} className="relative p-2 rounded-full hover:bg-white/10 transition-colors" aria-label={`Ver carrito de compras con ${cartItemCount} productos`}>
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-[#E86A33] text-white text-xs font-bold text-center leading-5" aria-hidden="true">
                      {cartItemCount}
                  </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
