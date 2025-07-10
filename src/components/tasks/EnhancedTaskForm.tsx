
import React from 'react';
import { TaskForm } from './TaskForm';
import { useCustomFields } from '../../hooks/useCustomFields';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
  relatedTo: string;
  relatedType: string;
  createdAt: string;
  completedAt?: string;
}

interface EnhancedTaskFormProps {
  isOpen: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const EnhancedTaskForm: React.FC<EnhancedTaskFormProps> = (props) => {
  const { getActiveFields } = useCustomFields();
  
  const handleCustomFieldsClick = () => {
    toast.info('Navigate to Settings > Custom Fields to manage task fields');
  };
  
  return (
    <div className="relative">
      <TaskForm {...props} />
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCustomFieldsClick}
        >
          <Settings className="h-4 w-4 mr-2" />
          Custom Fields
        </Button>
      </div>
    </div>
  );
};
