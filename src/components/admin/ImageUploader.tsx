
import React, { useState, useCallback } from 'react';
import { ArrowUpTrayIcon, StarIcon, TrashIcon, LinkIcon } from '../icons';

interface ImageUploaderProps {
    onChange: (mainImageUrl: string, allImages: string[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
    const [images, setImages] = useState<string[]>([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);

    const updateParent = (newImages: string[], newPrimaryIndex: number) => {
        if (newImages.length > 0) {
            onChange(newImages[newPrimaryIndex], newImages);
        } else {
            onChange('', []);
        }
    };

    const handleFileProcessing = (files: FileList) => {
        const newImages: string[] = [];
        let filesToProcess = files.length;

        if (filesToProcess === 0) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onloadend = () => {
                newImages.push(reader.result as string);
                filesToProcess--;
                if (filesToProcess === 0) {
                    const combined = [...images, ...newImages];
                    setImages(combined);
                    updateParent(combined, primaryImageIndex);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAddFromUrl = () => {
        if (urlInput && (urlInput.startsWith('http://') || urlInput.startsWith('https://'))) {
            const newImages = [...images, urlInput];
            setImages(newImages);
            updateParent(newImages, primaryImageIndex);
            setUrlInput('');
            setShowUrlInput(false);
        } else {
            alert("Por favor, introduce una URL válida.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFileProcessing(e.target.files);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFileProcessing(e.dataTransfer.files);
        }
    }, [images, primaryImageIndex]);

    const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
        else if (e.type === "dragleave") setIsDragging(false);
    };

    const handleSetPrimary = (index: number) => {
        setPrimaryImageIndex(index);
        updateParent(images, index);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        let newPrimaryIndex = primaryImageIndex;

        if (index === primaryImageIndex) {
            newPrimaryIndex = 0;
        } else if (index < primaryImageIndex) {
            newPrimaryIndex = primaryImageIndex - 1;
        }
        
        setImages(newImages);
        setPrimaryImageIndex(newPrimaryIndex);
        updateParent(newImages, newPrimaryIndex);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                    onDrop={handleDrop}
                    onDragEnter={handleDragEvents}
                    onDragOver={handleDragEvents}
                    onDragLeave={handleDragEvents}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors flex flex-col justify-center items-center ${isDragging ? 'border-[#E86A33] bg-[#2a556a]' : 'border-[#3a6a82]'}`}
                >
                    <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-gray-400">Arrastra y suelta o <span className="font-semibold text-[#DAB162]">busca en tu equipo</span></p>
                    <p className="text-xs text-gray-500 mt-1">Puedes seleccionar múltiples archivos</p>
                    <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} multiple />
                </div>
                <div className="bg-[#1c3a4a] p-4 rounded-lg flex flex-col justify-center">
                    <button type="button" onClick={() => setShowUrlInput(!showUrlInput)} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2a556a] border border-[#3a6a82] text-white font-bold rounded-lg shadow-lg hover:border-[#DAB162] transition-colors">
                        <LinkIcon className="h-6 w-6"/>
                        Añadir desde URL
                    </button>
                    {showUrlInput && (
                        <div className="flex gap-2 mt-2">
                           <input
                             type="text"
                             value={urlInput}
                             onChange={(e) => setUrlInput(e.target.value)}
                             placeholder="Pega la URL de la imagen aquí"
                             className="flex-grow p-2 bg-[#224859] border border-[#3a6a82] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#DAB162]"
                           />
                           <button type="button" onClick={handleAddFromUrl} className="px-4 bg-[#E86A33] rounded-md text-white font-bold">Añadir</button>
                        </div>
                    )}
                </div>
            </div>

            {images.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold text-white mb-2">Galería (Arrastra para reordenar)</h3>
                    <p className="text-sm text-gray-400 mb-2">Haz clic en la estrella para designar la imagen principal.</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative group aspect-square">
                                <img src={img} alt={`preview ${index}`} className="w-full h-full object-cover rounded-lg border-2 border-[#3a6a82]" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleSetPrimary(index)}
                                        title="Marcar como principal"
                                        className="p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <StarIcon className={`h-6 w-6 ${primaryImageIndex === index ? 'text-yellow-400' : 'text-white'}`} fill={primaryImageIndex === index ? 'currentColor' : 'none'} />
                                    </button>
                                     <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        title="Eliminar imagen"
                                        className="p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
                                    >
                                        <TrashIcon className="h-6 w-6 text-red-500" />
                                    </button>
                                </div>
                                {primaryImageIndex === index && (
                                    <div className="absolute top-1 right-1 bg-[#DAB162] text-black text-xs font-bold px-2 py-0.5 rounded">
                                        Principal
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
