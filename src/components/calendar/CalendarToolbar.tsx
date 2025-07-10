
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Plus,
  Download,
  RefreshCw as Sync
} from 'lucide-react';
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';

interface CalendarToolbarProps {
  view: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
  onView: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  onNavigate: (date: Date) => void;
}

export const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  view,
  date,
  onView,
  onNavigate,
}) => {
  const navigatePrev = () => {
    switch (view) {
      case 'month':
        onNavigate(subMonths(date, 1));
        break;
      case 'week':
        onNavigate(subWeeks(date, 1));
        break;
      case 'day':
        onNavigate(subDays(date, 1));
        break;
      case 'agenda':
        onNavigate(subWeeks(date, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'month':
        onNavigate(addMonths(date, 1));
        break;
      case 'week':
        onNavigate(addWeeks(date, 1));
        break;
      case 'day':
        onNavigate(addDays(date, 1));
        break;
      case 'agenda':
        onNavigate(addWeeks(date, 1));
        break;
    }
  };

  const navigateToday = () => {
    onNavigate(new Date());
  };

  const getDateLabel = () => {
    switch (view) {
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'week':
        return format(date, "'Week of' MMM d, yyyy");
      case 'day':
        return format(date, 'EEEE, MMMM d, yyyy');
      case 'agenda':
        return format(date, 'MMMM yyyy');
      default:
        return format(date, 'MMMM yyyy');
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button size="sm" onClick={navigateToday} variant="outline">
          Today
        </Button>
        
        <div className="flex items-center space-x-1">
          <Button size="sm" variant="ghost" onClick={navigatePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          {getDateLabel()}
        </h2>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          {(['month', 'week', 'day', 'agenda'] as const).map((viewType) => (
            <Button
              key={viewType}
              size="sm"
              variant={view === viewType ? 'default' : 'ghost'}
              onClick={() => onView(viewType)}
              className="capitalize h-7 px-3"
            >
              {viewType}
            </Button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Sync className="h-4 w-4 mr-2" />
            Sync
          </Button>
          
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>
    </div>
  );
};
