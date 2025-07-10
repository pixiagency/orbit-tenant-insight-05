
import React from 'react';
import { DollarSign, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  source: string;
  createdAt: string;
  lastActivity: string;
}

interface OpportunityKanbanViewProps {
  opportunities: Opportunity[];
  onStageChange?: (opportunityId: string, newStage: string) => void;
  onCardClick?: (opportunity: Opportunity) => void;
}

const stages = [
  { id: 'prospecting', name: 'Prospecting', color: 'bg-blue-100 border-blue-200' },
  { id: 'qualification', name: 'Qualification', color: 'bg-yellow-100 border-yellow-200' },
  { id: 'proposal', name: 'Proposal', color: 'bg-purple-100 border-purple-200' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 border-orange-200' },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100 border-green-200' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100 border-red-200' },
];

const OpportunityCard = ({ opportunity, onCardClick }: { opportunity: Opportunity; onCardClick?: (opportunity: Opportunity) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: opportunity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab hover:shadow-md transition-shadow"
      onClick={(e) => {
        e.stopPropagation();
        onCardClick?.(opportunity);
      }}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-gray-900 text-sm">
              {opportunity.name}
            </h4>
            <p className="text-xs text-gray-600">{opportunity.company}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-600">
              <DollarSign className="h-3 w-3 mr-1" />
              ${opportunity.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">
              {opportunity.probability}%
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {opportunity.assignedTo.split(' ')[0]}
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full" 
              style={{ width: `${opportunity.probability}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DroppableArea = ({ 
  stage, 
  opportunities, 
  children 
}: { 
  stage: any; 
  opportunities: Opportunity[]; 
  children: React.ReactNode; 
}) => {
  return (
    <div 
      className="space-y-3 max-h-96 overflow-y-auto min-h-24 border-2 border-dashed border-gray-200 rounded-lg p-2"
      data-stage={stage.id}
    >
      {children}
    </div>
  );
};

export const OpportunityKanbanView: React.FC<OpportunityKanbanViewProps> = ({ 
  opportunities, 
  onStageChange,
  onCardClick 
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter(opp => opp.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getOpportunitiesByStage(stageId).reduce((sum, opp) => sum + opp.value, 0);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a stage container or another opportunity
    let targetStage = overId;
    
    // If dropping on another opportunity, find its stage
    const targetOpportunity = opportunities.find(opp => opp.id === overId);
    if (targetOpportunity) {
      targetStage = targetOpportunity.stage;
    }

    // Check if dropping on a stage container
    const overStage = stages.find(stage => stage.id === targetStage);
    if (overStage && onStageChange) {
      onStageChange(activeId, overStage.id);
    }

    setActiveId(null);
  };

  const activeOpportunity = activeId ? opportunities.find(opp => opp.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.id);
          const stageTotal = getStageTotal(stage.id);
          
          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <div className={`rounded-lg border-2 ${stage.color} p-4 mb-4`}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <Badge variant="secondary">{stageOpportunities.length}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  ${stageTotal.toLocaleString()}
                </p>
              </div>
              
              <SortableContext
                items={stageOpportunities.map(opp => opp.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableArea stage={stage} opportunities={stageOpportunities}>
                  {stageOpportunities.map((opportunity) => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} onCardClick={onCardClick} />
                  ))}
                  
                  {stageOpportunities.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">Drop opportunities here</p>
                    </div>
                  )}
                </DroppableArea>
              </SortableContext>
            </div>
          );
        })}
      </div>

      <DragOverlay>
        {activeOpportunity && (
          <OpportunityCard opportunity={activeOpportunity} />
        )}
      </DragOverlay>
    </DndContext>
  );
};
