import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PerfumeCard } from './components/PerfumeCard';
import { QuizModal } from './components/QuizModal';
import { SparklesIcon, ImportIcon } from './components/icons';
import { Perfume, RecommendedPerfume, QuizPreferences, OlfactoryFamily } from './types';
import { findMyScent } from './services/geminiService';
import { allPerfumes as initialPerfumes } from './data/perfumes';
import { PerfumeDetailModal } from './components/PerfumeDetailModal';
import { CSVImportModal } from './components/CSVImportModal';
import { LoginModal } from './components/LoginModal';
import { BestSellers } from './components/BestSellers';
import { WhatsAppButton } from './components/WhatsAppButton';

const App: React.FC = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCSVImportModalOpen, setIsCSVImportModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [quizResults, setQuizResults] = useState<RecommendedPerfume[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [perfumes, setPerfumes] = useState<Perfume[]>(initialPerfumes);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  const [genderFilter, setGenderFilter] = useState<'all' | 'Mujer' | 'Hombre' | 'Unisex'>('all');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [familyFilter, setFamilyFilter] = useState<'all' | OlfactoryFamily>('all');

  useEffect(() => {
    const handleScroll = () => {
        setIsHeaderSticky(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenQuiz = () => {
    setQuizResults(null);
    setError(null);
    setIsQuizOpen(true);
  };

  const handleCloseQuiz = () => {
    setIsQuizOpen(false);
  };

  const handleQuizSubmit = useCallback(async (preferences: QuizPreferences) => {
    setIsLoading(true);
    setError(null);
    setQuizResults(null);
    try {
      const results = await findMyScent(preferences);
      setQuizResults(results);
    } catch (err) {
      setError('Hubo un error al encontrar tu aroma. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewDetails = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
  };

  const handleCloseDetails = () => {
    setSelectedPerfume(null);
  };

  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false); // Logout
    } else {
      setIsLoginModalOpen(true); // Show login modal
    }
  };

  const handleLogin = (user: string, pass: string): boolean => {
    if (user === 'admin' && pass === '0728') {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      return true;
    }
    return false;
  };
  
  const handleUpdatePerfume = (updatedPerfume: Perfume) => {
    setPerfumes(currentPerfumes => 
      currentPerfumes.map(p => p.id === updatedPerfume.id ? updatedPerfume : p)
    );
    setSelectedPerfume(updatedPerfume); // Keep the modal open with updated data
  };

  const handleImportPerfumes = (newPerfumesFromCSV: Perfume[]) => {
    const existingNames = new Set(perfumes.map(p => p.name.toLowerCase()));
    const uniqueNewPerfumes = newPerfumesFromCSV.filter(p => !existingNames.has(p.name.toLowerCase()));
    
    setPerfumes(currentPerfumes => [...uniqueNewPerfumes, ...currentPerfumes]);
    setIsCSVImportModalOpen(false);
  };

  const filteredPerfumes = useMemo(() => {
    let result = [...perfumes];

    if (genderFilter !== 'all') {
      result = result.filter(p => p.gender === genderFilter);
    }

    if (familyFilter !== 'all') {
      result = result.filter(p => p.olfactoryFamily === familyFilter);
    }

    if (priceSort === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [perfumes, genderFilter, priceSort, familyFilter]);


  return (
    <div className="min-h-screen bg-[#224859] text-[#F5F5F5] font-sans">
      <Header isSticky={isHeaderSticky} />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
          <img src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=1920&auto=format&fit=crop" alt="Sunset over the ocean" className="absolute inset-0 w-full h-full object-cover"/>
          <div className="relative z-20 p-4">
            <h1 className="font-serif-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-lg text-[#E86A33]">
              Captura tu momento.
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">Descubre el aroma de tus recuerdos.</p>
            <button 
              onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 px-8 py-3 bg-[#E86A33] text-white font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
            >
              Descubrir Catálogo
            </button>
          </div>
        </section>

        {/* Best Sellers Section */}
        <BestSellers perfumes={perfumes} onViewDetails={handleViewDetails} />

        {/* Catalog Section */}
        <section id="collections" className="py-16 sm:py-24 bg-[#1c3a4a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center gap-4 mb-4">
               <h2 className="text-3xl font-serif-display text-center font-bold text-[#DAB162]">Nuestro Catálogo</h2>
               {isAdmin && (
                 <>
                    <span className="px-3 py-1 text-sm font-bold bg-red-600 text-white rounded-full animate-pulse">MODO ADMIN</span>
                    <button onClick={() => setIsCSVImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#DAB162] text-[#224859] font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105">
                        <ImportIcon className="h-5 w-5"/>
                        Importar Catálogo
                    </button>
                 </>
                )}
            </div>
            <p className="text-center max-w-2xl mx-auto text-[#DAB162] mb-8">Aromas para cada estilo y ocasión.</p>

            {/* Filter Controls */}
            <div className="flex flex-col gap-6 justify-center items-center mb-10 p-6 bg-[#2a556a]/70 rounded-xl border border-[#3a6a82]">
                <div className="flex flex-col md:flex-row gap-x-8 gap-y-4 items-center flex-wrap justify-center">
                    {/* Gender filter */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="font-semibold text-lg text-white mr-2">Género:</span>
                        {(['all', 'Mujer', 'Hombre', 'Unisex'] as const).map(gender => (
                            <button
                                key={gender}
                                onClick={() => setGenderFilter(gender)}
                                className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-200 ${genderFilter === gender ? 'bg-[#DAB162] text-[#224859] shadow-md' : 'bg-[#1c3a4a] text-gray-300 hover:bg-[#3a6a82]'}`}
                            >
                                {gender === 'all' ? 'Todos' : gender}
                            </button>
                        ))}
                    </div>
                    {/* Olfactory Family Filter */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="font-semibold text-lg text-white mr-2">Familia:</span>
                        {(['all', 'Floral', 'Oriental', 'Amaderado', 'Cítrico', 'Aromático'] as const).map(family => (
                            <button
                                key={family}
                                onClick={() => setFamilyFilter(family as 'all' | OlfactoryFamily)}
                                className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-200 ${familyFilter === family ? 'bg-[#DAB162] text-[#224859] shadow-md' : 'bg-[#1c3a4a] text-gray-300 hover:bg-[#3a6a82]'}`}
                            >
                                {family === 'all' ? 'Todas' : family}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <label htmlFor="price-sort" className="font-semibold text-lg text-white">Ordenar por:</label>
                    <select
                        id="price-sort"
                        value={priceSort}
                        onChange={(e) => setPriceSort(e.target.value as 'none' | 'asc' | 'desc')}
                        className="bg-[#1c3a4a] border border-[#3a6a82] rounded-full text-white font-semibold py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#DAB162] cursor-pointer"
                    >
                        <option value="none">Relevancia</option>
                        <option value="asc">Menor a Mayor Precio</option>
                        <option value="desc">Mayor a Menor Precio</option>
                    </select>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredPerfumes.map(perfume => (
                <PerfumeCard key={perfume.id} perfume={perfume} onViewDetails={handleViewDetails} isAdmin={isAdmin} />
              ))}
            </div>
          </div>
        </section>

        {/* Quiz CTA Section */}
        <section className="bg-[#2a556a]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
            <SparklesIcon className="mx-auto h-12 w-12 text-[#DAB162] mb-4" />
            <h2 className="text-3xl font-serif-display font-bold text-[#DAB162]">¿No sabes por dónde empezar?</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Responde nuestro breve cuestionario y deja que nuestra IA encuentre el paisaje olfativo perfecto para ti.
            </p>
            <button 
              onClick={handleOpenQuiz}
              className="mt-8 px-10 py-4 bg-[#DAB162] text-[#224859] font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105"
            >
              Descubre tu Aroma Ideal
            </button>
          </div>
        </section>
        
        {/* Social Proof Section */}
        <section className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-serif-display text-center font-bold text-[#DAB162] mb-12">Amado por nuestros clientes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#2a556a] p-6 rounded-lg shadow-lg">
                        <p className="text-gray-300">"¡Una experiencia increíble! El perfume que me recomendaron es exactamente lo que buscaba. Es como si hubieran embotellado un atardecer."</p>
                        <p className="mt-4 font-bold text-white">- Ana G.</p>
                    </div>
                    <div className="bg-[#2a556a] p-6 rounded-lg shadow-lg">
                        <p className="text-gray-300">"La calidad es excepcional y la presentación es preciosa. ScentMart se ha convertido en mi única tienda de perfumes."</p>
                        <p className="mt-4 font-bold text-white">- Carlos R.</p>
                    </div>
                    <div className="bg-[#2a556a] p-6 rounded-lg shadow-lg">
                        <p className="text-gray-300">"Me encantó el quiz. Fue divertido y las recomendaciones fueron muy acertadas. Compré dos de las tres sugerencias."</p>
                        <p className="mt-4 font-bold text-white">- Sofía L.</p>
                    </div>
                </div>
            </div>
        </section>

      </main>
      <Footer isAdmin={isAdmin} onToggleAdmin={handleToggleAdmin} />
      
      <WhatsAppButton />

      {isQuizOpen && (
        <QuizModal 
          onClose={handleCloseQuiz}
          onSubmit={handleQuizSubmit}
          isLoading={isLoading}
          error={error}
          results={quizResults}
        />
      )}
      {selectedPerfume && (
        <PerfumeDetailModal
          perfume={selectedPerfume}
          onClose={handleCloseDetails}
          onUpdate={handleUpdatePerfume}
          isAdmin={isAdmin}
        />
      )}
      {isCSVImportModalOpen && (
        <CSVImportModal
          onClose={() => setIsCSVImportModalOpen(false)}
          onImport={handleImportPerfumes}
          currentPerfumes={perfumes}
        />
      )}
      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;