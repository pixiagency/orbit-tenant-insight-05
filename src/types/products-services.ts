
export interface ProductService {
  id?: string;
  name: string;
  type: 'product' | 'service';
  category: string;
  description?: string;
  price?: number;
  currency?: string;
  sku?: string;
  status: 'Active' | 'Inactive' | 'Discontinued' | 'Coming Soon';
  features?: string[];
  specifications?: {
    [key: string]: string;
  };
  images?: string[];
  documents?: string[];
  availability: 'In Stock' | 'Out of Stock' | 'On Demand' | 'Limited';
  minimum_order_quantity?: number;
  lead_time?: string;
  warranty_period?: string;
  support_level?: 'Basic' | 'Standard' | 'Premium' | 'Enterprise';
  tags?: string[];
  created_date: string;
  modified_date: string;
  created_by?: string;
  department?: string;
  target_market?: string[];
  competitor_products?: string[];
  launch_date?: string;
  end_of_life_date?: string;
}
