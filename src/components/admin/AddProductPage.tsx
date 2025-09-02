
import React, { useState } from 'react';
import { type Perfume } from '../../types';
import { ImageUploader } from './ImageUploader';
import { ArrowLeftIcon } from '../icons';

interface AddProductPageProps {
    onSave: (perfume: Perfume) => void;
    onCancel: () => void;
}

const initialPerfumeState: Omit<Perfume, 'id'> = {
    name: '',
    brand: '',
    volume: '',
    price: 0,
    originalPrice: undefined,
    stock: 0,
    imageUrl: '',
    images: [],
    gender: 'Unisex',
    olfactoryFamily: 'Aromático',
    sku: '',
    details: {
        description: '',
        olfactoryNotes: '',
        concept: '',
        applicationPoint: '',
    },
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-[#224859] p-6 rounded-lg shadow-lg border border-[#3a6a82]">
        <h2 className="text-xl font-bold text-white mb-4 border-b border-[#3a6a82] pb-2">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-bold text-[#DAB162] mb-1">{label}</label>
        {children}
    </div>
);

const AdminInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input
        {...props}
        className="w-full p-2 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162]"
    />
);

const AdminTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea
        {...props}
        rows={4}
        className="w-full p-2 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162]"
    />
);


export const AddProductPage: React.FC<AddProductPageProps> = ({ onSave, onCancel }) => {
    const [perfume, setPerfume] = useState<Omit<Perfume, 'id'>>(initialPerfumeState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setPerfume(prev => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: value
                }
            }));
        } else {
            setPerfume(prev => ({
                ...prev,
                [name]: isNumber ? (value === '' ? undefined : Number(value)) : value
            }));
        }
    };
    
    const handleImageChange = (mainImageUrl: string, allImages: string[]) => {
        setPerfume(prev => ({
            ...prev,
            imageUrl: mainImageUrl,
            images: allImages,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (!perfume.name || perfume.price <= 0 || perfume.stock < 0 || !perfume.imageUrl) {
            alert("Por favor, completa los campos obligatorios: Nombre, Precio, Stock e Imagen Principal.");
            return;
        }
        onSave(perfume as Perfume);
    };

    return (
        <div>
            <button onClick={onCancel} className="flex items-center gap-2 text-[#DAB162] hover:underline mb-6">
                <ArrowLeftIcon className="h-4 w-4" />
                Volver al Catálogo
            </button>
            <h1 className="text-3xl font-serif-display font-bold text-[#DAB162] mb-8">Añadir Nuevo Producto</h1>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <Section title="Información Esencial">
                    <FormField label="Nombre del Producto (obligatorio)">
                        <AdminInput name="name" value={perfume.name} onChange={handleInputChange} required />
                    </FormField>
                    <FormField label="Marca">
                        <AdminInput name="brand" value={perfume.brand} onChange={handleInputChange} />
                    </FormField>
                    <FormField label="Descripción Detallada">
                        <AdminTextArea name="details.description" value={perfume.details?.description} onChange={handleInputChange} />
                    </FormField>
                </Section>

                <Section title="Precios e Inventario">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FormField label="Precio Base (obligatorio)">
                            <AdminInput name="price" type="number" value={perfume.price} onChange={handleInputChange} required min="0" />
                        </FormField>
                        <FormField label="Precio con Descuento (opcional)">
                            <AdminInput name="originalPrice" type="number" value={perfume.originalPrice || ''} onChange={handleInputChange} placeholder="Ej: 80000" min="0" />
                        </FormField>
                        <FormField label="SKU (Código de Producto)">
                            <AdminInput name="sku" value={perfume.sku} onChange={handleInputChange} />
                        </FormField>
                         <FormField label="Cantidad en Stock (obligatorio)">
                            <AdminInput name="stock" type="number" value={perfume.stock} onChange={handleInputChange} required min="0" />
                        </FormField>
                    </div>
                </Section>
                
                <Section title="Imágenes del Producto">
                   <ImageUploader onChange={handleImageChange} />
                </Section>

                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} className="px-6 py-3 bg-gray-600 text-white font-bold rounded-full shadow-lg hover:bg-gray-500">
                        Cancelar
                    </button>
                     <button type="submit" className="px-8 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-500">
                        Guardar Producto
                    </button>
                </div>
            </form>
        </div>
    );
};
