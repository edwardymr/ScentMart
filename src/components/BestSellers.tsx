
import React, { useMemo } from 'react';
import { type Perfume } from '../types';
import { PerfumeCard } from './PerfumeCard';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';

// --- Main BestSellers Component ---
interface BestSellersProps {
    perfumes: Perfume[];
    onViewDetails: (perfume: Perfume) => void;
    onAddToCart: (perfume: Perfume) => void;
    isAdmin: boolean;
}

export const BestSellers: React.FC<BestSellersProps> = ({ perfumes, onViewDetails, onAddToCart, isAdmin }) => {
    const bestSellers = useMemo(() => {
        return [...perfumes]
            .filter(p => p.sales && p.sales > 0)
            .sort((a, b) => (b.sales || 0) - (a.sales || 0))
            .slice(0, 10); // Use top 10 best sellers for variety in the carousel
    }, [perfumes]);

    if (bestSellers.length === 0) {
        return null;
    }

    return (
        <section className="py-16 sm:py-24 bg-[#224859]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif-display font-bold text-[#DAB162]">Las Joyas de la Corona</h2>
                    <p className="mt-2 text-lg max-w-2xl mx-auto text-gray-300">Descubre las fragancias que han cautivado a nuestros clientes.</p>
                </div>
                <Swiper
                    modules={[Autoplay, Navigation, Pagination, A11y]}
                    spaceBetween={16}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: true, // This stops autoplay on manual interaction
                        pauseOnMouseEnter: true, // This pauses autoplay on hover
                    }}
                    navigation={true}
                    pagination={{ clickable: true }}
                    speed={800} // Smooth transition speed
                    breakpoints={{
                        600: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="pb-12" // Add padding-bottom for pagination bullets
                >
                    {bestSellers.map(perfume => (
                        <SwiperSlide key={perfume.id} className="h-full">
                            <PerfumeCard 
                                perfume={perfume} 
                                onViewDetails={onViewDetails} 
                                onAddToCart={onAddToCart} 
                                isAdmin={isAdmin}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};
