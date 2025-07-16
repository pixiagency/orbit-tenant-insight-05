
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

export const ContactSettingsPage: React.FC = () => {
  const [leadSources, setLeadSources] = useState([
    'Website',
    'Referral',
    'Social Media',
    'Email Campaign',
    'Trade Show',
    'Cold Call',
    'Advertisement',
    'Partner'
  ]);
  
  const [newSource, setNewSource] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const handleAddSource = () => {
    if (newSource.trim() && !leadSources.includes(newSource.trim())) {
      setLeadSources([...leadSources, newSource.trim()]);
      setNewSource('');
      toast.success('Lead source added successfully');
    } else {
      toast.error('Lead source already exists or is empty');
    }
  };

  const handleEditSource = (index: number) => {
    setEditingIndex(index);
    setEditingValue(leadSources[index]);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() && editingIndex !== null) {
      const newSources = [...leadSources];
      newSources[editingIndex] = editingValue.trim();
      setLeadSources(newSources);
      setEditingIndex(null);
      setEditingValue('');
      toast.success('Lead source updated successfully');
    }
  };

  const handleDeleteSource = (index: number) => {
    if (confirm('Are you sure you want to delete this lead source?')) {
      const newSources = leadSources.filter((_, i) => i !== index);
      setLeadSources(newSources);
      toast.success('Lead source deleted successfully');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: 'add' | 'edit') => {
    if (e.key === 'Enter') {
      if (action === 'add') {
        handleAddSource();
      } else {
        handleSaveEdit();
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage lead sources and contact-related configurations
        </p>
      </div>

      {/* Lead Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Sources</CardTitle>
          <CardDescription>
            Configure the available lead sources for contacts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Source */}
          <div className="flex gap-2">
            <Input
              placeholder="Add new lead source..."
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, 'add')}
              className="flex-1"
            />
            <Button onClick={handleAddSource}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Sources List */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Lead Sources:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {leadSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  {editingIndex === index ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, 'edit')}
                        className="flex-1 h-8"
                      />
                      <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                        <Save className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium">{source}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditSource(index)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSource(index)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 pt-4 border-t">
            <div>
              <span className="text-sm text-gray-600">Total Sources:</span>
              <Badge variant="secondary" className="ml-2">{leadSources.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
