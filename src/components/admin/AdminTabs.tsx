
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  MessageSquare,
  Package,
  Image,
  Clapperboard,
  FileText,
  AtSign,
  Info,
  Newspaper,
  Settings,
  Home,
  ChevronRight,
  ChevronDown,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  currentTab: string;
  onClick: (value: string) => void;
  badgeCount?: number;
  badgeColor?: string;
  collapsed?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  value, 
  currentTab, 
  onClick, 
  badgeCount,
  badgeColor = "bg-elvis-pink",
  collapsed = false
}) => {
  const isActive = currentTab === value;
  
  const navContent = (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors",
        "hover:bg-white/10",
        isActive 
          ? "bg-white/15 text-white font-medium" 
          : "text-white/70"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-grow text-left">{label}</span>
          {badgeCount !== undefined && badgeCount > 0 && (
            <Badge 
              className={cn("text-xs rounded-full", badgeColor)} 
              variant="outline"
            >
              {badgeCount}
            </Badge>
          )}
          {isActive && <ChevronRight size={16} className="flex-shrink-0 text-white/70" />}
        </>
      )}
    </button>
  );
  
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            {navContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-elvis-dark border-elvis-light text-white">
            {label}
            {badgeCount !== undefined && badgeCount > 0 && (
              <Badge className={cn("ml-2 text-xs rounded-full", badgeColor)} variant="outline">
                {badgeCount}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return navContent;
};

type NavGroupProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsed?: boolean;
};

const NavGroup: React.FC<NavGroupProps> = ({ 
  title, 
  children,
  defaultOpen = true,
  collapsed = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  // If collapsed, we don't show the title or the expand/collapse UI
  if (collapsed) {
    return (
      <div className="py-1">
        {children}
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs uppercase tracking-wider text-white/50 font-medium hover:text-white/70 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown 
          size={14} 
          className={cn(
            "transition-transform duration-200",
            isOpen ? "transform rotate-0" : "transform rotate-180"
          )}
        />
      </button>
      
      <div className={cn(
        "space-y-1 overflow-hidden transition-all duration-200",
        isOpen ? "max-h-96" : "max-h-0"
      )}>
        {children}
      </div>
    </div>
  );
};

const AdminTabs = ({ collapsed = false }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'dashboard';
  
  const handleTabChange = (value: string) => {
    navigate(`/admin?tab=${value}`, { replace: true });
  };
  
  return (
    <div className="h-full py-2 space-y-4">
      <NavGroup title="Dashboard" defaultOpen={true} collapsed={collapsed}>
        <NavItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          value="dashboard"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
      </NavGroup>
      
      <NavGroup title="Content" defaultOpen={currentTab.includes('home') || currentTab.includes('about')} collapsed={collapsed}>
        <NavItem
          icon={<Home size={18} />}
          label="Home Page"
          value="home"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
        <NavItem
          icon={<Info size={18} />}
          label="About Page"
          value="about"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
        <NavItem
          icon={<Newspaper size={18} />}
          label="Blog"
          value="blog"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
      </NavGroup>
      
      <NavGroup title="Media & Equipment" defaultOpen={currentTab === 'media' || currentTab === 'equipment'} collapsed={collapsed}>
        <NavItem
          icon={<Image size={18} />}
          label="Media Library"
          value="media"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
        <NavItem
          icon={<Clapperboard size={18} />}
          label="Equipment"
          value="equipment"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
      </NavGroup>
      
      <NavGroup title="Business" defaultOpen={currentTab.includes('hire') || currentTab.includes('product') || currentTab.includes('order')} collapsed={collapsed}>
        <NavItem
          icon={<MessageSquare size={18} />}
          label="Hire Requests"
          value="hire-requests"
          currentTab={currentTab}
          onClick={handleTabChange}
          badgeCount={3}
          collapsed={collapsed}
        />
        <NavItem
          icon={<Package size={18} />}
          label="Products"
          value="products"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
        <NavItem
          icon={<ShoppingCart size={18} />}
          label="Orders"
          value="orders"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
      </NavGroup>
      
      <NavGroup title="Users" defaultOpen={currentTab === 'users' || currentTab === 'subscribers'} collapsed={collapsed}>
        <NavItem
          icon={<Users size={18} />}
          label="Manage Users"
          value="users"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
        <NavItem
          icon={<AtSign size={18} />}
          label="Subscribers"
          value="subscribers"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
      </NavGroup>
      
      <NavGroup title="System" defaultOpen={currentTab === 'settings'} collapsed={collapsed}>
        <NavItem
          icon={<Settings size={18} />}
          label="Settings"
          value="settings"
          currentTab={currentTab}
          onClick={handleTabChange}
          collapsed={collapsed}
        />
      </NavGroup>
    </div>
  );
};

export default AdminTabs;
