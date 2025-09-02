import React, { useState, useCallback } from 'react';
import { type Perfume, type OlfactoryFamily } from '../types';
import { XMarkIcon, DownloadIcon, ImportIcon } from './icons';

interface CSVImportModalProps {
  onClose: () => void;
  onImport: (newPerfumes: Perfume[]) => void;
  currentPerfumes: Perfume[];
}

interface ImportResult {
  successful: Perfume[];
  skipped: { row: any; reason: string }[];
  failed: { row: any; reason: string }[];
}

const CSV_HEADERS = 'nombre_producto,descripcion,precio,precio_descuento,sku,stock,categoria,genero,url_imagen_1,url_imagen_2,notas_salida,notas_corazon,notas_fondo';

export const CSVImportModal: React.FC<CSVImportModalProps> = ({ onClose, onImport, currentPerfumes }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_HEADERS], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plantilla_importacion.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processFile = useCallback((file: File) => {
    setError(null);
    setResult(null);
    if (file.type !== 'text/csv') {
      setError('Por favor, sube un archivo con formato .csv');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseAndValidateCSV(text);
    };
    reader.onerror = () => {
        setError('Error al leer el archivo.');
    };
    reader.readAsText(file);
  }, [currentPerfumes]);

  const parseAndValidateCSV = (csvText: string) => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      setError('El archivo CSV está vacío o solo contiene la cabecera.');
      return;
    }

    const header = lines[0].trim();
    if (header !== CSV_HEADERS) {
      setError('Las cabeceras del archivo CSV no coinciden con la plantilla. Por favor, descarga la plantilla y úsala como base.');
      return;
    }
    
    const headers = header.split(',');
    const parsedData: any[] = [];
    const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;

    for (let i = 1; i < lines.length; i++) {
        const obj: any = {};
        const values = lines[i].match(regex) || [];
        for (let j = 0; j < headers.length; j++) {
            let value = (values[j] || '').trim().replace(/^"|"$/g, '');
            obj[headers[j]] = value;
        }
        parsedData.push(obj);
    }
    
    validateData(parsedData);
  };

  const validateData = (data: any[]) => {
    const existingNames = new Set(currentPerfumes.map(p => p.name.toLowerCase()));
    const csvSkus = new Set<string>();
    
    const validationResult: ImportResult = {
      successful: [],
      skipped: [],
      failed: [],
    };

    const validOlfactoryFamilies: OlfactoryFamily[] = ['Floral', 'Oriental', 'Amaderado', 'Cítrico', 'Aromático'];

    data.forEach((row, index) => {
      const { nombre_producto, sku, url_imagen_1 } = row;

      if (!sku) {
        validationResult.failed.push({ row, reason: `Fila ${index + 2}: Falta el SKU.` });
        return;
      }
      if (csvSkus.has(sku)) {
        validationResult.skipped.push({ row, reason: `SKU '${sku}' duplicado en el archivo.` });
        return;
      }
      csvSkus.add(sku);
      
      if (!nombre_producto) {
        validationResult.failed.push({ row, reason: `Fila ${index + 2}: Falta el nombre del producto.` });
        return;
      }
      if (existingNames.has(nombre_producto.toLowerCase())) {
          validationResult.skipped.push({ row, reason: `Producto '${nombre_producto}' ya existe en el catálogo.` });
          return;
      }

      if (!url_imagen_1) {
          validationResult.failed.push({ row, reason: `Fila ${index + 2}: Falta la URL de la imagen principal.` });
          return;
      }

      const price = parseFloat(row.precio_descuento) || parseFloat(row.precio) || 0;
      const originalPrice = row.precio_descuento ? parseFloat(row.precio) : undefined;
      
      const genderValue = (row.genero || 'Unisex').trim().toLowerCase();
      const gender: 'Hombre' | 'Mujer' | 'Unisex' = 
        genderValue === 'hombre' ? 'Hombre' :
        genderValue === 'mujer' ? 'Mujer' :
        'Unisex';

      const categoryValue = (row.categoria || '').trim().toLowerCase();
      const olfactoryFamily = (validOlfactoryFamilies.find(f => f.toLowerCase() === categoryValue) || 'Aromático');

      const newPerfume: Perfume = {
        id: Date.now() + index,
        name: row.nombre_producto,
        brand: 'ScentMart',
        volume: 'No especificado',
        price: price,
        originalPrice: originalPrice,
        stock: parseInt(row.stock, 10) || 0,
        imageUrl: row.url_imagen_1,
        gender: gender,
        olfactoryFamily: olfactoryFamily,
        details: {
          description: row.descripcion || 'Descripción no disponible.',
          olfactoryNotes: [
              row.notas_salida ? `Salida: ${row.notas_salida}`: '',
              row.notas_corazon ? `Corazón: ${row.notas_corazon}`: '',
              row.notas_fondo ? `Fondo: ${row.notas_fondo}`: '',
          ].filter(Boolean).join(' | ') || 'Notas olfativas no especificadas.',
          concept: 'Concepto por definir.',
          applicationPoint: 'Aplicar en muñecas, cuello y detrás de las orejas.',
        },
      };
      validationResult.successful.push(newPerfume);
    });
    setResult(validationResult);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if(e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
      else if (e.type === "dragleave") setIsDragging(false);
  }

  const handleReset = () => {
    setResult(null);
    setError(null);
  };
  
  const handleImportClick = () => {
    if (result && result.successful.length > 0) {
        onImport(result.successful);
    }
  }

  const renderInitialView = () => (
    <>
      <p className="text-center text-gray-300 mt-2">Sigue los pasos para importar tu catálogo de productos masivamente.</p>
      <div className="mt-8 space-y-6">
        <div>
            <h3 className="font-bold text-lg text-[#DAB162]">Paso 1: Descarga la Plantilla</h3>
            <p className="text-sm text-gray-400 mb-2">Usa esta plantilla para asegurar que tus datos tengan el formato correcto.</p>
            <button onClick={handleDownloadTemplate} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2a556a] border border-[#3a6a82] text-white font-bold rounded-lg shadow-lg hover:border-[#DAB162] transition-colors">
                <DownloadIcon className="h-6 w-6"/>
                Descargar Plantilla de Importación (.csv)
            </button>
        </div>
        <div>
            <h3 className="font-bold text-lg text-[#DAB162]">Paso 2: Sube tu Archivo</h3>
            <p className="text-sm text-gray-400 mb-2">Arrastra y suelta tu archivo .csv o haz clic para seleccionarlo.</p>
            <div 
                onDrop={handleDrop}
                onDragEnter={handleDragEvents}
                onDragOver={handleDragEvents}
                onDragLeave={handleDragEvents}
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging ? 'border-[#E86A33] bg-[#2a556a]' : 'border-[#3a6a82]'}`}
            >
                <ImportIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-400">Arrastra y suelta aquí o <span className="font-semibold text-[#DAB162]">busca en tu equipo</span></p>
                <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
            </div>
            {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        </div>
      </div>
    </>
  );

  // CORRECCIÓN APLICADA AQUÍ ABAJO
  const renderSummaryView = () => {
    // Para no repetir 'result &&' en todos lados, hacemos una comprobación al principio.
    if (!result) {
      return null; // O un mensaje de carga/error
    }

    return (
      <>
        <p className="text-center text-gray-300 mt-2">Revisa el resultado del análisis antes de importar.</p>
        <div className="mt-6 space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {result.successful.length > 0 && (
                 <div className="bg-green-900/50 border border-green-700 p-4 rounded-lg">
                    <h4 className="font-bold text-green-300">{result.successful.length} Productos Listos para Importar</h4>
                    <ul className="list-disc list-inside text-sm text-green-300/80 mt-2">
                        {result.successful.map(p => <li key={p.id}>{p.name}</li>)}
                    </ul>
                 </div>
            )}
             {result.skipped.length > 0 && (
                 <div className="bg-yellow-900/50 border border-yellow-700 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-300">{result.skipped.length} Productos Omitidos</h4>
                    <ul className="list-disc list-inside text-sm text-yellow-300/80 mt-2">
                         {result.skipped.map((s, i) => <li key={i}>{s.reason}</li>)}
                    </ul>
                 </div>
            )}
            {result.failed.length > 0 && (
                 <div className="bg-red-900/50 border border-red-700 p-4 rounded-lg">
                    <h4 className="font-bold text-red-300">{result.failed.length} Productos con Errores</h4>
                     <ul className="list-disc list-inside text-sm text-red-300/80 mt-2">
                         {result.failed.map((f, i) => <li key={i}>{f.reason}</li>)}
                    </ul>
                 </div>
            )}
        </div>
        <div className="flex gap-4 pt-6 mt-4 border-t border-[#3a6a82]">
            <button onClick={handleReset} className="w-full px-6 py-3 bg-gray-600 text-white font-bold rounded-full shadow-lg hover:bg-gray-500 transition-colors">
                Subir Otro Archivo
            </button>
            <button 
                onClick={handleImportClick} 
                disabled={result.successful.length === 0}
                className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {`Importar ${result.successful.length || 0} Productos`}
            </button>
        </div>
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
      <div className="bg-[#224859] border border-[#3a6a82] rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 animate-scale-in">
        <div className="p-8 sm:p-12 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
            <XMarkIcon className="h-8 w-8" />
          </button>
          <h2 className="font-serif-display text-3xl font-bold text-center text-[#DAB162]">Importar Catálogo desde CSV</h2>
          {result ? renderSummaryView() : renderInitialView()}
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