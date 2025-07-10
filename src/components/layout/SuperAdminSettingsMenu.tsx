
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Globe,
  Mail,
  Shield,
  Database,
  Building2,
  Package
} from 'lucide-react';

const superAdminSettingsItems = [
  { title: 'General Settings', url: '/super-admin/settings/general', icon: Settings },
  { title: 'System Configuration', url: '/super-admin/settings/system', icon: Database },
  { title: 'Email Settings', url: '/super-admin/settings/email', icon: Mail },
  { title: 'Security Settings', url: '/super-admin/settings/security', icon: Shield },
  { title: 'Global Settings', url: '/super-admin/settings/global', icon: Globe },
  { title: 'Package Templates', url: '/super-admin/settings/packages', icon: Package },
  { title: 'Client Templates', url: '/super-admin/settings/clients', icon: Building2 },
];

interface SuperAdminSettingsMenuProps {
  onItemClick?: () => void;
}

export const SuperAdminSettingsMenu: React.FC<SuperAdminSettingsMenuProps> = ({ onItemClick }) => {
  const location = useLocation();
  
  return (
    <div className="space-y-2">
      {superAdminSettingsItems.map((item) => (
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
