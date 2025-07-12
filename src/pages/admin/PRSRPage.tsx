
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
import { PRSRDrawerForm } from '../../components/pr-sr/PRSRDrawerForm';
import { ProductServiceDrawerForm } from '../../components/pr-sr/ProductServiceDrawerForm';
import { RegeneratedPRSRTable } from '../../components/pr-sr/RegeneratedPRSRTable';
import { PRSRAdvancedFilters } from '../../components/pr-sr/PRSRAdvancedFilters';
import { PRSR } from '@/types/pr-sr';
import { ProductService } from '@/types/products-services';

export const PRSRPage: React.FC = () => {
  const [showPRSRForm, setShowPRSRForm] = useState(false);
  const [showProductServiceForm, setShowProductServiceForm] = useState(false);
  const [selectedPRSR, setSelectedPRSR] = useState<PRSR | null>(null);
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

  const handleSaveProductService = (productServiceData: ProductService) => {
    console.log('Saving Product/Service:', productServiceData);
    setShowProductServiceForm(false);
    setSelectedProductService(null);
    toast.success(selectedProductService ? 'Product/Service updated successfully!' : 'Product/Service created successfully!');
  };

  const kpiData = [
    { 
      title: 'Total PR/SR Contacts', 
      value: '847', 
      change: { value: '+12.5%', trend: 'up' as const }, 
      icon: Users 
    },
    { 
      title: 'Active PR Contacts', 
      value: '523', 
      change: { value: '+18.2%', trend: 'up' as const }, 
      icon: Package 
    },
    { 
      title: 'Active SR Contacts', 
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">PR & SR Contacts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your public relations and social responsibility contacts</p>
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
      <ProductServiceDrawerForm
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
