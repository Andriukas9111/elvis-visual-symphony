
import React from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import UsersManagement from './UsersManagement';
import OrdersManagement from './OrdersManagement';
import HireRequestsManagement from './HireRequestsManagement';
import ProductsManagement from './ProductsManagement';
import MediaManagement from './MediaManagement';
import EquipmentManagement from './EquipmentManagement';
import ContentEditor from './ContentEditor';
import AboutContentEditor from './AboutContentEditor';
import SubscribersManagement from './SubscribersManagement';
import AccessDeniedUI from './AccessDeniedUI';

const AdminTabContent = () => {
  const { profile } = useAuth();
  
  if (!profile || profile.role !== 'admin') {
    return <AccessDeniedUI />;
  }
  
  return (
    <Tabs defaultValue="dashboard">
      <TabsContent value="dashboard">
        <AdminDashboard />
      </TabsContent>
      
      <TabsContent value="users">
        <UsersManagement />
      </TabsContent>
      
      <TabsContent value="orders">
        <OrdersManagement />
      </TabsContent>
      
      <TabsContent value="hire-requests">
        <HireRequestsManagement />
      </TabsContent>
      
      <TabsContent value="products">
        <ProductsManagement />
      </TabsContent>
      
      <TabsContent value="media">
        <MediaManagement />
      </TabsContent>
      
      <TabsContent value="equipment">
        <EquipmentManagement />
      </TabsContent>
      
      <TabsContent value="content">
        <ContentEditor />
      </TabsContent>
      
      <TabsContent value="about">
        <AboutContentEditor />
      </TabsContent>
      
      <TabsContent value="subscribers">
        <SubscribersManagement />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabContent;
