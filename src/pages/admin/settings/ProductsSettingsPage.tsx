import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  DollarSign, 
  Tag, 
  Settings,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  Palette,
  BarChart3,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  isDefault: boolean;
  parentId?: string;
}

interface ProductStatus {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
}

interface ProductSettings {
  enableInventoryTracking: boolean;
  enableLowStockAlerts: boolean;
  lowStockThreshold: number;
  enableProductVariants: boolean;
  enableProductImages: boolean;
  maxImagesPerProduct: number;
  enableProductReviews: boolean;
  requireApprovalForReviews: boolean;
  enableDiscounts: boolean;
  enableBulkPricing: boolean;
  defaultCurrency: string;
  taxIncluded: boolean;
  defaultTaxRate: number;
  enableSKUGeneration: boolean;
  skuPrefix: string;
  enableBarcode: boolean;
  categories: ProductCategory[];
  statuses: ProductStatus[];
  pricingSettings: {
    enableDynamicPricing: boolean;
    markup: number;
    minimumMargin: number;
    enableCostTracking: boolean;
  };
}

export const ProductsSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<ProductSettings>({
    enableInventoryTracking: true,
    enableLowStockAlerts: true,
    lowStockThreshold: 10,
    enableProductVariants: true,
    enableProductImages: true,
    maxImagesPerProduct: 5,
    enableProductReviews: false,
    requireApprovalForReviews: true,
    enableDiscounts: true,
    enableBulkPricing: false,
    defaultCurrency: 'USD',
    taxIncluded: false,
    defaultTaxRate: 0,
    enableSKUGeneration: true,
    skuPrefix: 'PRD',
    enableBarcode: false,
    categories: [
      { id: '1', name: 'Software', description: 'Software products and licenses', color: 'blue', isDefault: true },
      { id: '2', name: 'Hardware', description: 'Physical hardware products', color: 'gray', isDefault: true },
      { id: '3', name: 'Services', description: 'Service-based products', color: 'green', isDefault: true },
      { id: '4', name: 'Consulting', description: 'Consulting and professional services', color: 'purple', isDefault: true },
    ],
    statuses: [
      { id: '1', name: 'Active', color: 'green', isActive: true, isDefault: true },
      { id: '2', name: 'Draft', color: 'yellow', isActive: false, isDefault: true },
      { id: '3', name: 'Discontinued', color: 'red', isActive: false, isDefault: true },
      { id: '4', name: 'Out of Stock', color: 'orange', isActive: false, isDefault: true },
    ],
    pricingSettings: {
      enableDynamicPricing: false,
      markup: 50,
      minimumMargin: 20,
      enableCostTracking: true,
    }
  });

  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: 'blue' });
  const [newStatus, setNewStatus] = useState({ name: '', color: 'blue', isActive: true });

  const handleSaveSettings = () => {
    // Save settings logic here
    toast.success('Product settings saved successfully!');
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const category: ProductCategory = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
      isDefault: false
    };

    setSettings(prev => ({
      ...prev,
      categories: [...prev.categories, category]
    }));

    setNewCategory({ name: '', description: '', color: 'blue' });
    toast.success('Category added successfully!');
  };

  const handleAddStatus = () => {
    if (!newStatus.name.trim()) {
      toast.error('Status name is required');
      return;
    }

    const status: ProductStatus = {
      id: Date.now().toString(),
      name: newStatus.name,
      color: newStatus.color,
      isActive: newStatus.isActive,
      isDefault: false
    };

    setSettings(prev => ({
      ...prev,
      statuses: [...prev.statuses, status]
    }));

    setNewStatus({ name: '', color: 'blue', isActive: true });
    toast.success('Status added successfully!');
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = settings.categories.find(c => c.id === categoryId);
    if (category?.isDefault) {
      toast.error('Cannot delete default categories');
      return;
    }

    setSettings(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== categoryId)
    }));
    toast.success('Category deleted successfully!');
  };

  const handleDeleteStatus = (statusId: string) => {
    const status = settings.statuses.find(s => s.id === statusId);
    if (status?.isDefault) {
      toast.error('Cannot delete default statuses');
      return;
    }

    setSettings(prev => ({
      ...prev,
      statuses: prev.statuses.filter(s => s.id !== statusId)
    }));
    toast.success('Status deleted successfully!');
  };

  const getColorBadge = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      gray: 'bg-gray-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500',
      teal: 'bg-teal-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500';
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Package className="h-6 w-6" />
            Products Settings
          </h1>
          <p className="text-muted-foreground">Configure product management settings and catalogs</p>
        </div>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="statuses">Statuses</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Product Settings
              </CardTitle>
              <CardDescription>
                Configure basic product management preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select 
                    value={settings.defaultCurrency} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, defaultCurrency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={settings.defaultTaxRate}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skuPrefix">SKU Prefix</Label>
                  <Input
                    id="skuPrefix"
                    value={settings.skuPrefix}
                    onChange={(e) => setSettings(prev => ({ ...prev, skuPrefix: e.target.value }))}
                    placeholder="PRD"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxImages">Max Images per Product</Label>
                  <Input
                    id="maxImages"
                    type="number"
                    min="1"
                    max="20"
                    value={settings.maxImagesPerProduct}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxImagesPerProduct: parseInt(e.target.value) || 5 }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Product Variants</Label>
                    <p className="text-sm text-muted-foreground">Allow products to have size, color, and other variants</p>
                  </div>
                  <Switch
                    checked={settings.enableProductVariants}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableProductVariants: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Product Images</Label>
                    <p className="text-sm text-muted-foreground">Allow image uploads for products</p>
                  </div>
                  <Switch
                    checked={settings.enableProductImages}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableProductImages: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable SKU Auto-Generation</Label>
                    <p className="text-sm text-muted-foreground">Automatically generate SKUs for new products</p>
                  </div>
                  <Switch
                    checked={settings.enableSKUGeneration}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSKUGeneration: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Barcode Support</Label>
                    <p className="text-sm text-muted-foreground">Add barcode fields to products</p>
                  </div>
                  <Switch
                    checked={settings.enableBarcode}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableBarcode: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Tax Included in Price</Label>
                    <p className="text-sm text-muted-foreground">Product prices include tax by default</p>
                  </div>
                  <Switch
                    checked={settings.taxIncluded}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, taxIncluded: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {/* Product Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Product Categories
              </CardTitle>
              <CardDescription>
                Organize your products into categories for better management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Categories */}
              <div className="space-y-3">
                {settings.categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getColorBadge(category.color)}`} />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.description}
                          {category.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!category.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Add New Category */}
              <div className="space-y-4">
                <h4 className="font-medium">Add New Category</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category Name</Label>
                    <Input
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select 
                      value={newCategory.color} 
                      onValueChange={(value) => setNewCategory(prev => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="indigo">Indigo</SelectItem>
                        <SelectItem value="pink">Pink</SelectItem>
                        <SelectItem value="teal">Teal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter category description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>
                <Button onClick={handleAddCategory} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statuses" className="space-y-6">
          {/* Product Statuses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Product Statuses
              </CardTitle>
              <CardDescription>
                Define status options for your product lifecycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Statuses */}
              <div className="space-y-3">
                {settings.statuses.map((status) => (
                  <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getColorBadge(status.color)}`} />
                      <div>
                        <div className="font-medium">{status.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {status.isActive ? 'Active status' : 'Inactive status'}
                          {status.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!status.isDefault && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteStatus(status.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Add New Status */}
              <div className="space-y-4">
                <h4 className="font-medium">Add New Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status Name</Label>
                    <Input
                      placeholder="Enter status name"
                      value={newStatus.name}
                      onChange={(e) => setNewStatus(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Select 
                      value={newStatus.color} 
                      onValueChange={(value) => setNewStatus(prev => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="indigo">Indigo</SelectItem>
                        <SelectItem value="pink">Pink</SelectItem>
                        <SelectItem value="teal">Teal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newStatus.isActive}
                    onCheckedChange={(checked) => setNewStatus(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active status (product is available)</Label>
                </div>
                <Button onClick={handleAddStatus} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          {/* Pricing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Settings
              </CardTitle>
              <CardDescription>
                Configure pricing rules and cost tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Dynamic Pricing</Label>
                  <p className="text-sm text-muted-foreground">Allow automatic price adjustments based on market conditions</p>
                </div>
                <Switch
                  checked={settings.pricingSettings.enableDynamicPricing}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      pricingSettings: { ...prev.pricingSettings, enableDynamicPricing: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Cost Tracking</Label>
                  <p className="text-sm text-muted-foreground">Track product costs for margin calculations</p>
                </div>
                <Switch
                  checked={settings.pricingSettings.enableCostTracking}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ 
                      ...prev, 
                      pricingSettings: { ...prev.pricingSettings, enableCostTracking: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Bulk Pricing</Label>
                  <p className="text-sm text-muted-foreground">Allow quantity-based pricing tiers</p>
                </div>
                <Switch
                  checked={settings.enableBulkPricing}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableBulkPricing: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Product Discounts</Label>
                  <p className="text-sm text-muted-foreground">Allow discounts to be applied to products</p>
                </div>
                <Switch
                  checked={settings.enableDiscounts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableDiscounts: checked }))}
                />
              </div>

              {settings.pricingSettings.enableCostTracking && (
                <div className="space-y-4 ml-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="markup">Default Markup (%)</Label>
                      <Input
                        id="markup"
                        type="number"
                        min="0"
                        value={settings.pricingSettings.markup}
                        onChange={(e) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            pricingSettings: { 
                              ...prev.pricingSettings, 
                              markup: parseFloat(e.target.value) || 0 
                            }
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minimumMargin">Minimum Margin (%)</Label>
                      <Input
                        id="minimumMargin"
                        type="number"
                        min="0"
                        value={settings.pricingSettings.minimumMargin}
                        onChange={(e) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            pricingSettings: { 
                              ...prev.pricingSettings, 
                              minimumMargin: parseFloat(e.target.value) || 0 
                            }
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          {/* Inventory Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Inventory Settings
              </CardTitle>
              <CardDescription>
                Configure inventory tracking and stock management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Inventory Tracking</Label>
                  <p className="text-sm text-muted-foreground">Track stock levels for products</p>
                </div>
                <Switch
                  checked={settings.enableInventoryTracking}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableInventoryTracking: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Send notifications when stock is low</p>
                </div>
                <Switch
                  checked={settings.enableLowStockAlerts}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableLowStockAlerts: checked }))}
                />
              </div>

              {settings.enableLowStockAlerts && (
                <div className="space-y-2 ml-6">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="1"
                    value={settings.lowStockThreshold}
                    onChange={(e) => setSettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 10 }))}
                    className="max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground">Alert when stock falls below this number</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Product Reviews</Label>
                  <p className="text-sm text-muted-foreground">Allow customer reviews for products</p>
                </div>
                <Switch
                  checked={settings.enableProductReviews}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableProductReviews: checked }))}
                />
              </div>

              {settings.enableProductReviews && (
                <div className="flex items-center justify-between ml-6">
                  <div>
                    <Label>Require Review Approval</Label>
                    <p className="text-sm text-muted-foreground">Reviews must be approved before showing</p>
                  </div>
                  <Switch
                    checked={settings.requireApprovalForReviews}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireApprovalForReviews: checked }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};