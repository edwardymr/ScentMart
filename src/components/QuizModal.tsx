
import React, { useState } from 'react';
import { type QuizPreferences, type Perfume } from '../types';
import { XMarkIcon, SparklesIcon } from './icons';

interface QuizModalProps {
  onClose: () => void;
  onSubmit: (preferences: QuizPreferences) => void;
  isLoading: boolean;
  error: string | null;
  results: Perfume[] | null;
  onViewDetails: (perfume: Perfume) => void;
}

const quizQuestions = [
    {
        key: 'landscape',
        question: 'Elige tu paisaje soñado:',
        options: ['Playa al atardecer', 'Bosque frondoso y húmedo', 'Jardín floreciente en primavera', 'Una metrópolis vibrante de noche']
    },
    {
        key: 'sensation',
        question: '¿Qué sensación buscas en un aroma?',
        options: ['Frescura y energía revitalizante', 'Calidez, confort y tranquilidad', 'Elegancia, misterio y sofisticación', 'Aventura, libertad y audacia']
    },
    {
        key: 'timeOfDay',
        question: '¿Cuál es tu momento preferido del día?',
        options: ['Una mañana radiante y soleada', 'Una tarde relajada y serena', 'Una noche mágica y estrellada']
    }
];

export const QuizModal: React.FC<QuizModalProps> = ({ onClose, onSubmit, isLoading, error, results, onViewDetails }) => {
  const [preferences, setPreferences] = useState<QuizPreferences>({
    landscape: '',
    sensation: '',
    timeOfDay: ''
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleSelectOption = (key: keyof QuizPreferences, option: string) => {
    const newPreferences = { ...preferences, [key]: option };
    setPreferences(newPreferences);
    
    if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
        // Last question answered, now show submit button
    }
  };

  const isFormComplete = Object.values(preferences).every(val => val !== '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormComplete) {
      onSubmit(preferences);
    }
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 transition-opacity duration-300" role="dialog" aria-modal="true">
      <div className="bg-[#224859] border border-[#3a6a82] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-95 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
          <XMarkIcon className="h-8 w-8" />
        </button>

        <div className="p-8 sm:p-12">
            {!results && !isLoading && (
              <>
                <h2 className="font-serif-display text-3xl font-bold text-center text-[#DAB162]">Descubre tu Aroma Ideal</h2>
                <p className="text-center text-gray-300 mt-2">Responde para encontrar tu fragancia perfecta.</p>
                <div className="mt-8">
                    <div className="h-1 bg-[#3a6a82] rounded-full">
                        <div className="h-1 bg-[#DAB162] rounded-full transition-all duration-500" style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mt-6 text-center transition-opacity duration-300">
                            <h3 className="text-xl text-white mb-6">{currentQuestion.question}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {currentQuestion.options.map(option => (
                                    <button 
                                        type="button"
                                        key={option} 
                                        onClick={() => handleSelectOption(currentQuestion.key as keyof QuizPreferences, option)}
                                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${preferences[currentQuestion.key as keyof QuizPreferences] === option ? 'bg-[#DAB162] text-[#224859] border-[#DAB162] font-bold' : 'bg-[#2a556a] border-[#3a6a82] hover:border-[#DAB162]'}`}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {isFormComplete && (
                             <div className="mt-10 text-center">
                                <button type="submit" disabled={isLoading} className="px-10 py-4 bg-[#E86A33] text-white font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 disabled:bg-gray-500">
                                    Encontrar mi aroma
                                </button>
                            </div>
                        )}
                    </form>
                </div>
              </>
            )}

            {isLoading && (
                <div className="text-center py-20">
                    <SparklesIcon className="mx-auto h-16 w-16 text-[#DAB162] animate-pulse" />
                    <h3 className="mt-4 text-2xl font-serif-display text-white">Buscando en nuestro catálogo...</h3>
                    <p className="text-gray-300">Un momento, por favor.</p>
                </div>
            )}

            {error && (
                <div className="text-center py-20">
                     <p className="text-red-400">{error}</p>
                     <button onClick={() => onSubmit(preferences)} className="mt-4 px-6 py-2 bg-[#E86A33] rounded-full">Intentar de nuevo</button>
                </div>
            )}
            
            {results && !isLoading && (
                <div>
                    <h2 className="font-serif-display text-3xl font-bold text-center text-[#DAB162]">Tus Aromas Recomendados</h2>
                    <p className="text-center text-[#DAB162] mt-2">Basado en tus preferencias, estos perfumes en stock son perfectos para ti.</p>
                    
                    {results.length > 0 ? (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {results.map((perfume) => (
                                <div key={perfume.id} className="bg-[#2a556a] p-4 rounded-lg border border-[#3a6a82] flex flex-col items-center text-center transition-transform transform hover:scale-105">
                                    <img src={perfume.imageUrl} alt={perfume.name} className="w-28 h-28 object-cover rounded-lg mb-4 shadow-md" />
                                    <div className="flex-grow flex flex-col justify-center">
                                      <h3 className="font-serif-display font-bold text-white ">{perfume.name}</h3>
                                      <p className="text-sm text-[#DAB162] mb-4">{perfume.brand}</p>
                                    </div>
                                    <button
                                        onClick={() => onViewDetails(perfume)}
                                        className="mt-auto w-full px-4 py-2 bg-[#E86A33] text-white font-semibold text-sm rounded-full shadow-lg hover:bg-opacity-90"
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-lg text-gray-300">No pudimos encontrar una coincidencia perfecta en nuestro stock actual.</p>
                            <p className="text-gray-400 mt-2">¡Vuelve a intentarlo con otras opciones o explora nuestro catálogo completo!</p>
                        </div>
                    )}
                </div>
            )}
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
