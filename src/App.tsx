import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuizModal } from './components/QuizModal';
import { SparklesIcon } from './components/icons';
// CORRECCIÓN: Eliminado 'OlfactoryFamily' que no se usaba en este archivo.
import { type Perfume, type QuizPreferences, type CartItem, type OrderDetails } from './types';
import { findMyScent } from './services/geminiService';
import { allPerfumes as initialPerfumes } from './data/perfumes';
import { PerfumeDetailModal } from './components/PerfumeDetailModal';
import { CSVImportModal } from './components/CSVImportModal';
import { LoginModal } from './components/LoginModal';
import { BestSellers } from './components/BestSellers';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AnnouncementBar } from './components/AnnouncementBar';
import { ToastNotification } from './components/ToastNotification';
import { OlfactoryFamilyExplorer } from './components/OlfactoryFamilyExplorer';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { ThankYouPage } from './components/ThankYouPage';
import { sendOrderConfirmationEmail } from './services/emailService';
import { AdminPage } from './components/admin/AdminPage';
import { CatalogSyncModal } from './components/CatalogSyncModal';
import { CatalogView } from './components/CatalogView';
import { SearchModal } from './components/SearchModal';

const logoBase64 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGc+CiAgICA8cGF0aCBkPSJNNzUgMzBDNDAgMzAgNDAgNjAgNDAgODBDNDAgMTAwIDUwIDExNSA3NSAxMTVDMTEwIDExNSAxMTAgODUgMTEwIDgwQzExMCA2MCAxMDAgMzAgNzUgMzBaTTYwIDgwQzYwIDcwIDcwIDcwIDc1IDcwQzc4IDcwIDg1IDcyIDg1IDgwQzg1IDkwIDgwIDEwMCA3NSAxMDBDNzAgMTAwIDYwIDkwIDYwIDgwWiIgZmlsbD0iI0RBQjE2MiIvPgogICAgPHBhdGggZD0iTTEyNSAxNzBDMTYwIDE3MCAxNjAgMTQwIDE2MCAxMjBDMTYwIDEwMCAxNTAgODUgMTI1IDg1QzkwIDg1IDkwIDExNSA5MCAxMjBDOTAgMTQwIDEwMCAxNzAgMTI1IDE3MFpNMTE1IDEyMEMxMTUgMTEwIDEyMCAxMDAgMTI1IDEwMEMxMzAgMTAwIDE0MCAxMTAgMTQwIDEyMEMxNDAgMTMwIDEzMCAxNjAgMTI1IDE2MEMxMjIgMTYwIDExNSAxNTggMTE1IDE1MFoiIGZpbGw9IiNEQUIxNjIiLz4KICAgIDx0ZXh0IHg9IjEwMCIgeT0iMTkwIiBmb250LWZhbWls eT0iJ1BsYXlmYWlyIERpc3BsYXknLCBzZXJpZiIgZm9udC1zaXplPSIzMCIgZmlsbD0iI0Y1RjVGNSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2NlbnRNYXJ0PC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==`;

type AppView = 'home' | 'cart' | 'checkout' | 'thankyou' | 'admin';

function App() {
  // --- STATE MANAGEMENT ---
  const [allPerfumes, setAllPerfumes] = useState<Perfume[]>(initialPerfumes);
  const [logoUrl, setLogoUrl] = useState<string>(logoBase64);
  const [view, setView] = useState<AppView>('home');

  // Modals State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCsvImportModalOpen, setIsCsvImportModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  // Data State
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [latestOrder, setLatestOrder] = useState<OrderDetails | null>(null);

  // UI State
  const [quizResults, setQuizResults] = useState<Perfume[] | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // --- REFS ---
  const catalogRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- GENERAL FUNCTIONS ---
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  // CORRECCIÓN: Parámetro 'ref' hecho opcional para arreglar el error de tipos.
  const navigateAndScroll = useCallback((ref?: React.RefObject<HTMLDivElement | null>) => {
    if (view !== 'home') {
      setView('home');
      // Esperamos un poco para que se renderice la vista 'home' antes de hacer scroll
      setTimeout(() => {
        if (ref && ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100); 
    } else {
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [view]);

  // --- HANDLERS ---
  const handleQuizSubmit = async (preferences: QuizPreferences) => {
    setQuizLoading(true);
    setQuizError(null);
    setQuizResults(null);
    try {
        const recommendedNames = await findMyScent(preferences, allPerfumes.filter(p => p.stock > 0));
        const results = allPerfumes.filter(p => recommendedNames.includes(p.name));
        setQuizResults(results);
    } catch (error) {
        setQuizError(error instanceof Error ? error.message : 'Ocurrió un error inesperado.');
    } finally {
        setQuizLoading(false);
    }
  };

  const handleViewDetails = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    setIsDetailModalOpen(true);
  };

  const handleAddToCart = (perfume: Perfume) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.perfume.id === perfume.id);
        if (existingItem) {
            return prevCart.map(item => 
                item.perfume.id === perfume.id 
                ? { ...item, quantity: Math.min(item.quantity + 1, perfume.stock) } 
                : item
            );
        }
        return [...prevCart, { perfume, quantity: 1 }];
    });
    showToast(`${perfume.name} añadido al carrito!`);
  };

  const handleUpdateQuantity = (perfumeId: number, newQuantity: number) => {
    setCart(prevCart => {
        const itemToUpdate = prevCart.find(item => item.perfume.id === perfumeId);
        if (!itemToUpdate) return prevCart;

        if (newQuantity <= 0) {
            return prevCart.filter(item => item.perfume.id !== perfumeId);
        }
        if (newQuantity > itemToUpdate.perfume.stock) {
            showToast(`Stock máximo para ${itemToUpdate.perfume.name} es ${itemToUpdate.perfume.stock}`, 'error');
            return prevCart.map(item => item.perfume.id === perfumeId ? { ...item, quantity: itemToUpdate.perfume.stock } : item);
        }
        return prevCart.map(item => item.perfume.id === perfumeId ? { ...item, quantity: newQuantity } : item);
    });
  };

  const handleRemoveFromCart = (perfumeId: number) => {
    setCart(prevCart => prevCart.filter(item => item.perfume.id !== perfumeId));
  };

  const handlePlaceOrder = async (orderDetails: OrderDetails) => {
    setLatestOrder(orderDetails);
    try {
        await sendOrderConfirmationEmail(orderDetails);
        showToast('¡Pedido confirmado! Revisa tu correo.', 'success');
    } catch (error) {
        console.error("Failed to send confirmation email:", error);
        showToast('Tu pedido fue creado, pero no pudimos enviar el correo.', 'error');
    }
    setCart([]);
    setView('thankyou');
  };

  const handleLogin = (user: string, pass: string) => {
    if (user === 'admin' && pass === '1234') {
        setIsAdminMode(true);
        setIsLoginModalOpen(false);
        setView('admin');
        showToast('Modo administrador activado.');
        return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    setView('home');
    showToast('Sesión de administrador cerrada.');
  };

  const handleUpdatePerfume = (updatedPerfume: Perfume) => {
    setAllPerfumes(prev => prev.map(p => p.id === updatedPerfume.id ? updatedPerfume : p));
    showToast(`${updatedPerfume.name} actualizado correctamente.`);
  };

  const handleAddNewPerfume = (newPerfume: Perfume) => {
    const perfumeWithId = { ...newPerfume, id: Date.now() };
    setAllPerfumes(prev => [perfumeWithId, ...prev]);
    showToast(`${perfumeWithId.name} añadido al catálogo.`);
  };

  const handleImportPerfumes = (newPerfumes: Perfume[]) => {
    setAllPerfumes(prev => [...newPerfumes, ...prev]);
    showToast(`${newPerfumes.length} productos importados con éxito.`);
    setIsCsvImportModalOpen(false);
  };

  const handleApplySyncChanges = (updatedPerfumes: Perfume[]) => {
    const updatedIds = new Set(updatedPerfumes.map(p => p.id));
    setAllPerfumes(prev => {
        const unchanged = prev.filter(p => !updatedIds.has(p.id));
        return [...updatedPerfumes, ...unchanged];
    });
    showToast(`${updatedPerfumes.length} productos actualizados desde la sincronización.`);
  };

  const handleUpdateLogo = (newLogoUrl: string) => {
    setLogoUrl(newLogoUrl);
    showToast('Logo actualizado con éxito.');
  };

  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const renderHomeView = () => (
    <>
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558560047-8ab75373a2e2?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 p-4">
              <h1 className="text-5xl md:text-7xl font-serif-display font-bold text-white leading-tight">Tu Aroma, Tu Historia.</h1>
              <p className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto">Más que perfumes, vendemos paisajes olfativos. Cada fragancia es una invitación a revivir un momento.</p>
              <button
                  onClick={() => setIsQuizOpen(true)}
                  className="mt-8 px-10 py-4 bg-[#E86A33] text-white font-bold rounded-full shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                  <SparklesIcon className="h-6 w-6" />
                  Descubre tu Aroma Ideal
              </button>
          </div>
          <div ref={quizRef} className="absolute bottom-0 h-1" />
      </section>
      
      <OlfactoryFamilyExplorer onFamilySelect={() => navigateAndScroll(catalogRef)} />

      <div ref={catalogRef}>
          <CatalogView perfumes={allPerfumes} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} isAdmin={isAdminMode} />
      </div>

      <div ref={bestSellersRef}>
          <BestSellers perfumes={allPerfumes} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} isAdmin={isAdminMode} />
      </div>
    </>
  );

  return (
    <div className="bg-[#224859] text-white">
      <AnnouncementBar />
      <Header
        isSticky={isSticky}
        cartItemCount={cartItemCount}
        onCartClick={() => setView('cart')}
        logoUrl={logoUrl}
        onSearchClick={() => setIsSearchModalOpen(true)}
        onNavigateToHome={() => navigateAndScroll()}
        onNavigateToShop={() => navigateAndScroll(catalogRef)}
        onNavigateToQuiz={() => navigateAndScroll(quizRef)}
        onNavigateToBestSellers={() => navigateAndScroll(bestSellersRef)}
      />

      <main>
        {view === 'home' && renderHomeView()}
        {view === 'cart' && <CartPage cart={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveFromCart} onGoToCheckout={() => setView('checkout')} onGoToShop={() => navigateAndScroll(catalogRef)} />}
        {view === 'checkout' && <CheckoutPage cart={cart} onPlaceOrder={handlePlaceOrder} onBackToCart={() => setView('cart')} />}
        {view === 'thankyou' && <ThankYouPage order={latestOrder} onGoToHome={() => setView('home')} />}
        {view === 'admin' && <AdminPage perfumes={allPerfumes} logoUrl={logoUrl} onAddNewPerfume={handleAddNewPerfume} onUpdatePerfume={handleUpdatePerfume} onUpdateLogo={handleUpdateLogo} onExitAdmin={() => setView('home')} onLogout={handleLogout} onOpenSyncModal={() => setIsSyncModalOpen(true)} onEditProduct={handleViewDetails} />}
      </main>

      <Footer
        isAdmin={isAdminMode}
        onNavigateToAdmin={() => isAdminMode ? setView('admin') : setIsLoginModalOpen(true)}
        onNavigateToHome={() => navigateAndScroll()}
        onNavigateToShop={() => navigateAndScroll(catalogRef)}
        onNavigateToQuiz={() => navigateAndScroll(quizRef)}
        onNavigateToBestSellers={() => navigateAndScroll(bestSellersRef)}
      />

      {isQuizOpen && <QuizModal onClose={() => setIsQuizOpen(false)} onSubmit={handleQuizSubmit} isLoading={quizLoading} error={quizError} results={quizResults} onViewDetails={handleViewDetails} />}
      {isDetailModalOpen && selectedPerfume && <PerfumeDetailModal perfume={selectedPerfume} onClose={() => setIsDetailModalOpen(false)} onUpdate={handleUpdatePerfume} isAdmin={isAdminMode} onAddToCart={handleAddToCart} />}
      {isCsvImportModalOpen && <CSVImportModal onClose={() => setIsCsvImportModalOpen(false)} onImport={handleImportPerfumes} currentPerfumes={allPerfumes} />}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />}
      {isSyncModalOpen && <CatalogSyncModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} perfumes={allPerfumes} onApplyChanges={handleApplySyncChanges} />}
      {isSearchModalOpen && <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} perfumes={allPerfumes} onViewDetails={handleViewDetails} />}
      
      {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <WhatsAppButton />
    </div>
  );
}

export default App;