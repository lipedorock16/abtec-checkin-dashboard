
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Clock, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/logo/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItem {
  label: string;
  icon: React.FC<{ size?: number }>;
  path: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    label: 'Check-in',
    icon: Clock,
    path: '/check-in',
  },
  {
    label: 'Usuários',
    icon: Users,
    path: '/admin',
    adminOnly: true,
  },
  {
    label: 'Configurações',
    icon: Settings,
    path: '/settings',
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-100 shadow-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <Logo withTagline className="ml-2" />
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={toggleSidebar}
            >
              <X size={20} />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <TooltipProvider key={item.path} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => navigate(item.path)}
                          className={cn(
                            "flex items-center w-full px-3 py-3 rounded-md text-sm font-medium transition-all duration-200",
                            isActive 
                              ? "bg-abtec-50 text-abtec-700" 
                              : "text-gray-700 hover:bg-gray-50 hover:text-abtec-600"
                          )}
                        >
                          <item.icon 
                            size={20} 
                            className={cn(
                              "mr-3",
                              isActive ? "text-abtec-600" : "text-gray-500"
                            )} 
                          />
                          {item.label}
                          {isActive && (
                            <ChevronRight size={16} className="ml-auto text-abtec-600" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </nav>
          </div>
          
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user ? getInitials(user.name) : '--'}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.department}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-red-600"
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center bg-white shadow-sm px-4 lg:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden mr-2" 
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          
          <div className="ml-auto flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm hidden md:inline-block">
                  Olá, <span className="font-medium">{user.name.split(' ')[0]}</span>
                </span>
                <Avatar 
                  className="h-8 w-8 md:hidden cursor-pointer border" 
                  onClick={() => navigate('/profile')}
                >
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </>
            )}
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
