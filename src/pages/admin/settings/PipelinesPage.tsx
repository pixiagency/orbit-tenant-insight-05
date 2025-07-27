import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Save, GripVertical, Target, Workflow, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Stage {
  id: string;
  name: string;
  probability: number;
  color: string;
  order: number;
}

interface LossReason {
  id: string;
  value: string;
  label: string;
  description?: string;
}

interface Pipeline {
  id: string;
  name: string;
  stages: Stage[];
  isDefault: boolean;
  lossReasons: LossReason[];
}

export const PipelinesPage: React.FC = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: '1',
      name: 'Sales Pipeline',
      isDefault: true,
      lossReasons: [
        { id: 'lr1', value: 'price', label: 'Price too high', description: 'Customer found our pricing too expensive' },
        { id: 'lr2', value: 'competitor', label: 'Chose competitor', description: 'Customer decided to go with a competitor' },
        { id: 'lr3', value: 'timing', label: 'Bad timing', description: 'Not the right time for the customer' },
        { id: 'lr4', value: 'budget', label: 'No budget', description: 'Customer lacks budget for the purchase' },
        { id: 'lr5', value: 'no-decision', label: 'No decision made', description: 'Customer postponed or avoided making a decision' },
        { id: 'lr6', value: 'requirements', label: 'Requirements not met', description: 'Our solution did not meet their requirements' }
      ],
      stages: [
        { id: '1', name: 'Prospecting', probability: 10, color: 'bg-gray-500', order: 1 },
        { id: '2', name: 'Qualification', probability: 25, color: 'bg-blue-500', order: 2 },
        { id: '3', name: 'Proposal', probability: 50, color: 'bg-yellow-500', order: 3 },
        { id: '4', name: 'Negotiation', probability: 75, color: 'bg-orange-500', order: 4 },
        { id: '5', name: 'Closed Won', probability: 100, color: 'bg-green-500', order: 5 },
        { id: '6', name: 'Closed Lost', probability: 0, color: 'bg-red-500', order: 6 }
      ]
    },
    {
      id: '2',
      name: 'Marketing Pipeline',
      isDefault: false,
      lossReasons: [
        { id: 'lr7', value: 'not-qualified', label: 'Not qualified', description: 'Lead did not meet qualification criteria' },
        { id: 'lr8', value: 'no-response', label: 'No response', description: 'Lead did not respond to outreach' },
        { id: 'lr9', value: 'wrong-contact', label: 'Wrong contact', description: 'Reached wrong person or department' }
      ],
      stages: [
        { id: '7', name: 'Lead Generation', probability: 5, color: 'bg-purple-500', order: 1 },
        { id: '8', name: 'Lead Nurturing', probability: 15, color: 'bg-blue-500', order: 2 },
        { id: '9', name: 'Qualified Lead', probability: 30, color: 'bg-yellow-500', order: 3 },
        { id: '10', name: 'Closed Won', probability: 100, color: 'bg-green-500', order: 4 },
        { id: '11', name: 'Closed Lost', probability: 0, color: 'bg-red-500', order: 5 }
      ]
    }
  ]);

  const [selectedPipeline, setSelectedPipeline] = useState<string>('1');
  const [activeSection, setActiveSection] = useState<'stages' | 'loss-reasons'>('stages');
  const [newStageName, setNewStageName] = useState('');
  const [newStageProbability, setNewStageProbability] = useState(50);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState({ name: '', probability: 0 });
  const [newPipelineName, setNewPipelineName] = useState('');
  const [showAddPipelineDialog, setShowAddPipelineDialog] = useState(false);

  // Loss reasons state
  const [newLossReasonValue, setNewLossReasonValue] = useState('');
  const [newLossReasonLabel, setNewLossReasonLabel] = useState('');
  const [newLossReasonDescription, setNewLossReasonDescription] = useState('');
  const [editingLossReason, setEditingLossReason] = useState<string | null>(null);
  const [editingLossReasonValues, setEditingLossReasonValues] = useState({ 
    value: '', 
    label: '', 
    description: '' 
  });

  const currentPipeline = pipelines.find(p => p.id === selectedPipeline);

  const handleAddPipeline = () => {
    if (!newPipelineName.trim()) return;

    const newPipeline: Pipeline = {
      id: Date.now().toString(),
      name: newPipelineName.trim(),
      isDefault: false,
      lossReasons: [
        { id: Date.now().toString() + '_lr1', value: 'other', label: 'Other', description: 'Other reason' }
      ],
      stages: [
        { id: Date.now().toString() + '1', name: 'New Stage', probability: 10, color: 'bg-gray-500', order: 1 }
      ]
    };

    setPipelines([...pipelines, newPipeline]);
    setNewPipelineName('');
    setShowAddPipelineDialog(false);
    setSelectedPipeline(newPipeline.id);
    toast.success('Pipeline added successfully');
  };

  const handleDeletePipeline = (pipelineId: string) => {
    const pipeline = pipelines.find(p => p.id === pipelineId);
    if (pipeline?.isDefault) {
      toast.error('Cannot delete default pipeline');
      return;
    }

    if (!confirm('Are you sure you want to delete this pipeline?')) return;

    const updatedPipelines = pipelines.filter(p => p.id !== pipelineId);
    setPipelines(updatedPipelines);
    
    if (selectedPipeline === pipelineId) {
      setSelectedPipeline(updatedPipelines[0]?.id || '');
    }
    
    toast.success('Pipeline deleted successfully');
  };

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

  const handleAddLossReason = () => {
    if (!newLossReasonValue.trim() || !newLossReasonLabel.trim() || !currentPipeline) return;

    const newLossReason: LossReason = {
      id: Date.now().toString(),
      value: newLossReasonValue.trim().toLowerCase().replace(/\s+/g, '-'),
      label: newLossReasonLabel.trim(),
      description: newLossReasonDescription.trim()
    };

    const updatedPipelines = pipelines.map(pipeline => 
      pipeline.id === selectedPipeline 
        ? { ...pipeline, lossReasons: [...pipeline.lossReasons, newLossReason] }
        : pipeline
    );

    setPipelines(updatedPipelines);
    setNewLossReasonValue('');
    setNewLossReasonLabel('');
    setNewLossReasonDescription('');
    toast.success('Loss reason added successfully');
  };

  const handleEditLossReason = (reasonId: string) => {
    const reason = currentPipeline?.lossReasons.find(r => r.id === reasonId);
    if (reason) {
      setEditingLossReason(reasonId);
      setEditingLossReasonValues({ 
        value: reason.value, 
        label: reason.label, 
        description: reason.description || '' 
      });
    }
  };

  const handleSaveLossReasonEdit = () => {
    if (!editingLossReason || !currentPipeline) return;

    const updatedPipelines = pipelines.map(pipeline => 
      pipeline.id === selectedPipeline 
        ? {
            ...pipeline,
            lossReasons: pipeline.lossReasons.map(reason =>
              reason.id === editingLossReason
                ? { 
                    ...reason, 
                    value: editingLossReasonValues.value.toLowerCase().replace(/\s+/g, '-'),
                    label: editingLossReasonValues.label,
                    description: editingLossReasonValues.description
                  }
                : reason
            )
          }
        : pipeline
    );

    setPipelines(updatedPipelines);
    setEditingLossReason(null);
    setEditingLossReasonValues({ value: '', label: '', description: '' });
    toast.success('Loss reason updated successfully');
  };

  const handleDeleteLossReason = (reasonId: string) => {
    if (!confirm('Are you sure you want to delete this loss reason?')) return;

    const updatedPipelines = pipelines.map(pipeline => 
      pipeline.id === selectedPipeline 
        ? { ...pipeline, lossReasons: pipeline.lossReasons.filter(reason => reason.id !== reasonId) }
        : pipeline
    );

    setPipelines(updatedPipelines);
    toast.success('Loss reason deleted successfully');
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Workflow className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Pipelines & Stages</h1>
          </div>
        </div>
        <Dialog open={showAddPipelineDialog} onOpenChange={setShowAddPipelineDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Pipeline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Pipeline</DialogTitle>
              <DialogDescription>
                Create a new sales pipeline with custom stages
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pipelineName">Pipeline Name</Label>
                <Input
                  id="pipelineName"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  placeholder="Enter pipeline name..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddPipelineDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPipeline}>
                  Create Pipeline
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-gray-600 mb-6">
        Configure sales pipelines and their stages for opportunity management
      </p>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="w-80 flex flex-col">
          {/* Pipeline Selection */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pipelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pipelines.map(pipeline => (
                <div
                  key={pipeline.id}
                  onClick={() => setSelectedPipeline(pipeline.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedPipeline === pipeline.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">{pipeline.name}</span>
                      {pipeline.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                    </div>
                    {!pipeline.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePipeline(pipeline.id);
                        }}
                        className="text-red-600 hover:text-red-700 p-1 h-auto"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {pipeline.stages.length} stages • {pipeline.lossReasons.length} loss reasons
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section Navigation */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Configure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => setActiveSection('stages')}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeSection === 'stages' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Workflow className="h-4 w-4" />
                  <span className="font-medium">Pipeline Stages</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Manage stage progression and probabilities
                </div>
              </button>
              <button
                onClick={() => setActiveSection('loss-reasons')}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeSection === 'loss-reasons' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Loss Reasons</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Define reasons for lost opportunities
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {currentPipeline && (
            <>
              {/* Pipeline Overview */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {currentPipeline.name}
                  </CardTitle>
                  <CardDescription>
                    {activeSection === 'stages' 
                      ? 'Manage stages and their progression probabilities'
                      : 'Configure loss reasons for this pipeline'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Stages:</span>
                      <Badge variant="outline" className="ml-2">{currentPipeline.stages.length}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Loss Reasons:</span>
                      <Badge variant="outline" className="ml-2">{currentPipeline.lossReasons.length}</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <Badge variant={currentPipeline.isDefault ? "default" : "secondary"} className="ml-2">
                        {currentPipeline.isDefault ? "Default" : "Custom"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stages Section */}
              {activeSection === 'stages' && (
                <div className="space-y-6">
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
                        {currentPipeline.stages
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

                      {currentPipeline.stages.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No stages defined. Add your first stage above.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Loss Reasons Section */}
              {activeSection === 'loss-reasons' && (
                <div className="space-y-6">
                  {/* Add New Loss Reason */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Add New Loss Reason
                      </CardTitle>
                      <CardDescription>
                        Define reasons why opportunities might be lost in this pipeline
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="lossReasonLabel">Reason Label</Label>
                            <Input
                              id="lossReasonLabel"
                              placeholder="e.g., Price too high"
                              value={newLossReasonLabel}
                              onChange={(e) => setNewLossReasonLabel(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="lossReasonValue">System Value</Label>
                            <Input
                              id="lossReasonValue"
                              placeholder="e.g., price-too-high"
                              value={newLossReasonValue}
                              onChange={(e) => setNewLossReasonValue(e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="lossReasonDescription">Description (Optional)</Label>
                          <Textarea
                            id="lossReasonDescription"
                            placeholder="Detailed description of this loss reason..."
                            value={newLossReasonDescription}
                            onChange={(e) => setNewLossReasonDescription(e.target.value)}
                            rows={2}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleAddLossReason}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Loss Reason
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Loss Reasons List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Loss Reasons</CardTitle>
                      <CardDescription>
                        These reasons will be available when marking opportunities as lost
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentPipeline.lossReasons.map((reason) => (
                          <div key={reason.id} className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />
                            
                            {editingLossReason === reason.id ? (
                              <div className="flex-1 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <Input
                                    value={editingLossReasonValues.label}
                                    onChange={(e) => setEditingLossReasonValues(prev => ({ ...prev, label: e.target.value }))}
                                    placeholder="Reason label"
                                  />
                                  <Input
                                    value={editingLossReasonValues.value}
                                    onChange={(e) => setEditingLossReasonValues(prev => ({ ...prev, value: e.target.value }))}
                                    placeholder="System value"
                                  />
                                </div>
                                <Textarea
                                  value={editingLossReasonValues.description}
                                  onChange={(e) => setEditingLossReasonValues(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="Description"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={handleSaveLossReasonEdit}>
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => setEditingLossReason(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{reason.label}</span>
                                    <Badge variant="outline" className="text-xs">{reason.value}</Badge>
                                  </div>
                                  {reason.description && (
                                    <p className="text-sm text-gray-600">{reason.description}</p>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditLossReason(reason.id)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteLossReason(reason.id)}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-500" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>

                      {currentPipeline.lossReasons.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No loss reasons defined. Add your first loss reason above.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};