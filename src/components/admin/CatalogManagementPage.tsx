
import React from 'react';
import { type Perfume } from '../../types';
import { PlusIcon, ArrowPathIcon } from '../icons';

interface CatalogManagementPageProps {
    perfumes: Perfume[];
    onAddProduct: () => void;
    onEditProduct: (perfume: Perfume) => void;
    onOpenSyncModal: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
};

export const CatalogManagementPage: React.FC<CatalogManagementPageProps> = ({ perfumes, onAddProduct, onEditProduct, onOpenSyncModal }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif-display font-bold text-[#DAB162]">Gestión de Catálogo</h1>
                 <div className="flex gap-4">
                    <button
                        onClick={onOpenSyncModal}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-500 transition-transform transform hover:scale-105"
                    >
                        <ArrowPathIcon className="h-5 w-5" />
                        Sincronizar Catálogo
                    </button>
                    <button
                        onClick={onAddProduct}
                        className="flex items-center gap-2 px-6 py-3 bg-[#E86A33] text-white font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Añadir Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="bg-[#224859] rounded-lg shadow-lg overflow-hidden border border-[#3a6a82]">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-[#2a556a] text-sm text-[#DAB162] uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Imagen</th>
                            <th className="p-4">Nombre</th>
                            <th className="p-4">Marca</th>
                            <th className="p-4">SKU</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3a6a82]">
                        {perfumes.map(perfume => (
                            <tr key={perfume.id} className="hover:bg-[#2a556a]/50">
                                <td className="p-4">
                                    <img src={perfume.imageUrl} alt={perfume.name} className="w-16 h-16 object-cover rounded-md" />
                                </td>
                                <td className="p-4 font-semibold text-white">{perfume.name}</td>
                                <td className="p-4">{perfume.brand}</td>
                                <td className="p-4">{perfume.sku || 'N/A'}</td>
                                <td className="p-4 font-semibold text-[#E86A33]">{formatCurrency(perfume.price)}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${perfume.stock > 0 ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                                        {perfume.stock > 0 ? `${perfume.stock} en Stock` : 'Agotado'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => onEditProduct(perfume)}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-500"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {perfumes.length === 0 && (
                    <div className="text-center p-8 text-gray-400">
                        <p>No hay productos en el catálogo. ¡Añade el primero!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
