
import React, { useState, useMemo } from 'react';
import { type Perfume, type OlfactoryFamily } from '../types';
import { FilterSidebar } from './FilterSidebar';
import { SortBar } from './SortBar';
import { PerfumeCard } from './PerfumeCard';
import { XMarkIcon } from './icons';

interface CatalogViewProps {
  perfumes: Perfume[];
  onViewDetails: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume) => void;
  isAdmin: boolean;
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'newest';

export interface Filters {
    gender: ('Hombre' | 'Mujer' | 'Unisex')[];
    olfactoryFamily: OlfactoryFamily[];
    priceRange: [number, number];
}

const olfactoryFamilies: OlfactoryFamily[] = ['Floral', 'Oriental', 'Amaderado', 'Cítrico', 'Aromático'];
const genders: ('Hombre' | 'Mujer' | 'Unisex')[] = ['Hombre', 'Mujer', 'Unisex'];


export const CatalogView: React.FC<CatalogViewProps> = ({ perfumes, onViewDetails, onAddToCart, isAdmin }) => {
    const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    
    const { minPrice, maxPrice } = useMemo(() => {
        if (perfumes.length === 0) return { minPrice: 0, maxPrice: 150000 };
        const prices = perfumes.map(p => p.price);
        return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
    }, [perfumes]);

    const initialFilters: Filters = {
        gender: [],
        olfactoryFamily: [],
        priceRange: [minPrice, maxPrice]
    };

    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [sortBy, setSortBy] = useState<SortOption>('relevance');

    const filteredAndSortedPerfumes = useMemo(() => {
        let filtered = [...perfumes];

        // Apply gender filter
        if (filters.gender.length > 0) {
            filtered = filtered.filter(p => filters.gender.includes(p.gender));
        }

        // Apply olfactory family filter
        if (filters.olfactoryFamily.length > 0) {
            filtered = filtered.filter(p => filters.olfactoryFamily.includes(p.olfactoryFamily));
        }

        // Apply price range filter
        filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

        // Apply sorting
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                 // Assuming higher ID means newer
                filtered.sort((a, b) => b.id - a.id);
                break;
            case 'relevance':
            default:
                 // Sort by sales desc, then rating desc
                filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0) || (b.rating || 0) - (a.rating || 0));
                break;
        }

        return filtered;
    }, [perfumes, filters, sortBy]);

    const handleFilterChange = (filterType: keyof Filters, value: any) => {
        setFilters(prev => {
            if (Array.isArray(prev[filterType])) {
                 const currentValues = prev[filterType] as string[];
                 const newValues = currentValues.includes(value)
                    ? currentValues.filter(v => v !== value)
                    : [...currentValues, value];
                return { ...prev, [filterType]: newValues };
            }
            return { ...prev, [filterType]: value };
        });
    };
    
    const handleClearFilters = () => {
        setFilters(initialFilters);
    };

    return (
        <section className="bg-[#1c3a4a] py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif-display font-bold text-[#DAB162]">Nuestra Colección</h2>
                    <p className="mt-2 text-lg max-w-2xl mx-auto text-gray-300">Explora un mundo de aromas y encuentra la fragancia que cuenta tu historia.</p>
                </div>
                
                <div className="flex items-start gap-8">
                    {/* --- Desktop Sidebar --- */}
                    <aside className="hidden md:block w-1/4 lg:w-1/5 sticky top-28">
                        <FilterSidebar 
                           filters={filters}
                           onFilterChange={handleFilterChange}
                           onClearFilters={handleClearFilters}
                           priceConfig={{ min: minPrice, max: maxPrice }}
                           olfactoryFamilies={olfactoryFamilies}
                           genders={genders}
                        />
                    </aside>

                    {/* --- Mobile Sidebar Overlay --- */}
                    {isMobileFiltersOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden" onClick={() => setMobileFiltersOpen(false)}>
                            <div 
                                className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-[#1c3a4a] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-4 h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-white">Filtrar por</h3>
                                        <button onClick={() => setMobileFiltersOpen(false)} className="p-1">
                                            <XMarkIcon className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>
                                    <div className="flex-grow overflow-y-auto pr-2">
                                        <FilterSidebar 
                                            filters={filters}
                                            onFilterChange={handleFilterChange}
                                            onClearFilters={handleClearFilters}
                                            priceConfig={{ min: minPrice, max: maxPrice }}
                                            olfactoryFamilies={olfactoryFamilies}
                                            genders={genders}
                                        />
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-[#3a6a82]">
                                        <button 
                                            onClick={() => setMobileFiltersOpen(false)}
                                            className="w-full px-6 py-3 bg-[#E86A33] text-white font-bold rounded-full shadow-lg"
                                        >
                                            Ver {filteredAndSortedPerfumes.length} resultados
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- Main Content --- */}
                    <main className="flex-1">
                        <SortBar 
                            resultCount={filteredAndSortedPerfumes.length}
                            totalCount={perfumes.length}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            onFilterClick={() => setMobileFiltersOpen(true)}
                        />
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAndSortedPerfumes.length > 0 ? (
                                filteredAndSortedPerfumes.map(perfume => (
                                    <PerfumeCard
                                        key={perfume.id}
                                        perfume={perfume}
                                        onViewDetails={onViewDetails}
                                        onAddToCart={onAddToCart}
                                        isAdmin={isAdmin}
                                    />
                                ))
                            ) : (
                                <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-16">
                                    <h3 className="text-xl font-semibold text-white">No se encontraron resultados</h3>
                                    <p className="text-gray-400 mt-2">Intenta ajustar tus filtros para encontrar tu aroma perfecto.</p>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </section>
    );
};
