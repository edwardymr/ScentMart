
import React from 'react';
import {type CartItem } from '../types';
import { TrashIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from './icons';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (perfumeId: number, newQuantity: number) => void;
  onRemoveItem: (perfumeId: number) => void;
  onGoToCheckout: () => void;
  onGoToShop: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const CartPage: React.FC<CartPageProps> = ({ cart, onUpdateQuantity, onRemoveItem, onGoToCheckout, onGoToShop }) => {
  const subtotal = cart.reduce((acc, item) => acc + item.perfume.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <ShoppingCartIcon className="mx-auto h-24 w-24 text-[#3a6a82]" />
        <h1 className="mt-4 font-serif-display text-4xl font-bold text-[#DAB162]">Tu carrito está vacío</h1>
        <p className="mt-2 text-lg text-gray-300">Parece que aún no has añadido ninguna fragancia. ¡Explora nuestro catálogo para encontrar tu aroma ideal!</p>
        <button
          onClick={onGoToShop}
          className="mt-8 px-8 py-3 bg-[#E86A33] text-white font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        >
          Ir a la Tienda
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="font-serif-display text-4xl font-bold text-[#DAB162] mb-8">Mi Carrito de Compras</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 bg-[#1c3a4a] p-6 rounded-lg shadow-lg">
          <div className="space-y-4">
            {cart.map(({ perfume, quantity }) => (
              <div key={perfume.id} className="flex flex-col sm:flex-row items-center gap-4 border-b border-[#3a6a82] pb-4 last:border-b-0">
                <img src={perfume.imageUrl} alt={perfume.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow text-center sm:text-left">
                  <h2 className="font-bold text-lg text-white">{perfume.name}</h2>
                  <p className="text-sm text-gray-400">{perfume.brand}</p>
                  <p className="sm:hidden text-md font-semibold text-[#E86A33] mt-1">{formatCurrency(perfume.price)}</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-[#3a6a82] rounded-full">
                    <button onClick={() => onUpdateQuantity(perfume.id, quantity - 1)} className="p-2 text-gray-300 hover:text-white"><MinusIcon className="w-4 h-4" /></button>
                    <span className="px-3 text-lg font-bold">{quantity}</span>
                    <button onClick={() => onUpdateQuantity(perfume.id, quantity + 1)} className="p-2 text-gray-300 hover:text-white"><PlusIcon className="w-4 h-4" /></button>
                  </div>
                  {/* Price and Subtotal */}
                  <div className="hidden sm:block w-28 text-right">
                    <p className="text-md font-semibold text-[#E86A33]">{formatCurrency(perfume.price)}</p>
                    <p className="text-sm text-gray-300 font-bold">{formatCurrency(perfume.price * quantity)}</p>
                  </div>
                  {/* Remove Button */}
                  <button onClick={() => onRemoveItem(perfume.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 sticky top-32">
          <div className="bg-[#1c3a4a] p-6 rounded-lg shadow-lg border border-[#3a6a82]">
            <h2 className="text-xl font-bold text-white border-b border-[#3a6a82] pb-3">Resumen del Pedido</h2>
            <div className="space-y-3 mt-4 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span className="text-sm">Calculado en el siguiente paso</span>
              </div>
            </div>
            <div className="border-t border-[#3a6a82] mt-4 pt-4">
              <div className="flex justify-between items-baseline font-bold text-white text-lg">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
            </div>
            <button
              onClick={onGoToCheckout}
              className="mt-6 w-full px-8 py-3 bg-[#E86A33] text-white font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
