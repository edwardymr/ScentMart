
export interface PerfumeDetails {
  aroma: string[];
  family: string;
  size: string;
  ingredients: string;
  perfumerNote: string;
}

export interface Perfume {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  imageUrl: string;
  details?: PerfumeDetails;
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
