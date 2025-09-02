import React, { useState } from 'react';
import { type Perfume } from '../../types';
// FIX: Replaced non-existent 'ArrowDownTrayIcon' with 'DownloadIcon'.
import { ClipboardDocumentIcon, DownloadIcon } from '../icons';

interface IntegrationsPageProps {
    perfumes: Perfume[];
}

const generateCSVFeed = (products: Perfume[]): string => {
    const header = [
        'id', 'title', 'description', 'availability', 'condition', 'price',
        'link', 'image_link', 'brand', 'google_product_category'
    ].join(',');

    const rows = products.map(p => {
        // Helper to escape CSV values
        const escapeCSV = (value: string | number | undefined) => {
            if (value === undefined || value === null) return '';
            const str = String(value);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };
        
        const id = p.sku || p.id;
        const title = escapeCSV(p.name);
        const description = escapeCSV(p.details?.description || 'Una fragancia exquisita de ScentMart.');
        const availability = p.stock > 0 ? 'in stock' : 'out of stock';
        const condition = 'new';
        const price = `${p.price} COP`;
        // This is a placeholder as we don't have a live site with individual product pages yet.
        const link = p.officialUrl || `https://scentmart-demo.com/product/${p.id}`; 
        const image_link = p.imageUrl;
        const brand = escapeCSV(p.brand);
        // A generic category is often required for Meta Commerce.
        const google_product_category = 'Health & Beauty > Personal Care > Cosmetics > Perfume & Cologne';

        return [id, title, description, availability, condition, price, link, image_link, brand, google_product_category].join(',');
    });

    return [header, ...rows].join('\n');
};


export const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ perfumes }) => {
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [copySuccess, setCopySuccess] = useState('');

    // This URL is a stable placeholder. In a real backend, this would be a live endpoint.
    const feedUrl = `${window.location.origin}/feeds/meta-catalog.csv`;

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(feedUrl).then(() => {
            setCopySuccess('¡URL copiada!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Error al copiar.');
            setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    const handleForceUpdate = () => {
        const csvContent = generateCSVFeed(perfumes);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'meta_catalog_feed.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLastUpdated(new Date());
    };

    return (
        <div>
            <h1 className="text-3xl font-serif-display font-bold text-[#DAB162] mb-2">Sincronización con Meta</h1>
            <p className="text-lg text-gray-300 mb-8">Mantén tu catálogo de Facebook e Instagram siempre actualizado.</p>
            
            <div className="bg-[#224859] p-8 rounded-lg shadow-lg border border-[#3a6a82] space-y-6 max-w-3xl mx-auto">
                <div>
                    <h2 className="text-xl font-bold text-white">URL del Feed de Datos</h2>
                    <p className="text-gray-400 mt-1 mb-4">
                        Copia este enlace y pégalo en la sección 'Fuentes de datos' de tu Meta Commerce Manager. Meta actualizará tu catálogo automáticamente una vez al día.
                    </p>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={feedUrl}
                            readOnly
                            className="w-full p-3 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DAB162]"
                        />
                        <button 
                            onClick={handleCopyUrl}
                            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#DAB162] text-[#1c3a4a] font-bold rounded-md shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
                        >
                            <ClipboardDocumentIcon className="h-5 w-5" />
                            {copySuccess ? copySuccess : 'Copiar'}
                        </button>
                    </div>
                </div>

                <div className="border-t border-[#3a6a82] pt-6">
                    <h2 className="text-xl font-bold text-white">Estado del Feed</h2>
                     <p className="text-gray-400 mt-1">
                        Última actualización del feed: <span className="font-semibold text-white">{lastUpdated.toLocaleString('es-CO')}</span>.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">El feed se regenera automáticamente cada 24 horas.</p>

                    <button 
                        onClick={handleForceUpdate}
                        className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-500 transition-transform transform hover:scale-105"
                    >
                        {/* FIX: Replaced non-existent 'ArrowDownTrayIcon' with 'DownloadIcon'. */}
                        <DownloadIcon className="h-5 w-5" />
                        Forzar Actualización y Descargar
                    </button>
                </div>
            </div>
        </div>
    );
};