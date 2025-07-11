
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Building2,
  Target,
  Calendar,
  Phone,
  FileText,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

const superAdminMenuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/super-admin', icon: LayoutDashboard },
  { title: 'Clients', url: '/super-admin/clients', icon: Building2 },
  { title: 'Subscriptions', url: '/super-admin/subscriptions', icon: CreditCard },
  { title: 'Analytics', url: '/super-admin/analytics', icon: BarChart3 },
  { title: 'Users', url: '/super-admin/users', icon: Users },
  { title: 'Settings', url: '/super-admin/settings', icon: Settings },
];

const adminMenuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Team Leader', url: '/admin/team-leader', icon: Users },
  { title: 'Sales Agent', url: '/admin/sales-agent', icon: UserCheck },
  { title: 'Leads', url: '/admin/leads', icon: Target, badge: '12' },
  { title: 'Contacts', url: '/admin/contacts', icon: Users },
  { title: 'Deals', url: '/admin/deals', icon: FileText, badge: '5' },
  { title: 'Calendar', url: '/admin/calendar', icon: Calendar },
  { title: 'Calls', url: '/admin/calls', icon: Phone },
  { title: 'Import/Export', url: '/admin/import-export', icon: FileText },
  { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export const ModernSidebar = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (!user) return null;

  const menuItems = user.role === 'super-admin' ? superAdminMenuItems : adminMenuItems;

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out shadow-sm`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-gray-900">CRM Platform</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {user.role === 'super-admin' ? 'Super Admin' : user.tenantName}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 h-auto hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-9 h-8 bg-gray-50 border-0 focus:bg-white focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <Separator className="bg-gray-200" />
      
      {/* User Profile */}
      <div className="p-3">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="p-1.5 h-auto hover:bg-gray-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
              <UserCheck className="h-4 w-4 text-white" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="p-1.5 h-auto hover:bg-gray-200 mx-auto"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
