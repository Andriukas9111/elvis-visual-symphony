
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Home
} from 'lucide-react';

const AdminTabs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'dashboard';
  
  const handleTabChange = (value: string) => {
    navigate(`/admin?tab=${value}`, { replace: true });
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">DASHBOARD</h3>
      <TabsList className="flex flex-wrap justify-start mb-4">
        <TabsTrigger 
          value="dashboard" 
          onClick={() => handleTabChange('dashboard')}
          data-state={currentTab === 'dashboard' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </TabsTrigger>
      </TabsList>
      
      <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">CONTENT</h3>
      <TabsList className="flex flex-col w-full mb-4">
        <TabsTrigger 
          value="home" 
          onClick={() => handleTabChange('home')}
          data-state={currentTab === 'home' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <Home size={16} />
          <span>Home Page</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="about" 
          onClick={() => handleTabChange('about')}
          data-state={currentTab === 'about' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <Info size={16} />
          <span>About Page</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="blog" 
          onClick={() => handleTabChange('blog')}
          data-state={currentTab === 'blog' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <Newspaper size={16} />
          <span>Blog</span>
        </TabsTrigger>
      </TabsList>
      
      <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">MEDIA & EQUIPMENT</h3>
      <TabsList className="flex flex-col w-full mb-4">
        <TabsTrigger 
          value="media" 
          onClick={() => handleTabChange('media')}
          data-state={currentTab === 'media' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <Image size={16} />
          <span>Media Library</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="equipment" 
          onClick={() => handleTabChange('equipment')}
          data-state={currentTab === 'equipment' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <Clapperboard size={16} />
          <span>Equipment</span>
        </TabsTrigger>
      </TabsList>
      
      <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">BUSINESS</h3>
      <TabsList className="flex flex-col w-full mb-4">
        <TabsTrigger 
          value="hire-requests" 
          onClick={() => handleTabChange('hire-requests')}
          data-state={currentTab === 'hire-requests' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <MessageSquare size={16} />
          <span>Hire Requests</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="products" 
          onClick={() => handleTabChange('products')}
          data-state={currentTab === 'products' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <Package size={16} />
          <span>Products</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="orders" 
          onClick={() => handleTabChange('orders')}
          data-state={currentTab === 'orders' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <ShoppingCart size={16} />
          <span>Orders</span>
        </TabsTrigger>
      </TabsList>
      
      <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">USERS</h3>
      <TabsList className="flex flex-col w-full mb-4">
        <TabsTrigger 
          value="users" 
          onClick={() => handleTabChange('users')}
          data-state={currentTab === 'users' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <Users size={16} />
          <span>Manage Users</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="subscribers" 
          onClick={() => handleTabChange('subscribers')}
          data-state={currentTab === 'subscribers' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <AtSign size={16} />
          <span>Subscribers</span>
        </TabsTrigger>
      </TabsList>
      
      <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">ADVANCED</h3>
      <TabsList className="flex flex-col w-full">
        <TabsTrigger 
          value="settings" 
          onClick={() => handleTabChange('settings')}
          data-state={currentTab === 'settings' ? 'active' : 'inactive'}
          className="flex items-center gap-2 w-full justify-start"
        >
          <Settings size={16} />
          <span>Settings</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AdminTabs;
