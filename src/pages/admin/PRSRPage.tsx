import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Download, 
  Upload, 
  Users,
  Package,
  ShoppingCart,
  Target,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { PRSRDrawerForm } from '../../components/pr-sr/PRSRDrawerForm';
import { ProductServiceForm } from '../../components/pr-sr/ProductServiceForm';
import { RegeneratedPRSRTable } from '../../components/pr-sr/RegeneratedPRSRTable';
import { PRSRAdvancedFilters } from '../../components/pr-sr/PRSRAdvancedFilters';
import { PRSR } from '@/types/pr-sr';

// Define the comprehensive ProductService type
interface ProductServiceFormData {
  item_type: 'Product' | 'Service';
  name: string;
  sku: string;
  description: string;
  category: string;
  product_type?: 'Physical Item' | 'Digital Download';
  price: number;
  compare_price?: number;
  has_variants?: boolean;
  variant_options?: Array<{
    name: string;
    values: string;
    priceModifier: number;
  }>;
  service_type?: 'One-time Service' | 'Recurring Service';
  duration?: string;
  booking_required?: boolean;
  track_inventory?: boolean;
  quantity?: number;
  low_stock_threshold?: number;
  allow_backorders?: boolean;
  unlimited_quantity?: boolean;
  requires_shipping?: boolean;
  weight?: number;
  weight_unit?: 'kg' | 'lb' | 'g' | 'oz';
  shipping_class?: 'Standard' | 'Express' | 'Free' | 'Heavy Item';
  free_shipping_over?: number;
  featured_image?: string;
  gallery_images?: string[];
  product_video_url?: string;
  add_custom_fields?: boolean;
  custom_fields?: Array<{
    name: string;
    type: 'Text' | 'Number' | 'Date' | 'Dropdown' | 'Checkbox';
    value: string;
    required: boolean;
  }>;
  status: 'Active' | 'Inactive' | 'Draft';
  featured?: boolean;
  tax_included?: boolean;
  seo_title?: string;
  seo_description?: string;
}

export const PRSRPage: React.FC = () => {
  const [showPRSRForm, setShowPRSRForm] = useState(false);
  const [showProductServiceForm, setShowProductServiceForm] = useState(false);
  const [selectedPRSR, setSelectedPRSR] = useState<PRSR | null>(null);
  const [selectedProductService, setSelectedProductService] = useState<ProductServiceFormData | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    source: 'all',
    priority: 'all',
    industry: 'all',
    media_type: 'all',
    contact_owner: 'all',
    dateRange: {
      from: undefined,
      to: undefined
    }
  });

  const handleAddProductService = () => {
    setSelectedProductService(null);
    setShowProductServiceForm(true);
  };

  const handleEditPRSR = (prsr: PRSR) => {
    setSelectedPRSR(prsr);
    setShowPRSRForm(true);
  };

  const handleSavePRSR = (prsrData: PRSR) => {
    console.log('Saving PR/SR Contact:', prsrData);
    setShowPRSRForm(false);
    setSelectedPRSR(null);
    toast.success(selectedPRSR ? 'PR/SR contact updated successfully!' : 'PR/SR contact created successfully!');
  };

  const handleSaveProductService = (productServiceData: ProductServiceFormData) => {
    console.log('Saving Product/Service:', productServiceData);
    setShowProductServiceForm(false);
    setSelectedProductService(null);
    toast.success(selectedProductService ? 'Product/Service updated successfully!' : 'Product/Service created successfully!');
  };

  const kpiData = [
    { 
      title: 'Total Products', 
      value: '5', 
      subtitle: '4 active',
      change: { value: '+2 this month', trend: 'up' as const }, 
      icon: Package,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    { 
      title: 'Active Products', 
      value: '4', 
      subtitle: 'Available for sale',
      change: { value: '+1 this week', trend: 'up' as const }, 
      icon: ShoppingCart,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    { 
      title: 'Total Revenue', 
      value: '$41,296.76', 
      subtitle: 'From all products',
      change: { value: '+12.5%', trend: 'up' as const }, 
      icon: DollarSign,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    { 
      title: 'Total Sales', 
      value: '524', 
      subtitle: 'Units sold',
      change: { value: '+18.2%', trend: 'up' as const }, 
      icon: TrendingUp,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Products & Services</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your products and services catalog</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-gray-300">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddProductService} className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product/Service
            </Button>
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="shadow-sm border-0 bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{kpi.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{kpi.subtitle}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-green-600 font-medium">{kpi.change.value}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.iconBg}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advanced Filters */}
        <PRSRAdvancedFilters 
          filters={filters}
          onFiltersChange={setFilters}
          filteredCount={847}
        />

        {/* Main Content */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardContent className="p-6">
            <RegeneratedPRSRTable 
              searchTerm={filters.search}
              sourceFilter={filters.source}
              statusFilter={filters.status}
              typeFilter={filters.type !== 'all' ? filters.type : undefined}
              onEdit={handleEditPRSR}
            />
          </CardContent>
        </Card>
      </div>

      {/* PR/SR Contact Form */}
      <PRSRDrawerForm
        isOpen={showPRSRForm} 
        onClose={() => {
          setShowPRSRForm(false);
          setSelectedPRSR(null);
        }} 
        onSubmit={handleSavePRSR} 
        prsr={selectedPRSR} 
      />

      {/* Product/Service Form */}
      <ProductServiceForm
        isOpen={showProductServiceForm} 
        onClose={() => {
          setShowProductServiceForm(false);
          setSelectedProductService(null);
        }} 
        onSubmit={handleSaveProductService} 
        productService={selectedProductService} 
      />
    </div>
  );
};
