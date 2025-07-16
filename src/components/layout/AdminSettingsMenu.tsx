
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Users, 
  FormInput, 
  Share2, 
  Code, 
  Shield, 
  Clock, 
  Target,
  UsersRound,
  Zap,
  Bell,
  BarChart3,
  Phone,
  MapPin,
  Brain,
  UserCheck
} from 'lucide-react';

const settingsItems = [
  { title: 'General Settings', url: '/admin/settings/general', icon: Settings },
  { title: 'Users & Roles', url: '/admin/settings/users', icon: Users },
  { title: 'Teams Management', url: '/admin/settings/teams', icon: UsersRound },
  { title: 'Contact Settings', url: '/admin/settings/contacts', icon: UserCheck },
  { title: 'Custom Fields', url: '/admin/settings/fields', icon: FormInput },
  { title: 'Pipelines', url: '/admin/settings/pipelines', icon: Share2 },
  { title: 'Clock-in/Clock-out', url: '/admin/settings/clock', icon: Clock },
  { title: 'Call Logs & Recording', url: '/admin/settings/calls', icon: Phone },
  { title: 'Maps & Location', url: '/admin/settings/maps', icon: MapPin },
  { title: 'Integrations', url: '/admin/settings/integrations', icon: Code },
  { title: 'Notifications', url: '/admin/settings/notifications', icon: Bell },
  { title: 'Automation', url: '/admin/settings/automation', icon: Zap },
  { title: 'Forms Settings', url: '/admin/settings/forms', icon: FormInput },
  { title: 'AI Module', url: '/admin/settings/ai-module', icon: Brain },
  { title: 'Reporting & AI', url: '/admin/settings/reporting', icon: BarChart3 },
  { title: 'Permissions', url: '/admin/settings/permissions', icon: Shield },
  { title: 'Lead Distribution', url: '/admin/settings/distribution', icon: Target },
];

interface AdminSettingsMenuProps {
  onItemClick?: () => void;
}

export const AdminSettingsMenu: React.FC<AdminSettingsMenuProps> = ({ onItemClick }) => {
  const location = useLocation();
  
  return (
    <div className="space-y-2">
      {settingsItems.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive || location.pathname === item.url
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <item.icon className="mr-3 h-4 w-4" />
          {item.title}
        </NavLink>
      ))}
    </div>
  );
};
