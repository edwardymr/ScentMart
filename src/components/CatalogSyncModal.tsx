
import React, { useState, useEffect } from 'react';
import { Perfume } from '../types';
import { XMarkIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from './icons';

interface CatalogSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  perfumes: Perfume[];
  onApplyChanges: (updatedPerfumes: Perfume[]) => void;
}

type SyncStatus = 'updated' | 'unchanged' | 'error';
interface SyncResultItem {
  perfume: Perfume;
  status: SyncStatus;
  changes?: { key: string; oldValue: any; newValue: any }[];
  error?: string;
}

export const CatalogSyncModal: React.FC<CatalogSyncModalProps> = ({ isOpen, onClose, perfumes, onApplyChanges }) => {
  const [step, setStep] = useState<'selection' | 'syncing' | 'summary'>('selection');
  const [selectedPerfumeIds, setSelectedPerfumeIds] = useState<Set<number>>(new Set());
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncResult, setSyncResult] = useState<SyncResultItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('selection');
      setSelectedPerfumeIds(new Set(perfumes.map(p => p.id)));
      setSyncProgress(0);
      setSyncResult([]);
      setSyncMessage('');
    }
  }, [isOpen, perfumes]);

  const handleToggleSelect = (perfumeId: number) => {
    setSelectedPerfumeIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(perfumeId)) {
        newSet.delete(perfumeId);
      } else {
        newSet.add(perfumeId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => setSelectedPerfumeIds(new Set(perfumes.map(p => p.id)));
  const handleDeselectAll = () => setSelectedPerfumeIds(new Set());

  const handleStartSync = () => {
    setStep('syncing');
    const selectedPerfumes = perfumes.filter(p => selectedPerfumeIds.has(p.id));
    const total = selectedPerfumes.length;
    let processed = 0;
    const results: SyncResultItem[] = [];

    if (total === 0) {
        setStep('summary');
        return;
    }

    const interval = setInterval(() => {
        if (processed < total) {
            const perfume = selectedPerfumes[processed];
            setSyncMessage(`Sincronizando ${perfume.name}...`);
            
            const random = Math.random();
            if (random < 0.6) { // 60% chance of update
                const newPrice = Math.round(perfume.price * (1 + (Math.random() - 0.5) * 0.1));
                const newStock = Math.max(0, perfume.stock + Math.floor((Math.random() - 0.5) * 5));
                const updatedPerfume = { ...perfume, price: newPrice, stock: newStock };
                results.push({ perfume: updatedPerfume, status: 'updated', changes: [
                    { key: 'precio', oldValue: perfume.price, newValue: newPrice },
                    { key: 'stock', oldValue: perfume.stock, newValue: newStock }
                ]});
            } else if (random < 0.85) { // 25% chance of no change
                results.push({ perfume, status: 'unchanged' });
            } else { // 15% chance of error
                results.push({ perfume, status: 'error', error: 'SKU no encontrado en origen.' });
            }

            processed++;
            setSyncProgress((processed / total) * 100);
        } else {
            clearInterval(interval);
            setSyncMessage('¡Sincronización completada!');
            setTimeout(() => {
                setSyncResult(results);
                setStep('summary');
            }, 500);
        }
    }, 200);
  };
  
  const handleConfirmChanges = () => {
    const updated = syncResult.filter(r => r.status === 'updated').map(r => r.perfume);
    onApplyChanges(updated);
    onClose();
  };

  if (!isOpen) return null;
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

  const renderSelection = () => (
    <>
        <p className="text-center text-gray-300 mt-2">Selecciona los productos que deseas sincronizar con las tiendas oficiales.</p>
        <div className="mt-6 flex justify-between items-center">
            <span className="text-sm font-bold text-white">{selectedPerfumeIds.size} de {perfumes.length} seleccionados</span>
            <div className="flex gap-2">
                <button onClick={handleSelectAll} className="text-sm text-[#DAB162] hover:underline">Seleccionar todo</button>
                <button onClick={handleDeselectAll} className="text-sm text-gray-400 hover:underline">Deseleccionar todo</button>
            </div>
        </div>
        <div className="mt-4 max-h-80 overflow-y-auto border border-[#3a6a82] rounded-lg p-2 pr-4 space-y-2">
            {perfumes.map(p => (
                <label key={p.id} className="flex items-center p-3 rounded-md hover:bg-[#2a556a] cursor-pointer">
                    <input type="checkbox" checked={selectedPerfumeIds.has(p.id)} onChange={() => handleToggleSelect(p.id)} className="h-5 w-5 rounded bg-[#1c3a4a] border-[#3a6a82] text-[#DAB162] focus:ring-[#DAB162]" />
                    <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded ml-4" />
                    <span className="ml-4 text-white font-semibold">{p.name}</span>
                </label>
            ))}
        </div>
        <div className="mt-8 text-center">
            <button onClick={handleStartSync} disabled={selectedPerfumeIds.size === 0} className="px-10 py-4 bg-[#E86A33] text-white font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed">
                Iniciar Sincronización ({selectedPerfumeIds.size})
            </button>
        </div>
    </>
  );

  const renderSyncing = () => (
    <div className="text-center py-20">
        <h2 className="font-serif-display text-2xl text-white">Sincronizando...</h2>
        <div className="w-full bg-[#1c3a4a] rounded-full h-2.5 mt-4 border border-[#3a6a82]">
            <div className="bg-[#DAB162] h-2.5 rounded-full" style={{ width: `${syncProgress}%`, transition: 'width 0.2s ease-in-out' }}></div>
        </div>
        <p className="mt-4 text-gray-300 h-6">{syncMessage}</p>
    </div>
  );
  
  const renderSummary = () => {
      const updatedItems = syncResult.filter(r => r.status === 'updated');
      const unchangedItems = syncResult.filter(r => r.status === 'unchanged');
      const errorItems = syncResult.filter(r => r.status === 'error');

      return (
        <>
            <p className="text-center text-gray-300 mt-2">La sincronización ha finalizado. Revisa los resultados y aplica los cambios.</p>
            <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                {updatedItems.length > 0 && (
                    <div className="bg-green-900/50 border border-green-700 p-4 rounded-lg">
                        <h4 className="font-bold text-green-300 flex items-center gap-2"><CheckCircleIcon className="h-5 w-5" /> {updatedItems.length} Productos Actualizados</h4>
                        <ul className="text-sm text-green-300/80 mt-2 space-y-2">
                            {updatedItems.map(({ perfume, changes }) => (
                                <li key={perfume.id} className="pl-2 border-l-2 border-green-700">
                                    <strong>{perfume.name}:</strong>
                                    {changes?.map(c => 
                                        ` ${c.key} de ${c.key === 'precio' ? formatCurrency(c.oldValue) : c.oldValue} a ${c.key === 'precio' ? formatCurrency(c.newValue) : c.newValue}`
                                    ).join(', ')}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {unchangedItems.length > 0 && (
                    <div className="bg-blue-900/50 border border-blue-700 p-4 rounded-lg">
                        <h4 className="font-bold text-blue-300 flex items-center gap-2"><InformationCircleIcon className="h-5 w-5" /> {unchangedItems.length} Productos sin cambios</h4>
                        <p className="text-xs text-blue-300/80 mt-1">{unchangedItems.map(i => i.perfume.name).join(', ')}</p>
                    </div>
                )}
                {errorItems.length > 0 && (
                    <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg">
                        <h4 className="font-bold text-red-300 flex items-center gap-2"><XCircleIcon className="h-5 w-5" /> {errorItems.length} Productos con errores</h4>
                         <ul className="text-sm text-red-300/80 mt-2 space-y-1">
                            {errorItems.map(({ perfume, error }) => (
                                <li key={perfume.id}><strong>{perfume.name}:</strong> {error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="flex gap-4 pt-6 mt-4 border-t border-[#3a6a82]">
                <button onClick={() => setStep('selection')} className="w-full px-6 py-3 bg-gray-600 text-white font-bold rounded-full shadow-lg hover:bg-gray-500 transition-colors">
                    Sincronizar de Nuevo
                </button>
                <button 
                    onClick={handleConfirmChanges}
                    disabled={updatedItems.length === 0}
                    className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {`Aplicar ${updatedItems.length} Cambios`}
                </button>
            </div>
        </>
      );
  };
  
  const renderContent = () => {
      switch(step) {
          case 'selection': return renderSelection();
          case 'syncing': return renderSyncing();
          case 'summary': return renderSummary();
      }
  };

  return (
    // FIX: Corrected aria-modal attribute from a corrupted value to "true" and fixed the component's closing tags.
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
        <div className="bg-[#224859] border border-[#3a6a82] rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 animate-scale-in">
            <div className="p-8 sm:p-12 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
                    <XMarkIcon className="h-8 w-8" />
                </button>
                <h2 className="font-serif-display text-3xl font-bold text-center text-[#DAB162]">Sincronizar Catálogo</h2>
                {renderContent()}
            </div>
        </div>
        <style>{`
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
