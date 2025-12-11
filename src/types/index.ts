export interface Product {
  id: string;
  sku: string;
  name: string;
  category_id: string;
  brand: string;
  short_description: string;
  long_description: string;
  price: {
    current: number;
    original: number;
    currency: string;
  };
  images: string[];
  specifications: Array<{
    key: string;
    value: string;
  }>;
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock';
  average_rating: number;
  review_count: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id: string | null;
}

export interface RepairService {
  id: string;
  service_name: string;
  description: string;
  short_description: string;
  base_price: number;
  duration_estimate: string;
  home_visit_available: boolean;
  image: string;
  popular: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified_purchase: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ServiceBooking {
  id: string;
  service_id: string;
  user_id: string;
  date: string;
  time_slot: string;
  address_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  is_home_visit: boolean;
}