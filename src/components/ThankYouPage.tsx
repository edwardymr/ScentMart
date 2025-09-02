
import React from 'react';
import { type OrderDetails } from '../types';
import { SparklesIcon, TruckIcon } from './icons';

interface ThankYouPageProps {
  order: OrderDetails | null;
  onGoToHome: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ order, onGoToHome }) => {
  if (!order) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h1 className="font-serif-display text-4xl font-bold text-[#DAB162]">Oops, algo salió mal.</h1>
        <p className="mt-2 text-lg text-gray-300">No pudimos encontrar los detalles de tu pedido.</p>
        <button
          onClick={onGoToHome}
          className="mt-8 px-8 py-3 bg-[#E86A33] text-white font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        >
          Volver al Inicio
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="bg-[#1c3a4a] p-8 rounded-lg shadow-xl text-center border border-[#3a6a82]">
        <SparklesIcon className="mx-auto h-16 w-16 text-[#DAB162]" />
        <h1 className="mt-4 font-serif-display text-4xl font-bold text-[#E86A33]">¡Gracias por tu compra!</h1>
        <p className="mt-2 text-lg text-gray-300">Hemos recibido tu pedido y ya lo estamos preparando con mucho cariño.</p>
        
        <div className="mt-6 flex items-center justify-center gap-3 text-lg bg-[#2a556a] text-green-300 p-4 rounded-lg border border-green-700/50">
            <TruckIcon className="h-8 w-8 flex-shrink-0" />
            <span className="font-semibold">Tu pedido llegará el próximo día hábil.</span>
        </div>

        <div className="text-left bg-[#2a556a] p-6 rounded-lg mt-8 border border-[#3a6a82]">
            <h2 className="text-xl font-bold text-white mb-4">Resumen del Pedido #{order.orderNumber}</h2>
            <div className="space-y-2 mb-4">
                {order.items.map(({perfume, quantity}) => (
                    <div key={perfume.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                            <img src={perfume.imageUrl} alt={perfume.name} className="w-12 h-12 rounded-md object-cover"/>
                            <div>
                                <p className="text-white">{perfume.name} <span className="text-gray-400">x {quantity}</span></p>
                            </div>
                        </div>
                        <p className="text-gray-300 font-semibold">{formatCurrency(perfume.price * quantity)}</p>
                    </div>
                ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-[#3a6a82] text-gray-300">
                <div className="flex justify-between"><span>Subtotal:</span> <span>{formatCurrency(order.subtotal)}</span></div>
                <div className="flex justify-between"><span>Envío:</span> <span>{order.shipping === 0 ? 'Gratis' : formatCurrency(order.shipping)}</span></div>
                <div className="flex justify-between font-bold text-white text-lg"><span>Total:</span> <span>{formatCurrency(order.total)}</span></div>
            </div>
             <div className="mt-4 pt-4 border-t border-[#3a6a82]">
                <p className="font-bold text-white">Enviado a:</p>
                <p className="text-gray-300">{order.customer.name}</p>
                <p className="text-gray-300">{order.customer.address}, {order.customer.city}</p>
            </div>
        </div>

        <button
          onClick={onGoToHome}
          className="mt-8 px-8 py-3 bg-[#DAB162] text-[#224859] font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
        >
          Seguir Comprando
        </button>
      </div>
    </main>
  );
};
