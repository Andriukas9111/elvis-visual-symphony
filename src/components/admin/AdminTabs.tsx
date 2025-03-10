
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  UserCog, 
  PackageIcon,
  ImageIcon, 
  FileTextIcon, 
  Mail, 
  BarChart3,
  ShoppingCart,
  Camera,
  Users
} from 'lucide-react';

const AdminTabs: React.FC = () => {
  return (
    <TabsList className="grid grid-cols-9 md:w-auto bg-elvis-dark">
      <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </TabsTrigger>
      <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
        <UserCog className="h-4 w-4" />
        <span className="hidden sm:inline">Users</span>
      </TabsTrigger>
      <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
        <ShoppingCart className="h-4 w-4" />
        <span className="hidden sm:inline">Orders</span>
      </TabsTrigger>
      <TabsTrigger value="hire-requests" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
        <Mail className="h-4 w-4" />
        <span className="hidden sm:inline">Hire Requests</span>
      </TabsTrigger>
      <TabsTrigger value="subscribers" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Subscribers</span>
      </TabsTrigger>
      <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
        <PackageIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Products</span>
      </TabsTrigger>
      <TabsTrigger value="media" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
        <ImageIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Media</span>
      </TabsTrigger>
      <TabsTrigger value="equipment" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
        <Camera className="h-4 w-4" />
        <span className="hidden sm:inline">Equipment</span>
      </TabsTrigger>
      <TabsTrigger value="content" className="flex items-center gap-2 data-[state=active]:bg-elvis-pink">
        <FileTextIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Content</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabs;
