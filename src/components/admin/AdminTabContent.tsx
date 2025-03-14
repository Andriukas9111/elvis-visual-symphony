
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import MediaManagement from './MediaManagement';
import EquipmentManagement from './EquipmentManagement';
import HireRequestsManagement from './HireRequestsManagement';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import SubscribersManagement from './SubscribersManagement';
import UsersManagement from './UsersManagement';
import ContentManagement from './ContentManagement';
import UnifiedAboutEditor from './about/UnifiedAboutEditor';
import HomePageEditor from './home/HomePageEditor';
import BlogEditor from './BlogEditor';
import SettingsPanel from './SettingsPanel';

const AdminTabContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  
  switch (activeTab) {
    case 'dashboard':
      return <AdminDashboard />;
    case 'media':
      return <MediaManagement />;
    case 'content':
      return <ContentManagement />;
    case 'home':
      return <HomePageEditor />;
    case 'about':
      return <UnifiedAboutEditor />;
    case 'equipment':
      return <EquipmentManagement />;
    case 'hire-requests':
      return <HireRequestsManagement />;
    case 'products':
      return <ProductsManagement />;
    case 'orders':
      return <OrdersManagement />;
    case 'subscribers':
      return <SubscribersManagement />;
    case 'users':
      return <UsersManagement />;
    case 'blog':
      return <BlogEditor />;
    case 'settings':
      return <SettingsPanel />;
    default:
      return <AdminDashboard />;
  }
};

export default AdminTabContent;
