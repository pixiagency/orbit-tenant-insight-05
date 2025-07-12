
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  List,
  Grid3X3,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Target,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import { RegeneratedPRSRForm } from '../../components/pr-sr/RegeneratedPRSRForm';
import { RegeneratedPRSRTable } from '../../components/pr-sr/RegeneratedPRSRTable';
import { PRSR } from '@/types/pr-sr';

export const PRSRPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPRSRForm, setShowPRSRForm] = useState(false);
  const [selectedPRSR, setSelectedPRSR] = useState<PRSR | null>(null);

  const handleAddPRSR = () => {
    setSelectedPRSR(null);
    setShowPRSRForm(true);
  };

  const handleEditPRSR = (prsr: PRSR) => {
    setSelectedPRSR(prsr);
    setShowPRSRForm(true);
  };

  const handleSavePRSR = (prsrData: PRSR) => {
    console.log('Saving PR/SR:', prsrData);
    setShowPRSRForm(false);
    setSelectedPRSR(null);
    toast.success(selectedPRSR ? 'Contact updated successfully!' : 'Contact created successfully!');
  };

  const kpiData = [
    { 
      title: 'Total Contacts', 
      value: '847', 
      change: { value: '+12.5%', trend: 'up' as const }, 
      icon: Users 
    },
    { 
      title: 'Product Contacts', 
      value: '523', 
      change: { value: '+18.2%', trend: 'up' as const }, 
      icon: Package 
    },
    { 
      title: 'Service Contacts', 
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Product & Service Relations</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage contacts for products and services</p>
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
            <Button onClick={handleAddPRSR} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <ModernKPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Contact Management
              </CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search contacts, companies, or roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-40 bg-white dark:bg-gray-700">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="trade show">Trade Show</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 bg-white dark:bg-gray-700">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <TabsList className="grid w-full grid-cols-4 bg-transparent h-12 p-0">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none h-full"
                  >
                    All Contacts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="products" 
                    className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none h-full"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </TabsTrigger>
                  <TabsTrigger 
                    value="services" 
                    className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none h-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger 
                    value="qualified" 
                    className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none h-full"
                  >
                    Qualified
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <RegeneratedPRSRTable 
                  searchTerm={searchTerm}
                  sourceFilter={sourceFilter}
                  statusFilter={statusFilter}
                  onEdit={handleEditPRSR}
                />
              </TabsContent>
              
              <TabsContent value="products" className="mt-0">
                <RegeneratedPRSRTable 
                  searchTerm={searchTerm}
                  sourceFilter={sourceFilter}
                  statusFilter={statusFilter}
                  typeFilter="pr"
                  onEdit={handleEditPRSR}
                />
              </TabsContent>
              
              <TabsContent value="services" className="mt-0">
                <RegeneratedPRSRTable 
                  searchTerm={searchTerm}
                  sourceFilter={sourceFilter}
                  statusFilter={statusFilter}
                  typeFilter="sr"
                  onEdit={handleEditPRSR}
                />
              </TabsContent>

              <TabsContent value="qualified" className="mt-0">
                <RegeneratedPRSRTable 
                  searchTerm={searchTerm}
                  sourceFilter={sourceFilter}
                  statusFilter="qualified"
                  onEdit={handleEditPRSR}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <RegeneratedPRSRForm 
        isOpen={showPRSRForm} 
        onClose={() => {
          setShowPRSRForm(false);
          setSelectedPRSR(null);
        }} 
        onSubmit={handleSavePRSR} 
        prsr={selectedPRSR} 
      />
    </div>
  );
};
