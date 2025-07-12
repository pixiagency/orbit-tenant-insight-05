
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
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { ProductServiceForm } from '../../components/pr-sr/ProductServiceForm';
import { RegeneratedPRSRTable } from '../../components/pr-sr/RegeneratedPRSRTable';
import { PRSRAdvancedFilters } from '../../components/pr-sr/PRSRAdvancedFilters';
import { ProductService } from '@/types/products-services';

export const PRSRPage: React.FC = () => {
  const [showProductServiceForm, setShowProductServiceForm] = useState(false);
  const [selectedProductService, setSelectedProductService] = useState<ProductService | null>(null);
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

  const handleEditProductService = (productService: ProductService) => {
    setSelectedProductService(productService);
    setShowProductServiceForm(true);
  };

  const handleSaveProductService = (productServiceData: ProductService) => {
    console.log('Saving Product/Service:', productServiceData);
    setShowProductServiceForm(false);
    setSelectedProductService(null);
    toast.success(selectedProductService ? 'Product/Service updated successfully!' : 'Product/Service created successfully!');
  };

  const kpiData = [
    { 
      title: 'Total Products/Services', 
      value: '847', 
      change: { value: '+12.5%', trend: 'up' as const }, 
      icon: Users 
    },
    { 
      title: 'Active Products', 
      value: '523', 
      change: { value: '+18.2%', trend: 'up' as const }, 
      icon: Package 
    },
    { 
      title: 'Active Services', 
      value: '324', 
      change: { value: '+8.7%', trend: 'up' as const }, 
      icon: ShoppingCart 
    },
    { 
      title: 'Conversion Rate', 
      value: '42.3%', 
      change: { value: '+5.2%', trend: 'up' as const }, 
      icon: Target 
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
            <Button onClick={handleAddProductService} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product/Service
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <ModernKPICard key={index} {...kpi} />
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
              onEdit={handleEditProductService}
            />
          </CardContent>
        </Card>
      </div>

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
