
import React, { useState, useMemo } from 'react';
import { type CartItem, type OrderDetails } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  onPlaceOrder: (orderDetails: OrderDetails) => void;
  onBackToCart: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

const CheckoutInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`w-full p-3 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162] ${props.className || ''}`}
    />
);


export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onPlaceOrder, onBackToCart }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    addressDetails: '',
    city: '',
    whatsapp: '',
    email: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.perfume.price * item.quantity, 0), [cart]);
  const shippingCost = useMemo(() => formData.city.trim().toLowerCase() === 'santa marta' ? 0 : 10000, [formData.city]);
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderDetails: OrderDetails = {
      customer: { ...formData },
      items: cart,
      subtotal,
      shipping: shippingCost,
      total,
      paymentMethod,
      orderNumber: `SM-${Date.now()}`
    };
    onPlaceOrder(orderDetails);
  };
  
  if (cart.length === 0) {
     return (
       <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <h1 className="font-serif-display text-4xl font-bold text-[#DAB162]">No hay nada que procesar</h1>
        <p className="mt-2 text-lg text-gray-300">Tu carrito está vacío. Añade productos para poder finalizar la compra.</p>
        <button onClick={onBackToCart} className="mt-8 px-6 py-2 bg-[#DAB162] text-[#224859] rounded-full">Volver al Carrito</button>
      </main>
     )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <button onClick={onBackToCart} className="text-sm text-[#DAB162] hover:underline mb-4">
            &larr; Volver al carrito
        </button>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Form */}
            <div className="bg-[#1c3a4a] p-8 rounded-lg shadow-lg space-y-6">
                {/* Delivery Info */}
                <section>
                    <h2 className="font-serif-display text-2xl font-bold text-[#DAB162] mb-4">Información de Entrega</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <CheckoutInput name="name" placeholder="Nombre Completo" value={formData.name} onChange={handleInputChange} required />
                        <CheckoutInput name="address" placeholder="Dirección de entrega" value={formData.address} onChange={handleInputChange} required />
                        <CheckoutInput name="addressDetails" placeholder="Detalles adicionales (Apto, casa, referencia)" value={formData.addressDetails} onChange={handleInputChange} />
                        <CheckoutInput name="city" placeholder="Ciudad" value={formData.city} onChange={handleInputChange} required />
                        <CheckoutInput name="whatsapp" placeholder="Número de WhatsApp" type="tel" value={formData.whatsapp} onChange={handleInputChange} required />
                        <CheckoutInput name="email" placeholder="Correo electrónico" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                </section>

                {/* Payment Method */}
                <section>
                    <h2 className="font-serif-display text-2xl font-bold text-[#DAB162] mb-4">Elige cómo quieres pagar</h2>
                    <div className="space-y-4">
                        <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#E86A33] bg-[#2a556a]' : 'border-[#3a6a82] bg-[#1c3a4a]'}`}>
                            <div className="flex items-center">
                                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="h-5 w-5 text-[#E86A33] bg-transparent border-[#3a6a82] focus:ring-[#E86A33]"/>
                                <div className="ml-4">
                                    <p className="font-bold text-white">Pagar al Recibir (Contra Entrega)</p>
                                    <p className="text-sm text-gray-400">¡Paga en efectivo o con datáfono cuando el mensajero llegue a tu puerta! Válido para Santa Marta.</p>
                                </div>
                            </div>
                        </label>
                         <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#E86A33] bg-[#2a556a]' : 'border-[#3a6a82] bg-[#1c3a4a]'}`}>
                            <div className="flex items-center">
                                <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-5 w-5 text-[#E86A33] bg-transparent border-[#3a6a82] focus:ring-[#E86A33]"/>
                                <div className="ml-4">
                                    <p className="font-bold text-white">Pago seguro con Tarjeta de Crédito/Débito</p>
                                </div>
                            </div>
                            {paymentMethod === 'card' && (
                                <div className="mt-4 p-4 bg-[#1c3a4a] rounded-md">
                                    <p className="text-center text-gray-400">La integración con la pasarela de pagos estará disponible próximamente.</p>
                                </div>
                            )}
                        </label>
                    </div>
                </section>
            </div>
            
            {/* Right Column: Summary */}
            <div className="lg:sticky top-32">
                <div className="bg-[#1c3a4a] p-6 rounded-lg shadow-lg border border-[#3a6a82]">
                    <h2 className="text-xl font-bold text-white border-b border-[#3a6a82] pb-3 mb-4">Resumen de la Compra</h2>
                    <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                        {cart.map(({perfume, quantity}) => (
                            <div key={perfume.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <img src={perfume.imageUrl} alt={perfume.name} className="w-12 h-12 rounded-md object-cover"/>
                                    <div>
                                        <p className="text-white">{perfume.name}</p>
                                        <p className="text-gray-400">Cantidad: {quantity}</p>
                                    </div>
                                </div>
                                <p className="text-gray-300 font-semibold">{formatCurrency(perfume.price * quantity)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3 mt-4 pt-4 border-t border-[#3a6a82] text-gray-300">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Envío</span>
                            <span className="font-semibold">{shippingCost === 0 ? 'Gratis' : formatCurrency(shippingCost)}</span>
                        </div>
                    </div>
                    <div className="border-t border-[#3a6a82] mt-4 pt-4">
                        <div className="flex justify-between items-baseline font-bold text-white text-xl">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
                 <button
                    type="submit"
                    className="mt-6 w-full px-8 py-4 bg-[#E86A33] text-white font-bold text-lg rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
                    disabled={paymentMethod === 'card'} // Disable card payment for now
                >
                    {paymentMethod === 'cod' ? 'Confirmar Mi Pedido' : 'Pagar Ahora'}
                </button>
            </div>
        </form>
    </main>
  );
};
