import React, { useState, useEffect } from 'react';
import { type Perfume, type OlfactoryFamily } from '../types';
import { XMarkIcon, ShoppingCartIcon, TruckIcon } from './icons';

interface PerfumeDetailModalProps {
  perfume: Perfume;
  onClose: () => void;
  onUpdate: (perfume: Perfume) => void;
  isAdmin: boolean;
  onAddToCart: (perfume: Perfume) => void;
}

const AdminInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className={`w-full p-2 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162] ${props.className || ''}`}
    />
);

const AdminTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        className="w-full p-2 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162] min-h-[80px]"
    />
);

const AdminSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select
        {...props}
        className="w-full p-2 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162]"
    >
        {props.children}
    </select>
);

const olfactoryFamilies: OlfactoryFamily[] = ['Floral', 'Oriental', 'Amaderado', 'Cítrico', 'Aromático'];

export const PerfumeDetailModal: React.FC<PerfumeDetailModalProps> = ({ perfume, onClose, onUpdate, isAdmin, onAddToCart }) => {
  const [editedPerfume, setEditedPerfume] = useState<Perfume>(perfume);

  useEffect(() => {
    setEditedPerfume(perfume);
  }, [perfume]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedPerfume(prev => ({ ...prev, [name]: name === 'price' || name === 'originalPrice' || name === 'stock' ? Number(value) : value }));
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPerfume(prev => ({
      ...prev,
      details: {
        ...prev.details!,
        [name]: value,
      }
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedPerfume(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    onUpdate(editedPerfume);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in" role="dialog" aria-modal="true" onClick={onClose}>
      <div 
        className="bg-[#2a556a] border border-[#3a6a82] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-95 animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 rounded-full bg-black/20 hover:bg-black/40">
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          <div>
            <div className="w-full h-80 md:h-[350px] rounded-lg overflow-hidden mb-4">
                <img src={editedPerfume.imageUrl} alt={editedPerfume.name} className="w-full h-full object-cover" />
            </div>
            {isAdmin && (
                <div className="space-y-3">
                     <div>
                        <label className="text-sm font-bold text-[#DAB162]">Subir Imagen</label>
                        <AdminInput type="file" accept="image/*" onChange={handleImageFileChange} />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-[#DAB162]">o Pegar URL de Imagen</label>
                        <AdminInput type="text" name="imageUrl" value={editedPerfume.imageUrl} onChange={handleInputChange} />
                    </div>
                     <div>
                        <label className="text-sm font-bold text-[#DAB162]">URL Oficial</label>
                        <AdminInput type="text" name="officialUrl" value={editedPerfume.officialUrl || ''} onChange={handleInputChange} />
                    </div>
                </div>
            )}
          </div>
          
          <div className="flex flex-col">
            {isAdmin ? (
                <AdminInput type="text" name="name" value={editedPerfume.name} onChange={handleInputChange} className="font-serif-display text-3xl lg:text-4xl font-bold !p-0 !bg-transparent !border-0 text-[#DAB162]" />
            ) : (
                <h2 className="font-serif-display text-3xl lg:text-4xl font-bold text-[#DAB162] leading-tight">{perfume.name}</h2>
            )}

            {isAdmin ? (
                <div className='grid grid-cols-2 md:grid-cols-3 gap-3 mt-2'>
                    <div>
                        <label className="text-sm font-bold text-[#DAB162]">Marca</label>
                        <AdminInput type="text" name="brand" value={editedPerfume.brand} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-[#DAB162]">Volumen</label>
                        <AdminInput type="text" name="volume" value={editedPerfume.volume || ''} onChange={handleInputChange} placeholder="e.g., 100 ml" />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-[#DAB162]">Género</label>
                        <AdminSelect name="gender" value={editedPerfume.gender} onChange={handleInputChange}>
                            <option value="Mujer">Mujer</option>
                            <option value="Hombre">Hombre</option>
                            <option value="Unisex">Unisex</option>
                        </AdminSelect>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-sm font-bold text-[#DAB162]">Familia Olfativa</label>
                       <AdminSelect name="olfactoryFamily" value={editedPerfume.olfactoryFamily} onChange={handleInputChange}>
                            {olfactoryFamilies.map(family => <option key={family} value={family}>{family}</option>)}
                        </AdminSelect>
                    </div>
                </div>
            ) : (
                 <div className="flex items-center mt-1 gap-3 flex-wrap">
                    <p className="text-lg text-[#DAB162] font-semibold">{perfume.brand}</p>
                    {perfume.volume && <p className="text-md text-gray-400 border-l border-gray-500 pl-3">{perfume.volume}</p>}
                    <span className="px-3 py-1 text-xs font-bold bg-[#1c3a4a] text-[#DAB162] rounded-full uppercase tracking-wider">{perfume.gender}</span>
                    <span className="px-3 py-1 text-xs font-bold bg-[#1c3a4a] text-[#DAB162] rounded-full uppercase tracking-wider">{perfume.olfactoryFamily}</span>
                </div>
            )}
            
            <div className="flex items-baseline mt-4">
                {isAdmin ? (
                    <div className='flex items-center gap-2'>
                        <AdminInput type="number" name="price" value={editedPerfume.price} onChange={handleInputChange} />
                        <AdminInput type="number" name="originalPrice" value={editedPerfume.originalPrice} onChange={handleInputChange} />
                    </div>
                ): (
                    <>
                        <p className="text-3xl font-semibold text-[#E86A33]">{formatCurrency(perfume.price)}</p>
                        {perfume.originalPrice && perfume.originalPrice > perfume.price && (
                            <p className="ml-3 text-lg text-gray-400 line-through">{formatCurrency(perfume.originalPrice)}</p>
                        )}
                    </>
                )}
            </div>
            
            {!isAdmin && (
              <div className="mt-4 flex items-center gap-2 text-sm bg-green-900/40 text-green-300 p-3 rounded-lg border border-green-700/50">
                  <TruckIcon className="h-6 w-6 flex-shrink-0" />
                  <span>
                      <strong>¡Envío gratis a Santa Marta!</strong>
                  </span>
              </div>
            )}

            <div className="mt-2">
                {isAdmin ? (
                    <div className='flex items-center gap-2'>
                        <label className='font-bold'>Stock:</label>
                        <AdminInput type="number" name="stock" value={editedPerfume.stock} onChange={handleInputChange} />
                    </div>
                ) : (
                    perfume.stock > 0 ? (
                        <p className="text-green-400">En stock: {perfume.stock} unidades</p>
                    ) : (
                        <p className="text-red-400">Agotado</p>
                    )
                )}
            </div>

            {!isAdmin && (
                <div className="mt-6 flex flex-col gap-3">
                    <button 
                    onClick={() => onAddToCart(perfume)}
                    disabled={perfume.stock === 0}
                    className="w-full flex items-center justify-center px-6 py-3 bg-[#E86A33] text-white font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                    >
                    <ShoppingCartIcon className="h-6 w-6 mr-2" />
                    Añadir al Carrito
                    </button>
                    {perfume.officialUrl && (
                        <a 
                            href={perfume.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center px-6 py-3 bg-transparent border border-[#DAB162] text-[#DAB162] font-bold rounded-full shadow-lg hover:bg-[#DAB162]/10 transition-colors"
                        >
                            Ver en Tienda Oficial
                        </a>
                    )}
                </div>
            )}

            {perfume.details && (
                <div className="mt-8 space-y-4 border-t border-[#3a6a82] pt-6 text-gray-300">
                    <div>
                        <h4 className="font-bold text-lg text-[#DAB162]">Descripción</h4>
                        {isAdmin ? (
                           <AdminTextArea name="description" value={editedPerfume.details?.description || ''} onChange={handleDetailsChange} />
                        ) : (
                            <p className="mt-1">{perfume.details.description}</p>
                        )}
                    </div>
                     <div>
                        <h4 className="font-bold text-lg text-[#DAB162]">Notas Olfativas</h4>
                        {isAdmin ? <AdminTextArea name="olfactoryNotes" value={editedPerfume.details?.olfactoryNotes || ''} onChange={handleDetailsChange} /> : <p className="mt-1">{perfume.details.olfactoryNotes}</p>}
                    </div>
                     <div>
                        <h4 className="font-bold text-lg text-[#DAB162]">Concepto</h4>
                        {isAdmin ? <AdminTextArea name="concept" value={editedPerfume.details?.concept || ''} onChange={handleDetailsChange} /> : <p className="mt-1">{perfume.details.concept}</p>}
                    </div>
                     <div>
                        <h4 className="font-bold text-lg text-[#DAB162]">¿Dónde aplicar el perfume?</h4>
                         {isAdmin ? <AdminInput name="applicationPoint" value={editedPerfume.details?.applicationPoint || ''} onChange={handleDetailsChange} /> : <p className="mt-1">{perfume.details.applicationPoint}</p>}
                    </div>
                </div>
            )}
             {isAdmin && (
                <div className="mt-8">
                    <button 
                        onClick={handleSaveChanges}
                        className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-500 transition-colors"
                    >
                    Guardar Cambios
                    </button>
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
            animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
