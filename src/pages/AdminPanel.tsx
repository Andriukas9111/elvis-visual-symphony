
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminGranter from '@/components/admin/AdminGranter';
import AdminTabs from '@/components/admin/AdminTabs';
import AdminTabContent from '@/components/admin/AdminTabContent';
import { initializeAdmin } from '@/utils/makeAdmin';
import { checkDatabaseConnection } from '@/utils/databaseCheck';
import { useSearchParams } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { user, profile } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [dbCheckComplete, setDbCheckComplete] = useState(false);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Add database connection check
    const checkDatabase = async () => {
      try {
        await checkDatabaseConnection();
        setDbCheckComplete(true);
      } catch (error) {
        console.error("Error checking database:", error);
        setDbCheckComplete(true);
      }
    };
    
    checkDatabase();
    
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Try to automatically grant admin permissions when the page loads
    const runInitializeAdmin = async () => {
      try {
        await initializeAdmin();
      } catch (error) {
        console.error("Error initializing admin:", error);
      }
    };
    
    runInitializeAdmin();
    
    // Debug admin status
    if (user && profile) {
      console.log('AdminPanel - Current user:', { 
        email: user.email,
        id: user.id,
        profile: profile,
        role: profile?.role
      });
    }
  }, [user, profile]);
  
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-elvis-dark text-white">
        <Navbar />
        
        <div className="pt-32 pb-20 px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
              <p className="text-white/70">Manage your site content, users, and requests</p>
            </div>
            
            {/* Show admin granter component */}
            {!profile?.role || profile.role !== 'admin' ? <AdminGranter /> : null}
            
            <div 
              className="space-y-6"
              style={{ 
                opacity: 0,
                transform: 'translateY(20px)',
                animation: isLoaded ? 'fade-in 0.5s ease-out forwards' : 'none'
              }}
            >
              <Tabs value={activeTab} defaultValue="dashboard" className="space-y-6">
                <Card className="bg-elvis-medium border-none">
                  <CardHeader className="pb-4">
                    <AdminTabs />
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <AdminTabContent />
                  </CardContent>
                </Card>
              </Tabs>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </AdminAuthGuard>
  );
};

export default AdminPanel;
