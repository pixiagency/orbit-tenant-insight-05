
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
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const superAdminMenuItems = [
  { title: 'Dashboard', url: '/super-admin', icon: LayoutDashboard },
  { title: 'Clients', url: '/super-admin/clients', icon: Building2 },
  { title: 'Subscriptions', url: '/super-admin/subscriptions', icon: CreditCard },
  { title: 'Codes Management', url: '/super-admin/activation-codes', icon: Key },
  { title: 'Analytics', url: '/super-admin/analytics', icon: BarChart3 },
  { title: 'Users', url: '/super-admin/users', icon: Users },
  { title: 'Settings', url: '/super-admin/settings', icon: Settings },
];

const adminMenuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Leads', url: '/admin/leads', icon: Target },
  { title: 'Contacts', url: '/admin/contacts', icon: Users },
  { title: 'Deals', url: '/admin/deals', icon: FileText },
  { title: 'Calendar', url: '/admin/calendar', icon: Calendar },
  { title: 'Calls', url: '/admin/calls', icon: Phone },
  { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const menuItems = user.role === 'super-admin' ? superAdminMenuItems : adminMenuItems;

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold">CRM Platform</h1>
        <p className="text-sm text-gray-300 mt-1">
          {user.role === 'super-admin' ? 'Super Admin' : user.tenantName}
        </p>
      </div>
      
      <Separator className="bg-gray-700" />
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <Separator className="bg-gray-700" />
      
      <div className="p-4">
        <div className="flex items-center mb-3">
          <UserCheck className="h-8 w-8 bg-blue-600 rounded-full p-1.5 mr-3" />
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
