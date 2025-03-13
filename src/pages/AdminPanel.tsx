
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { ErrorBoundary } from '@/components/admin/ErrorBoundary';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { user, profile } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [dbCheckComplete, setDbCheckComplete] = useState(false);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const [collapsed, setCollapsed] = useState(false);
  
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
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-elvis-dark text-white">
        <Navbar />
        
        <div className="pt-24 pb-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Panel</h1>
              <p className="text-white/70">Manage your site content, users, and requests</p>
            </div>
            
            {/* Show admin granter component */}
            {!profile?.role || profile.role !== 'admin' ? <AdminGranter /> : null}
            
            <div 
              className="grid grid-cols-1 lg:grid-cols-6 gap-6"
              style={{ 
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
              }}
            >
              <div className={`${collapsed ? 'lg:col-span-1' : 'lg:col-span-1'} relative`}>
                <div className="sticky top-28">
                  <Card className="bg-elvis-medium border-none overflow-hidden">
                    <div className="flex items-center justify-between pr-4 pt-4">
                      {!collapsed && (
                        <h2 className="text-lg font-semibold ml-4">Navigation</h2>
                      )}
                      <button 
                        onClick={toggleSidebar}
                        className="p-1.5 bg-elvis-dark/30 rounded-md hover:bg-elvis-dark/50 transition-colors ml-auto"
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                      >
                        {collapsed ? (
                          <ChevronRight size={16} />
                        ) : (
                          <ChevronLeft size={16} />
                        )}
                      </button>
                    </div>
                    <CardContent className={`p-3 ${collapsed ? 'hidden lg:block' : ''}`}>
                      <ErrorBoundary componentName="AdminTabs">
                        <AdminTabs />
                      </ErrorBoundary>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className={`${collapsed ? 'lg:col-span-5' : 'lg:col-span-5'}`}>
                <Card className="bg-elvis-medium border-none">
                  <CardContent className="p-6">
                    <ErrorBoundary componentName="AdminTabContent">
                      <AdminTabContent />
                    </ErrorBoundary>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </AdminAuthGuard>
  );
};

export default AdminPanel;
