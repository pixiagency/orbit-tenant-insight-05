
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Save, GripVertical, Target, Workflow } from 'lucide-react';
import { toast } from 'sonner';

interface Stage {
  id: string;
  name: string;
  probability: number;
  color: string;
  order: number;
}

interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
  isDefault: boolean;
}

export const PipelinesPage: React.FC = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'Sales Pipeline',
      isDefault: true,
      stages: [
        { id: '1', name: 'Prospecting', probability: 10, color: 'bg-gray-500', order: 1 },
        { id: '2', name: 'Qualification', probability: 25, color: 'bg-blue-500', order: 2 },
        { id: '3', name: 'Proposal', probability: 50, color: 'bg-yellow-500', order: 3 },
        { id: '4', name: 'Negotiation', probability: 75, color: 'bg-orange-500', order: 4 },
        { id: '5', name: 'Closed Won', probability: 100, color: 'bg-green-500', order: 5 },
        { id: '6', name: 'Closed Lost', probability: 0, color: 'bg-red-500', order: 6 }
      ]
    }
  ]);

  const [selectedPipeline, setSelectedPipeline] = useState<string>('1');
  const [newStageName, setNewStageName] = useState('');
  const [newStageProbability, setNewStageProbability] = useState(50);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState({ name: '', probability: 0 });

  const currentPipeline = pipelines.find(p => p.id === selectedPipeline);

  const handleAddStage = () => {
    if (!newStageName.trim() || !currentPipeline) return;

    const newStage: Stage = {
      id: Date.now().toString(),
      name: newStageName.trim(),
      probability: newStageProbability,
      color: 'bg-blue-500',
      order: currentPipeline.stages.length + 1
    };

    const updatedPipelines = pipelines.map(pipeline => 
      pipeline.id === selectedPipeline 
        ? { ...pipeline, stages: [...pipeline.stages, newStage] }
        : pipeline
    );

    setPipelines(updatedPipelines);
    setNewStageName('');
    setNewStageProbability(50);
    toast.success('Stage added successfully');
  };

  const handleEditStage = (stageId: string) => {
    const stage = currentPipeline?.stages.find(s => s.id === stageId);
    if (stage) {
      setEditingStage(stageId);
      setEditingValues({ name: stage.name, probability: stage.probability });
    }
  };

  const handleSaveEdit = () => {
    if (!editingStage || !currentPipeline) return;

    const updatedPipelines = pipelines.map(pipeline => 
      pipeline.id === selectedPipeline 
        ? {
            ...pipeline,
            stages: pipeline.stages.map(stage =>
              stage.id === editingStage
                ? { ...stage, name: editingValues.name, probability: editingValues.probability }
                : stage
            )
          }
        : pipeline
    );

    setPipelines(updatedPipelines);
    setEditingStage(null);
    setEditingValues({ name: '', probability: 0 });
    toast.success('Stage updated successfully');
  };

  const handleDeleteStage = (stageId: string) => {
    if (!confirm('Are you sure you want to delete this stage?')) return;

    const updatedPipelines = pipelines.map(pipeline => 
      pipeline.id === selectedPipeline 
        ? { ...pipeline, stages: pipeline.stages.filter(stage => stage.id !== stageId) }
        : pipeline
    );

    setPipelines(updatedPipelines);
    toast.success('Stage deleted successfully');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Workflow className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Pipelines & Stages</h1>
        </div>
      </div>
      <p className="text-gray-600">
        Configure sales pipelines and their stages for opportunity management
      </p>

      <Tabs value={selectedPipeline} onValueChange={setSelectedPipeline} className="space-y-6">
        {/* Pipeline Tabs */}
        <TabsList>
          {pipelines.map(pipeline => (
            <TabsTrigger key={pipeline.id} value={pipeline.id} className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {pipeline.name}
              {pipeline.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>

        {pipelines.map(pipeline => (
          <TabsContent key={pipeline.id} value={pipeline.id} className="space-y-6">
            {/* Pipeline Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {pipeline.name}
                </CardTitle>
                <CardDescription>
                  Manage stages for this pipeline. Stages represent the progression of opportunities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Stages:</span>
                    <Badge variant="outline" className="ml-2">{pipeline.stages.length}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <Badge variant={pipeline.isDefault ? "default" : "secondary"} className="ml-2">
                      {pipeline.isDefault ? "Default" : "Custom"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add New Stage */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="stageName">Stage Name</Label>
                    <Input
                      id="stageName"
                      placeholder="Enter stage name..."
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                    />
                  </div>
                  <div className="w-40">
                    <Label htmlFor="probability">Probability (%)</Label>
                    <Input
                      id="probability"
                      type="number"
                      min="0"
                      max="100"
                      value={newStageProbability}
                      onChange={(e) => setNewStageProbability(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddStage}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Stage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stages List */}
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Stages</CardTitle>
                <CardDescription>
                  Stages are processed in order. Drag to reorder or edit individual stages.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pipeline.stages
                    .sort((a, b) => a.order - b.order)
                    .map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                        <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                      </div>

                      {editingStage === stage.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editingValues.name}
                            onChange={(e) => setEditingValues(prev => ({ ...prev, name: e.target.value }))}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={editingValues.probability}
                            onChange={(e) => setEditingValues(prev => ({ ...prev, probability: parseInt(e.target.value) }))}
                            className="w-20"
                          />
                          <Button size="sm" onClick={handleSaveEdit}>
                            <Save className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <span className="font-medium">{stage.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{stage.probability}%</Badge>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditStage(stage.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteStage(stage.id)}
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {pipeline.stages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No stages defined. Add your first stage above.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
