import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  ChevronDown,
  ChevronUp,
  Inbox,
  CheckSquare,
  Zap,
  FormInput,
  Package,
  Bot,
  Bell,
  Briefcase,
  Workflow,
  Key,
  Clock,
  Share2,
  Shield,
  FileSpreadsheet,
  Code,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SettingsSidebar } from './SettingsSidebar';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  badge?: string;
  children?: MenuItem[];
  external?: boolean;
  isSettings?: boolean;
}

const superAdminMenuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/super-admin', icon: LayoutDashboard },
  { title: 'Packages', url: '/super-admin/packages', icon: Package },
  { title: 'Clients', url: '/super-admin/clients', icon: Building2 },
  { title: 'Subscriptions', url: '/super-admin/subscriptions', icon: CreditCard },
  { title: 'Activation Codes', url: '/super-admin/activation-codes', icon: Key },
  { title: 'Users Management', url: '/super-admin/users', icon: Users },
  { title: 'Billing Logs', url: '/super-admin/billing', icon: FileSpreadsheet },
  { title: 'Website', url: '/website', icon: Globe, external: true },
];

const adminMenuItems: MenuItem[] = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Contacts', url: '/admin/leads', icon: Target, badge: '12' },
  { title: 'Opportunities', url: '/admin/opportunities', icon: Briefcase, badge: '5' },
  { title: 'Deals', url: '/admin/deals', icon: FileText, badge: '8' },
  { title: 'Tasks', url: '/admin/tasks', icon: CheckSquare, badge: '3' },
  { title: 'Calendar', url: '/admin/calendar', icon: Calendar },
  { title: 'Inbox', url: '/admin/inbox', icon: Inbox, badge: '7' },
  { title: 'Call Logs & Recording', url: '/admin/calls', icon: Phone, badge: '2' },
  { title: 'Ads AI', url: '/admin/ads-ai', icon: Zap },
  { title: 'Automation', url: '/admin/automation', icon: Workflow },
  { title: 'Forms', url: '/admin/forms', icon: FormInput },
  { title: 'Products / Services', url: '/admin/products', icon: Package },
  { title: 'AI Assistant', url: '/admin/ai-assistant', icon: Bot },
  { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
  { title: 'Notifications', url: '/admin/notifications', icon: Bell },
  
];

export const ModernSidebarWithSections = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [showSettingsSidebar, setShowSettingsSidebar] = useState(false);
  
  // Check if current route is a settings page
  const isOnSettingsPage = location.pathname.startsWith('/admin/settings');
  
  // Show settings sidebar if on settings page
  useEffect(() => {
    if (isOnSettingsPage && user?.role === 'admin') {
      setShowSettingsSidebar(true);
    } else if (!isOnSettingsPage) {
      setShowSettingsSidebar(false);
    }
  }, [isOnSettingsPage, user?.role]);
  
  if (!user) return null;

  const menuItems = user.role === 'super-admin' ? superAdminMenuItems : adminMenuItems;

  // If settings sidebar should be shown, render it instead
  if (showSettingsSidebar && user.role === 'admin') {
    return (
      <SettingsSidebar onBack={() => setShowSettingsSidebar(false)} />
    );
  }

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.url === location.pathname) return true;
    if (item.children) {
      return item.children.some(child => child.url === location.pathname);
    }
    return false;
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSettingsSidebar(true);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections[item.title];
    const paddingLeft = level === 0 ? 'pl-3' : 'pl-8';
    const isActive = isItemActive(item);

    if (hasChildren) {
      return (
        <div key={item.title}>
          <Collapsible open={isOpen} onOpenChange={() => toggleSection(item.title)}>
            <CollapsibleTrigger asChild>
              <div className={`flex items-center ${paddingLeft} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group ${
                isActive 
                  ? 'text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}>
                <item.icon className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                }`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    )}
                  </>
                )}
              </div>
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="space-y-1">
                {item.children?.map((child) => renderMenuItem(child, level + 1))}
              </CollapsibleContent>
            )}
          </Collapsible>
        </div>
      );
    }

    const isChildActive = location.pathname === item.url;

    // Handle settings click for admin users
    if (item.isSettings && user.role === 'admin') {
      return (
        <div
          key={item.title}
          onClick={handleSettingsClick}
          className={`flex items-center ${paddingLeft} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative cursor-pointer ${
            isActive
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <item.icon className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0 ${
            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
          }`} />
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </div>
      );
    }

    // Handle external links differently
    if (item.external) {
      return (
        <a
          key={item.title}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center ${paddingLeft} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
            isChildActive
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <item.icon className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0 ${
            isChildActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
          }`} />
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs">
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </a>
      );
    }

    if (isCollapsed) {
      return (
        <Tooltip key={item.title}>
          <TooltipTrigger asChild>
            <NavLink
              to={item.url}
              className={`flex items-center ${paddingLeft} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                isChildActive
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <item.icon className={`mx-auto h-5 w-5 flex-shrink-0 ${
                isChildActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`} />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <NavLink
        key={item.title}
        to={item.url}
        className={`flex items-center ${paddingLeft} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
          isChildActive
            ? 'text-blue-700 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
      >
        <item.icon className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0 ${
          isChildActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
        }`} />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full transition-all duration-300 ease-in-out shadow-sm`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">CRM Platform</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {user.role === 'super-admin' ? 'Super Admin' : user.tenantName}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 h-auto hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>
      
      {/* Bottom Section: Settings Button */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700">
        <Button
          variant="ghost"
          size="lg"
          onClick={() => navigate(user.role === 'super-admin' ? '/super-admin/settings' : '/admin/settings')}
          className="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors justify-start"
        >
          <Settings className="h-5 w-5 mr-3 text-blue-500" />
          <span className="font-medium text-sm">{user.role === 'super-admin' ? 'System Settings' : 'Settings'}</span>
        </Button>
      </div>
    </div>
  );
};
