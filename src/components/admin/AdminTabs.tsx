
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
} from 'lucide-react';

const AdminTabs = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'dashboard';
  
  const handleTabChange = (value: string) => {
    navigate(`/admin?tab=${value}`, { replace: true });
  };
  
  return (
    <TabsList className="flex flex-wrap justify-start overflow-x-auto">
      <TabsTrigger 
        value="dashboard" 
        onClick={() => handleTabChange('dashboard')}
        data-state={currentTab === 'dashboard' ? 'active' : 'inactive'}
        className="flex items-center gap-2"
      >
        <LayoutDashboard size={16} />
        <span className="hidden sm:inline">Dashboard</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="users" 
        onClick={() => handleTabChange('users')}
        data-state={currentTab === 'users' ? 'active' : 'inactive'}
        className="flex items-center gap-2"
      >
        <Users size={16} />
        <span className="hidden sm:inline">Users</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="orders" 
        onClick={() => handleTabChange('orders')}
        data-state={currentTab === 'orders' ? 'active' : 'inactive'}
        className="flex items-center gap-2"
      >
        <ShoppingCart size={16} />
        <span className="hidden sm:inline">Orders</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="hire-requests" 
        onClick={() => handleTabChange('hire-requests')}
        data-state={currentTab === 'hire-requests' ? 'active' : 'inactive'}
        className="flex items-center gap-2"
      >
        <MessageSquare size={16} />
        <span className="hidden sm:inline">Hire Requests</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="products" 
        onClick={() => handleTabChange('products')}
        data-state={currentTab === 'products' ? 'active' : 'inactive'}
        className="flex items-center gap-2"
      >
        <Package size={16} />
        <span className="hidden sm:inline">Products</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="media" 
        onClick={() => handleTabChange('media')}
        data-state={currentTab === 'media' ? 'active' : 'inactive'}
        className="flex items-center gap-2"
      >
        <Image size={16} />
        <span className="hidden sm:inline">Media</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="equipment" 
        onClick={() => handleTabChange('equipment')}
        data-state={currentTab === 'equipment' ? 'active' : 'inactive'}
        className="flex items-center gap-2"
      >
        <Clapperboard size={16} />
        <span className="hidden sm:inline">Equipment</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="content" 
        onClick={() => handleTabChange('content')}
        data-state={currentTab === 'content' ? 'active' : 'inactive'}
        className="flex items-center gap-2"
      >
        <FileText size={16} />
        <span className="hidden sm:inline">Content</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="subscribers" 
        onClick={() => handleTabChange('subscribers')}
        data-state={currentTab === 'subscribers' ? 'active' : 'inactive'}
        className="flex items-center gap-2"
      >
        <AtSign size={16} />
        <span className="hidden sm:inline">Subscribers</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabs;
