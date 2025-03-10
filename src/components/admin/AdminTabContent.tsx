
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import AdminDashboard from '@/components/admin/AdminDashboard';
import UsersManagement from '@/components/admin/UsersManagement';
import HireRequestsManagement from '@/components/admin/HireRequestsManagement';
import ProductsManagement from '@/components/admin/ProductsManagement';
import MediaManagement from '@/components/admin/MediaManagement';
import ContentEditor from '@/components/admin/ContentEditor';
import OrdersManagement from '@/components/admin/OrdersManagement';
import EquipmentManagement from '@/components/admin/EquipmentManagement';
import SubscribersManagement from '@/components/admin/SubscribersManagement';

const AdminTabContent: React.FC = () => {
  return (
    <>
      <TabsContent value="dashboard" className="mt-0 pt-4">
        <AdminDashboard />
      </TabsContent>
      
      <TabsContent value="users" className="mt-0 pt-4">
        <UsersManagement />
      </TabsContent>

      <TabsContent value="orders" className="mt-0 pt-4">
        <OrdersManagement />
      </TabsContent>
      
      <TabsContent value="hire-requests" className="mt-0 pt-4">
        <HireRequestsManagement />
      </TabsContent>
      
      <TabsContent value="subscribers" className="mt-0 pt-4">
        <SubscribersManagement />
      </TabsContent>
      
      <TabsContent value="products" className="mt-0 pt-4">
        <ProductsManagement />
      </TabsContent>
      
      <TabsContent value="media" className="mt-0 pt-4">
        <MediaManagement />
      </TabsContent>
      
      <TabsContent value="equipment" className="mt-0 pt-4">
        <EquipmentManagement />
      </TabsContent>
      
      <TabsContent value="content" className="mt-0 pt-4">
        <ContentEditor />
      </TabsContent>
    </>
  );
};

export default AdminTabContent;
