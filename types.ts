export interface PerfumeDetails {
  description: string;
  olfactoryNotes: string;
  concept: string;
  applicationPoint: string;
}

export type OlfactoryFamily = 'Floral' | 'Oriental' | 'Amaderado' | 'Cítrico' | 'Aromático';

export interface Perfume {
  id: number;
  name: string;
  brand: string;
  volume: string;
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl: string;
  gender: 'Hombre' | 'Mujer' | 'Unisex';
  olfactoryFamily: OlfactoryFamily;
  details?: PerfumeDetails;
  officialUrl?: string;
  sales?: number;
  rating?: number;
  reviewCount?: number;
}

export interface RecommendedPerfume {
  name: string;
  story: string;
  pyramid: {
    top: string;
    heart: string;
    base: string;
  };
}

export interface QuizPreferences {
  landscape: string;
  sensation: string;
  timeOfDay: string;
}
