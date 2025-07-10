import React, { useState } from 'react';
import { X, Save, Trash2, Filter, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface SavedFilter {
  id: string;
  name: string;
  filters: any;
  createdAt: string;
}

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator: 'AND' | 'OR';
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onApplyFilters: () => void;
  children: React.ReactNode;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  title,
  filters,
  onFiltersChange,
  onApplyFilters,
  children
}) => {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    {
      id: '1',
      name: 'High Value Leads',
      filters: { filterRules: [{ id: '1', field: 'value', operator: 'greater_than', value: '50000' }] },
      createdAt: '2024-01-15'
    },
    {
      id: '2', 
      name: 'This Month Leads',
      filters: { filterRules: [{ id: '2', field: 'created_date', operator: 'this_month', value: '' }] },
      createdAt: '2024-01-10'
    }
  ]);
  const [filterName, setFilterName] = useState('');
  const [filterRules, setFilterRules] = useState<FilterRule[]>(filters.filterRules || []);
  const [showFilterRules, setShowFilterRules] = useState(false);

  const fieldOptions = [
    { value: 'name', label: 'Lead Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'company', label: 'Company' },
    { value: 'nationality', label: 'Nationality' },
    { value: 'source', label: 'Lead Source' },
    { value: 'status', label: 'Status' },
    { value: 'value', label: 'Lead Value' },
    { value: 'score', label: 'Lead Score' },
    { value: 'created_date', label: 'Created Date' },
    { value: 'assigned_to', label: 'Assigned To' }
  ];

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Not Contains' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_quarter', label: 'This Quarter' }
  ];

  const addFilterRule = () => {
    const newRule: FilterRule = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    };
    const updatedRules = [...filterRules, newRule];
    setFilterRules(updatedRules);
    onFiltersChange({ ...filters, filterRules: updatedRules });
    setShowFilterRules(true);
  };

  const updateFilterRule = (ruleId: string, updates: Partial<FilterRule>) => {
    const updatedRules = filterRules.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    setFilterRules(updatedRules);
    onFiltersChange({ ...filters, filterRules: updatedRules });
  };

  const removeFilterRule = (ruleId: string) => {
    const updatedRules = filterRules.filter(rule => rule.id !== ruleId);
    setFilterRules(updatedRules);
    onFiltersChange({ ...filters, filterRules: updatedRules });
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast.error('Please enter a filter name');
      return;
    }

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: { ...filters, filterRules },
      createdAt: new Date().toISOString()
    };

    setSavedFilters(prev => [...prev, newFilter]);
    setFilterName('');
    toast.success('Filter saved successfully!');
  };

  const handleApplyFilter = (savedFilter: SavedFilter) => {
    setFilterRules(savedFilter.filters.filterRules || []);
    onFiltersChange(savedFilter.filters);
    toast.success(`Applied filter: ${savedFilter.name}`);
  };

  const handleDeleteFilter = (filterId: string) => {
    setSavedFilters(prev => prev.filter(f => f.id !== filterId));
    toast.success('Filter deleted successfully!');
  };

  const handleClearAll = () => {
    setFilterRules([]);
    onFiltersChange({ filterRules: [] });
    toast.success('All filters cleared');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-96 sm:w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            {title}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Saved Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Saved Filters</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between min-w-[300px]">
                  Select saved filter...
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px] bg-background border shadow-lg z-50">
                {savedFilters.map((savedFilter) => (
                  <DropdownMenuItem
                    key={savedFilter.id}
                    onClick={() => handleApplyFilter(savedFilter)}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{savedFilter.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(savedFilter.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFilter(savedFilter.id);
                      }}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </DropdownMenuItem>
                ))}
                {savedFilters.length === 0 && (
                  <DropdownMenuItem disabled className="p-3">
                    No saved filters yet
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator />

          {/* Filter Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Filter Rules</Label>
            </div>

            <div className="space-y-3">
              {filterRules.map((rule, index) => (
                <div key={rule.id} className="space-y-2 p-3 border rounded-lg">
                  {index > 0 && (
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Button 
                        variant={rule.logicalOperator === 'AND' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => updateFilterRule(rule.id, { logicalOperator: 'AND' })}
                      >
                        AND
                      </Button>
                      <Button 
                        variant={rule.logicalOperator === 'OR' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => updateFilterRule(rule.id, { logicalOperator: 'OR' })}
                      >
                        OR
                      </Button>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Select 
                      value={rule.field} 
                      onValueChange={(value) => updateFilterRule(rule.id, { field: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        {fieldOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select 
                      value={rule.operator} 
                      onValueChange={(value) => updateFilterRule(rule.id, { operator: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        {operatorOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Enter value"
                        value={rule.value}
                        onChange={(e) => updateFilterRule(rule.id, { value: e.target.value })}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFilterRule(rule.id)}
                        className="h-10 w-10 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addFilterRule}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Filter Rule
              </Button>
            </div>
          </div>

          <Separator />

          {/* Filter Controls - Hidden when filter rules are active */}
          {filterRules.length === 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Filter Options</h3>
              {children}
            </div>
          )}

          <Separator />

          {/* Save Current Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Save Current Filter</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter filter name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSaveFilter}
                size="sm"
                disabled={!filterName.trim()}
                className="shrink-0"
              >
                Save
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-4 border-t">
            <Button onClick={onApplyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button onClick={handleClearAll} variant="outline" className="flex-1">
              Clear All
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};