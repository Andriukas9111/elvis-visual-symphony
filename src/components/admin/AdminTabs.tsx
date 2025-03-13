
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
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  currentTab: string;
  onClick: (value: string) => void;
  children?: React.ReactNode;
  badge?: number;
};

const NavItem = ({ icon, label, value, currentTab, onClick, badge }: NavItemProps) => {
  const isActive = currentTab === value;
  
  return (
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
      <span className="flex-grow text-left">{label}</span>
      {badge !== undefined && (
        <span className="px-1.5 py-0.5 text-xs rounded-full bg-elvis-pink/80 text-white">
          {badge}
        </span>
      )}
      {isActive && <ChevronRight size={16} className="flex-shrink-0 text-white/70" />}
    </button>
  );
};

type NavGroupProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const NavGroup = ({ 
  title, 
  children,
  defaultOpen = true
}: NavGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
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

const AdminTabs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'dashboard';
  
  const handleTabChange = (value: string) => {
    navigate(`/admin?tab=${value}`, { replace: true });
  };
  
  return (
    <div className="h-full py-2 space-y-6">
      <NavGroup title="Dashboard" defaultOpen={true}>
        <NavItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          value="dashboard"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
      </NavGroup>
      
      <NavGroup title="Content" defaultOpen={true}>
        <NavItem
          icon={<Home size={18} />}
          label="Home Page"
          value="home"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
        <NavItem
          icon={<Info size={18} />}
          label="About Page"
          value="about"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
        <NavItem
          icon={<Newspaper size={18} />}
          label="Blog"
          value="blog"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
      </NavGroup>
      
      <NavGroup title="Media & Equipment" defaultOpen={currentTab === 'media' || currentTab === 'equipment'}>
        <NavItem
          icon={<Image size={18} />}
          label="Media Library"
          value="media"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
        <NavItem
          icon={<Clapperboard size={18} />}
          label="Equipment"
          value="equipment"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
      </NavGroup>
      
      <NavGroup title="Business" defaultOpen={currentTab.includes('hire') || currentTab.includes('product') || currentTab.includes('order')}>
        <NavItem
          icon={<MessageSquare size={18} />}
          label="Hire Requests"
          value="hire-requests"
          currentTab={currentTab}
          onClick={handleTabChange}
          badge={3}
        />
        <NavItem
          icon={<Package size={18} />}
          label="Products"
          value="products"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
        <NavItem
          icon={<ShoppingCart size={18} />}
          label="Orders"
          value="orders"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
      </NavGroup>
      
      <NavGroup title="Users" defaultOpen={currentTab === 'users' || currentTab === 'subscribers'}>
        <NavItem
          icon={<Users size={18} />}
          label="Manage Users"
          value="users"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
        <NavItem
          icon={<AtSign size={18} />}
          label="Subscribers"
          value="subscribers"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
      </NavGroup>
      
      <NavGroup title="System" defaultOpen={currentTab === 'settings'}>
        <NavItem
          icon={<Settings size={18} />}
          label="Settings"
          value="settings"
          currentTab={currentTab}
          onClick={handleTabChange}
        />
      </NavGroup>
    </div>
  );
};

export default AdminTabs;
