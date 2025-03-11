
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/components/admin/Dashboard';
import ProjectsManager from '@/components/admin/projects/ProjectsManager';
import EquipmentManager from '@/components/admin/equipment/EquipmentManager';
import ServicesManager from '@/components/admin/services/ServicesManager';
import ShopManager from '@/components/admin/shop/ShopManager';
import CustomersManager from '@/components/admin/customers/CustomersManager';
import MessagesManager from '@/components/admin/messages/MessagesManager';
import SettingsManager from '@/components/admin/settings/SettingsManager';
import LoginPage from '@/components/admin/auth/LoginPage';

const Admin = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-elvis-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-elvis-pink"></div>
      </div>
    );
  }
  
  if (!user) {
    return <LoginPage />;
  }
  
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects/*" element={<ProjectsManager />} />
        <Route path="/equipment/*" element={<EquipmentManager />} />
        <Route path="/services/*" element={<ServicesManager />} />
        <Route path="/shop/*" element={<ShopManager />} />
        <Route path="/customers/*" element={<CustomersManager />} />
        <Route path="/messages/*" element={<MessagesManager />} />
        <Route path="/settings/*" element={<SettingsManager />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default Admin;
