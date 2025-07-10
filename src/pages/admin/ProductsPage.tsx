import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Plus, 
  Filter, 
  Search, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Star,
  Tag,
  Calendar
} from 'lucide-react';
import { ModernKPICard } from '../../components/shared/ModernKPICard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  inventory: number;
  sku: string;
  tags: string[];
  rating: number;
  salesCount: number;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

const productsData: Product[] = [
  {
    id: '1',
    name: 'CRM Starter Package',
    description: 'Complete CRM solution for small businesses',
    category: 'Software',
    price: 29.99,
    currency: 'USD',
    status: 'active',
    inventory: 999,
    sku: 'CRM-STARTER-001',
    tags: ['CRM', 'Business', 'Software'],
    rating: 4.5,
    salesCount: 156,
    revenue: 4680.44,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-18T14:30:00Z'
  },
  {
    id: '2',
    name: 'Marketing Automation Suite',
    description: 'Advanced marketing automation tools',
    category: 'Marketing',
    price: 99.99,
    currency: 'USD',
    status: 'active',
    inventory: 500,
    sku: 'MKT-AUTO-002',
    tags: ['Marketing', 'Automation', 'Email'],
    rating: 4.8,
    salesCount: 89,
    revenue: 8899.11,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-17T16:45:00Z'
  },
  {
    id: '3',
    name: 'Sales Training Course',
    description: 'Comprehensive sales training program',
    category: 'Education',
    price: 199.99,
    currency: 'USD',
    status: 'active',
    inventory: 200,
    sku: 'EDU-SALES-003',
    tags: ['Training', 'Sales', 'Education'],
    rating: 4.7,
    salesCount: 45,
    revenue: 8999.55,
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-16T10:20:00Z'
  },
  {
    id: '4',
    name: 'Analytics Dashboard Pro',
    description: 'Advanced analytics and reporting dashboard',
    category: 'Analytics',
    price: 149.99,
    currency: 'USD',
    status: 'draft',
    inventory: 0,
    sku: 'ANALYTICS-PRO-004',
    tags: ['Analytics', 'Dashboard', 'Reporting'],
    rating: 0,
    salesCount: 0,
    revenue: 0,
    createdAt: '2024-01-20T08:00:00Z',
    updatedAt: '2024-01-20T08:00:00Z'
  },
  {
    id: '5',
    name: 'Customer Support Tools',
    description: 'Complete customer support solution',
    category: 'Support',
    price: 79.99,
    currency: 'USD',
    status: 'active',
    inventory: 750,
    sku: 'SUPPORT-TOOLS-005',
    tags: ['Support', 'Customer Service', 'Help Desk'],
    rating: 4.6,
    salesCount: 234,
    revenue: 18717.66,
    createdAt: '2024-01-12T13:00:00Z',
    updatedAt: '2024-01-19T12:15:00Z'
  }
];

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'archived': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Software': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Marketing': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Education': return 'bg-green-50 text-green-700 border-green-200';
      case 'Analytics': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Support': return 'bg-pink-50 text-pink-700 border-pink-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredProducts = productsData.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'all' || product.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const productStats = {
    total: productsData.length,
    active: productsData.filter(p => p.status === 'active').length,
    totalRevenue: productsData.reduce((sum, p) => sum + p.revenue, 0),
    totalSales: productsData.reduce((sum, p) => sum + p.salesCount, 0),
    averageRating: productsData.filter(p => p.rating > 0).reduce((sum, p) => sum + p.rating, 0) / productsData.filter(p => p.rating > 0).length || 0
  };

  const handleEditProduct = (productId: string) => {
    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = (productId: string) => {
    console.log('Delete product:', productId);
  };

  const handleViewProduct = (productId: string) => {
    console.log('View product:', productId);
  };

  const handleDuplicateProduct = (productId: string) => {
    console.log('Duplicate product:', productId);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your products, services, and offerings</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Product
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <ModernKPICard
          title="Total Products"
          value={productStats.total.toString()}
          icon={Package}
          change={{ value: `${productStats.active} active`, trend: "neutral" }}
          gradient="from-blue-500 to-blue-600"
        />
        <ModernKPICard
          title="Active Products"
          value={productStats.active.toString()}
          icon={ShoppingCart}
          change={{ value: "Available for sale", trend: "neutral" }}
          gradient="from-green-500 to-green-600"
        />
        <ModernKPICard
          title="Total Revenue"
          value={formatPrice(productStats.totalRevenue, 'USD')}
          icon={DollarSign}
          change={{ value: "From all products", trend: "up" }}
          gradient="from-purple-500 to-purple-600"
        />
        <ModernKPICard
          title="Total Sales"
          value={productStats.totalSales.toString()}
          icon={TrendingUp}
          change={{ value: "Units sold", trend: "up" }}
          gradient="from-orange-500 to-orange-600"
        />
        <ModernKPICard
          title="Avg Rating"
          value={productStats.averageRating.toFixed(1)}
          icon={Star}
          change={{ value: "Customer satisfaction", trend: "neutral" }}
          gradient="from-yellow-500 to-yellow-600"
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>View and manage all your products and services</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setActiveTab('all')}>
                All Products
                <Badge variant="secondary" className="ml-2">{productStats.total}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active" onClick={() => setActiveTab('active')}>
                Active
                <Badge variant="secondary" className="ml-2">{productStats.active}</Badge>
              </TabsTrigger>
              <TabsTrigger value="draft" onClick={() => setActiveTab('draft')}>
                Draft
              </TabsTrigger>
              <TabsTrigger value="inactive" onClick={() => setActiveTab('inactive')}>
                Inactive
              </TabsTrigger>
              <TabsTrigger value="analytics">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.sku}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(product.category)}>
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatPrice(product.price, product.currency)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {product.inventory > 0 ? product.inventory : 'Out of stock'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {product.salesCount} sold
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{product.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicateProduct(product.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Products</CardTitle>
                    <CardDescription>Products with highest revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {productsData
                        .filter(p => p.revenue > 0)
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 5)
                        .map((product) => (
                          <div key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <Package className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.salesCount} sales</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium">
                              {formatPrice(product.revenue, product.currency)}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Categories</CardTitle>
                    <CardDescription>Revenue by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from(new Set(productsData.map(p => p.category))).map((category) => {
                        const categoryProducts = productsData.filter(p => p.category === category);
                        const categoryRevenue = categoryProducts.reduce((sum, p) => sum + p.revenue, 0);
                        const categorySales = categoryProducts.reduce((sum, p) => sum + p.salesCount, 0);
                        
                        return (
                          <div key={category} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                <Tag className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{category}</div>
                                <div className="text-xs text-gray-500">{categorySales} sales</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium">
                              {formatPrice(categoryRevenue, 'USD')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest product updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productsData
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .slice(0, 5)
                      .map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{product.name}</div>
                              <div className="text-xs text-gray-500">
                                Updated {formatDate(product.updatedAt)}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(product.status)}>
                            {product.status}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 