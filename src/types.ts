
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
  images?: string[];
  gender: 'Hombre' | 'Mujer' | 'Unisex';
  olfactoryFamily: OlfactoryFamily;
  details?: PerfumeDetails;
  officialUrl?: string;
  sales?: number;
  rating?: number;
  reviewCount?: number;
  sku?: string;
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

export interface CartItem {
  perfume: Perfume;
  quantity: number;
}

export interface OrderDetails {
  customer: {
    name: string;
    address: string;
    addressDetails?: string;
    city: string;
    whatsapp: string;
    email: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'card';
  orderNumber: string;
}
