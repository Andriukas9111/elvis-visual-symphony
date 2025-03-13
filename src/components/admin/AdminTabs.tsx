
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div>
          <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">DASHBOARD</h3>
          <TabsList className="flex flex-wrap justify-start mb-4">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div>
          <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">CONTENT</h3>
          <TabsList className="flex flex-col w-full mb-4">
            <TabsTrigger 
              value="home" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <Home size={16} />
              <span>Home Page</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="about" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <Info size={16} />
              <span>About Page</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="blog" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <Newspaper size={16} />
              <span>Blog</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div>
          <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">MEDIA & EQUIPMENT</h3>
          <TabsList className="flex flex-col w-full mb-4">
            <TabsTrigger 
              value="media" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <Image size={16} />
              <span>Media Library</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="equipment" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <Clapperboard size={16} />
              <span>Equipment</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div>
          <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">BUSINESS</h3>
          <TabsList className="flex flex-col w-full mb-4">
            <TabsTrigger 
              value="hire-requests" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <MessageSquare size={16} />
              <span>Hire Requests</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <Package size={16} />
              <span>Products</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="orders" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <ShoppingCart size={16} />
              <span>Orders</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div>
          <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">USERS</h3>
          <TabsList className="flex flex-col w-full mb-4">
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <Users size={16} />
              <span>Manage Users</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="subscribers" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <AtSign size={16} />
              <span>Subscribers</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div>
          <h3 className="font-semibold text-sm text-gray-400 ml-1 mb-1">ADVANCED</h3>
          <TabsList className="flex flex-col w-full">
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 w-full justify-start"
            >
              <Settings size={16} />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminTabs;
