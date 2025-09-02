
import React, { useState } from 'react';
import { ArrowUpTrayIcon } from '../icons';

interface BrandIdentityPageProps {
    currentLogo: string;
    onUpdateLogo: (newLogoUrl: string) => void;
}

export const BrandIdentityPage: React.FC<BrandIdentityPageProps> = ({ currentLogo, onUpdateLogo }) => {
    const [newLogo, setNewLogo] = useState<string | null>(null);
    const [urlInput, setUrlInput] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAddFromUrl = () => {
        if (urlInput && (urlInput.startsWith('http') || urlInput.startsWith('data:'))) {
            setNewLogo(urlInput);
            setUrlInput('');
        }
    };

    const handleSaveChanges = () => {
        if (newLogo) {
            onUpdateLogo(newLogo);
            setNewLogo(null);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-serif-display font-bold text-[#DAB162] mb-8">Identidad de Marca</h1>
            <div className="bg-[#224859] p-8 rounded-lg shadow-lg border border-[#3a6a82]">
                <h2 className="text-xl font-bold text-white mb-4">Gestionar Logo del Sitio</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Previews */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-[#DAB162]">Logo Actual</h3>
                            <div className="mt-2 p-4 bg-[#1c3a4a] rounded-md border border-[#3a6a82] flex justify-center items-center h-40">
                                <img src={currentLogo} alt="Logo Actual" className="max-h-full max-w-full" />
                            </div>
                        </div>
                        {newLogo && (
                            <div>
                                <h3 className="text-lg font-semibold text-green-400">Nuevo Logo (Vista Previa)</h3>
                                 <div className="mt-2 p-4 bg-[#1c3a4a] rounded-md border-2 border-green-500 flex justify-center items-center h-40">
                                    <img src={newLogo} alt="Nuevo Logo" className="max-h-full max-w-full" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upload Area */}
                    <div className="space-y-4">
                         <div className="relative border-2 border-dashed border-[#3a6a82] rounded-lg p-8 text-center hover:border-[#DAB162] transition-colors">
                             <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-gray-400" />
                             <p className="mt-2 text-white">Subir desde el Ordenador</p>
                             <p className="text-xs text-gray-400">Recomendado: SVG o PNG transparente</p>
                             <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                         </div>
                         <div className="flex items-center gap-2">
                            <hr className="flex-grow border-t border-[#3a6a82]" />
                            <span className="text-gray-400">o</span>
                            <hr className="flex-grow border-t border-[#3a6a82]" />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-[#DAB162] mb-1">Pega la URL de la imagen del logo</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://ejemplo.com/logo.png"
                                    className="flex-grow p-2 bg-[#1c3a4a] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162]"
                                />
                                <button onClick={handleAddFromUrl} className="px-4 bg-[#3a6a82] rounded-md text-white font-bold hover:bg-[#DAB162]/50">Usar</button>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-[#3a6a82] pt-6 flex justify-end">
                    <button
                        onClick={handleSaveChanges}
                        disabled={!newLogo}
                        className="px-8 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};
